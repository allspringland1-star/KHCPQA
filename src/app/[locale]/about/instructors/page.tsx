import Image from "next/image";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentSections } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";

type DirectorProfile = {
  imageUrl: string;
  name: string;
  role: string;
};

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
  const publishedDirectors = await getPublishedContentSections({
    contentType: "Page",
    locale,
    slugPrefix: "director-"
  });
  const directors: DirectorProfile[] =
    publishedDirectors.length > 0
      ? publishedDirectors.map((director) => ({
          imageUrl: director.imageUrl || "/assets/instructor-profile-kim-moonsun.jpg",
          name: director.title,
          role: director.lead || ({ ko: "국제 디렉터", en: "International Director", es: "Director internacional", "zh-CN": "国际总监" }[locale])
        }))
      : t.instructorsPage.instructors.map((instructor) => ({
          imageUrl: instructor.imageUrl,
          name: instructor.name,
          role: instructor.role
        }));

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
            <article className="instructor-card" key={instructor.name}>
              <div className="instructor-card-content">
                <div className="instructor-photo">
                  <Image
                    src={instructor.imageUrl}
                    alt={instructor.name}
                    width={275}
                    height={376}
                    sizes="(max-width: 720px) 48vw, (max-width: 1120px) 30vw, 20vw"
                  />
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
