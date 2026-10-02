export const adminCourseLocales = ["ko", "en", "es", "zh-CN"] as const;
export const adminCourseStatuses = ["draft", "translated", "reviewed", "published", "archived"] as const;
export const adminCourseSections = [
  "main",
  "flow-1",
  "flow-2",
  "flow-3",
  "flow-4",
  "panel-goal",
  "panel-strength",
  "panel-audience",
  "technique-1",
  "process-1"
] as const;

export type AdminCourseLocale = (typeof adminCourseLocales)[number];
export type AdminCourseStatus = (typeof adminCourseStatuses)[number];
export type AdminCourseSection = (typeof adminCourseSections)[number];

export type AdminCourseOption = {
  category: string;
  label: string;
  slug: string;
  summary: string;
};

export type AdminCourseContentInput = {
  body: string;
  courseSection: string;
  courseSlug: string;
  imageUrl: string;
  locale: string;
  sourceUrl: string;
  status: string;
  summary: string;
  title: string;
};

export type AdminCourseContentPayload = {
  body: string;
  contentType: "Course";
  imageUrl: string;
  locale: AdminCourseLocale;
  slug: string;
  sourceUrl: string;
  status: AdminCourseStatus;
  summary: string;
  title: string;
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

export function buildAdminCourseContentInput(
  input: AdminCourseContentInput
): ValidationResult<AdminCourseContentPayload> {
  const normalized = {
    body: input.body.trim(),
    courseSection: input.courseSection.trim(),
    courseSlug: input.courseSlug.trim(),
    imageUrl: input.imageUrl.trim(),
    locale: input.locale.trim(),
    sourceUrl: input.sourceUrl.trim(),
    status: input.status.trim(),
    summary: input.summary.trim(),
    title: input.title.trim()
  };
  const errors: string[] = [];

  if (!normalized.courseSlug) {
    errors.push("과정을 선택해 주세요.");
  }

  if (!adminCourseSections.includes(normalized.courseSection as AdminCourseSection)) {
    errors.push("관리 섹션을 확인해 주세요.");
  }

  if (!adminCourseLocales.includes(normalized.locale as AdminCourseLocale)) {
    errors.push("언어 값을 확인해 주세요.");
  }

  if (!adminCourseStatuses.includes(normalized.status as AdminCourseStatus)) {
    errors.push("게시 상태를 확인해 주세요.");
  }

  if (!normalized.title) {
    errors.push("제목을 입력해 주세요.");
  }

  if (errors.length > 0) {
    return { ok: false, message: errors.join(" ") };
  }

  return {
    ok: true,
    payload: {
      body: normalized.body,
      contentType: "Course",
      imageUrl: normalized.imageUrl,
      locale: normalized.locale as AdminCourseLocale,
      slug: getAdminCourseManagedSlug(normalized.courseSlug, normalized.courseSection),
      sourceUrl: normalized.sourceUrl,
      status: normalized.status as AdminCourseStatus,
      summary: normalized.summary,
      title: normalized.title
    }
  };
}

export function getAdminCourseManagedSlug(courseSlug: string, courseSection: string) {
  const normalizedCourseSlug = courseSlug.trim();
  const normalizedSection = courseSection.trim();

  if (!normalizedCourseSlug || normalizedSection === "main") {
    return normalizedCourseSlug;
  }

  return `${normalizedCourseSlug}-${normalizedSection}`;
}

export function parseAdminCourseManagedSlug(
  slug: string,
  courseOptions: Array<Pick<AdminCourseOption, "slug">>
) {
  const matchingCourse = courseOptions
    .slice()
    .sort((a, b) => b.slug.length - a.slug.length)
    .find((course) => slug === course.slug || slug.startsWith(`${course.slug}-`));

  if (!matchingCourse) {
    return { courseSection: "main", courseSlug: slug };
  }

  if (slug === matchingCourse.slug) {
    return { courseSection: "main", courseSlug: matchingCourse.slug };
  }

  return {
    courseSection: slug.slice(matchingCourse.slug.length + 1),
    courseSlug: matchingCourse.slug
  };
}

export function getAdminCourseSectionLabel(section: string) {
  if (section === "main") return "대표 정보";
  if (section === "flow-1") return "커리큘럼 흐름 1";
  if (section === "flow-2") return "커리큘럼 흐름 2";
  if (section === "flow-3") return "커리큘럼 흐름 3";
  if (section === "flow-4") return "커리큘럼 흐름 4";
  if (section === "panel-goal") return "학습 목표";
  if (section === "panel-strength") return "과정 강점";
  if (section === "panel-audience") return "추천 대상";
  if (section === "technique-1") return "핵심 테크닉";
  if (section === "process-1") return "수업 진행 과정";
  return section;
}

export function getAdminCourseSectionHelp(section: string) {
  if (section === "main") {
    return "과정 목록 카드와 상세 히어로의 제목, 요약, 대표 이미지, 개요를 바꿉니다.";
  }

  if (section.startsWith("flow-")) {
    return "상세 페이지의 커리큘럼 흐름 카드에 표시됩니다. 제목과 짧은 설명을 입력하세요.";
  }

  if (section.startsWith("panel-")) {
    return "상세 페이지의 정보 패널에 표시됩니다. 본문은 줄바꿈 목록으로 입력하세요.";
  }

  if (section.startsWith("technique-")) {
    return "핵심 테크닉 칩 영역에 표시됩니다. 본문은 줄바꿈 목록으로 입력하세요.";
  }

  if (section.startsWith("process-")) {
    return "수업 진행 과정 영역에 표시됩니다. 본문은 줄바꿈 목록으로 입력하세요.";
  }

  return "";
}

export function getAdminCourseStatusLabel(status: string) {
  if (status === "published") return "공개";
  if (status === "draft") return "임시저장";
  if (status === "translated") return "번역완료";
  if (status === "reviewed") return "검수완료";
  if (status === "archived") return "비공개";
  return status;
}
