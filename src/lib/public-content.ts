import type { Locale } from "@/lib/content";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type PublishedContentRow = {
  author_name?: string | null;
  body: string | null;
  image_url?: string | null;
  slug?: string;
  source_url?: string | null;
  summary: string | null;
  title: string;
  updated_at?: string;
  view_count?: number | null;
};

export type PublishedContentIntro = {
  body?: string;
  imageUrl?: string;
  lead: string;
  title: string;
};

export type PublishedActivityPost = {
  author: string;
  body: string;
  date: string;
  imageUrl?: string;
  slug: string;
  sourceUrl?: string;
  status?: string;
  title: string;
  viewCount: number;
};

export type PaginatedActivityPosts = {
  items: PublishedActivityPost[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PublishedContentSection = {
  body: string;
  imageUrl?: string;
  lead: string;
  slug: string;
  title: string;
};

export type PublishedBanner = {
  endsAt?: string;
  id?: string;
  imageUrl?: string;
  placement: "home" | "curriculum" | "activities" | "global";
  startsAt?: string;
  targetUrl: string;
  title: string;
};

type PublishedBannerRow = {
  ends_at: string | null;
  id?: string;
  image_url: string | null;
  placement: PublishedBanner["placement"];
  starts_at: string | null;
  target_url: string | null;
  title: string;
};

function formatDate(value?: string) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
}

function getDefaultAuthor(locale: Locale) {
  return locale === "ko" ? "관리자" : locale === "zh-CN" ? "管理员" : "Admin";
}

function normalizePagination(page = 1, pageSize = 10) {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const safePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;

  return { page: safePage, pageSize: safePageSize };
}

function getPaginationMeta(total: number, page: number, pageSize: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}

function paginateActivityPosts(posts: PublishedActivityPost[], page: number, pageSize: number): PaginatedActivityPosts {
  const { page: safePage, pageSize: safePageSize } = normalizePagination(page, pageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    items: posts.slice(start, start + safePageSize),
    ...getPaginationMeta(posts.length, safePage, safePageSize)
  };
}

export async function getPublishedContentIntro({
  contentType,
  fallback,
  locale,
  slug
}: {
  contentType: "Page" | "Course" | "Activity" | "Review";
  fallback: PublishedContentIntro;
  locale: Locale;
  slug: string;
}): Promise<PublishedContentIntro> {
  if (!hasSupabaseBrowserEnv()) {
    return fallback;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("title, summary, body, image_url")
    .eq("content_type", contentType)
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  const row = data as PublishedContentRow;

  return {
    body: row.body || undefined,
    imageUrl: row.image_url || undefined,
    lead: row.summary || fallback.lead,
    title: row.title || fallback.title
  };
}

export async function getPublishedContentMap({
  contentType,
  locale,
  slugs
}: {
  contentType: "Page" | "Course" | "Activity" | "Review";
  locale: Locale;
  slugs: string[];
}): Promise<Map<string, PublishedContentIntro>> {
  if (!hasSupabaseBrowserEnv() || slugs.length === 0) {
    return new Map();
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("slug, title, summary, body, image_url")
    .eq("content_type", contentType)
    .eq("locale", locale)
    .eq("status", "published")
    .in("slug", slugs);

  if (error || !data) {
    return new Map();
  }

  return new Map(
    (data as PublishedContentRow[])
      .filter((row): row is PublishedContentRow & { slug: string } => Boolean(row.slug))
      .map((row) => [
        row.slug,
        {
          body: row.body || undefined,
          imageUrl: row.image_url || undefined,
          lead: row.summary || "",
          title: row.title
        }
      ])
  );
}

export async function getPublishedActivityPosts({
  activityKey,
  fallback,
  locale,
  page = 1,
  pageSize = 10
}: {
  activityKey: string;
  fallback: PublishedActivityPost[];
  locale: Locale;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedActivityPosts> {
  const { page: safePage, pageSize: safePageSize } = normalizePagination(page, pageSize);

  if (!hasSupabaseBrowserEnv()) {
    return paginateActivityPosts(fallback, safePage, safePageSize);
  }

  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  const supabase = createClient();
  const { data, error, count } = await supabase
    .from("admin_content_items")
    .select("slug, title, summary, body, source_url, image_url, author_name, view_count, updated_at", { count: "exact" })
    .eq("content_type", "Activity")
    .eq("locale", locale)
    .eq("status", "published")
    .like("slug", `${activityKey}-%`)
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    return paginateActivityPosts(fallback, safePage, safePageSize);
  }

  if (!data || data.length === 0) {
    return {
      items: [],
      ...getPaginationMeta(count ?? 0, safePage, safePageSize)
    };
  }

  const items = (data as PublishedContentRow[])
    .map((row) => ({
      author: row.author_name || getDefaultAuthor(locale),
      body: row.body || row.summary || "",
      date: formatDate(row.updated_at),
      imageUrl: row.image_url || undefined,
      slug: row.slug || "",
      sourceUrl: row.source_url || "https://www.smc365.ac/index.asp",
      status: "published",
      title: row.title,
      viewCount: row.view_count ?? 0
    }))
    .filter((post) => Boolean(post.slug));

  return {
    items,
    ...getPaginationMeta(count ?? items.length, safePage, safePageSize)
  };
}

export async function getPublishedActivityPost({
  fallback,
  locale,
  slug
}: {
  fallback?: PublishedActivityPost;
  locale: Locale;
  slug: string;
}): Promise<PublishedActivityPost | undefined> {
  if (!hasSupabaseBrowserEnv()) {
    return fallback;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("slug, title, summary, body, source_url, image_url, author_name, view_count, updated_at")
    .eq("content_type", "Activity")
    .eq("locale", locale)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return fallback;
  }

  if (!data) {
    return undefined;
  }

  const row = data as PublishedContentRow;

  return {
    author: row.author_name || getDefaultAuthor(locale),
    body: row.body || row.summary || "",
    date: formatDate(row.updated_at),
    imageUrl: row.image_url || undefined,
    slug: row.slug || slug,
    sourceUrl: row.source_url || undefined,
    status: "published",
    title: row.title,
    viewCount: row.view_count ?? 0
  };
}

export async function incrementPublishedActivityPostViewCount({
  locale,
  slug
}: {
  locale: Locale;
  slug: string;
}) {
  if (!hasSupabaseBrowserEnv()) {
    return false;
  }

  const supabase = createClient();
  const { error } = await supabase.rpc("increment_admin_content_item_view_count", {
    item_locale: locale,
    item_slug: slug
  });

  return !error;
}

export async function getPublishedContentSections({
  contentType,
  locale,
  slugPrefix
}: {
  contentType: "Page" | "Course" | "Activity" | "Review";
  locale: Locale;
  slugPrefix: string;
}): Promise<PublishedContentSection[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_content_items")
    .select("slug, title, summary, body, image_url")
    .eq("content_type", contentType)
    .eq("locale", locale)
    .eq("status", "published")
    .like("slug", `${slugPrefix}%`)
    .order("slug", { ascending: true })
    .limit(30);

  if (error || !data) {
    return [];
  }

  return (data as PublishedContentRow[])
    .filter((row): row is PublishedContentRow & { slug: string } => Boolean(row.slug))
    .map((row) => ({
      body: row.body || "",
      imageUrl: row.image_url || undefined,
      lead: row.summary || "",
      slug: row.slug,
      title: row.title
    }));
}

export async function getPublishedBanners({
  limit = 1,
  placement
}: {
  limit?: number;
  placement: PublishedBanner["placement"];
}): Promise<PublishedBanner[]> {
  if (!hasSupabaseBrowserEnv()) {
    return [];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id, title, placement, target_url, image_url, starts_at, ends_at")
    .eq("status", "published")
    .in("placement", [placement, "global"])
    .order("starts_at", { ascending: false, nullsFirst: false })
    .limit(Math.max(limit * 3, 6));

  if (error || !data) {
    return [];
  }

  const today = new Date().toISOString().slice(0, 10);

  return (data as PublishedBannerRow[])
    .filter((row) => {
      const startsAt = row.starts_at?.slice(0, 10);
      const endsAt = row.ends_at?.slice(0, 10);
      return (!startsAt || startsAt <= today) && (!endsAt || endsAt >= today);
    })
    .slice(0, limit)
    .map((row) => ({
      endsAt: row.ends_at || undefined,
      id: row.id,
      imageUrl: row.image_url || undefined,
      placement: row.placement,
      startsAt: row.starts_at || undefined,
      targetUrl: row.target_url || "",
      title: row.title
    }));
}
