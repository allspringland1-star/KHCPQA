export const adminCertificationStatuses = ["issued", "expired", "revoked"] as const;
export const certificateTemplateStatuses = ["draft", "published", "archived"] as const;

export type AdminCertificationStatus = (typeof adminCertificationStatuses)[number];
export type CertificateTemplateStatus = (typeof certificateTemplateStatuses)[number];

export type CertificateTemplateLayoutFieldKey =
  | "certificateNumber"
  | "courseTitle"
  | "issuedAt"
  | "status"
  | "verificationCode"
  | "holderName";

export type CertificateTemplateLayoutField = {
  align: "middle" | "start" | "end";
  color: string;
  fontSize: number;
  fontWeight: number;
  x: number;
  y: number;
};

export type CertificateTemplateLayout = Record<CertificateTemplateLayoutFieldKey, CertificateTemplateLayoutField>;

export type CertificateTemplate = {
  backgroundImageUrl: string;
  layout: CertificateTemplateLayout;
  name: string;
  status: CertificateTemplateStatus;
};

export type AdminCertificationInput = {
  adminNote?: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt?: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
};

export type AdminCertificationPayload = {
  adminNote: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt: string;
  issuedAt: string;
  status: AdminCertificationStatus;
  userEmail: string;
  verificationCode: string;
};

export const defaultCertificateTemplateLayout: CertificateTemplateLayout = {
  certificateNumber: { align: "start", color: "#1f1a28", fontSize: 23, fontWeight: 760, x: 325, y: 690 },
  courseTitle: { align: "start", color: "#1f1a28", fontSize: 27, fontWeight: 790, x: 325, y: 604 },
  holderName: { align: "start", color: "#1f1a28", fontSize: 26, fontWeight: 760, x: 325, y: 524 },
  issuedAt: { align: "start", color: "#1f1a28", fontSize: 23, fontWeight: 760, x: 325, y: 760 },
  status: { align: "start", color: "#0d6b35", fontSize: 23, fontWeight: 820, x: 325, y: 824 },
  verificationCode: { align: "middle", color: "#756b7f", fontSize: 13, fontWeight: 800, x: 690, y: 136 }
};

const templateLayoutKeys = Object.keys(defaultCertificateTemplateLayout) as CertificateTemplateLayoutFieldKey[];

function isTemplateStatus(value: string): value is CertificateTemplateStatus {
  return certificateTemplateStatuses.includes(value as CertificateTemplateStatus);
}

function cleanNumber(value: unknown, fallback: number, min: number, max: number) {
  const next = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(next)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(next)));
}

function cleanColor(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim() : fallback;
}

function cleanAlign(value: unknown, fallback: CertificateTemplateLayoutField["align"]) {
  return value === "middle" || value === "start" || value === "end" ? value : fallback;
}

export function normalizeCertificateTemplate(value: unknown): CertificateTemplate {
  const source = value && typeof value === "object" ? value as Partial<CertificateTemplate> : {};
  const layoutSource = source.layout && typeof source.layout === "object" ? source.layout as Partial<CertificateTemplateLayout> : {};
  const layout = Object.fromEntries(templateLayoutKeys.map((key) => {
    const fallback = defaultCertificateTemplateLayout[key];
    const current = layoutSource[key] && typeof layoutSource[key] === "object" ? layoutSource[key] as Partial<CertificateTemplateLayoutField> : {};

    return [key, {
      align: cleanAlign(current.align, fallback.align),
      color: cleanColor(current.color, fallback.color),
      fontSize: cleanNumber(current.fontSize, fallback.fontSize, 8, 96),
      fontWeight: cleanNumber(current.fontWeight, fallback.fontWeight, 300, 900),
      x: cleanNumber(current.x, fallback.x, 0, 900),
      y: cleanNumber(current.y, fallback.y, 0, 1272)
    }];
  })) as CertificateTemplateLayout;
  const status = typeof source.status === "string" && isTemplateStatus(source.status) ? source.status : "draft";

  return {
    backgroundImageUrl: typeof source.backgroundImageUrl === "string" ? source.backgroundImageUrl.trim() : "",
    layout,
    name: typeof source.name === "string" && source.name.trim() ? source.name.trim() : "기본 자격증 디자인",
    status
  };
}

type ValidationResult<T> =
  | {
      ok: true;
      payload: T;
    }
  | {
      ok: false;
      message: string;
    };

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function buildAdminCertificationPayload(
  input: AdminCertificationInput
): ValidationResult<AdminCertificationPayload> {
  const normalized = {
    adminNote: input.adminNote?.trim() ?? "",
    certificateNumber: input.certificateNumber.trim(),
    courseTitle: input.courseTitle.trim(),
    expiresAt: input.expiresAt?.trim() ?? "",
    issuedAt: input.issuedAt.trim(),
    status: input.status.trim(),
    userEmail: input.userEmail.trim().toLowerCase(),
    verificationCode: input.verificationCode.trim()
  };
  const errors: string[] = [];

  if (!normalized.userEmail || !isValidEmail(normalized.userEmail)) {
    errors.push("회원 이메일을 확인해 주세요.");
  }

  if (!normalized.courseTitle) {
    errors.push("자격명을 입력해 주세요.");
  }

  if (!normalized.certificateNumber) {
    errors.push("자격번호를 입력해 주세요.");
  }

  if (!normalized.issuedAt || !isValidDate(normalized.issuedAt)) {
    errors.push("발급일은 YYYY-MM-DD 형식으로 입력해 주세요.");
  }

  if (normalized.expiresAt && !isValidDate(normalized.expiresAt)) {
    errors.push("만료일은 YYYY-MM-DD 형식으로 입력해 주세요.");
  }

  if (!adminCertificationStatuses.includes(normalized.status as AdminCertificationStatus)) {
    errors.push("상태 값을 확인해 주세요.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  return {
    ok: true,
    payload: {
      adminNote: normalized.adminNote,
      certificateNumber: normalized.certificateNumber,
      courseTitle: normalized.courseTitle,
      expiresAt: normalized.expiresAt,
      issuedAt: normalized.issuedAt,
      status: normalized.status as AdminCertificationStatus,
      userEmail: normalized.userEmail,
      verificationCode: normalized.verificationCode || normalized.certificateNumber
    }
  };
}

export function getAdminCertificationStatusLabel(status: string) {
  if (status === "issued") return "발급됨";
  if (status === "expired") return "만료됨";
  if (status === "revoked") return "취소됨";
  return status;
}

export function formatAdminCertificationDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
