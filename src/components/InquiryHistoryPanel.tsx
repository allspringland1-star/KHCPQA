"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import type { AccountInquiry } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";

function getShortReceipt(receipt: string) {
  const parts = receipt.split("-");

  return parts.length > 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : receipt;
}

function getInquiryTypeLabel(type: string, locale: Locale) {
  const labels: Record<string, Record<Locale, string>> = {
    certification: { "zh-CN": "资格咨询", en: "Certification inquiry", es: "Consulta de certificacion", ko: "자격 문의" },
    course: { "zh-CN": "课程咨询", en: "Course inquiry", es: "Consulta de curso", ko: "교육과정 문의" },
    general: { "zh-CN": "一般咨询", en: "General inquiry", es: "Consulta general", ko: "일반 문의" },
    partnership: { "zh-CN": "合作咨询", en: "Partnership inquiry", es: "Consulta de alianza", ko: "파트너십 문의" }
  };

  return labels[type]?.[locale] ?? type;
}

function getInquiryStatusLabel(status: string, locale: Locale) {
  const labels: Record<string, Record<Locale, string>> = {
    answered: { "zh-CN": "已回复", en: "Answered", es: "Respondida", ko: "답변 완료" },
    closed: { "zh-CN": "已结束", en: "Closed", es: "Cerrada", ko: "종료" },
    in_review: { "zh-CN": "审核中", en: "In review", es: "En revision", ko: "검토 중" },
    new: { "zh-CN": "新咨询", en: "New", es: "Nueva", ko: "신규" }
  };

  return labels[status]?.[locale] ?? status;
}

function getManagerNoteLabel(locale: Locale) {
  const labels: Record<Locale, string> = {
    "zh-CN": "回复内容",
    en: "Reply",
    es: "Respuesta",
    ko: "답변 내용"
  };

  return labels[locale];
}

export function InquiryHistoryPanel({ items, locale }: { items: AccountInquiry[]; locale: Locale }) {
  const t = getCopy(locale);
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>([[t.account.inquiries.allLabel, items.length]]);

    items.forEach((item) => {
      counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
    });

    return counts;
  }, [items, t.account.inquiries.allLabel]);
  const statuses = useMemo(() => Array.from(statusCounts.keys()), [statusCounts]);
  const [activeStatus, setActiveStatus] = useState(statuses[0]);
  const visibleItems =
    activeStatus === t.account.inquiries.allLabel
      ? items
      : items.filter((item) => item.status === activeStatus);

  return (
    <section className="inquiry-history-panel">
      <div className="inquiry-panel-toolbar">
        <div>
          <strong>
            {activeStatus === t.account.inquiries.allLabel
              ? activeStatus
              : getInquiryStatusLabel(activeStatus, locale)}
          </strong>
          <span>
            {visibleItems.length}
            {t.account.countSuffix}
          </span>
        </div>
        <div className="inquiry-filter-tabs" role="tablist" aria-label={t.account.inquiries.statusLabel}>
          {statuses.map((status) => (
            <button
              aria-selected={activeStatus === status}
              className={activeStatus === status ? "is-active" : undefined}
              key={status}
              onClick={() => setActiveStatus(status)}
              role="tab"
              type="button"
            >
              <span>
                {status === t.account.inquiries.allLabel ? status : getInquiryStatusLabel(status, locale)}
              </span>
              <b>{statusCounts.get(status) ?? 0}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="inquiry-list">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <article key={item.receipt}>
              <header>
                <ClipboardList size={20} />
                <div>
                  <strong>{getInquiryTypeLabel(item.type, locale)}</strong>
                  <span title={item.receipt}>{getShortReceipt(item.receipt)}</span>
                </div>
                <em>{getInquiryStatusLabel(item.status, locale)}</em>
              </header>
              <dl>
                <div>
                  <dt>{t.account.inquiries.receiptLabel}</dt>
                  <dd className="receipt-code">{item.receipt}</dd>
                </div>
                <div>
                  <dt>{t.account.inquiries.submittedLabel}</dt>
                  <dd>{item.submittedAt}</dd>
                </div>
              </dl>
              <p>
                <span>{t.account.inquiries.messageLabel}</span>
                {item.message}
              </p>
              {item.managerNote ? (
                <p className="inquiry-answer">
                  <span>{getManagerNoteLabel(locale)}</span>
                  {item.managerNote}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <div className="inquiry-empty-state" role="status">
            {t.account.inquiries.emptyState}
          </div>
        )}
      </div>
    </section>
  );
}
