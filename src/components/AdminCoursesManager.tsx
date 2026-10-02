"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowDown, ArrowUp, ArrowUpRight, CheckCircle2, FileText, ImagePlus, Plus, RotateCcw, Save, Search, Trash2, Undo2, X } from "lucide-react";
import {
  archiveAdminCourse,
  deleteAdminCourse,
  loadPreparedCourseTranslation,
  restoreAdminCourse,
  saveAdminCourse,
  saveAdminCourseLocalization,
  uploadAdminContentAttachment,
  uploadAdminContentImage,
  type SaveAdminContentResult
} from "@/app/admin/actions";
import { AdminStatusBadge, getTone } from "@/components/AdminConsole";
import {
  courseCategories,
  courseLocales,
  courseSectionTypes,
  courseStatuses,
  courseTemplatesByCategory,
  getDefaultCourseTemplateKey,
  moveCourseCurriculumItem,
  normalizeCourseSections,
  normalizeScheduleTracks,
  type AdminCourseLocalization,
  type AdminCourseRecord,
  type CourseContentSection,
  type CourseCategoryKey,
  type CourseLocale,
  type CourseScheduleTrack,
  type CourseTemplateKey
} from "@/lib/course-model";

type LocalizationEditor = {
  certificationNote: string;
  contentSections: CourseContentSection[];
  curriculumText: string;
  duration: string;
  imageUrl: string;
  overview: string;
  pdfFileName: string;
  pdfUrl: string;
  recommendedText: string;
  scheduleTracks: CourseScheduleTrack[];
  status: string;
  summary: string;
  title: string;
};

const emptyLocalization: LocalizationEditor = {
  certificationNote: "",
  contentSections: [],
  curriculumText: "",
  duration: "",
  imageUrl: "",
  overview: "",
  pdfFileName: "",
  pdfUrl: "",
  recommendedText: "",
  scheduleTracks: [],
  status: "draft",
  summary: "",
  title: ""
};

const categoryLabels = {
  certification: "자격 과정",
  practical: "실무 프로그램",
  professional: "목표형 과정"
} as const;

const templateLabels = {
  career: "취업 지원 과정",
  certification: "국가·공인 자격 과정",
  hobby: "주말·취미 과정",
  instructor: "강사 양성 과정",
  practical: "실무 기술 과정",
  startup: "창업 지원 과정"
} as const;

const sectionLabels = {
  benefits: "지원·특전",
  careers: "진로·취업 분야",
  exam: "시험 안내",
  gallery: "실습 갤러리",
  goals: "교육 목표",
  learning_method: "교육 방식",
  practice: "실습·기술",
  precautions: "준비물·주의사항",
  programs: "선택 과정·조합",
  theory: "핵심 이론"
} as const;

type EditorTab = "basic" | "schedule" | "sections" | "media";
type RemovedCurriculumItem = {
  item: CourseScheduleTrack["items"][number];
  itemIndex: number;
  trackId: string;
};
type CourseFeedback =
  | { kind: "section-added" }
  | ({ kind: "curriculum-removed" } & RemovedCurriculumItem);

const statusLabels: Record<string, string> = {
  archived: "보관",
  draft: "초안",
  published: "공개",
  reviewed: "검수완료",
  translated: "번역완료"
};

const courseLocaleLabels: Record<CourseLocale, string> = {
  en: "영어",
  es: "스페인어",
  ko: "한국어",
  "zh-CN": "중국어"
};

export function AdminCoursesManager({
  courses,
  initialCourseSlug,
  initialLocale
}: {
  courses: AdminCourseRecord[];
  initialCourseSlug?: string;
  initialLocale?: string;
}) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const sectionImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const sectionImagePreviewsRef = useRef<Record<string, string>>({});
  const sectionEditorRefs = useRef<Record<string, HTMLElement | null>>({});
  const requestedCourse = courses.find((course) => course.slug === initialCourseSlug) ?? courses[0];
  const requestedLocale = courseLocales.includes(initialLocale as CourseLocale) ? initialLocale as CourseLocale : "ko";
  const [activeCourseId, setActiveCourseId] = useState(requestedCourse?.id ?? "");
  const [activeLocale, setActiveLocale] = useState<CourseLocale>(requestedLocale);
  const [commonCategory, setCommonCategory] = useState<CourseCategoryKey>("practical");
  const [commonSortOrder, setCommonSortOrder] = useState(0);
  const [commonTemplate, setCommonTemplate] = useState<CourseTemplateKey>("practical");
  const [createCategory, setCreateCategory] = useState<CourseCategoryKey>("practical");
  const [createOverview, setCreateOverview] = useState("");
  const [createSortOrder, setCreateSortOrder] = useState(courses.length);
  const [createStatus, setCreateStatus] = useState("published");
  const [createSummary, setCreateSummary] = useState("");
  const [createTemplate, setCreateTemplate] = useState<CourseTemplateKey>("practical");
  const [createTitle, setCreateTitle] = useState("");
  const [editor, setEditor] = useState<LocalizationEditor>(emptyLocalization);
  const [preparedSourceUpdatedAt, setPreparedSourceUpdatedAt] = useState<string>();
  const preparedRequest = useRef(0);
  const [editorTab, setEditorTab] = useState<EditorTab>("basic");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [result, setResult] = useState<SaveAdminContentResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [sectionImagePreviews, setSectionImagePreviews] = useState<Record<string, string>>({});
  const [courseFeedback, setCourseFeedback] = useState<CourseFeedback | null>(null);
  const [newContentSectionId, setNewContentSectionId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? courses[0] ?? null;
  const activeLocalization = activeCourse?.localizations.find((item) => item.locale === activeLocale) ?? null;
  const activePublicHref = activeCourse ? `/${activeLocale}/curriculum/${activeCourse.slug}` : "";
  const isActiveLocalePublished = Boolean(activeCourse?.isActive && activeLocalization?.status === "published");
  const activeLocaleActionMessage = getCoursePublicationGuide(activeCourse?.isActive ?? false, activeLocalization?.status);
  const isPublishMissingIntro = editor.status === "published" && (!editor.summary.trim() || !editor.overview.trim());
  const publishedCount = courses.filter((course) => course.localizations.some((item) => item.status === "published")).length;
  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return courses;
    return courses.filter((course) =>
      `${getCourseTitle(course)} ${course.slug} ${categoryLabels[course.categoryKey]}`.toLowerCase().includes(keyword)
    );
  }, [courses, search]);

  useEffect(() => {
    if (!activeCourse && courses[0]) setActiveCourseId(courses[0].id);
  }, [activeCourse, courses]);

  useEffect(() => {
    preparedRequest.current += 1;
    setPreparedSourceUpdatedAt(undefined);
    if (!activeCourse) {
      setEditor(emptyLocalization);
      return;
    }
    setCommonCategory(activeCourse.categoryKey);
    setCommonSortOrder(activeCourse.sortOrder);
    setCommonTemplate(activeCourse.templateKey);
    setEditor(toEditor(activeLocalization));
    setResult(null);
    setSelectedImageName("");
    setSelectedImagePreview("");
    setSelectedPdfName("");
    Object.values(sectionImagePreviewsRef.current).forEach((preview) => URL.revokeObjectURL(preview));
    sectionImagePreviewsRef.current = {};
    setSectionImagePreviews({});
    Object.values(sectionImageInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }, [activeCourse, activeLocalization, activeLocale]);

  useEffect(() => () => {
    if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
  }, [selectedImagePreview]);

  useEffect(() => () => {
    Object.values(sectionImagePreviewsRef.current).forEach((preview) => URL.revokeObjectURL(preview));
  }, []);

  useEffect(() => {
    if (!courseFeedback) return;
    const timeout = window.setTimeout(
      () => setCourseFeedback(null),
      courseFeedback.kind === "section-added" ? 3000 : 5000
    );
    return () => window.clearTimeout(timeout);
  }, [courseFeedback]);

  useEffect(() => {
    if (!newContentSectionId) return;
    const sectionEditor = sectionEditorRefs.current[newContentSectionId];
    if (!sectionEditor) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sectionEditor.scrollIntoView({ block: "center" });
    } else {
      sectionEditor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    sectionEditor.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });

    const timeout = window.setTimeout(() => setNewContentSectionId(""), 1600);
    return () => window.clearTimeout(timeout);
  }, [editor.contentSections, newContentSectionId]);

  function resetFileInputs() {
    setSelectedImageName("");
    setSelectedImagePreview("");
    setSelectedPdfName("");
    resetSectionImagePreviews();
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }

  function resetSectionImagePreviews() {
    Object.values(sectionImagePreviewsRef.current).forEach((preview) => URL.revokeObjectURL(preview));
    sectionImagePreviewsRef.current = {};
    setSectionImagePreviews({});
    Object.values(sectionImageInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  }

  function handleSectionImageChange(sectionId: string, event: ChangeEvent<HTMLInputElement>) {
    const previousPreview = sectionImagePreviewsRef.current[sectionId];
    if (previousPreview) URL.revokeObjectURL(previousPreview);

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : "";
    if (nextPreview) {
      sectionImagePreviewsRef.current[sectionId] = nextPreview;
    } else {
      delete sectionImagePreviewsRef.current[sectionId];
    }
    setSectionImagePreviews({ ...sectionImagePreviewsRef.current });
    setResult(null);
  }

  function clearSectionImage(sectionId: string) {
    const preview = sectionImagePreviewsRef.current[sectionId];
    if (preview) URL.revokeObjectURL(preview);
    delete sectionImagePreviewsRef.current[sectionId];
    setSectionImagePreviews({ ...sectionImagePreviewsRef.current });
    const imageInput = sectionImageInputRefs.current[sectionId];
    if (imageInput) imageInput.value = "";
    updateContentSection(sectionId, { images: [] });
  }

  function removeContentSection(sectionId: string) {
    const preview = sectionImagePreviewsRef.current[sectionId];
    if (preview) URL.revokeObjectURL(preview);
    delete sectionImagePreviewsRef.current[sectionId];
    delete sectionImageInputRefs.current[sectionId];
    delete sectionEditorRefs.current[sectionId];
    setSectionImagePreviews({ ...sectionImagePreviewsRef.current });
    updateEditor("contentSections", editor.contentSections.filter((section) => section.id !== sectionId));
  }

  function updateEditor<K extends keyof LocalizationEditor>(name: K, value: LocalizationEditor[K]) {
    setEditor((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function loadTranslationDraft() {
    if (!activeCourse || activeLocale === "ko") return;
    const request = ++preparedRequest.current;
    startTransition(async () => {
      const response = await loadPreparedCourseTranslation({ courseId: activeCourse.id, locale: activeLocale });
      if (request !== preparedRequest.current) return;
      if (!response.ok) { setResult(response); return; }
      const content = response.draft.content;
      resetFileInputs();
      setEditor({
        certificationNote: content.certification_note ?? "", contentSections: normalizeCourseSections(content.content_sections),
        curriculumText: (content.curriculum_items ?? []).join("\n"), duration: content.duration ?? "",
        imageUrl: content.image_url ?? "", overview: content.overview ?? "", pdfFileName: content.pdf_file_name ?? "", pdfUrl: content.pdf_url ?? "",
        recommendedText: (content.recommended_for ?? []).join("\n"), scheduleTracks: normalizeScheduleTracks(content.schedule_tracks),
        status: "draft", summary: content.summary ?? "", title: content.title
      });
      setPreparedSourceUpdatedAt(response.draft.sourceUpdatedAt);
      setResult({ ok: true, message: "한국어 원문 기준 번역 초안을 불러왔습니다. 아직 저장되지 않았습니다. 기본 정보·주차별 일정·상세 내용을 검수한 뒤 저장해 주세요." });
    });
  }

  function openCreateModal() {
    setCreateTitle("");
    setCreateSummary("");
    setCreateOverview("");
    setCreateCategory("practical");
    setCreateStatus("published");
    setCreateTemplate("practical");
    setCreateSortOrder(courses.length);
    setResult(null);
    setIsCreateOpen(true);
  }

  function updateCommonCategory(categoryKey: CourseCategoryKey) {
    setCommonCategory(categoryKey);
    if (!courseTemplatesByCategory[categoryKey].includes(commonTemplate)) {
      setCommonTemplate(getDefaultCourseTemplateKey(categoryKey));
    }
  }

  function updateCreateCategory(categoryKey: CourseCategoryKey) {
    setCreateCategory(categoryKey);
    if (!courseTemplatesByCategory[categoryKey].includes(createTemplate)) {
      setCreateTemplate(getDefaultCourseTemplateKey(categoryKey));
    }
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const nextResult = await saveAdminCourse({
        categoryKey: createCategory,
        initialOverview: createOverview,
        initialStatus: createStatus,
        initialSummary: createSummary,
        sortOrder: createSortOrder,
        templateKey: createTemplate,
        title: createTitle
      });
      setResult(nextResult);
      if (nextResult.ok) {
        if (nextResult.courseId) setActiveCourseId(nextResult.courseId);
        setIsCreateOpen(false);
        router.refresh();
      }
    });
  }

  function addScheduleTrack() {
    updateEditor("scheduleTracks", [
      ...editor.scheduleTracks,
      { duration: "", id: crypto.randomUUID(), items: [], label: "새 구성 그룹", times: [] }
    ]);
  }

  function updateScheduleTrack(trackId: string, patch: Partial<CourseScheduleTrack>) {
    updateEditor("scheduleTracks", editor.scheduleTracks.map((track) => track.id === trackId ? { ...track, ...patch } : track));
  }

  function addCurriculumItem(trackId: string) {
    updateEditor("scheduleTracks", editor.scheduleTracks.map((track) => track.id === trackId ? {
      ...track,
      items: [...track.items, { items: [], label: "", period: "", title: "" }]
    } : track));
  }

  function updateCurriculumItem(trackId: string, itemIndex: number, patch: Partial<CourseScheduleTrack["items"][number]>) {
    updateEditor("scheduleTracks", editor.scheduleTracks.map((track) => track.id === trackId ? {
      ...track,
      items: track.items.map((item, index) => index === itemIndex ? { ...item, ...patch } : item)
    } : track));
  }

  function moveCurriculumItem(trackId: string, itemIndex: number, direction: -1 | 1) {
    updateEditor("scheduleTracks", editor.scheduleTracks.map((track) => track.id === trackId ? {
      ...track,
      items: moveCourseCurriculumItem(track.items, itemIndex, itemIndex + direction)
    } : track));
  }

  function removeCurriculumItem(trackId: string, itemIndex: number) {
    const track = editor.scheduleTracks.find((item) => item.id === trackId);
    const item = track?.items[itemIndex];
    if (!item) return;
    setCourseFeedback({ item, itemIndex, kind: "curriculum-removed", trackId });
    updateScheduleTrack(trackId, { items: track.items.filter((_, index) => index !== itemIndex) });
  }

  function undoCurriculumItemRemoval() {
    if (courseFeedback?.kind !== "curriculum-removed") return;
    const { item, itemIndex, trackId } = courseFeedback;
    setEditor((current) => ({
      ...current,
      scheduleTracks: current.scheduleTracks.map((track) => {
        if (track.id !== trackId) return track;
        const items = [...track.items];
        items.splice(Math.min(itemIndex, items.length), 0, item);
        return { ...track, items };
      })
    }));
    setCourseFeedback(null);
    setResult(null);
  }

  function addContentSection() {
    const sectionId = crypto.randomUUID();
    updateEditor("contentSections", [
      ...editor.contentSections,
      { body: "", id: sectionId, images: [], items: [], title: "교육 목표", type: "goals" }
    ]);
    setNewContentSectionId(sectionId);
    setCourseFeedback({ kind: "section-added" });
  }

  function updateContentSection(sectionId: string, patch: Partial<CourseContentSection>) {
    updateEditor("contentSections", editor.contentSections.map((section) => section.id === sectionId ? { ...section, ...patch } : section));
  }

  function handleLocalizationSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeCourse) return;
    if (preparedSourceUpdatedAt && editor.status !== "reviewed") {
      setResult({ ok: false, message: "불러온 번역을 검수한 뒤 게시 상태를 검수완료로 선택해 저장해 주세요." });
      return;
    }
    const formData = new FormData(event.currentTarget);

    setIsSaving(true);
    startTransition(async () => {
      try {
        let imageUrl = editor.imageUrl;
        let pdfUrl = editor.pdfUrl;
        let pdfFileName = editor.pdfFileName;
        let contentSections = editor.contentSections;
        const imageFile = formData.get("imageFile");
        const pdfFile = formData.get("pdfFile");

        if (imageFile instanceof File && imageFile.size > 0) {
          const uploadData = new FormData();
          uploadData.append("file", imageFile);
          uploadData.append("contentType", "Course");
          uploadData.append("slug", `${activeCourse.slug}-${activeLocale}`);
          const uploadResult = await uploadAdminContentImage(uploadData);
          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }
          imageUrl = uploadResult.url;
        }

        if (pdfFile instanceof File && pdfFile.size > 0) {
          const uploadData = new FormData();
          uploadData.append("file", pdfFile);
          uploadData.append("contentType", "Course");
          uploadData.append("slug", `${activeCourse.slug}-${activeLocale}`);
          const uploadResult = await uploadAdminContentAttachment(uploadData);
          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }
          pdfUrl = uploadResult.url;
          pdfFileName = pdfFile.name;
        }

        for (const section of contentSections) {
          const sectionImage = formData.get(`sectionImage-${section.id}`);
          if (!(sectionImage instanceof File) || sectionImage.size === 0) continue;
          const uploadData = new FormData();
          uploadData.append("file", sectionImage);
          uploadData.append("contentType", "Course");
          uploadData.append("slug", `${activeCourse.slug}-${activeLocale}-${section.id}`);
          const uploadResult = await uploadAdminContentImage(uploadData);
          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }
          contentSections = contentSections.map((item) => item.id === section.id ? {
            ...item,
            images: [{ alt: item.title, caption: "", url: uploadResult.url ?? "" }]
          } : item);
        }

        const commonResult = await saveAdminCourse({
          categoryKey: commonCategory,
          courseId: activeCourse.id,
          sortOrder: commonSortOrder,
          templateKey: commonTemplate,
          title: getCourseTitle(activeCourse)
        });
        if (!commonResult.ok) {
          setResult({ ...commonResult, message: `과정 설정 저장 실패: ${commonResult.message}` });
          return;
        }

        const nextResult = await saveAdminCourseLocalization({
          ...editor,
          expectedSourceUpdatedAt: preparedSourceUpdatedAt,
          contentSections,
          courseId: activeCourse.id,
          imageUrl,
          locale: activeLocale,
          pdfFileName,
          pdfUrl
        });
        setResult(nextResult.ok
          ? { ...nextResult, message: `과정 설정과 ${activeLocale.toUpperCase()} 콘텐츠를 저장했습니다.` }
          : { ...nextResult, message: `과정 설정은 저장됐지만 선택한 언어의 과정 내용 저장에 실패했습니다: ${nextResult.message}` });
        if (nextResult.ok) {
          setEditor((current) => ({ ...current, contentSections, imageUrl, pdfFileName, pdfUrl }));
          resetFileInputs();
          router.refresh();
        }
      } finally {
        setIsSaving(false);
      }
    });
  }

  function handleArchive() {
    if (!activeCourse || !window.confirm(`"${getCourseTitle(activeCourse)}" 과정을 보관할까요? 모든 공개 언어가 함께 비공개됩니다.`)) return;
    startTransition(async () => {
      const nextResult = await archiveAdminCourse({ courseId: activeCourse.id });
      setResult(nextResult);
      if (nextResult.ok) router.refresh();
    });
  }

  function handleRestore() {
    if (!activeCourse || !window.confirm(`"${getCourseTitle(activeCourse)}" 과정을 다시 활성화할까요? 언어 콘텐츠는 자동 공개되지 않습니다.`)) return;
    startTransition(async () => {
      const nextResult = await restoreAdminCourse({ courseId: activeCourse.id });
      setResult(nextResult);
      if (nextResult.ok) router.refresh();
    });
  }

  function handleDelete() {
    if (!activeCourse || !window.confirm(`"${getCourseTitle(activeCourse)}" 과정을 영구 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;
    startTransition(async () => {
      const nextResult = await deleteAdminCourse({ courseId: activeCourse.id });
      setResult(nextResult);
      if (nextResult.ok) {
        setActiveCourseId("");
        router.refresh();
      }
    });
  }

  return (
    <div className="admin-courses-manager admin-course-hybrid-manager">
      {isSaving ? <AdminCourseSaveOverlay /> : null}
      <div className="admin-courses-toolbar">
        <section className="admin-courses-overview" aria-label="과정 CMS 요약">
          <span><strong>{courses.length}</strong>전체 과정</span>
          <span><strong>{courses.filter((course) => course.isActive).length}</strong>활성</span>
          <span><strong>{publishedCount}</strong>공개 언어 보유</span>
          <span><strong>{courses.filter((course) => !course.isActive).length}</strong>보관</span>
        </section>
        <button className="admin-users-new-button" onClick={openCreateModal} type="button"><Plus size={16} /> 교육과정 생성</button>
      </div>

      <div className="admin-courses-workspace">
        <aside className="admin-courses-list-panel">
          <label className="admin-courses-search"><Search size={15} /><span className="sr-only">과정 검색</span><input onChange={(event) => setSearch(event.target.value)} placeholder="과정명, 분류 검색" value={search} /></label>
          <div className="admin-courses-list" role="listbox" aria-label="과정 선택">
            {filteredCourses.map((course) => (
              <button aria-selected={course.id === activeCourse?.id} className={course.id === activeCourse?.id ? "is-active" : undefined} key={course.id} onClick={() => setActiveCourseId(course.id)} role="option" type="button">
                <strong>{getCourseTitle(course)}</strong>
                <span>{categoryLabels[course.categoryKey]} · {course.slug}</span>
                {course.isActive ? <span className="admin-course-locale-statuses">{courseLocales.map((locale) => {
                  const localization = course.localizations.find((item) => item.locale === locale);
                  const status = localization?.status ?? "missing";
                  return <span className={`is-${status}`} key={locale}>{locale.toUpperCase()}<i aria-hidden="true" />{localization ? statusLabels[localization.status] : "미등록"}</span>;
                })}</span> : <em>보관된 과정</em>}
              </button>
            ))}
            {!filteredCourses.length ? <p className="console-empty-state">등록된 교육과정이 없습니다.</p> : null}
          </div>
          <div className="admin-courses-list-footer">총 {filteredCourses.length}개 과정</div>
        </aside>

        <section className="admin-courses-detail-panel">
          {activeCourse ? (
            <>
              <div className="admin-course-editor-header">
                <div className="admin-courses-heading">
                  <div><span>COURSE CMS</span><h2>{getCourseTitle(activeCourse)}</h2><p>{activeCourse.slug} · {activeCourse.isActive ? "활성 과정" : "보관된 과정"}</p></div>
                </div>
                <div className="admin-course-header-tools">
                  {isActiveLocalePublished ? (
                    <Link className="secondary-button" href={activePublicHref} rel="noreferrer" target="_blank">공개 페이지 <ArrowUpRight size={15} /></Link>
                  ) : <span className="admin-course-preview-status">이 언어는 미공개</span>}
                  <div className="admin-course-locale-tabs" role="tablist" aria-label="과정 언어">
                    {courseLocales.map((locale) => {
                      const localization = activeCourse.localizations.find((item) => item.locale === locale);
                      return (
                        <button aria-selected={activeLocale === locale} className={activeLocale === locale ? "is-active" : undefined} key={locale} onClick={() => setActiveLocale(locale)} role="tab" type="button">
                          <span>{locale.toUpperCase()}</span><AdminStatusBadge tone={localization ? getTone(localization.status) : "neutral"}>{localization ? statusLabels[localization.status] : "미등록"}</AdminStatusBadge>
                        </button>
                      );
                    })}
                  </div>
                  <button className="primary-button admin-course-header-save" disabled={isPending} form="admin-course-localization-form" type="submit"><Save size={16} /> 변경사항 저장</button>
                </div>
              </div>

              <section className="admin-course-public-panel" aria-label="공개 확인">
                <div>
                  <span className="admin-course-public-kicker">공개 확인</span>
                  <strong>{courseLocaleLabels[activeLocale]} 페이지 상태: {activeCourse.isActive ? statusLabels[activeLocalization?.status ?? "missing"] ?? "미등록" : "보관"}</strong>
                  <p>{activeLocaleActionMessage}</p>
                </div>
                <div className="admin-course-public-url">
                  <span>{activePublicHref}</span>
                  {isActiveLocalePublished ? (
                    <Link href={activePublicHref} rel="noreferrer" target="_blank">페이지 열기 <ArrowUpRight size={14} /></Link>
                  ) : (
                    <em>게시 상태를 공개로 저장하면 이 주소에서 보입니다.</em>
                  )}
                </div>
              </section>

              {activeLocale !== "ko" ? (
                <section className="admin-course-public-panel" aria-label="원문 기준 번역 초안">
                  <div><strong>한국어 원문 기준 번역 초안</strong><p>현재 편집 내용을 준비된 번역으로 바꿉니다. 불러오기만으로 저장·공개되지 않습니다. 검수 완료로 저장하면 기존 공개본은 잠시 비공개되며, 다시 열어 최고 관리자가 공개로 저장해야 반영됩니다.</p></div>
                  <button className="secondary-button" disabled={isPending || isSaving} onClick={loadTranslationDraft} type="button">원문 기준 번역 불러오기</button>
                </section>
              ) : null}

              <section aria-labelledby="admin-course-settings-title" className="admin-course-common-form">
                <div className="admin-course-common-heading"><strong id="admin-course-settings-title">과정 설정</strong><span>모든 언어 공통</span></div>
                <div className="admin-course-common-fields">
                  <label>과정 그룹<select onChange={(event) => updateCommonCategory(event.target.value as CourseCategoryKey)} value={commonCategory}>{courseCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select><small className="admin-field-help">공개 과정 목록의 필터와 그룹에 사용됩니다.</small></label>
                  <label>세부 유형<select onChange={(event) => setCommonTemplate(event.target.value as CourseTemplateKey)} value={commonTemplate}>{courseTemplatesByCategory[commonCategory].map((template) => <option key={template} value={template}>{templateLabels[template]}</option>)}</select><small className="admin-field-help">과정의 교육 목적을 구분합니다.</small></label>
                  <label>노출 순서<input min={0} onChange={(event) => setCommonSortOrder(Number(event.target.value))} type="number" value={commonSortOrder} /></label>
                </div>
              </section>

              <div className="admin-course-editor-tabs" role="tablist" aria-label="과정 콘텐츠 편집 영역">
                {([
                  ["basic", "기본정보"],
                  ["schedule", "교육 구성"],
                  ["sections", "상세 콘텐츠"],
                  ["media", "첨부자료"]
                ] as const).map(([tab, label]) => (
                  <button aria-selected={editorTab === tab} className={editorTab === tab ? "is-active" : undefined} key={tab} onClick={() => setEditorTab(tab)} role="tab" type="button">{label}</button>
                ))}
              </div>

              <form className="admin-courses-editor admin-course-localization-form" id="admin-course-localization-form" onSubmit={handleLocalizationSave}>
                {editorTab === "basic" ? <div className="admin-course-basic-sections">
                  <section className="admin-course-form-section">
                    <div className="admin-course-form-section-heading"><span>1</span><div><h3>게시 설정</h3><p>현재 언어의 공개 상태와 교육 기간을 설정합니다.</p></div></div>
                    <div className="admin-editor-grid">
                      <label>게시 상태<select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>{courseStatuses.map((status) => <option disabled={Boolean(preparedSourceUpdatedAt) && status !== "reviewed"} key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                      <label>교육 기간<input onChange={(event) => updateEditor("duration", event.target.value)} placeholder="예: 정규 2개월" value={editor.duration} /></label>
                      {isPublishMissingIntro ? <div className="form-error full" role="status">공개로 저장하려면 목록 요약과 과정 개요를 먼저 입력해 주세요.</div> : null}
                    </div>
                  </section>
                  <section className="admin-course-form-section">
                    <div className="admin-course-form-section-heading"><span>2</span><div><h3>소개</h3><p>목록과 상세 페이지에서 과정의 핵심을 설명합니다.</p></div></div>
                    <div className="admin-editor-grid">
                      <label className="full">과정명<input onChange={(event) => updateEditor("title", event.target.value)} required value={editor.title} /></label>
                      <label>목록 요약<textarea onChange={(event) => updateEditor("summary", event.target.value)} rows={4} value={editor.summary} /></label>
                      <label>과정 개요<textarea onChange={(event) => updateEditor("overview", event.target.value)} rows={4} value={editor.overview} /></label>
                      <label className="full">
                        대표 이미지
                        <span className="community-file-upload"><ImagePlus size={18} /><span><strong>이미지 선택</strong><small>{selectedImageName || "JPG, PNG, WebP, GIF / 5MB 이하"}</small></span><input accept="image/jpeg,image/png,image/webp,image/gif" name="imageFile" onChange={(event) => {
                          const file = event.target.files?.[0];
                          setSelectedImageName(file?.name ?? "");
                          setSelectedImagePreview(file ? URL.createObjectURL(file) : "");
                        }} ref={imageInputRef} type="file" /></span>
                        {selectedImagePreview || editor.imageUrl ? <div className="community-image-preview"><Image alt="대표 이미지 미리보기" height={72} src={selectedImagePreview || editor.imageUrl} unoptimized width={96} /><button onClick={() => {
                          setSelectedImageName("");
                          setSelectedImagePreview("");
                          updateEditor("imageUrl", "");
                          if (imageInputRef.current) imageInputRef.current.value = "";
                        }} type="button">이미지 제거</button></div> : null}
                      </label>
                    </div>
                  </section>
                  <section className="admin-course-form-section">
                    <div className="admin-course-form-section-heading"><span>3</span><div><h3>교육 안내</h3><p>교육 내용과 대상, 수료 후 안내를 입력합니다.</p></div></div>
                    <div className="admin-editor-grid">
                      <label>핵심 교육 내용<textarea onChange={(event) => updateEditor("curriculumText", event.target.value)} placeholder="한 줄에 한 항목씩 입력" rows={6} value={editor.curriculumText} /></label>
                      <label>추천 대상<textarea onChange={(event) => updateEditor("recommendedText", event.target.value)} placeholder="한 줄에 한 항목씩 입력" rows={6} value={editor.recommendedText} /></label>
                      <label className="full">수료·자격 안내<textarea onChange={(event) => updateEditor("certificationNote", event.target.value)} rows={4} value={editor.certificationNote} /></label>
                    </div>
                  </section>
                </div> : null}

                {editorTab === "schedule" ? <div className="admin-course-structured-editor">
                  <div className="admin-course-structured-heading"><div><h3>교육 구성</h3><p>과정반, 시간표, 단계별 프로그램을 같은 방식으로 입력합니다. 필요한 항목만 작성하면 됩니다.</p></div><button className="secondary-button" onClick={addScheduleTrack} type="button"><Plus size={15} /> 구성 그룹 추가</button></div>
                  {editor.scheduleTracks.map((track) => (
                    <section className="admin-course-track-editor" key={track.id}>
                      <div className="admin-course-track-heading"><strong>{track.label || "구성 그룹"}</strong><button aria-label="구성 그룹 삭제" onClick={() => {
                        if (window.confirm("이 구성 그룹과 모든 교육 항목을 삭제할까요?")) {
                          updateEditor("scheduleTracks", editor.scheduleTracks.filter((item) => item.id !== track.id));
                        }
                      }} type="button"><Trash2 size={15} /></button></div>
                      <div className="admin-editor-grid">
                        <label>그룹 이름<input onChange={(event) => updateScheduleTrack(track.id, { label: event.target.value })} placeholder="예: 정규반, 창업 진행 절차" value={track.label} /></label>
                        <label>전체 기간<input onChange={(event) => updateScheduleTrack(track.id, { duration: event.target.value })} placeholder="예: 8주, 2개월" value={track.duration} /></label>
                        <label className="full">수업 시간<textarea onChange={(event) => updateScheduleTrack(track.id, { times: event.target.value.split("\n") })} placeholder="한 줄에 한 시간대씩 입력" rows={2} value={track.times.join("\n")} /></label>
                      </div>
                      <div className="admin-course-weeks">
                        {track.items.map((item, itemIndex) => (
                          <div className="admin-course-week-editor" key={`${track.id}-${itemIndex}`}>
                            <div className="admin-course-week-index" aria-label={`교육 항목 ${itemIndex + 1}`}><span>항목</span><strong>{String(itemIndex + 1).padStart(2, "0")}</strong></div>
                            <div className="admin-course-week-primary">
                              <label><span>기간·구간</span><input aria-label="기간·구간" onChange={(event) => updateCurriculumItem(track.id, itemIndex, { period: event.target.value })} placeholder="예: 1개월" value={item.period} /></label>
                              <label><span>구분·순서</span><input aria-label="구분·순서" onChange={(event) => updateCurriculumItem(track.id, itemIndex, { label: event.target.value })} placeholder="예: 1주차, 1단계" value={item.label} /></label>
                              <label><span>교육 주제</span><input aria-label="교육 주제" onChange={(event) => updateCurriculumItem(track.id, itemIndex, { title: event.target.value })} placeholder="교육 주제" value={item.title} /></label>
                            </div>
                            <label className="admin-course-week-detail"><span>상세 교육 내용</span><textarea aria-label="상세 교육 내용" onChange={(event) => updateCurriculumItem(track.id, itemIndex, { items: event.target.value.split("\n") })} placeholder="한 줄에 한 항목씩 입력" rows={3} value={item.items.join("\n")} /></label>
                            <div className="admin-course-row-actions">
                              <button aria-label="위로 이동" disabled={itemIndex === 0} onClick={() => moveCurriculumItem(track.id, itemIndex, -1)} title="위로 이동" type="button"><ArrowUp size={15} /></button>
                              <button aria-label="아래로 이동" disabled={itemIndex === track.items.length - 1} onClick={() => moveCurriculumItem(track.id, itemIndex, 1)} title="아래로 이동" type="button"><ArrowDown size={15} /></button>
                              <button aria-label="교육 항목 삭제" onClick={() => removeCurriculumItem(track.id, itemIndex)} title="삭제" type="button"><X size={15} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="admin-course-add-row" onClick={() => addCurriculumItem(track.id)} type="button"><Plus size={15} /> 교육 항목 추가</button>
                    </section>
                  ))}
                  {!editor.scheduleTracks.length ? <div className="console-empty-state">등록된 교육 구성이 없습니다.</div> : null}
                </div> : null}

                {editorTab === "sections" ? <div className="admin-course-structured-editor">
                  <div className="admin-course-structured-heading"><div><h3>상세 콘텐츠</h3><p>과정에 필요한 항목만 추가해 공개 페이지 순서대로 관리합니다.</p></div><button className={newContentSectionId ? "secondary-button admin-course-add-section-button is-confirmed" : "secondary-button admin-course-add-section-button"} onClick={addContentSection} type="button">{newContentSectionId ? <CheckCircle2 size={15} /> : <Plus size={15} />} {newContentSectionId ? "섹션 추가됨" : "섹션 추가"}</button></div>
                  {editor.contentSections.map((section) => (
                    <section className={section.id === newContentSectionId ? "admin-course-section-editor is-new" : "admin-course-section-editor"} key={section.id} ref={(element) => { sectionEditorRefs.current[section.id] = element; }}>
                      <div className="admin-course-track-heading"><strong>{section.title || sectionLabels[section.type]}</strong><button aria-label="섹션 삭제" onClick={() => removeContentSection(section.id)} type="button"><Trash2 size={15} /></button></div>
                      <div className="admin-editor-grid">
                        <label>섹션 유형<select onChange={(event) => {
                          const type = event.target.value as CourseContentSection["type"];
                          updateContentSection(section.id, { title: section.title || sectionLabels[type], type });
                        }} value={section.type}>{courseSectionTypes.map((type) => <option key={type} value={type}>{sectionLabels[type]}</option>)}</select></label>
                        <label>섹션 제목<input onChange={(event) => updateContentSection(section.id, { title: event.target.value })} value={section.title} /></label>
                        <label className="full">설명<textarea onChange={(event) => updateContentSection(section.id, { body: event.target.value })} rows={3} value={section.body} /></label>
                        <label className="full">목록 항목<textarea onChange={(event) => updateContentSection(section.id, { items: event.target.value.split("\n") })} placeholder="한 줄에 한 항목씩 입력" rows={5} value={section.items.join("\n")} /></label>
                        <label className="full">섹션 이미지<span className="community-file-upload"><ImagePlus size={18} /><span><strong>이미지 선택</strong><small>{sectionImagePreviews[section.id] ? "선택한 이미지 미리보기 · 권장 1200×900px" : section.images[0]?.url ? "등록된 이미지 교체 · 권장 1200×900px" : "권장 1200×900px · 공개 페이지에서 4:3 비율로 표시"}</small></span><input accept="image/jpeg,image/png,image/webp,image/gif" name={`sectionImage-${section.id}`} onChange={(event) => handleSectionImageChange(section.id, event)} ref={(input) => { sectionImageInputRefs.current[section.id] = input; }} type="file" /></span></label>
                        {sectionImagePreviews[section.id] || section.images[0]?.url ? <div className="community-image-preview full"><Image alt={section.images[0]?.alt || section.title || "섹션 이미지 미리보기"} height={96} src={sectionImagePreviews[section.id] || section.images[0]?.url || ""} unoptimized width={144} /><button onClick={() => clearSectionImage(section.id)} type="button">이미지 제거</button></div> : null}
                      </div>
                    </section>
                  ))}
                  {!editor.contentSections.length ? <div className="console-empty-state">상세 섹션을 추가해 주세요.</div> : null}
                </div> : null}

                {editorTab === "media" ? <div className="admin-editor-grid">
                  <p className="full admin-course-media-note">과정 안내서나 시간표 등 필요한 PDF 자료만 선택적으로 첨부합니다.</p>
                  <label className="full">
                    선택 첨부자료 (PDF)
                    <span className="community-file-upload"><FileText size={18} /><span><strong>PDF 선택</strong><small>{selectedPdfName || "선택 사항 · PDF / 15MB 이하"}</small></span><input accept="application/pdf" name="pdfFile" onChange={(event) => setSelectedPdfName(event.target.files?.[0]?.name ?? "")} ref={pdfInputRef} type="file" /></span>
                    {editor.pdfUrl ? <div className="community-attachment-preview"><a href={editor.pdfUrl} rel="noreferrer" target="_blank"><FileText size={16} /> {editor.pdfFileName || "등록된 PDF 보기"}</a><button onClick={() => setEditor((current) => ({ ...current, pdfFileName: "", pdfUrl: "" }))} type="button">첨부파일 제거</button></div> : null}
                  </label>
                </div> : null}
                {result ? <div className={result.ok ? "form-success" : "form-error full"} role="status">{result.ok ? <CheckCircle2 size={18} /> : null}<span>{result.message}</span></div> : null}
                <div className="admin-course-action-bar">
                  <button className="primary-button" disabled={isPending} type="submit"><Save size={16} /> 변경사항 저장</button>
                  {activeCourse.isActive ? <button className="secondary-button danger" disabled={isPending} onClick={handleArchive} type="button"><Archive size={16} /> 과정 보관</button> : (
                    <>
                      <button className="secondary-button" disabled={isPending} onClick={handleRestore} type="button"><RotateCcw size={16} /> 과정 다시 활성화</button>
                      <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button"><Trash2 size={16} /> 영구 삭제</button>
                    </>
                  )}
                </div>
              </form>
            </>
          ) : <div className="console-empty-state"><FileText size={20} /><span>교육과정을 생성해 주세요.</span></div>}
        </section>
      </div>

      {courseFeedback ? <div className="admin-course-undo-toast admin-course-feedback-toast" role="status" aria-live="polite">
        <span>{courseFeedback.kind === "section-added" ? "섹션이 추가되었습니다." : "교육 항목을 삭제했습니다."}</span>
        {courseFeedback.kind === "curriculum-removed" ? <button onClick={undoCurriculumItemRemoval} type="button"><Undo2 size={15} /> 삭제 실행 취소</button> : null}
      </div> : null}

      {isCreateOpen ? (
        <div className="admin-users-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsCreateOpen(false)}>
          <form className="admin-users-modal admin-course-create-modal" onSubmit={handleCreate} role="dialog" aria-modal="true" aria-labelledby="admin-course-create-title">
            <div className="admin-users-modal-heading"><Plus size={22} /><div><h3 id="admin-course-create-title">교육과정 생성</h3><p>과정 그룹과 세부 유형을 선택한 뒤 언어별 콘텐츠를 등록합니다.</p></div><button aria-label="닫기" className="admin-users-modal-close" onClick={() => setIsCreateOpen(false)} type="button"><X size={17} /></button></div>
            <div className="admin-editor-grid">
              <label className="full">한국어 과정명<input autoFocus onChange={(event) => setCreateTitle(event.target.value)} required value={createTitle} /></label>
              <label>목록 요약<textarea onChange={(event) => setCreateSummary(event.target.value)} required={createStatus === "published"} rows={3} value={createSummary} /></label>
              <label>과정 개요<textarea onChange={(event) => setCreateOverview(event.target.value)} required={createStatus === "published"} rows={3} value={createOverview} /></label>
              <label>과정 그룹<select onChange={(event) => updateCreateCategory(event.target.value as CourseCategoryKey)} value={createCategory}>{courseCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select><small className="admin-field-help">공개 과정 목록의 필터와 그룹에 사용됩니다.</small></label>
              <label>세부 유형<select onChange={(event) => setCreateTemplate(event.target.value as CourseTemplateKey)} value={createTemplate}>{courseTemplatesByCategory[createCategory].map((template) => <option key={template} value={template}>{templateLabels[template]}</option>)}</select><small className="admin-field-help">과정의 교육 목적을 구분합니다.</small></label>
              <label>초기 게시 상태<select onChange={(event) => setCreateStatus(event.target.value)} value={createStatus}>{courseStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select><small className="admin-field-help">공개로 생성하면 한국어 과정 페이지에 바로 노출됩니다.</small></label>
              <label>노출 순서<input min={0} onChange={(event) => setCreateSortOrder(Number(event.target.value))} type="number" value={createSortOrder} /></label>
            </div>
            {result && !result.ok ? <div className="form-error" role="status">{result.message}</div> : null}
            <div className="admin-editor-actions"><button className="primary-button" disabled={isPending} type="submit"><Plus size={16} /> {isPending ? "생성 중" : "과정 생성"}</button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function AdminCourseSaveOverlay() {
  return (
    <div className="admin-action-overlay" role="status" aria-live="assertive" aria-label="과정 저장 중">
      <div className="admin-action-loader">
        <span className="admin-action-spinner" aria-hidden="true" />
        <strong>변경사항을 저장하고 있습니다</strong>
        <p>과정 내용을 저장하고 있습니다. 이미지가 있으면 업로드까지 함께 처리합니다.</p>
        <span className="admin-action-progress" aria-hidden="true"><span /></span>
      </div>
    </div>
  );
}

function toEditor(localization: AdminCourseLocalization | null): LocalizationEditor {
  if (!localization) return { ...emptyLocalization };
  return {
    certificationNote: localization.certificationNote,
    contentSections: localization.contentSections,
    curriculumText: localization.curriculumItems.join("\n"),
    duration: localization.duration,
    imageUrl: localization.imageUrl,
    overview: localization.overview,
    pdfFileName: localization.pdfFileName,
    pdfUrl: localization.pdfUrl,
    recommendedText: localization.recommendedFor.join("\n"),
    scheduleTracks: localization.scheduleTracks,
    status: localization.status,
    summary: localization.summary,
    title: localization.title
  };
}

function getCourseTitle(course: AdminCourseRecord) {
  return course.localizations.find((item) => item.locale === "ko")?.title ?? course.localizations[0]?.title ?? course.slug;
}

function getCoursePublicationGuide(isActive: boolean, status?: string) {
  if (!isActive) return "보관된 과정은 모든 언어 페이지에서 숨겨집니다. 다시 노출하려면 과정을 활성화한 뒤 언어별 게시 상태를 확인해 주세요.";
  if (status === "published") return "현재 언어는 공개 중입니다. 저장 후 공개 페이지를 열어 실제 화면을 확인해 주세요.";
  if (status === "reviewed") return "검수는 끝났지만 아직 공개 전입니다. 게시 상태를 공개로 바꾸고 저장하면 방문자에게 보입니다.";
  if (status === "translated") return "번역 초안이 준비된 상태입니다. 문구를 검수한 뒤 검수완료 또는 공개 상태로 저장해 주세요.";
  if (status === "archived") return "현재 언어 콘텐츠는 보관 상태입니다. 다시 보이게 하려면 게시 상태를 공개로 바꿔 저장해 주세요.";
  if (status === "draft") return "작성 중인 초안입니다. 공개 페이지에는 나오지 않으니 내용을 확인한 뒤 공개 상태로 저장해 주세요.";
  return "아직 이 언어의 콘텐츠가 없습니다. 제목과 소개를 입력한 뒤 저장해 주세요.";
}
