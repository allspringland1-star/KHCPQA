"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { isLocale, locales, type Locale } from "@/i18n/config";
import {
  buildAdminCertificationPayload,
  normalizeCertificateTemplate
} from "@/lib/admin-certifications";
import { parseInquiryReceipt } from "@/lib/receipts";
import {
  buildCourseLocalizationPayload,
  courseCategories,
  courseStatuses,
  courseTemplateKeys,
  createCourseSlug,
  isCourseClassificationValid,
  type CourseCategoryKey,
  type CourseContentSection,
  type CoursePublishStatus,
  type CourseScheduleTrack,
  type CourseTemplateKey
} from "@/lib/course-model";
import {
  buildCreateAdminUserPayload,
  buildUpdateAdminUserPayload,
  type AdminUserInput
} from "@/lib/admin-users";
import {
  buildUpdateAdminInquiryPayload,
  type AdminInquiryUpdateInput
} from "@/lib/admin-inquiries";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { canPublishTranslation, getTranslationFreshness } from "@/lib/translation-model";
import { FOOTER_SETTINGS_SLUG, normalizeFooterSettings, serializeFooterSettings, type FooterSettings } from "@/lib/footer-settings";

const roleOptions = [
  "user",
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
] as const;

const statusOptions = ["active", "suspended", "deleted"] as const;
const contentTypes = ["Page", "Course", "Activity", "Review"] as const;
const contentStatusOptions = ["draft", "translated", "reviewed", "published", "archived"] as const;
const bannerPlacements = ["home", "curriculum", "activities", "global"] as const;
const bannerStatusOptions = ["draft", "published", "archived"] as const;
const missingSupabaseMessage = "Supabase 환경변수가 설정되지 않아 저장할 수 없습니다.";
const activitySlugRoots = [
  "corporate-events",
  "competition",
  "volunteer",
  "reviews",
  "notice",
  "awards",
  "media",
  "photo",
  "pass"
] as const;

type AdminRole = (typeof roleOptions)[number];
type AccountStatus = (typeof statusOptions)[number];
type ContentType = (typeof contentTypes)[number];
type ContentStatus = (typeof contentStatusOptions)[number];
type BannerPlacement = (typeof bannerPlacements)[number];
type BannerStatus = (typeof bannerStatusOptions)[number];

export type UpdateAdminUserRoleResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminUserResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminCertificationResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminInquiryResult = {
  ok: boolean;
  message: string;
};

export type DeleteAdminInquiryResult = SaveAdminInquiryResult;

export type SaveAdminContentResult = {
  ok: boolean;
  message: string;
};

export type UploadAdminContentImageResult = SaveAdminContentResult & {
  url?: string;
};

export type UploadAdminContentAttachmentResult = UploadAdminContentImageResult;
export type SaveAdminCertificateTemplateResult = SaveAdminContentResult;
export type UploadAdminCertificateTemplateImageResult = UploadAdminContentImageResult;

export type DeleteAdminContentResult = {
  ok: boolean;
  message: string;
};

export type SaveAdminCourseResult = SaveAdminContentResult & {
  courseId?: string;
  slug?: string;
};

const adminUploadBucket = "admin-uploads";
const maxAdminImageSize = 5 * 1024 * 1024;
const maxAdminAttachmentSize = 15 * 1024 * 1024;
const allowedAdminImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const allowedAdminAttachmentTypes = ["application/pdf"] as const;
const allowedAdminUploadTypes = [...allowedAdminImageTypes, ...allowedAdminAttachmentTypes] as const;

export async function signOutFromAdmin() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/ko/login");
}

function isAdminRole(value: string): value is AdminRole {
  return roleOptions.includes(value as AdminRole);
}

function isAccountStatus(value: string): value is AccountStatus {
  return statusOptions.includes(value as AccountStatus);
}

function isContentType(value: string): value is ContentType {
  return contentTypes.includes(value as ContentType);
}

function isContentStatus(value: string): value is ContentStatus {
  return contentStatusOptions.includes(value as ContentStatus);
}

function isBannerPlacement(value: string): value is BannerPlacement {
  return bannerPlacements.includes(value as BannerPlacement);
}

function isBannerStatus(value: string): value is BannerStatus {
  return bannerStatusOptions.includes(value as BannerStatus);
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    "type" in value
  );
}

function getDetectedImageType(bytes: Uint8Array): (typeof allowedAdminImageTypes)[number] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  const header = new TextDecoder().decode(bytes.slice(0, 12));

  if (header.startsWith("GIF87a") || header.startsWith("GIF89a")) {
    return "image/gif";
  }

  if (header.startsWith("RIFF") && header.slice(8, 12) === "WEBP") {
    return "image/webp";
  }

  return null;
}

function getDetectedPdfType(bytes: Uint8Array): (typeof allowedAdminAttachmentTypes)[number] | null {
  const header = new TextDecoder().decode(bytes.slice(0, 5));
  return header === "%PDF-" ? "application/pdf" : null;
}

function getImageExtension(contentType: (typeof allowedAdminImageTypes)[number]) {
  if (contentType === "image/png") {
    return "png";
  }

  if (contentType === "image/webp") {
    return "webp";
  }

  if (contentType === "image/gif") {
    return "gif";
  }

  return "jpg";
}

function getSafeStorageSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "content";
}

function getPublishEventAction(status: string, isExisting: boolean) {
  if (status === "published") {
    return "published";
  }

  if (status === "archived") {
    return "archived";
  }

  return isExisting ? "updated" : "created";
}

function getManagedCourseSlug(slug: string) {
  return slug.replace(/-(?:flow|panel|technique|process)-.+$/, "");
}

function getManagedActivitySlug(slug: string) {
  return activitySlugRoots.find((root) => slug === root || slug.startsWith(`${root}-`)) ?? slug.split("-")[0];
}

function revalidateManagedContent(input: {
  contentType: ContentType;
  locale: Locale;
  slug: string;
}) {
  revalidatePath("/admin");

  if (input.contentType === "Course") {
    const courseSlug = getManagedCourseSlug(input.slug);
    revalidatePath(`/${input.locale}/curriculum`);
    revalidatePath(`/${input.locale}/curriculum/${courseSlug}`);
    return;
  }

  if (input.contentType === "Activity") {
    const activityKey = getManagedActivitySlug(input.slug);
    revalidatePath(`/${input.locale}/activities`);
    revalidatePath(`/${input.locale}/activities/${activityKey}`);
    return;
  }

  if (input.contentType === "Page") {
    if (input.slug.startsWith("director-")) {
      revalidatePath("/admin/directors");
      revalidatePath(`/${input.locale}/about/instructors`);
      return;
    }

    revalidatePath(input.slug === "home" ? `/${input.locale}` : `/${input.locale}/${input.slug}`);
  }
}

async function logPublishEvent({
  action,
  actor,
  itemId,
  itemType,
  status,
  title
}: {
  action: string;
  actor: Awaited<ReturnType<typeof getActiveAdminRole>>;
  itemId: string;
  itemType: "content" | "banner";
  status: string;
  title: string;
}) {
  await actor.supabase.from("admin_publish_events").insert({
    action,
    actor_id: actor.userId || null,
    item_id: itemId || null,
    item_type: itemType,
    status,
    title
  });
}

async function getActiveAdminRole() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { role: "", status: "", supabase, userId: "" };
  }

  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  return {
    role: typeof actorProfile?.role === "string" ? actorProfile.role : "",
    status: typeof actorProfile?.status === "string" ? actorProfile.status : "",
    supabase,
    userId: user.id
  };
}

function getAdminStorageEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    apiKey: serviceRoleKey,
    serviceRoleKey,
    storageUrl: `${url.replace(/\/$/, "")}/storage/v1`
  };
}

function getSupabaseAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { serviceRoleKey, url };
}

function createSupabaseAdminServiceClient() {
  const adminEnv = getSupabaseAdminEnv();

  if (!adminEnv) {
    return null;
  }

  return createSupabaseAdminClient(adminEnv.url, adminEnv.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function isMissingBucketError(errorMessage: string) {
  return /bucket not found|not found|does not exist/i.test(errorMessage);
}

async function syncAdminUploadBucketConfig(storage: NonNullable<ReturnType<typeof getAdminStorageEnv>>) {
  const updateResponse = await fetch(`${storage.storageUrl}/bucket/${adminUploadBucket}`, {
    body: JSON.stringify({
      allowed_mime_types: [...allowedAdminUploadTypes],
      file_size_limit: Math.max(maxAdminImageSize, maxAdminAttachmentSize),
      public: true
    }),
    headers: {
      apikey: storage.apiKey,
      authorization: `Bearer ${storage.serviceRoleKey}`,
      "content-type": "application/json"
    },
    method: "PUT"
  });

  if (!updateResponse.ok) {
    const updateErrorMessage = await updateResponse.text();

    return {
      ok: false,
      message: `파일 저장소 설정을 업데이트할 수 없습니다. ${updateErrorMessage || updateResponse.statusText}`
    };
  }

  return { ok: true, message: "" };
}

async function ensureAdminUploadBucket() {
  const storage = getAdminStorageEnv();

  if (!storage) {
    return {
      ok: false,
      message:
        "서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않아 파일 업로드를 준비할 수 없습니다. .env.local 또는 배포 환경 변수에 service_role 키를 추가한 뒤 서버를 재시작해 주세요.",
      storage: null
    };
  }

  const bucketResponse = await fetch(`${storage.storageUrl}/bucket/${adminUploadBucket}`, {
    headers: {
      apikey: storage.apiKey,
      authorization: `Bearer ${storage.serviceRoleKey}`
    }
  });

  if (bucketResponse.ok) {
    const syncResult = await syncAdminUploadBucketConfig(storage);

    if (!syncResult.ok) {
      return {
        ok: false,
        message: syncResult.message,
        storage: null
      };
    }

    return { ok: true, message: "", storage };
  }

  const bucketErrorMessage = await bucketResponse.text();

  if (bucketResponse.status !== 404 && !isMissingBucketError(bucketErrorMessage)) {
    return {
      ok: false,
      message: `이미지 저장소 상태를 확인할 수 없습니다. ${bucketErrorMessage || bucketResponse.statusText}`,
      storage: null
    };
  }

  const createResponse = await fetch(`${storage.storageUrl}/bucket`, {
    body: JSON.stringify({
      allowed_mime_types: [...allowedAdminUploadTypes],
      file_size_limit: Math.max(maxAdminImageSize, maxAdminAttachmentSize),
      id: adminUploadBucket,
      name: adminUploadBucket,
      public: true
    }),
    headers: {
      apikey: storage.apiKey,
      authorization: `Bearer ${storage.serviceRoleKey}`,
      "content-type": "application/json"
    },
    method: "POST"
  });

  if (!createResponse.ok) {
    const createErrorMessage = await createResponse.text();

    if (!/already exists|duplicate/i.test(createErrorMessage)) {
      return {
        ok: false,
        message: `이미지 저장소를 생성할 수 없습니다. ${createErrorMessage || createResponse.statusText}`,
        storage: null
      };
    }
  }

  return { ok: true, message: "", storage };
}

async function uploadAdminFileToStorage(input: {
  arrayBuffer: ArrayBuffer;
  contentType: (typeof allowedAdminUploadTypes)[number];
  failureLabel: string;
  path: string;
}) {
  const storage = await ensureAdminUploadBucket();

  if (!storage.ok || !storage.storage) {
    return {
      ok: false,
      message: storage.message,
      publicUrl: ""
    };
  }

  const objectPath = input.path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const uploadResponse = await fetch(`${storage.storage.storageUrl}/object/${adminUploadBucket}/${objectPath}`, {
    body: input.arrayBuffer,
    headers: {
      apikey: storage.storage.apiKey,
      authorization: `Bearer ${storage.storage.serviceRoleKey}`,
      "cache-control": "31536000",
      "content-type": input.contentType,
      "x-upsert": "false"
    },
    method: "POST"
  });

  if (!uploadResponse.ok) {
    const errorMessage = await uploadResponse.text();

    return {
      ok: false,
      message: `${input.failureLabel} 업로드에 실패했습니다. ${errorMessage || uploadResponse.statusText}`,
      publicUrl: ""
    };
  }

  return {
    ok: true,
    message: "",
    publicUrl: `${storage.storage.storageUrl}/object/public/${adminUploadBucket}/${objectPath}`
  };
}

function canManageCertificateTemplate(role: string, status: string) {
  return ["certification_manager", "super_admin"].includes(role) && status === "active";
}

export async function updateAdminUserRole(input: {
  role: string;
  status: string;
  userId: string;
}): Promise<UpdateAdminUserRoleResult> {
  if (!input.userId || !isAdminRole(input.role) || !isAccountStatus(input.status)) {
    return { ok: false, message: "권한 또는 계정 상태 값이 올바르지 않습니다." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.role !== "super_admin" || actor.status !== "active") {
    return { ok: false, message: "super_admin 권한이 필요합니다." };
  }

  const { error } = await actor.supabase
    .from("profiles")
    .update({
      role: input.role,
      status: input.status
    })
    .eq("id", input.userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  return { ok: true, message: "회원 권한이 저장되었습니다." };
}

export async function saveAdminUser(input: AdminUserInput & { mode: "create" | "update" }): Promise<SaveAdminUserResult> {
  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.role !== "super_admin" || actor.status !== "active") {
    return { ok: false, message: "super_admin 권한이 필요합니다." };
  }

  if (input.mode === "create") {
    const validation = buildCreateAdminUserPayload(input);

    if (!validation.ok) {
      return { ok: false, message: validation.message };
    }

    const adminClient = createSupabaseAdminServiceClient();

    if (!adminClient) {
      return {
        ok: false,
        message: "서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어야 관리자 사용자 등록이 가능합니다."
      };
    }

    const payload = validation.payload;
    const { data, error } = await adminClient.auth.admin.createUser({
      email: payload.email,
      email_confirm: true,
      password: payload.password,
      user_metadata: {
        country: payload.country,
        full_name: payload.fullName,
        interested_course: payload.interestedCourse,
        marketing_opt_in: payload.marketingOptIn,
        phone: payload.phone,
        preferred_locale: payload.preferredLocale
      }
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    const userId = data.user?.id;

    if (!userId) {
      return { ok: false, message: "생성된 사용자 ID를 확인할 수 없습니다." };
    }

    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        country: payload.country,
        email: payload.email,
        full_name: payload.fullName,
        id: userId,
        interested_course: payload.interestedCourse,
        marketing_opt_in: payload.marketingOptIn,
        phone: payload.phone,
        preferred_locale: payload.preferredLocale,
        role: payload.role,
        status: payload.status
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return { ok: false, message: profileError.message };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { ok: true, message: "사용자가 등록되었습니다." };
  }

  const validation = buildUpdateAdminUserPayload(input);

  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  const payload = validation.payload;
  const { error } = await actor.supabase
    .from("profiles")
    .update({
      country: payload.country,
      email: payload.email,
      full_name: payload.fullName,
      interested_course: payload.interestedCourse,
      marketing_opt_in: payload.marketingOptIn,
      phone: payload.phone,
      preferred_locale: payload.preferredLocale,
      role: payload.role,
      status: payload.status
    })
    .eq("id", payload.userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { ok: true, message: "사용자 정보가 수정되었습니다." };
}

export async function deleteAdminUser(input: { userId: string }): Promise<SaveAdminUserResult> {
  const userId = input.userId.trim();

  if (!userId) {
    return { ok: false, message: "삭제할 사용자를 선택해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.role !== "super_admin" || actor.status !== "active") {
    return { ok: false, message: "super_admin 권한이 필요합니다." };
  }

  if (actor.userId === userId) {
    return { ok: false, message: "현재 로그인한 관리자 계정은 삭제할 수 없습니다." };
  }

  const { error } = await actor.supabase
    .from("profiles")
    .update({ status: "deleted" })
    .eq("id", userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { ok: true, message: "사용자가 삭제 상태로 변경되었습니다." };
}

export async function saveAdminCertification(input: {
  adminNote?: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt?: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
}): Promise<SaveAdminCertificationResult> {
  const validation = buildAdminCertificationPayload(input);

  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  const trimmed = validation.payload;

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["certification_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "자격 관리자 권한이 필요합니다." };
  }

  const { data: targetProfile, error: profileError } = await actor.supabase
    .from("profiles")
    .select("id")
    .eq("email", trimmed.userEmail)
    .maybeSingle();

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  if (!targetProfile?.id) {
    return { ok: false, message: "해당 이메일의 회원을 찾을 수 없습니다." };
  }

  const { error } = await actor.supabase.from("certifications").upsert(
    {
      admin_note: trimmed.adminNote || null,
      certificate_number: trimmed.certificateNumber,
      course_title: trimmed.courseTitle,
      expires_at: trimmed.expiresAt || null,
      issued_at: trimmed.issuedAt,
      status: trimmed.status,
      user_id: targetProfile.id,
      verification_code: trimmed.verificationCode
    },
    { onConflict: "certificate_number" }
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/certifications");
  return { ok: true, message: "자격 데이터가 저장되었습니다." };
}

export async function saveAdminCertificateTemplate(input: unknown): Promise<SaveAdminCertificateTemplateResult> {
  const template = normalizeCertificateTemplate(input);

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!canManageCertificateTemplate(actor.role, actor.status)) {
    return { ok: false, message: "자격 관리자 권한이 필요합니다." };
  }

  if (template.status === "published") {
    const { error: archiveError } = await actor.supabase
      .from("certificate_templates")
      .update({ status: "draft" })
      .eq("status", "published");

    if (archiveError) {
      return { ok: false, message: archiveError.message };
    }
  }

  const { error } = await actor.supabase.from("certificate_templates").insert({
    background_image_url: template.backgroundImageUrl || null,
    created_by: actor.userId,
    layout_json: template.layout,
    name: template.name,
    status: template.status
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/certifications");
  revalidatePath("/ko/account");
  revalidatePath("/ko/account/certifications");
  return { ok: true, message: "자격증 디자인 설정이 저장되었습니다." };
}

export async function saveAdminInquiry(input: {
  managerNote: string;
  receipt: string;
  status: string;
}): Promise<SaveAdminInquiryResult> {
  return updateAdminInquiry(input);
}

export async function updateAdminInquiry(input: AdminInquiryUpdateInput): Promise<SaveAdminInquiryResult> {
  const validation = buildUpdateAdminInquiryPayload(input);

  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["inquiry_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "문의 관리자 권한이 필요합니다." };
  }

  const payload = validation.payload;
  const receiptId = parseInquiryReceipt(payload.receipt);

  const { error } = await actor.supabase
    .from("inquiries")
    .update({
      manager_note: payload.managerNote,
      status: payload.status
    })
    .eq("id", receiptId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { ok: true, message: "문의 처리 상태가 저장되었습니다." };
}

export async function deleteAdminInquiry(input: { receipt: string }): Promise<DeleteAdminInquiryResult> {
  const receipt = input.receipt.trim();

  if (!receipt) {
    return { ok: false, message: "삭제할 문의를 선택해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["inquiry_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "문의 관리자 권한이 필요합니다." };
  }

  const adminClient = createSupabaseAdminServiceClient();

  if (!adminClient) {
    return {
      ok: false,
      message: "서버 환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되어야 관리자 문의 삭제가 가능합니다."
    };
  }

  const { error } = await adminClient.from("inquiries").delete().eq("id", parseInquiryReceipt(receipt));

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { ok: true, message: "문의가 삭제되었습니다." };
}

export async function uploadAdminContentImage(formData: FormData): Promise<UploadAdminContentImageResult> {
  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["content_manager", "course_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const fileValue = formData.get("file");

  if (!isUploadFile(fileValue) || fileValue.size === 0) {
    return { ok: false, message: "대표 이미지 파일을 선택해 주세요." };
  }

  if (fileValue.size > maxAdminImageSize) {
    return { ok: false, message: "대표 이미지는 5MB 이하 파일만 업로드할 수 있습니다." };
  }

  const claimedType = fileValue.type as (typeof allowedAdminImageTypes)[number];

  if (!allowedAdminImageTypes.includes(claimedType)) {
    return { ok: false, message: "JPG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다." };
  }

  const arrayBuffer = await fileValue.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const detectedType = getDetectedImageType(bytes);

  if (!detectedType || detectedType !== claimedType) {
    return { ok: false, message: "파일 형식이 이미지 시그니처와 일치하지 않습니다." };
  }

  const contentTypeSegment = getSafeStorageSegment(String(formData.get("contentType") ?? "activity"));
  const slugSegment = getSafeStorageSegment(String(formData.get("slug") ?? "content"));
  const dateSegment = new Date().toISOString().slice(0, 10);
  const extension = getImageExtension(detectedType);
  const path = `${contentTypeSegment}/${dateSegment}/${slugSegment}-${randomUUID()}.${extension}`;
  const uploadResult = await uploadAdminFileToStorage({
    arrayBuffer,
    contentType: detectedType,
    failureLabel: "이미지",
    path
  });

  if (!uploadResult.ok) {
    return { ok: false, message: uploadResult.message };
  }

  if (!uploadResult.publicUrl) {
    return { ok: false, message: "업로드된 이미지 경로를 확인할 수 없습니다." };
  }

  return { ok: true, message: "대표 이미지가 업로드되었습니다.", url: uploadResult.publicUrl };
}

export async function uploadAdminCertificateTemplateImage(formData: FormData): Promise<UploadAdminCertificateTemplateImageResult> {
  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!canManageCertificateTemplate(actor.role, actor.status)) {
    return { ok: false, message: "자격 관리자 권한이 필요합니다." };
  }

  const fileValue = formData.get("file");

  if (!isUploadFile(fileValue) || fileValue.size === 0) {
    return { ok: false, message: "자격증 디자인 이미지를 선택해 주세요." };
  }

  if (fileValue.size > maxAdminImageSize) {
    return { ok: false, message: "자격증 디자인 이미지는 5MB 이하 파일만 업로드할 수 있습니다." };
  }

  const claimedType = fileValue.type as (typeof allowedAdminImageTypes)[number];

  if (!allowedAdminImageTypes.includes(claimedType)) {
    return { ok: false, message: "JPG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다." };
  }

  const arrayBuffer = await fileValue.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const detectedType = getDetectedImageType(bytes);

  if (!detectedType || detectedType !== claimedType) {
    return { ok: false, message: "파일 형식이 이미지 시그니처와 일치하지 않습니다." };
  }

  const dateSegment = new Date().toISOString().slice(0, 10);
  const extension = getImageExtension(detectedType);
  const path = `certificates/templates/${dateSegment}/certificate-template-${randomUUID()}.${extension}`;
  const uploadResult = await uploadAdminFileToStorage({
    arrayBuffer,
    contentType: detectedType,
    failureLabel: "자격증 디자인",
    path
  });

  if (!uploadResult.ok) {
    return { ok: false, message: uploadResult.message };
  }

  if (!uploadResult.publicUrl) {
    return { ok: false, message: "업로드된 자격증 디자인 경로를 확인할 수 없습니다." };
  }

  return { ok: true, message: "자격증 디자인 이미지가 업로드되었습니다.", url: uploadResult.publicUrl };
}

export async function uploadAdminContentAttachment(formData: FormData): Promise<UploadAdminContentAttachmentResult> {
  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["content_manager", "course_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const fileValue = formData.get("file");

  if (!isUploadFile(fileValue) || fileValue.size === 0) {
    return { ok: false, message: "PDF 첨부파일을 선택해 주세요." };
  }

  if (fileValue.size > maxAdminAttachmentSize) {
    return { ok: false, message: "PDF 첨부파일은 15MB 이하 파일만 업로드할 수 있습니다." };
  }

  const claimedType = fileValue.type as (typeof allowedAdminAttachmentTypes)[number];

  if (!allowedAdminAttachmentTypes.includes(claimedType)) {
    return { ok: false, message: "PDF 파일만 업로드할 수 있습니다." };
  }

  const arrayBuffer = await fileValue.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const detectedType = getDetectedPdfType(bytes);

  if (!detectedType || detectedType !== claimedType) {
    return { ok: false, message: "파일 형식이 PDF 시그니처와 일치하지 않습니다." };
  }

  const contentTypeSegment = getSafeStorageSegment(String(formData.get("contentType") ?? "activity"));
  const slugSegment = getSafeStorageSegment(String(formData.get("slug") ?? "content"));
  const dateSegment = new Date().toISOString().slice(0, 10);
  const path = `${contentTypeSegment}/attachments/${dateSegment}/${slugSegment}-${randomUUID()}.pdf`;
  const uploadResult = await uploadAdminFileToStorage({
    arrayBuffer,
    contentType: detectedType,
    failureLabel: "첨부파일",
    path
  });

  if (!uploadResult.ok) {
    return { ok: false, message: uploadResult.message };
  }

  if (!uploadResult.publicUrl) {
    return { ok: false, message: "업로드된 첨부파일 경로를 확인할 수 없습니다." };
  }

  return { ok: true, message: "PDF 첨부파일이 업로드되었습니다.", url: uploadResult.publicUrl };
}

export async function saveAdminContent(input: {
  body: string;
  contentType: string;
  imageAlt?: string;
  imageUrl: string;
  locale: string;
  preventOverwrite?: boolean;
  seoDescription?: string;
  seoTitle?: string;
  slug: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const trimmed = {
    body: input.body.trim(),
    contentType: input.contentType.trim(),
    imageAlt: input.imageAlt?.trim() ?? "",
    imageUrl: input.imageUrl.trim(),
    locale: input.locale.trim(),
    preventOverwrite: Boolean(input.preventOverwrite),
    seoDescription: input.seoDescription?.trim() ?? "",
    seoTitle: input.seoTitle?.trim() ?? "",
    slug: input.slug.trim().toLowerCase(),
    sourceUrl: input.sourceUrl.trim(),
    status: input.status.trim(),
    summary: input.summary.trim(),
    title: input.title.trim()
  };

  if (
    !isContentType(trimmed.contentType) ||
    !isLocale(trimmed.locale) ||
    !isContentStatus(trimmed.status) ||
    !trimmed.slug ||
    !trimmed.title
  ) {
    return { ok: false, message: "콘텐츠 필수 항목을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  const allowedRoles =
    trimmed.contentType === "Course"
      ? ["course_manager", "content_manager", "super_admin"]
      : ["content_manager", "super_admin"];

  if (!allowedRoles.includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const { data: existingContent } = await actor.supabase
    .from("admin_content_items")
    .select("id, status, reviewed_at, reviewed_by, translated_from_updated_at")
    .eq("content_type", trimmed.contentType)
    .eq("locale", trimmed.locale)
    .eq("slug", trimmed.slug)
    .maybeSingle();

  if (trimmed.preventOverwrite && existingContent?.id) {
    return {
      ok: false,
      message: "이미 같은 Slug의 게시글이 있습니다. 새 게시글은 Slug를 변경해 주세요."
    };
  }

  if (trimmed.status === "published" && actor.role !== "super_admin") {
    return { ok: false, message: "최종 공개는 최고 관리자만 승인할 수 있습니다." };
  }

  const now = new Date().toISOString();
  const sourceRow = trimmed.locale === "ko"
    ? { updated_at: now }
    : (await actor.supabase
        .from("admin_content_items")
        .select("updated_at")
        .eq("content_type", trimmed.contentType)
        .eq("locale", "ko")
        .eq("slug", trimmed.slug)
        .maybeSingle()).data;
  const sourceUpdatedAt = sourceRow?.updated_at ?? null;

  if (trimmed.locale !== "ko" && !sourceUpdatedAt && trimmed.status === "published") {
    return { ok: false, message: "게시할 번역과 연결된 한국어 원문이 없습니다." };
  }

  if (trimmed.status === "published") {
    if (trimmed.locale !== "ko" && existingContent?.status !== "reviewed") {
      return { ok: false, message: "번역을 먼저 검수 완료 상태로 저장해 주세요." };
    }
    const publishValidation = canPublishTranslation({
      freshness: getTranslationFreshness({
        locale: trimmed.locale,
        sourceUpdatedAt,
        translatedFromUpdatedAt: trimmed.locale === "ko"
          ? sourceUpdatedAt
          : existingContent?.translated_from_updated_at
      }),
      isHighRisk: trimmed.contentType === "Page" && ["privacy", "terms"].includes(trimmed.slug),
      reviewedAt: existingContent?.reviewed_at,
      reviewedBy: existingContent?.reviewed_by,
      title: trimmed.title
    });
    if (!publishValidation.ok) return publishValidation;
  }

  const isReviewed = trimmed.status === "reviewed" || trimmed.status === "published";
  const translatedFromUpdatedAt = trimmed.locale === "ko"
    ? sourceUpdatedAt
    : trimmed.status === "translated" || isReviewed
      ? sourceUpdatedAt
      : existingContent?.translated_from_updated_at ?? null;

  const { data: savedContent, error } = await actor.supabase.from("admin_content_items").upsert(
    {
      content_type: trimmed.contentType,
      created_by: actor.userId,
      body: trimmed.body || null,
      image_alt: trimmed.imageAlt || null,
      image_url: trimmed.imageUrl || null,
      locale: trimmed.locale,
      reviewed_at: isReviewed ? now : null,
      reviewed_by: isReviewed ? actor.userId : null,
      seo_description: trimmed.seoDescription || null,
      seo_title: trimmed.seoTitle || null,
      slug: trimmed.slug,
      source_locale: "ko",
      source_url: trimmed.sourceUrl || null,
      source_updated_at: sourceUpdatedAt,
      status: trimmed.status,
      summary: trimmed.summary || null,
      title: trimmed.title,
      translated_from_updated_at: translatedFromUpdatedAt
    },
    { onConflict: "content_type,locale,slug" }
  ).select("id, status, title").single();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (savedContent?.id) {
    await logPublishEvent({
      action: getPublishEventAction(trimmed.status, Boolean(existingContent?.id)),
      actor,
      itemId: savedContent.id,
      itemType: "content",
      status: savedContent.status,
      title: savedContent.title
    });
  }

  revalidateManagedContent({
    contentType: trimmed.contentType,
    locale: trimmed.locale,
    slug: trimmed.slug
  });
  return { ok: true, message: "콘텐츠 항목이 저장되었습니다." };
}

export async function saveAdminFooterSettings(input: FooterSettings): Promise<SaveAdminContentResult> {
  const settings = normalizeFooterSettings(input);
  const hasEmptyLocalizedField = locales.some((locale) => (
    !input.locales?.[locale]?.description?.trim() || !input.locales?.[locale]?.address?.trim()
  ));

  if (!input.phone?.trim() || !input.email?.trim() || hasEmptyLocalizedField) {
    return { ok: false, message: "푸터의 모든 필수 항목을 입력해 주세요." };
  }

  const result = await saveAdminContent({
    body: serializeFooterSettings(settings),
    contentType: "Page",
    imageUrl: "",
    locale: "ko",
    slug: FOOTER_SETTINGS_SLUG,
    sourceUrl: "",
    status: "published",
    summary: settings.locales.ko.description,
    title: "푸터 설정"
  });

  if (result.ok) {
    revalidatePath("/admin/footer");
    locales.forEach((locale) => revalidatePath(`/${locale}`));
  }

  return result.ok ? { ...result, message: "푸터 설정이 저장되었습니다." } : result;
}

function canManageCourses(role: string, status: string) {
  return status === "active" && ["course_manager", "content_manager", "super_admin"].includes(role);
}

function revalidateCourseCatalog(slug?: string) {
  revalidatePath("/admin/courses");
  revalidatePath("/admin/translations");
  locales.forEach((locale) => {
    revalidatePath(`/${locale}/curriculum`);
    if (slug) {
      revalidatePath(`/${locale}/curriculum/${slug}`);
    }
  });
  revalidatePath("/sitemap.xml");
}

export async function saveAdminCourse(input: {
  categoryKey: string;
  courseId?: string;
  initialOverview?: string;
  initialStatus?: string;
  initialSummary?: string;
  sortOrder: number;
  templateKey: string;
  title: string;
}): Promise<SaveAdminCourseResult> {
  const title = input.title.trim();
  const courseId = input.courseId?.trim() ?? "";
  const categoryKey = input.categoryKey.trim();
  const initialOverview = input.initialOverview?.trim() ?? "";
  const initialStatus = input.initialStatus?.trim() || "draft";
  const initialSummary = input.initialSummary?.trim() ?? "";
  const templateKey = input.templateKey.trim();
  const sortOrder = Number.isFinite(input.sortOrder) ? Math.max(0, Math.trunc(input.sortOrder)) : 0;

  if (
    !courseCategories.includes(categoryKey as CourseCategoryKey) ||
    !courseTemplateKeys.includes(templateKey as CourseTemplateKey) ||
    (!courseId && !courseStatuses.includes(initialStatus as CoursePublishStatus)) ||
    (!courseId && !title)
  ) {
    return { ok: false, message: "과정명과 분류를 확인해 주세요." };
  }

  if (!courseId && initialStatus === "published" && (!initialSummary || !initialOverview)) {
    return { ok: false, message: "공개로 생성하려면 목록 요약과 과정 개요를 입력해 주세요." };
  }

  if (!isCourseClassificationValid(categoryKey, templateKey)) {
    return { ok: false, message: "과정 그룹과 세부 유형의 조합을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();
  if (!actor.userId) return { ok: false, message: "로그인이 필요합니다." };
  if (!canManageCourses(actor.role, actor.status)) return { ok: false, message: "과정 관리자 권한이 필요합니다." };
  if (!courseId && initialStatus === "published" && actor.role !== "super_admin") {
    return { ok: false, message: "공개로 생성하려면 최고 관리자 권한이 필요합니다." };
  }

  if (courseId) {
    const { data, error } = await actor.supabase
      .from("courses")
      .update({ category_key: categoryKey, sort_order: sortOrder, template_key: templateKey })
      .eq("id", courseId)
      .select("id, slug")
      .single();

    if (error) return { ok: false, message: error.message };
    revalidateCourseCatalog(data.slug);
    return { ok: true, message: "과정 공통정보가 수정되었습니다.", courseId: data.id, slug: data.slug };
  }

  const slug = createCourseSlug(title);
  if (!slug) return { ok: false, message: "과정 URL을 만들 수 있는 과정명을 입력해 주세요." };

  const { data, error } = await actor.supabase
    .from("courses")
    .insert({
      category_key: categoryKey,
      created_by: actor.userId,
      slug,
      sort_order: sortOrder,
      template_key: templateKey
    })
    .select("id, slug")
    .single();

  if (error) {
    return { ok: false, message: error.code === "23505" ? "같은 URL의 교육과정이 이미 있습니다." : error.message };
  }

  const { error: localizationError } = await actor.supabase.from("course_localizations").insert({
    course_id: data.id,
    created_by: actor.userId,
    locale: "ko",
    overview: initialOverview || null,
    status: initialStatus,
    summary: initialSummary || null,
    title
  });

  if (localizationError) {
    await actor.supabase.from("courses").delete().eq("id", data.id);
    return { ok: false, message: localizationError.message };
  }

  revalidateCourseCatalog(data.slug);
  return { ok: true, message: "교육과정이 생성되었습니다.", courseId: data.id, slug: data.slug };
}

export async function saveAdminCourseLocalization(input: {
  certificationNote: string;
  contentSections: CourseContentSection[];
  courseId: string;
  curriculumText: string;
  duration: string;
  imageUrl: string;
  imageAlt?: string;
  locale: string;
  overview: string;
  pdfFileName: string;
  pdfUrl: string;
  recommendedText: string;
  scheduleTracks: CourseScheduleTrack[];
  seoDescription?: string;
  seoTitle?: string;
  status: string;
  summary: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const validation = buildCourseLocalizationPayload(input);
  if (!validation.ok) return validation;
  if (!hasSupabaseBrowserEnv()) return { ok: false, message: missingSupabaseMessage };

  const actor = await getActiveAdminRole();
  if (!actor.userId) return { ok: false, message: "로그인이 필요합니다." };
  if (!canManageCourses(actor.role, actor.status)) return { ok: false, message: "과정 관리자 권한이 필요합니다." };

  const payload = validation.payload;
  const { data: course, error: courseError } = await actor.supabase
    .from("courses")
    .select("slug")
    .eq("id", payload.courseId)
    .maybeSingle();

  if (courseError || !course) return { ok: false, message: courseError?.message ?? "과정을 찾을 수 없습니다." };

  const { data: existingLocalization } = await actor.supabase
    .from("course_localizations")
    .select("status, reviewed_at, reviewed_by, translated_from_updated_at")
    .eq("course_id", payload.courseId)
    .eq("locale", payload.locale)
    .maybeSingle();
  const now = new Date().toISOString();
  const sourceRow = payload.locale === "ko"
    ? { updated_at: now }
    : (await actor.supabase
        .from("course_localizations")
        .select("updated_at")
        .eq("course_id", payload.courseId)
        .eq("locale", "ko")
        .maybeSingle()).data;
  const sourceUpdatedAt = sourceRow?.updated_at ?? null;

  if (payload.status === "published") {
    if (actor.role !== "super_admin") {
      return { ok: false, message: "최종 공개는 최고 관리자만 승인할 수 있습니다." };
    }
    if (payload.locale !== "ko" && existingLocalization?.status !== "reviewed") {
      return { ok: false, message: "번역을 먼저 검수 완료 상태로 저장해 주세요." };
    }
    const publishValidation = canPublishTranslation({
      freshness: getTranslationFreshness({
        locale: payload.locale,
        sourceUpdatedAt,
        translatedFromUpdatedAt: payload.locale === "ko"
          ? sourceUpdatedAt
          : existingLocalization?.translated_from_updated_at
      }),
      isHighRisk: false,
      reviewedAt: existingLocalization?.reviewed_at,
      reviewedBy: existingLocalization?.reviewed_by,
      title: payload.title
    });
    if (!publishValidation.ok) return publishValidation;
  }

  const isReviewed = payload.status === "reviewed" || payload.status === "published";
  const translatedFromUpdatedAt = payload.locale === "ko"
    ? sourceUpdatedAt
    : payload.status === "translated" || isReviewed
      ? sourceUpdatedAt
      : existingLocalization?.translated_from_updated_at ?? null;

  const { error } = await actor.supabase.from("course_localizations").upsert({
    certification_note: payload.certificationNote || null,
    content_schema_version: 2,
    content_sections: payload.contentSections,
    course_id: payload.courseId,
    created_by: actor.userId,
    curriculum_items: payload.curriculumItems,
    duration: payload.duration || null,
    image_alt: input.imageAlt?.trim() || null,
    image_url: payload.imageUrl || null,
    locale: payload.locale,
    overview: payload.overview || null,
    pdf_file_name: payload.pdfFileName || null,
    pdf_url: payload.pdfUrl || null,
    recommended_for: payload.recommendedFor,
    reviewed_at: isReviewed ? now : null,
    reviewed_by: isReviewed ? actor.userId : null,
    seo_description: input.seoDescription?.trim() || null,
    seo_title: input.seoTitle?.trim() || null,
    source_locale: "ko",
    source_updated_at: sourceUpdatedAt,
    status: payload.status,
    summary: payload.summary || null,
    schedule_tracks: payload.scheduleTracks,
    title: payload.title,
    translated_from_updated_at: translatedFromUpdatedAt
  }, { onConflict: "course_id,locale" });

  if (error) return { ok: false, message: error.message };
  revalidateCourseCatalog(course.slug);
  return { ok: true, message: `${payload.locale.toUpperCase()} 과정 콘텐츠가 저장되었습니다.` };
}

export async function archiveAdminCourse(input: { courseId: string }): Promise<SaveAdminContentResult> {
  const courseId = input.courseId.trim();
  if (!courseId) return { ok: false, message: "보관할 과정을 확인해 주세요." };
  if (!hasSupabaseBrowserEnv()) return { ok: false, message: missingSupabaseMessage };

  const actor = await getActiveAdminRole();
  if (!actor.userId) return { ok: false, message: "로그인이 필요합니다." };
  if (!canManageCourses(actor.role, actor.status)) return { ok: false, message: "과정 관리자 권한이 필요합니다." };

  const { data: course, error: courseError } = await actor.supabase
    .from("courses")
    .update({ is_active: false })
    .eq("id", courseId)
    .select("slug")
    .single();
  if (courseError) return { ok: false, message: courseError.message };

  const { error } = await actor.supabase
    .from("course_localizations")
    .update({ status: "archived" })
    .eq("course_id", courseId)
    .eq("status", "published");
  if (error) return { ok: false, message: error.message };

  revalidateCourseCatalog(course.slug);
  return { ok: true, message: "교육과정이 보관 처리되었습니다." };
}

export async function restoreAdminCourse(input: { courseId: string }): Promise<SaveAdminContentResult> {
  const courseId = input.courseId.trim();
  if (!courseId) return { ok: false, message: "활성화할 과정을 확인해 주세요." };
  if (!hasSupabaseBrowserEnv()) return { ok: false, message: missingSupabaseMessage };

  const actor = await getActiveAdminRole();
  if (!actor.userId) return { ok: false, message: "로그인이 필요합니다." };
  if (!canManageCourses(actor.role, actor.status)) return { ok: false, message: "과정 관리자 권한이 필요합니다." };

  const { data: course, error } = await actor.supabase
    .from("courses")
    .update({ is_active: true })
    .eq("id", courseId)
    .select("slug")
    .single();
  if (error) return { ok: false, message: error.message };

  revalidateCourseCatalog(course.slug);
  return { ok: true, message: "교육과정이 다시 활성화되었습니다. 언어별 게시 상태를 확인해 주세요." };
}

export async function deleteAdminCourse(input: { courseId: string }): Promise<SaveAdminContentResult> {
  const courseId = input.courseId.trim();
  if (!courseId) return { ok: false, message: "삭제할 과정을 확인해 주세요." };
  if (!hasSupabaseBrowserEnv()) return { ok: false, message: missingSupabaseMessage };

  const actor = await getActiveAdminRole();
  if (!actor.userId) return { ok: false, message: "로그인이 필요합니다." };
  if (!canManageCourses(actor.role, actor.status)) return { ok: false, message: "과정 관리자 권한이 필요합니다." };

  const { data: course, error: courseError } = await actor.supabase
    .from("courses")
    .select("slug, is_active")
    .eq("id", courseId)
    .maybeSingle();
  if (courseError || !course) return { ok: false, message: courseError?.message ?? "과정을 찾을 수 없습니다." };
  if (course.is_active) return { ok: false, message: "교육과정을 먼저 보관 처리해 주세요." };

  const { count, error: countError } = await actor.supabase
    .from("course_localizations")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("status", "published");
  if (countError) return { ok: false, message: countError.message };
  if ((count ?? 0) > 0) return { ok: false, message: "공개 중인 언어 콘텐츠가 있어 삭제할 수 없습니다." };

  const { error } = await actor.supabase.from("courses").delete().eq("id", courseId);
  if (error) return { ok: false, message: error.message };
  revalidateCourseCatalog(course.slug);
  return { ok: true, message: "교육과정이 영구 삭제되었습니다." };
}

export async function saveAdminBanner(input: {
  endsAt: string;
  id?: string;
  imageUrl: string;
  placement: string;
  startsAt: string;
  status: string;
  targetUrl: string;
  title: string;
}): Promise<SaveAdminContentResult> {
  const trimmed = {
    endsAt: input.endsAt.trim(),
    id: input.id?.trim() ?? "",
    imageUrl: input.imageUrl.trim(),
    placement: input.placement.trim(),
    startsAt: input.startsAt.trim(),
    status: input.status.trim(),
    targetUrl: input.targetUrl.trim(),
    title: input.title.trim()
  };

  if (
    !trimmed.title ||
    !isBannerPlacement(trimmed.placement) ||
    !isBannerStatus(trimmed.status) ||
    (trimmed.startsAt && !isValidDate(trimmed.startsAt)) ||
    (trimmed.endsAt && !isValidDate(trimmed.endsAt))
  ) {
    return { ok: false, message: "배너 필수 항목과 날짜 형식을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (!["content_manager", "super_admin"].includes(actor.role) || actor.status !== "active") {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const payload = {
    created_by: actor.userId,
    ends_at: trimmed.endsAt || null,
    image_url: trimmed.imageUrl || null,
    placement: trimmed.placement,
    starts_at: trimmed.startsAt || null,
    status: trimmed.status,
    target_url: trimmed.targetUrl || null,
    title: trimmed.title
  };

  const { data: savedBanner, error } = trimmed.id
    ? await actor.supabase.from("banners").update(payload).eq("id", trimmed.id).select("id, status, title").single()
    : await actor.supabase.from("banners").insert(payload).select("id, status, title").single();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (savedBanner?.id) {
    await logPublishEvent({
      action: getPublishEventAction(trimmed.status, Boolean(trimmed.id)),
      actor,
      itemId: savedBanner.id,
      itemType: "banner",
      status: savedBanner.status,
      title: savedBanner.title
    });
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, message: trimmed.id ? "배너 항목이 수정되었습니다." : "배너 항목이 저장되었습니다." };
}

export async function deleteAdminManagedItem(input: {
  id: string;
  itemType: string;
}): Promise<DeleteAdminContentResult> {
  const trimmed = {
    id: input.id.trim(),
    itemType: input.itemType.trim()
  };

  if (!trimmed.id || !["content", "banner"].includes(trimmed.itemType)) {
    return { ok: false, message: "삭제할 항목을 확인해 주세요." };
  }

  if (!hasSupabaseBrowserEnv()) {
    return { ok: false, message: missingSupabaseMessage };
  }

  const actor = await getActiveAdminRole();

  if (!actor.userId) {
    return { ok: false, message: "로그인이 필요합니다." };
  }

  if (actor.status !== "active") {
    return { ok: false, message: "활성 관리자 계정이 필요합니다." };
  }

  if (trimmed.itemType === "banner") {
    if (!["content_manager", "super_admin"].includes(actor.role)) {
      return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
    }

    const { data: bannerItem, error: bannerFindError } = await actor.supabase
      .from("banners")
      .select("title, status")
      .eq("id", trimmed.id)
      .maybeSingle();

    if (bannerFindError) {
      return { ok: false, message: bannerFindError.message };
    }

    if (!bannerItem) {
      return { ok: false, message: "삭제할 배너를 찾을 수 없습니다." };
    }

    const { error } = await actor.supabase.from("banners").delete().eq("id", trimmed.id);

    if (error) {
      return { ok: false, message: error.message };
    }

    await logPublishEvent({
      action: "deleted",
      actor,
      itemId: trimmed.id,
      itemType: "banner",
      status: bannerItem.status,
      title: bannerItem.title
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { ok: true, message: "배너 항목이 삭제되었습니다." };
  }

  const { data: contentItem, error: contentError } = await actor.supabase
    .from("admin_content_items")
    .select("content_type, locale, slug, status, title")
    .eq("id", trimmed.id)
    .maybeSingle();

  if (contentError) {
    return { ok: false, message: contentError.message };
  }

  if (!contentItem) {
    return { ok: false, message: "삭제할 콘텐츠를 찾을 수 없습니다." };
  }

  const allowedRoles =
    contentItem.content_type === "Course"
      ? ["course_manager", "content_manager", "super_admin"]
      : ["content_manager", "super_admin"];

  if (!allowedRoles.includes(actor.role)) {
    return { ok: false, message: "콘텐츠 관리자 권한이 필요합니다." };
  }

  const { error } = await actor.supabase.from("admin_content_items").delete().eq("id", trimmed.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  await logPublishEvent({
    action: "deleted",
    actor,
    itemId: trimmed.id,
    itemType: "content",
    status: contentItem.status,
    title: contentItem.title
  });

  if (isContentType(contentItem.content_type) && isLocale(contentItem.locale)) {
    revalidateManagedContent({
      contentType: contentItem.content_type,
      locale: contentItem.locale,
      slug: contentItem.slug
    });
  } else {
    revalidatePath("/admin");
  }
  revalidatePath("/");
  return { ok: true, message: "콘텐츠 항목이 삭제되었습니다." };
}
