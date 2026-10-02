import type { Metadata } from "next";
import {
  buildLanguageAlternates,
  localeOpenGraph,
  locales,
  type Locale
} from "@/i18n/config";
import { getCopy } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://khcpqa.vercel.app";

function getLocalizedPath(locale: Locale, path = "") {
  return path.length > 0 ? `/${locale}/${path}` : `/${locale}`;
}

export function buildLocaleMetadata({
  locale,
  path = "",
  title,
  description,
  noIndex = false,
  availableLocales
}: {
  availableLocales?: readonly Locale[];
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
}): Metadata {
  const t = getCopy(locale);
  const pageTitle = title ?? t.seo.title;
  const pageDescription = description ?? t.seo.description;
  const canonicalPath = getLocalizedPath(locale, path);
  const publishedLocales: readonly Locale[] =
    availableLocales ?? locales;

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(path, publishedLocales)
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      locale: localeOpenGraph[locale],
      siteName: "KAHC",
      type: "website",
      url: `${siteUrl}${canonicalPath}`
    },
    robots: noIndex ? { index: false, follow: false } : undefined
  };
}
