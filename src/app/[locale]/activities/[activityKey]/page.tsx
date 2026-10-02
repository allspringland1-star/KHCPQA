import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import {
  getActivityGroupByKey,
  getActivityGroups,
  getActivityPosts,
  getCopy,
  type Locale
} from "@/lib/content";
import { getPublishedActivityPosts, getPublishedContentIntro, getPublishedContentSections, type PublishedContentSection } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

function splitSectionLines(section: PublishedContentSection) {
  return section.body
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

const activityDirectoryCopy: Record<Locale, {
  allLabel: string;
  categoriesLabel: string;
  exploreLabel: string;
  emptyPosts: string;
  dateLabel: string;
  numberLabel: string;
  nextLabel: string;
  paginationLabel: string;
  previousLabel: string;
  titleLabel: string;
  viewsLabel: string;
  writerLabel: string;
}> = {
  "zh-CN": { allLabel: "全部社区", categoriesLabel: "社区分类", exploreLabel: "社区菜单", emptyPosts: "暂无已发布的文章。", dateLabel: "日期", numberLabel: "编号", nextLabel: "下一页", paginationLabel: "文章分页", previousLabel: "上一页", titleLabel: "标题", viewsLabel: "浏览次数", writerLabel: "作者" },
  ko: {
    allLabel: "전체 커뮤니티",
    categoriesLabel: "커뮤니티 카테고리",
    dateLabel: "작성일",
    exploreLabel: "커뮤니티 메뉴",
    emptyPosts: "등록된 게시글이 없습니다.",
    numberLabel: "번호",
    nextLabel: "다음",
    paginationLabel: "게시글 페이지",
    previousLabel: "이전",
    titleLabel: "제목",
    viewsLabel: "조회수",
    writerLabel: "작성자"
  },
  en: {
    allLabel: "All Activities",
    categoriesLabel: "Activity categories",
    dateLabel: "Date",
    exploreLabel: "Activity Menu",
    emptyPosts: "No posts have been published yet.",
    numberLabel: "No.",
    nextLabel: "Next",
    paginationLabel: "Post pages",
    previousLabel: "Previous",
    titleLabel: "Title",
    viewsLabel: "Views",
    writerLabel: "Author"
  },
  es: {
    allLabel: "Todas las Actividades",
    categoriesLabel: "Categorías",
    dateLabel: "Fecha",
    exploreLabel: "Menú de Actividades",
    emptyPosts: "Aún no hay publicaciones publicadas.",
    numberLabel: "Nro.",
    nextLabel: "Siguiente",
    paginationLabel: "Páginas de publicaciones",
    previousLabel: "Anterior",
    titleLabel: "Título",
    viewsLabel: "Vistas",
    writerLabel: "Autor"
  }
};

function getRequestedPage(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.floor(parsed));
}

function getActivityPageHref(locale: Locale, activityKey: string, page: number) {
  const baseHref = `/${locale}/activities/${activityKey}`;

  return page <= 1 ? baseHref : `${baseHref}?page=${page}`;
}

function getVisiblePaginationPages(currentPage: number, totalPages: number) {
  const visibleCount = 5;
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - visibleCount + 1));
  const end = Math.min(totalPages, start + visibleCount - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function ActivityPagination({
  activityKey,
  currentPage,
  locale,
  pageCopy,
  totalPages
}: {
  activityKey: string;
  currentPage: number;
  locale: Locale;
  pageCopy: (typeof activityDirectoryCopy)[Locale];
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const pages = getVisiblePaginationPages(activePage, totalPages);

  return (
    <nav className="activity-pagination" aria-label={pageCopy.paginationLabel}>
      {activePage > 1 ? (
        <Link className="activity-pagination-nav" href={getActivityPageHref(locale, activityKey, activePage - 1)}>
          <ChevronLeft size={16} />
          <span>{pageCopy.previousLabel}</span>
        </Link>
      ) : (
        <span className="activity-pagination-nav is-disabled" aria-disabled="true">
          <ChevronLeft size={16} />
          <span>{pageCopy.previousLabel}</span>
        </span>
      )}
      <div className="activity-pagination-pages">
        {pages.map((page) => (
          <Link
            aria-current={page === activePage ? "page" : undefined}
            className={page === activePage ? "is-active" : undefined}
            href={getActivityPageHref(locale, activityKey, page)}
            key={page}
          >
            {page}
          </Link>
        ))}
      </div>
      {activePage < totalPages ? (
        <Link className="activity-pagination-nav" href={getActivityPageHref(locale, activityKey, activePage + 1)}>
          <span>{pageCopy.nextLabel}</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="activity-pagination-nav is-disabled" aria-disabled="true">
          <span>{pageCopy.nextLabel}</span>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string }>;
}) {
  const { locale, activityKey } = await params;
  const activity = getActivityGroupByKey(locale, activityKey);

  if (!activity) {
    return {};
  }

  return buildLocaleMetadata({
    locale,
    path: `activities/${activityKey}`,
    title: `${activity.title} | KAHC`,
    description: activity.summary
  });
}

export default async function ActivityDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale; activityKey: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { locale, activityKey } = await params;
  const { page: pageParam } = (await searchParams) ?? {};
  const currentPage = getRequestedPage(pageParam);
  const t = getCopy(locale);
  const activity = getActivityGroupByKey(locale, activityKey);

  if (!activity) {
    notFound();
  }

  const pageCopy = activityDirectoryCopy[locale];
  const activityGroups = getActivityGroups(locale);
  const content = await getPublishedContentIntro({
    contentType: "Activity",
    fallback: {
      lead: activity.summary,
      title: activity.title
    },
    locale,
    slug: activity.key
  });
  const activityTitle = content.title;
  const activityImageUrl = content.imageUrl || activity.imageUrl;
  const isPhotoActivity = activity.key === "photo";
  const postsPageSize = isPhotoActivity ? 9 : 10;
  const [postsResult, detailSections] = await Promise.all([
    getPublishedActivityPosts({
      activityKey,
      fallback: getActivityPosts(locale, activityKey),
      locale,
      page: currentPage,
      pageSize: postsPageSize
    }),
    getPublishedContentSections({
      contentType: "Activity",
      locale,
      slugPrefix: `${activityKey}-section-`
    })
  ]);
  const posts = postsResult.items;
  const categoryIntroStyle = {
    "--activity-category-image": `url("${activityImageUrl.replace(/"/g, "%22")}")`
  } as CSSProperties;

  return (
    <>
      <section className="page-intro activity-category-intro" style={categoryIntroStyle}>
        <div className="activity-category-intro-copy">
          <span className="eyebrow">{t.activitiesPage.detailEyebrow}</span>
          <h1>{activityTitle}</h1>
        </div>
      </section>
      <section className="activities-overview-section">
        <div className="activities-directory-shell">
          <aside className="activities-side-menu" aria-label={pageCopy.exploreLabel}>
            <div>
              <span>{pageCopy.exploreLabel}</span>
              <strong>{activityTitle}</strong>
              <small>{activityGroups.length} {pageCopy.categoriesLabel}</small>
            </div>
            <nav>
              <Link href={`/${locale}/activities`}>
                <LayoutGrid size={17} />
                <span>{pageCopy.allLabel}</span>
              </Link>
              {activityGroups.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    aria-current={item.key === activity.key ? "page" : undefined}
                    className={item.key === activity.key ? "is-active" : undefined}
                    href={`/${locale}/activities/${item.key}`}
                    key={item.key}
                  >
                    <ItemIcon size={17} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="activities-content-panel activity-detail-section">
            {detailSections.length > 0 ? (
              <section className="activity-cms-section" aria-labelledby="activity-cms-section-title">
                <div className="section-heading">
                  <span className="eyebrow">CMS</span>
                  <h2 id="activity-cms-section-title">{t.activitiesPage.managedContentTitle}</h2>
                </div>
                <div>
                  {detailSections.map((section, index) => {
                    const lines = splitSectionLines(section);

                    return (
                      <article key={section.slug}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <h3>{section.title}</h3>
                        {section.lead ? <p>{section.lead}</p> : null}
                        {lines.length > 0 ? (
                          <ul>
                            {lines.map((line) => (
                              <li key={line}>
                                <CheckCircle2 size={16} />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}
            <div className="section-heading">
              <span className="eyebrow">{activityTitle}</span>
              <h2>{t.activitiesPage.latestPostsTitle}</h2>
            </div>
            {posts.length > 0 ? (
              isPhotoActivity ? (
                <div className="activity-post-list is-card-grid">
                  {posts.map((post) => (
                    <Link
                      className="activity-post-card"
                      href={`/${locale}/activities/${activityKey}/${post.slug}`}
                      key={post.slug}
                    >
                      <article>
                        {post.imageUrl ? (
                          <Image
                            className="activity-post-card-image"
                            src={post.imageUrl}
                            alt={post.title}
                            width={520}
                            height={300}
                            unoptimized
                          />
                        ) : null}
                        <div className="activity-post-copy">
                          <header>
                            <CalendarDays size={18} />
                            <span>{post.date}</span>
                          </header>
                          <h3>{post.title}</h3>
                          <p>{post.body}</p>
                        </div>
                        <span className="activity-post-cta">
                          {t.activitiesPage.detailCta}
                          <ArrowRight size={15} />
                        </span>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="activity-board-list">
                  <div className="activity-board-head" aria-hidden="true">
                    <span>{pageCopy.numberLabel}</span>
                    <span>{pageCopy.titleLabel}</span>
                    <span>{pageCopy.writerLabel}</span>
                    <span>{pageCopy.dateLabel}</span>
                    <span>{pageCopy.viewsLabel}</span>
                  </div>
                  {posts.map((post, index) => (
                    <Link
                      className="activity-board-row"
                      href={`/${locale}/activities/${activityKey}/${post.slug}`}
                      key={post.slug}
                    >
                      <span className="activity-board-no">
                        {postsResult.total - (postsResult.page - 1) * postsResult.pageSize - index}
                      </span>
                      <span className="activity-board-title">
                        <strong>{post.title}</strong>
                      </span>
                      <span className="activity-board-author">{post.author}</span>
                      <span className="activity-board-date">
                        <CalendarDays size={16} />
                        {post.date}
                      </span>
                      <span className="activity-board-views">{post.viewCount.toLocaleString()}</span>
                    </Link>
                  ))}
                </div>
              )
            ) : (
              <div className="activity-empty-state">
                <CalendarDays size={22} />
                <p>{pageCopy.emptyPosts}</p>
              </div>
            )}
            <ActivityPagination
              activityKey={activityKey}
              currentPage={postsResult.page}
              locale={locale}
              pageCopy={pageCopy}
              totalPages={postsResult.totalPages}
            />
          </div>
        </div>
      </section>
    </>
  );
}
