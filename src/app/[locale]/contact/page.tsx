import Image from "next/image";
import { Bus, Car, ChevronDown, ExternalLink, MapPin, Phone, Train } from "lucide-react";
import { AboutSubnav } from "@/components/AboutSubnav";
import { PageIntro } from "@/components/SiteShell";
import { getCopy, type Locale } from "@/lib/content";
import { getPublishedContentIntro } from "@/lib/public-content";
import { buildLocaleMetadata } from "@/lib/seo";
import { localizeChineseLocation } from "@/lib/contact-zh-cn";

type TransitStop = {
  stop: string;
  lines: string[];
};

type AcademyLocation = {
  id: string;
  name: string;
  station: string;
  roadAddress: string;
  lotAddress: string;
  phone: string;
  primaryPhone: string;
  parking: string;
  subway: string[];
  imageUrl: string;
  busStops: TransitStop[];
};

const academyLocations: AcademyLocation[] = [
  {
    id: "seoul",
    name: "서울총본부",
    station: "종로3가역",
    roadAddress: "서울특별시 종로구 수표로 120 내인빌딩 8층",
    lotAddress: "서울특별시 종로구 낙원동 141번지 내인빌딩 8층",
    phone: "010-7712-3362 / 02-763-1271",
    primaryPhone: "01077123362",
    parking: "1층 무료주차장 또는 주변 유료주차장 이용",
    subway: [
      "1호선 1번 출구에서 직진 3분 정도 이동 후 대한보청기에서 오른쪽 방향으로 1분 직진",
      "3호선 3번 출구에서 직진 후 5번 출구 방향으로 1분 직진",
      "5호선 5번 출구에서 나주곰탕, 종로낙지 방향으로 1분 정도 직진"
    ],
    imageUrl: "/assets/location-seoul-headquarters.jpg",
    busStops: [
      { stop: "종로3가 (01-767)", lines: ["공항 6002"] },
      { stop: "종로3가 (01-194)", lines: ["일반 111", "간선 101, 103, 143, 150, 160, 201, 260, 262, 270, 271, 273, 370, 601, 710, 720, 721, N15, N26, N62", "지선 7212", "직행 9301"] },
      { stop: "종로3가 (01-596)", lines: ["마을 종로01, 종로02"] },
      { stop: "종로3가 (01-183)", lines: ["간선 140, 143, 150, 160, 260, 262, 270, 271, 273, 370, 710, 721, N15, N26, N62"] },
      { stop: "종로3가 (01-768)", lines: ["공항 6002"] }
    ]
  },
  {
    id: "gangnam",
    name: "강남SMC아카데미",
    station: "구로디지털단지역",
    roadAddress: "서울특별시 관악구 시흥대로 558-1 G밸리마인드 5층, 505호",
    lotAddress: "서울특별시 관악구 신림동 1655-17 G밸리마인드 5층, 505호",
    phone: "010-6283-1206 / 02-867-2280",
    primaryPhone: "01062831206",
    parking: "건물 주차장",
    subway: [
      "2호선 6번 출구에서 직진 3분 정도 이동",
      "횡단보도 건너편 G밸리마인드1차 5층 505호"
    ],
    imageUrl: "/assets/location-gangnam-smc.jpg",
    busStops: [
      { stop: "구로디지털단지역 (17229)", lines: ["지선 5536, 5616"] },
      { stop: "구로디지털단지역 (17472)", lines: ["마을 구로09"] },
      { stop: "구로디지털단지역 (17967)", lines: ["마을 영등포01"] },
      { stop: "구로디지털단지역 (21248)", lines: ["마을 영등포04", "경기 20"] },
      { stop: "구로디지털단지역 (17013)", lines: ["간선 150, 505, 507, N65(심야)", "지선 5531, 5616, 5620, 5623, 5625, 5633, 5634, 5713, 6512", "경기 5, 900", "직행 5909"] },
      { stop: "구로디지털단지역 (21001)", lines: ["간선 150, 505, 507, N65(심야)", "지선 5531, 5536, 5616, 5620, 5623, 5625, 5633, 5634, 5713, 6512", "경기 5, 900", "직행 5909"] },
      { stop: "구로디지털단지역 (21002)", lines: ["마을 금천03, 금천06, 금천07", "지선 5616, 5617, 5621, 5624, 5627, 6635", "경기 1, 51, 5602"] },
      { stop: "구로디지털단지우체국 (17634)", lines: ["마을 금천07"] },
      { stop: "구로디지털단지입구 (17920)", lines: ["마을 금천07"] },
      { stop: "구로디지털단지입구 (17481)", lines: ["마을 구로09, 영등포01"] }
    ]
  },
  {
    id: "daerim",
    name: "대림캠퍼스",
    station: "대림역",
    roadAddress: "서울특별시 영등포구 대림로 23길 30-1 골든타워 6층",
    lotAddress: "서울특별시 영등포구 대림동 1049 골든타워 6층",
    phone: "010-5589-9812",
    primaryPhone: "01055899812",
    parking: "건물 주차장",
    subway: [
      "2호선, 7호선 12번 출구에서 바로 왼쪽 길로 이동",
      "왼쪽 두 번째 건물의 뒷건물",
      "12번 출구에서 화장품가게 골목, 88직업소개소, 고려홍삼 뒤편"
    ],
    imageUrl: "/assets/location-daerim-campus.jpg",
    busStops: [
      { stop: "대림역 7호선 (19-509)", lines: ["마을 영등포04"] },
      { stop: "대림역 (19-264)", lines: ["간선 642", "지선 5618, 6411, 6511"] },
      { stop: "대림역 7호선 (19-807)", lines: ["마을 영등포04"] },
      { stop: "대림역 (19-270)", lines: ["간선 642", "지선 5618, 6411, 6511"] },
      { stop: "대동초등학교 (19-265)", lines: ["간선 642", "지선 5618, 6411, 6511"] },
      { stop: "대동초등학교 (19-271)", lines: ["간선 642", "지선 5618, 6411, 6511"] }
    ]
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getCopy(locale);

  return buildLocaleMetadata({
    locale,
    path: "contact",
    title: `${t.nav.contact} | KAHC`,
    description: t.contact.lead
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const locations = locale === "zh-CN" ? academyLocations.map(localizeChineseLocation) : academyLocations;
  const t = getCopy(locale);
  const intro = await getPublishedContentIntro({
    contentType: "Page",
    fallback: {
      lead: t.contact.lead,
      title: t.nav.contact
    },
    locale,
    slug: "contact"
  });

  return (
    <>
      <PageIntro
        className="about-visual-intro location-page-intro"
        eyebrow={t.contact.eyebrow}
        title={intro.title}
        lead={intro.lead}
      />
      <AboutSubnav locale={locale} activeKey="location" />
      <section className="content-section location-section">
        <nav className="location-tabs" aria-label={t.nav.contact}>
          {locations.map((location) => (
            <a href={`#${location.id}`} key={location.id}>
              {location.name}
            </a>
          ))}
        </nav>

        <div className="location-detail-list">
          {locations.map((location) => (
            <article className="location-detail" id={location.id} key={location.id}>
              <div className="location-detail-head">
                <div>
                  <span>{location.station}</span>
                  <h2>{location.name}</h2>
                </div>
                <div className="location-actions">
                  <a href={`tel:${location.primaryPhone}`}>
                    <Phone size={18} />
                    {t.contact.callCta}
                  </a>
                  <a href={`https://map.kakao.com/link/search/${encodeURIComponent(academyLocations.find((item) => item.id === location.id)?.roadAddress ?? location.roadAddress)}`} target="_blank" rel="noreferrer">
                    <ExternalLink size={18} />
                    {t.contact.mapCta}
                  </a>
                </div>
              </div>

              <div className="location-summary">
                <div>
                  <span>{t.contact.nearestStationLabel}</span>
                  <strong>{location.station}</strong>
                </div>
                <div>
                  <span>{t.contact.mainPhoneLabel}</span>
                  <strong>{location.phone}</strong>
                </div>
                <div>
                  <span>{t.contact.parkingLabel}</span>
                  <strong>{location.parking}</strong>
                </div>
              </div>

              <div className="location-map-frame">
                <Image
                  src={location.imageUrl}
                  alt={`${location.name} ${t.contact.mapAltSuffix}`}
                  width={915}
                  height={528}
                  sizes="(max-width: 960px) 100vw, 905px"
                />
              </div>

              <div className="location-info-grid">
                <section>
                  <h3><MapPin size={18} /> {t.contact.addressTitle}</h3>
                  <p>{t.contact.roadAddressLabel}: {location.roadAddress}</p>
                  <p>{t.contact.lotAddressLabel}: {location.lotAddress}</p>
                </section>
                <section>
                  <h3><Train size={18} /> {t.contact.subwayTitle}</h3>
                  <ul>
                    {location.subway.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3><Car size={18} /> {t.contact.drivingTitle}</h3>
                  <p>{location.parking}</p>
                </section>
              </div>

              <details className="location-bus">
                <summary>
                  <span><Bus size={18} /> {t.contact.busTitle}</span>
                  <span className="location-bus-toggle">
                    <strong>
                      {locale === "ko"
                        ? `${location.busStops.length}${t.contact.busStopsCountLabel}`
                        : `${location.busStops.length} ${t.contact.busStopsCountLabel}`}
                    </strong>
                    <span className="location-bus-toggle-label">
                      <span className="when-closed">{t.contact.busExpandLabel}</span>
                      <span className="when-open">{t.contact.busCollapseLabel}</span>
                    </span>
                    <ChevronDown size={18} />
                  </span>
                </summary>
                <div className="location-bus-table">
                  {location.busStops.map((stop) => (
                    <div className="location-bus-row" key={stop.stop}>
                      <strong>{stop.stop}</strong>
                      <div>
                        {stop.lines.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
