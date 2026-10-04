import Image from "next/image";
import { resolveDirectorRoster } from "@/lib/director-roster";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentSections } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about/instructors",
    title: `${t.instructorsPage.title} | KAHC`,
    description: t.instructorsPage.lead
  });
}

export default async function InstructorsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);
  const sources = await getPublishedContentSections({ contentType: "Page", locale: "ko", slugPrefix: "director-" });
  const translations = locale === "ko" ? [] : await getPublishedContentSections({ contentType: "Page", locale, slugPrefix: "director-" });
  const directors = resolveDirectorRoster(sources, translations, locale);

  return (
    <>
      <PageIntro
        className="about-visual-intro instructors-page-intro"
        eyebrow={t.instructorsPage.eyebrow}
        title={t.instructorsPage.title}
        lead={t.instructorsPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="instructors" />
      <section className="content-section">
        <div className="instructor-grid" id="instructors">
          {directors.map((instructor) => (
            <article className="instructor-card" key={instructor.slug}>
              <div className="instructor-card-content">
                <div className="instructor-photo">
                  {instructor.imageUrl ? <Image
                    src={instructor.imageUrl}
                    alt={instructor.name}
                    width={275}
                    height={376}
                    sizes="(max-width: 720px) 48vw, (max-width: 1120px) 30vw, 20vw"
                  /> : null}
                </div>
                <div>
                  <h2>{instructor.name}</h2>
                  <p>{instructor.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
