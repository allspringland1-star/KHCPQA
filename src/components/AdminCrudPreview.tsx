"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { BookOpenCheck, CheckCircle2, FilePenLine, ImagePlus, Save, ShieldCheck, Trash2 } from "lucide-react";
import {
  deleteAdminManagedItem,
  saveAdminBanner,
  saveAdminCertification,
  saveAdminContent,
  saveAdminInquiry,
  type DeleteAdminContentResult,
  type SaveAdminCertificationResult,
  type SaveAdminContentResult,
  type SaveAdminInquiryResult
} from "@/app/admin/actions";
import type { AdminContentRow } from "@/lib/admin-data";

type AdminFormType = "course" | "content" | "inquiry" | "certification" | "banner";
type CourseOption = {
  label: string;
  slug: string;
};

type AdminField = {
  label: string;
  name: string;
  type?: "input" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

type ActionResult = SaveAdminCertificationResult | SaveAdminContentResult | SaveAdminInquiryResult | DeleteAdminContentResult;

const adminForms: Record<AdminFormType, {
  title: string;
  description: string;
  icon: typeof FilePenLine;
  fields: AdminField[];
}> = {
  course: {
    title: "교육과정 관리",
    description: "과정 목록/상세 화면에 노출되는 제목, 요약, 상세 섹션을 관리합니다.",
    icon: BookOpenCheck,
    fields: [
      { label: "과정", name: "courseSlug", type: "select", options: [], required: true },
      { label: "언어", name: "locale", type: "select", options: ["ko", "en", "es", "zh-CN"], required: true },
      {
        label: "관리 영역",
        name: "courseSection",
        type: "select",
        options: ["main", "flow-1", "flow-2", "flow-3", "flow-4", "panel-goal", "panel-strength", "panel-audience", "technique-1", "process-1"],
        required: true
      },
      { label: "게시 상태", name: "status", type: "select", options: ["draft", "translated", "reviewed", "published", "archived"], required: true },
      { label: "제목", name: "title", placeholder: "과정명 또는 상세 섹션 제목", required: true },
      { label: "요약", name: "summary", type: "textarea", placeholder: "과정 카드/상세 상단에 사용할 요약" },
      { label: "상세 본문", name: "body", type: "textarea", placeholder: "상세 본문 또는 줄바꿈 목록. flow/process/technique 섹션은 한 줄씩 입력하면 목록으로 표시됩니다." },
      { label: "대표 이미지 URL", name: "imageUrl", placeholder: "/assets/course-image.jpg 또는 https://..." },
      { label: "원본 URL", name: "sourceUrl", placeholder: "https://www.smc365.ac/..." }
    ]
  },
  content: {
    title: "콘텐츠 등록/수정",
    description: "페이지, 커뮤니티 게시글, 후기의 언어별 콘텐츠를 관리합니다.",
    icon: FilePenLine,
    fields: [
      { label: "콘텐츠 유형", name: "contentType", type: "select", options: ["Page", "Activity", "Review"], required: true },
      { label: "언어", name: "locale", type: "select", options: ["ko", "en", "es", "zh-CN"], required: true },
      { label: "Slug", name: "slug", placeholder: "about 또는 activity-notice", required: true },
      { label: "제목", name: "title", placeholder: "콘텐츠 제목", required: true },
      { label: "게시 상태", name: "status", type: "select", options: ["draft", "translated", "reviewed", "published", "archived"], required: true },
      { label: "원본 URL", name: "sourceUrl", placeholder: "https://www.smc365.ac/..." },
      { label: "대표 이미지 URL", name: "imageUrl", placeholder: "/assets/activity-image.jpg 또는 https://..." },
      { label: "본문 요약", name: "summary", type: "textarea", placeholder: "관리자 목록과 SEO에 사용할 요약" },
      { label: "상세 본문", name: "body", type: "textarea", placeholder: "공개 상세 페이지 소개 문단에 사용할 본문" }
    ]
  },
  inquiry: {
    title: "문의 처리",
    description: "문의 상태와 담당자 메모를 관리합니다.",
    icon: Save,
    fields: [
      { label: "접수번호", name: "receipt", placeholder: "KHCPQA-2026-PREVIEW", required: true },
      { label: "처리 상태", name: "inquiryStatus", type: "select", options: ["new", "in_review", "answered", "closed"], required: true },
      { label: "담당자 메모", name: "memo", type: "textarea", placeholder: "후속 연락, 요청 사항, 내부 메모" }
    ]
  },
  certification: {
    title: "자격 데이터 등록",
    description: "회원의 자격번호, 발급일, 상태, 검증 코드를 관리합니다.",
    icon: ShieldCheck,
    fields: [
      { label: "사용자", name: "user", placeholder: "회원명 또는 이메일", required: true },
      { label: "과정", name: "course", placeholder: "과정명", required: true },
      { label: "자격번호", name: "certificateNumber", placeholder: "SMC-2026-001", required: true },
      { label: "발급일", name: "issuedAt", placeholder: "2026-05-18", required: true },
      { label: "상태", name: "certificateStatus", type: "select", options: ["issued", "expired", "revoked"], required: true },
      { label: "검증 코드", name: "verificationCode", placeholder: "PUBLIC-CODE-001" }
    ]
  },
  banner: {
    title: "팝업/배너 등록",
    description: "노출 위치, 기간, 링크를 관리합니다.",
    icon: ImagePlus,
    fields: [
      { label: "배너명", name: "bannerTitle", placeholder: "파트너 상담 CTA", required: true },
      { label: "노출 위치", name: "placement", type: "select", options: ["home", "curriculum", "activities", "global"], required: true },
      { label: "게시 상태", name: "bannerStatus", type: "select", options: ["draft", "published", "archived"], required: true },
      { label: "시작일", name: "startsAt", placeholder: "2026-07-12" },
      { label: "종료일", name: "endsAt", placeholder: "2026-08-12" },
      { label: "이미지 URL", name: "imageUrl", placeholder: "/assets/banner-image.jpg 또는 https://..." },
      { label: "연결 URL", name: "targetUrl", placeholder: "/ko/partner-inquiry" }
    ]
  }
};

const formOrder: AdminFormType[] = ["course", "content", "inquiry", "certification", "banner"];
const courseSectionLabels: Record<string, string> = {
  "flow-1": "커리큘럼 흐름 1",
  "flow-2": "커리큘럼 흐름 2",
  "flow-3": "커리큘럼 흐름 3",
  "flow-4": "커리큘럼 흐름 4",
  main: "대표 과정 정보",
  "panel-audience": "추천 대상",
  "panel-goal": "학습 목표",
  "panel-strength": "과정 강점",
  "process-1": "실습 프로세스",
  "technique-1": "핵심 테크닉"
};

export function AdminCrudPreview({
  contentItems = [],
  courseOptions = []
}: {
  contentItems?: AdminContentRow[];
  courseOptions?: CourseOption[];
}) {
  const [activeForm, setActiveForm] = useState<AdminFormType>("course");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [submittedForm, setSubmittedForm] = useState<AdminFormType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentForm = adminForms[activeForm];
  const currentFields = getCurrentFields(activeForm, currentForm.fields, courseOptions);
  const ActiveIcon = currentForm.icon;
  const editableItems = contentItems.filter((item) => {
    if (activeForm === "course") {
      return item.type === "Course";
    }

    if (activeForm === "content") {
      return item.type !== "Banner" && item.type !== "Course";
    }

    return item.type === "Banner";
  });
  const selectedItemId = fieldValues.itemId ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};

    currentFields.forEach((field) => {
      if (field.required && String(formData.get(field.name) ?? "").trim().length === 0) {
        nextErrors[field.name] = "필수 입력 항목입니다.";
      }
    });

    setErrors(nextErrors);
    setResult(null);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedForm(null);
      return;
    }

    setIsSubmitting(true);
    const nextResult = await saveActiveForm(activeForm, formData);
    setResult(nextResult);
    setSubmittedForm(nextResult.ok ? activeForm : null);
    setIsSubmitting(false);
  }

  function switchForm(nextForm: AdminFormType) {
    setActiveForm(nextForm);
    setFieldValues({});
    setSubmittedForm(null);
    setErrors({});
    setResult(null);
  }

  function updateField(name: string, value: string) {
    setFieldValues((current) => ({ ...current, [name]: value }));
  }

  function selectManagedItem(itemId: string) {
    const item = editableItems.find((candidate) => candidate.id === itemId);

    if (!item) {
      setFieldValues({});
      return;
    }

    if (activeForm === "banner") {
      setFieldValues({
        bannerStatus: item.status,
        bannerTitle: item.title,
        endsAt: item.endsAt?.slice(0, 10) ?? "",
        imageUrl: item.imageUrl ?? "",
        itemId: item.id ?? "",
        placement: item.locale,
        startsAt: item.startsAt?.slice(0, 10) ?? "",
        targetUrl: item.sourceUrl ?? ""
      });
      return;
    }

    if (activeForm === "course") {
      const parsedSlug = parseCourseManagedSlug(item.slug ?? "", courseOptions);
      setFieldValues({
        body: item.body ?? "",
        courseSection: parsedSlug.courseSection,
        courseSlug: parsedSlug.courseSlug,
        itemId: item.id ?? "",
        imageUrl: item.imageUrl ?? "",
        locale: item.locale,
        sourceUrl: item.sourceUrl ?? "",
        status: item.status,
        summary: item.summary ?? "",
        title: item.title
      });
      return;
    }

    setFieldValues({
      body: item.body ?? "",
      contentType: item.type,
      itemId: item.id ?? "",
      imageUrl: item.imageUrl ?? "",
      locale: item.locale,
      slug: item.slug ?? "",
      sourceUrl: item.sourceUrl ?? "",
      status: item.status,
      summary: item.summary ?? "",
      title: item.title
    });
  }

  async function handleDelete() {
    if (!selectedItemId || !["content", "banner", "course"].includes(activeForm)) {
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    const nextResult = await deleteAdminManagedItem({
      id: selectedItemId,
      itemType: activeForm === "banner" ? "banner" : "content"
    });
    setResult(nextResult);
    setSubmittedForm(nextResult.ok ? activeForm : null);
    if (nextResult.ok) {
      setFieldValues({});
    }
    setIsSubmitting(false);
  }

  return (
    <section className="admin-crud-preview">
      <div className="admin-crud-tabs" role="tablist" aria-label="Admin editor forms">
        {formOrder.map((formKey) => {
          const form = adminForms[formKey];
          const Icon = form.icon;
          const isActive = activeForm === formKey;

          return (
            <button
              aria-selected={isActive}
              className={isActive ? "is-active" : undefined}
              key={formKey}
              onClick={() => switchForm(formKey)}
              role="tab"
              type="button"
            >
              <Icon size={16} />
              <span>{form.title}</span>
            </button>
          );
        })}
      </div>
      <form className="admin-editor-form" onSubmit={handleSubmit} noValidate>
        <input name="itemId" type="hidden" value={selectedItemId} />
        <div className="admin-editor-heading">
          <ActiveIcon size={22} />
          <div>
            <h3>{currentForm.title}</h3>
            <p>{currentForm.description}</p>
          </div>
        </div>
        {(activeForm === "course" || activeForm === "content" || activeForm === "banner") && editableItems.length > 0 ? (
          <label className="admin-existing-select">
            기존 항목 불러오기
            <select onChange={(event) => selectManagedItem(event.target.value)} value={selectedItemId}>
              <option value="">새 항목 작성</option>
              {editableItems.map((item) => (
                <option key={item.id ?? `${item.type}-${item.title}`} value={item.id}>
                  {item.type} · {item.locale} · {item.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="admin-editor-grid">
          {currentFields.map((field) => (
            <label className={field.type === "textarea" ? "full" : undefined} key={field.name}>
              {field.label}
              {field.type === "select" ? (
                <select
                  aria-invalid={Boolean(errors[field.name])}
                  name={field.name}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  value={fieldValues[field.name] ?? ""}
                >
                  <option value="" disabled>선택</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{getOptionLabel(field.name, option, courseOptions)}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  aria-invalid={Boolean(errors[field.name])}
                  name={field.name}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  rows={5}
                  value={fieldValues[field.name] ?? ""}
                />
              ) : (
                <input
                  aria-invalid={Boolean(errors[field.name])}
                  name={field.name}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  value={fieldValues[field.name] ?? ""}
                />
              )}
              {errors[field.name] ? <span className="form-error">{errors[field.name]}</span> : null}
            </label>
          ))}
        </div>
        {submittedForm === activeForm ? (
          <div className="form-success" role="status">
            <CheckCircle2 size={20} />
            <span>
              <strong>{getSuccessTitle(activeForm, result?.message ?? "")}</strong>
              {result?.message}
            </span>
          </div>
        ) : null}
        {result && !result.ok ? <span className="form-error full">{result.message}</span> : null}
        <div className="admin-editor-actions">
          <button className="primary-button" disabled={isSubmitting} type="submit">
            <Save size={16} />
            <span>{getSubmitLabel(activeForm, selectedItemId, isSubmitting)}</span>
          </button>
          {(activeForm === "course" || activeForm === "content" || activeForm === "banner") && selectedItemId ? (
            <button className="secondary-button danger" disabled={isSubmitting} onClick={handleDelete} type="button">
              <Trash2 size={16} />
              <span>선택 항목 삭제</span>
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function getSuccessTitle(activeForm: AdminFormType, message: string) {
  if (message.includes("삭제")) {
    return "삭제 완료";
  }

  if (activeForm === "certification") {
    return "자격 데이터 저장 완료";
  }

  if (activeForm === "inquiry") {
    return "문의 처리 저장 완료";
  }

  if (activeForm === "banner") {
    return "배너 저장 완료";
  }

  if (activeForm === "course") {
    return "교육과정 저장 완료";
  }

  return "콘텐츠 저장 완료";
}

function getSubmitLabel(activeForm: AdminFormType, selectedItemId: string, isSubmitting: boolean) {
  if (isSubmitting) {
    return "...";
  }

  if (activeForm === "certification") {
    return "자격 데이터 저장";
  }

  if (activeForm === "inquiry") {
    return "문의 처리 저장";
  }

  if (activeForm === "course") {
    return selectedItemId ? "선택 과정 수정" : "교육과정 저장";
  }

  if (selectedItemId) {
    return "선택 항목 수정";
  }

  return activeForm === "banner" ? "배너 저장" : "콘텐츠 저장";
}

async function saveActiveForm(activeForm: AdminFormType, formData: FormData) {
  if (activeForm === "course") {
    const courseSlug = String(formData.get("courseSlug") ?? "");
    const courseSection = String(formData.get("courseSection") ?? "");

    return saveAdminContent({
      body: String(formData.get("body") ?? ""),
      contentType: "Course",
      imageUrl: String(formData.get("imageUrl") ?? ""),
      locale: String(formData.get("locale") ?? ""),
      slug: getCourseManagedSlug(courseSlug, courseSection),
      sourceUrl: String(formData.get("sourceUrl") ?? ""),
      status: String(formData.get("status") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      title: String(formData.get("title") ?? "")
    });
  }

  if (activeForm === "certification") {
    return saveAdminCertification({
      certificateNumber: String(formData.get("certificateNumber") ?? ""),
      courseTitle: String(formData.get("course") ?? ""),
      issuedAt: String(formData.get("issuedAt") ?? ""),
      status: String(formData.get("certificateStatus") ?? ""),
      userEmail: String(formData.get("user") ?? ""),
      verificationCode: String(formData.get("verificationCode") ?? "")
    });
  }

  if (activeForm === "inquiry") {
    return saveAdminInquiry({
      managerNote: String(formData.get("memo") ?? ""),
      receipt: String(formData.get("receipt") ?? ""),
      status: String(formData.get("inquiryStatus") ?? "")
    });
  }

  if (activeForm === "banner") {
    return saveAdminBanner({
      endsAt: String(formData.get("endsAt") ?? ""),
      id: String(formData.get("itemId") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      placement: String(formData.get("placement") ?? ""),
      startsAt: String(formData.get("startsAt") ?? ""),
      status: String(formData.get("bannerStatus") ?? ""),
      targetUrl: String(formData.get("targetUrl") ?? ""),
      title: String(formData.get("bannerTitle") ?? "")
    });
  }

  return saveAdminContent({
    body: String(formData.get("body") ?? ""),
    contentType: String(formData.get("contentType") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    locale: String(formData.get("locale") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
    status: String(formData.get("status") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    title: String(formData.get("title") ?? "")
  });
}

function getCurrentFields(activeForm: AdminFormType, fields: AdminField[], courseOptions: CourseOption[]) {
  if (activeForm !== "course") {
    return fields;
  }

  return fields.map((field) => {
    if (field.name !== "courseSlug") {
      return field;
    }

    return {
      ...field,
      options: courseOptions.map((course) => course.slug)
    };
  });
}

function getCourseManagedSlug(courseSlug: string, courseSection: string) {
  if (!courseSlug || courseSection === "main") {
    return courseSlug;
  }

  return `${courseSlug}-${courseSection}`;
}

function parseCourseManagedSlug(slug: string, courseOptions: CourseOption[]) {
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

function getOptionLabel(fieldName: string, option: string, courseOptions: CourseOption[]) {
  if (fieldName === "courseSection") {
    return courseSectionLabels[option] ?? option;
  }

  if (fieldName !== "courseSlug") {
    return option;
  }

  const course = courseOptions.find((candidate) => candidate.slug === option);
  return course ? `${course.label} (${course.slug})` : option;
}
