import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importTsModule(path) {
  const source = await readFile(path, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const encoded = Buffer.from(output).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${pathToFileURL(path).href}`);
}

const modelPath = "src/lib/course-model.ts";

test("hybrid course model exposes stable slug and list normalization", async () => {
  assert.equal(existsSync(modelPath), true, "src/lib/course-model.ts must exist");
  const { createCourseSlug, splitCourseLines } = await importTsModule(modelPath);

  assert.equal(createCourseSlug("  메디컬 스킨케어  "), "메디컬-스킨케어");
  assert.deepEqual(splitCourseLines("첫 단계\n- 둘째 단계\n\n첫 단계"), ["첫 단계", "둘째 단계"]);
});

test("structured course model normalizes schedule tracks and controlled content sections", async () => {
  const {
    courseSectionTypes,
    courseTemplateKeys,
    normalizeCourseSections,
    normalizeScheduleTracks
  } = await importTsModule(modelPath);

  assert.deepEqual(courseTemplateKeys, ["certification", "practical", "career", "startup", "hobby", "instructor"]);
  assert.ok(courseSectionTypes.includes("exam"));
  assert.ok(courseSectionTypes.includes("practice"));

  assert.deepEqual(normalizeScheduleTracks([
    { id: " regular ", label: " 정규반 ", duration: " 8주 ", times: [" 오전 ", ""], weeks: [
      { label: " 1주차 ", title: " 오리엔테이션 ", items: [" 상담 ", ""] }
    ] }
  ]), [
    { id: "regular", label: "정규반", duration: "8주", times: ["오전"], items: [
      { period: "", label: "1주차", title: "오리엔테이션", items: ["상담"] }
    ] }
  ]);

  assert.deepEqual(normalizeScheduleTracks([
    { id: "startup", label: "창업 진행 절차", duration: "", times: [], items: [
      { period: " 준비 단계 ", label: " 1단계 ", title: " 상권 분석 ", items: [" 후보 지역 비교 "] }
    ] }
  ])[0].items[0], {
    period: "준비 단계",
    label: "1단계",
    title: "상권 분석",
    items: ["후보 지역 비교"]
  });

  assert.deepEqual(normalizeCourseSections([
    { id: " goals ", type: "goals", title: " 교육 목표 ", body: " ", items: ["정확한 기술", ""], images: [] },
    { id: "bad", type: "unsupported", title: "숨김", body: "", items: [], images: [] }
  ]), [
    { id: "goals", type: "goals", title: "교육 목표", body: "", items: ["정확한 기술"], images: [] }
  ]);
});

test("course curriculum helpers preserve order and group contiguous periods", async () => {
  const { groupCurriculumItemsByPeriod, moveCourseCurriculumItem } = await importTsModule(modelPath);
  const items = [
    { period: "1개월", label: "1주차", title: "기초", items: [] },
    { period: "1개월", label: "2주차", title: "실습", items: [] },
    { period: "2개월", label: "", title: "심화", items: [] }
  ];

  assert.deepEqual(groupCurriculumItemsByPeriod(items), [
    { period: "1개월", startIndex: 0, items: items.slice(0, 2) },
    { period: "2개월", startIndex: 2, items: items.slice(2) }
  ]);
  assert.deepEqual(moveCourseCurriculumItem(items, 2, 1).map((item) => item.title), ["기초", "심화", "실습"]);
  assert.equal(moveCourseCurriculumItem(items, 0, -1), items);
});

test("course group and subtype combinations are constrained", async () => {
  const {
    courseTemplatesByCategory,
    getDefaultCourseTemplateKey,
    isCourseClassificationValid
  } = await importTsModule(modelPath);

  assert.deepEqual(courseTemplatesByCategory.professional, ["career", "startup", "hobby"]);
  assert.deepEqual(courseTemplatesByCategory.practical, ["practical", "instructor"]);
  assert.deepEqual(courseTemplatesByCategory.certification, ["certification"]);
  assert.equal(getDefaultCourseTemplateKey("professional"), "career");
  assert.equal(isCourseClassificationValid("certification", "startup"), false);
  assert.equal(isCourseClassificationValid("professional", "startup"), true);
});

test("hybrid course localization validation keeps locale publication independent", async () => {
  assert.equal(existsSync(modelPath), true, "src/lib/course-model.ts must exist");
  const { buildCourseLocalizationPayload } = await importTsModule(modelPath);
  const result = buildCourseLocalizationPayload({
    certificationNote: "수료 기준 안내",
    courseId: "course-id",
    curriculumText: "기초 이론\n현장 실습",
    duration: "8주",
    imageUrl: "/assets/course.jpg",
    locale: "ko",
    overview: "과정 개요",
    pdfFileName: "교육과정.pdf",
    pdfUrl: "https://example.com/course.pdf",
    recommendedText: "취업 준비생\n현장 실무자",
    status: "published",
    summary: "과정 요약",
    title: "메디컬 스킨케어"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload.curriculumItems, ["기초 이론", "현장 실습"]);
  assert.deepEqual(result.payload.recommendedFor, ["취업 준비생", "현장 실무자"]);
  assert.equal(result.payload.locale, "ko");
  assert.equal(result.payload.status, "published");
});

test("foreign course URLs do not fall back to Korean static content when Supabase is active", async () => {
  const { getCourseFallbackPolicy } = await importTsModule(modelPath);

  assert.equal(getCourseFallbackPolicy("ko", true), "static");
  assert.equal(getCourseFallbackPolicy("en", true), "none");
  assert.equal(getCourseFallbackPolicy("zh-CN", true), "none");
  assert.equal(getCourseFallbackPolicy("zh-CN", false), "none");
});

test("course catalog migration defines normalized tables, uniqueness, grants, and RLS", async () => {
  const migrationNames = await readdir("supabase/migrations");
  const migrationName = migrationNames.find((name) => name.endsWith("_create_course_catalog.sql"));
  assert.ok(migrationName, "create_course_catalog migration must exist");
  const source = await readFile(`supabase/migrations/${migrationName}`, "utf8");

  assert.match(source, /create table if not exists public\.courses/i);
  assert.match(source, /create table if not exists public\.course_localizations/i);
  assert.match(source, /unique\s*\(course_id, locale\)/i);
  assert.match(source, /curriculum_items text\[\]/i);
  assert.match(source, /recommended_for text\[\]/i);
  assert.match(source, /pdf_url text/i);
  assert.match(source, /enable row level security/i);
  assert.match(source, /grant select on public\.courses to anon, authenticated/i);
  assert.match(source, /has_admin_role/i);
});

test("structured course migration adds template and localized JSONB modules", async () => {
  const migrationNames = await readdir("supabase/migrations");
  const sources = await Promise.all(migrationNames.map((name) => readFile(`supabase/migrations/${name}`, "utf8")));
  const source = sources.join("\n");

  assert.match(source, /template_key text/i);
  assert.match(source, /schedule_tracks jsonb/i);
  assert.match(source, /content_sections jsonb/i);
  assert.match(source, /jsonb_typeof\(schedule_tracks\)/i);
  assert.match(source, /jsonb_typeof\(content_sections\)/i);
  assert.match(source, /courses_category_template_pair_check/i);
  assert.match(source, /category_key = 'professional'[\s\S]*template_key in \('career', 'startup', 'hobby'\)/i);
});

test("public course repository provides locale-specific published reads with static fallback", async () => {
  assert.equal(existsSync("src/lib/course-repository.ts"), true, "course repository must exist");
  const source = await readFile("src/lib/course-repository.ts", "utf8");

  assert.match(source, /export async function getPublishedCourses/);
  assert.match(source, /export async function getPublishedCourseBySlug/);
  assert.match(source, /@\/lib\/supabase\/public/);
  assert.doesNotMatch(source, /@\/lib\/supabase\/server/);
  assert.match(source, /getCourses\(locale\)/);
  assert.match(source, /status[^\n]+published/);
  assert.match(source, /is_active/);
  assert.doesNotMatch(
    source,
    /error \|\| !data \|\| data\.length === 0/,
    "an empty published locale must stay empty instead of exposing static fallback courses"
  );

  const publicClientSource = await readFile("src/lib/supabase/public.ts", "utf8");
  assert.match(publicClientSource, /cache:\s*"no-store"/);
});

test("legacy course migration script is idempotent across all supported locales", async () => {
  assert.equal(existsSync("scripts/migrate-course-content.ts"), true, "legacy migration script must exist");
  const source = await readFile("scripts/migrate-course-content.ts", "utf8");

  assert.match(source, /getCourses\(locale\)/);
  assert.match(source, /migrationLocales = \["ko", "en", "es"\]/);
  assert.doesNotMatch(source, /migrationLocales = [^\n]+zh-CN/);
  assert.match(source, /upsert/);
  assert.match(source, /onConflict: "slug"/);
  assert.match(source, /onConflict: "course_id,locale"/);
  assert.match(source, /template_key/);
  assert.match(source, /schedule_tracks/);
  assert.match(source, /content_sections/);
  assert.match(source, /mapStructuredCourseContent/);
  assert.match(source, /existingLocalization/);
  assert.match(source, /schedule_tracks, content_sections/);
  assert.match(source, /existingLocalization\?\.schedule_tracks/);
  assert.match(source, /existingLocalization\?\.content_sections/);
});

test("admin course manager uses common fields, locale tabs, image and PDF uploads", async () => {
  const source = await readFile("src/components/AdminCoursesManager.tsx", "utf8");

  assert.match(source, /교육과정 생성/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /핵심 교육 내용/);
  assert.match(source, /추천 대상/);
  assert.match(source, /PDF 자료/);
  assert.match(source, /세부 유형/);
  assert.match(source, /교육 구성/);
  assert.match(source, /상세 콘텐츠/);
  assert.match(source, /선택 첨부자료/);
  assert.match(source, /교육 항목 추가/);
  assert.match(source, /섹션 추가/);
  assert.match(source, /uploadAdminContentAttachment/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /과정 다시 활성화/);
  assert.doesNotMatch(source, /adminCourseSections/);
  assert.doesNotMatch(source, /원본 URL/);
});

test("admin course actions separate common CRUD from localized content saves", async () => {
  const source = await readFile("src/app/admin/actions.ts", "utf8");
  const dataSource = await readFile("src/lib/admin-data.ts", "utf8");
  const courseLocalizationAction = source.slice(
    source.indexOf("export async function saveAdminCourseLocalization"),
    source.indexOf("export async function archiveAdminCourse")
  );

  assert.match(source, /export async function saveAdminCourse/);
  assert.match(source, /export async function saveAdminCourseLocalization/);
  assert.match(source, /export async function archiveAdminCourse/);
  assert.match(source, /export async function restoreAdminCourse/);
  assert.match(source, /export async function deleteAdminCourse/);
  assert.match(source, /공개 중인 언어 콘텐츠가 있어 삭제할 수 없습니다/);
  assert.match(source, /isCourseClassificationValid/);
  assert.match(source, /과정 그룹과 세부 유형의 조합을 확인해 주세요/);
  assert.doesNotMatch(courseLocalizationAction, /isHighRisk:\s*Boolean\(payload\.certificationNote\)/);
  assert.match(dataSource, /export async function getAdminCourses/);
  assert.match(dataSource, /course_localizations/);
});

test("course translations are handed off to the single structured course editor", async () => {
  const translationSource = await readFile("src/components/AdminTranslationsManager.tsx", "utf8");
  const coursesPageSource = await readFile("src/app/admin/courses/page.tsx", "utf8");
  const coursesManagerSource = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.doesNotMatch(translationSource, /saveAdminCourseLocalization/);
  assert.doesNotMatch(translationSource, /saveCourseTarget/);
  assert.match(translationSource, /translation-course-handoff/);
  assert.match(translationSource, /과정 번역 편집/);
  assert.match(translationSource, /\/admin\/courses\?course=/);
  assert.match(translationSource, /locale=\$\{targetLocale\}/);
  assert.match(translationSource, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(coursesPageSource, /initialCourseSlug/);
  assert.match(coursesPageSource, /initialLocale/);
  assert.match(coursesManagerSource, /initialCourseSlug/);
  assert.match(coursesManagerSource, /initialLocale/);
  assert.match(styles, /\.translation-editor-panel\s*\{[^}]*position:\s*sticky;[^}]*top:\s*20px;/s);
});

test("public course detail uses the common hybrid template and optional PDF actions", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");

  assert.match(source, /getPublishedCourseBySlug/);
  assert.match(source, /course-hybrid-overview/);
  assert.match(source, /course-hybrid-curriculum/);
  assert.match(source, /course-hybrid-audience/);
  assert.match(source, /course-hybrid-document/);
  assert.match(source, /course-structured-schedule/);
  assert.match(source, /course-structured-sections/);
  assert.match(source, /scheduleTracks/);
  assert.match(source, /contentSections/);
  assert.match(source, /download/);
  assert.match(source, /course-structured-track/);
  assert.match(source, /course-structured-item/);
  assert.match(source, /group\.period/);
  assert.match(source, /item\.label/);
  assert.match(source, /groupCurriculumItemsByPeriod/);
  assert.match(source, /itemCount/);
  assert.match(source, /fallbackItemLabel/);
  assert.doesNotMatch(source, /track\.weeks/);
  assert.doesNotMatch(source, /<details/);
  assert.doesNotMatch(source, /<summary/);
  assert.doesNotMatch(source, /originalCourseDetails/);
});

test("public course sections give single images editorial scale and remain responsive", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");
  const managerSource = await readFile("src/components/AdminCoursesManager.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /section\.images\.length === 1 \? "has-single-image" : "has-multiple-images"/);
  assert.match(styles, /\.course-structured-section-media\.has-single-image\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(styles, /\.course-structured-section-media img\s*\{[^}]*max-height:\s*440px/s);
  assert.match(styles, /\.course-structured-section-media img\s*\{[^}]*border-radius:\s*6px/s);
  assert.match(styles, /\.course-structured-section:not\(:has\(\.course-structured-section-media\)\) \.course-structured-section-copy\s*\{[^}]*max-width:\s*820px/s);
  assert.match(styles, /@media \(max-width: 860px\)[\s\S]*?\.course-structured-section-media\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(managerSource, /권장 1200×900px · 공개 페이지에서 4:3 비율로 표시/);
});

test("public course detail provides sticky section navigation for the long-form page", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /className="course-hybrid-anchor-nav"/);
  assert.match(source, /id="course-overview"/);
  assert.match(source, /id="course-schedule"/);
  assert.match(source, /id="course-details"/);
  assert.match(source, /id="course-core"/);
  assert.match(source, /id="course-completion"/);
  assert.match(styles, /\.course-hybrid-anchor-nav\s*\{[^}]*position:\s*sticky;[^}]*top:\s*106px;[^}]*overflow-x:\s*auto;/s);
  assert.match(styles, /\.course-hybrid-detail \[id\^="course-"\]\s*\{[^}]*scroll-margin-top:\s*180px;/s);
  assert.match(styles, /@media \(max-width: 860px\)[\s\S]*?@media \(max-width: 760px\)[\s\S]*?\.course-hybrid-anchor-nav\s*\{[^}]*position:\s*static;/s);
});

test("public course schedule stays expanded in compact scannable rows", async () => {
  const source = await readFile("src/app/[locale]/curriculum/[courseSlug]/page.tsx", "utf8");
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /className="course-structured-item-title"/);
  assert.match(styles, /\.course-structured-item\s*\{[^}]*grid-template-columns:\s*minmax\(72px, 0\.18fr\) minmax\(180px, 0\.62fr\) minmax\(0, 1\.2fr\);/s);
  assert.match(styles, /\.course-structured-item\s*\{[^}]*padding:\s*14px 20px;/s);
  assert.match(styles, /@media \(max-width: 860px\)[\s\S]*?\.course-structured-item\s*\{[^}]*grid-template-columns:\s*1fr;/s);
  assert.doesNotMatch(source, /<details/);
  assert.doesNotMatch(source, /<summary/);
});

test("public course long-form sections use tighter spacing and readable body copy", async () => {
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(styles, /\.course-structured-section\s*\{[^}]*gap:\s*36px;[^}]*padding:\s*32px 0;/s);
  assert.match(styles, /\.course-structured-section p\s*\{[^}]*font-size:\s*16px;[^}]*line-height:\s*1\.75;/s);
  assert.match(styles, /\.course-structured-section li\s*\{[^}]*font-size:\s*16px;/s);
});

test("curriculum landing hero keeps breathing room below the shared header", async () => {
  const styles = await readFile("src/styles/globals.css", "utf8");

  assert.match(
    styles,
    /\.curriculum-hero\s*\{[^}]*margin:\s*16px auto clamp\(54px, 5\.5vw, 78px\);/s
  );
  assert.match(
    styles,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.curriculum-hero\s*\{[^}]*margin:\s*12px auto 70px;/s
  );
});

test("Korean source curriculum refresh is explicit and preserves period and item labels", async () => {
  const source = await readFile("scripts/migrate-course-content.ts", "utf8");

  assert.match(source, /--refresh-ko-structure/);
  assert.match(source, /--inspect-ko-structure/);
  assert.match(source, /parseOriginalCurriculumGroups/);
  assert.match(source, /originalCourseDetails/);
  assert.match(source, /period:/);
  assert.match(source, /items:/);
});

test("curated Simplified Chinese course translations cover all 18 courses", async () => {
  const translationPath = "src/lib/course-translations-zh-cn.ts";
  assert.equal(existsSync(translationPath), true, "Simplified Chinese course translations must exist");
  const { courseZhCnTranslations } = await importTsModule(translationPath);
  const expectedSlugs = [
    "취업전문과정", "창업전문과정", "주말반-취미반", "얼굴축소경락", "메디컬-스킨케어", "아로마-마사지",
    "경락-마사지", "스포츠-마사지", "발-마사지", "산모-마사지", "베이비-마사지", "타이-마사지",
    "카이로프랙틱", "스웨디시", "스파-테라피", "브라질리언-왁싱", "병원-코디네이터", "피부미용사"
  ];

  assert.deepEqual(Object.keys(courseZhCnTranslations), expectedSlugs);
  for (const [slug, translation] of Object.entries(courseZhCnTranslations)) {
    assert.ok(translation.title.trim(), `${slug} needs a Chinese title`);
    assert.ok(translation.summary.trim(), `${slug} needs a Chinese summary`);
    assert.ok(translation.overview.trim(), `${slug} needs a Chinese overview`);
    assert.ok(translation.duration.trim(), `${slug} needs a Chinese duration`);
    assert.ok(translation.curriculumItems.length >= 3, `${slug} needs curriculum items`);
    assert.ok(translation.recommendedFor.length >= 1, `${slug} needs an audience`);
    assert.doesNotMatch(JSON.stringify(translation), /[가-힣]/, `${slug} contains untranslated Korean text`);
  }
});

test("retired Simplified Chinese importer cannot write or impersonate a reviewer", async () => {
  const source = await readFile("scripts/import-course-zh-cn.ts", "utf8");

  assert.match(source, /throw new Error/);
  assert.match(source, /importer is retired/);
  assert.doesNotMatch(source, /createClient|\.from\(|\.upsert\(|reviewed_by/);
});
