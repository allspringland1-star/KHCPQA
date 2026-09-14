import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AccountNav } from "@/components/AccountShell";
import { CertificateDownloadActions } from "@/components/CertificateDownloadActions";
import { PageIntro } from "@/components/SiteShell";
import { getAccountData } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "account",
    title: `${t.accountTitle} | KAHC`,
    description: t.account.lead,
    noIndex: true
  });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const accountData = await getAccountData(locale);
  const navBadges = {
    account: accountData.profileForm.name || accountData.profileForm.email ? t.account.profileStatus.ready : t.account.profileStatus.empty,
    "account/certifications": `${accountData.certificates.length}${t.account.countSuffix}`,
    "account/inquiries": `${accountData.inquiries.length}${t.account.countSuffix}`
  };

  return (
    <>
      <PageIntro
        className="account-page-intro"
        eyebrow={t.account.eyebrow}
        title={t.accountTitle}
        lead={t.account.lead}
      />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account" badges={navBadges} />
        <div className="cert-table">
          {accountData.certificates.length > 0 ? (
            accountData.certificates.map((certificate) => (
              <div key={certificate.number}>
                <strong>{certificate.title}</strong>
                <span>{certificate.number} · {certificate.issuedAt}</span>
                <em>{certificate.status}</em>
                <CertificateDownloadActions
                  certificate={certificate}
                  certificateTemplate={accountData.certificateTemplate}
                  holderName={accountData.profileForm.name}
                  variant="compact"
                />
              </div>
            ))
          ) : (
            <div className="cert-empty-state account-empty-state" role="status">
              <div>
                <strong>{t.account.certifications.emptyState}</strong>
                <span>{t.account.certifications.emptyGuide}</span>
              </div>
              <div className="account-empty-actions">
                <Link href={`/${locale}/account/certifications`}>
                  <span>{t.account.certifications.lookupTitle}</span>
                  <ArrowRight size={15} />
                </Link>
                <Link href={`/${locale}/curriculum`}>
                  <span>{t.curriculumTitle}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
