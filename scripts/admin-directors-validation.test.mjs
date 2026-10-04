import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin navigation exposes the international director manager", async () => {
  const source = await readFile("src/components/AdminConsole.tsx", "utf8");

  assert.match(source, /"directors"/);
  assert.match(source, /href: "\/admin\/directors"/);
  assert.match(source, /label: "국제 디렉터"/);
  assert.match(source, /UserRoundCog/);
});

test("director admin page manages Page content with director slugs", async () => {
  const pageSource = await readFile("src/app/admin/directors/page.tsx", "utf8");
  const managerSource = await readFile("src/components/AdminDirectorsManager.tsx", "utf8");

  assert.match(pageSource, /row\.type === "Page" && row\.slug\?\.startsWith\("director-"\)/);
  assert.match(pageSource, /active="directors"/);
  assert.match(managerSource, /contentType: "Page"/);
  assert.match(managerSource, /slug\.startsWith\("director-"\)/);
  assert.match(managerSource, /saveAdminContent/);
  assert.match(managerSource, /deleteAdminManagedItem/);
  assert.match(managerSource, /uploadAdminContentImage/);
});

test("public director page uses canonical Korean roster without old fallback", async () => {
  const source = await readFile("src/app/[locale]/about/instructors/page.tsx", "utf8");
  const actionsSource = await readFile("src/app/admin/actions.ts", "utf8");

  assert.match(source, /getPublishedContentSections/);
  assert.match(source, /contentType: "Page"/);
  assert.match(source, /slugPrefix: "director-"/);
  assert.match(source, /resolveDirectorRoster/);
  assert.match(source, /locale: "ko"/);
  assert.doesNotMatch(source, /t\.instructorsPage\.instructors/);
  assert.match(actionsSource, /input\.slug\.startsWith\("director-"\)/);
  assert.match(actionsSource, /locales\.forEach\(\(locale\) => revalidatePath\(`\/\$\{locale\}\/about\/instructors`\)\)/);
});

test("director create and edit form opens in a modal dialog", async () => {
  const managerSource = await readFile("src/components/AdminDirectorsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /<dialog/);
  assert.match(managerSource, /showModal/);
  assert.match(managerSource, /onCancel/);
  assert.match(managerSource, /role="dialog"/);
  assert.match(managerSource, /aria-modal="true"/);
  assert.match(managerSource, /director-modal-panel/);
  assert.match(managerSource, /director-modal-panel is-open/);
  assert.match(styleSource, /\.director-modal-panel::backdrop/);
  assert.match(styleSource, /\.director-modal-panel/);
});

test("director form uses operator-friendly fields and upload preview", async () => {
  const managerSource = await readFile("src/components/AdminDirectorsManager.tsx", "utf8");

  assert.match(managerSource, /roleTitle/);
  assert.match(managerSource, /country/);
  assert.match(managerSource, /education/);
  assert.match(managerSource, /career/);
  assert.match(managerSource, /certifications/);
  assert.match(managerSource, /사진 미리보기/);
  assert.match(managerSource, /selectedImagePreviewUrl/);
  assert.match(managerSource, /URL\.createObjectURL/);
  assert.match(managerSource, />언어</);
  assert.match(managerSource, /resolveTranslationEditor/);
  assert.match(managerSource, /value="reviewed"/);
  assert.doesNotMatch(managerSource, />Slug</);
  assert.doesNotMatch(managerSource, />출처 URL</);
  assert.doesNotMatch(managerSource, />사진 URL</);
});

test("unsectioned legacy profile body is not shoved into career", async () => {
  const managerSource = await readFile("src/components/AdminDirectorsManager.tsx", "utf8");

  assert.match(managerSource, /function parseProfileSections/);
  assert.doesNotMatch(managerSource, /career: getProfileSection\(body, "경력"\) \|\| body\.trim\(\)/);
  assert.match(managerSource, /legacyProfileMemo/);
});

test("profile section parser matches real newlines instead of escaped newline text", async () => {
  const managerSource = await readFile("src/components/AdminDirectorsManager.tsx", "utf8");

  assert.match(managerSource, /const pattern = new RegExp\(`\$\{label\}\\\\n/);
  assert.doesNotMatch(managerSource, /const pattern = new RegExp\(`\$\{label\}\\\\\\\\n/);
});

test("public director cards render without profile popups", async () => {
  const source = await readFile("src/app/[locale]/about/instructors/page.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /instructor-card-content/);
  assert.doesNotMatch(source, /href=\{`#\$\{modalId\}`\}/);
  assert.doesNotMatch(source, /instructor-modal/);
  assert.doesNotMatch(source, /role="dialog"/);
  assert.doesNotMatch(source, /DirectorProfileTabs/);
  assert.doesNotMatch(source, /profileBody: director\.body/);
  assert.match(styleSource, /\.instructor-card-content/);
  assert.doesNotMatch(styleSource, /\.instructor-modal/);
});
