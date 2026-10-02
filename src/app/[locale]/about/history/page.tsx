import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { historyByYear, historyHighlights, localizeHistoryItem } from "@/lib/history";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "about/history",
    title: `${t.historyPage.title} | KAHC`,
    description: t.historyPage.lead || t.seo.description
  });
}

export default async function HistoryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return (
    <>
      <PageIntro
        className="about-visual-intro history-page-intro"
        eyebrow={t.historyPage.eyebrow}
        title={t.historyPage.title}
        lead={t.historyPage.lead}
      />
      <AboutSubnav locale={locale} activeKey="history" />
      <section className="content-section history-section">
        <div className="history-highlights" aria-label={t.historyPage.timelineLabel}>
          {historyHighlights.map((sourceItem) => {
            const item = localizeHistoryItem(sourceItem, locale);
            return (
              <article key={`${item.date}-${item.title}`}>
                <time>{item.date}</time>
                <strong>{item.title}</strong>
              </article>
            );
          })}
        </div>
        <nav className="history-years" aria-label={t.historyPage.yearsLabel}>
          {historyByYear.map((group) => (
            <a href={`#history-${group.year}`} key={group.year}>
              {group.year}
            </a>
          ))}
        </nav>
        <div className="history-heading">
          <h2>{t.historyPage.timelineLabel}</h2>
          <p>{t.historyPage.detailNote}</p>
        </div>
        <div className="history-timeline">
          {historyByYear.map((group) => (
            <section className="history-year-block" id={`history-${group.year}`} key={group.year}>
              <div className="history-year-title">
                <h3>{group.year}</h3>
                <span>{group.items.length}</span>
              </div>
              <div className="history-list" aria-label={`${group.year} ${t.historyPage.timelineLabel}`}>
                {group.items.map((sourceItem) => {
                  const item = localizeHistoryItem(sourceItem, locale);
                  return (
                    <article className="history-event" key={`${item.date}-${item.title}`}>
                      <time>{item.date}</time>
                      <strong>{item.title}</strong>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
