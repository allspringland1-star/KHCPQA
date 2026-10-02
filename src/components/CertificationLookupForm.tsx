"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { BadgeCheck, Search, XCircle } from "lucide-react";
import type { AccountCertificate } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";

export function CertificationLookupForm({
  certificates,
  locale
}: {
  certificates: AccountCertificate[];
  locale: Locale;
}) {
  const t = getCopy(locale);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const match = certificates.find(
    (certificate) =>
      certificate.number.toLowerCase() === certificateNumber.trim().toLowerCase() &&
      certificate.verificationCode.toLowerCase() === verificationCode.trim().toLowerCase()
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSearched(true);
  }

  return (
    <section className="certificate-lookup">
      <div className="section-heading">
        <span className="eyebrow">{locale === "zh-CN" ? "证书验证" : "Verification"}</span>
        <h2>{t.account.certifications.lookupTitle}</h2>
        <p>{t.account.certifications.lookupLead}</p>
      </div>
      <form className="certificate-lookup-form" onSubmit={handleSubmit}>
        <label>
          {t.account.certifications.numberLabel}
          <input
            onChange={(event) => {
              setCertificateNumber(event.target.value);
              setHasSearched(false);
            }}
            placeholder={t.account.certifications.numberPlaceholder}
            value={certificateNumber}
          />
        </label>
        <label>
          {t.account.certifications.verificationCodeLabel}
          <input
            onChange={(event) => {
              setVerificationCode(event.target.value);
              setHasSearched(false);
            }}
            placeholder={t.account.certifications.verificationCodePlaceholder}
            value={verificationCode}
          />
        </label>
        <button className="primary-button" type="submit">
          <Search size={16} />
          <span>{t.account.certifications.lookupCta}</span>
        </button>
      </form>
      <p className="certificate-demo-hint">
        {certificates.length > 0 ? t.account.certifications.demoHint : t.account.certifications.emptyGuide}
      </p>
      {hasSearched && match ? (
        <div className="certificate-result is-found" role="status">
          <BadgeCheck size={22} />
          <div>
            <strong>{t.account.certifications.lookupSuccessTitle}</strong>
            <dl>
              <div>
                <dt>{t.account.certifications.courseLabel}</dt>
                <dd>{match.title}</dd>
              </div>
              <div>
                <dt>{t.account.certifications.numberLabel}</dt>
                <dd>{match.number}</dd>
              </div>
              <div>
                <dt>{t.account.certifications.issuedLabel}</dt>
                <dd>{match.issuedAt}</dd>
              </div>
              <div>
                <dt>{t.account.certifications.statusLabel}</dt>
                <dd>{match.status}</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}
      {hasSearched && !match ? (
        <div className="certificate-result is-empty" role="status">
          <XCircle size={22} />
          <div>
            <strong>{t.account.certifications.lookupEmptyTitle}</strong>
            <p>{t.account.certifications.lookupEmptyMessage}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
