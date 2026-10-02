import type { Locale } from "@/i18n/config";
import { getCopy, getCourses, type Course } from "@/lib/content";
import {
  normalizeCourseSections,
  normalizeScheduleTracks,
  type CourseCategoryKey,
  type CourseLocale,
  type CourseTemplateKey,
  type PublishedCourse,
  getCourseFallbackPolicy
} from "@/lib/course-model";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

type CourseLocalizationRow = {
  certification_note: string | null;
  content_sections: unknown;
  course_id: string;
  curriculum_items: string[] | null;
  duration: string | null;
  image_url: string | null;
  locale: CourseLocale;
  overview: string | null;
  pdf_file_name: string | null;
  pdf_url: string | null;
  recommended_for: string[] | null;
  schedule_tracks: unknown;
  status: string;
  summary: string | null;
  title: string;
  updated_at: string;
};

type CourseRow = {
  category_key: CourseCategoryKey;
  course_localizations: CourseLocalizationRow[] | CourseLocalizationRow | null;
  id: string;
  is_active: boolean;
  slug: string;
  sort_order: number;
  template_key: CourseTemplateKey;
  updated_at: string;
};

function splitFallbackAudience(value: string) {
  return value
    .split(/,|및|또는/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapFallbackCourse(course: Course, sortOrder: number): PublishedCourse {
  const templateKey: CourseTemplateKey = course.categoryKey === "certification"
    ? "certification"
    : course.slug === "취업전문과정"
      ? "career"
      : course.slug === "창업전문과정"
        ? "startup"
        : course.slug.includes("주말")
          ? "hobby"
          : "practical";
  return {
    category: course.category,
    categoryKey: course.categoryKey,
    certificationNote: course.certificationNote,
    contentSections: [],
    curriculumItems: course.curriculum,
    duration: course.durationHighlights?.[0] ?? "",
    imageUrl: course.imageUrl,
    overview: course.overview,
    recommendedFor: splitFallbackAudience(course.audience),
    scheduleTracks: [],
    slug: course.slug,
    sortOrder,
    summary: course.summary,
    templateKey,
    title: course.title
  };
}

function getFallbackCourses(locale: string) {
  return getCourseFallbackPolicy(locale, hasSupabaseBrowserEnv()) === "static"
    ? getCourses(locale).map(mapFallbackCourse)
    : [];
}

function getCategoryLabel(locale: string, categoryKey: CourseCategoryKey) {
  if (locale === "zh-CN") return getCopy(locale).curriculumCatalog.categories[categoryKey];
  return getCourses(locale).find((course) => course.categoryKey === categoryKey)?.category ?? categoryKey;
}

function getLocalization(row: CourseRow) {
  if (Array.isArray(row.course_localizations)) {
    return row.course_localizations[0] ?? null;
  }

  return row.course_localizations;
}

function mapPublishedCourse(row: CourseRow, locale: string): PublishedCourse | null {
  const localization = getLocalization(row);

  if (!localization || localization.status !== "published") {
    return null;
  }

  return {
    category: getCategoryLabel(locale, row.category_key),
    categoryKey: row.category_key,
    certificationNote: localization.certification_note ?? "",
    contentSections: normalizeCourseSections(localization.content_sections),
    curriculumItems: localization.curriculum_items ?? [],
    duration: localization.duration ?? "",
    id: row.id,
    imageUrl: localization.image_url ?? "",
    overview: localization.overview ?? "",
    pdfFileName: localization.pdf_file_name ?? undefined,
    pdfUrl: localization.pdf_url ?? undefined,
    recommendedFor: localization.recommended_for ?? [],
    scheduleTracks: normalizeScheduleTracks(localization.schedule_tracks),
    slug: row.slug,
    sortOrder: row.sort_order,
    summary: localization.summary ?? "",
    templateKey: row.template_key ?? "practical",
    title: localization.title,
    updatedAt: localization.updated_at || row.updated_at
  };
}

export async function getPublishedCourses(locale: Locale): Promise<PublishedCourse[]> {
  if (!hasSupabaseBrowserEnv()) {
    return getFallbackCourses(locale);
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id, slug, category_key, template_key, sort_order, is_active, updated_at,
      course_localizations!inner(
        course_id, locale, title, summary, overview, duration,
        curriculum_items, recommended_for, certification_note, schedule_tracks, content_sections,
        image_url, pdf_url, pdf_file_name, status, updated_at
      )
    `)
    .eq("is_active", true)
    .eq("course_localizations.locale", locale)
    .eq("course_localizations.status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return getFallbackCourses(locale);
  }

  return (data as unknown as CourseRow[])
    .map((row) => mapPublishedCourse(row, locale))
    .filter((course): course is PublishedCourse => Boolean(course));
}

export async function getPublishedCourseBySlug(slug: string, locale: Locale) {
  const courses = await getPublishedCourses(locale);
  return courses.find((course) => course.slug === slug);
}
