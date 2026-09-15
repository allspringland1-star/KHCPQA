import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("account certification download component builds a single PNG image download", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");

  assert.match(source, /export function buildCertificateSvg/);
  assert.match(source, /export async function downloadCertificatePng/);
  assert.match(source, /canvas\.toBlob/);
  assert.match(source, /image\/svg\+xml/);
  assert.match(source, /image\/png/);
  assert.match(source, /certificateLogoPath = "\/assets\/brand\/khcpqa-logo-mark\.png"/);
  assert.match(source, /loadCertificateLogoDataUrl/);
  assert.match(source, /<image href=/);
  assert.match(source, /검증코드/);
  assert.match(source, /자격증/);
  assert.match(source, /Certificate of qualification/);
  assert.doesNotMatch(source, /발급됨/);
  assert.doesNotMatch(source, />상태</);
  assert.doesNotMatch(source, /data\.status/);
  assert.match(source, /splitText/);
  assert.match(source, /renderTextLines/);
  assert.match(source, /certificateTemplate/);
  assert.match(source, /drawCertificateTemplateBackground/);
  assert.match(source, /한국건강관리사자격협회/);
  assert.doesNotMatch(source, /<text x="492" y="1150"/);
  assert.doesNotMatch(source, /textAnchor/);
  assert.match(source, /context\.textAlign = "left"/);
  assert.match(source, /이미지 다운로드/);
  assert.doesNotMatch(source, /export async function downloadCertificateSvg/);
  assert.doesNotMatch(source, /<span>SVG<\/span>/);
  assert.doesNotMatch(source, /<span>PNG<\/span>/);
});

test("certificate download accepts managed template settings with fallback", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");
  const accountDataSource = await readFile("src/lib/account-data.ts", "utf8");
  const overviewPage = await readFile("src/app/[locale]/account/page.tsx", "utf8");
  const certificationsPage = await readFile("src/app/[locale]/account/certifications/page.tsx", "utf8");

  assert.match(accountDataSource, /getPublishedCertificateTemplate/);
  assert.match(accountDataSource, /certificateTemplate/);
  assert.match(source, /CertificateTemplate/);
  assert.match(source, /backgroundImageUrl/);
  assert.match(source, /layout\.holderName/);
  assert.match(source, /buildManagedCertificateSvg/);
  assert.match(source, /loadExternalImageDataUrl/);
  assert.match(source, /fetch\(src, \{ cache: "no-store" \}\)/);
  assert.match(source, /readBlobAsDataUrl/);
  assert.match(source, /embeddedTemplate/);
  assert.match(source, /preserveAspectRatio="xMidYMid meet"/);
  assert.match(source, /Math\.min\(certificateSize\.width \/ background\.naturalWidth, certificateSize\.height \/ background\.naturalHeight\)/);
  assert.match(source, /context\.drawImage\(background, x, y, width, height\)/);
  assert.doesNotMatch(source, /context\.drawImage\(background, 0, 0, certificateSize\.width, certificateSize\.height\)/);
  assert.match(source, /buildCertificateSvg\(certificate, holderName, logoDataUrl\)/);
  assert.match(overviewPage, /certificateTemplate=\{accountData\.certificateTemplate\}/);
  assert.match(certificationsPage, /certificateTemplate=\{accountData\.certificateTemplate\}/);
});

test("admin certificate preview applies template coordinates even without an uploaded background", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");

  assert.match(source, /export function buildTemplatePreviewCertificateSvg/);
  assert.match(source, /buildCertificatePreviewDataUrl\([^)]*useTemplateLayout/s);
  assert.match(source, /useTemplateLayout \|\| embeddedTemplate\.backgroundImageUrl/);
  assert.match(source, /key=\{previewSignature\}/);
  assert.match(source, /useTemplateLayout/);
  assert.doesNotMatch(source, /certificateTemplate\?\.backgroundImageUrl\s*\?\s*buildManagedCertificateSvg\(certificate, holderName, certificateTemplate\)\s*:\s*buildCertificateSvg\(certificate, holderName, logoDataUrl\)/s);
});

test("certificate PNG download applies saved template coordinates without uploaded background", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");

  assert.match(source, /downloadCertificateSvgAsPng/);
  assert.match(source, /buildTemplatePreviewCertificateSvg\(certificate, holderName, certificateTemplate, logoDataUrl\)/);
  assert.match(source, /if \(certificateTemplate\) \{/);
  assert.match(source, /await downloadCertificateSvgAsPng\(certificate, svg\)/);
  assert.doesNotMatch(source, /const svg = buildCertificateSvg\(certificate, holderName, logoDataUrl\);/);
});

test("certificate SVG escapes the association name for valid XML rendering", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");

  assert.match(source, /Health &amp; Beauty Certification/);
  assert.doesNotMatch(source, />The Korea Association for Health & Beauty Certification</);
});

test("my page and certification detail page expose certificate downloads", async () => {
  const overviewPage = await readFile("src/app/[locale]/account/page.tsx", "utf8");
  const certificationsPage = await readFile("src/app/[locale]/account/certifications/page.tsx", "utf8");

  assert.match(overviewPage, /CertificateDownloadActions/);
  assert.match(overviewPage, /variant="compact"/);
  assert.match(overviewPage, /holderName=\{accountData\.profileForm\.name\}/);
  assert.match(certificationsPage, /CertificateDownloadActions/);
  assert.match(certificationsPage, /holderName=\{accountData\.profileForm\.name\}/);
});

test("certificate download buttons have dedicated layout styles", async () => {
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(styleSource, /\.certificate-download-actions/);
  assert.match(styleSource, /\.certificate-download-actions\.is-compact/);
  assert.match(styleSource, /\.certificate-download-actions\.is-full/);
  assert.match(styleSource, /\.certificate-download-message/);
  assert.match(styleSource, /grid-template-columns: minmax\(0, 1fr\) minmax\(170px, 0\.85fr\) auto auto/);
});

test("certificate preview modal is portaled above admin stacking contexts", async () => {
  const source = await readFile("src/components/CertificateDownloadActions.tsx", "utf8");
  const styleSource = await readFile("src/styles/globals.css", "utf8");

  assert.match(source, /import \{ createPortal \} from "react-dom"/);
  assert.match(source, /createPortal\(previewDialog, document\.body\)/);
  assert.match(styleSource, /\.certificate-preview-backdrop[\s\S]*position: fixed/);
  assert.match(styleSource, /\.certificate-preview-backdrop[\s\S]*z-index: 1500/);
});

test("account certificate statuses are localized for member-facing pages", async () => {
  const accountDataSource = await readFile("src/lib/account-data.ts", "utf8");

  assert.match(accountDataSource, /certificateStatusLabels/);
  assert.match(accountDataSource, /issued: "발급됨"/);
  assert.match(accountDataSource, /status: certificateStatusLabels\[row\.status\] \?\? row\.status/);
});
