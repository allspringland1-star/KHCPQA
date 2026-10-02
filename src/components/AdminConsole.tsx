import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Globe2,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  PanelBottom,
  Search,
  ShieldCheck,
  UserRoundCog,
  Users,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOutFromAdmin } from "@/app/admin/actions";
import { BrandLogoMark } from "@/components/BrandLogoMark";

export type AdminNavKey =
  | "dashboard"
  | "pages"
  | "courses"
  | "community"
  | "directors"
  | "inquiries"
  | "users"
  | "certifications"
  | "popups"
  | "footer"
  | "translations";

type StatusTone = "success" | "warning" | "info" | "danger" | "neutral" | "purple";

type AdminNavItem = {
  href: string;
  icon: LucideIcon;
  key: AdminNavKey;
  label: string;
};

export type AdminColumn = {
  align?: "left" | "center" | "right";
  key: string;
  label: string;
};

export type AdminRow = Record<string, ReactNode>;

const adminNavItems: AdminNavItem[] = [
  { href: "/admin", icon: LayoutDashboard, key: "dashboard", label: "대시보드" },
  { href: "/admin/courses", icon: BookOpen, key: "courses", label: "과정 관리" },
  { href: "/admin/directors", icon: UserRoundCog, key: "directors", label: "국제 디렉터" },
  { href: "/admin/community", icon: MessageSquare, key: "community", label: "커뮤니티 관리" },
  { href: "/admin/translations", icon: Globe2, key: "translations", label: "번역 관리" },
  { href: "/admin/inquiries", icon: Inbox, key: "inquiries", label: "문의 관리" },
  { href: "/admin/users", icon: Users, key: "users", label: "사용자 관리" },
  { href: "/admin/certifications", icon: ShieldCheck, key: "certifications", label: "자격 데이터" },
  { href: "/admin/popups", icon: ImageIcon, key: "popups", label: "팝업/배너 관리" },
  { href: "/admin/footer", icon: PanelBottom, key: "footer", label: "푸터 관리" }
];

export function AdminConsoleShell({
  actions,
  active,
  children,
  description,
  title
}: {
  actions?: ReactNode;
  active: AdminNavKey;
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main className="console-shell">
      <aside className="console-sidebar">
        <Link href="/admin" className="console-logo" aria-label="KHCPQA 관리자 홈">
          <BrandLogoMark className="console-logo-symbol" priority />
          <strong>KHCPQA</strong>
        </Link>
        <nav className="console-nav" aria-label="관리자 메뉴">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                aria-current={active === item.key ? "page" : undefined}
                className={active === item.key ? "is-active" : undefined}
                href={item.href}
                key={item.key}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="console-admin-card">
          <span className="console-avatar" aria-hidden="true">S</span>
          <span>
            <strong>super_admin</strong>
            <small>슈퍼 관리자</small>
          </span>
          <form action={signOutFromAdmin}>
            <button className="console-logout-button" type="submit" aria-label="관리자 로그아웃">
              <LogOut size={15} />
              <span>로그아웃</span>
            </button>
          </form>
        </div>
      </aside>
      <section className="console-main">
        <header className="console-topbar">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="console-top-actions">
            {actions}
            <label className="console-global-search">
              <Search size={16} />
              <span className="sr-only">관리자 전체 검색</span>
              <input placeholder="과정, 문의, 사용자 검색" />
            </label>
            <button className="console-icon-button" type="button" aria-label="알림">
              <Bell size={17} />
            </button>
            <button className="console-profile-button" type="button">
              <span className="console-avatar" aria-hidden="true">S</span>
              <span>super_admin</span>
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function AdminPrimaryButton({
  children,
  icon: Icon
}: {
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <button className="console-primary-button" type="button">
      {Icon ? <Icon size={16} /> : null}
      <span>{children}</span>
    </button>
  );
}

export function AdminFilterBar({ children }: { children: ReactNode }) {
  return <div className="console-filter-bar">{children}</div>;
}

export function AdminSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <label className="console-search-input">
      <Search size={16} />
      <span className="sr-only">{placeholder}</span>
      <input placeholder={placeholder} />
    </label>
  );
}

export function AdminSelect({ label }: { label: string }) {
  return (
    <label className="console-select">
      <span className="sr-only">{label}</span>
      <select defaultValue="">
        <option value="">{label}</option>
      </select>
    </label>
  );
}

export function AdminDateRange({ end, start }: { end: string; start: string }) {
  return (
    <div className="console-date-range">
      <CalendarDays size={15} />
      <span>{start}</span>
      <em>-</em>
      <span>{end}</span>
    </div>
  );
}

export function AdminTabs({ active, tabs }: { active: string; tabs: string[] }) {
  return (
    <div className="console-tabs">
      {tabs.map((tab) => (
        <button className={tab === active ? "is-active" : undefined} key={tab} type="button">
          {tab}
        </button>
      ))}
    </div>
  );
}

export function AdminTable({
  columns,
  emptyLabel = "표시할 데이터가 없습니다.",
  rows
}: {
  columns: AdminColumn[];
  emptyLabel?: string;
  rows: AdminRow[];
}) {
  return (
    <div className="console-table-wrap">
      <table className="console-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th className={column.align ? `is-${column.align}` : undefined} key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={String(row.id ?? rowIndex)}>
                {columns.map((column) => (
                  <td className={column.align ? `is-${column.align}` : undefined} key={column.key}>
                    {row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="console-empty-state">
                  <Inbox size={18} />
                  <span>{emptyLabel}</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function AdminPanel({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`console-panel ${className}`.trim()}>{children}</section>;
}

export function AdminStatCard({
  description,
  href,
  icon: Icon,
  label,
  value
}: {
  description: string;
  href?: string;
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  const content = (
    <>
      <span>
        <Icon size={22} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{description}</em>
      </div>
    </>
  );

  if (href) {
    return (
      <Link className="console-stat-card" href={href}>
        {content}
      </Link>
    );
  }

  return (
    <article className="console-stat-card">
      {content}
    </article>
  );
}

export function AdminStatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: StatusTone }) {
  return <span className={`console-status is-${tone}`}>{children}</span>;
}

export function AdminThumbnail({ alt, src }: { alt: string; src?: string }) {
  return (
    <span className="console-thumb">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} src={src} />
      ) : <ImageIcon size={20} />}
    </span>
  );
}

export function AdminRowAction() {
  return (
    <button className="console-row-action" type="button" aria-label="관리 메뉴">
      <Edit3 size={14} />
    </button>
  );
}

export function AdminMoreAction() {
  return (
    <button className="console-row-action" type="button" aria-label="더보기">
      <MoreHorizontal size={15} />
    </button>
  );
}

export function AdminPagination({ pages = ["1"] }: { pages?: string[] }) {
  return (
    <div className="console-pagination">
      <button type="button" aria-label="이전 페이지">
        <ChevronLeft size={14} />
      </button>
      {pages.map((page, index) => (
        <button className={index === 0 ? "is-active" : undefined} key={`${page}-${index}`} type="button">
          {page}
        </button>
      ))}
      <button type="button" aria-label="다음 페이지">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function translationProgress(percent: number) {
  return (
    <span className="console-progress">
      <span style={{ width: `${percent}%` }} />
    </span>
  );
}

export function getTone(status: string): StatusTone {
  const normalized = status.toLowerCase();

  if (["published", "answered", "active", "issued", "공개", "노출중", "답변완료", "발급됨", "완료", "활성"].includes(normalized)) {
    return "success";
  }

  if (["draft", "in_review", "pending", "검수중", "임시저장", "답변대기"].includes(normalized)) {
    return "warning";
  }

  if (["reviewed", "translated", "progress", "진행"].includes(normalized)) {
    return "info";
  }

  if (["archived", "expired", "revoked", "suspended", "비노출", "종료", "비활성"].includes(normalized)) {
    return "danger";
  }

  if (["번역중"].includes(normalized)) {
    return "purple";
  }

  return "neutral";
}

export function formatAdminDate(value: string) {
  return value.replace(/\s+/g, "");
}
