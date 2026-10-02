import { normalizePhoneNumber } from "@/lib/phone";

export const adminUserRoles = [
  "user",
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
] as const;

export const adminUserStatuses = ["active", "suspended", "deleted"] as const;
export const adminUserLocales = ["ko", "en", "es", "zh-CN"] as const;

export type AdminUserRole = (typeof adminUserRoles)[number];
export type AdminUserStatus = (typeof adminUserStatuses)[number];
export type AdminUserLocale = (typeof adminUserLocales)[number];

export type AdminUserInput = {
  country: string;
  email: string;
  fullName: string;
  interestedCourse?: string;
  marketingOptIn?: boolean;
  password?: string;
  phone?: string;
  preferredLocale: string;
  role: string;
  status: string;
  userId?: string;
};

export type CreateAdminUserPayload = {
  country: string | null;
  email: string;
  fullName: string | null;
  interestedCourse: string | null;
  marketingOptIn: boolean;
  password: string;
  phone: string | null;
  preferredLocale: AdminUserLocale;
  role: AdminUserRole;
  status: AdminUserStatus;
};

export type UpdateAdminUserPayload = Omit<CreateAdminUserPayload, "password"> & {
  userId: string;
};

type ValidationResult<T> =
  | {
      ok: true;
      payload: T;
    }
  | {
      ok: false;
      message: string;
    };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildCreateAdminUserPayload(input: AdminUserInput): ValidationResult<CreateAdminUserPayload> {
  const normalized = normalizeAdminUserInput(input);
  const errors = getAdminUserInputErrors(normalized);

  if (!normalized.password || normalized.password.length < 8) {
    errors.push("비밀번호는 8자 이상이어야 합니다.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  return {
    ok: true,
    payload: {
      country: normalized.country || null,
      email: normalized.email,
      fullName: normalized.fullName || null,
      interestedCourse: normalized.interestedCourse || null,
      marketingOptIn: normalized.marketingOptIn,
      password: normalized.password,
      phone: normalized.phone || null,
      preferredLocale: normalized.preferredLocale as AdminUserLocale,
      role: normalized.role as AdminUserRole,
      status: normalized.status as AdminUserStatus
    }
  };
}

export function buildUpdateAdminUserPayload(input: AdminUserInput): ValidationResult<UpdateAdminUserPayload> {
  const normalized = normalizeAdminUserInput(input);
  const errors = getAdminUserInputErrors(normalized);
  const userId = input.userId?.trim() ?? "";

  if (!userId) {
    errors.push("수정할 사용자를 선택해 주세요.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  return {
    ok: true,
    payload: {
      country: normalized.country || null,
      email: normalized.email,
      fullName: normalized.fullName || null,
      interestedCourse: normalized.interestedCourse || null,
      marketingOptIn: normalized.marketingOptIn,
      phone: normalized.phone || null,
      preferredLocale: normalized.preferredLocale as AdminUserLocale,
      role: normalized.role as AdminUserRole,
      status: normalized.status as AdminUserStatus,
      userId
    }
  };
}

export function getAdminUserStatusLabel(status: string) {
  if (status === "active") return "활성";
  if (status === "suspended") return "정지";
  if (status === "deleted") return "삭제됨";
  return status;
}

export function getAdminUserRoleLabel(role: string) {
  if (role === "user") return "일반 회원";
  if (role === "viewer") return "조회 관리자";
  if (role === "content_manager") return "콘텐츠 관리자";
  if (role === "course_manager") return "과정 관리자";
  if (role === "certification_manager") return "자격 관리자";
  if (role === "inquiry_manager") return "문의 관리자";
  if (role === "super_admin") return "슈퍼 관리자";
  return role;
}

function normalizeAdminUserInput(input: AdminUserInput) {
  const country = input.country.trim();

  return {
    country,
    email: input.email.trim().toLowerCase(),
    fullName: input.fullName.trim(),
    interestedCourse: input.interestedCourse?.trim() ?? "",
    marketingOptIn: Boolean(input.marketingOptIn),
    password: input.password?.trim() ?? "",
    phone: normalizePhoneNumber(input.phone ?? "", country),
    preferredLocale: input.preferredLocale.trim() || "ko",
    role: input.role.trim() || "user",
    status: input.status.trim() || "active"
  };
}

function getAdminUserInputErrors(input: ReturnType<typeof normalizeAdminUserInput>) {
  const errors: string[] = [];

  if (!emailPattern.test(input.email)) {
    errors.push("이메일 형식을 확인해 주세요.");
  }

  if (!adminUserRoles.includes(input.role as AdminUserRole)) {
    errors.push("권한 값을 확인해 주세요.");
  }

  if (!adminUserStatuses.includes(input.status as AdminUserStatus)) {
    errors.push("상태 값을 확인해 주세요.");
  }

  if (!adminUserLocales.includes(input.preferredLocale as AdminUserLocale)) {
    errors.push("언어 값을 확인해 주세요.");
  }

  return errors;
}
