"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { Edit3, FilePlus2, FileText, FolderPlus, ImagePlus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deleteAdminManagedItem,
  saveAdminContent,
  uploadAdminContentAttachment,
  uploadAdminContentImage,
  type DeleteAdminContentResult,
  type SaveAdminContentResult,
  type UploadAdminContentAttachmentResult,
  type UploadAdminContentImageResult
} from "@/app/admin/actions";
import { AdminStatusBadge, AdminTable, getTone } from "@/components/AdminConsole";
import type { AdminContentRow } from "@/lib/admin-data";
import { adminLocaleLabels as localeLabels, createTranslationDraft } from "@/lib/admin-content-locales";

type ActivityOption = {
  key: string;
  order: number;
  source: string;
  summary: string;
  title: string;
};

type CommunityMode = "boards" | "posts";
type EditorKind = "board" | "post";
type PendingAction = "delete" | "save";
type ActionResult =
  | SaveAdminContentResult
  | DeleteAdminContentResult
  | UploadAdminContentAttachmentResult
  | UploadAdminContentImageResult;

type EditorState = {
  boardKey: string;
  body: string;
  imageUrl: string;
  kind: EditorKind;
  locale: string;
  sourceUrl: string;
  slug: string;
  status: string;
  summary: string;
  title: string;
};

type BoardSummary = {
  count: number;
  id: string;
  intro?: AdminContentRow;
  key: string;
  latest?: AdminContentRow;
  order: number;
  postCount: number;
  published: boolean;
  source: string;
  summary: string;
  title: string;
};

const blankEditor: EditorState = {
  boardKey: "",
  body: "",
  imageUrl: "",
  kind: "board",
  locale: "ko",
  sourceUrl: "",
  slug: "",
  status: "draft",
  summary: "",
  title: ""
};

const statusLabels: Record<string, string> = {
  archived: "비노출",
  draft: "임시저장",
  published: "노출",
  reviewed: "검수 완료",
  translated: "번역 완료"
};

export function AdminCommunityManager({
  activityOptions,
  items
}: {
  activityOptions: ActivityOption[];
  items: AdminContentRow[];
}) {
  const router = useRouter();
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<CommunityMode>("boards");
  const [boardFilter, setBoardFilter] = useState("");
  const [editor, setEditor] = useState<EditorState>(blankEditor);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isKeyLocked, setIsKeyLocked] = useState(false);
  const [localeFilter, setLocaleFilter] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<AdminContentRow | null>(null);
  const [selectedAttachmentName, setSelectedAttachmentName] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || pendingAction !== null;
  const isPhotoGalleryPost = editor.kind === "post" && editor.boardKey === "photo";

  const boardKeys = useMemo(() => buildKnownBoardKeys(activityOptions, items), [activityOptions, items]);
  const optionTitleByKey = useMemo(
    () => new Map(activityOptions.map((option) => [option.key, option.title])),
    [activityOptions]
  );
  const boards = useMemo(() => buildBoards(localeFilter ? items.filter((item) => item.locale === localeFilter) : items, boardKeys, activityOptions, optionTitleByKey), [activityOptions, boardKeys, items, optionTitleByKey, localeFilter]);
  const boardTitleByKey = useMemo(
    () => new Map(boards.map((board) => [board.key, board.title])),
    [boards]
  );
  const filteredBoards = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return boards.filter((board) => {
      const matchesKeyword =
        !keyword ||
        board.key.toLowerCase().includes(keyword) ||
        board.title.toLowerCase().includes(keyword) ||
        board.summary.toLowerCase().includes(keyword) ||
        board.source.toLowerCase().includes(keyword);
      const matchesStatus =
        !statusFilter ||
        board.latest?.status === statusFilter ||
        (statusFilter === "published" && board.published) ||
        (statusFilter === "draft" && !board.latest);

      return matchesKeyword && matchesStatus;
    });
  }, [boards, search, statusFilter]);
  const postItems = useMemo(
    () => items.filter((item) => !isBoardIntro(item, boardKeys)),
    [boardKeys, items]
  );
  const filteredPosts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return postItems.filter((item) => {
      const boardKey = getBoardKey(item.slug ?? "", boardKeys);
      const matchesKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.slug?.toLowerCase().includes(keyword) ||
        item.summary?.toLowerCase().includes(keyword);
      const matchesBoard = !boardFilter || boardKey === boardFilter;
      const matchesLocale = !localeFilter || item.locale === localeFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesKeyword && matchesBoard && matchesLocale && matchesStatus;
    });
  }, [boardFilter, boardKeys, localeFilter, postItems, search, statusFilter]);
  const boardRows = filteredBoards.map((board, index) => ({
    count: board.postCount,
    id: board.id,
    action: (
      <button className="community-inline-action" onClick={() => selectBoard(board)} type="button">
        {board.intro ? "소개 수정" : "소개 등록"}
      </button>
    ),
    manage: (
      <button
        aria-label={`${board.title} 게시판 수정`}
        className="console-row-action"
        onClick={() => selectBoard(board)}
        type="button"
      >
        <Edit3 size={14} />
      </button>
    ),
    name: (
      <button className="community-link-button" onClick={() => selectBoard(board)} type="button">
        {board.title}
      </button>
    ),
    order: board.order || index + 1,
    status: (
      <AdminStatusBadge tone={getTone(board.published ? "published" : board.latest?.status ?? "draft")}>
        {board.published ? "노출" : board.latest ? statusLabel(board.latest.status) : "소개 미등록"}
      </AdminStatusBadge>
    ),
    type: <code className="community-code">{board.key}</code>
  }));
  const postRows = filteredPosts.map((item) => {
    const boardKey = getBoardKey(item.slug ?? "", boardKeys);

    return {
      board: boardTitleByKey.get(boardKey) ?? boardKey,
      id: item.id ?? `${item.locale}-${item.slug}`,
      locale: localeLabels[item.locale] ?? item.locale,
      manage: (
        <button
          aria-label={`${item.title} 게시글 수정`}
          className="console-row-action"
          onClick={() => selectPost(item)}
          type="button"
        >
          <Edit3 size={14} />
        </button>
      ),
      slug: <code className="community-code">{item.slug}</code>,
      status: <AdminStatusBadge tone={getTone(item.status)}>{statusLabel(item.status)}</AdminStatusBadge>,
      title: (
        <button className="community-link-button" onClick={() => selectPost(item)} type="button">
          {item.title}
        </button>
      ),
      updatedAt: item.updatedAt
    };
  });

  function resetFilters(nextTab: CommunityMode) {
    setActiveTab(nextTab);
    setBoardFilter("");
    setEditor(blankEditor);
    resetImageInput();
    setIsEditorOpen(false);
    setIsKeyLocked(false);
    setLocaleFilter("");
    setSearch("");
    setSelectedItem(null);
    setStatusFilter("");
  }

  function startCreate(kind: EditorKind) {
    setActiveTab(kind === "board" ? "boards" : "posts");
    setIsEditorOpen(true);
    setIsKeyLocked(false);
    setSelectedItem(null);
    resetImageInput();
    setResult(null);
    setEditor({
      ...blankEditor,
      kind,
      status: kind === "board" ? "draft" : "draft"
    });
  }

  function selectBoard(board: BoardSummary) {
    const item = board.intro ?? null;
    setActiveTab("boards");
    setIsEditorOpen(true);
    setIsKeyLocked(true);
    setSelectedItem(item);
    resetImageInput();
    setResult(null);
    setEditor({
      boardKey: board.key,
      body: item?.body ?? board.summary,
      imageUrl: item?.imageUrl ?? "",
      kind: "board",
      locale: item?.locale ?? (localeFilter || "ko"),
      sourceUrl: item?.sourceUrl ?? "",
      slug: board.key,
      status: item?.status ?? "draft",
      summary: item?.summary ?? board.summary,
      title: item?.title ?? board.title
    });
  }

  function selectPost(item: AdminContentRow) {
    setActiveTab("posts");
    setIsEditorOpen(true);
    setIsKeyLocked(true);
    setSelectedItem(item);
    resetImageInput();
    setResult(null);
    setEditor({
      boardKey: getBoardKey(item.slug ?? "", boardKeys),
      body: item.body ?? "",
      imageUrl: item.imageUrl ?? "",
      kind: "post",
      locale: item.locale,
      sourceUrl: item.sourceUrl ?? "",
      slug: item.slug ?? "",
      status: item.status,
      summary: item.summary ?? "",
      title: item.title
    });
  }

  function updateEditor(name: keyof EditorState, value: string) {
    setEditor((current) => {
      if (name === "kind") {
        return {
          ...current,
          kind: value as EditorKind,
          slug: value === "board" ? current.boardKey : current.slug
        };
      }

      if (name === "boardKey" && current.kind === "board") {
        return { ...current, boardKey: value, slug: value };
      }

      if (name === "boardKey" && current.kind === "post") {
        return { ...current, boardKey: value, slug: value ? createPostSlug(value) : "" };
      }

      return { ...current, [name]: value };
    });
  }

  function startTranslation(locale: string) {
    const draft = createTranslationDraft(editor, locale, items);
    if (!draft) {
      setResult({ ok: false, message: "해당 언어 항목이 이미 있습니다. 목록에서 기존 번역을 선택해 수정해 주세요." });
      return;
    }
    setSelectedItem(null);
    setIsKeyLocked(true);
    resetImageInput();
    setEditor(draft);
    setResult({ ok: true, message: "번역 초안을 복사했습니다. 내용을 번역한 뒤 검수 완료로 저장하고, 다시 열어 최고 관리자가 노출로 저장하세요." });
  }

  function resetImageInput() {
    setSelectedImageName("");
    setSelectedAttachmentName("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const slug = (editor.kind === "board" ? editor.boardKey : editor.slug).trim().toLowerCase();

    if (!selectedItem && items.some((item) => item.slug === slug && item.locale === editor.locale)) {
      setResult({ ok: false, message: "해당 언어 항목이 이미 있습니다. 기존 항목을 열어 수정해 주세요." });
      return;
    }

    setPendingAction("save");
    startTransition(async () => {
      try {
        let imageUrl = editor.imageUrl;
        let sourceUrl = editor.sourceUrl;
        const attachmentFile = formData.get("attachmentFile");
        const hasNewAttachment = attachmentFile instanceof File && attachmentFile.size > 0;
        const imageFile = formData.get("imageFile");
        const hasNewImage = imageFile instanceof File && imageFile.size > 0;

        if (isPhotoGalleryPost && !imageUrl && !hasNewImage) {
          setResult({ ok: false, message: "포토갤러리는 대표 이미지를 먼저 등록해야 합니다." });
          return;
        }

        if (hasNewImage && imageFile instanceof File) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);
          uploadFormData.append("contentType", "Activity");
          uploadFormData.append("slug", slug || "content");

          const uploadResult = await uploadAdminContentImage(uploadFormData);

          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }

          imageUrl = uploadResult.url;
        }

        if (editor.kind === "post" && hasNewAttachment && attachmentFile instanceof File) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", attachmentFile);
          uploadFormData.append("contentType", "Activity");
          uploadFormData.append("slug", slug || "content");

          const uploadResult = await uploadAdminContentAttachment(uploadFormData);

          if (!uploadResult.ok || !uploadResult.url) {
            setResult(uploadResult);
            return;
          }

          sourceUrl = uploadResult.url;
        }

        const nextResult = await saveAdminContent({
          body: editor.body,
          contentType: "Activity",
          imageUrl,
          locale: editor.locale,
          preventOverwrite: !selectedItem,
          slug,
          sourceUrl,
          status: editor.status,
          summary: editor.summary,
          title: editor.title
        });

        setResult(nextResult);

        if (nextResult.ok) {
          resetImageInput();
          setSelectedItem(null);
          setIsEditorOpen(false);
          setIsKeyLocked(false);
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

    const confirmed = window.confirm(`"${selectedItem.title}" 항목을 삭제할까요? 공개 화면에서도 사라질 수 있습니다.`);

    if (!confirmed) {
      return;
    }

    setResult(null);
    setPendingAction("delete");
    startTransition(async () => {
      try {
        const nextResult = await deleteAdminManagedItem({
          id: selectedItem.id ?? "",
          itemType: "content"
        });

        setResult(nextResult);

        if (nextResult.ok) {
          resetImageInput();
          setSelectedItem(null);
          setIsEditorOpen(false);
          setIsKeyLocked(false);
          setEditor(blankEditor);
          router.refresh();
        }
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="community-manager">
      {isBusy ? <AdminActionOverlay action={pendingAction ?? "save"} /> : null}
      <section className="console-panel community-list-panel">
        <div className="community-panel-top">
          <div className="console-tabs community-tabs" role="tablist" aria-label="커뮤니티 관리 탭">
            <button className={activeTab === "boards" ? "is-active" : undefined} onClick={() => resetFilters("boards")} type="button">
              게시판 관리
            </button>
            <button className={activeTab === "posts" ? "is-active" : undefined} onClick={() => resetFilters("posts")} type="button">
              게시글 관리
            </button>
          </div>
          <div className="community-actions">
            <button className="secondary-button" onClick={() => startCreate("post")} type="button">
              <FilePlus2 size={16} />
              새 게시글 등록
            </button>
            {activeTab === "boards" ? (
              <button className="console-primary-button" onClick={() => startCreate("board")} type="button">
                <FolderPlus size={16} />
                게시판 소개 등록
              </button>
            ) : null}
          </div>
        </div>

        <div className="console-filter-bar">
          <label className="console-search-input">
            <span className="sr-only">커뮤니티 검색</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder={activeTab === "boards" ? "게시판명, 키 검색" : "제목, 요약 검색"}
              value={search}
            />
          </label>
          {activeTab === "posts" ? (
            <label className="console-select">
              <span className="sr-only">게시판 필터</span>
              <select onChange={(event) => setBoardFilter(event.target.value)} value={boardFilter}>
                <option value="">게시판 전체</option>
                {boards.map((board) => (
                  <option key={board.key} value={board.key}>
                    {board.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="console-select">
            <span className="sr-only">언어 필터</span>
            <select onChange={(event) => setLocaleFilter(event.target.value)} value={localeFilter}>
              <option value="">언어 전체</option>
              {Object.entries(localeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="console-select">
            <span className="sr-only">상태 필터</span>
            <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="">상태 전체</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {activeTab === "boards" ? (
          <AdminTable
            columns={[
              { key: "name", label: "게시판명" },
              { key: "type", label: "고정 키" },
              { key: "count", label: "게시글 수", align: "center" },
              { key: "status", label: "노출 상태", align: "center" },
              { key: "order", label: "정렬 순서", align: "center" },
              { key: "action", label: "주요 작업", align: "center" },
              { key: "manage", label: "관리", align: "center" }
            ]}
            emptyLabel="등록된 커뮤니티 게시판이 없습니다."
            rows={boardRows}
          />
        ) : (
          <AdminTable
            columns={[
              { key: "title", label: "제목" },
              { key: "board", label: "게시판" },
              { key: "locale", label: "언어", align: "center" },
              { key: "status", label: "상태", align: "center" },
              { key: "updatedAt", label: "최종 수정일", align: "center" },
              { key: "manage", label: "관리", align: "center" }
            ]}
            emptyLabel="등록된 커뮤니티 게시글이 없습니다."
            rows={postRows}
          />
        )}
      </section>

      {!isEditorOpen ? (
        <section className="console-panel community-helper-card">
          <div>
            <strong>{activeTab === "boards" ? "게시판 소개를 등록해 공개 화면의 카테고리 설명을 완성하세요." : "게시글은 실제 등록한 콘텐츠만 공개 화면에 노출됩니다."}</strong>
            <p>
              {activeTab === "boards"
                ? "기획서 기준 9개 게시판 구조는 고정되어 있으며, 각 행의 소개 등록 버튼으로 필요한 설명과 노출 상태를 관리합니다."
                : "카테고리를 선택한 뒤 제목, 요약, 본문과 대표 이미지를 등록하세요. 카테고리를 선택하기 전에는 게시글 Slug가 생성되지 않습니다."}
            </p>
          </div>
          <button className="console-primary-button" onClick={() => startCreate(activeTab === "boards" ? "board" : "post")} type="button">
            {activeTab === "boards" ? <FolderPlus size={16} /> : <FilePlus2 size={16} />}
            {activeTab === "boards" ? "게시판 소개 등록" : "새 게시글 등록"}
          </button>
        </section>
      ) : (
      <section className="console-panel community-editor-panel" aria-busy={isBusy} aria-live="polite">
        <form className="admin-editor-form community-editor-form" onSubmit={handleSubmit}>
            <div className="community-editor-heading">
              <div>
                <span className="community-editor-kicker">
                  {editor.kind === "board" ? "게시판 소개" : isPhotoGalleryPost ? "포토갤러리" : "게시글 콘텐츠"}
                </span>
                <h2>
                  {selectedItem
                    ? editor.kind === "board"
                      ? "게시판 소개 수정"
                      : isPhotoGalleryPost
                        ? "포토갤러리 수정"
                        : "게시글 수정"
                    : editor.kind === "board"
                      ? "게시판 소개 등록"
                      : isPhotoGalleryPost
                        ? "새 포토갤러리 등록"
                        : "새 게시글 등록"}
                </h2>
                <p>
                  {editor.kind === "board"
                    ? "기획서 기준 게시판의 공개 화면 설명과 노출 상태를 관리합니다."
                    : isPhotoGalleryPost
                      ? "사진이 주인공인 콘텐츠입니다. 대표 이미지와 짧은 설명을 중심으로 등록하세요."
                      : "실제 공개 화면에 노출할 글로벌 활동 게시글을 등록합니다."}
                </p>
              </div>
              <button
                aria-label="편집 패널 닫기"
                className="console-row-action"
                onClick={() => {
                  setSelectedItem(null);
                  setIsEditorOpen(false);
                  setIsKeyLocked(false);
                  setEditor(blankEditor);
                  resetImageInput();
                  setResult(null);
                }}
                type="button"
              >
                <X size={14} />
              </button>
            </div>

          <p className="community-editor-note">게시글은 선택한 언어에만 표시됩니다. 한국어 원문을 저장한 뒤 각 언어의 번역을 별도로 등록하세요. 번역은 검수 완료로 저장한 후 다시 열어 최고 관리자가 노출로 저장해야 공개됩니다.</p>
          {selectedItem ? (
            <div className="community-editor-actions" aria-label="다른 언어 번역 만들기">
              {Object.entries(localeLabels).filter(([locale]) => locale !== editor.locale).map(([locale, label]) => (
                <button className="console-row-action" disabled={isBusy || items.some((item) => item.slug === editor.slug && item.locale === locale)} key={locale} onClick={() => startTranslation(locale)} type="button">
                  {label} 번역 초안 만들기{items.some((item) => item.slug === editor.slug && item.locale === locale) ? " (등록됨)" : ""}
                </button>
              ))}
            </div>
          ) : null}
          <div className={isPhotoGalleryPost ? "admin-editor-grid is-photo-gallery" : "admin-editor-grid"}>
            <label>
              관리 유형
              <select
                onChange={(event) => updateEditor("kind", event.target.value)}
                value={editor.kind}
                disabled={isKeyLocked}
              >
                <option value="board">게시판 소개</option>
                <option value="post">게시글</option>
              </select>
              <span className="admin-field-help">
                {editor.kind === "board" ? "기획서 기준 9개 게시판의 소개/노출 상태를 관리합니다." : "선택한 카테고리에 실제 게시글을 등록합니다."}
              </span>
            </label>
            <label>
              언어
              <select disabled={isKeyLocked} onChange={(event) => updateEditor("locale", event.target.value)} value={editor.locale}>
                {Object.entries(localeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {editor.kind === "board" ? "게시판 선택" : "카테고리 선택"}
              {boards.length > 0 ? (
                <select
                  disabled={isKeyLocked}
                  onChange={(event) => updateEditor("boardKey", event.target.value)}
                  required
                  value={editor.boardKey}
                >
                  <option value="">{editor.kind === "board" ? "게시판 선택" : "게시글을 올릴 게시판 선택"}</option>
                  {boards.map((board) => (
                    <option key={board.key} value={board.key}>
                      {board.title} ({board.key})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  disabled={isKeyLocked}
                  onChange={(event) => updateEditor("boardKey", normalizeSlugInput(event.target.value))}
                  placeholder="notice"
                  required={editor.kind === "board"}
                  value={editor.boardKey}
                />
              )}
              <span className="admin-field-help">
                {editor.kind === "board"
                  ? "게시판 키는 선택한 게시판의 고정 Slug로 자동 사용됩니다."
                  : isPhotoGalleryPost
                    ? "포토갤러리로 등록됩니다. 사진 중심 카드로 공개 화면에 노출됩니다."
                    : "게시글이 노출될 글로벌 활동 카테고리를 선택합니다."}
              </span>
            </label>
            <label>
              {editor.kind === "board" ? "게시판 Slug" : "게시글 Slug"}
              <input
                onChange={(event) => updateEditor("slug", normalizeSlugInput(event.target.value))}
                placeholder={editor.kind === "board" ? "notice" : "notice-20260727-143012123"}
                required
                value={editor.kind === "board" ? editor.boardKey : editor.slug}
                disabled={editor.kind === "board" || isKeyLocked || !editor.boardKey}
              />
              <span className="admin-field-help">
                {editor.kind === "board"
                  ? "게시판 소개는 선택한 게시판 키와 같은 Slug로 저장됩니다."
                  : "카테고리 선택 시 고유 Slug가 자동 생성됩니다. 같은 Slug는 기존 게시글과 충돌합니다."}
              </span>
            </label>
            <label>
              게시 상태
              <select onChange={(event) => updateEditor("status", event.target.value)} value={editor.status}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option disabled={value === "published" && editor.locale !== "ko" && selectedItem?.status !== "reviewed"} key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {isPhotoGalleryPost ? (
              <div className="community-photo-guidance full" role="note">
                <strong>포토갤러리 등록 방식</strong>
                <span>대표 이미지를 먼저 선택하고, 제목과 짧은 사진 설명만 정리하면 됩니다. 긴 본문보다 사진의 맥락이 잘 보이는 캡션이 중요합니다.</span>
              </div>
            ) : null}
            <label className={isPhotoGalleryPost ? "community-photo-upload-field full" : undefined}>
              {isPhotoGalleryPost ? "갤러리 대표 이미지" : "대표 이미지 파일"}
              <span className="community-file-upload">
                <ImagePlus size={18} />
                <span>
                  <strong>{isPhotoGalleryPost ? "사진 선택" : "이미지 선택"}</strong>
                  <small>{selectedImageName || (isPhotoGalleryPost ? "필수 · JPG, PNG, WebP, GIF / 5MB 이하" : "JPG, PNG, WebP, GIF / 5MB 이하")}</small>
                </span>
                <input
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  name="imageFile"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setSelectedImageName(file ? `${file.name} 선택됨` : "");
                  }}
                  ref={imageInputRef}
                  required={isPhotoGalleryPost && !editor.imageUrl}
                  type="file"
                />
              </span>
              {editor.imageUrl ? (
                <div className="community-image-preview">
                  <img alt="등록된 대표 이미지 미리보기" src={editor.imageUrl} />
                  <button
                    onClick={() => {
                      updateEditor("imageUrl", "");
                      resetImageInput();
                    }}
                    type="button"
                  >
                    이미지 제거
                  </button>
                </div>
              ) : null}
              <span className="admin-field-help">
                {editor.kind === "board"
                  ? "게시판 소개 상단 대표 이미지로 사용됩니다. 새 파일을 선택하면 기존 이미지를 대체합니다."
                  : isPhotoGalleryPost
                    ? "포토갤러리 카드와 상세 화면의 핵심 이미지입니다. 가로형 사진을 권장합니다."
                    : "게시글 상세 상단 이미지로 사용됩니다. 미선택 시 기존 이미지를 유지합니다."}
              </span>
            </label>
            <label className="full">
              {isPhotoGalleryPost ? "사진 제목" : "제목"}
              <input
                onChange={(event) => updateEditor("title", event.target.value)}
                placeholder={isPhotoGalleryPost ? "예: 취업전문과정 실습 현장" : "게시판명 또는 게시글 제목"}
                required
                value={editor.title}
              />
            </label>
            <label className="full">
              {isPhotoGalleryPost ? "목록 캡션" : "요약"}
              <textarea
                onChange={(event) => updateEditor("summary", event.target.value)}
                placeholder={isPhotoGalleryPost ? "사진 카드에 보일 짧은 설명" : "목록 카드와 상세 상단에 표시할 요약"}
                rows={isPhotoGalleryPost ? 2 : 3}
                value={editor.summary}
              />
            </label>
            <label className="full">
              {isPhotoGalleryPost ? "사진 설명" : "상세 본문"}
              <textarea
                onChange={(event) => updateEditor("body", event.target.value)}
                placeholder={isPhotoGalleryPost ? "촬영 상황, 과정명, 행사명 등 사진 맥락을 간단히 적어주세요." : "상세 페이지에 표시할 본문"}
                rows={isPhotoGalleryPost ? 3 : 5}
                value={editor.body}
              />
            </label>
            {editor.kind === "post" ? (
              <label className="full">
                PDF 첨부파일
                <span className="community-file-upload">
                  <FileText size={18} />
                  <span>
                    <strong>PDF 선택</strong>
                    <small>{selectedAttachmentName || "PDF / 15MB 이하"}</small>
                  </span>
                  <input
                    accept="application/pdf"
                    name="attachmentFile"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setSelectedAttachmentName(file ? `${file.name} 선택됨` : "");
                    }}
                    ref={attachmentInputRef}
                    type="file"
                  />
                </span>
                {editor.sourceUrl ? (
                  <div className="community-attachment-preview">
                    <a href={editor.sourceUrl} rel="noreferrer" target="_blank">
                      등록된 PDF 보기
                    </a>
                    <button
                      onClick={() => {
                        updateEditor("sourceUrl", "");
                        setSelectedAttachmentName("");

                        if (attachmentInputRef.current) {
                          attachmentInputRef.current.value = "";
                        }
                      }}
                      type="button"
                    >
                      첨부파일 제거
                    </button>
                  </div>
                ) : null}
                <span className="admin-field-help">
                  공지, 합격 현황, 보도자료 등에서 필요한 PDF 자료를 첨부할 수 있습니다. 새 파일을 선택하면 기존 첨부를 대체합니다.
                </span>
              </label>
            ) : null}
          </div>

          {selectedItem || (editor.kind === "post" && !editor.boardKey) ? (
            <p className="community-editor-note">
              {selectedItem
                ? "기존 항목의 Slug는 공개 URL과 연결되어 있어 이 화면에서는 고정됩니다."
                : "게시판을 선택하면 Slug가 자동으로 생성되고 직접 수정할 수 있습니다."}
            </p>
          ) : null}

          {result ? (
            <p className={result.ok ? "community-result is-success" : "community-result is-error"}>{result.message}</p>
          ) : null}

          <div className="admin-editor-actions">
              <button className="primary-button" disabled={isBusy} type="submit">
                <Save size={16} />
                {pendingAction === "save" ? "저장 중" : "저장"}
              </button>
              {selectedItem?.id ? (
                <button className="secondary-button danger" disabled={isBusy} onClick={handleDelete} type="button">
                  <Trash2 size={16} />
                  {pendingAction === "delete" ? "삭제 중" : "삭제"}
                </button>
              ) : null}
          </div>
          </form>
        </section>
      )}
    </div>
  );
}

function AdminActionOverlay({ action }: { action: PendingAction }) {
  const title = action === "delete" ? "삭제 중입니다" : "저장 중입니다";
  const description =
    action === "delete"
      ? "선택한 콘텐츠를 삭제하고 목록을 갱신하고 있습니다."
      : "이미지 업로드와 콘텐츠 저장을 처리하고 있습니다.";

  return (
    <div className="admin-action-overlay" role="status" aria-live="assertive" aria-label={title}>
      <div className="admin-action-loader">
        <span className="admin-action-spinner" aria-hidden="true" />
        <strong>{title}</strong>
        <p>{description}</p>
        <span className="admin-action-progress" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}

function buildKnownBoardKeys(activityOptions: ActivityOption[], items: AdminContentRow[]) {
  const keys = new Set(activityOptions.map((option) => option.key));

  items.forEach((item) => {
    const slug = item.slug ?? "";

    if (!slug) {
      return;
    }

    if (!slug.includes("-")) {
      keys.add(slug);
    }
  });

  return Array.from(keys).sort((a, b) => b.length - a.length);
}

function buildBoards(
  items: AdminContentRow[],
  boardKeys: string[],
  activityOptions: ActivityOption[],
  optionTitleByKey: Map<string, string>
) {
  const groups = new Map<string, AdminContentRow[]>();
  const plannedBoards = new Map(activityOptions.map((option) => [option.key, option]));

  items.forEach((item) => {
    const key = getBoardKey(item.slug ?? "", boardKeys);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });

  return Array.from(new Set([...optionTitleByKey.keys(), ...groups.keys()]))
    .map((key) => {
      const groupItems = groups.get(key) ?? [];
      const sortedItems = [...groupItems].sort((a, b) => (b.updatedAtRaw ?? b.updatedAt).localeCompare(a.updatedAtRaw ?? a.updatedAt));
      const intro = sortedItems.find((item) => item.slug === key);
      const latest = sortedItems[0];
      const option = plannedBoards.get(key);

      return {
        count: sortedItems.length,
        id: intro?.id ?? latest?.id ?? key,
        intro,
        key,
        latest,
        order: option?.order ?? 1000 + Array.from(groups.keys()).indexOf(key),
        postCount: sortedItems.filter((item) => item.slug !== key).length,
        published: sortedItems.some((item) => item.status === "published"),
        source: option?.source ?? "관리자 추가",
        summary: intro?.summary ?? option?.summary ?? latest?.summary ?? "관리자에서 추가한 커뮤니티 게시판입니다.",
        title: intro?.title ?? optionTitleByKey.get(key) ?? latest?.title ?? key
      };
    })
    .sort((a, b) => a.order - b.order);
}

function getBoardKey(slug: string, boardKeys: string[]) {
  const matchedKey = boardKeys.find((key) => slug === key || slug.startsWith(`${key}-`));

  if (matchedKey) {
    return matchedKey;
  }

  return slug.includes("-") ? slug.split("-")[0] : slug;
}

function isBoardIntro(item: AdminContentRow, boardKeys: string[]) {
  const slug = item.slug ?? "";
  return boardKeys.includes(slug);
}

function normalizeSlugInput(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

function createPostSlug(boardKey: string) {
  return `${normalizeSlugInput(boardKey)}-${formatDateTimeKey()}`;
}

function formatDateTimeKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  const second = `${now.getSeconds()}`.padStart(2, "0");
  const millisecond = `${now.getMilliseconds()}`.padStart(3, "0");

  return `${year}${month}${day}-${hour}${minute}${second}${millisecond}`;
}

function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}
