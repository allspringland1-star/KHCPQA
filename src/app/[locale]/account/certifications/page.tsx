import { AccountNav, AccountSection } from "@/components/AccountShell";
import { CertificateDownloadActions } from "@/components/CertificateDownloadActions";
import { CertificationLookupForm } from "@/components/CertificationLookupForm";
import { PageIntro } from "@/components/SiteShell";
import { getAccountData } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "account/certifications",
    title: `${t.account.certifications.title} | KAHC`,
    description: t.account.certifications.lead,
    noIndex: true
  });
}

export default async function AccountCertificationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const accountData = await getAccountData(locale);

  return (
    <>
      <PageIntro
        className="account-page-intro"
        eyebrow={t.account.eyebrow}
        title={t.account.certifications.title}
        lead={t.account.certifications.lead}
      />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account/certifications" />
        <CertificationLookupForm certificates={accountData.certificates} locale={locale} />
        <AccountSection title={t.account.certifications.title} lead={t.account.certifications.lead}>
          {accountData.certificates.length > 0 ? (
            <div className="cert-records">
              {accountData.certificates.map((certificate) => (
                <article key={certificate.number}>
                  <dl>
                    <div>
                      <dt>{t.account.certifications.courseLabel}</dt>
                      <dd>{certificate.title}</dd>
                    </div>
                    <div>
                      <dt>{t.account.certifications.numberLabel}</dt>
                      <dd>{certificate.number}</dd>
                    </div>
                    <div>
                      <dt>{t.account.certifications.issuedLabel}</dt>
                      <dd>{certificate.issuedAt}</dd>
                    </div>
                    <div>
                      <dt>{t.account.certifications.statusLabel}</dt>
                      <dd><span>{certificate.status}</span></dd>
                    </div>
                  </dl>
                  <CertificateDownloadActions
                    certificate={certificate}
                    certificateTemplate={accountData.certificateTemplate}
                    holderName={accountData.profileForm.name}
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="certificate-empty-state" role="status">
              <strong>{t.account.certifications.emptyState}</strong>
              <span>{t.account.certifications.emptyGuide}</span>
            </div>
          )}
        </AccountSection>
      </section>
    </>
  );
}
