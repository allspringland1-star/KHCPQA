import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpenCheck, CalendarDays, CheckCircle2, Clock3, Download, ExternalLink, FileText, Layers3, Users } from "lucide-react";
import { getCopy, locales, type Locale } from "@/lib/content";
import { groupCurriculumItemsByPeriod } from "@/lib/course-model";
import { getPublishedCourseBySlug, getPublishedCourses } from "@/lib/course-repository";
import { buildLocaleMetadata } from "@/lib/seo";
import { getPublishedLocalesForPath } from "@/lib/translation-availability";

const labels = {
  ko: {
    audience: "추천 대상",
    certification: "수료·자격 안내",
    curriculum: "핵심 교육 내용",
    document: "교육과정 PDF 자료",
    documentLead: "세부 교안과 일정은 첨부된 PDF에서 확인할 수 있습니다.",
    download: "다운로드",
    duration: "교육 기간",
    itemCount: "개 항목",
    quickNav: "과정 바로가기",
    coreAudience: "핵심·추천",
    completionResources: "수료·자료",
    schedule: "교육 일정",
    sections: "상세 교육 정보",
    overview: "과정 개요",
    updated: "최종 수정",
    view: "자료 보기"
  },
  en: {
    audience: "Recommended For",
    certification: "Completion & Certification",
    curriculum: "Core Curriculum",
    document: "Course PDF",
    documentLead: "View the attached PDF for detailed materials and schedules.",
    download: "Download",
    duration: "Duration",
    itemCount: " items",
    quickNav: "Course navigation",
    coreAudience: "Core & Audience",
    completionResources: "Completion & Files",
    schedule: "Schedule",
    sections: "Course Details",
    overview: "Course Overview",
    updated: "Updated",
    view: "View PDF"
  },
  es: {
    audience: "Recomendado Para",
    certification: "Finalización y Certificación",
    curriculum: "Contenido Principal",
    document: "PDF del Curso",
    documentLead: "Consulta el PDF adjunto para materiales y horarios detallados.",
    download: "Descargar",
    duration: "Duración",
    itemCount: " elementos",
    quickNav: "Navegación del curso",
    coreAudience: "Contenido y público",
    completionResources: "Finalización y archivos",
    schedule: "Calendario",
    sections: "Información Detallada",
    overview: "Resumen del Curso",
    updated: "Actualizado",
    view: "Ver PDF"
  },
  "zh-CN": {
    audience: "推荐对象",
    certification: "结业与资格说明",
    curriculum: "核心课程内容",
    document: "课程 PDF 资料",
    documentLead: "详细教材与日程请查看附件 PDF。",
    download: "下载",
    duration: "培训周期",
    itemCount: "项",
    quickNav: "课程导航",
    coreAudience: "核心内容与对象",
    completionResources: "结业与资料",
    schedule: "课程安排",
    sections: "详细课程信息",
    overview: "课程简介",
    updated: "最后更新",
    view: "查看 PDF"
  }
} as const;

const sectionTypeLabels = {
  ko: {
    learning_method: "교육 방식",
    goals: "교육 목표",
    theory: "핵심 이론",
    practice: "실습·기술",
    exam: "시험 안내",
    precautions: "준비물·주의사항",
    benefits: "지원·특전",
    careers: "진로·취업 분야",
    programs: "선택 과정·조합",
    gallery: "실습 갤러리"
  },
  en: {
    learning_method: "Learning Method",
    goals: "Learning Objectives",
    theory: "Core Theory",
    practice: "Practice & Skills",
    exam: "Exam Information",
    precautions: "Preparation & Notes",
    benefits: "Support & Benefits",
    careers: "Career Paths",
    programs: "Course Combinations",
    gallery: "Practice Gallery"
  },
  es: {
    learning_method: "Método de aprendizaje",
    goals: "Objetivos de aprendizaje",
    theory: "Teoría fundamental",
    practice: "Práctica y técnicas",
    exam: "Información del examen",
    precautions: "Preparación y avisos",
    benefits: "Apoyo y beneficios",
    careers: "Salidas profesionales",
    programs: "Combinaciones de cursos",
    gallery: "Galería de prácticas"
  },
  "zh-CN": {
    learning_method: "教学方式",
    goals: "学习目标",
    theory: "核心理论",
    practice: "实操技能",
    exam: "考试说明",
    precautions: "准备与注意事项",
    benefits: "支持与权益",
    careers: "就业方向",
    programs: "课程组合",
    gallery: "实操图库"
  }
} as const;

function fallbackItemLabel(locale: keyof typeof labels, index: number) {
  if (locale === "ko") return `${index + 1}번`;
  if (locale === "es") return `Elemento ${index + 1}`;
  if (locale === "zh-CN") return `第${index + 1}项`;
  return `Item ${index + 1}`;
}

export async function generateStaticParams() {
  const byLocale = await Promise.all(
    locales.map(async (locale) => {
      const courses = await getPublishedCourses(locale);
      return courses.map((course) => ({ locale, courseSlug: course.slug }));
    })
  );
  return byLocale.flat();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; courseSlug: string }> }) {
  const { locale, courseSlug } = await params;
  const decodedSlug = decodeURIComponent(courseSlug);
  const [course, availableLocales] = await Promise.all([
    getPublishedCourseBySlug(decodedSlug, locale),
    getPublishedLocalesForPath(`/${locale}/curriculum/${decodedSlug}`)
  ]);
  if (!course) return {};

  return buildLocaleMetadata({
    locale,
    path: `curriculum/${decodedSlug}`,
    title: `${course.title} | KAHC`,
    description: course.summary,
    availableLocales
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ locale: Locale; courseSlug: string }> }) {
  const { locale, courseSlug } = await params;
  const course = await getPublishedCourseBySlug(decodeURIComponent(courseSlug), locale);
  if (!course) notFound();

  const t = getCopy(locale);
  const copy = labels[locale];
  const imageUrl = course.imageUrl || "/assets/premium-course-facial-contouring.png";
  const updatedAt = course.updatedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(course.updatedAt))
    : "";

  return (
    <article className="course-hybrid-detail">
      <section className="course-hybrid-hero">
        <div className="course-hybrid-hero-media">
          <Image alt={course.title} fill priority sizes="(max-width: 860px) 100vw, 48vw" src={imageUrl} unoptimized />
        </div>
        <div className="course-hybrid-hero-copy">
          <span>{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.summary}</p>
          {course.duration ? <div><Clock3 size={18} /><strong>{copy.duration}</strong><span>{course.duration}</span></div> : null}
          <Link className="primary-button" href={`/${locale}/partner-inquiry`}>{t.courseDetail.inquiryCta}<ArrowRight size={17} /></Link>
        </div>
      </section>

      <nav aria-label={copy.quickNav} className="course-hybrid-anchor-nav">
        <a href="#course-overview">{copy.overview}</a>
        {course.scheduleTracks.length ? <a href="#course-schedule">{copy.schedule}</a> : null}
        {course.contentSections.length ? <a href="#course-details">{copy.sections}</a> : null}
        <a href="#course-core">{copy.coreAudience}</a>
        {course.certificationNote || course.pdfUrl ? <a href="#course-completion">{copy.completionResources}</a> : null}
      </nav>

      <section className="course-hybrid-overview" id="course-overview">
        <div className="course-hybrid-section-heading"><BookOpenCheck size={24} /><h2>{copy.overview}</h2></div>
        <p>{course.overview}</p>
      </section>

      {course.scheduleTracks.length ? (
        <section className="course-structured-schedule" id="course-schedule">
          <div className="course-hybrid-section-heading"><CalendarDays size={24} /><h2>{copy.schedule}</h2></div>
          <div className="course-structured-track-list">
            {course.scheduleTracks.map((track) => (
              <article className="course-structured-track" key={track.id}>
                <header className="course-structured-track-header"><span><strong>{track.label}</strong>{track.duration ? <small>{track.duration}</small> : null}</span><span>{track.items.length}{copy.itemCount}</span></header>
                {track.times.length ? <div className="course-structured-times">{track.times.map((time) => <span key={time}><Clock3 size={14} />{time}</span>)}</div> : null}
                <div className="course-structured-items">
                  {groupCurriculumItemsByPeriod(track.items).map((group) => (
                    <section className="course-structured-period-group" key={`${track.id}-${group.startIndex}`}>
                      {group.period ? <h3>{group.period}</h3> : null}
                      {group.items.map((item, groupItemIndex) => {
                        const itemIndex = group.startIndex + groupItemIndex;
                        return <section className="course-structured-item" key={`${track.id}-${itemIndex}`}>
                          <span className="course-structured-label">{item.label || fallbackItemLabel(locale, itemIndex)}</span>
                          {item.title ? <strong className="course-structured-item-title">{item.title}</strong> : <span aria-hidden="true" className="course-structured-item-title" />}
                          {item.items.length ? <ul>{item.items.map((detail) => <li key={detail}><CheckCircle2 size={16} />{detail}</li>)}</ul> : null}
                        </section>;
                      })}
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {course.contentSections.length ? (
        <section className="course-structured-sections" id="course-details">
          <div className="course-hybrid-section-heading"><Layers3 size={24} /><h2>{copy.sections}</h2></div>
          {course.contentSections.map((section) => (
            <section className={`course-structured-section is-${section.type}`} key={section.id}>
              <div className="course-structured-section-copy">
                <span>{sectionTypeLabels[locale][section.type]}</span>
                {section.title ? <h3>{section.title}</h3> : null}
                {section.body ? <p>{section.body}</p> : null}
                {section.items.length ? <ul>{section.items.map((item) => <li key={item}><CheckCircle2 size={16} />{item}</li>)}</ul> : null}
              </div>
              {section.images.length ? <div className={`course-structured-section-media ${section.images.length === 1 ? "has-single-image" : "has-multiple-images"}`}>{section.images.map((image) => <figure key={image.url}><Image alt={image.alt || section.title} height={720} src={image.url} unoptimized width={1080} />{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure>)}</div> : null}
            </section>
          ))}
        </section>
      ) : null}

      <div className="course-hybrid-info-grid" id="course-core">
        <section className="course-hybrid-curriculum">
          <div className="course-hybrid-section-heading"><CheckCircle2 size={24} /><h2>{copy.curriculum}</h2></div>
          <ul>{course.curriculumItems.map((item) => <li key={item}><CheckCircle2 size={17} /><span>{item}</span></li>)}</ul>
        </section>
        <section className="course-hybrid-audience">
          <div className="course-hybrid-section-heading"><Users size={24} /><h2>{copy.audience}</h2></div>
          <ul>{course.recommendedFor.map((item) => <li key={item}><Users size={17} /><span>{item}</span></li>)}</ul>
        </section>
      </div>

      {course.certificationNote || course.pdfUrl ? (
        <div className="course-hybrid-completion" id="course-completion">
          {course.certificationNote ? (
            <section className="course-hybrid-certification">
              <BadgeCheck size={30} />
              <div><h2>{copy.certification}</h2><p>{course.certificationNote}</p></div>
            </section>
          ) : null}

          {course.pdfUrl ? (
            <section className="course-hybrid-document">
              <div className="course-hybrid-document-icon"><FileText size={32} /></div>
              <div>
                <h2>{copy.document}</h2>
                <p>{copy.documentLead}</p>
                <span>{course.pdfFileName || copy.document}{updatedAt ? ` · ${copy.updated} ${updatedAt}` : ""}</span>
              </div>
              <div className="course-hybrid-document-actions">
                <a className="primary-button" href={course.pdfUrl} rel="noreferrer" target="_blank"><ExternalLink size={17} />{copy.view}</a>
                <a className="secondary-button" download={course.pdfFileName || true} href={course.pdfUrl}><Download size={17} />{copy.download}</a>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      <section className="course-hybrid-cta">
        <div><span>KAHC</span><h2>{course.title}</h2><p>{course.summary}</p></div>
        <Link href={`/${locale}/partner-inquiry`}>{t.courseDetail.inquiryCta}<ArrowRight size={18} /></Link>
      </section>
    </article>
  );
}
