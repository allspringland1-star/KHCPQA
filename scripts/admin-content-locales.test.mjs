import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadModel() {
  const source = await readFile("src/lib/admin-content-locales.ts", "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

test("translation copies preserve source and slug, clear id, and start as draft in every target language", async () => {
  const { createTranslationDraft } = await loadModel();
  const source = Object.freeze({ id: "source-id", locale: "ko", slug: "notice-example", status: "published", title: "원문", imageUrl: "/photo.jpg" });
  for (const locale of ["en", "es", "zh-CN"]) {
    const draft = createTranslationDraft(source, locale, [source]);
    assert.equal(draft.id, undefined);
    assert.equal(draft.slug, source.slug);
    assert.equal(draft.locale, locale);
    assert.equal(draft.status, "draft");
    assert.equal(draft.imageUrl, source.imageUrl);
  }
  assert.equal(source.status, "published");
  assert.equal(source.id, "source-id");
  assert.equal(source.locale, "ko");
});

test("existing target language and source language cannot be overwritten by copying", async () => {
  const { createTranslationDraft } = await loadModel();
  const source = { locale: "ko", slug: "director-one", status: "published" };
  assert.equal(createTranslationDraft(source, "ko", [source]), null);
  assert.equal(createTranslationDraft(source, "en", [source, { ...source, locale: "en" }]), null);
  assert.equal(createTranslationDraft(source, "unsupported", [source]), null);
});

test("both editors guard new translations at save and lock existing language identity", async () => {
  for (const file of ["AdminCommunityManager", "AdminDirectorsManager"]) {
    const source = await readFile(`src/components/${file}.tsx`, "utf8");
    assert.match(source, /preventOverwrite: !selectedItem/);
    assert.match(source, /createTranslationDraft\(editor, locale, items\)/);
    assert.match(source, /setSelectedItem\(null\)/);
    assert.match(source, /<select disabled=.*updateEditor\("locale"/);
    assert.match(source, /selectedItem\?\.status !== "reviewed"/);
  }
  const nav = await readFile("src/components/AdminConsole.tsx", "utf8");
  assert.match(nav, /href: "\/admin\/translations"/);
});
