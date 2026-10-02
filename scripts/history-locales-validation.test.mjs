import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const source = await readFile("src/lib/history.ts", "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText;
const { historyByYear, historyHighlights, localizeHistoryItem } = await import(
  `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`
);
const events = historyByYear.flatMap((group) => group.items);

test("all original events, dates, ordering and Korean/Chinese text remain intact", () => {
  const originalItem = ({ date, title, zhTitle }) => ({ date, title, zhTitle });
  const original = {
    historyByYear: historyByYear.map(({ year, items }) => ({ year, items: items.map(originalItem) })),
    historyHighlights: historyHighlights.map(originalItem)
  };
  assert.equal(events.length, 140);
  assert.equal(historyHighlights.length, 4);
  assert.equal(createHash("sha256").update(JSON.stringify(original)).digest("hex"),
    "9a223836fb5728868f4cc0e9fa73002d28fa763f72cd9ccf4c911c762240912a");
});

test("every timeline event and highlight resolves to the requested language", () => {
  for (const item of [...events, ...historyHighlights]) {
    for (const [locale, field] of [["ko", "title"], ["en", "enTitle"], ["es", "esTitle"], ["zh-CN", "zhTitle"]]) {
      const localized = localizeHistoryItem(item, locale);
      assert.ok(item[field]?.trim(), `${locale}: ${item.title}`);
      assert.equal(localized.title, item[field]);
      if (locale === "en" || locale === "es") {
        assert.doesNotMatch(localized.title + localized.date, /[가-힣\u3400-\u9fff]/u);
        assert.notEqual(localized.title, item.title);
      }
    }
  }
});

test("dates localize both zero-padded and single-digit source months", () => {
  const item = events[0];
  assert.equal(localizeHistoryItem(item, "ko").date, "2025년 03월");
  assert.equal(localizeHistoryItem(item, "zh-CN").date, "2025年03月");
  assert.equal(localizeHistoryItem(item, "en").date, "March 2025");
  assert.equal(localizeHistoryItem(item, "es").date, "marzo de 2025");
  assert.equal(localizeHistoryItem({ ...item, date: "2023년 5월" }, "en").date, "May 2023");
  assert.equal(localizeHistoryItem({ ...item, date: "2023년 5월" }, "es").date, "mayo de 2023");
});

test("highlights use the same translations as their corresponding timeline events", () => {
  for (const highlight of historyHighlights) {
    const event = events.find((item) => item.date === highlight.date && item.title === highlight.title);
    assert.ok(event);
    for (const locale of ["ko", "en", "es", "zh-CN"]) {
      assert.deepEqual(localizeHistoryItem(highlight, locale), localizeHistoryItem(event, locale));
    }
  }
});

test("the actual page renders all 144 entries in English and Spanish without Korean fallback", async () => {
  const pageSource = await readFile("src/app/[locale]/about/history/page.tsx", "utf8");
  const compiled = ts.transpileModule(pageSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
    reportDiagnostics: true
  });
  assert.equal(compiled.diagnostics.length, 0);
  const exports = {};
  const nativeRequire = createRequire(import.meta.url);
  runInNewContext(compiled.outputText, {
    exports,
    require(name) {
      if (name === "@/lib/history") return { historyByYear, historyHighlights, localizeHistoryItem };
      if (name === "@/lib/content") return { getCopy: () => ({ historyPage: {} }) };
      if (name === "@/lib/seo") return {};
      if (name === "@/components/AboutSubnav") return { AboutSubnav: () => null };
      if (name === "@/components/SiteShell") return { PageIntro: () => null };
      return nativeRequire(name);
    }
  });
  for (const locale of ["en", "es"]) {
    const html = renderToStaticMarkup(await exports.default({ params: Promise.resolve({ locale }) }));
    assert.doesNotMatch(html, /[가-힣\u3400-\u9fff]/u);
    assert.equal((html.match(/<article\b/g) || []).length, 144);
    assert.equal((html.match(/<time>/g) || []).length, 144);
    assert.match(html, new RegExp(locale === "en" ? "March 2025" : "marzo de 2025"));
  }
});
