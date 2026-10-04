"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { Edit3, ImagePlus, Save, Trash2, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteAdminManagedItem,
  saveAdminContent,
  uploadAdminContentImage,
  type DeleteAdminContentResult,
  type SaveAdminContentResult,
  type UploadAdminContentImageResult
} from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, getTone } from "@/components/AdminConsole";
import type { AdminContentRow } from "@/lib/admin-data";
import { adminLocaleLabels as localeLabels, resolveTranslationEditor } from "@/lib/admin-content-locales";

type ActionResult = SaveAdminContentResult | DeleteAdminContentResult | UploadAdminContentImageResult;

type EditorState = {
  career: string;
  certifications: string;
  country: string;
  education: string;
  imageUrl: string;
  legacyProfileMemo: string;
  locale: string;
  roleTitle: string;
  slug: string;
  status: string;
  title: string;
};

const blankEditor: EditorState = {
  career: "",
  certifications: "",
  country: "",
  education: "",
  imageUrl: "",
  legacyProfileMemo: "",
  locale: "ko",
  roleTitle: "",
  slug: "",
  status: "draft",
  title: ""
};

function statusLabel(status: string) {
  if (status === "published") return "노출";
  if (status === "draft") return "임시저장";
  if (status === "archived") return "비노출";
  if (status === "reviewed") return "검수 완료";
  if (status === "translated") return "번역 완료";
  return status;
}

function createDirectorSlug() {
  return `director-${Date.now()}`;
}

function parseDirectorSummary(summary = "") {
  const [roleTitle = "", ...countryParts] = summary.split("·").map((part) => part.trim());

  return {
    country: countryParts.join(" · "),
    roleTitle
  };
}

function composeDirectorSummary(editor: EditorState) {
  return [editor.roleTitle, editor.country].map((value) => value.trim()).filter(Boolean).join(" · ");
}

function getProfileSection(body: string, label: "학력" | "경력" | "자격") {
  const pattern = new RegExp(`${label}\\n([\\s\\S]*?)(?=\\n\\n(?:학력|경력|자격)\\n|$)`);
  return body.match(pattern)?.[1]?.trim() ?? "";
}

function parseProfileSections(body = "") {
  const education = getProfileSection(body, "학력");
  const career = getProfileSection(body, "경력");
  const certifications = getProfileSection(body, "자격");
  const hasSectionedBody = Boolean(education || career || certifications);

  return {
    career,
    certifications,
    education,
    legacyProfileMemo: hasSectionedBody ? "" : body.trim()
  };
}

function composeProfileBody(editor: EditorState) {
  return [
    ["학력", editor.education],
    ["경력", editor.career],
    ["자격", editor.certifications]
  ]
    .flatMap(([label, value]) => {
      const trimmed = value.trim();
      return trimmed ? [`${label}\n${trimmed}`] : [];
    })
    .join("\n\n");
}

export function AdminDirectorsManager({
  items
}: {
  items: AdminContentRow[];
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editor, setEditor] = useState<EditorState>(blankEditor);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState("");
  const [selectedItem, setSelectedItem] = useState<AdminContentRow | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [localeFilter, setLocaleFilter] = useState("");
  const [pendingAction, setPendingAction] = useState<"delete" | "save" | null>(null);
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || pendingAction !== null;
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    if (!isEditorOpen) return;
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [isEditorOpen]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.slug?.toLowerCase().includes(keyword) ||
        item.summary?.toLowerCase().includes(keyword);
      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesKeyword && matchesStatus && (!localeFilter || item.locale === localeFilter);
    });
  }, [items, search, statusFilter, localeFilter]);

  const rows = filteredItems.map((item) => ({
    id: item.id ?? `${item.locale}-${item.slug}`,
    image: item.imageUrl ? <img alt="" className="director-admin-thumb" src={item.imageUrl} /> : "-",
    manage: (
      <button
        aria-label={`${item.title} 디렉터 수정`}
        className="console-row-action"
        onClick={() => selectItem(item)}
        type="button"
      >
        <Edit3 size={14} />
      </button>
    ),
    role: item.summary ?? "-",
    locale: localeLabels[item.locale] ?? item.locale,
    status: <AdminStatusBadge tone={getTone(item.status)}>{statusLabel(item.status)}</AdminStatusBadge>,
    title: (
      <button className="community-link-button" onClick={() => selectItem(item)} type="button">
        {item.title}
      </button>
    ),
    translations: item.locale === "ko" ? Object.entries(localeLabels).filter(([locale]) => locale !== "ko").map(([locale, label]) => {
      const translated = items.find((row) => row.slug === item.slug && row.locale === locale);
      return <button key={locale} className="community-link-button" type="button" onClick={() => openTranslation(item, locale)}>{label}: {translated ? statusLabel(translated.status) : "미등록"} </button>;
    }) : "한국어 항목과 연결됨",
    updatedAt: item.updatedAt
  }));

  function resetImageInput() {
    setSelectedImageName("");
    setSelectedImagePreviewUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return "";
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleImageFileChange(file?: File) {
    setSelectedImageName(file?.name ?? "");
    setSelectedImagePreviewUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return file ? URL.createObjectURL(file) : "";
    });
  }

  function closeEditor() {
    if (isBusy) return;
    setConfirmDelete(false);
    setIsEditorOpen(false);
    setSelectedItem(null);
    setResult(null);
    resetImageInput();
  }

  function startCreate() {
    setIsEditorOpen(true);
    setSelectedItem(null);
    setResult(null);
    resetImageInput();
    setEditor({
      ...blankEditor,
      slug: createDirectorSlug()
    });
  }

  function selectItem(item: AdminContentRow, isNew = false) {
    const summary = parseDirectorSummary(item.summary ?? "");
    const profileSections = parseProfileSections(item.body ?? "");

    setIsEditorOpen(true);
    setSelectedItem(isNew ? null : item);
    setResult(null);
    resetImageInput();
    setEditor({
      career: profileSections.career,
      certifications: profileSections.certifications,
      country: summary.country,
      education: profileSections.education,
      imageUrl: (item.locale === "ko" ? item.imageUrl : items.find((source) => source.locale === "ko" && source.slug === item.slug)?.imageUrl) ?? "",
      legacyProfileMemo: profileSections.legacyProfileMemo,
      locale: item.locale,
      roleTitle: summary.roleTitle,
      slug: item.slug ?? createDirectorSlug(),
      status: item.status,
      title: item.title
    });
  }

  function updateEditor(name: keyof EditorState, value: string) {
    setEditor((current) => ({ ...current, [name]: value }));
  }

  function openTranslation(source: AdminContentRow, locale: string) {
    const target = resolveTranslationEditor(source, locale, items);
    if (!target) return;
    selectItem(target.item, target.isNew);
    if (target.isNew) setResult({ ok: true, message: `${localeLabels[locale]} 번역 초안입니다. 이름과 내용을 번역해 저장하세요. 한국어 원본은 변경되지 않습니다.` });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const slug = editor.slug.trim().toLowerCase();

    if (!selectedItem && items.some((item) => item.slug === slug && item.locale === editor.locale)) {
      setResult({ ok: false, message: "해당 언어 디렉터가 이미 있습니다. 기존 항목을 열어 수정해 주세요." });
      return;
    }

    if (!slug.startsWith("director-")) {
      setResult({ ok: false, message: "슬러그는 director-로 시작해야 공개 국제 디렉터 영역에 연결됩니다." });
      return;
    }

    setPendingAction("save");
    startTransition(async () => {
      try {
        let imageUrl = editor.imageUrl;
        const imageFile = formData.get("imageFile");

        if (imageFile instanceof File && imageFile.size > 0) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);
          uploadFormData.append("contentType", "Page");
          uploadFormData.append("slug", slug);

          const uploadResult = await uploadAdminContentImage(uploadFormData);

          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }

          imageUrl = uploadResult.url;
        }

        const nextResult = await saveAdminContent({
          body: composeProfileBody(editor) || editor.legacyProfileMemo,
          contentType: "Page",
          imageUrl,
          expectedContentId: selectedItem?.id,
          locale: editor.locale,
          preventOverwrite: !selectedItem,
          slug,
          sourceUrl: "",
          status: editor.status,
          summary: composeDirectorSummary(editor),
          title: editor.title
        });

        setResult(nextResult);

        if (nextResult.ok) {
          resetImageInput();
          setSelectedItem(null);
          setIsEditorOpen(false);
          setEditor(blankEditor);
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleDelete() {
    if (!selectedItem?.id) {
      return;
    }

    const selectedId = selectedItem.id;
    setConfirmDelete(false);

    setResult(null);
    setPendingAction("delete");
    startTransition(async () => {
      try {
        const nextResult = await deleteAdminManagedItem({
          id: selectedId,
          itemType: "content"
        });

        setResult(nextResult);

        if (nextResult.ok) {
          resetImageInput();
          setSelectedItem(null);
          setIsEditorOpen(false);
          setEditor(blankEditor);
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="community-manager director-manager">
      {isBusy ? (
        <div className="admin-action-overlay" role="status" aria-live="polite">
          <div className="admin-action-box">
            <strong>{pendingAction === "delete" ? "삭제 중" : "저장 중"}</strong>
            <span>잠시만 기다려 주세요.</span>
          </div>
        </div>
      ) : null}

      <section className="console-panel community-list-panel">
        <div className="community-panel-top">
          <div>
            <h2>국제 디렉터 목록</h2>
            <p>한국어 항목의 명단·사진·노출 상태가 모든 언어에 공통으로 적용됩니다.</p>
            <p>한국어로 등록한 뒤 같은 항목에서 번역을 관리하세요. 번역이 없거나 한국어 원문이 변경되면 최신 한국어 정보를 표시합니다.</p>
          </div>
          <button className="console-primary-button" onClick={startCreate} type="button">
            <UserPlus size={16} />
            디렉터 등록
          </button>
        </div>

        <div className="console-filter-bar">
          <label className="console-select">
            <span className="sr-only">언어 필터</span>
            <select onChange={(event) => setLocaleFilter(event.target.value)} value={localeFilter}>
              <option value="">전체 언어</option>
              {Object.entries(localeLabels).map(([locale, label]) => <option key={locale} value={locale}>{label}</option>)}
            </select>
          </label>
          <label className="console-search-input">
            <span className="sr-only">디렉터 검색</span>
            <input onChange={(event) => setSearch(event.target.value)} placeholder="이름, 직책, 국가 검색" value={search} />
          </label>
          <label className="console-select">
            <span className="sr-only">상태 필터</span>
            <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="">전체 상태</option>
              <option value="published">노출</option>
              <option value="draft">임시저장</option>
              <option value="archived">비노출</option>
            </select>
          </label>
        </div>

        <AdminTable
          columns={[
            { key: "image", label: "사진", align: "center" },
            { key: "title", label: "이름" },
            { key: "locale", label: "언어" },
            { key: "role", label: "직책/국가" },
            { key: "status", label: "상태" },
            { key: "translations", label: "번역 현황" },
            { key: "updatedAt", label: "최종 수정일" },
            { key: "manage", label: "관리", align: "center" }
          ]}
          emptyLabel="등록된 국제 디렉터 콘텐츠가 없습니다."
          rows={rows}
        />
      </section>

      {isEditorOpen ? (
          <dialog
            ref={dialogRef}
            onCancel={(event) => { event.preventDefault(); closeEditor(); }}
            aria-labelledby="director-modal-title"
            aria-modal="true"
            aria-busy={isBusy}
            className="director-modal-panel is-open"
            role="dialog"
          >
            <div className="community-editor-header">
              <div>
                <h2 id="director-modal-title">{`${localeLabels[editor.locale]} · ${selectedItem ? `${editor.title} 수정` : editor.locale === "ko" ? "디렉터 등록" : "번역 등록"}`}</h2>
                <p>{localeLabels[editor.locale]} · 이름, 직책과 사진을 관리합니다.</p>
              </div>
              <button
                aria-label="편집 닫기"
                className="console-icon-button"
                onClick={closeEditor}
                disabled={isBusy}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <form className="admin-editor-form community-editor-form director-editor-form" onSubmit={handleSubmit}>
              <div className="director-editor-scroll" tabIndex={0} role="region" aria-label="디렉터 입력 항목">
              <fieldset className="director-editor-fields" disabled={isBusy}>
              {result ? <div role="status" className={result.ok ? "console-success-message" : "console-error-message"}>{result.message}</div> : null}
              <p className="community-editor-note">사진과 명단은 모든 언어에 공통 적용됩니다. 번역은 검수 완료 후 노출로 저장하세요.</p>
              {selectedItem?.locale === "ko" ? (
                <div className="director-translation-options" aria-label="다른 언어 번역 만들기">
                  {Object.entries(localeLabels).filter(([locale]) => locale !== editor.locale).map(([locale, label]) => (
                    <button className="director-translation-button" disabled={isBusy} key={locale} onClick={() => openTranslation(selectedItem, locale)} type="button">
                      <strong>{label}</strong><span>{items.some((item) => item.slug === editor.slug && item.locale === locale) ? "번역 수정" : "번역 초안 만들기"}</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="community-form-grid">
                <label>
                  <span>언어</span>
                  <select disabled onChange={(event) => updateEditor("locale", event.target.value)} value={editor.locale}>
                    {Object.entries(localeLabels).map(([locale, label]) => <option key={locale} value={locale}>{label}</option>)}
                  </select>
                </label>
                <label>
                  <span>상태</span>
                  <select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>
                    <option value="draft">임시저장</option>
                    <option value="translated">번역 완료</option>
                    <option value="reviewed">검수 완료</option>
                    <option disabled={editor.locale !== "ko" && selectedItem?.status !== "reviewed"} value="published">노출</option>
                    <option value="archived">비노출</option>
                  </select>
                </label>
                <label>
                  <span>이름</span>
                  <input onChange={(event) => updateEditor("title", event.target.value)} required value={editor.title} />
                </label>
                <label>
                  <span>직책</span>
                  <input onChange={(event) => updateEditor("roleTitle", event.target.value)} placeholder="국제 디렉터" value={editor.roleTitle} />
                </label>
                <label>
                  <span>국가</span>
                  <input onChange={(event) => updateEditor("country", event.target.value)} placeholder="몽골" value={editor.country} />
                </label>
              </div>

              <label>
                <span>학력</span>
                <textarea onChange={(event) => updateEditor("education", event.target.value)} rows={3} value={editor.education} />
              </label>

              {editor.legacyProfileMemo ? (
                <div className="director-legacy-profile-note">
                  <strong>기존 프로필 메모</strong>
                  <p>{editor.legacyProfileMemo}</p>
                </div>
              ) : null}

              <label>
                <span>경력</span>
                <textarea onChange={(event) => updateEditor("career", event.target.value)} rows={4} value={editor.career} />
              </label>

              <label>
                <span>자격</span>
                <textarea onChange={(event) => updateEditor("certifications", event.target.value)} rows={3} value={editor.certifications} />
              </label>

              {editor.locale === "ko" ? <label className="community-image-upload">
                <span>
                  <ImagePlus size={16} />
                  사진 업로드
                </span>
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  name="imageFile"
                  onChange={(event) => handleImageFileChange(event.target.files?.[0])}
                  ref={imageInputRef}
                  type="file"
                />
                <em>{selectedImageName || "JPG, PNG, WebP, GIF"}</em>
              </label> : <p>사진과 명단 노출은 한국어 항목에서 변경합니다.</p>}

              {selectedImagePreviewUrl || editor.imageUrl ? (
                <div className="community-image-preview">
                  <img alt="사진 미리보기" src={selectedImagePreviewUrl || editor.imageUrl} />
                  <strong>사진 미리보기</strong>
                </div>
              ) : null}

              </fieldset>
              </div>
              {confirmDelete ? <div className="director-delete-confirm" role="alert">
                <strong>{editor.title} 항목을 삭제할까요?</strong>
                <p>삭제하면 복구할 수 없습니다. 한국어 항목은 모든 언어의 공개 명단에서도 사라집니다.</p>
                <button autoFocus type="button" className="director-secondary-button" onClick={() => setConfirmDelete(false)}>돌아가기</button>
                <button type="button" className="danger-button" disabled={isBusy} onClick={handleDelete}>삭제 확인</button>
              </div> : null}
              <div className="community-editor-actions director-editor-footer">
                {selectedItem ? (
                  <button className="danger-button" disabled={isBusy} onClick={() => setConfirmDelete(true)} type="button">
                    <Trash2 size={16} />
                    삭제
                  </button>
                ) : null}
                <button className="director-secondary-button" disabled={isBusy} onClick={closeEditor} type="button">닫기</button>
                <button className="console-primary-button" disabled={isBusy} type="submit">
                  <Save size={16} />
                  {isBusy ? (pendingAction === "delete" ? "삭제 중…" : "저장 중…") : `${localeLabels[editor.locale]} 저장`}
                </button>
              </div>
            </form>
          </dialog>
      ) : null}


    </div>
  );
}
