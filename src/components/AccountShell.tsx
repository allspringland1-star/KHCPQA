import Link from "next/link";
import { BadgeCheck, ClipboardList, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { signOutFromAccount } from "@/app/[locale]/account/actions";
import { getCopy, type Locale } from "@/lib/content";

const accountIcons = [LayoutDashboard, UserRound, BadgeCheck, ClipboardList];

const logoutCopy: Record<Locale, { description: string; label: string }> = {
  "zh-CN": { description: "结束登录会话", label: "退出登录" },
  en: { description: "End session", label: "Logout" },
  es: { description: "Cerrar sesion", label: "Salir" },
  ko: { description: "세션 종료", label: "로그아웃" }
};

export function AccountNav({
  locale,
  activeHref,
  badges
}: {
  locale: Locale;
  activeHref: string;
  badges?: Partial<Record<string, string>>;
}) {
  const t = getCopy(locale);
  const logout = logoutCopy[locale as keyof typeof logoutCopy] ?? logoutCopy.en;
  const signOutAction = signOutFromAccount.bind(null, locale);

  return (
    <nav className="account-nav" aria-label={t.a11y.accountNavigation}>
      {t.account.nav.map((item, index) => {
        const Icon = accountIcons[index];
        const isActive = item.href === activeHref;
        const badge = badges?.[item.href];

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "is-active" : undefined}
            href={`/${locale}/${item.href}`}
            key={item.href}
          >
            <Icon size={18} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
            {badge ? <em className="account-nav-badge">{badge}</em> : null}
          </Link>
        );
      })}
      <form action={signOutAction}>
        <button className="account-logout-button" type="submit">
          <LogOut size={18} />
          <span>
            <strong>{logout.label}</strong>
            <small>{logout.description}</small>
          </span>
        </button>
      </form>
    </nav>
  );
}

export function AccountSection({
  children,
  className,
  lead,
  title
}: {
  children: React.ReactNode;
  className?: string;
  lead: string;
  title: string;
}) {
  return (
    <section className={className ? `account-panel ${className}` : "account-panel"}>
      <div className="section-heading">
        <span className="eyebrow">Member Area</span>
        <h2>{title}</h2>
        <p>{lead}</p>
      </div>
      {children}
    </section>
  );
}
