"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clipboard, ClipboardCheck, Clock3, FileImage, Pencil, Plus, RotateCcw, Save, Search, ShieldCheck, Upload, X } from "lucide-react";
import {
  saveAdminCertification,
  saveAdminCertificateTemplate,
  uploadAdminCertificateTemplateImage,
  type SaveAdminCertificationResult
} from "@/app/admin/actions";
import { AdminStatusBadge, getTone } from "@/components/AdminConsole";
import { CertificateImageViewer, CertificateInlinePreview } from "@/components/CertificateDownloadActions";
import {
  adminCertificationStatuses,
  defaultCertificateTemplateLayout,
  getAdminCertificationStatusLabel
} from "@/lib/admin-certifications";
import type {
  CertificateTemplate,
  CertificateTemplateLayout,
  CertificateTemplateLayoutFieldKey
} from "@/lib/admin-certifications";
import type { AdminCertificateTemplateRow, AdminCertificationRow } from "@/lib/admin-data";

type CertificationFormValue = {
  adminNote: string;
  certificateNumber: string;
  courseTitle: string;
  expiresAt: string;
  issuedAt: string;
  status: string;
  userEmail: string;
  verificationCode: string;
};

type Mode = "create" | "update";

type CertificationCourseOption = {
  category: string;
  title: string;
};

type CertificateTemplateFormValue = CertificateTemplate;

const templateLayoutFieldLabels: Record<CertificateTemplateLayoutFieldKey, string> = {
  certificateNumber: "자격번호",
  courseTitle: "자격명",
  holderName: "성명",
  issuedAt: "발급일",
  verificationCode: "검증코드"
};

const templateLayoutFieldKeys = Object.keys(templateLayoutFieldLabels) as CertificateTemplateLayoutFieldKey[];

const emptyTemplate: CertificateTemplateFormValue = {
  backgroundImageUrl: "",
  layout: defaultCertificateTemplateLayout,
  name: "기본 자격증 디자인",
  status: "published"
};

const certificateTemplatePreviewSample = {
  issuedAt: "2026. 09. 14.",
  number: "KHCPQA-2026-001",
  status: "issued",
  title: "피부미용사 국가자격증",
  verificationCode: "VERIFY-001"
};

const emptyForm: CertificationFormValue = {
  adminNote: "",
  certificateNumber: "",
  courseTitle: "",
  expiresAt: "",
  issuedAt: "",
  status: "issued",
  userEmail: "",
  verificationCode: ""
};

export function AdminCertificationsManager({
  certificateTemplate,
  certifications,
  courseOptions
}: {
  certificateTemplate: AdminCertificateTemplateRow | null;
  certifications: AdminCertificationRow[];
  courseOptions: CertificationCourseOption[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [formValue, setFormValue] = useState<CertificationFormValue>(emptyForm);
  const [result, setResult] = useState<SaveAdminCertificationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [copiedKey, setCopiedKey] = useState("");
  const [templateValue, setTemplateValue] = useState<CertificateTemplateFormValue>(certificateTemplate ?? emptyTemplate);
  const [templateResult, setTemplateResult] = useState<SaveAdminCertificationResult | null>(null);
  const [templateImageMessage, setTemplateImageMessage] = useState("");
  const [selectedTemplateField, setSelectedTemplateField] = useState<CertificateTemplateLayoutFieldKey>("holderName");
  const [isTemplateSaving, setIsTemplateSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isTemplatePending, startTemplateTransition] = useTransition();
  const issuedCount = certifications.filter((certification) => certification.status === "issued").length;
  const expiredCount = certifications.filter((certification) => certification.status === "expired").length;
  const revokedCount = certifications.filter((certification) => certification.status === "revoked").length;
  const statusSummary = [
    { className: "is-total", label: "전체", value: certifications.length },
    { className: "is-issued", label: "발급", value: issuedCount },
    { className: "is-expired", label: "만료", value: expiredCount },
    { className: "is-revoked", label: "취소", value: revokedCount }
  ];
  const selectableCourseOptions = useMemo(() => {
    const optionByTitle = new Map(courseOptions.map((course) => [course.title, course]));

    if (formValue.courseTitle && !optionByTitle.has(formValue.courseTitle)) {
      optionByTitle.set(formValue.courseTitle, {
        category: "기존 저장값",
        title: formValue.courseTitle
      });
    }

    return Array.from(optionByTitle.values());
  }, [courseOptions, formValue.courseTitle]);
  const filteredCertifications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return certifications.filter((certification) => {
      const matchesKeyword =
        !keyword ||
        certification.course.toLowerCase().includes(keyword) ||
        certification.number.toLowerCase().includes(keyword) ||
        certification.user.toLowerCase().includes(keyword);
      const matchesStatus = !statusFilter || certification.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [certifications, search, statusFilter]);

  function openCreateModal() {
    setMode("create");
    setFormValue(emptyForm);
    setResult(null);
    setIsModalOpen(true);
  }

  function openEditModal(certification: AdminCertificationRow) {
    setMode("update");
    setFormValue({
      adminNote: certification.adminNote,
      certificateNumber: certification.number,
      courseTitle: certification.course,
      expiresAt: certification.expiresAt,
      issuedAt: certification.issuedAtRaw,
      status: certification.status,
      userEmail: certification.userEmail,
      verificationCode: certification.verificationCode
    });
    setResult(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isPending) {
      return;
    }

    setIsModalOpen(false);
    setResult(null);
  }

  function updateField(name: keyof CertificationFormValue, value: string) {
    setFormValue((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function updateTemplateField(name: keyof CertificateTemplateFormValue, value: string) {
    setTemplateValue((current) => ({ ...current, [name]: value }));
    setTemplateResult(null);
  }

  function updateTemplateLayoutField(
    key: CertificateTemplateLayoutFieldKey,
    name: keyof CertificateTemplateLayout[CertificateTemplateLayoutFieldKey],
    value: string
  ) {
    setTemplateValue((current) => ({
      ...current,
      layout: {
        ...current.layout,
        [key]: {
          ...current.layout[key],
          [name]: name === "color" ? value : Number(value)
        }
      }
    }));
    setTemplateResult(null);
  }

  function resetTemplateLayout() {
    setTemplateValue((current) => ({ ...current, layout: defaultCertificateTemplateLayout }));
    setTemplateResult(null);
  }

  function restoreDefaultTemplate() {
    setTemplateValue({
      ...emptyTemplate,
      backgroundImageUrl: ""
    });
    setTemplateResult(null);
    setTemplateImageMessage("");
  }

  async function copyText(value: string, key: string) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(""), 1400);
    } catch {
      setCopiedKey("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const nextResult = await saveAdminCertification(formValue);
      setResult(nextResult);

      if (nextResult.ok) {
        setIsModalOpen(false);
        setFormValue(emptyForm);
        router.refresh();
      }
    });
  }

  function handleTemplateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isTemplateSaving) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("certificateTemplateImage");
    setTemplateResult(null);
    setTemplateImageMessage("");
    setIsTemplateSaving(true);

    startTemplateTransition(async () => {
      try {
        let backgroundImageUrl = templateValue.backgroundImageUrl;

        if (imageFile instanceof File && imageFile.size > 0) {
          const uploadData = new FormData();
          uploadData.append("file", imageFile);
          const uploadResult = await uploadAdminCertificateTemplateImage(uploadData);

          if (!uploadResult.ok || !uploadResult.url) {
            setTemplateResult(uploadResult);
            return;
          }

          backgroundImageUrl = uploadResult.url;
          setTemplateImageMessage(uploadResult.message);
        }

        const nextResult = await saveAdminCertificateTemplate({
          ...templateValue,
          backgroundImageUrl
        });
        setTemplateResult(nextResult);

        if (nextResult.ok) {
          setTemplateValue((current) => ({ ...current, backgroundImageUrl }));
          router.refresh();
        }
      } finally {
        setIsTemplateSaving(false);
      }
    });
  }

  return (
    <section className="admin-certifications-manager">
      <form
        aria-busy={isTemplateSaving}
        className="admin-certificate-template-panel"
        noValidate
        onSubmit={handleTemplateSubmit}
      >
        {isTemplateSaving ? (
          <div className="admin-certificate-template-saving-layer" role="status" aria-live="polite">
            <span className="admin-certificate-template-saving-spinner" aria-hidden="true" />
            <strong>저장 중입니다</strong>
            <span>자격증 템플릿을 적용하고 있습니다.</span>
          </div>
        ) : null}
        <div className="admin-certificate-template-heading">
          <div>
            <span>자격증 디자인</span>
            <h3>다운로드용 자격증 템플릿</h3>
            <p>개인별 텍스트는 입력하지 않은 배경 이미지를 업로드하고, 아래 좌표로 DB의 자격 정보를 합성합니다.</p>
          </div>
          <button className="admin-certifications-new-button" disabled={isTemplateSaving || isTemplatePending} type="submit">
            <Save size={15} />
            {isTemplateSaving ? "저장 중" : "적용 저장"}
          </button>
        </div>

        <div className="admin-certificate-template-grid">
          <div className="admin-certificate-template-preview">
            <span className="admin-certificate-template-preview-kicker">실시간 미리보기</span>
            <div className="admin-certificate-template-preview-frame">
              <CertificateInlinePreview
                certificate={certificateTemplatePreviewSample}
                certificateTemplate={templateValue}
                holderName="홍길동"
                useTemplateLayout
              />
            </div>
            <CertificateImageViewer
              certificate={certificateTemplatePreviewSample}
              certificateTemplate={templateValue}
              holderName="홍길동"
              useTemplateLayout
            />
            <span>{templateValue.backgroundImageUrl ? "업로드 디자인 적용 중" : "기본 디자인 미리보기"}</span>
          </div>

          <div className="admin-certificate-template-workspace">
            <div className="admin-certificate-template-controls">
              <label>
                디자인명
                <input
                  onChange={(event) => updateTemplateField("name", event.target.value)}
                  value={templateValue.name}
                />
              </label>
              <label>
                배경 이미지 URL
                <input
                  onChange={(event) => updateTemplateField("backgroundImageUrl", event.target.value)}
                  placeholder="업로드 후 자동 입력됩니다"
                  value={templateValue.backgroundImageUrl}
                />
              </label>
              <label className="admin-certificate-template-upload">
                <Upload size={15} />
                <span>배경 이미지 업로드</span>
                <input accept="image/jpeg,image/png,image/webp,image/gif" name="certificateTemplateImage" type="file" />
              </label>
              <button className="secondary-button" onClick={resetTemplateLayout} type="button">
                <RotateCcw size={15} />
                기본 위치로 초기화
              </button>
              <button className="secondary-button" onClick={restoreDefaultTemplate} type="button">
                <RotateCcw size={15} />
                기본 디자인으로 복원
              </button>
              {templateImageMessage ? <p className="form-success"><FileImage size={16} />{templateImageMessage}</p> : null}
              {templateResult ? (
                <p className={templateResult.ok ? "form-success" : "form-error"} role="status">
                  {templateResult.ok ? <CheckCircle2 size={16} /> : null}
                  {templateResult.message}
                </p>
              ) : null}
            </div>

            <div className="admin-certificate-template-field-tabs" aria-label="조정할 자격증 텍스트 선택">
              {templateLayoutFieldKeys.map((key) => (
                <button
                  aria-pressed={selectedTemplateField === key}
                  className={selectedTemplateField === key ? "is-active" : undefined}
                  key={key}
                  onClick={() => setSelectedTemplateField(key)}
                  type="button"
                >
                  {templateLayoutFieldLabels[key]}
                </button>
              ))}
            </div>

            <div className="admin-certificate-template-layout">
              {templateLayoutFieldKeys.filter((key) => key === selectedTemplateField).map((key) => {
                const field = templateValue.layout[key];

                return (
                  <fieldset key={key}>
                    <legend>{templateLayoutFieldLabels[key]}</legend>
                    <label className="admin-certificate-template-field-range">
                      <span>X</span>
                      <input min={0} max={900} onChange={(event) => updateTemplateLayoutField(key, "x", event.target.value)} type="range" value={field.x} />
                      <input min={0} max={900} onChange={(event) => updateTemplateLayoutField(key, "x", event.target.value)} type="number" value={field.x} />
                    </label>
                    <label className="admin-certificate-template-field-range">
                      <span>Y</span>
                      <input min={0} max={1272} onChange={(event) => updateTemplateLayoutField(key, "y", event.target.value)} type="range" value={field.y} />
                      <input min={0} max={1272} onChange={(event) => updateTemplateLayoutField(key, "y", event.target.value)} type="number" value={field.y} />
                    </label>
                    <label className="admin-certificate-template-field-range">
                      <span>크기</span>
                      <input min={8} max={96} onChange={(event) => updateTemplateLayoutField(key, "fontSize", event.target.value)} type="range" value={field.fontSize} />
                      <input min={8} max={96} onChange={(event) => updateTemplateLayoutField(key, "fontSize", event.target.value)} type="number" value={field.fontSize} />
                    </label>
                    <label>
                      색상
                      <input onChange={(event) => updateTemplateLayoutField(key, "color", event.target.value)} type="color" value={field.color} />
                    </label>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </form>

      <div className="admin-certifications-toolbar">
        <div className="admin-certifications-summary" aria-label="자격 상태 요약">
          {statusSummary.map((item) => (
            <span className={item.className} key={item.label}>
              <strong>{item.value}</strong>
              {item.label}
            </span>
          ))}
        </div>
        <button className="admin-certifications-new-button" onClick={openCreateModal} type="button">
          <Plus size={15} />
          새 자격 등록
        </button>
      </div>

      <div className="admin-certifications-filter-bar">
        <label className="console-search-input">
          <Search size={16} />
          <span className="sr-only">자격명, 자격번호, 사용자 검색</span>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="자격명, 자격번호, 사용자 검색"
            value={search}
          />
        </label>
        <div className="admin-certifications-status-filter" aria-label="자격 상태 필터">
          <button className={!statusFilter ? "is-active" : undefined} onClick={() => setStatusFilter("")} type="button">
            전체
          </button>
          {adminCertificationStatuses.map((status) => (
            <button
              className={statusFilter === status ? "is-active" : undefined}
              key={status}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {getAdminCertificationStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="console-table-wrap">
        <table className="console-table admin-certifications-table">
          <colgroup>
            <col className="admin-certifications-col-course" />
            <col className="admin-certifications-col-number" />
            <col className="admin-certifications-col-user" />
            <col className="admin-certifications-col-period" />
            <col className="admin-certifications-col-status" />
            <col className="admin-certifications-col-action" />
          </colgroup>
          <thead>
            <tr>
              <th>자격명</th>
              <th>자격번호</th>
              <th>회원</th>
              <th>기간</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertifications.length ? (
              filteredCertifications.map((certification) => (
                <tr key={certification.number}>
                  <td>
                    <span className="admin-certification-title-cell">
                      <ShieldCheck size={16} />
                      <strong>{certification.course}</strong>
                    </span>
                  </td>
                  <td>
                    <span className="admin-certification-number-cell">
                      <span>
                        <code className="admin-certification-number" title={certification.number}>{certification.number}</code>
                        <small title={certification.verificationCode}>검증코드 {certification.verificationCode}</small>
                      </span>
                      <span className="admin-certification-copy-actions">
                        <button
                          aria-label={`${certification.number} 자격번호 복사`}
                          className="admin-certification-copy-button"
                          onClick={() => copyText(certification.number, `number-${certification.number}`)}
                          type="button"
                        >
                          {copiedKey === `number-${certification.number}` ? <ClipboardCheck size={13} /> : <Clipboard size={13} />}
                          번호
                        </button>
                        <button
                          aria-label={`${certification.verificationCode} 검증 코드 복사`}
                          className="admin-certification-copy-button"
                          onClick={() => copyText(certification.verificationCode, `code-${certification.number}`)}
                          type="button"
                        >
                          {copiedKey === `code-${certification.number}` ? <ClipboardCheck size={13} /> : <Clipboard size={13} />}
                          코드
                        </button>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="admin-certification-user-cell">
                      <strong>{certification.user}</strong>
                      <small title={certification.userEmail || "이메일 미등록"}>{certification.userEmail || "이메일 미등록"}</small>
                    </span>
                  </td>
                  <td>
                    <span className="admin-certification-date-cell">
                      <span>{certification.issuedAt}</span>
                      <small className={certification.expiresAt ? undefined : "admin-certification-muted-date"}>
                        {certification.expiresAt ? <Clock3 size={13} /> : null}
                        만료 {certification.expiresAtDisplay}
                      </small>
                    </span>
                  </td>
                  <td>
                    <AdminStatusBadge tone={getTone(certification.status)}>
                      {getAdminCertificationStatusLabel(certification.status)}
                    </AdminStatusBadge>
                  </td>
                  <td className="admin-certifications-action-cell">
                    <span className="admin-certification-row-actions">
                      <CertificateImageViewer
                        certificate={{
                          issuedAt: certification.issuedAt,
                          number: certification.number,
                          status: certification.status,
                          title: certification.course,
                          verificationCode: certification.verificationCode
                        }}
                        certificateTemplate={certificateTemplate ?? undefined}
                        holderName={certification.user}
                      />
                      <button className="admin-users-edit-button" onClick={() => openEditModal(certification)} type="button">
                        <Pencil size={14} />
                        수정
                      </button>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="console-empty-state" role="status">
                    <ShieldCheck size={18} />
                    <span>등록된 자격 데이터가 없습니다.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div
          className="admin-users-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <form className="admin-users-modal" onSubmit={handleSubmit} noValidate role="dialog" aria-modal="true" aria-labelledby="admin-certification-modal-title">
            <div className="admin-users-modal-heading">
              <ShieldCheck size={22} />
              <div>
                <h3 id="admin-certification-modal-title">{mode === "create" ? "새 자격 등록" : "자격 수정"}</h3>
                <p>
                  {mode === "create"
                    ? "회원 이메일과 자격 정보를 입력해 발급 내역을 저장합니다."
                    : "기존 자격의 상태, 발급일, 검증 코드를 수정합니다."}
                </p>
              </div>
              <span className={`admin-users-mode-badge is-${formValue.status}`}>
                {getAdminCertificationStatusLabel(formValue.status)}
              </span>
              <button className="admin-users-modal-close" onClick={closeModal} type="button" aria-label="닫기">
                <X size={17} />
              </button>
            </div>

            <div className="admin-users-form-section">
              <div className="admin-users-form-section-title">
                <ShieldCheck size={16} />
                <strong>자격 정보</strong>
              </div>
              <div className="admin-editor-grid">
                <label>
                  회원 이메일
                  <input
                    name="userEmail"
                    onChange={(event) => updateField("userEmail", event.target.value)}
                    placeholder="member@example.com"
                    type="email"
                    value={formValue.userEmail}
                  />
                </label>
                <label>
                  자격명
                  <select
                    name="courseTitle"
                    onChange={(event) => updateField("courseTitle", event.target.value)}
                    value={formValue.courseTitle}
                  >
                    <option value="">자격명을 선택하세요</option>
                    {selectableCourseOptions.map((course) => (
                      <option key={course.title} value={course.title}>
                        {course.title} · {course.category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  자격번호
                  <input
                    name="certificateNumber"
                    onChange={(event) => updateField("certificateNumber", event.target.value)}
                    placeholder="SMC-2026-001"
                    value={formValue.certificateNumber}
                  />
                </label>
                <label>
                  발급일
                  <input
                    name="issuedAt"
                    onChange={(event) => updateField("issuedAt", event.target.value)}
                    type="date"
                    value={formValue.issuedAt}
                  />
                </label>
                <label>
                  만료일
                  <input
                    name="expiresAt"
                    onChange={(event) => updateField("expiresAt", event.target.value)}
                    type="date"
                    value={formValue.expiresAt}
                  />
                </label>
                <label>
                  상태
                  <select name="status" onChange={(event) => updateField("status", event.target.value)} value={formValue.status}>
                    {adminCertificationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {getAdminCertificationStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  검증 코드
                  <input
                    name="verificationCode"
                    onChange={(event) => updateField("verificationCode", event.target.value)}
                    placeholder="비워두면 자격번호 사용"
                    value={formValue.verificationCode}
                  />
                </label>
                <label className="full">
                  관리자 메모
                  <textarea
                    name="adminNote"
                    onChange={(event) => updateField("adminNote", event.target.value)}
                    placeholder="내부 확인 사항, 발급 근거, 운영 메모"
                    rows={3}
                    value={formValue.adminNote}
                  />
                </label>
              </div>
            </div>

            {result ? (
              <div className={result.ok ? "form-success" : "form-error full"} role="status">
                {result.ok ? <CheckCircle2 size={20} /> : null}
                <span>{result.message}</span>
              </div>
            ) : null}

            <div className="admin-editor-actions">
              <button className="primary-button" disabled={isPending} type="submit">
                <Save size={16} />
                <span>{isPending ? "저장 중" : mode === "create" ? "자격 등록" : "자격 수정 저장"}</span>
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
