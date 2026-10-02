import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const cache = new Map();
function loadTs(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  new Function("require", "module", "exports", source)((name) => {
    if (name.startsWith("@/")) return loadTs(`src/${name.slice(2)}.ts`);
    if (name.startsWith(".")) return loadTs(path.resolve(path.dirname(filename), `${name}.ts`));
    return require(name);
  }, module, module.exports);
  return module.exports;
}

test("all language greetings include the same leaders and distinguish the two chairmen", () => {
  const { getCopy } = loadTs("src/lib/content.ts");
  const source = getCopy("ko").greetingPage.greetings;
  for (const locale of ["en", "es", "zh-CN"]) {
    const greetings = getCopy(locale).greetingPage.greetings;
    assert.deepEqual(greetings.map(item => item.imageUrl), source.map(item => item.imageUrl), locale);
    assert.equal(greetings[0].paragraphs.length, source[0].paragraphs.length);
    assert.equal(greetings[1].paragraphs.length, source[1].paragraphs.length);
    assert.notEqual(greetings[0].role, greetings[1].role);
  }
});

test("foreign director pages represent the same four directors as the Korean source", () => {
  const { getCopy } = loadTs("src/lib/content.ts");
  const source = getCopy("ko").instructorsPage.instructors;
  for (const locale of ["en", "es", "zh-CN"]) {
    const page = getCopy(locale).instructorsPage;
    assert.deepEqual(page.instructors.map(item => item.imageUrl), source.map(item => item.imageUrl), locale);
    assert.doesNotMatch(page.title, /Instructor|讲师/i);
    assert.doesNotMatch(getCopy(locale).aboutSubnav.find(item => item.key === "instructors").title, /Instructor|讲师/i);
  }
});

test("Chinese public pages use Chinese copy instead of the Korean fallback", () => {
  const { getCopy } = loadTs("src/lib/content.ts");
  const copy = getCopy("zh-CN");
  assert.equal(copy.nav.about, "协会介绍");
  for (const section of ["home", "about", "greetingPage", "instructorsPage", "historyPage", "organizationPage", "curriculumPage", "courseDetail", "activitiesPage", "contact", "legal", "partnerInquiry", "login", "signup", "account", "curriculumCatalog"]) {
    assert.notDeepEqual(copy[section], getCopy("ko")[section], section);
    assert.doesNotMatch(JSON.stringify(copy[section]), /[가-힣]/, section);
  }
});

test("Chinese pages have localized metadata and public alternates", () => {
  const { buildLocaleMetadata } = loadTs("src/lib/seo.ts");
  const meta = buildLocaleMetadata({ locale: "zh-CN", path: "about", title: "协会介绍 | KAHC" });
  assert.equal(meta.title, "协会介绍 | KAHC");
  assert.equal(meta.alternates.languages["zh-CN"], "/zh-CN/about");
  assert.equal(meta.robots, undefined);
  assert.equal(buildLocaleMetadata({ locale: "zh-CN", path: "account", noIndex: true }).robots.index, false);
});

test("Chinese member forms have country labels", () => {
  const { countryOptions, getCountryLabel } = loadTs("src/lib/countries.ts");
  assert.equal(getCountryLabel("Korea", "zh-CN"), "韩国");
  for (const option of countryOptions) assert.ok(option.labels["zh-CN"]);
});

test("Chinese course choices cover the source courses without Korean label fallback", () => {
  const { getCourses, getActivityGroups, getActivityPosts } = loadTs("src/lib/content.ts");
  const courses = getCourses("zh-CN");
  assert.equal(courses.length, getCourses("ko").length);
  for (const course of courses) {
    assert.doesNotMatch([course.title, course.category, course.summary, course.audience].join(" "), /[가-힣]/);
  }
  for (const group of getActivityGroups("zh-CN")) {
    assert.doesNotMatch([group.title, group.source, group.summary].join(" "), /[가-힣]/);
    assert.deepEqual(getActivityPosts("zh-CN", group.key), []);
  }
});

test("Chinese transit display preserves identifiers and route numbers", () => {
  const { localizeChineseLocation } = loadTs("src/lib/contact-zh-cn.ts");
  const localized = localizeChineseLocation({ id: "gangnam", name: "강남SMC아카데미", station: "구로디지털단지역", roadAddress: "서울", lotAddress: "서울", parking: "건물 주차장", subway: [], busStops: [{ stop: "구로디지털단지역 (17013)", lines: ["간선 150, 505, 507, N65(심야)"] }], phone: "02-867-2280" });
  assert.equal(localized.id, "gangnam");
  assert.equal(localized.phone, "02-867-2280");
  assert.equal(localized.busStops[0].stop, "九老数码园区站 (17013)");
  assert.equal(localized.busStops[0].lines[0], "干线 150, 505, 507, N65(夜间)");
});
