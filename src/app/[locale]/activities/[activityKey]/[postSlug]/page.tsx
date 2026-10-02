import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowLeft, CalendarDays, Download, Eye, List, UserRound } from "lucide-react";
import {
  getActivityGroupByKey,
  getActivityPosts,
  type Locale
} from "@/lib/content";
import { getPublishedActivityPost, getPublishedContentIntro, incrementPublishedActivityPostViewCount } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";
import { getPublishedLocalesForPath } from "@/lib/translation-availability";

export const dynamic = "force-dynamic";

const postDetailCopy: Record<Locale, {
  authorLabel: string;
  attachmentLabel: string;
  dateLabel: string;
  listLabel: string;
  viewsLabel: string;
}> = {
  "zh-CN": { authorLabel: "作者", attachmentLabel: "PDF 附件", dateLabel: "日期", listLabel: "返回列表", viewsLabel: "浏览次数" },
  ko: {
    authorLabel: "작성자",
    attachmentLabel: "PDF 첨부파일",
    dateLabel: "작성일",
    listLabel: "목록으로",
    viewsLabel: "조회수"
  },
  en: {
    authorLabel: "Author",
    attachmentLabel: "PDF Attachment",
    dateLabel: "Date",
    listLabel: "Back to List",
    viewsLabel: "Views"
  },
  es: {
    authorLabel: "Autor",
    attachmentLabel: "Archivo PDF",
    dateLabel: "Fecha",
    listLabel: "Volver a la Lista",
    viewsLabel: "Vistas"
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string; postSlug: string }>;
}) {
  const { locale, activityKey, postSlug } = await params;
  const activity = getActivityGroupByKey(locale, activityKey);
  const fallback = getActivityPosts(locale, activityKey).find((post) => post.slug === postSlug);
  const [post, availableLocales] = await Promise.all([
    getPublishedActivityPost({ fallback, locale, slug: postSlug }),
    getPublishedLocalesForPath(`/${locale}/activities/${activityKey}/${postSlug}`)
  ]);

  if (!activity || !post) {
    return {};
  }

  return buildLocaleMetadata({
    description: post.body,
    availableLocales,
    locale,
    path: `activities/${activityKey}/${postSlug}`,
    title: `${post.title} | ${activity.title} | KAHC`
  });
}

export default async function ActivityPostDetailPage({
  params
}: {
  params: Promise<{ locale: Locale; activityKey: string; postSlug: string }>;
}) {
  const { locale, activityKey, postSlug } = await params;
  const activity = getActivityGroupByKey(locale, activityKey);

  if (!activity) {
    notFound();
  }

  const fallback = getActivityPosts(locale, activityKey).find((post) => post.slug === postSlug);
  const post = await getPublishedActivityPost({ fallback, locale, slug: postSlug });

  if (!post) {
    notFound();
  }

  const didIncrementViewCount = await incrementPublishedActivityPostViewCount({ locale, slug: post.slug });
  const categoryContent = await getPublishedContentIntro({
    contentType: "Activity",
    fallback: {
      lead: activity.summary,
      title: activity.title
    },
    locale,
    slug: activity.key
  });

  const imageUrl = post.imageUrl;
  const copy = postDetailCopy[locale];
  const displayedViewCount = post.viewCount + (didIncrementViewCount ? 1 : 0);
  const heroImageUrl = activity.key === "photo" ? categoryContent.imageUrl || activity.imageUrl : imageUrl || activity.imageUrl;
  const postIntroStyle = {
    "--activity-post-hero-image": `url("${heroImageUrl.replace(/"/g, "%22")}")`
  } as CSSProperties;
  const bodyLines = post.body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <section className="page-intro activity-post-intro" style={postIntroStyle}>
        <span className="eyebrow">{activity.title}</span>
        <h1>{post.title}</h1>
      </section>
      <section className="activity-post-detail-section">
        <Link className="activity-back-link" href={`/${locale}/activities/${activityKey}`}>
          <ArrowLeft size={16} />
          <span>{activity.title}</span>
        </Link>
        <article className="activity-post-detail-card">
          {imageUrl ? <Image src={imageUrl} alt={post.title} width={1180} height={640} unoptimized /> : null}
          <div className="activity-post-content">
            <dl className="activity-post-meta">
              <div>
                <dt>
                  <UserRound size={16} />
                  <span>{copy.authorLabel}</span>
                </dt>
                <dd>{post.author}</dd>
              </div>
              <div>
                <dt>
                  <CalendarDays size={16} />
                  <span>{copy.dateLabel}</span>
                </dt>
                <dd>{post.date}</dd>
              </div>
              <div>
                <dt>
                  <Eye size={16} />
                  <span>{copy.viewsLabel}</span>
                </dt>
                <dd>{displayedViewCount.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="activity-post-body">
              {bodyLines.length > 0 ? (
                bodyLines.map((line) => <p key={line}>{line}</p>)
              ) : (
                <p>{locale === "zh-CN" ? "暂无详细正文。" : "등록된 상세 본문이 없습니다."}</p>
              )}
            </div>
            {post.sourceUrl ? (
              <a className="activity-post-attachment" href={post.sourceUrl} rel="noreferrer" target="_blank">
                <Download size={17} />
                <span>{copy.attachmentLabel}</span>
              </a>
            ) : null}
            <div className="activity-post-actions">
              <Link href={`/${locale}/activities/${activityKey}`}>
                <List size={17} />
                <span>{copy.listLabel}</span>
              </Link>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
