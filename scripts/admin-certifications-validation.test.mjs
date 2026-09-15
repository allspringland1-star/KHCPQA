import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

const {
  buildAdminCertificationPayload,
  normalizeCertificateTemplate,
  formatAdminCertificationDate,
  getAdminCertificationStatusLabel
} = await importTsModule("src/lib/admin-certifications.ts");

test("normalizeCertificateTemplate preserves uploaded background and layout controls", () => {
  const result = normalizeCertificateTemplate({
    backgroundImageUrl: " https://example.com/certificate.png ",
    name: " 기본 자격증 ",
    status: "published",
    layout: {
      holderName: { x: 450, y: 520, fontSize: 34, color: "#123abc", align: "middle" },
      courseTitle: { x: 450, y: 620, fontSize: 28, color: "#222222", align: "middle" }
    }
  });

  assert.equal(result.name, "기본 자격증");
  assert.equal(result.backgroundImageUrl, "https://example.com/certificate.png");
  assert.equal(result.status, "published");
  assert.deepEqual(result.layout.holderName, {
    color: "#123abc",
    fontSize: 34,
    fontWeight: 760,
    x: 450,
    y: 520
  });
  assert.equal(result.layout.certificateNumber.x, 325);
});

test("buildAdminCertificationPayload normalizes required certificate fields", () => {
  const result = buildAdminCertificationPayload({
    adminNote: " 운영 확인 ",
    certificateNumber: " SMC-2026-001 ",
    courseTitle: " 피부미용사 국가자격증 ",
    expiresAt: "2028-05-18",
    issuedAt: "2026-05-18",
    status: "issued",
    userEmail: " Member@Example.COM ",
    verificationCode: ""
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.payload, {
    certificateNumber: "SMC-2026-001",
    courseTitle: "피부미용사 국가자격증",
    expiresAt: "2028-05-18",
    issuedAt: "2026-05-18",
    adminNote: "운영 확인",
    status: "issued",
    userEmail: "member@example.com",
    verificationCode: "SMC-2026-001"
  });
});

test("buildAdminCertificationPayload rejects missing and invalid certificate fields", () => {
  const result = buildAdminCertificationPayload({
    adminNote: "",
    certificateNumber: "",
    courseTitle: "",
    expiresAt: "2026/05/19",
    issuedAt: "2026/05/18",
    status: "active",
    userEmail: "not-email",
    verificationCode: ""
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /회원 이메일/);
  assert.match(result.message, /자격명/);
  assert.match(result.message, /자격번호/);
  assert.match(result.message, /발급일/);
  assert.match(result.message, /만료일/);
  assert.match(result.message, /상태/);
});

test("certification status labels are operator friendly", () => {
  assert.equal(getAdminCertificationStatusLabel("issued"), "발급됨");
  assert.equal(getAdminCertificationStatusLabel("expired"), "만료됨");
  assert.equal(getAdminCertificationStatusLabel("revoked"), "취소됨");
});

test("formatAdminCertificationDate keeps optional expiry display scannable", () => {
  assert.equal(formatAdminCertificationDate(""), "-");
  assert.equal(formatAdminCertificationDate("2028-05-18"), "2028. 05. 18.");
});

test("AdminCertificationsManager connects the new certification form to the save action", async () => {
  const pageSource = await readFile("src/app/admin/certifications/page.tsx", "utf8");
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");

  assert.match(pageSource, /AdminCertificationsManager/);
  assert.match(pageSource, /getAdminCertificateTemplate/);
  assert.match(pageSource, /certificateTemplate=\{certificateTemplate\}/);
  assert.match(pageSource, /admin-certifications-panel/);
  assert.match(pageSource, /getAdminCourses/);
  assert.match(pageSource, /course\.isActive/);
  assert.match(pageSource, /localization\.locale === "ko"/);
  assert.match(pageSource, /getPublishedCourses\("ko"\)/);
  assert.match(pageSource, /courseOptions=\{courseOptions\}/);
  assert.match(managerSource, /saveAdminCertification/);
  assert.match(managerSource, /새 자격 등록/);
  assert.match(managerSource, /name="userEmail"/);
  assert.match(managerSource, /name="courseTitle"/);
  assert.match(managerSource, /자격명을 선택하세요/);
  assert.match(managerSource, /selectableCourseOptions\.map/);
  assert.match(managerSource, /name="certificateNumber"/);
  assert.match(managerSource, /name="issuedAt"/);
  assert.match(managerSource, /name="verificationCode"/);
});

test("AdminCertificationsManager exposes certificate template upload and layout settings", async () => {
  const migrationSource = await readFile("supabase/migrations/202609140001_create_certificate_templates.sql", "utf8");
  const actionSource = await readFile("src/app/admin/actions.ts", "utf8");
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const dataSource = await readFile("src/lib/admin-data.ts", "utf8");

  assert.match(migrationSource, /create table if not exists public\.certificate_templates/);
  assert.match(migrationSource, /layout_json jsonb not null/);
  assert.match(migrationSource, /certificate_templates_single_published_idx/);
  assert.match(migrationSource, /certification_manager/);
  assert.match(actionSource, /uploadAdminCertificateTemplateImage/);
  assert.match(actionSource, /saveAdminCertificateTemplate/);
  assert.match(dataSource, /getAdminCertificateTemplate/);
  assert.match(managerSource, /자격증 디자인/);
  assert.match(managerSource, /name="certificateTemplateImage"/);
  assert.match(managerSource, /handleTemplateImageChange/);
  assert.match(managerSource, /new FileReader\(\)/);
  assert.match(managerSource, /reader\.readAsDataURL\(file\)/);
  assert.match(managerSource, /recommendedTemplateImage/);
  assert.match(managerSource, /naturalWidth/);
  assert.match(managerSource, /naturalHeight/);
  assert.match(managerSource, /sizeLabel/);
  assert.match(managerSource, /권장 규격은/);
  assert.match(managerSource, /선택됨\. 적용 저장을 누르면 업로드됩니다\./);
  assert.match(managerSource, /배경 이미지 선택/);
  assert.match(managerSource, /이미지 변경/);
  assert.match(managerSource, /didUploadImage/);
  assert.match(managerSource, /자격증 디자인 이미지와 설정이 저장되었습니다\./);
  assert.doesNotMatch(managerSource, /setTemplateImageMessage\(uploadResult\.message\)/);
  assert.match(managerSource, /certificateTemplate=\{previewTemplateValue\}/);
  assert.match(managerSource, /선택한 이미지 미리보기/);
  assert.match(managerSource, /ref=\{templateImageInputRef\}/);
  assert.match(managerSource, /admin-certificate-template-upload-status/);
  assert.match(managerSource, /templateLayoutFieldLabels/);
  assert.match(managerSource, /기본 위치로 초기화/);
});

test("certificate template panel shows the generated design preview inline", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const imageSource = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /CertificateInlinePreview/);
  assert.match(managerSource, /admin-certificate-template-preview-frame/);
  assert.match(imageSource, /export function CertificateInlinePreview/);
  assert.match(imageSource, /certificate-inline-preview-image/);
  assert.match(imageSource, /selectedField/);
  assert.match(imageSource, /certificate-inline-preview-guide/);
  assert.match(styleSource, /\.admin-certificate-template-preview-frame/);
  assert.match(styleSource, /\.certificate-inline-preview-image/);
  assert.match(styleSource, /\.certificate-inline-preview-guide/);
  assert.match(styleSource, /\.admin-certificate-template-upload span/);
  assert.match(styleSource, /\.admin-certificate-template-upload-status/);
  assert.match(styleSource, /\.admin-certificate-template-upload-status span/);
});

test("certificate template layout controls update the preview workspace before saving", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /admin-certificate-template-workspace/);
  assert.match(managerSource, /실시간 미리보기/);
  assert.match(managerSource, /type="range"/);
  assert.match(managerSource, /admin-certificate-template-stepper/);
  assert.match(managerSource, /nudgeTemplateLayoutField\(key, "x"/);
  assert.match(managerSource, /nudgeTemplateLayoutField\(key, "y"/);
  assert.match(managerSource, /nudgeTemplateLayoutField\(key, "fontSize"/);
  assert.match(managerSource, /selectedField=\{selectedTemplateField\}/);
  assert.match(managerSource, /selectedFieldLabel=\{templateLayoutFieldLabels\[selectedTemplateField\]\}/);
  assert.match(managerSource, /useTemplateLayout/);
  assert.match(managerSource, /updateTemplateLayoutField\(key, "x"/);
  assert.match(managerSource, /updateTemplateLayoutField\(key, "y"/);
  assert.match(managerSource, /const nextTemplate = \{\s+\.\.\.templateValue/s);
  assert.match(managerSource, /saveAdminCertificateTemplate\(nextTemplate\)/);
  assert.match(styleSource, /\.admin-certificate-template-preview\s*\{[^}]*position: sticky/s);
  assert.match(styleSource, /\.admin-certificate-template-field-range/);
  assert.match(styleSource, /\.admin-certificate-template-grid\s*\{[^}]*align-items: start/s);
  assert.match(styleSource, /grid-template-columns: minmax\(340px, 0\.42fr\) minmax\(0, 1fr\)/);
  assert.match(styleSource, /max-height: 520px/);
  assert.match(styleSource, /\.admin-certificate-template-workspace\s*\{[^}]*align-content: start/s);
  assert.match(styleSource, /\.admin-certificate-template-field-tabs\s*\{[^}]*align-self: start/s);
  assert.match(styleSource, /\.certificate-inline-preview-guide/);
  assert.match(styleSource, /\.certificate-inline-preview-guide::before/);
  assert.match(styleSource, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(styleSource, /min-height: 28px/);
});

test("certificate template editor focuses one field while keeping every field selectable", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /selectedTemplateField/);
  assert.match(managerSource, /admin-certificate-template-field-tabs/);
  assert.match(managerSource, /aria-pressed=\{selectedTemplateField === key\}/);
  assert.match(managerSource, /templateLayoutFieldKeys\.filter\(\(key\) => key === selectedTemplateField\)/);
  assert.match(styleSource, /\.admin-certificate-template-field-tabs/);
  assert.match(styleSource, /\.admin-certificate-template-field-tabs button\.is-active/);
});

test("certificate template editor owns validation and coordinate controls", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /className="admin-certificate-template-panel"/);
  assert.match(managerSource, /noValidate/);
  assert.match(managerSource, /onSubmit=\{handleTemplateSubmit\}/);
  assert.match(managerSource, /hasUnsavedTemplateChanges/);
  assert.match(managerSource, /저장되지 않은 변경/);
  assert.match(managerSource, /admin-certificate-template-quiet-action/);
  assert.match(managerSource, /updateTemplateLayoutField\(key, "x"/);
  assert.match(managerSource, /updateTemplateLayoutField\(key, "y"/);
  assert.doesNotMatch(managerSource, /templateAlignOptions/);
  assert.doesNotMatch(managerSource, /admin-certificate-template-align-options/);
  assert.doesNotMatch(managerSource, /field\.align/);
  assert.doesNotMatch(managerSource, /updateTemplateLayoutField\(key, "align"/);
  assert.doesNotMatch(styleSource, /\.admin-certificate-template-align-options/);
});

test("certificate template save reports a migration hint when the database table is missing", async () => {
  const actionSource = await readFile("src/app/admin/actions.ts", "utf8");

  assert.match(actionSource, /formatCertificateTemplateSaveError/);
  assert.match(actionSource, /certificate_templates/);
  assert.match(actionSource, /schema cache/);
  assert.match(actionSource, /202609140001_create_certificate_templates\.sql/);
  assert.match(actionSource, /archiveError/);
  assert.match(actionSource, /formatCertificateTemplateSaveError\(archiveError\)/);
  assert.match(actionSource, /formatCertificateTemplateSaveError\(error\)/);
  assert.doesNotMatch(actionSource, /return \{ ok: false, message: archiveError\.message \};/);
});

test("certificate template save shows a blocking loading layer while applying changes", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /isTemplateSaving/);
  assert.match(managerSource, /setIsTemplateSaving\(true\)/);
  assert.match(managerSource, /setIsTemplateSaving\(false\)/);
  assert.match(managerSource, /admin-certificate-template-saving-layer/);
  assert.match(managerSource, /role="status"/);
  assert.match(managerSource, /aria-busy=\{isTemplateSaving\}/);
  assert.match(managerSource, /저장 중입니다/);
  assert.match(managerSource, /disabled=\{isTemplateSaving \|\| isTemplatePending\}/);
  assert.match(styleSource, /\.admin-certificate-template-panel\s*\{[^}]*position: relative/s);
  assert.match(styleSource, /\.admin-certificate-template-saving-layer/);
  assert.match(styleSource, /\.admin-certificate-template-saving-spinner/);
  assert.match(styleSource, /@keyframes admin-certificate-template-spin/);
});

test("AdminCertificationsManager can open existing certifications for editing", async () => {
  const dataSource = await readFile("src/lib/admin-data.ts", "utf8");
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");

  assert.match(dataSource, /verification_code/);
  assert.match(dataSource, /expires_at/);
  assert.match(dataSource, /admin_note/);
  assert.match(dataSource, /userEmail/);
  assert.match(dataSource, /issuedAtRaw/);
  assert.match(managerSource, /name="expiresAt"/);
  assert.match(managerSource, /name="adminNote"/);
  assert.match(managerSource, /만료일/);
  assert.match(managerSource, /expiresAtDisplay/);
  assert.match(managerSource, /기존 저장값/);
  assert.match(managerSource, /type Mode = "create" \| "update"/);
  assert.match(managerSource, /openEditModal/);
  assert.match(managerSource, /자격 수정/);
  assert.match(managerSource, /자격 수정 저장/);
});

test("AdminCertificationsManager keeps the certification list scannable", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /admin-certifications-toolbar/);
  assert.match(managerSource, /admin-certifications-summary/);
  assert.match(managerSource, /className="console-table admin-certifications-table"/);
  assert.match(managerSource, /admin-certifications-col-period/);
  assert.match(managerSource, /<th>기간<\/th>/);
  assert.doesNotMatch(managerSource, /<th>발급일<\/th>/);
  assert.doesNotMatch(managerSource, /<th>만료일<\/th>/);
  assert.match(managerSource, /className="admin-certification-date-cell"/);
  assert.match(managerSource, /className="admin-certifications-action-cell"/);
  assert.match(managerSource, /<td colSpan=\{6\}>/);
  assert.match(managerSource, /admin-certifications-status-filter/);
  assert.match(managerSource, /admin-certification-number/);
  assert.match(managerSource, /admin-certification-user-cell/);
  assert.match(managerSource, /copyText/);
  assert.match(managerSource, /navigator\.clipboard\.writeText/);
  assert.match(managerSource, /자격번호 복사/);
  assert.match(managerSource, /검증 코드 복사/);
  assert.match(styleSource, /\.admin-certifications-panel/);
  assert.match(styleSource, /padding: 14px 26px 28px/);
  assert.match(styleSource, /\.admin-certifications-filter-bar/);
  assert.match(styleSource, /grid-template-columns: repeat\(4, minmax\(112px, 1fr\)\)/);
  assert.match(styleSource, /min-height: 58px/);
  assert.match(styleSource, /linear-gradient\(180deg, #fff 0%, #fcfbff 100%\)/);
  assert.match(styleSource, /grid-template-columns: minmax\(300px, 1fr\) auto/);
  assert.match(styleSource, /\.admin-certifications-col-period/);
  assert.match(styleSource, /\.admin-certification-date-cell/);
  assert.match(styleSource, /min-width: 1040px/);
  assert.match(styleSource, /table-layout: fixed/);
  assert.match(styleSource, /\.admin-certifications-action-cell/);
  assert.match(styleSource, /overflow: visible/);
  assert.match(styleSource, /\.admin-certifications-status-filter button\.is-active/);
  assert.match(styleSource, /\.admin-certifications-new-button/);
  assert.match(styleSource, /\.admin-certification-number/);
  assert.match(styleSource, /\.admin-certification-copy-button/);
});

test("admin certification rows can open the generated certificate image", async () => {
  const managerSource = await readFile("src/components/AdminCertificationsManager.tsx", "utf8");
  const imageSource = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(managerSource, /CertificateImageViewer/);
  assert.match(managerSource, /holderName=\{certification\.user\}/);
  assert.match(managerSource, /title: certification\.course/);
  assert.match(imageSource, /export function CertificateImageViewer/);
  assert.match(imageSource, /자격증 이미지 보기/);
  assert.match(imageSource, /자격증 미리보기/);
  assert.match(imageSource, /buildCertificateSvg/);
  assert.match(imageSource, /CertificateDownloadActions/);
  assert.match(styleSource, /\.certificate-preview-backdrop/);
  assert.match(styleSource, /\.certificate-preview-dialog/);
  assert.match(styleSource, /\.certificate-preview-image/);
});

test("certificate preview modal stays above admin page controls", async () => {
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(styleSource, /\.certificate-preview-backdrop\s*\{[^}]*position: fixed[^}]*z-index: 1500/s);
  assert.match(styleSource, /\.certificate-preview-dialog\s*\{[^}]*position: relative[^}]*z-index: 1501/s);
});
