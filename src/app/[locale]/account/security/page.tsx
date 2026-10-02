import { AccountNav, AccountSection } from "@/components/AccountShell";
import { PageIntro } from "@/components/SiteShell";
import { PasswordUpdateForm } from "@/components/PasswordUpdateForm";
import type { Locale } from "@/lib/content";
import { buildLocaleMetadata } from "@/lib/seo";

const securityCopy = {
  "zh-CN": { eyebrow: "账户安全", title: "重置密码", lead: "完成邮箱验证后，可在此设置新密码。" },
  ko: {
    eyebrow: "계정 보안",
    title: "비밀번호 재설정",
    lead: "이메일 확인을 마친 회원은 이 화면에서 새 비밀번호를 저장할 수 있습니다."
  },
  en: {
    eyebrow: "Account Security",
    title: "Password Reset",
    lead: "Members who completed email verification can save a new password here."
  },
  es: {
    eyebrow: "Seguridad de Cuenta",
    title: "Restablecer Contraseña",
    lead: "Los miembros que completaron la verificación por email pueden guardar una nueva contraseña aquí."
  }
} as const;

function getSecurityCopy(locale: string) {
  return securityCopy[locale as keyof typeof securityCopy] ?? securityCopy.en;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getSecurityCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "account/security",
    title: `${copy.title} | KAHC`,
    description: copy.lead,
    noIndex: true
  });
}

export default async function AccountSecurityPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getSecurityCopy(locale);

  return (
    <>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
      <section className="content-section">
        <AccountNav locale={locale} activeHref="account/security" />
        <AccountSection title={copy.title} lead={copy.lead}>
          <PasswordUpdateForm locale={locale} />
        </AccountSection>
      </section>
    </>
  );
}
