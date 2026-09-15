import type { Locale } from "@/lib/content";

export type AuthProfileRoleStatus = {
  role?: string | null;
  status?: string | null;
};

export const adminRoles = [
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
] as const;

export function getDefaultLoginPath(locale: Locale) {
  return `/${locale}/account`;
}

export function getSafeLoginNextPath(locale: Locale, value: string | null) {
  const defaultPath = getDefaultLoginPath(locale);

  if (!value) {
    return defaultPath;
  }

  const isInternal = value.startsWith("/") && !value.startsWith("//") && !value.includes("://");
  const isAllowedPath = new RegExp(`^/(?:${locale}/account(?:/|$)|admin(?:/|$))`).test(value);

  return isInternal && isAllowedPath ? value : defaultPath;
}

export function isActiveAdminProfile(profile: AuthProfileRoleStatus | null | undefined) {
  const role = typeof profile?.role === "string" ? profile.role : "";
  const status = typeof profile?.status === "string" ? profile.status : "";

  return status === "active" && adminRoles.includes(role as (typeof adminRoles)[number]);
}

export function resolvePostLoginPath(
  locale: Locale,
  safeNextPath: string,
  profile: AuthProfileRoleStatus | null | undefined
) {
  if (safeNextPath.startsWith("/admin")) {
    return safeNextPath;
  }

  return isActiveAdminProfile(profile) ? "/admin" : getSafeLoginNextPath(locale, safeNextPath);
}
