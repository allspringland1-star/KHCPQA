import { formatInquiryReceipt } from "@/lib/receipts";
import {
  formatAdminCertificationDate,
  normalizeCertificateTemplate,
  type CertificateTemplate
} from "@/lib/admin-certifications";
import { formatPhoneNumber } from "@/lib/phone";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  normalizeCourseSections,
  normalizeScheduleTracks,
  type AdminCourseRecord,
  type CourseCategoryKey,
  type CourseLocale,
  type CoursePublishStatus,
  type CourseTemplateKey
} from "@/lib/course-model";

export type AdminUserRow = {
  country: string;
  id: string;
  interestedCourse: string;
  marketingOptIn: boolean;
  name: string;
  email: string;
  phone: string;
  preferredLocale: string;
  role: string;
  status: string;
  lastLoginAt: string;
};

export type AdminCertificationRow = {
  adminNote: string;
  course: string;
  expiresAt: string;
  expiresAtDisplay: string;
  issuedAt: string;
  issuedAtRaw: string;
  number: string;
  status: string;
  user: string;
  userEmail: string;
  verificationCode: string;
};

export type AdminCertificateTemplateRow = CertificateTemplate & {
  id: string;
  updatedAt: string;
};

export type AdminInquiryRow = {
  country: string;
  email: string;
  id: string;
  locale: string;
  managerNote: string;
  message: string;
  name: string;
  organization: string;
  phone: string;
  receipt: string;
  status: string;
  submittedAt: string;
  type: string;
};

export type AdminContentRow = {
  body?: string;
  endsAt?: string;
  id?: string;
  imageAlt?: string;
  imageUrl?: string;
  locale: string;
  reviewedAt?: string;
  reviewedBy?: string;
  seoDescription?: string;
  seoTitle?: string;
  sourceUrl?: string;
  sourceUpdatedAt?: string;
  startsAt?: string;
  status: string;
  summary?: string;
  title: string;
  translatedFromUpdatedAt?: string;
  type: string;
  updatedAt: string;
  updatedAtRaw?: string;
  updatedBy: string;
  slug?: string;
};

export type AdminPublishEventRow = {
  action: string;
  actor: string;
  itemType: string;
  status: string;
  title: string;
  updatedAt: string;
};

type ProfileRow = {
  country: string | null;
  id: string;
  email: string | null;
  full_name: string | null;
  interested_course: string | null;
  marketing_opt_in: boolean | null;
  phone: string | null;
  preferred_locale: string;
  role: string;
  status: string;
  updated_at: string;
};

type CertificationRow = {
  admin_note: string | null;
  certificate_number: string;
  course_title: string;
  expires_at: string | null;
  issued_at: string;
  status: string;
  user_id: string;
  verification_code: string | null;
};

type CertificateTemplateRow = {
  background_image_url: string | null;
  id: string;
  layout_json: unknown;
  name: string;
  status: string;
  updated_at: string;
};

type InquiryRow = {
  country: string | null;
  created_at: string;
  email: string;
  id: string;
  inquiry_type: string;
  locale: string;
  manager_note: string | null;
  message: string;
  name: string;
  organization: string | null;
  phone: string | null;
  status: string;
};

type ContentRow = {
  body: string | null;
  content_type: string;
  created_by: string | null;
  id: string;
  image_alt: string | null;
  image_url: string | null;
  locale: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  seo_description: string | null;
  seo_title: string | null;
  source_url: string | null;
  source_updated_at: string | null;
  slug: string;
  status: string;
  summary: string | null;
  title: string;
  translated_from_updated_at: string | null;
  updated_at: string;
};

type BannerRow = {
  created_by: string | null;
  ends_at: string | null;
  id: string;
  image_url: string | null;
  placement: string;
  starts_at: string | null;
  status: string;
  target_url: string | null;
  title: string;
  updated_at: string;
};

type PublishEventRow = {
  action: string;
  actor_id: string | null;
  created_at: string;
  item_type: string;
  status: string;
  title: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, country, interested_course, marketing_opt_in, preferred_locale, role, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return (data as ProfileRow[]).map((profile) => ({
    country: profile.country || "",
    id: profile.id,
    interestedCourse: profile.interested_course || "",
    marketingOptIn: Boolean(profile.marketing_opt_in),
    name: profile.full_name || profile.email || "Unnamed member",
    email: profile.email || "-",
    phone: profile.phone ? formatPhoneNumber(profile.phone, profile.country ?? "") : "",
    preferredLocale: profile.preferred_locale || "ko",
    role: profile.role,
    status: profile.status,
    lastLoginAt: formatDate(profile.updated_at)
  }));
}

export async function getAdminCertifications(): Promise<AdminCertificationRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("certificate_number, course_title, expires_at, issued_at, status, user_id, verification_code, admin_note")
    .order("issued_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  const certificationRows = data as CertificationRow[];
  const userIds = Array.from(new Set(certificationRows.map((certification) => certification.user_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);
  const profileById = new Map(
    ((profiles as Array<Pick<ProfileRow, "email" | "full_name" | "id">> | null) ?? []).map((profile) => [
      profile.id,
      {
        email: profile.email || "",
        name: profile.full_name || profile.email || "Unnamed member"
      }
    ])
  );

  return certificationRows.map((certification) => ({
    adminNote: certification.admin_note || "",
    course: certification.course_title,
    expiresAt: certification.expires_at || "",
    expiresAtDisplay: formatAdminCertificationDate(certification.expires_at || ""),
    issuedAt: formatDate(certification.issued_at),
    issuedAtRaw: certification.issued_at,
    number: certification.certificate_number,
    status: certification.status,
    user: profileById.get(certification.user_id)?.name ?? "Unnamed member",
    userEmail: profileById.get(certification.user_id)?.email ?? "",
    verificationCode: certification.verification_code || certification.certificate_number
  }));
}

function mapCertificateTemplate(row: CertificateTemplateRow): AdminCertificateTemplateRow {
  const template = normalizeCertificateTemplate({
    backgroundImageUrl: row.background_image_url || "",
    layout: row.layout_json,
    name: row.name,
    status: row.status
  });

  return {
    ...template,
    id: row.id,
    updatedAt: formatDate(row.updated_at)
  };
}

export async function getAdminCertificateTemplate(): Promise<AdminCertificateTemplateRow | null> {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("certificate_templates")
    .select("id, name, background_image_url, layout_json, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapCertificateTemplate(data as CertificateTemplateRow);
}

export async function getPublishedCertificateTemplate(): Promise<CertificateTemplate | null> {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("certificate_templates")
    .select("id, name, background_image_url, layout_json, status, updated_at")
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapCertificateTemplate(data as CertificateTemplateRow);
}

export async function getAdminInquiries(): Promise<AdminInquiryRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, name, organization, email, phone, country, inquiry_type, locale, message, status, manager_note, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return [];
  }

  return (data as InquiryRow[]).map((inquiry) => ({
    country: inquiry.country || "-",
    email: inquiry.email,
    id: inquiry.id,
    locale: inquiry.locale || "ko",
    managerNote: inquiry.manager_note || "",
    message: inquiry.message,
    name: inquiry.name,
    organization: inquiry.organization || "-",
    phone: inquiry.phone || "",
    receipt: formatInquiryReceipt(inquiry.id, inquiry.created_at),
    status: inquiry.status,
    submittedAt: formatDate(inquiry.created_at),
    type: inquiry.inquiry_type
  }));
}

export async function getAdminContentRows(): Promise<AdminContentRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const [{ data: contentItems, error: contentError }, { data: banners, error: bannerError }] = await Promise.all([
    supabase
      .from("admin_content_items")
      .select("id, content_type, title, locale, slug, status, summary, body, source_url, image_url, image_alt, seo_title, seo_description, source_updated_at, translated_from_updated_at, reviewed_by, reviewed_at, created_by, updated_at")
      .order("updated_at", { ascending: false })
      .limit(500),
    supabase
      .from("banners")
      .select("id, title, placement, status, target_url, image_url, starts_at, ends_at, created_by, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20)
  ]);

  if ((contentError || !contentItems) && (bannerError || !banners)) {
    return [];
  }

  const rows = [
    ...((contentItems as ContentRow[] | null) ?? []).map((item) => ({
      body: item.body || "",
      id: item.id,
      imageAlt: item.image_alt || "",
      imageUrl: item.image_url || "",
      locale: item.locale,
      reviewedAt: item.reviewed_at || "",
      reviewedBy: item.reviewed_by || "",
      seoDescription: item.seo_description || "",
      seoTitle: item.seo_title || "",
      slug: item.slug,
      sourceUrl: item.source_url || "",
      sourceUpdatedAt: item.source_updated_at || "",
      status: item.status,
      summary: item.summary || "",
      title: item.title,
      translatedFromUpdatedAt: item.translated_from_updated_at || "",
      type: item.content_type,
      updatedAt: formatDate(item.updated_at),
      updatedAtRaw: item.updated_at,
      updatedBy: "Admin"
    })),
    ...((banners as BannerRow[] | null) ?? []).map((banner) => ({
      endsAt: banner.ends_at || "",
      id: banner.id,
      imageUrl: banner.image_url || "",
      locale: banner.placement,
      sourceUrl: banner.target_url || "",
      startsAt: banner.starts_at || "",
      status: banner.status,
      title: banner.title,
      type: "Banner",
      updatedAt: formatDate(banner.updated_at),
      updatedAtRaw: banner.updated_at,
      updatedBy: "Admin"
    }))
  ];

  return rows
    .sort((a, b) => (b.updatedAtRaw ?? b.updatedAt).localeCompare(a.updatedAtRaw ?? a.updatedAt))
    .slice(0, 50);
}

export async function getAdminCourses(): Promise<AdminCourseRecord[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id, slug, category_key, template_key, sort_order, is_active, created_at, updated_at,
      course_localizations(
        id, course_id, locale, title, summary, overview, duration,
        curriculum_items, recommended_for, certification_note, schedule_tracks, content_sections,
        image_url, image_alt, pdf_url, pdf_file_name, status,
        seo_title, seo_description, source_updated_at, translated_from_updated_at,
        reviewed_by, reviewed_at, updated_at
      )
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as unknown as Array<{
    category_key: CourseCategoryKey;
    course_localizations: Array<{
      certification_note: string | null;
      content_sections: unknown;
      course_id: string;
      curriculum_items: string[] | null;
      duration: string | null;
      id: string;
      image_alt: string | null;
      image_url: string | null;
      locale: CourseLocale;
      overview: string | null;
      pdf_file_name: string | null;
      pdf_url: string | null;
      recommended_for: string[] | null;
      schedule_tracks: unknown;
      reviewed_at: string | null;
      reviewed_by: string | null;
      seo_description: string | null;
      seo_title: string | null;
      source_updated_at: string | null;
      status: CoursePublishStatus;
      summary: string | null;
      title: string;
      translated_from_updated_at: string | null;
      updated_at: string;
    }> | null;
    created_at: string;
    id: string;
    is_active: boolean;
    slug: string;
    sort_order: number;
    template_key: CourseTemplateKey;
    updated_at: string;
  }>).map((course) => ({
    categoryKey: course.category_key,
    createdAt: course.created_at,
    id: course.id,
    isActive: course.is_active,
    localizations: (course.course_localizations ?? []).map((localization) => ({
      certificationNote: localization.certification_note ?? "",
      contentSections: normalizeCourseSections(localization.content_sections),
      courseId: localization.course_id,
      curriculumItems: localization.curriculum_items ?? [],
      duration: localization.duration ?? "",
      id: localization.id,
      imageAlt: localization.image_alt ?? "",
      imageUrl: localization.image_url ?? "",
      locale: localization.locale,
      overview: localization.overview ?? "",
      pdfFileName: localization.pdf_file_name ?? "",
      pdfUrl: localization.pdf_url ?? "",
      recommendedFor: localization.recommended_for ?? [],
      scheduleTracks: normalizeScheduleTracks(localization.schedule_tracks),
      reviewedAt: localization.reviewed_at ?? "",
      reviewedBy: localization.reviewed_by ?? "",
      seoDescription: localization.seo_description ?? "",
      seoTitle: localization.seo_title ?? "",
      sourceUpdatedAt: localization.source_updated_at ?? "",
      status: localization.status,
      summary: localization.summary ?? "",
      title: localization.title,
      translatedFromUpdatedAt: localization.translated_from_updated_at ?? "",
      updatedAt: localization.updated_at
    })),
    slug: course.slug,
    sortOrder: course.sort_order,
    templateKey: course.template_key ?? "practical",
    updatedAt: course.updated_at
  }));
}

export async function getAdminPublishEvents(): Promise<AdminPublishEventRow[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_publish_events")
    .select("item_type, action, title, status, actor_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return [];
  }

  const eventRows = data as PublishEventRow[];
  const actorIds = Array.from(
    new Set(eventRows.map((event) => event.actor_id).filter((actorId): actorId is string => Boolean(actorId)))
  );
  const { data: profiles } = actorIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", actorIds)
    : { data: [] };
  const actorById = new Map(
    ((profiles as Array<Pick<ProfileRow, "email" | "full_name" | "id">> | null) ?? []).map((profile) => [
      profile.id,
      profile.full_name || profile.email || profile.id.slice(0, 8)
    ])
  );

  return eventRows.map((event) => ({
    action: event.action,
    actor: event.actor_id ? actorById.get(event.actor_id) ?? event.actor_id.slice(0, 8) : "System",
    itemType: event.item_type,
    status: event.status,
    title: event.title,
    updatedAt: formatDate(event.created_at)
  }));
}
