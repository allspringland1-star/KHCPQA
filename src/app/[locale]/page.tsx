import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  Handshake,
  HandHeart,
  Headphones,
  HeartPulse,
  Leaf,
  Lightbulb,
  Mountain,
  Store,
  Users
} from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedCourses } from "@/lib/course-repository";
import { getPublishedActivityPosts, getPublishedBanners } from "@/lib/public-content";
import { StatusBadge } from "@/components/SiteShell";
import { HomePopup } from "@/components/HomePopup";

const quickNavIcons = [BriefcaseBusiness, Store, CalendarDays, HeartPulse, Leaf, Mountain];
const supportIcons = [Users, BadgeCheck, Lightbulb, HandHeart];
const reasonIcons = [BookOpenCheck, Award, Handshake, Headphones];
const emptyNoticeLabels: Record<Locale, string> = {
  "zh-CN": "暂无已发布的通知。",
  ko: "등록된 공지사항이 없습니다.",
  en: "No notices have been published.",
  es: "No hay avisos publicados."
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const [courses, homeBanners, noticePage] = await Promise.all([
    getPublishedCourses(locale),
    getPublishedBanners({ placement: "home" }),
    getPublishedActivityPosts({
      activityKey: "notice",
      fallback: [],
      locale,
      pageSize: 4
    })
  ]);
  const [homePopup] = homeBanners;
  const notices = noticePage.items;
  const previewCourseIndexes = [5, 3, 4, 7];
  const previewCourses = previewCourseIndexes.flatMap((index) => (courses[index] ? [courses[index]] : []));
  const quickNavItems = [
    { label: courses[0]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[0]?.slug ?? ""}` },
    { label: courses[1]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[1]?.slug ?? ""}` },
    { label: courses[2]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[2]?.slug ?? ""}` },
    { label: courses[4]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[4]?.slug ?? ""}` },
    { label: courses[5]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[5]?.slug ?? ""}` },
    { label: courses[7]?.title ?? t.curriculumTitle, href: `/${locale}/curriculum/${courses[7]?.slug ?? ""}` }
  ];
  const renderSectionTitle = (title: string, lead?: string) => (
    <div className="home-section-title">
      <h2>{title}<span aria-hidden="true">✣</span></h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );

  return (
    <>
      <HomePopup banner={homePopup} locale={locale} />
      <section className="home-stage">
        <div className="hero-card">
          <div className="hero-copy">
            <StatusBadge>{t.heroBadge}</StatusBadge>
            <h1>
              {t.home.heroTitlePrefix}
              <br />
              <span>{t.home.heroTitleHighlight}</span>
              {t.home.heroTitleSuffix}
            </h1>
            <p>{t.heroLead}</p>
            <div className="hero-actions">
              <Link className="primary-button" href={`/${locale}/curriculum`}>
                {t.primaryCta}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="hero-video-backdrop" aria-hidden="true">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/premium-hero-wellness-education.png"
              preload="metadata"
            >
              <source src="/assets/home-hero-background-v2.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="home-quick-nav" aria-label={t.curriculumTitle}>
            {quickNavItems.map((item, index) => {
              const Icon = quickNavIcons[index];
              return (
                <Link href={item.href} key={`${item.label}-${index}`}>
                  <Icon aria-hidden="true" size={24} strokeWidth={1.55} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-section curriculum-preview">
        {renderSectionTitle(t.home.featuredCoursesTitle, t.home.featuredCoursesLead)}
        <div className="home-course-strip">
          {previewCourses.map((course) => (
            <article className="home-course-card" key={course.title}>
              <Image src={course.imageUrl} alt={course.title} width={420} height={260} />
              <div>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <Link href={`/${locale}/curriculum/${course.slug}`} aria-label={`${course.title} ${t.home.viewDetails}`}>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-reasons-section">
        {renderSectionTitle(t.home.reasonsTitle)}
        <div className="home-reason-grid">
          {t.home.reasons.map((item, index) => {
            const Icon = reasonIcons[index];
            return (
              <article key={item.title}>
                <Icon size={34} strokeWidth={1.45} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="support-program-section">
        <div className="section-heading centered">
          <h2>{t.home.supportTitle}</h2>
        </div>
        <div className="home-support-service-grid">
          {t.home.supportPrograms.map((program, index) => {
            const Icon = supportIcons[index];
            return (
              <article key={program.title}>
                <Image src={program.image} alt="" width={220} height={170} />
                <div>
                  <span className="home-support-step">{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={20} strokeWidth={1.55} />
                  <h3>{program.title}</h3>
                  <p>{program.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-info-section">
        <div className="landing-info-grid">
          <article className="landing-info-card">
            <div className="landing-info-head">
              <h2>{t.home.noticesTitle}</h2>
              <Link href={`/${locale}/activities/notice`}>{t.home.moreCta} <ArrowRight size={14} /></Link>
            </div>
            <ul>
              {notices.length > 0 ? notices.map((notice) => (
                <li key={notice.slug}>
                  <Link href={`/${locale}/activities/notice/${notice.slug}`}>{notice.title}</Link>
                  <time dateTime={notice.date}>{notice.date.replaceAll("-", ".")}</time>
                </li>
              )) : (
                <li className="landing-info-empty">
                  <span>{emptyNoticeLabels[locale]}</span>
                </li>
              )}
            </ul>
          </article>
          <article className="landing-info-card">
            <div className="landing-info-head">
              <h2>{t.home.scheduleTitle}</h2>
            </div>
            <div className="schedule-list">
              {t.home.schedules.map(({ label, time }) => (
                <div key={label}>
                  <strong>{label}</strong>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bottom-cta-section home-final-cta-section">
        <div className="bottom-cta-banner home-final-cta">
          <Image src="/assets/home-final-cta-consultation-v2.png" alt="" width={220} height={160} />
          <div>
            <p>{t.home.finalKicker}</p>
            <h2>{t.home.finalTitle}</h2>
          </div>
          <Link href={`/${locale}/partner-inquiry`}>
            {t.home.finalCta} <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
