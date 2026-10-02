import { locales, type Locale } from "@/i18n/config";
import { classifyLocalizedPath } from "@/lib/public-locales";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

const staticPageLocales: Locale[] = [...locales];

function normalizeLocales(values: unknown[]) {
  return locales.filter((locale) => values.includes(locale));
}

export async function getPublishedLocalesForPath(pathname: string): Promise<Locale[]> {
  const lookup = classifyLocalizedPath(pathname);

  if (!hasSupabaseBrowserEnv()) {
    return lookup.kind === "page" ? staticPageLocales : ["ko", "en", "es"];
  }

  const supabase = createPublicClient();

  if (lookup.kind === "course") {
    const { data } = await supabase
      .from("course_localizations")
      .select("locale, courses!inner(slug, is_active)")
      .eq("courses.slug", lookup.slug)
      .eq("courses.is_active", true)
      .eq("status", "published");
    return normalizeLocales((data ?? []).map((row) => row.locale));
  }

  if (lookup.kind === "activity") {
    const { data } = await supabase
      .from("admin_content_items")
      .select("locale")
      .eq("content_type", "Activity")
      .eq("slug", lookup.slug)
      .eq("status", "published");
    return normalizeLocales((data ?? []).map((row) => row.locale));
  }

  const { data } = await supabase
    .from("admin_content_items")
    .select("locale")
    .eq("content_type", "Page")
    .eq("slug", lookup.slug)
    .eq("status", "published");
  const managedLocales = normalizeLocales((data ?? []).map((row) => row.locale));
  return normalizeLocales([...staticPageLocales, ...managedLocales]);
}
