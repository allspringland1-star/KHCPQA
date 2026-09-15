"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, FileImage, LoaderCircle, X } from "lucide-react";
import NextImage from "next/image";
import type { AccountCertificate } from "@/lib/account-data";
import type { CertificateTemplate } from "@/lib/admin-certifications";

type CertificateDownloadActionsProps = {
  certificate: AccountCertificate;
  certificateTemplate?: CertificateTemplate | null;
  holderName?: string;
  useTemplateLayout?: boolean;
  variant?: "compact" | "full";
};

type CertificateExportData = {
  courseTitle: string;
  holderName: string;
  issuedAt: string;
  number: string;
  status: string;
  verificationCode: string;
};

const certificateSize = {
  height: 1272,
  width: 900
};

const certificateLogoPath = "/assets/brand/khcpqa-logo-mark.png";
let certificateLogoDataUrl: string | null = null;

const certificateLabelFont = "Malgun Gothic, Apple SD Gothic Neo, serif";
const certificateValueFont = "Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif";

const statusLabels: Record<string, string> = {
  expired: "만료됨",
  issued: "발급됨",
  revoked: "취소됨"
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

function getCertificateStatusLabel(status: string) {
  return statusLabels[status.toLowerCase()] ?? status;
}

function splitText(value: string, maxLength: number, maxLines = 2) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) {
    return [normalized];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length > maxLength) {
      lines.push(word.slice(0, maxLength));
      current = word.slice(maxLength);
    } else {
      current = word;
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && normalized.length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/…$/, "")}…`;
  }

  return lines;
}

function renderTextLines(lines: string[], options: {
  className?: string;
  color?: string;
  fontFamily?: string;
  fontSize: number;
  fontStyle?: string;
  fontWeight?: number;
  lineHeight: number;
  textAnchor?: "end" | "middle" | "start";
  x: number;
  y: number;
}) {
  const attributes = [
    `x="${options.x}"`,
    `y="${options.y}"`,
    `font-family="${options.fontFamily ?? "Arial, sans-serif"}"`,
    `font-size="${options.fontSize}"`,
    `font-weight="${options.fontWeight ?? 700}"`,
    `fill="${options.color ?? "#1f1a28"}"`,
    options.fontStyle ? `font-style="${options.fontStyle}"` : "",
    options.textAnchor ? `text-anchor="${options.textAnchor}"` : ""
  ]
    .filter(Boolean)
    .join(" ");

  return `<text ${attributes}>${lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : options.lineHeight;
      return `<tspan x="${options.x}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("")}</text>`;
}

function renderManagedText(value: string, field: CertificateTemplate["layout"]["holderName"], maxLength: number, maxLines = 2) {
  return renderTextLines(splitText(value, maxLength, maxLines), {
    color: field.color,
    fontFamily: "Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif",
    fontSize: field.fontSize,
    fontWeight: field.fontWeight,
    lineHeight: Math.round(field.fontSize * 1.2),
    textAnchor: field.align,
    x: field.x,
    y: field.y
  });
}

async function loadCertificateLogoDataUrl() {
  if (certificateLogoDataUrl) {
    return certificateLogoDataUrl;
  }

  const response = await fetch(certificateLogoPath);
  if (!response.ok) {
    throw new Error("Certificate logo could not be loaded.");
  }

  const blob = await response.blob();
  certificateLogoDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Certificate logo could not be encoded."));
    reader.readAsDataURL(blob);
  });

  return certificateLogoDataUrl;
}

function toExportData(certificate: AccountCertificate, holderName = "KAHC Member"): CertificateExportData {
  return {
    courseTitle: certificate.title,
    holderName: holderName.trim() || "KAHC Member",
    issuedAt: certificate.issuedAt,
    number: certificate.number,
    status: getCertificateStatusLabel(certificate.status),
    verificationCode: certificate.verificationCode
  };
}

function renderCertificateLogo(logoDataUrl?: string) {
  if (logoDataUrl) {
    return `<image href="${escapeXml(logoDataUrl)}" x="399" y="126" width="102" height="102" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `<circle cx="450" cy="177" r="48" fill="none" stroke="url(#gold)" stroke-width="6"/>
  <text x="450" y="188" text-anchor="middle" font-family="Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif" font-size="23" font-weight="900" fill="#6b4b12">KH</text>`;
}

function renderDefaultCertificateDesignBase(logoDataUrl?: string) {
  return `<defs>
    <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#d6b25e"/>
      <stop offset="0.48" stop-color="#f2df91"/>
      <stop offset="1" stop-color="#9f7826"/>
    </linearGradient>
    <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#34205f" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="900" height="1272" fill="#f7f3ea"/>
  <rect x="54" y="54" width="792" height="1164" rx="18" fill="#fffdf7" filter="url(#paperShadow)"/>
  <rect x="86" y="86" width="728" height="1100" rx="8" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <rect x="108" y="108" width="684" height="1056" rx="4" fill="none" stroke="#d7bd72" stroke-width="2" stroke-dasharray="10 8"/>
  ${renderCertificateLogo(logoDataUrl)}
  <text x="450" y="298" text-anchor="middle" font-family="${certificateLabelFont}" font-size="55" font-weight="800" fill="#171421" letter-spacing="14">자격증</text>
  <text x="450" y="344" text-anchor="middle" font-family="Georgia, serif" font-size="27" font-style="italic" fill="#252032">Certificate of qualification</text>
  <text x="450" y="402" text-anchor="middle" font-family="${certificateValueFont}" font-size="16" font-weight="800" fill="#6d5f47">The Korea Association for Health &amp; Beauty Certification</text>
  <line x1="178" y1="448" x2="722" y2="448" stroke="#e4d4a0" stroke-width="2"/>
  <text x="195" y="524" font-family="${certificateLabelFont}" font-size="23" font-weight="730" fill="#1f1a28">성명</text>
  <text x="195" y="604" font-family="${certificateLabelFont}" font-size="23" font-weight="730" fill="#1f1a28">과정명</text>
  <text x="195" y="690" font-family="${certificateLabelFont}" font-size="23" font-weight="730" fill="#1f1a28">자격번호</text>
  <text x="195" y="760" font-family="${certificateLabelFont}" font-size="23" font-weight="730" fill="#1f1a28">발급일</text>
  <text x="195" y="824" font-family="${certificateLabelFont}" font-size="23" font-weight="730" fill="#1f1a28">상태</text>
  <text x="450" y="922" text-anchor="middle" font-family="${certificateLabelFont}" font-size="23" font-weight="740" fill="#252032">위 사람은 KAHC 자격 과정의 취득자로 확인되어</text>
  <text x="450" y="961" text-anchor="middle" font-family="${certificateLabelFont}" font-size="23" font-weight="740" fill="#252032">위와 같이 자격을 인정합니다.</text>
  <text x="450" y="1017" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-style="italic" font-weight="700" fill="#574f60">This certificate verifies completion and qualification for the listed course.</text>
  <circle cx="270" cy="1100" r="42" fill="url(#gold)" opacity="0.92"/>
  <circle cx="270" cy="1100" r="30" fill="none" stroke="#fff8d7" stroke-width="3"/>
  <text x="270" y="1109" text-anchor="middle" font-family="${certificateValueFont}" font-size="20" font-weight="900" fill="#4f360c">KH</text>
  <text x="590" y="1106" text-anchor="middle" font-family="${certificateValueFont}" font-size="23" font-weight="900" fill="#181421">KAHC</text>
  <text x="590" y="1134" text-anchor="middle" font-family="${certificateValueFont}" font-size="15" font-weight="850" fill="#625868">한국건강관리사자격협회</text>`;
}

async function getSafeCertificateLogoDataUrl() {
  try {
    return await loadCertificateLogoDataUrl();
  } catch {
    return "";
  }
}

export function buildCertificateSvg(certificate: AccountCertificate, holderName?: string, logoDataUrl?: string) {
  const data = toExportData(certificate, holderName);
  const safe = {
    courseTitle: splitText(data.courseTitle, 18, 2),
    holderName: splitText(data.holderName, 18, 2),
    issuedAt: escapeXml(data.issuedAt),
    number: splitText(data.number, 24, 2),
    status: escapeXml(data.status)
  };
  const labelFont = "Malgun Gothic, Apple SD Gothic Neo, serif";
  const valueFont = "Malgun Gothic, Apple SD Gothic Neo, Arial, sans-serif";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${certificateSize.width}" height="${certificateSize.height}" viewBox="0 0 ${certificateSize.width} ${certificateSize.height}" role="img" aria-label="${escapeXml(data.courseTitle)} qualification certificate">
  <defs>
    <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#d6b25e"/>
      <stop offset="0.48" stop-color="#f2df91"/>
      <stop offset="1" stop-color="#9f7826"/>
    </linearGradient>
    <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#34205f" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="900" height="1272" fill="#f7f3ea"/>
  <rect x="54" y="54" width="792" height="1164" rx="18" fill="#fffdf7" filter="url(#paperShadow)"/>
  <rect x="86" y="86" width="728" height="1100" rx="8" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <rect x="108" y="108" width="684" height="1056" rx="4" fill="none" stroke="#d7bd72" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="132" y="136" font-family="${valueFont}" font-size="15" font-weight="800" fill="#6f5b22">제 ${escapeXml(data.number)} 호</text>
  <text x="690" y="136" text-anchor="middle" font-family="${valueFont}" font-size="13" font-weight="800" fill="#756b7f">검증코드 ${escapeXml(data.verificationCode)}</text>
  ${renderCertificateLogo(logoDataUrl)}
  <text x="450" y="298" text-anchor="middle" font-family="${labelFont}" font-size="55" font-weight="800" fill="#171421" letter-spacing="14">자격증</text>
  <text x="450" y="344" text-anchor="middle" font-family="Georgia, serif" font-size="27" font-style="italic" fill="#252032">Certificate of qualification</text>
  <text x="450" y="402" text-anchor="middle" font-family="${valueFont}" font-size="16" font-weight="800" fill="#6d5f47">The Korea Association for Health &amp; Beauty Certification</text>
  <line x1="178" y1="448" x2="722" y2="448" stroke="#e4d4a0" stroke-width="2"/>
  <text x="195" y="524" font-family="${labelFont}" font-size="23" font-weight="730" fill="#1f1a28">성명</text>
  ${renderTextLines(safe.holderName, { fontFamily: valueFont, fontSize: 26, fontWeight: 760, lineHeight: 31, x: 325, y: 524 })}
  <text x="195" y="604" font-family="${labelFont}" font-size="23" font-weight="730" fill="#1f1a28">과정명</text>
  ${renderTextLines(safe.courseTitle, { fontFamily: valueFont, fontSize: 27, fontWeight: 790, lineHeight: 33, x: 325, y: 604 })}
  <text x="195" y="690" font-family="${labelFont}" font-size="23" font-weight="730" fill="#1f1a28">자격번호</text>
  ${renderTextLines(safe.number, { fontFamily: valueFont, fontSize: 23, fontWeight: 760, lineHeight: 29, x: 325, y: 690 })}
  <text x="195" y="760" font-family="${labelFont}" font-size="23" font-weight="730" fill="#1f1a28">발급일</text>
  <text x="325" y="760" font-family="${valueFont}" font-size="23" font-weight="760" fill="#1f1a28">${safe.issuedAt}</text>
  <text x="195" y="824" font-family="${labelFont}" font-size="23" font-weight="730" fill="#1f1a28">상태</text>
  <text x="325" y="824" font-family="${valueFont}" font-size="23" font-weight="820" fill="#0d6b35">${safe.status}</text>
  <text x="450" y="922" text-anchor="middle" font-family="${labelFont}" font-size="23" font-weight="740" fill="#252032">위 사람은 KAHC 자격 과정의 취득자로 확인되어</text>
  <text x="450" y="961" text-anchor="middle" font-family="${labelFont}" font-size="23" font-weight="740" fill="#252032">위와 같이 자격을 인정합니다.</text>
  <text x="450" y="1017" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-style="italic" font-weight="700" fill="#574f60">This certificate verifies completion and qualification for the listed course.</text>
  <circle cx="270" cy="1100" r="42" fill="url(#gold)" opacity="0.92"/>
  <circle cx="270" cy="1100" r="30" fill="none" stroke="#fff8d7" stroke-width="3"/>
  <text x="270" y="1109" text-anchor="middle" font-family="${valueFont}" font-size="20" font-weight="900" fill="#4f360c">KH</text>
  <text x="590" y="1106" text-anchor="middle" font-family="${valueFont}" font-size="23" font-weight="900" fill="#181421">KAHC</text>
  <text x="590" y="1134" text-anchor="middle" font-family="${valueFont}" font-size="15" font-weight="850" fill="#625868">한국건강관리사자격협회</text>
</svg>`;
}

export function buildTemplatePreviewCertificateSvg(
  certificate: AccountCertificate,
  holderName: string | undefined,
  certificateTemplate: CertificateTemplate,
  logoDataUrl?: string
) {
  const data = toExportData(certificate, holderName);
  const layout = certificateTemplate.layout;
  const background = certificateTemplate.backgroundImageUrl
    ? `<rect width="${certificateSize.width}" height="${certificateSize.height}" fill="#fff"/>
  <image href="${escapeXml(certificateTemplate.backgroundImageUrl)}" x="0" y="0" width="${certificateSize.width}" height="${certificateSize.height}" preserveAspectRatio="xMidYMid slice"/>`
    : renderDefaultCertificateDesignBase(logoDataUrl);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${certificateSize.width}" height="${certificateSize.height}" viewBox="0 0 ${certificateSize.width} ${certificateSize.height}" role="img" aria-label="${escapeXml(data.courseTitle)} template preview certificate">
  ${background}
  ${renderManagedText(data.holderName, layout.holderName, 18, 2)}
  ${renderManagedText(data.courseTitle, layout.courseTitle, 18, 2)}
  ${renderManagedText(data.number, layout.certificateNumber, 24, 2)}
  ${renderManagedText(data.issuedAt, layout.issuedAt, 24, 1)}
  ${renderManagedText(data.status, layout.status, 16, 1)}
  ${renderManagedText(data.verificationCode, layout.verificationCode, 28, 1)}
</svg>`;
}

export function buildManagedCertificateSvg(certificate: AccountCertificate, holderName: string | undefined, certificateTemplate: CertificateTemplate) {
  const data = toExportData(certificate, holderName);
  const layout = certificateTemplate.layout;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${certificateSize.width}" height="${certificateSize.height}" viewBox="0 0 ${certificateSize.width} ${certificateSize.height}" role="img" aria-label="${escapeXml(data.courseTitle)} managed qualification certificate">
  <rect width="${certificateSize.width}" height="${certificateSize.height}" fill="#fff"/>
  <image href="${escapeXml(certificateTemplate.backgroundImageUrl)}" x="0" y="0" width="${certificateSize.width}" height="${certificateSize.height}" preserveAspectRatio="xMidYMid slice"/>
  ${renderManagedText(data.holderName, layout.holderName, 18, 2)}
  ${renderManagedText(data.courseTitle, layout.courseTitle, 18, 2)}
  ${renderManagedText(data.number, layout.certificateNumber, 24, 2)}
  ${renderManagedText(data.issuedAt, layout.issuedAt, 24, 1)}
  ${renderManagedText(data.status, layout.status, 16, 1)}
  ${renderManagedText(data.verificationCode, layout.verificationCode, 28, 1)}
</svg>`;
}

async function loadImageElement(src: string) {
  const image = new Image();
  image.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = src;
  });

  return image;
}

export async function drawCertificateTemplateBackground(context: CanvasRenderingContext2D, certificateTemplate: CertificateTemplate) {
  const background = await loadImageElement(certificateTemplate.backgroundImageUrl);
  context.drawImage(background, 0, 0, certificateSize.width, certificateSize.height);
}

function drawTemplateText(context: CanvasRenderingContext2D, value: string, field: CertificateTemplate["layout"]["holderName"], maxLength: number, maxLines = 2) {
  const lines = splitText(value, maxLength, maxLines);
  context.fillStyle = field.color;
  context.font = `${field.fontWeight} ${field.fontSize}px "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif`;
  context.textAlign = field.align === "middle" ? "center" : field.align === "end" ? "right" : "left";
  context.textBaseline = "alphabetic";

  lines.forEach((line, index) => {
    context.fillText(line, field.x, field.y + index * Math.round(field.fontSize * 1.2));
  });
}

async function downloadManagedCertificatePng(certificate: AccountCertificate, holderName: string | undefined, certificateTemplate: CertificateTemplate) {
  const canvas = document.createElement("canvas");
  canvas.width = certificateSize.width;
  canvas.height = certificateSize.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await drawCertificateTemplateBackground(context, certificateTemplate);

  const data = toExportData(certificate, holderName);
  const layout = certificateTemplate.layout;
  drawTemplateText(context, data.holderName, layout.holderName, 18, 2);
  drawTemplateText(context, data.courseTitle, layout.courseTitle, 18, 2);
  drawTemplateText(context, data.number, layout.certificateNumber, 24, 2);
  drawTemplateText(context, data.issuedAt, layout.issuedAt, 24, 1);
  drawTemplateText(context, data.status, layout.status, 16, 1);
  drawTemplateText(context, data.verificationCode, layout.verificationCode, 28, 1);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
        return;
      }
      reject(new Error("PNG export failed."));
    }, "image/png");
  });

  downloadBlob(filenameFor(certificate, "png"), blob);
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function filenameFor(certificate: AccountCertificate, extension: "png" | "svg") {
  const baseName = sanitizeFilename(`${certificate.title}-${certificate.number}`) || "khcpqa-certificate";
  return `${baseName}.${extension}`;
}

async function downloadCertificateSvgAsPng(certificate: AccountCertificate, svg: string) {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const image = new Image();
  const scale = 2;

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Certificate image could not be rendered."));
      image.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = certificateSize.width * scale;
    canvas.height = certificateSize.height * scale;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas is not available.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
          return;
        }
        reject(new Error("PNG export failed."));
      }, "image/png");
    });

    downloadBlob(filenameFor(certificate, "png"), blob);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

async function buildCertificatePreviewDataUrl(
  certificate: AccountCertificate,
  holderName?: string,
  certificateTemplate?: CertificateTemplate | null,
  options: { useTemplateLayout?: boolean } = {}
) {
  const logoDataUrl = await getSafeCertificateLogoDataUrl();
  const useTemplateLayout = options.useTemplateLayout ?? false;
  const svg = certificateTemplate && (useTemplateLayout || certificateTemplate.backgroundImageUrl)
    ? buildTemplatePreviewCertificateSvg(certificate, holderName, certificateTemplate, logoDataUrl)
    : buildCertificateSvg(certificate, holderName, logoDataUrl);

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function downloadCertificatePng(certificate: AccountCertificate, holderName?: string, certificateTemplate?: CertificateTemplate | null) {
  const logoDataUrl = await getSafeCertificateLogoDataUrl();

  if (certificateTemplate?.backgroundImageUrl) {
    try {
      await downloadManagedCertificatePng(certificate, holderName, certificateTemplate);
      return;
    } catch {
      // Fall through to the SVG renderer when the managed image cannot load.
    }
  }

  if (certificateTemplate) {
    const svg = buildTemplatePreviewCertificateSvg(certificate, holderName, certificateTemplate, logoDataUrl);
    await downloadCertificateSvgAsPng(certificate, svg);
    return;
  }

  await downloadCertificateSvgAsPng(certificate, buildCertificateSvg(certificate, holderName, logoDataUrl));
}

export function CertificateDownloadActions({
  certificate,
  certificateTemplate,
  holderName,
  variant = "full"
}: CertificateDownloadActionsProps) {
  const [message, setMessage] = useState("");

  async function handlePngDownload() {
    setMessage("");
    try {
      await downloadCertificatePng(certificate, holderName, certificateTemplate);
    } catch {
      setMessage("이미지 파일을 준비하지 못했습니다. 다시 시도해 주세요.");
    }
  }

  return (
    <span className={`certificate-download-actions is-${variant}`}>
      <button aria-label={`${certificate.title} 자격증 이미지 다운로드`} onClick={handlePngDownload} type="button">
        <FileImage size={16} />
        <span>이미지 다운로드</span>
      </button>
      {message ? <span className="certificate-download-message" role="status">{message}</span> : null}
    </span>
  );
}

export function CertificateInlinePreview({
  certificate,
  certificateTemplate,
  holderName,
  useTemplateLayout = false
}: Omit<CertificateDownloadActionsProps, "variant">) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const previewSignature = JSON.stringify({ certificate, certificateTemplate, holderName, useTemplateLayout });

  useEffect(() => {
    let isCancelled = false;

    async function preparePreview() {
      setPreviewError("");
      setPreviewUrl("");

      try {
        const dataUrl = await buildCertificatePreviewDataUrl(certificate, holderName, certificateTemplate, { useTemplateLayout });

        if (!isCancelled) {
          setPreviewUrl(dataUrl);
        }
      } catch {
        if (!isCancelled) {
          setPreviewError("자격증 이미지를 불러오지 못했습니다.");
        }
      }
    }

    void preparePreview();

    return () => {
      isCancelled = true;
    };
  }, [certificate, certificateTemplate, holderName, previewSignature, useTemplateLayout]);

  if (previewUrl) {
    return (
      <NextImage
        alt={`${holderName} ${certificate.title} 자격증 기본 디자인 미리보기`}
        className="certificate-inline-preview-image"
        height={certificateSize.height}
        key={previewSignature}
        src={previewUrl}
        unoptimized
        width={certificateSize.width}
      />
    );
  }

  if (previewError) {
    return <p className="certificate-preview-error" role="status">{previewError}</p>;
  }

  return (
    <span className="certificate-preview-loading" role="status">
      <LoaderCircle size={18} />
      자격증 이미지를 준비하고 있습니다.
    </span>
  );
}

export function CertificateImageViewer({
  certificate,
  certificateTemplate,
  holderName,
  useTemplateLayout = false
}: Omit<CertificateDownloadActionsProps, "variant">) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const previewSignature = JSON.stringify({ certificate, certificateTemplate, holderName, useTemplateLayout });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isCancelled = false;

    async function preparePreview() {
      setPreviewError("");
      setPreviewUrl("");

      try {
        const dataUrl = await buildCertificatePreviewDataUrl(certificate, holderName, certificateTemplate, { useTemplateLayout });

        if (!isCancelled) {
          setPreviewUrl(dataUrl);
        }
      } catch {
        setPreviewError("자격증 이미지를 불러오지 못했습니다.");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    void preparePreview();

    return () => {
      isCancelled = true;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [certificate, certificateTemplate, holderName, isOpen, previewSignature, useTemplateLayout]);

  const previewDialog = isOpen ? (
    <div
      className="certificate-preview-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <section
        aria-labelledby={`certificate-preview-${certificate.number}`}
        aria-modal="true"
        className="certificate-preview-dialog"
        role="dialog"
      >
        <header className="certificate-preview-heading">
          <div>
            <span>자격증 이미지</span>
            <h2 id={`certificate-preview-${certificate.number}`}>자격증 미리보기</h2>
            <p>{holderName} · {certificate.title}</p>
          </div>
          <button aria-label="자격증 미리보기 닫기" onClick={() => setIsOpen(false)} type="button">
            <X size={18} />
          </button>
        </header>

        <div className="certificate-preview-canvas">
          {previewUrl ? (
            <NextImage
              alt={`${holderName} ${certificate.title} 자격증 미리보기`}
              className="certificate-preview-image"
              height={certificateSize.height}
              key={previewSignature}
              src={previewUrl}
              unoptimized
              width={certificateSize.width}
            />
          ) : previewError ? (
            <p className="certificate-preview-error" role="status">{previewError}</p>
          ) : (
            <span className="certificate-preview-loading" role="status">
              <LoaderCircle size={22} />
              자격증 이미지를 준비하고 있습니다.
            </span>
          )}
        </div>

        <footer className="certificate-preview-actions">
          <CertificateDownloadActions certificate={certificate} certificateTemplate={certificateTemplate} holderName={holderName} />
          <button className="secondary-button" onClick={() => setIsOpen(false)} type="button">닫기</button>
        </footer>
      </section>
    </div>
  ) : null;

  return (
    <>
      <button
        aria-label={`${certificate.title} 자격증 이미지 보기`}
        className="certificate-preview-trigger"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Eye size={14} />
        보기
      </button>

      {previewDialog && typeof document !== "undefined" ? createPortal(previewDialog, document.body) : null}
    </>
  );
}
