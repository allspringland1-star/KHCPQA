import { internationalDirectors, leadershipGreetings } from "./leadership-localizations";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Globe2,
  GraduationCap,
  Handshake,
  Image,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import {
  defaultLocale,
  isLocale,
  localeLabels,
  type Locale as AppLocale
} from "@/i18n/config";
import { chineseCopy } from "./content-zh-cn";
import { courseZhCnTranslations } from "./course-translations-zh-cn";

export const locales = ["ko", "en", "es", "zh-CN"] as const;
export type Locale = (typeof locales)[number];
export { defaultLocale, isLocale, localeLabels };
type LegacyContentLocale = Exclude<Locale, "zh-CN">;

export const translationStatuses = ["ready", "reviewing", "draft"] as const;
export type TranslationStatus = (typeof translationStatuses)[number];

export const translationStatusLabels: Record<AppLocale, Record<TranslationStatus, string>> = {
  ko: {
    ready: "번역 완료",
    reviewing: "번역 검수 중",
    draft: "번역 준비 중"
  },
  en: {
    ready: "Translation ready",
    reviewing: "Translation under review",
    draft: "Translation in preparation"
  },
  es: {
    ready: "Traducción lista",
    reviewing: "Traducción en revisión",
    draft: "Traducción en preparación"
  },
  "zh-CN": {
    ready: "翻译完成",
    reviewing: "翻译审核中",
    draft: "翻译准备中"
  }
};

export const pageTranslationStatus: Record<AppLocale, TranslationStatus> = {
  ko: "ready",
  en: "reviewing",
  es: "reviewing",
  "zh-CN": "reviewing"
};

export function getTranslationStatus(locale: string): TranslationStatus {
  return pageTranslationStatus[isLocale(locale) ? locale : defaultLocale];
}

export function getTranslationStatusLabel(locale: AppLocale, status: TranslationStatus) {
  return translationStatusLabels[locale][status];
}

export const navItems = [
  { key: "about", href: "about" },
  { key: "curriculum", href: "curriculum" },
  { key: "activities", href: "activities" },
  { key: "partner", href: "partner-inquiry" },
  { key: "contact", href: "contact" }
] as const;

export const headerNavItems = navItems.filter((item) => item.key !== "contact" && item.key !== "partner");

type FeatureCopy = {
  title: string;
  body: string;
};

type GreetingCopy = {
  name: string;
  role: string;
  meta?: string;
  imageUrl: string;
  paragraphs: string[];
  contact?: string;
};

type InstructorCopy = {
  name: string;
  role: string;
  imageUrl: string;
  profileImageUrl: string;
};

type AboutSubnavItem = {
  key: string;
  title: string;
  href?: string;
  disabled?: boolean;
};

export type Copy = {
  brand: string;
  brandFull: string;
  nav: Record<(typeof navItems)[number]["key"] | "login", string>;
  heroBadge: string;
  heroTitle: string;
  heroLead: string;
  primaryCta: string;
  secondaryCta: string;
  secureCta: string;
  trustTitle: string;
  curriculumTitle: string;
  activitiesTitle: string;
  pageReady: string;
  accountTitle: string;
  adminTitle: string;
  formSubmit: string;
  menuOpen: string;
  menuClose: string;
  a11y: {
    homeLink: string;
    primaryNavigation: string;
    mobileNavigation: string;
    languageSwitcher: string;
    socialLinks: string;
    accountNavigation: string;
    aboutNavigation: string;
  };
  layout: {
    consultCta: string;
    footerLead: string;
    customerCenter: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    address: string;
    sitemap: string;
  };
  seo: {
    title: string;
    description: string;
  };
  home: {
    heroImageAlt: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroTitleSuffix: string;
    heroFloatingTitle: string;
    heroFloatingLead: string;
    platformEyebrow: string;
    platformLead: string;
    learnMore: string;
    viewCurriculum: string;
    platformFeatures: FeatureCopy[];
    curriculumEyebrow: string;
    curriculumLead: string;
    activitiesEyebrow: string;
    activitiesLead: string;
    viewAll: string;
    viewDetails: string;
    certificationEyebrow: string;
    certificationTitle: string;
    certificationLead: string;
    certificationCta: string;
    certificateLabel: string;
    onlineInquiry: string;
    featuredCoursesTitle: string;
    featuredCoursesLead: string;
    reasonsTitle: string;
    reasons: FeatureCopy[];
    supportTitle: string;
    supportPrograms: Array<FeatureCopy & { image: string }>;
    noticesTitle: string;
    moreCta: string;
    notices: string[];
    scheduleTitle: string;
    schedules: Array<{ label: string; time: string }>;
    consultTitle: string;
    consultLead: string;
    consultCta: string;
    finalKicker: string;
    finalTitle: string;
    finalCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    greetingCta: string;
    features: FeatureCopy[];
  };
  aboutSubnav: AboutSubnavItem[];
  greetingPage: {
    eyebrow: string;
    title: string;
    lead: string;
    greetings: GreetingCopy[];
  };
  instructorsPage: {
    eyebrow: string;
    title: string;
    lead: string;
    instructors: InstructorCopy[];
  };
  historyPage: {
    eyebrow: string;
    title: string;
    lead: string;
    imageAlt: string;
    yearsLabel: string;
    timelineLabel: string;
    detailNote: string;
    dateLabel: string;
    titleLabel: string;
  };
  organizationPage: {
    eyebrow: string;
    title: string;
    lead: string;
    imageAlt: string;
    units: Array<{ title: string; body: string }>;
  };
  curriculumPage: {
    eyebrow: string;
    lead: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    massageProgramsLabel: string;
  };
  courseDetail: {
    inquiryCta: string;
    allCoursesCta: string;
    overviewEyebrow: string;
    overviewTitle: string;
    curriculumEyebrow: string;
    curriculumTitle: string;
    goalOverviewTitle: string;
    goalPlanTitle: string;
    goalOutcomeTitle: string;
    durationTitle: string;
    detailGroupTraining: string;
    detailGroupCareer: string;
    detailGroupSchedule: string;
    midCtaTitle: string;
    midCtaLead: string;
    sideSummaryTitle: string;
    audienceTitle: string;
    certificationTitle: string;
    sourceTitle: string;
    metricProgramTypeLabel: string;
    metricDurationLabel: string;
    metricLearningLabel: string;
    metricDurationFallback: string;
    metricLearningFallback: string;
    learningGoalsTitle: string;
    programStrengthsTitle: string;
    recommendedForTitle: string;
    featureHighlights: string[];
    coreTechniquesTitle: string;
    classProcessTitle: string;
    summaryEyebrow: string;
    summaryTitle: string;
    summaryLead: string;
    advancedEyebrow: string;
    advancedTitle: string;
    advancedLead: string;
    afterCompletionTitle: string;
    careerItems: string[];
    landingCtaEyebrow: string;
  };
  activitiesPage: {
    eyebrow: string;
    lead: string;
    detailEyebrow: string;
    latestPostsTitle: string;
    managedContentTitle: string;
    sourceLabel: string;
    statusLabel: string;
    managedStatus: string;
    allActivitiesCta: string;
    detailCta: string;
  };
  contact: {
    eyebrow: string;
    lead: string;
    callCta: string;
    mapCta: string;
    nearestStationLabel: string;
    mainPhoneLabel: string;
    parkingLabel: string;
    mapAltSuffix: string;
    addressTitle: string;
    roadAddressLabel: string;
    lotAddressLabel: string;
    subwayTitle: string;
    drivingTitle: string;
    busTitle: string;
    busStopsCountLabel: string;
    busExpandLabel: string;
    busCollapseLabel: string;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
    eyebrow: string;
    lead: string;
    pendingTitle: string;
    pendingBody: string;
    requiredItems: string[];
  };
  partnerInquiry: {
    eyebrow: string;
    lead: string;
    successTitle: string;
    successMessage: string;
    receiptLabel: string;
    submittedSummaryTitle: string;
    nextStepTitle: string;
    nextSteps: string[];
    validation: {
      required: string;
      email: string;
      consent: string;
    };
    fields: {
      name: string;
      namePlaceholder: string;
      organization: string;
      organizationPlaceholder: string;
      email: string;
      emailPlaceholder: string;
      country: string;
      countryPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      consent: string;
    };
  };
  login: {
    eyebrow: string;
    lead: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    submitCta: string;
    forgotPassword: string;
    backToLogin: string;
    resetCta: string;
    note: string;
    successTitle: string;
    successMessage: string;
    resetSuccessTitle: string;
    resetSuccessMessage: string;
    configurationError: string;
    rateLimitError: string;
    validation: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      passwordLength: string;
    };
  };
  signup: {
    eyebrow: string;
    title: string;
    lead: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    country: string;
    countryPlaceholder: string;
    interestedCourse: string;
    interestedCoursePlaceholder: string;
    marketingConsent: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    consent: string;
    submitCta: string;
    loginCta: string;
    note: string;
    successTitle: string;
    successMessage: string;
    configurationError: string;
    rateLimitError: string;
    existingAccountError: string;
    validation: {
      required: string;
      email: string;
      passwordLength: string;
      passwordMatch: string;
      consent: string;
    };
  };
  account: {
    eyebrow: string;
    lead: string;
    overviewTitle: string;
    overviewLead: string;
    profileStatus: {
      ready: string;
      empty: string;
    };
    countSuffix: string;
    noindexStatus: string;
    nav: Array<{
      title: string;
      href: string;
      description: string;
    }>;
    profile: {
      title: string;
      lead: string;
      editTitle: string;
      editLead: string;
      saveCta: string;
      successTitle: string;
      successMessage: string;
      validation: {
        required: string;
        email: string;
      };
      fields: Array<{
        label: string;
        value: string;
      }>;
    };
    certifications: {
      title: string;
      lead: string;
      lookupTitle: string;
      lookupLead: string;
      numberLabel: string;
      numberPlaceholder: string;
      verificationCodeLabel: string;
      verificationCodePlaceholder: string;
      issuedLabel: string;
      statusLabel: string;
      courseLabel: string;
      lookupCta: string;
      lookupSuccessTitle: string;
      lookupEmptyTitle: string;
      lookupEmptyMessage: string;
      demoHint: string;
      emptyState: string;
      emptyGuide: string;
    };
    inquiries: {
      title: string;
      lead: string;
      allLabel: string;
      receiptLabel: string;
      typeLabel: string;
      messageLabel: string;
      emptyState: string;
      statusLabel: string;
      submittedLabel: string;
      items: Array<{
        receipt: string;
        title: string;
        type: string;
        message: string;
        submittedAt: string;
        status: string;
      }>;
    };
    modules: FeatureCopy[];
    certificates: Array<{
      title: string;
      number: string;
      issuedAt: string;
      status: string;
      verificationCode: string;
    }>;
  };
  curriculumCatalog: {
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    categories: Record<CourseCategory, string>;
    goalTitle: string;
    goalLead: string;
    catalogTitle: string;
    catalogLead: string;
    emptyState: string;
    viewDetails: string;
    courseCountLabel: string;
    consultAriaLabel: string;
    consultTitle: string;
    consultLead: string;
    consultCta: string;
  };
};

export type CourseCategory = "all" | "certification" | "professional" | "practical";

export const copy = {
  "zh-CN": chineseCopy,
  ko: {
    brand: "KAHC",
    brandFull: "The Korea Association for Health & Beauty Certification",
    nav: {
      about: "협회 소개",
      curriculum: "교육과정",
      activities: "커뮤니티",
      partner: "파트너 문의",
      contact: "찾아오시는 길",
      login: "로그인"
    },
    heroBadge: "취업의 시작, 전문 교육의 중심",
    heroTitle: "당신의 기술이 미래가 되는 곳",
    heroLead:
      "실무 중심 교육으로 전문 관리사를 양성하고,\n취업과 창업까지 함께 지원합니다.",
    primaryCta: "교육과정 둘러보기",
    secondaryCta: "파트너 문의",
    secureCta: "로그인 후 자격 조회",
    trustTitle: "교육부터 취업과 창업까지 이어지는 지원",
    curriculumTitle: "교육과정 한눈에 보기",
    activitiesTitle: "커뮤니티",
    pageReady: "번역 및 콘텐츠 검수 상태를 관리자에서 관리합니다.",
    accountTitle: "마이페이지",
    adminTitle: "관리자 대시보드",
    formSubmit: "문의 저장",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
    a11y: {
      homeLink: "KAHC 홈",
      primaryNavigation: "주요 메뉴",
      mobileNavigation: "모바일 메뉴",
      languageSwitcher: "언어 선택",
      socialLinks: "소셜 링크",
      accountNavigation: "회원 메뉴",
      aboutNavigation: "협회 소개 하위 메뉴"
    },
    layout: {
      consultCta: "상담문의",
      footerLead: "체계적인 교육과 취업·창업 지원을 연결하는\n프리미엄 전문 교육 플랫폼입니다.",
      customerCenter: "고객센터",
      phoneLabel: "전화",
      emailLabel: "이메일",
      addressLabel: "주소",
      address: "서울특별시 강남구 테헤란로 123, 5층",
      sitemap: "사이트맵"
    },
    seo: {
      title: "KAHC 글로벌 전문 자격 교육",
      description: "한국 기반 헬스케어·뷰티 전문 자격 교육, 과정 안내, 커뮤니티, 파트너 문의를 제공하는 KAHC 플랫폼입니다."
    },
    home: {
      heroImageAlt: "글로벌 전문 교육을 상징하는 KAHC 교육생과 전문가 이미지",
      heroTitlePrefix: "전문 교육으로",
      heroTitleHighlight: "커리어",
      heroTitleSuffix: "를 완성하세요",
      heroFloatingTitle: "국가공인 민간자격 교육기관",
      heroFloatingLead: "체계적인 교육과정을 통해 전문 자격 취득을 지원합니다.",
      platformEyebrow: "지원 프로그램",
      platformLead:
        "교육생의 목적에 맞춰 상담, 과정 설계, 실무 훈련, 취업·창업 지원을 한 흐름으로 연결합니다.",
      learnMore: "자세히 보기",
      viewCurriculum: "커리큘럼 보기",
      platformFeatures: [
        {
          title: "1:1 취업 상담",
          body: "전문 상담사와 함께 목표 분야와 현재 역량을 확인하고 맞춤 과정을 설계합니다."
        },
        {
          title: "취업 연계 시스템",
          body: "현장 실무에 필요한 기술과 고객 응대 역량을 함께 훈련해 취업 가능성을 높입니다."
        },
        {
          title: "창업 컨설팅",
          body: "1인 창업과 샵 운영을 준비하는 교육생에게 과정 조합과 운영 방향을 안내합니다."
        }
      ],
      curriculumEyebrow: "커리큘럼",
      curriculumLead: "현장 경험이 풍부한 강사진과 체계적인 커리큘럼으로 전문 기술 성장을 돕습니다.",
      activitiesEyebrow: "커뮤니티",
      activitiesLead: "공지, 합격 현황, 갤러리, 국제 활동을 커뮤니티에서 한눈에 확인할 수 있도록 연결합니다.",
      viewAll: "전체 보기",
      viewDetails: "상세 보기",
      certificationEyebrow: "자격 조회",
      certificationTitle: "자격 취득 내역을 로그인 후 확인하세요.",
      certificationLead:
        "개인별 자격 상태, 수료 기록, 발급 정보를 안전한 계정 영역에서 조회할 수 있게 확장합니다.",
      certificationCta: "자격 조회하기",
      certificateLabel: "자격 검증",
      onlineInquiry: "온라인 문의",
      featuredCoursesTitle: "주요 교육과정",
      featuredCoursesLead: "현장에서 바로 활용 가능한 실무 중심 교육과정",
      reasonsTitle: "KAHC가 특별한 이유",
      reasons: [
        { title: "현장 중심 실무 교육", body: "실무 위주의 커리큘럼으로 현장에서 바로 활용 가능합니다." },
        { title: "전문 강사진", body: "풍부한 현장 경험을 갖춘 전문 강사진이 핵심을 교육합니다." },
        { title: "취·창업 연계", body: "다양한 네트워크와 연계해 취·창업을 적극 지원합니다." },
        { title: "1:1 맞춤 상담", body: "개인의 목표와 상황에 맞춘 성장 로드맵을 설계합니다." }
      ],
      supportTitle: "취업 & 창업 지원 서비스",
      supportPrograms: [
        { title: "1:1 취업 상담", body: "전문 상담사와 1:1 상담을 통해 맞춤형 취업 전략을 제안합니다.", image: "/assets/support-career-consulting-v2.png" },
        { title: "취업 연계 시스템", body: "전국의 우수 협력 네트워크를 통한 취업 연계 서비스를 제공합니다.", image: "/assets/support-job-network-v2.png" },
        { title: "창업 컨설팅", body: "창업 준비부터 오픈까지 전문 컨설팅을 지원합니다.", image: "/assets/support-startup-consulting-v2.png" },
        { title: "마케팅 지원", body: "홍보, 브랜딩, SNS 마케팅 등 실무적인 마케팅을 지원합니다.", image: "/assets/support-marketing-v2.png" }
      ],
      noticesTitle: "공지사항",
      moreCta: "더보기",
      notices: [
        "2024년 6월 교육과정 개강 안내",
        "아로마 테라피 특강 안내",
        "여름 맞이 피부관리 이벤트",
        "5월 자격시험 일정 안내",
        "취업 박람회 참가 안내"
      ],
      scheduleTitle: "강의시간 안내",
      schedules: [
        { label: "주간반", time: "월~금 10:00 - 14:00" },
        { label: "야간반", time: "월~금 19:00 - 22:00" },
        { label: "주말반", time: "토요일 10:00 - 16:00" },
        { label: "취미반", time: "화, 목 14:00 - 16:00" }
      ],
      consultTitle: "지금 상담받고\n당신의 꿈을 시작하세요",
      consultLead: "전문 상담사가 친절하게 안내해 드립니다.",
      consultCta: "상담 신청하기",
      finalKicker: "첫걸음이 당신의 미래를 바꿉니다 ✣",
      finalTitle: "지금 바로 상담 신청하고, 꿈을 현실로 만드세요!",
      finalCta: "상담 신청하기"
    },
    about: {
      eyebrow: "KAHC 소개",
      title: "한국건강관리사자격협회\nKAHC 소개",
      lead: "",
      greetingCta: "인사말 보기",
      features: [
        {
          title: "국가자격증 합격과 맞춤형 교육",
          body: "건강미용 산업의 성장에 맞춰 글로벌 시대와 스마트 시대에 앞선 교육을 진행합니다. 국가자격증 시험 합격을 목표로 효율적인 수업을 운영하고, 자격증 취득 노하우 영상과 수강생 맞춤형 지도를 통해 체계적인 학습을 제공합니다. 풍부한 경험을 갖춘 전임 강사진이 자격증 합격자를 원활하게 배출할 수 있도록 준비되어 있습니다."
        },
        {
          title: "취업을 위한 실무 중심 교육",
          body: "수강생들의 취업을 돕기 위해 건강미용 산업 트렌드에 앞선 기술과 취업교육 체계를 마련했습니다. SMC만의 전문 기술과 실무 위주의 교육 프로그램을 바탕으로 기초부터 전문가 과정까지 이해하기 쉽게 교육하며, 상담과 교류를 통해 원하는 취업 방향에 맞는 지원을 제공합니다."
        },
        {
          title: "문제 해결 학습 PSL",
          body: "주입식 이론교육에서 벗어나 실무를 중심으로 원리와 이론을 자연스럽게 익히는 실습 지향 문제 해결 학습을 도입했습니다. 수강생은 고객의 입장을 체험하는 모델과 실무 관리사의 입장을 체험하는 시술자로 함께 실습하며, 단계적으로 실력을 높이는 맞춤식 교육을 받습니다."
        },
        {
          title: "목표 달성을 위한 단계 교육",
          body: "수강생이 목적을 가지고 목표를 달성할 수 있도록 단계적인 실무교육, 소양교육, 예절교육을 진행합니다. 전임 강사진은 바른 실무 지도와 마음가짐을 함께 전달하며, 서비스 교육과 고객 관리 방법까지 교육해 자격증 취득, 취업, 대입, 창업으로 이어질 수 있도록 지원합니다."
        },
        {
          title: "만족도 10의 교육 시스템",
          body: "수강생이 1에서 10까지 평가했을 때 10을 받을 수 있는 교육을 목표로 수업의 질과 깊이를 높입니다. 전임강사의 밀착형 담당 지도, 요구사항 점검, 체계적인 조직 관리를 통해 지도부터 접수, 취업, 창업까지 지원하며 수강생과 꾸준히 소통하는 만족도 높은 교육을 지향합니다."
        }
      ]
    },
    aboutSubnav: [
      { key: "intro", title: "소개", href: "about" },
      { key: "greeting", title: "인사말", href: "about/greeting" },
      { key: "instructors", title: "국제 디렉터", href: "about/instructors" },
      { key: "history", title: "연혁", href: "about/history" },
      { key: "organization", title: "조직도", href: "about/organization" }
    ],
    greetingPage: {
      eyebrow: "인사말",
      title: "협회 인사말",
      lead: "",
      greetings: [
        {
          name: "봉성종",
          role: "한국건강관리사자격협회 국제 협회장",
          imageUrl: "/assets/greeting-bong-seongjong-smiling.jpg",
          paragraphs: [
            "한국건강관리사자격협회는 건강·미용·웰니스 산업의 지속적인 발전과 글로벌 교육 교류 활성화를 목표로 다양한 교육 프로그램과 국제 협력 시스템을 구축해 나가고 있습니다.",
            "최근 K-Beauty와 K-Wellness 산업은 세계적으로 높은 관심과 성장 가능성을 인정받고 있으며, 이에 발맞추어 저희 협회는 국제적인 교육 네트워크와 전문 인재 양성을 위한 체계적인 시스템을 운영하고 있습니다. 단순한 기술 교육을 넘어 실무와 글로벌 경쟁력을 함께 갖춘 전문 인재를 양성할 수 있도록 지속적으로 교육 환경을 발전시키고 있습니다.",
            "또한 국내외 다양한 기관 및 협회와의 협력을 통해 글로벌 교류 시스템을 확대하고 있으며, 회원 여러분들이 현재의 성장에서 나아가 미래의 경쟁력을 갖출 수 있도록 함께 성장하는 협회가 되고자 노력하고 있습니다.",
            "한국건강관리사자격협회는 앞으로도 새로운 가능성과 미래 가치를 창출할 수 있는 교육 프로그램을 지속적으로 개발하며, 국제 교육기관으로서의 역할과 책임에 최선을 다하겠습니다. 회원 여러분들의 자부심이 될 수 있는 기관, 그리고 세계와 함께 성장하는 글로벌 협회로 자리매김할 수 있도록 끊임없이 발전해 나가겠습니다.",
            "많은 관심과 성원 부탁드립니다."
          ]
        },
        {
          name: "황인근",
          role: "한국건강관리사자격협회 한국 협회장",
          imageUrl: "/assets/greeting-hwang-ingeun-chairman.jpg",
          paragraphs: [
            "한국건강관리사자격협회 협회장 황인근입니다.",
            "저희 협회는 한류의 힘입어 무한한 성장 잠재력을 보유한 대체의학, 서비스산업 발전에 발맞추어 건강 미용산업계의 신교육의 시너지효과를 창출해낼 수 있도록 시스템화되어 있습니다.",
            "또한, 수강생 여러분의 현재부터 미래로 발전할 수 있도록 함께 협력하여 상부상조할 수 있도록 교류 시스템을 확보하였습니다.",
            "지속적인 성장을 위해 세계 수준의 완벽한 교육시스템으로 체계적인 조직 관리를 통해 맡은 역할에 충실할것이며, 수강생들의 노력에 받쳐줄 수 있는 기둥이 되어 안정된 솔루션을 세워 성공의 길로 인도하겠습니다.",
            "한국건강관리사자격협회에서는 새로운 가능성의 프로그램을 지속적으로 개발하여 회원 여러분들과 함께 동반성장을 목표로 운영하고 있으며 교육의 선구자로써 방향을 제시할 수 있도록 성장할 것입니다.",
            "또한, 회원 여러분들의 자부심이 되어 최고의 기술, 일류의 교육기관으로써 자리매김할 것입니다.",
            "형식 위주의 교육이 아닌 분명한 목표의식을 갖춘 기관으로 기대에 뒷받침되어 여러분들과 함께 성장할 것입니다."
          ]
        },
        {
          name: "문순영",
          role: "한국건강관리사자격협회 부회장 / 서울총본부 본원 원장",
          imageUrl: "/assets/greeting-moon-soonyoung.jpg",
          paragraphs: [
            "한국건강관리사자격협회 서울총본부는 지하철 1, 3, 5호선이 환승되는 종로3가역 인근, 교통이 편리한 서울 중심지에 위치하고 있습니다.",
            "전문 피부미용사, 네일미용사, 메이크업미용사, 헤어미용사, 마사지사로 취업과 창업을 준비한다면 처음 학원 선택이 중요합니다. 서울총본부는 국가기술자격 이론과 실기 교육은 물론 현장 실무용 살롱테크닉, 메디컬 스킨케어, 아로마, 경락, 스포츠, 발 마사지까지 기초부터 전문가 과정까지 체계적으로 교육합니다.",
            "수강생의 자부심과 실력이 최고가 되어야 한다는 생각으로 일류 기술 교육을 지향하며, 수강생들이 이루고자 하는 꿈을 반드시 이룰 수 있도록 지도하고 양성합니다."
          ]
        },
        {
          name: "황유진",
          role: "대림캠퍼스 원장",
          meta: "Skin-care Management Consultant",
          imageUrl: "/assets/greeting-hwang-yujin.jpg",
          paragraphs: [
            "한국건강관리사자격협회 대림캠퍼스는 지하철 2, 7호선이 환승되는 대림역 12번 출구 1분 거리에 위치해 교통이 매우 편리하며, 넓고 쾌적한 교육 환경을 제공합니다.",
            "대림캠퍼스는 피부미용사, 네일아트미용사, 헤어미용사, 전문 마사지사의 취업과 창업에 필요한 국가자격증 단기 속성 교육과 취업 실무 교육을 운영합니다. 피부관리와 마사지 교육뿐 아니라 전문관리사가 갖춰야 할 기본 소양교육과 예절교육도 철저히 진행합니다.",
            "핵심과 요약을 접목한 1~2개월 단기 특수교육을 통해 많은 수강생이 단기간에 피부미용사 국가자격증을 취득하고 있습니다. 졸업생들이 다양한 현장에서 자신감을 가지고 활동하듯, 대림캠퍼스에서 공부하고 전문관리사로 성공하시기를 기원합니다."
          ]
        },
        {
          name: "이용호",
          role: "강남마사지교육원 교육부장",
          imageUrl: "/assets/greeting-lee-yongho.jpg",
          paragraphs: [
            "강남마사지교육원은 대림역 12번 출구 1분 거리에 위치한 마사지 전문 교육원입니다. 국제화 시대와 서비스 산업 발전에 맞춰 스포츠마사지, 경락마사지, 피부마사지, 발마사지 교육을 진행합니다.",
            "피부관리실, 스파, 마사지샵, 호텔, 사우나 등 취업 알선과 창업 상담, 해외취업 추천 및 유학 컨설팅까지 지원하며, 국내외에서 인정받는 기술력과 체계적인 교육으로 높은 취업률을 지향합니다.",
            "취업을 원하는 수강생에게는 일대일 개인상담을 통해 적성, 희망 근무처, 근무시간, 보수, 지역 등을 파악하고 적합한 취업처를 최대한 빠르게 연결합니다. 마사지 전문관리사 취업과 창업을 준비하는 분들을 성심껏 상담하겠습니다."
          ]
        }
      ]
    },
    instructorsPage: {
      eyebrow: "국제 디렉터",
      title: "국제 디렉터",
      lead: "",
      instructors: [
        { name: "김승철", role: "국제 디렉터 · 몽골", imageUrl: "/assets/instructor-profile-kim-moonsun.jpg", profileImageUrl: "/assets/instructor-profile-kim-moonsun.jpg" },
        { name: "유정원", role: "국제 디렉터 · 프랑스", imageUrl: "/assets/instructor-profile-yoon-euneun.jpg", profileImageUrl: "/assets/instructor-profile-yoon-euneun.jpg" },
        { name: "김성권", role: "국제 디렉터 · 대만", imageUrl: "/assets/instructor-profile-kim-haerim.jpg", profileImageUrl: "/assets/instructor-profile-kim-haerim.jpg" },
        { name: "이용호", role: "국제 디렉터 · 베트남, 태국", imageUrl: "/assets/instructor-lee-yongho.jpg", profileImageUrl: "/assets/instructor-profile-lee-yongho.jpg" }
      ]
    },
    historyPage: {
      eyebrow: "연혁",
      title: "KAHC 연혁",
      lead: "",
      imageAlt: "SMC아카데미 연혁 대표 이미지",
      yearsLabel: "연도 선택",
      timelineLabel: "연도별 주요 연혁",
      detailNote: "원본 연혁자료의 연도별 항목을 기준으로 정리했습니다.",
      dateLabel: "년월",
      titleLabel: "제목"
    },
    organizationPage: {
      eyebrow: "조직도",
      title: "KAHC 조직도",
      lead: "",
      imageAlt: "한국건강관리사자격협회 SMC아카데미 조직도",
      units: [
        { title: "국제협회장", body: "글로벌 교육 교류와 국제 협력 방향을 총괄합니다." },
        { title: "협회 운영", body: "한국건강관리사자격협회를 중심으로 교육, 자격, 지부 운영 체계를 관리합니다." },
        { title: "교육 운영", body: "SMC아카데미와 각 캠퍼스가 자격증 교육과 실무 교육을 담당합니다." },
        { title: "현장 지원", body: "수강 상담, 취업·창업 지원, 대외 행사와 협력 활동을 연결합니다." }
      ]
    },
    curriculumPage: {
      eyebrow: "커리큘럼",
      lead: "건강미용 분야의 목표와 수준에 맞춰 선택할 수 있는 전문 교육과정입니다.",
      heroTitlePrefix: "내 목표에 맞는",
      heroTitleHighlight: "전문 과정",
      massageProgramsLabel: "마사지 과정"
    },
    courseDetail: {
      inquiryCta: "문의하기",
      allCoursesCta: "전체 과정 보기",
      overviewEyebrow: "개요",
      overviewTitle: "과정 개요",
      curriculumEyebrow: "커리큘럼",
      curriculumTitle: "주요 교육 내용",
      goalOverviewTitle: "목표별 과정 개요",
      goalPlanTitle: "목표 달성 학습 설계",
      goalOutcomeTitle: "상담 및 진로 안내",
      durationTitle: "교육 기간",
      detailGroupTraining: "교육과정 구성",
      detailGroupCareer: "취업 및 수익 안내",
      detailGroupSchedule: "수강 안내",
      midCtaTitle: "내 목표에 맞는 과목 조합 상담",
      midCtaLead: "취업 희망 분야와 현재 역량에 맞춰 필요한 과목과 수강 순서를 상담합니다.",
      sideSummaryTitle: "상담 요약",
      audienceTitle: "교육 대상",
      certificationTitle: "수료/자격 안내",
      sourceTitle: "원본 URL",
      metricProgramTypeLabel: "과정 유형",
      metricDurationLabel: "교육 기간",
      metricLearningLabel: "수업 방식",
      metricDurationFallback: "상담 후 안내",
      metricLearningFallback: "이론 + 실습",
      learningGoalsTitle: "교육 목표",
      programStrengthsTitle: "이 과정의 특징",
      recommendedForTitle: "이런 분께 추천해요!",
      featureHighlights: [
        "1:1 소수정예 맞춤 피드백",
        "실습 중심 교육 현장감 있는 수업",
        "전문 강사진 현업 경험 보유",
        "자격취득 지원 수료증 & 시험 안내"
      ],
      coreTechniquesTitle: "핵심 테크닉 한눈에 보기",
      classProcessTitle: "관리 순서 (수업 프로세스)",
      summaryEyebrow: "과정 요약",
      summaryTitle: "핵심 교육 포인트",
      summaryLead: "수업 목표, 추천 대상, 주요 테크닉과 진로 방향을 먼저 확인할 수 있도록 정리했습니다.",
      advancedEyebrow: "심화 과정",
      advancedTitle: "깊이 있게 배우는 상세 커리큘럼",
      advancedLead: "이론, 실습, 관리 원리와 진로 활용까지 단계별로 확인할 수 있습니다.",
      afterCompletionTitle: "수료 후 진로 및 활용",
      careerItems: [
        "전문 샵 취업",
        "1인 창업",
        "스파 & 호텔 취업",
        "뷰티 프리랜서",
        "추가 심화 연계"
      ],
      landingCtaEyebrow: "전문 테크닉으로 완성하는"
    },
    activitiesPage: {
      eyebrow: "커뮤니티",
      lead: "공지, 합격현황, 갤러리, 수상경력, 국제미용대회, 대기업 초청이벤트, 방송/언론, 봉사활동, 수강생 후기를 한곳에서 확인합니다.",
      detailEyebrow: "커뮤니티",
      latestPostsTitle: "최근 게시글",
      managedContentTitle: "운영 콘텐츠",
      sourceLabel: "원본 출처",
      statusLabel: "게시 상태",
      managedStatus: "관리자 등록 콘텐츠",
      allActivitiesCta: "전체 활동 보기",
      detailCta: "상세 보기"
    },
    contact: {
      eyebrow: "찾아오시는 길",
      lead: "서울총본부, 강남SMC아카데미, 대림캠퍼스의 주소와 지하철·버스 이용 안내입니다.",
      callCta: "전화하기",
      mapCta: "지도 열기",
      nearestStationLabel: "가까운 역",
      mainPhoneLabel: "대표 전화",
      parkingLabel: "주차",
      mapAltSuffix: "약도",
      addressTitle: "주소",
      roadAddressLabel: "도로명주소",
      lotAddressLabel: "지번주소",
      subwayTitle: "지하철 이용",
      drivingTitle: "자가용 이용",
      busTitle: "버스 이용",
      busStopsCountLabel: "개 정류장",
      busExpandLabel: "펼쳐보기",
      busCollapseLabel: "접기"
    },
    legal: {
      privacyTitle: "개인정보처리방침",
      termsTitle: "이용약관",
      eyebrow: "법무 문서",
      lead: "최종 원문 확보 전 검수용 페이지입니다. 실제 공개 전 발주사 제공 원문과 법무 검토본으로 교체해야 합니다.",
      pendingTitle: "최종 원문 확보 필요",
      pendingBody: "현재 페이지는 링크 구조와 노출 위치를 확인하기 위한 검수용 안내입니다. 개인정보처리방침과 이용약관 원문은 실제 운영 정책에 맞춰 확정해야 합니다.",
      requiredItems: [
        "개인정보 수집 항목 및 이용 목적",
        "보유 및 이용 기간",
        "제3자 제공 및 처리 위탁 여부",
        "회원 탈퇴와 권리 행사 방법",
        "서비스 이용 제한 및 책임 범위"
      ]
    },
    partnerInquiry: {
      eyebrow: "파트너 문의",
      lead: "해외 기관, 교육 파트너, 교육생 문의를 관리자 문의함으로 저장하는 폼입니다. 이메일/문자 자동 발송은 1차 범위에서 제외합니다.",
      successTitle: "문의가 접수되었습니다.",
      successMessage: "관리자 문의함에 접수되었습니다. 담당자가 내용을 확인한 뒤 처리 상태를 업데이트합니다.",
      receiptLabel: "접수번호",
      submittedSummaryTitle: "접수 요약",
      nextStepTitle: "관리자 처리 흐름",
      nextSteps: [
        "관리자 문의함에 신규 문의로 표시",
        "담당자가 유형과 우선순위를 확인",
        "처리 상태와 담당자 메모 저장"
      ],
      validation: {
        required: "필수 항목을 입력해 주세요.",
        email: "올바른 이메일 주소를 입력해 주세요.",
        consent: "개인정보 수집 및 문의 처리에 동의해 주세요."
      },
      fields: {
        name: "이름",
        namePlaceholder: "이름을 입력하세요",
        organization: "기관/회사",
        organizationPlaceholder: "기관 또는 회사명",
        email: "이메일",
        emailPlaceholder: "name@example.com",
        country: "국가",
        countryPlaceholder: "국가",
        message: "문의 내용",
        messagePlaceholder: "파트너십 관심 분야를 알려주세요",
        consent: "개인정보 수집 및 문의 처리에 동의합니다."
      }
    },
    login: {
      eyebrow: "보안 로그인",
      lead: "회원 전용 My Page와 자격 조회를 이용하려면 로그인해 주세요.",
      email: "이메일",
      emailPlaceholder: "name@example.com",
      password: "비밀번호",
      passwordPlaceholder: "비밀번호",
      submitCta: "로그인",
      forgotPassword: "비밀번호를 잊으셨나요?",
      backToLogin: "로그인으로 돌아가기",
      resetCta: "비밀번호 재설정 안내 받기",
      note: "로그인 후 My Page에서 프로필, 자격 조회, 문의 내역을 확인할 수 있습니다.",
      successTitle: "로그인되었습니다.",
      successMessage: "잠시 후 권한에 맞는 화면으로 이동합니다.",
      resetSuccessTitle: "재설정 안내를 보냈습니다.",
      resetSuccessMessage: "입력하신 이메일로 비밀번호 재설정 안내를 보냈습니다.",
      configurationError: "로그인 설정이 아직 연결되지 않았습니다. 관리자에게 문의해 주세요.",
      rateLimitError: "비밀번호 재설정 메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.",
      validation: {
        emailRequired: "이메일을 입력해 주세요.",
        emailInvalid: "올바른 이메일 주소를 입력해 주세요.",
        passwordRequired: "비밀번호를 입력해 주세요.",
        passwordLength: "비밀번호는 8자 이상 입력해 주세요."
      }
    },
    signup: {
      eyebrow: "회원가입",
      title: "회원가입",
      lead: "자격 조회와 문의 내역 확인을 위한 계정을 생성합니다.",
      name: "이름",
      namePlaceholder: "이름을 입력하세요",
      email: "이메일",
      emailPlaceholder: "name@example.com",
      phone: "휴대폰",
      phonePlaceholder: "010-0000-0000",
      country: "국가",
      countryPlaceholder: "국가 선택",
      interestedCourse: "관심 과정",
      interestedCoursePlaceholder: "관심 과정을 선택하세요",
      marketingConsent: "교육/상담 안내 수신에 동의합니다.",
      password: "비밀번호",
      passwordPlaceholder: "8자 이상",
      confirmPassword: "비밀번호 확인",
      confirmPasswordPlaceholder: "비밀번호를 다시 입력하세요",
      consent: "개인정보 수집 및 회원 계정 생성에 동의합니다.",
      submitCta: "회원가입",
      loginCta: "이미 계정이 있으신가요?",
      note: "회원가입은 공개 가입 방식으로 운영됩니다. 이메일 확인이 필요한 경우 받은 편지함의 확인 링크를 눌러 주세요.",
      successTitle: "회원가입 신청이 완료되었습니다.",
      successMessage: "입력하신 이메일로 확인 메일을 보냈습니다. 메일 안의 링크를 눌러 가입을 완료해 주세요.",
      configurationError: "회원가입 설정이 아직 연결되지 않았습니다. 관리자에게 문의해 주세요.",
      rateLimitError: "이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해 주세요.",
      existingAccountError: "이미 가입된 이메일입니다. 로그인하거나 비밀번호 재설정을 이용해 주세요.",
      validation: {
        required: "필수 항목을 입력해 주세요.",
        email: "올바른 이메일 주소를 입력해 주세요.",
        passwordLength: "비밀번호는 8자 이상 입력해 주세요.",
        passwordMatch: "비밀번호가 일치하지 않습니다.",
        consent: "개인정보 수집 및 회원 계정 생성에 동의해 주세요."
      }
    },
    account: {
      eyebrow: "보호된 계정 영역",
      lead: "로그인한 회원만 이용할 수 있는 개인 계정 영역입니다.",
      overviewTitle: "계정 요약",
      overviewLead: "프로필, 자격 조회, 문의 내역을 한 화면에서 확인합니다.",
      profileStatus: {
        ready: "확인됨",
        empty: "미입력"
      },
      countSuffix: "건",
      noindexStatus: "비공개",
      nav: [
        { title: "마이페이지", href: "account", description: "계정 요약" },
        { title: "프로필", href: "account/profile", description: "회원 정보" },
        { title: "자격 조회", href: "account/certifications", description: "자격 취득 조회" },
        { title: "문의 내역", href: "account/inquiries", description: "문의 내역" }
      ],
      profile: {
        title: "프로필",
        lead: "회원 정보를 확인하고 필요한 내용을 수정할 수 있습니다.",
        editTitle: "프로필 수정",
        editLead: "이름, 연락처, 국가, 관심 과정, 선호 언어를 수정할 수 있습니다.",
        saveCta: "저장하기",
        successTitle: "프로필이 저장되었습니다.",
        successMessage: "수정한 회원 정보가 저장되었습니다.",
        validation: {
          required: "필수 항목을 입력해 주세요.",
          email: "올바른 이메일 주소를 입력해 주세요."
        },
        fields: [
          { label: "이름", value: "KHCPQA Demo Member" },
          { label: "이메일", value: "member@example.com" },
          { label: "휴대폰", value: "010-0000-0000" },
          { label: "국가", value: "Korea" },
          { label: "관심 과정", value: "피부미용사 국가자격증" },
          { label: "마케팅 수신", value: "동의" },
          { label: "선호 언어", value: "한국어" }
        ]
      },
      certifications: {
        title: "자격 조회",
        lead: "보유한 자격 내역과 검증 정보를 확인합니다.",
        lookupTitle: "자격번호 조회",
        lookupLead: "자격번호와 검증 코드를 입력해 일치하는 자격 정보를 확인합니다.",
        numberLabel: "자격번호",
        numberPlaceholder: "SMC-2026-001",
        verificationCodeLabel: "검증 코드",
        verificationCodePlaceholder: "PUBLIC-CODE-001",
        issuedLabel: "발급일",
        statusLabel: "상태",
        courseLabel: "과정명",
        lookupCta: "조회하기",
        lookupSuccessTitle: "자격 정보가 확인되었습니다.",
        lookupEmptyTitle: "일치하는 자격 정보가 없습니다.",
        lookupEmptyMessage: "자격번호와 검증 코드를 다시 확인해 주세요.",
        demoHint: "예시: SMC-2026-001 / PUBLIC-CODE-001",
        emptyState: "등록된 자격 내역이 없습니다.",
        emptyGuide: "자격번호가 있다면 바로 조회하고, 아직 수강 전이라면 교육과정을 먼저 확인해 보세요."
      },
      inquiries: {
        title: "문의 내역",
        lead: "파트너 문의와 상담 요청의 접수 상태를 확인하는 사용자 화면입니다.",
        allLabel: "전체",
        receiptLabel: "접수번호",
        typeLabel: "문의 유형",
        messageLabel: "문의 내용",
        emptyState: "해당 상태의 문의 내역이 없습니다.",
        statusLabel: "처리 상태",
        submittedLabel: "접수일",
        items: [
          {
            receipt: "KHCPQA-2026-PREVIEW",
            title: "해외 파트너 교육 협약 문의",
            type: "partner",
            message: "해외 교육기관과의 커리큘럼 제휴 및 강사 파견 가능성을 문의했습니다.",
            submittedAt: "2026-07-04",
            status: "접수 완료"
          },
          {
            receipt: "KHCPQA-2026-COURSE",
            title: "아로마 테라피 과정 상담",
            type: "course",
            message: "아로마 테라피 정규 과정의 수강 기간과 수료 기준을 문의했습니다.",
            submittedAt: "2026-06-28",
            status: "답변 준비 중"
          }
        ]
      },
      modules: [
        { title: "프로필", body: "이름, 이메일, 국가, 선호 언어를 확인하고 수정합니다." },
        { title: "자격 조회", body: "과정명, 발급일, 상태와 검증 정보를 확인합니다." },
        { title: "문의 내역", body: "사용자가 남긴 문의 내역을 확인합니다." },
        { title: "개인정보 보호", body: "마이페이지는 로그인한 회원만 접근할 수 있으며 검색엔진에 노출되지 않도록 설정되어 있습니다." }
      ],
      certificates: [
        { title: "피부미용사 국가자격증", number: "SMC-2026-001", issuedAt: "2026-05-18", status: "활성", verificationCode: "PUBLIC-CODE-001" },
        { title: "아로마 테라피", number: "SMC-2026-014", issuedAt: "2026-06-21", status: "검수 대기", verificationCode: "PUBLIC-CODE-014" }
      ]
    },
    curriculumCatalog: {
      searchLabel: "커리큘럼 검색",
      searchPlaceholder: "과정 검색",
      categoryLabel: "과정 카테고리",
      categories: {
        all: "전체",
        certification: "자격 과정",
        professional: "목표별 과정",
        practical: "실무 프로그램"
      },
      goalTitle: "목표별 추천 과정",
      goalLead: "취업, 창업, 시간 제약 등 수강 목적에 맞춰 과목 조합과 학습 흐름을 설계하는 과정입니다.",
      catalogTitle: "실무·자격 교육과정",
      catalogLead: "현장에서 활용할 수 있는 기술 과목과 자격 과정을 확인하세요.",
      emptyState: "조건에 맞는 과정이 없습니다. 검색어 또는 카테고리를 조정해 주세요.",
      viewDetails: "상세 보기",
      courseCountLabel: "과정",
      consultAriaLabel: "과정 상담 안내",
      consultTitle: "어떤 과정을 선택해야 할지 고민되시나요?",
      consultLead: "목표와 현재 역량에 맞춰 취업, 창업, 주말 학습 과정을 함께 설계해 드립니다.",
      consultCta: "맞춤 상담 신청"
    }
  },
  en: {
    brand: "KAHC",
    brandFull: "The Korea Association for Health & Beauty Certification",
    nav: {
      about: "About",
      curriculum: "Curriculum",
      activities: "Global Activities",
      partner: "Partner Inquiry",
      contact: "Contact",
      login: "Login"
    },
    heroBadge: "Where careers begin with professional training",
    heroTitle: "Your skills become your future",
    heroLead:
      "Practice-based education develops professional therapists and supports learners through employment and startup preparation.",
    primaryCta: "Explore Programs",
    secondaryCta: "Request Partnership",
    secureCta: "Login to Check Certification",
    trustTitle: "Support from training to employment and startup",
    curriculumTitle: "Explore Programs at a Glance",
    activitiesTitle: "Global Activities",
    pageReady: "Translation and content review status is managed in the admin.",
    accountTitle: "My Page",
    adminTitle: "Admin Dashboard",
    formSubmit: "Save Inquiry",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    a11y: {
      homeLink: "KAHC home",
      primaryNavigation: "Primary navigation",
      mobileNavigation: "Mobile navigation",
      languageSwitcher: "Language switcher",
      socialLinks: "Social links",
      accountNavigation: "Account navigation",
      aboutNavigation: "About section navigation"
    },
    layout: {
      consultCta: "Consultation",
      footerLead: "A premium professional education platform connecting structured training with employment and startup support.",
      customerCenter: "Customer Center",
      phoneLabel: "Phone",
      emailLabel: "Email",
      addressLabel: "Address",
      address: "5F, 123 Teheran-ro, Gangnam-gu, Seoul",
      sitemap: "Sitemap"
    },
    seo: {
      title: "KAHC Global Professional Qualification Education",
      description: "A Korea-based multilingual platform for healthcare and beauty professional qualification education, programs, global activities, and partner inquiries."
    },
    home: {
      heroImageAlt: "KAHC trainees and professionals representing global qualification education",
      heroTitlePrefix: "Build your",
      heroTitleHighlight: "career",
      heroTitleSuffix: "with professional education",
      heroFloatingTitle: "Registered Private Qualification Training",
      heroFloatingLead: "Structured programs support professional qualification and completion pathways.",
      platformEyebrow: "Support Program",
      platformLead:
        "Learners move through consultation, course planning, practical training, and employment or startup support in one connected path.",
      learnMore: "Learn more",
      viewCurriculum: "View curriculum",
      platformFeatures: [
        {
          title: "1:1 Career Consultation",
          body: "Specialized counseling helps learners identify their target field and plan a course path around current skills."
        },
        {
          title: "Employment Support System",
          body: "Practical technique, client care, and service readiness are trained together for field employment."
        },
        {
          title: "Startup Consulting",
          body: "Learners preparing for one-person shops or salon operations receive guidance on course combinations and operating direction."
        }
      ],
      curriculumEyebrow: "Curriculum",
      curriculumLead: "Experienced instructors and structured curriculum help learners build professional field skills.",
      activitiesEyebrow: "Global Activities",
      activitiesLead: "Notices, pass records, galleries, and international activities are connected in one place.",
      viewAll: "View all",
      viewDetails: "View details",
      certificationEyebrow: "Certification Inquiry",
      certificationTitle: "Check certification records after login.",
      certificationLead:
        "Individual certification status, completion records, and issuance details can be expanded into a secure account area.",
      certificationCta: "Check certification",
      certificateLabel: "Certificate Verification",
      onlineInquiry: "Online Inquiry",
      featuredCoursesTitle: "Featured Programs",
      featuredCoursesLead: "Practice-centered programs ready for real field use.",
      reasonsTitle: "Why KAHC Stands Out",
      reasons: [
        { title: "Field-Based Practical Training", body: "Practice-first curriculum helps learners apply skills immediately in the field." },
        { title: "Professional Instructors", body: "Experienced instructors teach the essentials drawn from real client work." },
        { title: "Employment and Startup Links", body: "A broad partner network supports learners preparing for jobs or business launch." },
        { title: "1:1 Personalized Advising", body: "Advisors shape a growth roadmap around each learner's goals and situation." }
      ],
      supportTitle: "Employment and Startup Support",
      supportPrograms: [
        { title: "1:1 Career Consultation", body: "Specialized advisors suggest a tailored employment strategy through individual consultation.", image: "/assets/support-career-consulting-v2.png" },
        { title: "Employment Matching System", body: "A nationwide partner network supports practical employment connections.", image: "/assets/support-job-network-v2.png" },
        { title: "Startup Consulting", body: "Expert consulting supports preparation from business planning to opening.", image: "/assets/support-startup-consulting-v2.png" },
        { title: "Marketing Support", body: "Practical support covers promotion, branding, and social media marketing.", image: "/assets/support-marketing-v2.png" }
      ],
      noticesTitle: "Notices",
      moreCta: "View more",
      notices: [
        "June 2024 program opening notice",
        "Aromatherapy special lecture notice",
        "Summer skin-care event",
        "May certification exam schedule",
        "Employment fair participation notice"
      ],
      scheduleTitle: "Class Hours",
      schedules: [
        { label: "Day Class", time: "Mon-Fri 10:00 - 14:00" },
        { label: "Evening Class", time: "Mon-Fri 19:00 - 22:00" },
        { label: "Weekend Class", time: "Saturday 10:00 - 16:00" },
        { label: "Hobby Class", time: "Tue, Thu 14:00 - 16:00" }
      ],
      consultTitle: "Start with advising\nand move toward your goal",
      consultLead: "A professional advisor will guide you through the next step.",
      consultCta: "Request advising",
      finalKicker: "Your first step can change your future ✣",
      finalTitle: "Request advising today and turn your goal into action.",
      finalCta: "Request advising"
    },
    about: {
      eyebrow: "About KAHC",
      title: "About KAHC",
      lead:
        "KAHC builds a practical education pathway for health and beauty learners, connecting certification, employment, and business goals.",
      greetingCta: "Read greetings",
      features: [
        {
          title: "Certification Success and Tailored Training",
          body: "KAHC responds to the growth of the health and beauty industry with forward-looking education for national certification success. Learners receive efficient classes, certification know-how videos, tailored guidance, and support from experienced full-time instructors."
        },
        {
          title: "Practice-Based Employment Education",
          body: "The academy provides SMC's professional techniques and hands-on programs to support employment. Learners build practical skills from fundamentals to expert-level training, with counseling and career support aligned to their goals."
        },
        {
          title: "PSL Problem-Solving Learning",
          body: "KAHC moves beyond lecture-only theory and applies practice-oriented PSL education. Learners understand principles through hands-on work, alternate between client and practitioner perspectives, and develop skills step by step."
        },
        {
          title: "Step-by-Step Goal Achievement",
          body: "Learners receive practical training, character education, and etiquette education so they can pursue clear goals. Instructors guide technical skills, service mindset, customer care, certification, employment, admission, and business preparation."
        },
        {
          title: "A Satisfaction-Focused System",
          body: "The academy aims for education that learners can rate highly in both quality and depth. Close instructor guidance, careful feedback checks, and organized support cover training, enrollment, employment, and business preparation."
        }
      ]
    },
    aboutSubnav: [
      { key: "intro", title: "Introduction", href: "about" },
      { key: "greeting", title: "Greetings", href: "about/greeting" },
      { key: "instructors", title: "International Directors", href: "about/instructors" },
      { key: "history", title: "History", href: "about/history" },
      { key: "organization", title: "Organization", href: "about/organization" }
    ],
    greetingPage: {
      eyebrow: "Greetings",
      title: "Leadership Greetings",
      lead: "",
      greetings: [
        ...leadershipGreetings["en"],
        {
          name: "Moon Soon-young",
          role: "Vice President / Director, Seoul Headquarters",
          imageUrl: "/assets/greeting-moon-soonyoung.jpg",
          paragraphs: [
            "The Seoul Headquarters is located in central Seoul near Jongno 3-ga Station, where subway lines 1, 3, and 5 connect.",
            "For learners preparing for careers and business in skincare, nail, makeup, hair, and massage fields, the first academy choice is important. Seoul Headquarters provides national certification theory and practical training as well as salon techniques, medical skincare, aroma, meridian, sports, and foot massage from fundamentals to expert levels.",
            "The headquarters pursues first-class technical education so learners can build both pride and skill, and it guides students toward achieving their professional dreams."
          ]
        },
        {
          name: "Hwang Yu-jin",
          role: "Director, Daerim Campus",
          meta: "Skin-care Management Consultant",
          imageUrl: "/assets/greeting-hwang-yujin.jpg",
          paragraphs: [
            "Daerim Campus is located one minute from Exit 12 of Daerim Station, where subway lines 2 and 7 connect, offering convenient access and a clean, comfortable learning environment.",
            "The campus provides accelerated national certification education and practical employment training for skincare, nail art, hair, and massage careers, along with character and etiquette education required of professional practitioners.",
            "Through focused one- to two-month special programs, many students earn skincare national certification quickly. The campus hopes learners will study with confidence and succeed as professional practitioners."
          ]
        },
        {
          name: "Lee Yong-ho",
          role: "Education Director, Gangnam Massage Institute",
          imageUrl: "/assets/greeting-lee-yongho.jpg",
          paragraphs: [
            "Gangnam Massage Institute is a professional massage education center located one minute from Exit 12 of Daerim Station. It teaches sports massage, meridian massage, skincare massage, and foot massage for the global service industry.",
            "The institute supports employment placement, business consulting, overseas employment recommendations, and study-abroad consulting for spas, massage shops, hotels, saunas, and skincare workplaces.",
            "Through one-on-one counseling, the institute identifies each learner's aptitude, desired workplace, schedule, compensation, and region, then connects them to suitable employment as quickly as possible."
          ]
        }
      ]
    },
    instructorsPage: { eyebrow: "International Directors", title: "International Directors", lead: "", instructors: internationalDirectors["en"] },
    historyPage: {
      eyebrow: "History",
      title: "KAHC History",
      lead: "",
      imageAlt: "SMC Academy history representative image",
      yearsLabel: "Years",
      timelineLabel: "Timeline by year",
      detailNote: "Organized from the year-by-year records on the original history page.",
      dateLabel: "Date",
      titleLabel: "Title"
    },
    organizationPage: {
      eyebrow: "Organization",
      title: "KAHC Organization",
      lead: "",
      imageAlt: "KAHC and SMC Academy organization chart",
      units: [
        { title: "International Chair", body: "Oversees global education exchange and international cooperation direction." },
        { title: "Association Operations", body: "KAHC manages the education, certification, and branch operating framework." },
        { title: "Education Operations", body: "SMC Academy and campus teams deliver certification training and practical education." },
        { title: "Field Support", body: "Counseling, employment and business support, public events, and partner activities are coordinated together." }
      ]
    },
    curriculumPage: {
      eyebrow: "Curriculum",
      lead: "Existing SMC365 program content is reorganized into global education program cards and detail templates.",
      heroTitlePrefix: "Professional programs",
      heroTitleHighlight: "for your goal",
      massageProgramsLabel: "Massage Programs"
    },
    courseDetail: {
      inquiryCta: "Inquire",
      allCoursesCta: "All programs",
      overviewEyebrow: "Overview",
      overviewTitle: "Program Overview",
      curriculumEyebrow: "Curriculum",
      curriculumTitle: "Key Training Content",
      goalOverviewTitle: "Goal-Based Program Overview",
      goalPlanTitle: "Goal Achievement Learning Plan",
      goalOutcomeTitle: "Advising and Career Path",
      durationTitle: "Training Duration",
      detailGroupTraining: "Program Structure",
      detailGroupCareer: "Career and Income Guidance",
      detailGroupSchedule: "Class Guidance",
      midCtaTitle: "Get a Course Mix Consultation",
      midCtaLead: "We help plan subjects and sequence around your target role and current skill level.",
      sideSummaryTitle: "Consultation Summary",
      audienceTitle: "Audience",
      certificationTitle: "Completion / Certification",
      sourceTitle: "Source URL",
      metricProgramTypeLabel: "Program Type",
      metricDurationLabel: "Duration",
      metricLearningLabel: "Learning",
      metricDurationFallback: "Advised",
      metricLearningFallback: "Theory + Practice",
      learningGoalsTitle: "Learning Goals",
      programStrengthsTitle: "Program Strengths",
      recommendedForTitle: "Recommended For",
      featureHighlights: [
        "Focused feedback",
        "Practice-centered training",
        "Experienced instructors",
        "Completion guidance"
      ],
      coreTechniquesTitle: "Core Techniques",
      classProcessTitle: "Class Process",
      summaryEyebrow: "Program Summary",
      summaryTitle: "Core Training Points",
      summaryLead: "Review learning goals, audience, core techniques, and career direction before the detailed guide.",
      advancedEyebrow: "Advanced Guide",
      advancedTitle: "In-Depth Curriculum Guide",
      advancedLead: "Explore theory, practice, care principles, and career pathways step by step.",
      afterCompletionTitle: "After Completion",
      careerItems: [
        "Professional salon employment",
        "One-person startup",
        "Spa & hotel employment",
        "Beauty freelancer",
        "Advanced course pathway"
      ],
      landingCtaEyebrow: "Build professional technique"
    },
    activitiesPage: {
      eyebrow: "Global Activities",
      lead: "Notices, pass records, galleries, awards, international beauty competitions, corporate events, media, volunteer activities, and student reviews are reorganized as global trust content.",
      detailEyebrow: "Activity Detail",
      latestPostsTitle: "Recent Posts",
      managedContentTitle: "Managed Content",
      sourceLabel: "Source",
      statusLabel: "Publish Status",
      managedStatus: "Admin-managed content",
      allActivitiesCta: "All Activities",
      detailCta: "View Details"
    },
    contact: {
      eyebrow: "Location",
      lead: "Addresses and subway, bus, and parking guidance for Seoul Headquarters, Gangnam SMC Academy, and Daerim Campus.",
      callCta: "Call",
      mapCta: "Open Map",
      nearestStationLabel: "Nearest Station",
      mainPhoneLabel: "Main Phone",
      parkingLabel: "Parking",
      mapAltSuffix: "map",
      addressTitle: "Address",
      roadAddressLabel: "Road Address",
      lotAddressLabel: "Lot Address",
      subwayTitle: "By Subway",
      drivingTitle: "By Car",
      busTitle: "By Bus",
      busStopsCountLabel: "stops",
      busExpandLabel: "Show routes",
      busCollapseLabel: "Hide routes"
    },
    legal: {
      privacyTitle: "Privacy Policy",
      termsTitle: "Terms of Use",
      eyebrow: "Legal Documents",
      lead: "Review-stage pages before final legal text is provided. Replace with client-approved legal copy before production release.",
      pendingTitle: "Final Legal Copy Required",
      pendingBody: "This page confirms the link structure and placement only. Privacy Policy and Terms of Use must be finalized according to the actual operating policy.",
      requiredItems: [
        "Personal information collected and purpose of use",
        "Retention and usage period",
        "Third-party sharing and processing delegation",
        "Account deletion and user rights process",
        "Service restrictions and liability scope"
      ]
    },
    partnerInquiry: {
      eyebrow: "Partner Inquiry",
      lead: "International institutions, education partners, and trainees can submit inquiries to the admin inbox. Automated email and SMS replies are outside the first release.",
      successTitle: "Inquiry submitted.",
      successMessage: "Your inquiry has been saved to the admin inbox. A manager will review it and update the status.",
      receiptLabel: "Receipt No.",
      submittedSummaryTitle: "Submission Summary",
      nextStepTitle: "Admin Processing Flow",
      nextSteps: [
        "Show as a new inquiry in the admin queue",
        "Manager reviews type and priority",
        "Save processing status and manager memo"
      ],
      validation: {
        required: "Please complete this required field.",
        email: "Please enter a valid email address.",
        consent: "Please agree to personal information collection and inquiry processing."
      },
      fields: {
        name: "Name",
        namePlaceholder: "Your name",
        organization: "Organization",
        organizationPlaceholder: "Institution or company",
        email: "Email",
        emailPlaceholder: "name@example.com",
        country: "Country",
        countryPlaceholder: "Country",
        message: "Message",
        messagePlaceholder: "Tell us about your partnership interest",
        consent: "I agree to the collection of personal information and inquiry processing."
      }
    },
    login: {
      eyebrow: "Secure Login",
      lead: "Log in to access your My Page and certification records.",
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
      passwordPlaceholder: "Password",
      submitCta: "Login",
      forgotPassword: "Forgot password?",
      backToLogin: "Back to login",
      resetCta: "Send reset instructions",
      note: "After login, you can review your profile, certification records, and inquiry history.",
      successTitle: "Logged in.",
      successMessage: "Redirecting to the right workspace shortly.",
      resetSuccessTitle: "Reset instructions sent.",
      resetSuccessMessage: "Password reset instructions have been sent to your email.",
      configurationError: "Login is not connected yet. Please contact the administrator.",
      rateLimitError: "Password reset email limit was exceeded. Please try again later.",
      validation: {
        emailRequired: "Please enter your email.",
        emailInvalid: "Please enter a valid email address.",
        passwordRequired: "Please enter your password.",
        passwordLength: "Password must be at least 8 characters."
      }
    },
    signup: {
      eyebrow: "Create Account",
      title: "Create Account",
      lead: "Create an account to access certification records and inquiry history.",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "name@example.com",
      phone: "Phone",
      phonePlaceholder: "+1 000 000 0000",
      country: "Country",
      countryPlaceholder: "Select country",
      interestedCourse: "Interested Program",
      interestedCoursePlaceholder: "Select a program",
      marketingConsent: "I agree to receive education and consultation updates.",
      password: "Password",
      passwordPlaceholder: "At least 8 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Enter password again",
      consent: "I agree to personal information collection and account creation.",
      submitCta: "Create Account",
      loginCta: "Already have an account?",
      note: "Open registration is enabled. If email confirmation is required, use the confirmation link in your inbox.",
      successTitle: "Signup submitted.",
      successMessage: "If email confirmation is required, use the confirmation link in your inbox to finish creating your account.",
      configurationError: "Signup is not connected yet. Please contact the administrator.",
      rateLimitError: "Email sending rate limit was exceeded. Please try again later or contact the administrator.",
      existingAccountError: "This email is already registered. Please log in or reset your password.",
      validation: {
        required: "Please complete this required field.",
        email: "Please enter a valid email address.",
        passwordLength: "Password must be at least 8 characters.",
        passwordMatch: "Passwords do not match.",
        consent: "Please agree to personal information collection and account creation."
      }
    },
    account: {
      eyebrow: "Protected Account Area",
      lead: "This personal account area is available to logged-in members only.",
      overviewTitle: "Account Summary",
      overviewLead: "Review your profile, certification records, and inquiry history in one place.",
      profileStatus: {
        ready: "Ready",
        empty: "Incomplete"
      },
      countSuffix: "",
      noindexStatus: "Private",
      nav: [
        { title: "My Page", href: "account", description: "Account summary" },
        { title: "Profile", href: "account/profile", description: "Member information" },
        { title: "Certification Inquiry", href: "account/certifications", description: "Certification records" },
        { title: "Inquiry History", href: "account/inquiries", description: "Submitted inquiries" }
      ],
      profile: {
        title: "Profile",
        lead: "Review and update your member information.",
        editTitle: "Edit Profile",
        editLead: "Update your name, phone, country, interested program, and preferred language.",
        saveCta: "Save",
        successTitle: "Profile saved.",
        successMessage: "Your member information has been updated.",
        validation: {
          required: "Please complete this required field.",
          email: "Please enter a valid email address."
        },
        fields: [
          { label: "Name", value: "KHCPQA Demo Member" },
          { label: "Email", value: "member@example.com" },
          { label: "Phone", value: "+1 000 000 0000" },
          { label: "Country", value: "Korea" },
          { label: "Interested Program", value: "Skin Care Specialist National Certification" },
          { label: "Marketing Consent", value: "Agreed" },
          { label: "Preferred Language", value: "English" }
        ]
      },
      certifications: {
        title: "Certification Inquiry",
        lead: "Review your certification records and verification details.",
        lookupTitle: "Certificate Lookup",
        lookupLead: "Enter a certificate number and verification code to confirm a matching certification record.",
        numberLabel: "Certificate No.",
        numberPlaceholder: "SMC-2026-001",
        verificationCodeLabel: "Verification Code",
        verificationCodePlaceholder: "PUBLIC-CODE-001",
        issuedLabel: "Issue Date",
        statusLabel: "Status",
        courseLabel: "Program",
        lookupCta: "Look Up",
        lookupSuccessTitle: "Certification record found.",
        lookupEmptyTitle: "No matching certification record.",
        lookupEmptyMessage: "Please check the certificate number and verification code.",
        demoHint: "Example: SMC-2026-001 / PUBLIC-CODE-001",
        emptyState: "No certification records are registered.",
        emptyGuide: "If you have a certificate number, look it up now. If not, review available programs first."
      },
      inquiries: {
        title: "Inquiry History",
        lead: "A user-facing view for partnership inquiries and consultation request status.",
        allLabel: "All",
        receiptLabel: "Receipt No.",
        typeLabel: "Inquiry Type",
        messageLabel: "Message",
        emptyState: "No inquiries match this status.",
        statusLabel: "Status",
        submittedLabel: "Submitted",
        items: [
          {
            receipt: "KHCPQA-2026-PREVIEW",
            title: "Overseas partner training agreement inquiry",
            type: "partner",
            message: "Asked about curriculum partnerships and instructor dispatch with an overseas education institution.",
            submittedAt: "2026-07-04",
            status: "Received"
          },
          {
            receipt: "KHCPQA-2026-COURSE",
            title: "Aromatherapy program consultation",
            type: "course",
            message: "Asked about the Aromatherapy regular program duration and completion criteria.",
            submittedAt: "2026-06-28",
            status: "Preparing response"
          }
        ]
      },
      modules: [
        { title: "Profile", body: "Review and edit name, email, country, and preferred language." },
        { title: "Certification Inquiry", body: "Review program name, issue date, status, and verification details." },
        { title: "Inquiry History", body: "Review inquiries submitted by the user." },
        { title: "Noindex", body: "Account pages are blocked from search engine indexing." }
      ],
      certificates: [
        { title: "National Esthetician Certification", number: "SMC-2026-001", issuedAt: "2026-05-18", status: "Active", verificationCode: "PUBLIC-CODE-001" },
        { title: "Aromatherapy", number: "SMC-2026-014", issuedAt: "2026-06-21", status: "Pending review", verificationCode: "PUBLIC-CODE-014" }
      ]
    },
    curriculumCatalog: {
      searchLabel: "Search curriculum",
      searchPlaceholder: "Search courses",
      categoryLabel: "Course categories",
      categories: {
        all: "All",
        certification: "Certification",
        professional: "Goal-Based Programs",
        practical: "Practical Program"
      },
      goalTitle: "Goal-Based Recommended Programs",
      goalLead: "Programs designed around employment, startup preparation, schedule constraints, and each learner's purpose.",
      catalogTitle: "Practical and Certification Programs",
      catalogLead: "Explore technical training and certification programs for field use.",
      emptyState: "No programs match your filters. Adjust the keyword or category.",
      viewDetails: "View Details",
      courseCountLabel: "courses",
      consultAriaLabel: "Program consultation",
      consultTitle: "Need help choosing a program?",
      consultLead: "We help match your goals and current skills with the right employment, startup, or weekend learning path.",
      consultCta: "Request advising"
    }
  },
  es: {
    brand: "KAHC",
    brandFull: "The Korea Association for Health & Beauty Certification",
    nav: {
      about: "Acerca de",
      curriculum: "Currículo",
      activities: "Actividades Globales",
      partner: "Consulta de Asociación",
      contact: "Contacto",
      login: "Iniciar Sesión"
    },
    heroBadge: "Donde empieza la carrera con formación profesional",
    heroTitle: "Tus habilidades se convierten en tu futuro",
    heroLead:
      "La educación práctica forma terapeutas profesionales y apoya a los estudiantes en empleo y emprendimiento.",
    primaryCta: "Explorar Programas",
    secondaryCta: "Solicitar Alianza",
    secureCta: "Consultar Certificación",
    trustTitle: "Apoyo desde la formación hasta empleo y emprendimiento",
    curriculumTitle: "Programas de un vistazo",
    activitiesTitle: "Actividades Globales",
    pageReady: "El estado de traducción y revisión se gestiona desde el administrador.",
    accountTitle: "My Page",
    adminTitle: "Panel de Administración",
    formSubmit: "Guardar Consulta",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    a11y: {
      homeLink: "Inicio de KAHC",
      primaryNavigation: "Navegación principal",
      mobileNavigation: "Navegación móvil",
      languageSwitcher: "Selector de idioma",
      socialLinks: "Enlaces sociales",
      accountNavigation: "Navegación de cuenta",
      aboutNavigation: "Navegación de la sección Acerca de"
    },
    layout: {
      consultCta: "Consulta",
      footerLead: "Una plataforma premium de educación profesional que conecta formación estructurada con apoyo para empleo y emprendimiento.",
      customerCenter: "Centro de Atención",
      phoneLabel: "Teléfono",
      emailLabel: "Email",
      addressLabel: "Dirección",
      address: "5F, 123 Teheran-ro, Gangnam-gu, Seúl",
      sitemap: "Mapa del sitio"
    },
    seo: {
      title: "KAHC Educación Global de Cualificaciones Profesionales",
      description: "Plataforma multilingüe basada en Corea para educación profesional en salud y belleza, programas, actividades globales y consultas de asociación."
    },
    home: {
      heroImageAlt: "Estudiantes y profesionales de KAHC que representan la educación global de cualificaciones",
      heroTitlePrefix: "Complete su",
      heroTitleHighlight: "carrera",
      heroTitleSuffix: "con formación profesional",
      heroFloatingTitle: "Formación de Cualificación Privada Registrada",
      heroFloatingLead: "Programas estructurados apoyan rutas de cualificación profesional y finalización.",
      platformEyebrow: "Programa de Apoyo",
      platformLead:
        "Los estudiantes avanzan por consulta, planificación de cursos, práctica y apoyo de empleo o emprendimiento en un solo flujo.",
      learnMore: "Más información",
      viewCurriculum: "Ver currículo",
      platformFeatures: [
        {
          title: "Consulta 1:1",
          body: "La asesoría especializada ayuda a definir el campo objetivo y planificar el curso según las habilidades actuales."
        },
        {
          title: "Sistema de empleo",
          body: "La técnica práctica, la atención al cliente y la preparación de servicio se entrenan juntas para el trabajo real."
        },
        {
          title: "Consultoría de emprendimiento",
          body: "Quienes preparan un salón individual u operación de shop reciben guía de combinación de cursos y dirección operativa."
        }
      ],
      curriculumEyebrow: "Currículo",
      curriculumLead: "Instructores con experiencia y un currículo estructurado ayudan a desarrollar habilidades profesionales.",
      activitiesEyebrow: "Actividades Globales",
      activitiesLead: "Avisos, resultados, galerías y actividades internacionales se conectan en un solo lugar.",
      viewAll: "Ver todo",
      viewDetails: "Ver detalles",
      certificationEyebrow: "Consulta de Certificación",
      certificationTitle: "Consulte los registros de certificación después de iniciar sesión.",
      certificationLead:
        "El estado de certificación, los registros de finalización y los datos de emisión pueden ampliarse dentro de un área segura de cuenta.",
      certificationCta: "Consultar certificación",
      certificateLabel: "Verificación de Certificado",
      onlineInquiry: "Consulta en línea",
      featuredCoursesTitle: "Programas destacados",
      featuredCoursesLead: "Programas prácticos listos para aplicar en el campo real.",
      reasonsTitle: "Por qué KAHC es diferente",
      reasons: [
        { title: "Formación práctica de campo", body: "El currículo práctico ayuda a aplicar habilidades de inmediato en el trabajo real." },
        { title: "Instructores profesionales", body: "Instructores con experiencia enseñan lo esencial desde el trabajo con clientes reales." },
        { title: "Conexión con empleo y emprendimiento", body: "Una red de socios apoya a quienes preparan empleo o lanzamiento de negocio." },
        { title: "Asesoría personalizada 1:1", body: "Los asesores diseñan una ruta de crecimiento según metas y situación de cada estudiante." }
      ],
      supportTitle: "Apoyo para empleo y emprendimiento",
      supportPrograms: [
        { title: "Consulta laboral 1:1", body: "Asesores especializados proponen una estrategia laboral personalizada mediante consulta individual.", image: "/assets/support-career-consulting-v2.png" },
        { title: "Sistema de conexión laboral", body: "Una red nacional de socios apoya conexiones prácticas de empleo.", image: "/assets/support-job-network-v2.png" },
        { title: "Consultoría de emprendimiento", body: "La consultoría experta apoya desde la planificación del negocio hasta la apertura.", image: "/assets/support-startup-consulting-v2.png" },
        { title: "Apoyo de marketing", body: "Apoyo práctico en promoción, branding y marketing en redes sociales.", image: "/assets/support-marketing-v2.png" }
      ],
      noticesTitle: "Avisos",
      moreCta: "Ver más",
      notices: [
        "Aviso de apertura de programas de junio de 2024",
        "Aviso de clase especial de aromaterapia",
        "Evento de cuidado de piel de verano",
        "Calendario de examen de certificación de mayo",
        "Aviso de participación en feria de empleo"
      ],
      scheduleTitle: "Horario de clases",
      schedules: [
        { label: "Clase diurna", time: "Lun-Vie 10:00 - 14:00" },
        { label: "Clase nocturna", time: "Lun-Vie 19:00 - 22:00" },
        { label: "Clase de fin de semana", time: "Sábado 10:00 - 16:00" },
        { label: "Clase hobby", time: "Mar, Jue 14:00 - 16:00" }
      ],
      consultTitle: "Empiece con asesoría\ny avance hacia su meta",
      consultLead: "Un asesor profesional le guiará en el siguiente paso.",
      consultCta: "Solicitar asesoría",
      finalKicker: "Su primer paso puede cambiar su futuro ✣",
      finalTitle: "Solicite asesoría hoy y convierta su meta en acción.",
      finalCta: "Solicitar asesoría"
    },
    about: {
      eyebrow: "Acerca de KAHC",
      title: "Acerca de KAHC",
      lead:
        "KAHC ofrece una ruta educativa práctica para salud y belleza, conectando certificación, empleo y preparación para emprendimiento.",
      greetingCta: "Ver saludos",
      features: [
        {
          title: "Certificación y formación personalizada",
          body: "KAHC responde al crecimiento de la industria de salud y belleza con educación orientada a la certificación nacional. Los estudiantes reciben clases eficientes, videos de know-how, guía personalizada y apoyo de instructores con experiencia."
        },
        {
          title: "Educación práctica para empleo",
          body: "La academia ofrece técnicas profesionales de SMC y programas prácticos para apoyar el empleo. Los estudiantes desarrollan habilidades desde lo básico hasta un nivel experto, con asesoría y apoyo profesional según sus objetivos."
        },
        {
          title: "Aprendizaje PSL",
          body: "KAHC supera la educación teórica tradicional y aplica aprendizaje práctico de resolución de problemas. Los estudiantes comprenden principios mediante práctica, alternan perspectivas de cliente y profesional, y desarrollan habilidades paso a paso."
        },
        {
          title: "Logro de objetivos por etapas",
          body: "Los estudiantes reciben formación práctica, educación de actitud y etiqueta para avanzar hacia metas claras. Los instructores guían técnica, servicio, atención al cliente, certificación, empleo, admisión y preparación de negocio."
        },
        {
          title: "Sistema centrado en satisfacción",
          body: "La academia busca una educación valorada por su calidad y profundidad. La guía cercana de instructores, la revisión de necesidades y el soporte organizado cubren formación, inscripción, empleo y emprendimiento."
        }
      ]
    },
    aboutSubnav: [
      { key: "intro", title: "Introducción", href: "about" },
      { key: "greeting", title: "Saludos", href: "about/greeting" },
      { key: "instructors", title: "Directores internacionales", href: "about/instructors" },
      { key: "history", title: "Historia", href: "about/history" },
      { key: "organization", title: "Organización", href: "about/organization" }
    ],
    greetingPage: {
      eyebrow: "Saludos",
      title: "Saludos de la Dirección",
      lead: "",
      greetings: [
        ...leadershipGreetings["es"],
        {
          name: "Moon Soon-young",
          role: "Vicepresidenta / Directora de la Sede Central de Seúl",
          imageUrl: "/assets/greeting-moon-soonyoung.jpg",
          paragraphs: [
            "La sede central de Seúl está ubicada en el centro de la ciudad, cerca de la estación Jongno 3-ga, donde conectan las líneas 1, 3 y 5 del metro.",
            "Para quienes preparan empleo o emprendimiento en estética, uñas, maquillaje, peluquería y masaje, la primera elección de academia es importante. La sede ofrece teoría y práctica para certificación nacional, además de técnicas de salón, skincare médico, aroma, meridiano, deportes y masaje de pies desde nivel básico hasta experto.",
            "La sede busca una educación técnica de primer nivel para que los estudiantes desarrollen orgullo y capacidad, y los guía para alcanzar sus sueños profesionales."
          ]
        },
        {
          name: "Hwang Yu-jin",
          role: "Directora del Campus Daerim",
          meta: "Skin-care Management Consultant",
          imageUrl: "/assets/greeting-hwang-yujin.jpg",
          paragraphs: [
            "El Campus Daerim está a un minuto de la salida 12 de la estación Daerim, donde conectan las líneas 2 y 7, con acceso cómodo y un ambiente amplio, limpio y agradable.",
            "El campus ofrece educación intensiva para certificaciones nacionales y formación práctica para empleo en estética, uñas, peluquería y masaje, junto con educación de actitud y etiqueta profesional.",
            "Mediante programas especiales de uno a dos meses, muchos estudiantes obtienen rápidamente la certificación nacional de estética. El campus desea que los estudiantes aprendan con confianza y tengan éxito como profesionales."
          ]
        },
        {
          name: "Lee Yong-ho",
          role: "Director de Educación, Gangnam Massage Institute",
          imageUrl: "/assets/greeting-lee-yongho.jpg",
          paragraphs: [
            "Gangnam Massage Institute es un centro especializado en masaje ubicado a un minuto de la salida 12 de la estación Daerim. Enseña masaje deportivo, meridiano, facial/corporal y de pies para la industria global de servicios.",
            "El instituto apoya colocación laboral, consultoría de emprendimiento, recomendaciones de empleo en el extranjero y consultoría de estudios para spas, centros de masaje, hoteles, saunas y espacios de skincare.",
            "Mediante asesoría individual, identifica la aptitud, lugar de trabajo deseado, horario, remuneración y zona de cada estudiante para conectarlo con oportunidades adecuadas lo antes posible."
          ]
        }
      ]
    },
    instructorsPage: { eyebrow: "Directores internacionales", title: "Directores internacionales", lead: "", instructors: internationalDirectors["es"] },
    historyPage: {
      eyebrow: "Historia",
      title: "Historia de KAHC",
      lead: "",
      imageAlt: "Imagen representativa de la historia de SMC Academy",
      yearsLabel: "Años",
      timelineLabel: "Cronología por año",
      detailNote: "Organizado a partir de los registros por año de la página original.",
      dateLabel: "Fecha",
      titleLabel: "Título"
    },
    organizationPage: {
      eyebrow: "Organización",
      title: "Organización de KAHC",
      lead: "",
      imageAlt: "Organigrama de KAHC y SMC Academy",
      units: [
        { title: "Presidencia internacional", body: "Supervisa el intercambio educativo global y la cooperación internacional." },
        { title: "Operación de la asociación", body: "KAHC gestiona el marco de educación, certificación y operación de sedes." },
        { title: "Operación educativa", body: "SMC Academy y los campus imparten formación de certificación y educación práctica." },
        { title: "Soporte de campo", body: "La asesoría, el apoyo laboral y de emprendimiento, los eventos y las alianzas se coordinan de forma integrada." }
      ]
    },
    curriculumPage: {
      eyebrow: "Currículo",
      lead: "El contenido existente de programas SMC365 se reorganiza en tarjetas y plantillas detalladas para una institución educativa global.",
      heroTitlePrefix: "Programas profesionales",
      heroTitleHighlight: "para su objetivo",
      massageProgramsLabel: "Programas de masaje"
    },
    courseDetail: {
      inquiryCta: "Consultar",
      allCoursesCta: "Todos los programas",
      overviewEyebrow: "Resumen",
      overviewTitle: "Resumen del Programa",
      curriculumEyebrow: "Currículo",
      curriculumTitle: "Contenido Principal de Formación",
      goalOverviewTitle: "Resumen del Programa por Objetivo",
      goalPlanTitle: "Plan de Aprendizaje por Objetivo",
      goalOutcomeTitle: "Asesoría y Ruta Profesional",
      durationTitle: "Duración de Formación",
      detailGroupTraining: "Estructura del Programa",
      detailGroupCareer: "Guía de Empleo e Ingresos",
      detailGroupSchedule: "Guía de Clases",
      midCtaTitle: "Consulta de Combinación de Cursos",
      midCtaLead: "Planificamos materias y secuencia según su campo objetivo y nivel actual.",
      sideSummaryTitle: "Resumen de Consulta",
      audienceTitle: "Dirigido a",
      certificationTitle: "Finalización / Certificación",
      sourceTitle: "URL de origen",
      metricProgramTypeLabel: "Tipo de programa",
      metricDurationLabel: "Duración",
      metricLearningLabel: "Aprendizaje",
      metricDurationFallback: "Con asesoría",
      metricLearningFallback: "Teoría + Práctica",
      learningGoalsTitle: "Objetivos de aprendizaje",
      programStrengthsTitle: "Fortalezas del programa",
      recommendedForTitle: "Recomendado para",
      featureHighlights: [
        "Retroalimentación personalizada",
        "Formación centrada en la práctica",
        "Instructores con experiencia",
        "Orientación para finalización"
      ],
      coreTechniquesTitle: "Técnicas clave",
      classProcessTitle: "Proceso de clase",
      summaryEyebrow: "Resumen del programa",
      summaryTitle: "Puntos clave de formación",
      summaryLead: "Revise objetivos, público, técnicas clave y orientación profesional antes de la guía detallada.",
      advancedEyebrow: "Guía avanzada",
      advancedTitle: "Currículo detallado en profundidad",
      advancedLead: "Explore teoría, práctica, principios de cuidado y rutas profesionales paso a paso.",
      afterCompletionTitle: "Después de finalizar",
      careerItems: [
        "Empleo en salón profesional",
        "Emprendimiento individual",
        "Empleo en spa y hotel",
        "Freelance de belleza",
        "Ruta de curso avanzado"
      ],
      landingCtaEyebrow: "Desarrolle técnica profesional"
    },
    activitiesPage: {
      eyebrow: "Actividades Globales",
      lead: "Avisos, resultados, galerías, premios, concursos internacionales de belleza, eventos corporativos, medios, voluntariado y reseñas de estudiantes se reorganizan como contenido global de confianza.",
      detailEyebrow: "Detalle de Actividad",
      latestPostsTitle: "Publicaciones recientes",
      managedContentTitle: "Contenido gestionado",
      sourceLabel: "Fuente",
      statusLabel: "Estado de publicación",
      managedStatus: "Contenido gestionado por administración",
      allActivitiesCta: "Todas las actividades",
      detailCta: "Ver detalles"
    },
    contact: {
      eyebrow: "Ubicación",
      lead: "Direcciones e información de metro, autobús y estacionamiento para la sede de Seúl, Gangnam SMC Academy y el Campus Daerim.",
      callCta: "Llamar",
      mapCta: "Abrir mapa",
      nearestStationLabel: "Estación cercana",
      mainPhoneLabel: "Teléfono principal",
      parkingLabel: "Estacionamiento",
      mapAltSuffix: "mapa",
      addressTitle: "Dirección",
      roadAddressLabel: "Dirección vial",
      lotAddressLabel: "Dirección de lote",
      subwayTitle: "En metro",
      drivingTitle: "En coche",
      busTitle: "En autobús",
      busStopsCountLabel: "paradas",
      busExpandLabel: "Ver rutas",
      busCollapseLabel: "Ocultar rutas"
    },
    legal: {
      privacyTitle: "Política de Privacidad",
      termsTitle: "Términos de Uso",
      eyebrow: "Documentos Legales",
      lead: "Páginas de revisión antes de recibir el texto legal final. Deben reemplazarse con el texto aprobado por el cliente antes del lanzamiento.",
      pendingTitle: "Texto legal final requerido",
      pendingBody: "Esta página confirma únicamente la estructura de enlaces y ubicación. La política de privacidad y los términos deben finalizarse según la política real de operación.",
      requiredItems: [
        "Información personal recopilada y finalidad de uso",
        "Periodo de retención y uso",
        "Cesión a terceros y delegación de tratamiento",
        "Eliminación de cuenta y ejercicio de derechos",
        "Restricciones del servicio y alcance de responsabilidad"
      ]
    },
    partnerInquiry: {
      eyebrow: "Consulta de Asociación",
      lead: "Instituciones internacionales, socios educativos y estudiantes pueden enviar consultas al buzón del administrador. Las respuestas automáticas por email/SMS quedan fuera de la primera versión.",
      successTitle: "Consulta enviada.",
      successMessage: "Su consulta se guardó en el buzón del administrador. Un responsable la revisará y actualizará el estado.",
      receiptLabel: "No. de recepción",
      submittedSummaryTitle: "Resumen de envío",
      nextStepTitle: "Flujo de administración",
      nextSteps: [
        "Mostrar como nueva consulta en la bandeja de administración",
        "El responsable revisa tipo y prioridad",
        "Guardar estado de proceso y nota del responsable"
      ],
      validation: {
        required: "Complete este campo obligatorio.",
        email: "Ingrese una dirección de email válida.",
        consent: "Acepte la recopilación de información personal y el procesamiento de la consulta."
      },
      fields: {
        name: "Nombre",
        namePlaceholder: "Su nombre",
        organization: "Organización",
        organizationPlaceholder: "Institución o empresa",
        email: "Email",
        emailPlaceholder: "name@example.com",
        country: "País",
        countryPlaceholder: "País",
        message: "Mensaje",
        messagePlaceholder: "Cuéntenos su interés de colaboración",
        consent: "Acepto la recopilación de información personal y el procesamiento de la consulta."
      }
    },
    login: {
      eyebrow: "Inicio Seguro",
      lead: "Inicie sesión para acceder a My Page y a sus registros de certificación.",
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Contraseña",
      passwordPlaceholder: "Contraseña",
      submitCta: "Iniciar Sesión",
      forgotPassword: "¿Olvidó su contraseña?",
      backToLogin: "Volver al inicio de sesión",
      resetCta: "Enviar instrucciones de restablecimiento",
      note: "Después de iniciar sesión, puede revisar su perfil, certificaciones e historial de consultas.",
      successTitle: "Sesión iniciada.",
      successMessage: "Redirigiendo al espacio correspondiente.",
      resetSuccessTitle: "Instrucciones enviadas.",
      resetSuccessMessage: "Las instrucciones para restablecer la contraseña se enviaron a su email.",
      configurationError: "El inicio de sesión aún no está conectado. Contacte al administrador.",
      rateLimitError: "Se superó el límite de emails de restablecimiento. Inténtelo de nuevo más tarde.",
      validation: {
        emailRequired: "Ingrese su email.",
        emailInvalid: "Ingrese una dirección de email válida.",
        passwordRequired: "Ingrese su contraseña.",
        passwordLength: "La contraseña debe tener al menos 8 caracteres."
      }
    },
    signup: {
      eyebrow: "Crear Cuenta",
      title: "Crear Cuenta",
      lead: "Cree una cuenta para consultar certificaciones e historial de consultas.",
      name: "Nombre",
      namePlaceholder: "Su nombre",
      email: "Email",
      emailPlaceholder: "name@example.com",
      phone: "Telefono",
      phonePlaceholder: "+34 000 000 000",
      country: "País",
      countryPlaceholder: "Seleccione pais",
      interestedCourse: "Programa de interes",
      interestedCoursePlaceholder: "Seleccione un programa",
      marketingConsent: "Acepto recibir novedades de formacion y consulta.",
      password: "Contraseña",
      passwordPlaceholder: "Al menos 8 caracteres",
      confirmPassword: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Ingrese la contraseña nuevamente",
      consent: "Acepto la recopilación de información personal y la creación de cuenta.",
      submitCta: "Crear Cuenta",
      loginCta: "¿Ya tiene una cuenta?",
      note: "El registro abierto está habilitado. Si se requiere confirmación por email, use el enlace recibido en su bandeja.",
      successTitle: "Registro enviado.",
      successMessage: "Si se requiere confirmación por email, use el enlace recibido para terminar de crear su cuenta.",
      configurationError: "El registro aún no está conectado. Contacte al administrador.",
      rateLimitError: "Se superó el límite de envío de emails. Inténtelo de nuevo más tarde o contacte al administrador.",
      existingAccountError: "Este email ya está registrado. Inicie sesión o restablezca su contraseña.",
      validation: {
        required: "Complete este campo obligatorio.",
        email: "Ingrese una dirección de email válida.",
        passwordLength: "La contraseña debe tener al menos 8 caracteres.",
        passwordMatch: "Las contraseñas no coinciden.",
        consent: "Acepte la recopilación de información personal y la creación de cuenta."
      }
    },
    account: {
      eyebrow: "Área de Cuenta Protegida",
      lead: "Esta área personal está disponible solo para miembros con sesión iniciada.",
      overviewTitle: "Resumen de Cuenta",
      overviewLead: "Revise su perfil, certificaciones e historial de consultas en un solo lugar.",
      profileStatus: {
        ready: "Listo",
        empty: "Incompleto"
      },
      countSuffix: "",
      noindexStatus: "Privado",
      nav: [
        { title: "My Page", href: "account", description: "Resumen de cuenta" },
        { title: "Perfil", href: "account/profile", description: "Información de miembro" },
        { title: "Consulta de Certificación", href: "account/certifications", description: "Registros de certificación" },
        { title: "Historial de Consultas", href: "account/inquiries", description: "Consultas enviadas" }
      ],
      profile: {
        title: "Perfil",
        lead: "Revise y actualice su información de miembro.",
        editTitle: "Editar Perfil",
        editLead: "Actualice su nombre, telefono, pais, programa de interes e idioma preferido.",
        saveCta: "Guardar",
        successTitle: "Perfil guardado.",
        successMessage: "La información de miembro se actualizó correctamente.",
        validation: {
          required: "Complete este campo obligatorio.",
          email: "Ingrese una dirección de email válida."
        },
        fields: [
          { label: "Nombre", value: "KHCPQA Demo Member" },
          { label: "Email", value: "member@example.com" },
          { label: "Telefono", value: "+34 000 000 000" },
          { label: "País", value: "Korea" },
          { label: "Programa de interes", value: "Certificacion Nacional de Especialista en Cuidado de la Piel" },
          { label: "Consentimiento marketing", value: "Aceptado" },
          { label: "Idioma preferido", value: "Español" }
        ]
      },
      certifications: {
        title: "Consulta de Certificación",
        lead: "Revise sus certificaciones y detalles de verificación.",
        lookupTitle: "Búsqueda de Certificado",
        lookupLead: "Ingrese el número de certificado y el código de verificación para confirmar un registro coincidente.",
        numberLabel: "Certificado No.",
        numberPlaceholder: "SMC-2026-001",
        verificationCodeLabel: "Código de verificación",
        verificationCodePlaceholder: "PUBLIC-CODE-001",
        issuedLabel: "Fecha de emisión",
        statusLabel: "Estado",
        courseLabel: "Programa",
        lookupCta: "Consultar",
        lookupSuccessTitle: "Registro de certificación encontrado.",
        lookupEmptyTitle: "No hay registro coincidente.",
        lookupEmptyMessage: "Revise el número de certificado y el código de verificación.",
        demoHint: "Ejemplo: SMC-2026-001 / PUBLIC-CODE-001",
        emptyState: "No hay certificaciones registradas.",
        emptyGuide: "Si tiene un número de certificado, puede consultarlo ahora. Si no, revise primero los programas."
      },
      inquiries: {
        title: "Historial de Consultas",
        lead: "Vista de usuario para consultas de asociación y estado de solicitudes.",
        allLabel: "Todo",
        receiptLabel: "No. de recepción",
        typeLabel: "Tipo de consulta",
        messageLabel: "Mensaje",
        emptyState: "No hay consultas con este estado.",
        statusLabel: "Estado",
        submittedLabel: "Enviado",
        items: [
          {
            receipt: "KHCPQA-2026-PREVIEW",
            title: "Consulta de acuerdo de formación para socios internacionales",
            type: "partner",
            message: "Consultó sobre alianzas curriculares y envío de instructores con una institución educativa extranjera.",
            submittedAt: "2026-07-04",
            status: "Recibido"
          },
          {
            receipt: "KHCPQA-2026-COURSE",
            title: "Consulta sobre programa de aromaterapia",
            type: "course",
            message: "Consultó duración del programa regular de aromaterapia y criterios de finalización.",
            submittedAt: "2026-06-28",
            status: "Preparando respuesta"
          }
        ]
      },
      modules: [
        { title: "Perfil", body: "Revise y edite nombre, email, país e idioma preferido." },
        { title: "Consulta de Certificación", body: "Muestra nombre del programa, fecha de emisión y estado a partir de datos de certificación de muestra." },
        { title: "Historial de Consultas", body: "Revise las consultas enviadas por el usuario." },
        { title: "Noindex", body: "Las páginas de cuenta se bloquean para indexación en motores de búsqueda." }
      ],
      certificates: [
        { title: "Certificación Nacional de Estética", number: "SMC-2026-001", issuedAt: "2026-05-18", status: "Activo", verificationCode: "PUBLIC-CODE-001" },
        { title: "Aromaterapia", number: "SMC-2026-014", issuedAt: "2026-06-21", status: "Revisión pendiente", verificationCode: "PUBLIC-CODE-014" }
      ]
    },
    curriculumCatalog: {
      searchLabel: "Buscar currículo",
      searchPlaceholder: "Buscar cursos",
      categoryLabel: "Categorías de curso",
      categories: {
        all: "Todo",
        certification: "Certificación",
        professional: "Programas por Objetivo",
        practical: "Programa Práctico"
      },
      goalTitle: "Programas Recomendados por Objetivo",
      goalLead: "Programas diseñados según empleo, emprendimiento, limitaciones de horario y objetivos de cada estudiante.",
      catalogTitle: "Programas Prácticos y de Certificación",
      catalogLead: "Explore formación técnica y programas de certificación para aplicación en campo.",
      emptyState: "Ningún programa coincide con los filtros. Ajuste la palabra clave o la categoría.",
      viewDetails: "Ver Detalles",
      courseCountLabel: "cursos",
      consultAriaLabel: "Asesoría de programas",
      consultTitle: "¿Necesita ayuda para elegir un programa?",
      consultLead: "Le ayudamos a conectar sus objetivos y habilidades actuales con la ruta adecuada de empleo, emprendimiento o aprendizaje de fin de semana.",
      consultCta: "Solicitar asesoría"
    }
  }
} satisfies Record<Locale, Copy>;

const courseTitleTranslations = [
  { ko: "취업전문과정", en: "Employment Preparation Track", es: "Ruta de Preparación Laboral", sourcePath: "curriculum05.asp", categoryKey: "professional" },
  { ko: "창업전문과정", en: "Business Startup Track", es: "Ruta de Emprendimiento", sourcePath: "curriculum06.asp", categoryKey: "professional" },
  { ko: "주말반/취미반", en: "Weekend and Hobby Class", es: "Clase de Fin de Semana y Hobby", sourcePath: "curriculum07.asp", categoryKey: "professional" },
  { ko: "얼굴축소경락", en: "Facial Contouring Meridian Care", es: "Cuidado Meridiano de Contorno Facial", sourcePath: "curriculum08.asp", categoryKey: "practical" },
  { ko: "메디컬 스킨케어", en: "Medical Skin Care", es: "Cuidado Médico de la Piel", sourcePath: "curriculum09.asp", categoryKey: "practical" },
  { ko: "아로마 마사지", en: "Aroma Massage", es: "Masaje Aromático", sourcePath: "curriculum10.asp", categoryKey: "practical" },
  { ko: "경락 마사지", en: "Meridian Massage", es: "Masaje Meridiano", sourcePath: "curriculum11.asp", categoryKey: "practical" },
  { ko: "스포츠 마사지", en: "Sports Massage", es: "Masaje Deportivo", sourcePath: "curriculum12.asp", categoryKey: "practical" },
  { ko: "발 마사지", en: "Foot Massage", es: "Masaje de Pies", sourcePath: "curriculum13.asp", categoryKey: "practical" },
  { ko: "산모 마사지", en: "Maternity Massage", es: "Masaje para Embarazadas", sourcePath: "curriculum14.asp", categoryKey: "practical" },
  { ko: "베이비 마사지", en: "Baby Massage", es: "Masaje Infantil", sourcePath: "curriculum15.asp", categoryKey: "practical" },
  { ko: "타이 마사지", en: "Thai Massage", es: "Masaje Tailandés", sourcePath: "curriculum16.asp", categoryKey: "practical" },
  { ko: "카이로프랙틱", en: "Chiropractic", es: "Quiropráctica", sourcePath: "curriculum17.asp", categoryKey: "practical" },
  { ko: "스웨디시", en: "Swedish Massage", es: "Masaje Sueco", sourcePath: "curriculum19.asp", categoryKey: "practical" },
  { ko: "스파 테라피", en: "Spa Therapy", es: "Terapia de Spa", sourcePath: "curriculum20.asp", categoryKey: "practical" },
  { ko: "브라질리언 왁싱", en: "Brazilian Waxing", es: "Depilación Brasileña", sourcePath: "curriculum21.asp", categoryKey: "practical" },
  { ko: "병원 코디네이터", en: "Hospital Coordinator", es: "Coordinador Hospitalario", sourcePath: "curriculum22.asp", categoryKey: "practical" },
  {
    ko: "피부미용사",
    en: "Esthetician",
    es: "Estética",
    sourcePath: "curriculum01.asp",
    categoryKey: "certification"
  }
] satisfies Array<Record<LegacyContentLocale, string> & { sourcePath: string; categoryKey: Exclude<CourseCategory, "all"> }>;

const courseImageBySlug: Record<string, string> = {
  "취업전문과정": "/assets/course-employment-consulting.jpg",
  "창업전문과정": "/assets/course-startup-consulting.jpg",
  "주말반-취미반": "/assets/course-weekend-hobby.jpg",
  "얼굴축소경락": "/assets/premium-course-facial-contouring.png",
  "메디컬-스킨케어": "/assets/premium-course-medical-skincare.png",
  "아로마-마사지": "/assets/premium-course-aroma.png",
  "경락-마사지": "/assets/premium-course-meridian.png",
  "스포츠-마사지": "/assets/premium-course-sports.png",
  "발-마사지": "/assets/premium-course-foot.png",
  "산모-마사지": "/assets/premium-course-maternity.png",
  "베이비-마사지": "/assets/premium-course-baby-massage.png",
  "타이-마사지": "/assets/premium-course-thai-massage.png",
  "카이로프랙틱": "/assets/premium-course-chiropractic.png",
  "스웨디시": "/assets/premium-course-swedish-massage.png",
  "스파-테라피": "/assets/premium-course-spa-therapy.png",
  "브라질리언-왁싱": "/assets/premium-course-brazilian-waxing.png",
  "병원-코디네이터": "/assets/premium-course-hospital-coordinator.png",
  "피부미용사": "/assets/premium-course-swedish.png"
};

type CourseDetailSection = {
  title: string;
  items: string[];
  variant?: "cards" | "chips" | "income" | "schedule";
};

type CourseText = {
  category: string;
  summary: string;
  overview: string;
  audience: string;
  curriculum: string[];
  certificationNote: string;
  durationHighlights?: string[];
  keyMetrics?: Array<{ label: string; value: string }>;
  detailSections?: CourseDetailSection[];
};

const courseTextByLocale: Record<LegacyContentLocale, Record<Exclude<CourseCategory, "all">, CourseText>> = {
  ko: {
    certification: {
      category: "자격 과정",
      summary: "자격 취득과 강사 역량을 함께 준비하는 KAHC 기준 교육 과정입니다.",
      overview:
        "기존 SMC365 교육 콘텐츠를 KAHC 글로벌 플랫폼 구조에 맞춰 정리한 과정입니다. 과정 개요, 실습 흐름, 자격 또는 수료 안내를 한 화면에서 확인할 수 있도록 설계합니다.",
      audience: "전문 자격 취득을 준비하는 교육생, 현직 종사자, 강사 과정 지원자",
      curriculum: ["과정 오리엔테이션과 기본 이론", "전문 실습 시연 및 단계별 훈련", "현장 적용 사례와 고객 응대 기준", "수료 또는 자격 취득 준비 체크"],
      certificationNote: "자격 취득 또는 수료 기준은 과정별 운영 정책과 관리자 등록 데이터에 따라 안내됩니다."
    },
    professional: {
      category: "목표별 과정",
      summary: "취업, 창업, 주말 학습처럼 수강 목적에 맞춰 실무 과목과 학습 흐름을 설계합니다.",
      overview:
        "단일 기술 과목이 아니라 수강생의 목적에 맞춰 필요한 실무 과목, 학습 기간, 상담 방향을 조합하는 목표형 과정입니다. 취업 준비, 창업 준비, 시간 제약이 있는 입문 학습을 서로 다른 흐름으로 안내합니다.",
      audience: "취업·창업·시간제 학습을 목표로 하는 예비 전문가",
      curriculum: ["수강 목적과 현재 역량 진단", "목표에 맞는 실무 과목 조합 설계", "취업·창업·주말 학습별 실습 플랜", "상담을 통한 진로와 후속 과정 안내"],
      certificationNote: "목표별 과정은 상담을 통해 포함 과목과 운영 기간이 달라질 수 있으며, 세부 수료 기준은 선택 과목에 따라 안내됩니다."
    },
    practical: {
      category: "실무 프로그램",
      summary: "건강·미용·웰니스 현장에서 활용할 수 있는 실습 중심 프로그램입니다.",
      overview:
        "현장에서 바로 활용할 수 있는 테크닉을 중심으로 구성한 실습 프로그램입니다. 기술 이해, 시연, 반복 훈련, 고객 응대 기준을 함께 다룹니다.",
      audience: "현장 실무 기술을 보완하려는 웰니스·뷰티·헬스케어 분야 교육생",
      curriculum: ["기술 원리와 안전 기준", "전문가 시연 및 단계별 실습", "고객 유형별 적용 사례", "현장 적용 체크리스트"],
      certificationNote: "수료 또는 자격 연계 여부는 과정별 운영 정책에 따라 안내됩니다."
    }
  },
  en: {
    certification: {
      category: "Certification",
      summary: "A KAHC-standard program designed to prepare trainees for certification and instructor-level capability.",
      overview:
        "This program reorganizes existing SMC365 education content for the KAHC global platform, presenting the program overview, practice flow, and certification or completion guidance in one place.",
      audience: "Trainees preparing for professional certification, active practitioners, and instructor-track applicants",
      curriculum: ["Program orientation and core theory", "Professional demonstrations and step-by-step practice", "Field application cases and client response standards", "Completion or certification readiness check"],
      certificationNote: "Certification or completion requirements are guided by each program's operating policy and admin-managed data."
    },
    professional: {
      category: "Goal-Based Program",
      summary: "A goal-based pathway that combines practical subjects around employment, startup preparation, or weekend study.",
      overview:
        "This is not a single technique course. It combines practical subjects, learning duration, and advising according to each learner's goal, including employment preparation, startup preparation, or schedule-friendly introductory study.",
      audience: "Prospective professionals preparing for employment, startup, or part-time learning goals",
      curriculum: ["Goal and current-skill assessment", "Practical subject combination by objective", "Practice plan for employment, startup, or weekend learning", "Advising for career direction and follow-up programs"],
      certificationNote: "Included subjects and duration may differ after consultation. Completion criteria are guided according to the selected subjects."
    },
    practical: {
      category: "Practical Program",
      summary: "A practice-centered program for techniques used in health, beauty, and wellness settings.",
      overview:
        "This hands-on program focuses on field-ready techniques, covering technical understanding, demonstrations, repeated practice, and client response standards.",
      audience: "Wellness, beauty, and healthcare trainees who want to strengthen practical field techniques",
      curriculum: ["Technical principles and safety standards", "Expert demonstrations and step-by-step practice", "Application cases by client type", "Field application checklist"],
      certificationNote: "Completion or certification linkage is guided by the operating policy for each program."
    }
  },
  es: {
    certification: {
      category: "Certificación",
      summary: "Un programa con estándar KAHC para preparar la certificación y capacidades de nivel instructor.",
      overview:
        "Este programa reorganiza el contenido educativo existente de SMC365 para la plataforma global KAHC, presentando resumen, flujo de práctica y guía de certificación o finalización en un solo lugar.",
      audience: "Estudiantes que preparan una certificación profesional, profesionales activos y aspirantes a instructor",
      curriculum: ["Orientación del programa y teoría central", "Demostraciones profesionales y práctica paso a paso", "Casos de aplicación en campo y estándares de atención", "Revisión de preparación para finalización o certificación"],
      certificationNote: "Los requisitos de certificación o finalización se guían por la política operativa de cada programa y los datos gestionados por administración."
    },
    professional: {
      category: "Programa por Objetivo",
      summary: "Una ruta que combina asignaturas prácticas según empleo, emprendimiento o estudio de fin de semana.",
      overview:
        "No es un curso de una sola técnica. Combina asignaturas prácticas, duración de aprendizaje y asesoría según el objetivo de cada estudiante: empleo, emprendimiento o estudio introductorio con limitaciones de horario.",
      audience: "Futuros profesionales que se preparan para empleo, emprendimiento o aprendizaje parcial",
      curriculum: ["Evaluación de objetivo y nivel actual", "Combinación de asignaturas prácticas por objetivo", "Plan de práctica para empleo, emprendimiento o fin de semana", "Asesoría sobre ruta profesional y programas posteriores"],
      certificationNote: "Las asignaturas incluidas y la duración pueden variar tras la consulta. Los criterios de finalización se guían según las asignaturas seleccionadas."
    },
    practical: {
      category: "Programa Práctico",
      summary: "Un programa centrado en práctica para técnicas usadas en salud, belleza y bienestar.",
      overview:
        "Este programa práctico se centra en técnicas listas para el campo, cubriendo comprensión técnica, demostraciones, práctica repetida y estándares de atención al cliente.",
      audience: "Estudiantes de bienestar, belleza y salud que desean fortalecer técnicas prácticas de campo",
      curriculum: ["Principios técnicos y estándares de seguridad", "Demostraciones expertas y práctica paso a paso", "Casos de aplicación por tipo de cliente", "Lista de verificación para aplicación en campo"],
      certificationNote: "La finalización o vinculación con certificación se guía por la política operativa de cada programa."
    }
  }
};

const courseOverridesByLocale: Record<LegacyContentLocale, Partial<Record<string, Partial<CourseText>>>> = {
  ko: {
    "취업전문과정": {
      summary: "취업 경쟁력을 높이기 위해 현장 실무 테크닉, 고객 응대, 매너까지 함께 훈련하는 목표형 과정입니다.",
      overview:
        "취업전문과정은 취업 현장에서 바로 고객 관리를 맡을 수 있도록 종목별 실무 테크닉을 집중적으로 익히는 과정입니다. 고급 기술 습득과 함께 고객 관리, 예의, 매너를 함께 다루어 실무 직장 적응력을 높이는 흐름으로 구성됩니다.",
      audience: "뷰티·웰니스 분야 취업을 준비하며 여러 실무 테크닉을 조합해 경쟁력을 만들고 싶은 교육생",
      curriculum: [
        "취업 목표와 희망 분야 상담",
        "아로마경락, 스웨디시, 스포츠, 발 관리 등 실무 테크닉 조합 설계",
        "고객 관리, 응대 매너, 현장 실습 기준 훈련",
        "취업 가능 분야와 후속 과정 상담"
      ],
      certificationNote:
        "교육 기간은 2주 단기, 1개월 속성, 2개월 정규 과정으로 안내되며 세부 운영은 상담과 선택 과목에 따라 달라질 수 있습니다.",
      durationHighlights: ["2주 단기 교육", "1개월 속성 교육", "2개월 정규 교육"],
      keyMetrics: [
        { label: "교육 형태", value: "취업 전문" },
        { label: "기간", value: "2주~2개월" },
        { label: "연계 분야", value: "12개 영역" }
      ],
      detailSections: [
        {
          title: "주요 교육 종목",
          variant: "chips",
          items: [
            "아로마경락 마사지",
            "산모 마사지",
            "국가자격증",
            "스웨디시 마사지",
            "얼굴축소경락",
            "브라질리언 왁싱",
            "스포츠 마사지",
            "피부관리 샬롱테크닉",
            "병원 코디네이터",
            "발 마사지",
            "메디컬 스킨케어",
            "카이로 체형관리"
          ]
        },
        {
          title: "추천 과목 조합",
          items: [
            "스웨디시 + 왁싱 + 아로마경락 + 스포츠",
            "아로마경락 + 아로마테라피 + 스킨케어",
            "스포츠 + 경락 + 발 + 스웨디시",
            "산모 + 아로마경락 + 얼굴축소"
          ]
        },
        {
          title: "취업 및 진로 방향",
          items: [
            "고급 스웨디시, 호텔 스파샵, 전문 스포츠마사지샵 취업 연계",
            "전문 마사지샵, 뷰티샵, 병원·산부인과, 산후조리원 분야 진출",
            "프리랜서 활동 또는 1인 마사지샵 운영 상담"
          ]
        },
        {
          title: "취업 월 예상 수입",
          variant: "income",
          items: [
            "A타입 상담 기준: 월 800만원 ~ 1,000만원 안내",
            "B타입 상담 기준: 월 500만원 ~ 800만원 안내",
            "예상 수입은 샵 지역, 시설, 마케팅, 운영 방식에 따라 달라질 수 있습니다."
          ]
        },
        {
          title: "진출분야 및 활동영역",
          items: [
            "1인 샵 또는 출장 산후마사지 관리 오픈 운영",
            "고급 스웨디시, 호텔 스파샵, 스포츠마사지샵 취업",
            "병원, 산부인과, 산후조리원, 타이마사지샵, 대형 스파찜질방 연계"
          ]
        },
        {
          title: "강의시간 안내",
          variant: "schedule",
          items: [
            "속성반: 월~금 10시~13시 또는 14시~17시",
            "오전반: 월~금 10시~13시 / 오후반: 월~금 14시~17시",
            "야간반: 월·수·금 19시~21시"
          ]
        },
        {
          title: "연계 강의안내",
          items: [
            "피부미용사 국가자격증, 얼굴축소경락, 아로마 테라피",
            "경락 마사지, 스포츠 마사지, 발 마사지",
            "스웨디시, 산모 마사지 등 취업 목적에 맞춰 선택 상담"
          ]
        }
      ]
    },
    "창업전문과정": {
      summary: "창업에 필요한 실무 테크닉, 입지 선정, 마케팅, 운영 노하우를 함께 설계하는 목표형 과정입니다.",
      overview:
        "창업전문과정은 고급 실무기술과 고객 관리 역량을 기반으로 샵 콘셉트, 입지 선정, 인테리어, 비품·재료 선택, 직원 수급과 서비스 교육, 운영관리까지 신규 오픈에 필요한 흐름을 종합적으로 안내합니다. 졸업생 창업 사례와 샵 운영 노하우를 참고해 현실적인 창업 준비를 돕습니다.",
      audience: "1인 창업, 신규 샵 오픈, 기존 샵 인수를 준비하며 실무와 운영을 함께 배우고 싶은 교육생",
      curriculum: [
        "창업 목표와 희망 업종 진단",
        "고객 선호도가 높은 인기 관리 프로그램 조합 설계",
        "입지 선정, 비용 절감 인테리어, 비품·재료 선택 체크",
        "운영관리, 직원 교육, 마케팅과 경영 노하우 상담"
      ],
      certificationNote:
        "창업 준비 범위와 예상 수익은 지역, 시설, 상권, 마케팅, 운영 방식에 따라 달라질 수 있으며 세부 내용은 상담을 통해 안내됩니다.",
      durationHighlights: ["창업 준비 상담", "샵 오픈 설계", "운영관리 코칭"],
      keyMetrics: [
        { label: "교육 형태", value: "창업 전문" },
        { label: "준비 범위", value: "16개 체크" },
        { label: "오픈 유형", value: "1인·샵 오픈" }
      ],
      detailSections: [
        {
          title: "주요 교육 종목",
          variant: "chips",
          items: [
            "아로마경락 마사지",
            "산모 마사지",
            "국가자격증",
            "스웨디시 마사지",
            "얼굴축소경락",
            "브라질리언 왁싱",
            "스포츠 마사지",
            "피부관리 샬롱테크닉",
            "병원 코디네이터",
            "발 마사지",
            "메디컬 스킨케어",
            "카이로 체형관리"
          ]
        },
        {
          title: "창업 준비 체크포인트",
          items: [
            "경쟁력 있는 기술과 단골고객 확보·관리 방법",
            "수익형 콘셉트와 프로그램 설계, 입지·점포 위치 선정",
            "사업자등록, 비용절감 마케팅, 인테리어와 비품·재료 선택",
            "직원 수급·기술점검, 힐링프로그램 시스템, 경영 노하우와 운영관리"
          ]
        },
        {
          title: "오픈 형태",
          items: [
            "스웨디시 + 왁싱 + 아로마경락 + 스포츠",
            "아로마경락 + 아로마테라피 + 스킨케어",
            "스포츠 + 경락 + 발 + 스웨디시",
            "오피스텔 오픈, 일반상가 오픈, 신규 샵 또는 기존 샵 인수"
          ]
        },
        {
          title: "샵 창업 월 예상 매출",
          variant: "income",
          items: [
            "A타입 상담 기준: 월 8,000만원 ~ 1억원 안내",
            "B타입 상담 기준: 월 5,000만원 ~ 8,000만원 안내",
            "예상 매출은 샵 지역, 시설, 마케팅, 운영 방식에 따라 달라질 수 있습니다."
          ]
        },
        {
          title: "1인 창업 월 예상 수입",
          variant: "income",
          items: [
            "A타입 상담 기준: 월 1,500만원 ~ 2,000만원 안내",
            "B타입 상담 기준: 월 1,000만원 ~ 1,500만원 안내",
            "예상 수입은 운영 형태와 고객 확보 방식에 따라 달라질 수 있습니다."
          ]
        },
        {
          title: "강의시간 안내",
          variant: "schedule",
          items: [
            "속성반: 월~금 10시~13시 또는 14시~17시",
            "오전반: 월~금 10시~13시 / 오후반: 월~금 14시~17시",
            "야간반: 월·수·금 19시~21시"
          ]
        },
        {
          title: "연계 강의안내",
          items: [
            "피부미용사 국가자격증, 얼굴축소경락, 아로마 테라피",
            "경락 마사지, 스포츠 마사지, 발 마사지",
            "스웨디시, 산모 마사지 등 창업 콘셉트에 맞춰 선택 상담"
          ]
        }
      ]
    },
    "주말반/취미반": {
      summary: "평일 시간이 어려운 수강생과 취미로 실무 관리를 배우고 싶은 입문자를 위한 주말 집중 과정입니다.",
      overview:
        "주말반/취미반은 이직을 준비하거나 취미로 피부·마사지 실무를 배우고 싶은 분들이 토요일 또는 일요일에 집중적으로 수강할 수 있도록 구성한 과정입니다. 오전·오후 시간대를 나누어 생활 일정에 맞춰 기본 실무와 관심 과목을 선택해 배울 수 있습니다.",
      audience: "평일 수강이 어려운 직장인, 이직 준비생, 취미로 뷰티·웰니스 관리를 배우려는 입문자",
      curriculum: [
        "수강 목적과 가능한 요일·시간 상담",
        "피부미용, 아로마, 경락, 스포츠, 발 관리 등 관심 과목 선택",
        "주말 오전·오후 집중 실습",
        "취미 학습 또는 후속 취업·창업 과정 연계 상담"
      ],
      certificationNote:
        "주말반/취미반은 토요일 또는 일요일 오전·오후 시간대로 운영되며, 세부 과목과 수료 기준은 선택 과목과 상담 결과에 따라 안내됩니다.",
      durationHighlights: ["토요일반", "일요일반", "오전·오후 선택"],
      keyMetrics: [
        { label: "교육 형태", value: "주말 집중" },
        { label: "요일", value: "토·일" },
        { label: "시간", value: "10시~17시" }
      ],
      detailSections: [
        {
          title: "추천 대상",
          items: [
            "평일 수업 참여가 어려운 직장인과 예비 전직자",
            "피부·마사지 관리를 취미로 배우고 싶은 입문자",
            "후속 취업·창업 과정 전 기초 실무를 경험해보고 싶은 수강생"
          ]
        },
        {
          title: "선택 가능 과목",
          variant: "chips",
          items: [
            "피부미용사",
            "얼굴축소경락",
            "메디컬 스킨케어",
            "아로마 테라피",
            "경락 마사지",
            "스포츠 마사지",
            "발 마사지",
            "스웨디시",
            "산모 마사지"
          ]
        },
        {
          title: "학습 흐름",
          items: [
            "관심 과목과 수강 목적 상담",
            "기본 이론과 관리 순서 이해",
            "전문가 시연 후 단계별 실습",
            "취미 활용 또는 심화 과정 연결"
          ]
        },
        {
          title: "활용 방향",
          items: [
            "가족·지인 케어를 위한 취미 실습",
            "뷰티·웰니스 분야 이직 전 기초 경험",
            "취업전문과정 또는 창업전문과정으로 확장 상담"
          ]
        },
        {
          title: "연계 강의안내",
          items: [
            "피부미용사 국가자격증, 얼굴축소경락, 아로마 테라피",
            "경락 마사지, 스포츠 마사지, 발 마사지",
            "스웨디시, 산모 마사지 등 관심 분야에 맞춰 선택 상담"
          ]
        },
        {
          title: "주말 강의시간 안내",
          variant: "schedule",
          items: [
            "토요일반: 10시~13시 또는 14시~17시",
            "일요일반: 10시~13시 또는 14시~17시",
            "상담 안내: 과목별 운영 시간은 개설 일정에 따라 달라질 수 있습니다."
          ]
        }
      ]
    },
    "얼굴축소경락": {
      summary: "피부 유형 분석부터 얼굴축소 경락마사지, 매뉴얼 테크닉, 고객 응대까지 연결하는 실무 과정입니다.",
      overview:
        "얼굴축소경락은 피부 상태와 얼굴 윤곽 고민을 분석하고, 클렌징·딥 클렌징·팩·미용기기·경락마사지·매뉴얼 테크닉을 단계적으로 익히는 과정입니다. 원본의 정규·속성 커리큘럼 흐름을 살려 이론보다 현장 실습과 고객 관리 능력에 집중하도록 구성했습니다.",
      audience: "피부관리실 취업, 피부미용 샵 창업, 얼굴 윤곽·피부관리 실무 역량을 준비하는 수강생",
      curriculum: [
        "피부 유형 분석과 고객 상담 차트 작성",
        "클렌징, 딥 클렌징, 팩·마스크, 기능성 제품 선택",
        "얼굴축소 경락마사지와 매뉴얼 테크닉 2인 1조 실습",
        "고객 응대, 예절, 위생, 이미지 관리와 취업·창업 진로 상담"
      ],
      certificationNote:
        "정규코스는 2개월, 속성코스는 1개월 기준으로 안내되며 교육시간은 10시~13시, 14시~17시, 19시~21시 시간대에서 상담 후 조정됩니다.",
      durationHighlights: ["정규 2개월", "속성 1개월", "10시·14시·19시"],
      keyMetrics: [
        { label: "교육 형태", value: "실무 테크닉" },
        { label: "기간", value: "1~2개월" },
        { label: "실습 방식", value: "2인 1조" }
      ],
      detailSections: [
        {
          title: "정규 코스 로드맵",
          variant: "schedule",
          items: [
            "1개월: 피부미용 분석·상담, 클렌징과 딥 클렌징, 피부유형별 화장품 선택, 팩·마스크 관리",
            "2개월: 미용기기 사용, 얼굴축소 경락마사지와 매뉴얼 테크닉, 기능성 제품 특수관리, 관리사 기본교육",
            "교육시간: 10시~13시, 14시~17시, 19시~21시"
          ]
        },
        {
          title: "속성 코스 로드맵",
          variant: "schedule",
          items: [
            "1주차: 오리엔테이션, 피부유형 분석, 고객 상담, 클렌징과 딥 클렌징",
            "2~3주차: 화장품·팩·마스크 선택, 미용기기 사용, 얼굴축소 경락마사지 집중 실습",
            "4주차: 미백·주름·얼굴축소·비타민·한방 팩 등 특수관리와 관리사 이미지 교육"
          ]
        },
        {
          title: "핵심 실무 테크닉",
          variant: "chips",
          items: [
            "피부유형 분석",
            "고객 상담 차트",
            "클렌징",
            "딥 클렌징",
            "팩·마스크",
            "미용기기 사용",
            "얼굴축소 경락마사지",
            "매뉴얼 테크닉",
            "기능성 제품",
            "예절·이미지 관리"
          ]
        },
        {
          title: "교육 특징",
          items: [
            "단체 지도, 일대일 개인지도, 2인 1조 상호 실습을 병행",
            "실무 중심 문제 해결 학습으로 원리와 이론을 자연스럽게 연결",
            "취업 시 필요한 고객 응대, 소양교육, 예절교육까지 함께 훈련"
          ]
        },
        {
          title: "피부 고민 대응",
          items: [
            "여드름, 모공, 기미·색소침착, 잔주름과 노화 피부 관리 이해",
            "민감성·건성 피부의 자극 요인과 타입별 제품 선택",
            "수분 공급, 혈액순환, 탄력 유지, 피부 톤 개선을 목표로 한 관리 흐름"
          ]
        },
        {
          title: "관리 태도와 위생",
          items: [
            "고객이 편안한 자세를 취하도록 안내하고 압의 강약을 확인",
            "관리사는 손톱, 손 위생, 복장, 호흡과 자세를 안정적으로 유지",
            "얼굴축소경락 관리 시 속도, 힘의 원리, 호흡 조절을 반복 훈련"
          ]
        },
        {
          title: "진출 분야",
          items: [
            "피부미용전문관리샵, 피부미용학원 강사, 한의원·피부과·성형외과 부속 관리실",
            "산후조리원 부설 관리실, 뷰티샵·마사지샵 창업, 토탈미용실",
            "호텔·스파·스포츠센터 관리실, 개인관리실 창업, 해외취업 및 해외창업 상담"
          ]
        }
      ]
    },
    "메디컬 스킨케어": {
      summary: "문제성 피부 진단, 전문 기기, 제품 분석, 핸드테크닉을 연결해 현장 고객관리 능력을 기르는 과정입니다.",
      overview:
        "메디컬 스킨케어는 피부 타입과 문제성 피부를 분석하고, 전문 피부미용기기와 제품·화장품, 핸드테크닉을 함께 활용해 피부 회복과 예방 관리를 돕는 실무 과정입니다. 원본의 정규·속성 커리큘럼을 최신 교육 상세 페이지 흐름으로 정리해, 이론과 샵 테크닉이 자연스럽게 연결되도록 구성했습니다.",
      audience: "피부과·성형외과 부속 관리실, 피부관리샵, 스킨케어 실무 취업·창업을 준비하는 수강생",
      curriculum: [
        "메디컬 스킨케어 정의, 목적, 효과, 관리 시 주의사항 이해",
        "피부 타입별 관리법과 문제성 피부 대응",
        "스킨 스크러버, 이온투입기, 고주파, 초음파 등 미용기기 실습",
        "클렌징, 매뉴얼 테크닉, 딥 클렌징, 실전 샵 테크닉과 고객 응대"
      ],
      certificationNote:
        "정규코스는 2개월, 속성코스는 1개월 기준으로 안내되며 교육시간은 10시~13시, 14시~17시, 19시~21시 시간대에서 상담 후 조정됩니다.",
      durationHighlights: ["정규 2개월", "속성 1개월", "기기·핸드테크닉"],
      keyMetrics: [
        { label: "교육 형태", value: "메디컬 케어" },
        { label: "기간", value: "1~2개월" },
        { label: "핵심", value: "기기+손기술" }
      ],
      detailSections: [
        {
          title: "정규 코스 로드맵",
          variant: "schedule",
          items: [
            "1개월: 메디컬 스킨케어 이론, 피부타입별 관리, 제품·화장품 분석, 스킨 스크러버·이온투입기",
            "2개월: 고주파·초음파 기계관리, 클렌징·매뉴얼 테크닉, 딥 클렌징, 호르몬 관리와 실전 샵 테크닉",
            "교육시간: 10시~13시, 14시~17시, 19시~21시"
          ]
        },
        {
          title: "속성 코스 로드맵",
          variant: "schedule",
          items: [
            "1주차: 메디컬 스킨케어 정의·목적·효과, 피부타입별 관리, 준비물과 주의사항",
            "2~3주차: 문제성 피부 관리, 스킨 스크러버·이온투입기, 고주파·초음파 실전 테크닉",
            "4주차: 클렌징, 매뉴얼 테크닉, 딥 클렌징, 호르몬 관리와 실전 샵 테크닉"
          ]
        },
        {
          title: "핵심 실무 테크닉",
          variant: "chips",
          items: [
            "피부타입 분석",
            "문제성 피부 관리",
            "제품·화장품 분석",
            "스킨 스크러버",
            "이온투입기",
            "고주파",
            "초음파",
            "클렌징",
            "매뉴얼 테크닉",
            "딥 클렌징",
            "호르몬 관리"
          ]
        },
        {
          title: "교육 특징",
          items: [
            "단체 지도, 일대일 개인지도, 2인 1조 상호 실습을 병행",
            "실무 중심 문제 해결 학습으로 기기 원리와 현장 테크닉을 연결",
            "전문 손기술과 피부미용기기를 결합해 고객관리 효과를 높이는 흐름"
          ]
        },
        {
          title: "피부 관리 범위",
          items: [
            "정상, 건성, 지성, 민감, 여드름, 아토피, 색소침착, 노화 피부 관리",
            "미백, 잡티, 트러블 관리 후 피부 회복과 예방 관리",
            "문제성 피부를 전문 기기와 제품 선택으로 체계적으로 관리"
          ]
        },
        {
          title: "관리 태도와 고객 응대",
          items: [
            "고객이 편안한 자세를 취하도록 안내하고 압의 강약을 확인",
            "관리사는 손톱, 손 위생, 복장, 호흡과 자세를 안정적으로 유지",
            "메디컬 스킨케어 관리 시 속도, 힘의 원리, 위생 기준을 반복 훈련"
          ]
        },
        {
          title: "진출 분야",
          items: [
            "성형외과·피부과·한의원·산부인과 부속 관리실",
            "산후조리원 부설 관리실, 피부미용전문관리샵, 피부미용학원 강사",
            "뷰티샵·마사지샵 창업, 호텔·스파·스포츠센터 관리실, 해외취업 및 해외창업 상담"
          ]
        }
      ]
    }
  },
  en: {
    "취업전문과정": {
      summary: "A job-focused pathway for practical techniques, client care, and workplace readiness.",
      overview:
        "This track prepares trainees to enter beauty and wellness workplaces with practical technique combinations, client-care standards, and professional manners. The program is planned around the learner's target field and current skill level.",
      audience: "Trainees preparing for employment in beauty, wellness, massage, spa, or related service fields",
      curriculum: [
        "Employment goal and target-field consultation",
        "Practical technique plan across aroma meridian, Swedish, sports, foot care, and related subjects",
        "Client-care, communication, and workplace-manner training",
        "Career-field guidance and follow-up program consultation"
      ],
      certificationNote:
        "Program duration may be guided as short-term, one-month intensive, or two-month regular training depending on consultation and selected subjects.",
      durationHighlights: ["Short-term training", "1-month intensive", "2-month regular"],
      keyMetrics: [
        { label: "Track", value: "Employment" },
        { label: "Duration", value: "2 weeks-2 months" },
        { label: "Fields", value: "12 areas" }
      ],
      detailSections: [
        {
          title: "Core Training Subjects",
          variant: "chips",
          items: [
            "Aroma meridian massage",
            "Maternity massage",
            "National certification",
            "Swedish massage",
            "Facial contouring care",
            "Brazilian waxing",
            "Sports massage",
            "Skin-care salon technique",
            "Hospital coordinator",
            "Foot massage",
            "Medical skin care",
            "Chiropractic body care"
          ]
        },
        {
          title: "Recommended Combinations",
          items: [
            "Swedish + waxing + aroma meridian + sports",
            "Aroma meridian + aromatherapy + skin care",
            "Sports + meridian + foot + Swedish",
            "Maternity + aroma meridian + facial contouring"
          ]
        },
        {
          title: "Career Direction",
          items: [
            "Premium Swedish, hotel spa, and sports massage shop employment",
            "Massage shops, boutique beauty shops, hospitals, maternity clinics, and postpartum care centers",
            "Freelance work or one-person shop operation consultation"
          ]
        },
        {
          title: "Expected Monthly Income",
          variant: "income",
          items: [
            "Type A consultation guide: KRW 8,000,000 to 10,000,000 per month",
            "Type B consultation guide: KRW 5,000,000 to 8,000,000 per month",
            "Actual income may vary by shop location, facilities, marketing, and operation."
          ]
        },
        {
          title: "Employment Fields",
          items: [
            "One-person shop operation or mobile postpartum care service",
            "Premium Swedish, hotel spa, and sports massage shop employment",
            "Hospitals, maternity clinics, postpartum care centers, Thai massage shops, and large spa facilities"
          ]
        },
        {
          title: "Class Time Guide",
          variant: "schedule",
          items: [
            "Intensive class: Mon-Fri 10:00-13:00 or 14:00-17:00",
            "Morning class: Mon-Fri 10:00-13:00 / Afternoon class: Mon-Fri 14:00-17:00",
            "Evening class: Mon, Wed, Fri 19:00-21:00"
          ]
        },
        {
          title: "Linked Course Guidance",
          items: [
            "National esthetician certification, facial contouring meridian care, aromatherapy",
            "Meridian massage, sports massage, and foot massage",
            "Swedish and maternity massage can be selected according to employment goals"
          ]
        }
      ]
    },
    "창업전문과정": {
      summary: "A startup-focused pathway covering practical techniques, shop planning, marketing, and operation.",
      overview:
        "This track combines advanced practical techniques with startup planning, including shop concept, location selection, interior planning, supplies, staffing, service training, marketing, and daily operation. It helps learners prepare a realistic opening plan using field-oriented guidance.",
      audience: "Trainees preparing for one-person business, new shop opening, or acquisition of an existing shop",
      curriculum: [
        "Startup goal and target business diagnosis",
        "Service menu planning around high-demand care programs",
        "Location, cost-conscious interior, supplies, and material checklist",
        "Operation, staff training, marketing, and business know-how consultation"
      ],
      certificationNote:
        "Startup scope and projected revenue may vary by location, facilities, trade area, marketing, and operation model. Details are guided through consultation.",
      durationHighlights: ["Startup consultation", "Shop opening plan", "Operation coaching"],
      keyMetrics: [
        { label: "Track", value: "Startup" },
        { label: "Checklist", value: "16 items" },
        { label: "Opening Type", value: "Solo / Shop" }
      ],
      detailSections: [
        {
          title: "Core Training Subjects",
          variant: "chips",
          items: [
            "Aroma meridian massage",
            "Maternity massage",
            "National certification",
            "Swedish massage",
            "Facial contouring care",
            "Brazilian waxing",
            "Sports massage",
            "Skin-care salon technique",
            "Hospital coordinator",
            "Foot massage",
            "Medical skin care",
            "Chiropractic body care"
          ]
        },
        {
          title: "Startup Checklist",
          items: [
            "Competitive technique and repeat-customer acquisition",
            "Revenue-oriented concept, program planning, and location selection",
            "Business registration, cost-conscious marketing, interior, supplies, and materials",
            "Staffing, skill checks, healing program system, business know-how, and operation management"
          ]
        },
        {
          title: "Opening Models",
          items: [
            "Swedish + waxing + aroma meridian + sports",
            "Aroma meridian + aromatherapy + skin care",
            "Sports + meridian + foot + Swedish",
            "Officetel opening, commercial shop opening, new shop or existing shop acquisition"
          ]
        },
        {
          title: "Projected Monthly Shop Revenue",
          variant: "income",
          items: [
            "Type A consultation guide: KRW 80,000,000 to 100,000,000 per month",
            "Type B consultation guide: KRW 50,000,000 to 80,000,000 per month",
            "Projected revenue may vary by shop location, facilities, marketing, and operation."
          ]
        },
        {
          title: "Projected Monthly Solo Income",
          variant: "income",
          items: [
            "Type A consultation guide: KRW 15,000,000 to 20,000,000 per month",
            "Type B consultation guide: KRW 10,000,000 to 15,000,000 per month",
            "Projected income may vary by operation model and customer acquisition."
          ]
        },
        {
          title: "Class Time Guide",
          variant: "schedule",
          items: [
            "Intensive class: Mon-Fri 10:00-13:00 or 14:00-17:00",
            "Morning class: Mon-Fri 10:00-13:00 / Afternoon class: Mon-Fri 14:00-17:00",
            "Evening class: Mon, Wed, Fri 19:00-21:00"
          ]
        },
        {
          title: "Linked Course Guidance",
          items: [
            "National esthetician certification, facial contouring meridian care, aromatherapy",
            "Meridian massage, sports massage, and foot massage",
            "Swedish and maternity massage can be selected according to the startup concept"
          ]
        }
      ]
    },
    "주말반/취미반": {
      summary: "A weekend-focused track for learners with weekday constraints or hobby-oriented practical study.",
      overview:
        "The Weekend and Hobby Class is designed for learners who want to prepare for a career change or study skin and massage care as a hobby while keeping weekday schedules. Saturday and Sunday morning or afternoon sessions allow learners to choose practical subjects around their interests.",
      audience: "Working adults, career-change learners, and beginners who want to study beauty and wellness care as a hobby",
      curriculum: [
        "Consultation on learning goal, available day, and schedule",
        "Subject selection across esthetics, aroma, meridian, sports, and foot care",
        "Focused weekend morning or afternoon practice",
        "Guidance toward hobby use or follow-up employment and startup tracks"
      ],
      certificationNote:
        "Weekend classes operate on Saturday or Sunday morning and afternoon blocks. Detailed subjects and completion standards are guided according to selected subjects and consultation.",
      durationHighlights: ["Saturday class", "Sunday class", "Morning / afternoon"],
      keyMetrics: [
        { label: "Track", value: "Weekend" },
        { label: "Days", value: "Sat / Sun" },
        { label: "Time", value: "10:00-17:00" }
      ],
      detailSections: [
        {
          title: "Recommended For",
          items: [
            "Working adults and career-change learners who cannot attend weekday classes",
            "Beginners who want to learn skin and massage care as a hobby",
            "Learners who want to experience practical basics before employment or startup tracks"
          ]
        },
        {
          title: "Selectable Subjects",
          variant: "chips",
          items: [
            "Esthetician",
            "Facial contouring care",
            "Medical skin care",
            "Aromatherapy",
            "Meridian massage",
            "Sports massage",
            "Foot massage",
            "Swedish massage",
            "Maternity massage"
          ]
        },
        {
          title: "Learning Flow",
          items: [
            "Consultation on interests and learning purpose",
            "Basic theory and care sequence understanding",
            "Expert demonstration and step-by-step practice",
            "Connection to hobby use or advanced courses"
          ]
        },
        {
          title: "How It Can Be Used",
          items: [
            "Hobby practice for family and acquaintances",
            "Introductory experience before career change in beauty and wellness",
            "Consultation toward employment or startup programs"
          ]
        },
        {
          title: "Linked Course Guidance",
          items: [
            "National esthetician certification, facial contouring meridian care, aromatherapy",
            "Meridian massage, sports massage, and foot massage",
            "Swedish and maternity massage can be selected by interest"
          ]
        },
        {
          title: "Weekend Class Time Guide",
          variant: "schedule",
          items: [
            "Saturday class: 10:00-13:00 or 14:00-17:00",
            "Sunday class: 10:00-13:00 or 14:00-17:00",
            "Consultation note: Subject schedules may vary by opening calendar."
          ]
        }
      ]
    },
    "얼굴축소경락": {
      summary: "A practical course connecting skin analysis, facial contouring meridian massage, manual technique, and client care.",
      overview:
        "Facial Contouring Meridian Care trains learners to analyze skin condition and facial-contour concerns, then practice cleansing, deep cleansing, masks, beauty devices, meridian massage, and manual techniques step by step. The original regular and intensive course flow is reorganized into a modern practical learning path.",
      audience: "Learners preparing for skin-care salon employment, beauty shop startup, or facial contouring and skin-care practice",
      curriculum: [
        "Skin-type analysis and client consultation chart practice",
        "Cleansing, deep cleansing, masks, and functional product selection",
        "Two-person practice for facial contouring meridian massage and manual techniques",
        "Client response, etiquette, hygiene, image management, and career guidance"
      ],
      certificationNote:
        "The regular course is guided as a two-month track and the intensive course as a one-month track. Class times are arranged through consultation around 10:00-13:00, 14:00-17:00, and 19:00-21:00 blocks.",
      durationHighlights: ["2-month regular", "1-month intensive", "10 / 14 / 19 time blocks"],
      keyMetrics: [
        { label: "Track", value: "Practical" },
        { label: "Duration", value: "1-2 months" },
        { label: "Practice", value: "Pair work" }
      ],
      detailSections: [
        {
          title: "Regular Course Roadmap",
          variant: "schedule",
          items: [
            "Month 1: skin analysis and consultation, cleansing and deep cleansing, skin-type cosmetics, pack and mask care",
            "Month 2: beauty-device use, facial contouring meridian massage and manual technique, functional product special care, therapist basics",
            "Class times: 10:00-13:00, 14:00-17:00, 19:00-21:00"
          ]
        },
        {
          title: "Intensive Course Roadmap",
          variant: "schedule",
          items: [
            "Week 1: orientation, skin-type analysis, client consultation, cleansing and deep cleansing",
            "Weeks 2-3: cosmetics, packs, masks, beauty-device practice, focused facial meridian massage practice",
            "Week 4: whitening, wrinkle, facial contouring, vitamin, herbal pack special care and therapist image training"
          ]
        },
        {
          title: "Core Practical Techniques",
          variant: "chips",
          items: [
            "Skin analysis",
            "Client chart",
            "Cleansing",
            "Deep cleansing",
            "Packs and masks",
            "Beauty devices",
            "Facial meridian massage",
            "Manual technique",
            "Functional products",
            "Etiquette and image"
          ]
        },
        {
          title: "Training Features",
          items: [
            "Group instruction, one-to-one coaching, and two-person mutual practice",
            "Problem-solving practice that connects technique principles with theory",
            "Client response, professional attitude, and etiquette training for employment"
          ]
        },
        {
          title: "Skin Concerns Covered",
          items: [
            "Acne, pores, pigmentation, fine lines, and aging skin-care concepts",
            "Sensitive and dry skin factors with type-specific product selection",
            "Care flow focused on moisture, circulation, elasticity, and clearer skin tone"
          ]
        },
        {
          title: "Therapist Conduct and Hygiene",
          items: [
            "Guide clients into a comfortable posture and check preferred pressure level",
            "Keep nails, hand hygiene, clothing, breathing, and posture controlled",
            "Practice stable speed, pressure principles, and breathing during facial contouring care"
          ]
        },
        {
          title: "Career Fields",
          items: [
            "Skin-care salons, beauty academy instructor roles, oriental clinic, dermatology, and plastic-surgery care rooms",
            "Postpartum care center treatment rooms, beauty and massage shop startup, total beauty salons",
            "Hotel, spa, and sports-center care rooms, private salon startup, overseas employment and startup consultation"
          ]
        }
      ]
    },
    "메디컬 스킨케어": {
      summary: "A field-focused course connecting problem-skin diagnosis, professional devices, product analysis, and hand techniques.",
      overview:
        "Medical Skin Care trains learners to analyze skin types and problem skin, then combine professional beauty devices, products, cosmetics, and manual techniques for recovery-oriented and preventive care. The original regular and intensive curriculum is reorganized into a modern detail-page flow that connects theory with salon technique.",
      audience: "Learners preparing for dermatology or plastic-surgery care rooms, skin-care salons, or skin-care employment and startup",
      curriculum: [
        "Definition, purpose, effect, and precautions of medical skin care",
        "Skin-type care and problem-skin response",
        "Device practice with skin scrubber, ion introducer, high frequency, and ultrasound",
        "Cleansing, manual technique, deep cleansing, salon practice, and client care"
      ],
      certificationNote:
        "The regular course is guided as a two-month track and the intensive course as a one-month track. Class times are arranged through consultation around 10:00-13:00, 14:00-17:00, and 19:00-21:00 blocks.",
      durationHighlights: ["2-month regular", "1-month intensive", "Device + hand technique"],
      keyMetrics: [
        { label: "Track", value: "Medical care" },
        { label: "Duration", value: "1-2 months" },
        { label: "Core", value: "Device + touch" }
      ],
      detailSections: [
        {
          title: "Regular Course Roadmap",
          variant: "schedule",
          items: [
            "Month 1: theory, skin-type care, product and cosmetics analysis, skin scrubber and ion-introduction devices",
            "Month 2: high-frequency and ultrasound practice, cleansing and manual techniques, deep cleansing, hormone care and salon practice",
            "Class times: 10:00-13:00, 14:00-17:00, 19:00-21:00"
          ]
        },
        {
          title: "Intensive Course Roadmap",
          variant: "schedule",
          items: [
            "Week 1: definition, purpose, effects, skin-type care, preparation items, and precautions",
            "Weeks 2-3: problem-skin care, skin scrubber, ion introducer, high-frequency, and ultrasound practice",
            "Week 4: cleansing, manual technique, deep cleansing, hormone care, and salon technique"
          ]
        },
        {
          title: "Core Practical Techniques",
          variant: "chips",
          items: [
            "Skin-type analysis",
            "Problem-skin care",
            "Product analysis",
            "Skin scrubber",
            "Ion introducer",
            "High frequency",
            "Ultrasound",
            "Cleansing",
            "Manual technique",
            "Deep cleansing",
            "Hormone care"
          ]
        },
        {
          title: "Training Features",
          items: [
            "Group instruction, one-to-one coaching, and two-person mutual practice",
            "Problem-solving practice that connects device principles with field technique",
            "A combined approach using professional hand skills and beauty devices for client-care quality"
          ]
        },
        {
          title: "Skin-Care Scope",
          items: [
            "Normal, dry, oily, sensitive, acne, atopic, pigmented, and aging skin care",
            "Whitening, blemish care, recovery after trouble treatment, and preventive care",
            "Structured problem-skin care through devices and product selection"
          ]
        },
        {
          title: "Client Care and Hygiene",
          items: [
            "Guide clients into a comfortable posture and check preferred pressure level",
            "Keep nails, hand hygiene, clothing, breathing, and posture controlled",
            "Practice stable speed, pressure principles, and hygiene standards during medical skin care"
          ]
        },
        {
          title: "Career Fields",
          items: [
            "Plastic-surgery, dermatology, oriental clinic, and obstetrics-related care rooms",
            "Postpartum center care rooms, skin-care salons, and beauty academy instructor roles",
            "Beauty or massage shop startup, hotel, spa, sports-center care rooms, and overseas employment or startup consultation"
          ]
        }
      ]
    }
  },
  es: {
    "취업전문과정": {
      summary: "Ruta orientada al empleo con técnicas prácticas, atención al cliente y preparación laboral.",
      overview:
        "Esta ruta prepara a los estudiantes para incorporarse al trabajo en belleza y bienestar mediante combinaciones de técnicas prácticas, atención al cliente y modales profesionales. El plan se ajusta al objetivo laboral y al nivel actual.",
      audience: "Estudiantes que preparan empleo en belleza, bienestar, masaje, spa o servicios relacionados",
      curriculum: [
        "Consulta sobre objetivo laboral y campo deseado",
        "Plan de técnicas prácticas con masaje aroma meridiano, sueco, deportivo, pies y materias relacionadas",
        "Entrenamiento en atención al cliente, comunicación y modales profesionales",
        "Orientación de carrera y consulta sobre programas posteriores"
      ],
      certificationNote:
        "La duración puede orientarse como formación corta, intensiva de un mes o regular de dos meses según consulta y materias seleccionadas.",
      durationHighlights: ["Formación corta", "Intensivo de 1 mes", "Regular de 2 meses"],
      keyMetrics: [
        { label: "Ruta", value: "Empleo" },
        { label: "Duración", value: "2 semanas-2 meses" },
        { label: "Campos", value: "12 áreas" }
      ],
      detailSections: [
        {
          title: "Materias Principales",
          variant: "chips",
          items: [
            "Masaje aroma meridiano",
            "Masaje para maternidad",
            "Certificación nacional",
            "Masaje sueco",
            "Contorno facial",
            "Depilación brasileña",
            "Masaje deportivo",
            "Técnica de salón",
            "Coordinador hospitalario",
            "Masaje de pies",
            "Cuidado médico de la piel",
            "Cuidado quiropráctico"
          ]
        },
        {
          title: "Combinaciones Recomendadas",
          items: [
            "Sueco + waxing + aroma meridiano + deportivo",
            "Aroma meridiano + aromaterapia + cuidado de la piel",
            "Deportivo + meridiano + pies + sueco",
            "Maternidad + aroma meridiano + contorno facial"
          ]
        },
        {
          title: "Ruta Profesional",
          items: [
            "Empleo en sueco premium, spa de hotel y centros de masaje deportivo",
            "Centros de masaje, boutiques de belleza, hospitales, clínicas de maternidad y centros posparto",
            "Consulta para trabajo freelance u operación de salón individual"
          ]
        },
        {
          title: "Ingreso Mensual Estimado",
          variant: "income",
          items: [
            "Guía de consulta tipo A: KRW 8.000.000 a 10.000.000 al mes",
            "Guía de consulta tipo B: KRW 5.000.000 a 8.000.000 al mes",
            "El ingreso real puede variar por ubicación, instalaciones, marketing y operación."
          ]
        },
        {
          title: "Campos de Empleo",
          items: [
            "Operación de salón individual o servicio móvil de cuidado posparto",
            "Empleo en sueco premium, spa de hotel y centros de masaje deportivo",
            "Hospitales, clínicas de maternidad, centros posparto, centros de masaje tailandés y grandes spas"
          ]
        },
        {
          title: "Horario de Clase",
          variant: "schedule",
          items: [
            "Clase intensiva: lun-vie 10:00-13:00 o 14:00-17:00",
            "Clase matutina: lun-vie 10:00-13:00 / tarde: lun-vie 14:00-17:00",
            "Clase nocturna: lun, mie, vie 19:00-21:00"
          ]
        },
        {
          title: "Cursos Relacionados",
          items: [
            "Certificación nacional de estética, cuidado meridiano facial y aromaterapia",
            "Masaje meridiano, deportivo y de pies",
            "Masaje sueco y de maternidad según el objetivo laboral"
          ]
        }
      ]
    },
    "창업전문과정": {
      summary: "Ruta para emprendimiento que cubre técnicas prácticas, planificación de salón, marketing y operación.",
      overview:
        "Esta ruta combina técnicas prácticas avanzadas con planificación de emprendimiento: concepto del salón, ubicación, interior, materiales, personal, formación de servicio, marketing y operación diaria. Ayuda a preparar un plan realista de apertura.",
      audience: "Estudiantes que preparan negocio individual, apertura de nuevo salón o adquisición de un salón existente",
      curriculum: [
        "Diagnóstico de objetivo de emprendimiento y tipo de negocio",
        "Diseño de menú de servicios con programas de alta demanda",
        "Lista de ubicación, interior con control de costos, suministros y materiales",
        "Consulta sobre operación, formación de personal, marketing y gestión"
      ],
      certificationNote:
        "El alcance de apertura y los ingresos proyectados pueden variar por ubicación, instalaciones, zona comercial, marketing y modelo operativo.",
      durationHighlights: ["Consulta de emprendimiento", "Plan de apertura", "Coaching operativo"],
      keyMetrics: [
        { label: "Ruta", value: "Emprendimiento" },
        { label: "Lista", value: "16 puntos" },
        { label: "Tipo", value: "Individual / Salón" }
      ],
      detailSections: [
        {
          title: "Materias Principales",
          variant: "chips",
          items: [
            "Masaje aroma meridiano",
            "Masaje para maternidad",
            "Certificación nacional",
            "Masaje sueco",
            "Contorno facial",
            "Depilación brasileña",
            "Masaje deportivo",
            "Técnica de salón",
            "Coordinador hospitalario",
            "Masaje de pies",
            "Cuidado médico de la piel",
            "Cuidado quiropráctico"
          ]
        },
        {
          title: "Lista de Preparación",
          items: [
            "Técnica competitiva y captación de clientes frecuentes",
            "Concepto rentable, diseño de programas y selección de ubicación",
            "Registro comercial, marketing económico, interior, suministros y materiales",
            "Personal, revisión técnica, sistema de programas, gestión y operación"
          ]
        },
        {
          title: "Modelos de Apertura",
          items: [
            "Sueco + waxing + aroma meridiano + deportivo",
            "Aroma meridiano + aromaterapia + cuidado de la piel",
            "Deportivo + meridiano + pies + sueco",
            "Apertura en officetel, local comercial, nuevo salón o adquisición"
          ]
        },
        {
          title: "Ingreso Mensual Proyectado del Salón",
          variant: "income",
          items: [
            "Guía de consulta tipo A: KRW 80.000.000 a 100.000.000 al mes",
            "Guía de consulta tipo B: KRW 50.000.000 a 80.000.000 al mes",
            "La proyección puede variar por ubicación, instalaciones, marketing y operación."
          ]
        },
        {
          title: "Ingreso Mensual Proyectado Individual",
          variant: "income",
          items: [
            "Guía de consulta tipo A: KRW 15.000.000 a 20.000.000 al mes",
            "Guía de consulta tipo B: KRW 10.000.000 a 15.000.000 al mes",
            "El ingreso puede variar por modelo operativo y captación de clientes."
          ]
        },
        {
          title: "Horario de Clase",
          variant: "schedule",
          items: [
            "Clase intensiva: lun-vie 10:00-13:00 o 14:00-17:00",
            "Clase matutina: lun-vie 10:00-13:00 / tarde: lun-vie 14:00-17:00",
            "Clase nocturna: lun, mie, vie 19:00-21:00"
          ]
        },
        {
          title: "Cursos Relacionados",
          items: [
            "Certificación nacional de estética, cuidado meridiano facial y aromaterapia",
            "Masaje meridiano, deportivo y de pies",
            "Masaje sueco y de maternidad según el concepto de emprendimiento"
          ]
        }
      ]
    },
    "주말반/취미반": {
      summary: "Ruta de fin de semana para quienes tienen poco tiempo entre semana o desean aprender como hobby.",
      overview:
        "La clase de fin de semana y hobby está diseñada para personas que preparan un cambio de carrera o desean aprender cuidado de piel y masaje como hobby manteniendo su agenda semanal. Las sesiones de sábado o domingo por la mañana y tarde permiten elegir materias prácticas según el interés.",
      audience: "Adultos trabajadores, estudiantes que preparan cambio de carrera y principiantes interesados en belleza y bienestar",
      curriculum: [
        "Consulta sobre objetivo, día disponible y horario",
        "Selección de materias de estética, aroma, meridiano, deportivo y pies",
        "Práctica intensiva de fin de semana por la mañana o tarde",
        "Orientación hacia uso como hobby o rutas de empleo y emprendimiento"
      ],
      certificationNote:
        "Las clases de fin de semana operan en bloques de sábado o domingo por la mañana y tarde. Las materias y criterios de finalización se guían según selección y consulta.",
      durationHighlights: ["Clase sábado", "Clase domingo", "Mañana / tarde"],
      keyMetrics: [
        { label: "Ruta", value: "Fin de semana" },
        { label: "Días", value: "Sáb / Dom" },
        { label: "Horario", value: "10:00-17:00" }
      ],
      detailSections: [
        {
          title: "Recomendado Para",
          items: [
            "Adultos trabajadores y estudiantes que no pueden asistir entre semana",
            "Principiantes que desean aprender cuidado de piel y masaje como hobby",
            "Personas que desean probar práctica básica antes de empleo o emprendimiento"
          ]
        },
        {
          title: "Materias Seleccionables",
          variant: "chips",
          items: [
            "Estética",
            "Contorno facial",
            "Cuidado médico de la piel",
            "Aromaterapia",
            "Masaje meridiano",
            "Masaje deportivo",
            "Masaje de pies",
            "Masaje sueco",
            "Masaje de maternidad"
          ]
        },
        {
          title: "Flujo de Aprendizaje",
          items: [
            "Consulta sobre intereses y propósito",
            "Comprensión de teoría básica y secuencia de cuidado",
            "Demostración experta y práctica paso a paso",
            "Conexión con uso como hobby o cursos avanzados"
          ]
        },
        {
          title: "Formas de Uso",
          items: [
            "Práctica como hobby para familia y conocidos",
            "Experiencia inicial antes de cambiar a belleza y bienestar",
            "Consulta hacia programas de empleo o emprendimiento"
          ]
        },
        {
          title: "Cursos Relacionados",
          items: [
            "Certificación nacional de estética, cuidado meridiano facial y aromaterapia",
            "Masaje meridiano, deportivo y de pies",
            "Masaje sueco y de maternidad según interés"
          ]
        },
        {
          title: "Horario de Fin de Semana",
          variant: "schedule",
          items: [
            "Clase sábado: 10:00-13:00 o 14:00-17:00",
            "Clase domingo: 10:00-13:00 o 14:00-17:00",
            "Nota de consulta: El horario por materia puede variar según calendario."
          ]
        }
      ]
    },
    "얼굴축소경락": {
      summary: "Curso práctico que conecta análisis de piel, masaje meridiano de contorno facial, técnica manual y atención al cliente.",
      overview:
        "El cuidado meridiano de contorno facial enseña a analizar el estado de la piel y las necesidades del rostro, y practica limpieza, limpieza profunda, mascarillas, equipos de belleza, masaje meridiano y técnicas manuales paso a paso. El flujo original regular e intensivo se reorganiza como una ruta práctica moderna.",
      audience: "Estudiantes que preparan empleo en cabinas de estética, apertura de salón o práctica de contorno facial y cuidado de piel",
      curriculum: [
        "Análisis de tipo de piel y práctica de ficha de consulta",
        "Limpieza, limpieza profunda, mascarillas y selección de productos funcionales",
        "Práctica en pareja de masaje meridiano de contorno facial y técnica manual",
        "Atención al cliente, etiqueta, higiene, imagen profesional y orientación laboral"
      ],
      certificationNote:
        "El curso regular se orienta como ruta de dos meses y el intensivo como ruta de un mes. Los horarios se coordinan por consulta en bloques de 10:00-13:00, 14:00-17:00 y 19:00-21:00.",
      durationHighlights: ["Regular 2 meses", "Intensivo 1 mes", "Bloques 10 / 14 / 19"],
      keyMetrics: [
        { label: "Ruta", value: "Práctica" },
        { label: "Duración", value: "1-2 meses" },
        { label: "Práctica", value: "En pareja" }
      ],
      detailSections: [
        {
          title: "Mapa del Curso Regular",
          variant: "schedule",
          items: [
            "Mes 1: análisis de piel y consulta, limpieza y limpieza profunda, cosméticos por tipo de piel, packs y mascarillas",
            "Mes 2: uso de equipos, masaje meridiano facial y técnica manual, cuidados especiales con productos funcionales, bases del terapeuta",
            "Horarios: 10:00-13:00, 14:00-17:00, 19:00-21:00"
          ]
        },
        {
          title: "Mapa del Curso Intensivo",
          variant: "schedule",
          items: [
            "Semana 1: orientación, análisis de tipo de piel, consulta de cliente, limpieza y limpieza profunda",
            "Semanas 2-3: cosméticos, packs, mascarillas, equipos de belleza y práctica intensiva de masaje facial",
            "Semana 4: blanqueamiento, arrugas, contorno facial, vitamina, pack herbal y entrenamiento de imagen"
          ]
        },
        {
          title: "Técnicas Principales",
          variant: "chips",
          items: [
            "Análisis de piel",
            "Ficha de cliente",
            "Limpieza",
            "Limpieza profunda",
            "Packs y mascarillas",
            "Equipos de belleza",
            "Masaje meridiano facial",
            "Técnica manual",
            "Productos funcionales",
            "Etiqueta e imagen"
          ]
        },
        {
          title: "Características de Formación",
          items: [
            "Instrucción grupal, guía individual y práctica mutua en pareja",
            "Aprendizaje práctico de resolución de problemas que conecta principios y teoría",
            "Atención al cliente, actitud profesional y etiqueta para el empleo"
          ]
        },
        {
          title: "Problemas de Piel Cubiertos",
          items: [
            "Acné, poros, pigmentación, líneas finas y conceptos de piel envejecida",
            "Factores de piel sensible y seca con selección de productos por tipo",
            "Flujo de cuidado centrado en hidratación, circulación, elasticidad y tono más claro"
          ]
        },
        {
          title: "Conducta e Higiene",
          items: [
            "Guiar al cliente a una postura cómoda y confirmar la presión deseada",
            "Mantener uñas, higiene de manos, ropa, respiración y postura controladas",
            "Practicar velocidad estable, principios de presión y respiración durante el cuidado facial"
          ]
        },
        {
          title: "Campos Profesionales",
          items: [
            "Salones de estética, instructor de academia, clínicas orientales, dermatología y salas de cirugía plástica",
            "Centros posparto, apertura de beauty shop y massage shop, salones integrales",
            "Hoteles, spas, centros deportivos, salón privado, empleo y emprendimiento en el exterior"
          ]
        }
      ]
    },
    "메디컬 스킨케어": {
      summary: "Curso práctico que conecta diagnóstico de piel problemática, equipos profesionales, análisis de productos y técnicas manuales.",
      overview:
        "Medical Skin Care enseña a analizar tipos de piel y piel problemática, y combina equipos profesionales, productos, cosméticos y técnicas manuales para cuidados de recuperación y prevención. El currículo regular e intensivo original se reorganiza como una página educativa moderna que conecta teoría y técnica de salón.",
      audience: "Estudiantes que preparan trabajo en dermatología, cirugía plástica, salones de cuidado de piel o emprendimiento en skin care",
      curriculum: [
        "Definición, propósito, efectos y precauciones de medical skin care",
        "Cuidado por tipo de piel y respuesta a piel problemática",
        "Práctica con skin scrubber, ion introducer, alta frecuencia y ultrasonido",
        "Limpieza, técnica manual, limpieza profunda, práctica de salón y atención al cliente"
      ],
      certificationNote:
        "El curso regular se orienta como ruta de dos meses y el intensivo como ruta de un mes. Los horarios se coordinan por consulta en bloques de 10:00-13:00, 14:00-17:00 y 19:00-21:00.",
      durationHighlights: ["Regular 2 meses", "Intensivo 1 mes", "Equipo + técnica manual"],
      keyMetrics: [
        { label: "Ruta", value: "Medical care" },
        { label: "Duración", value: "1-2 meses" },
        { label: "Núcleo", value: "Equipo + mano" }
      ],
      detailSections: [
        {
          title: "Mapa del Curso Regular",
          variant: "schedule",
          items: [
            "Mes 1: teoría, cuidado por tipo de piel, análisis de productos y cosméticos, skin scrubber e ion introducer",
            "Mes 2: alta frecuencia y ultrasonido, limpieza y técnicas manuales, limpieza profunda, cuidado hormonal y práctica de salón",
            "Horarios: 10:00-13:00, 14:00-17:00, 19:00-21:00"
          ]
        },
        {
          title: "Mapa del Curso Intensivo",
          variant: "schedule",
          items: [
            "Semana 1: definición, propósito, efectos, cuidado por tipo de piel, preparación y precauciones",
            "Semanas 2-3: piel problemática, skin scrubber, ion introducer, alta frecuencia y ultrasonido",
            "Semana 4: limpieza, técnica manual, limpieza profunda, cuidado hormonal y técnica de salón"
          ]
        },
        {
          title: "Técnicas Principales",
          variant: "chips",
          items: [
            "Análisis de piel",
            "Piel problemática",
            "Análisis de productos",
            "Skin scrubber",
            "Ion introducer",
            "Alta frecuencia",
            "Ultrasonido",
            "Limpieza",
            "Técnica manual",
            "Limpieza profunda",
            "Cuidado hormonal"
          ]
        },
        {
          title: "Características de Formación",
          items: [
            "Instrucción grupal, guía individual y práctica mutua en pareja",
            "Aprendizaje práctico que conecta principios de equipos y técnica de campo",
            "Combinación de habilidad manual profesional y equipos de belleza para mejorar la atención"
          ]
        },
        {
          title: "Alcance de Cuidado",
          items: [
            "Piel normal, seca, grasa, sensible, acné, atópica, pigmentada y envejecida",
            "Blanqueamiento, manchas, recuperación después de problemas y cuidado preventivo",
            "Cuidado estructurado de piel problemática con equipos y selección de productos"
          ]
        },
        {
          title: "Atención e Higiene",
          items: [
            "Guiar al cliente a una postura cómoda y confirmar la presión deseada",
            "Mantener uñas, higiene de manos, ropa, respiración y postura controladas",
            "Practicar velocidad estable, principios de presión e higiene durante medical skin care"
          ]
        },
        {
          title: "Campos Profesionales",
          items: [
            "Salas de cirugía plástica, dermatología, clínicas orientales y áreas relacionadas con obstetricia",
            "Centros posparto, salones de skin care e instructor de academia de belleza",
            "Apertura de beauty shop o massage shop, hoteles, spas, centros deportivos, empleo y emprendimiento exterior"
          ]
        }
      ]
    }
  }
};

function getSlug(title: string) {
  return title
    .replace(/[^\w가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export type Course = {
  title: string;
  slug: string;
  categoryKey: Exclude<CourseCategory, "all">;
  category: string;
  summary: string;
  imageUrl: string;
  overview: string;
  audience: string;
  curriculum: string[];
  certificationNote: string;
  detailSections?: CourseDetailSection[];
  durationHighlights?: string[];
  keyMetrics?: Array<{ label: string; value: string }>;
  source: string;
};

function getActiveLocale(locale: string): LegacyContentLocale {
  return locale === "en" || locale === "es" ? locale : "ko";
}

export function getCourses(locale: string): Course[] {
  if (locale === "zh-CN") {
    return getCourses("ko").flatMap((course) => {
      const text = courseZhCnTranslations[course.slug];
      if (!text) return [];
      return [{
        ...course,
        title: text.title,
        category: chineseCopy.curriculumCatalog.categories[course.categoryKey],
        summary: text.summary,
        overview: text.overview,
        audience: text.recommendedFor.join("、"),
        curriculum: text.curriculumItems,
        certificationNote: text.certificationNote,
        durationHighlights: [text.duration],
        detailSections: undefined,
        keyMetrics: undefined
      }];
    });
  }
  const activeLocale = getActiveLocale(locale);

  return courseTitleTranslations.map((titles) => {
    const categoryKey = titles.categoryKey;
    const text = courseTextByLocale[activeLocale][categoryKey];
    const override = courseOverridesByLocale[activeLocale][titles.ko] ?? {};
    const courseText = { ...text, ...override };
    const slug = getSlug(titles.ko);

    return {
      title: titles[activeLocale],
      slug,
      categoryKey,
      category: courseText.category,
      summary: courseText.summary,
      imageUrl: courseImageBySlug[slug],
      overview: courseText.overview,
      audience: courseText.audience,
      curriculum: courseText.curriculum,
      certificationNote: courseText.certificationNote,
      detailSections: courseText.detailSections,
      durationHighlights: courseText.durationHighlights,
      keyMetrics: courseText.keyMetrics,
      source: `https://www.smc365.ac/curriculum/${titles.sourcePath}`
    };
  });
}

export function getCourseSlugs() {
  return courseTitleTranslations.map((titles) => getSlug(titles.ko));
}

export function getCourseBySlug(slug: string, locale: string) {
  return getCourses(locale).find((course) => course.slug === slug);
}

const activityGroupsByLocale: Record<LegacyContentLocale, Array<{
  title: string;
  key: string;
  icon: typeof CalendarDays;
  source: string;
  summary: string;
  imageUrl: string;
}>> = {
  ko: [
  {
    title: "공지/시험일정",
    key: "notice",
    icon: CalendarDays,
    source: "운영 공지",
    summary: "시험 일정, 접수 안내, 협회 공지 등 회원과 수강생이 먼저 확인해야 할 소식을 모읍니다.",
    imageUrl: "/assets/client-smc/training-room-beds-wide.jpg"
  },
  {
    title: "합격현황/합격률",
    key: "pass",
    icon: BadgeCheck,
    source: "성과 기록",
    summary: "자격 취득 현황, 합격자 소식, 교육 성과를 신뢰 자료로 정리합니다.",
    imageUrl: "/assets/client-smc/k-beauty-master-certificate.jpg"
  },
  {
    title: "포토갤러리",
    key: "photo",
    icon: Image,
    source: "현장 사진",
    summary: "업무협약, 교육 현장, 대회, 수료식 등 협회 활동 이미지를 한 곳에서 보여줍니다.",
    imageUrl: "/assets/client-smc/global-competition-hall-wide.jpg"
  },
  {
    title: "심사위원/수상경력",
    key: "awards",
    icon: Award,
    source: "공신력 자료",
    summary: "심사위원 위촉, 표창, 수상 이력과 전문성을 보여주는 콘텐츠를 정리합니다.",
    imageUrl: "/assets/client-smc/competition-award-stage.jpg"
  },
  {
    title: "국제미용대회",
    key: "competition",
    icon: Globe2,
    source: "글로벌 행사",
    summary: "국제 미용·건강 대회, 한국휴먼 올림픽대회, 해외 교류 활동을 소개합니다.",
    imageUrl: "/assets/client-smc/global-judges-group-stage.jpg"
  },
  {
    title: "대기업 초청이벤트",
    key: "corporate-events",
    icon: Building2,
    source: "협력 활동",
    summary: "기관·기업 초청 행사, 업무협약, 협력 네트워크 활동을 정리합니다.",
    imageUrl: "/assets/client-smc/mou-handshake.jpg"
  },
  {
    title: "방송/언론",
    key: "media",
    icon: Newspaper,
    source: "언론 보도",
    summary: "방송, 언론, 인터뷰, 미디어 노출 이력을 신뢰 콘텐츠로 제공합니다.",
    imageUrl: "/assets/client-smc/president-speech.jpg"
  },
  {
    title: "봉사활동",
    key: "volunteer",
    icon: Handshake,
    source: "사회공헌",
    summary: "협회와 교육생이 함께한 봉사 및 사회공헌 활동을 기록합니다.",
    imageUrl: "/assets/client-smc/practical-massage-training.jpg"
  },
  {
    title: "수강생 후기",
    key: "reviews",
    icon: Users,
    source: "교육 후기",
    summary: "수강생 경험, 교육 만족도, 취업·창업 후기를 모아 소개합니다.",
    imageUrl: "/assets/client-smc/awards-books-consulting-room.jpg"
  }
  ],
  en: [
    { title: "Notices / Exam Schedule", key: "notice", icon: CalendarDays, source: "Official Updates", summary: "Exam schedules, registration notices, and association updates for members and trainees.", imageUrl: "/assets/client-smc/training-room-beds-wide.jpg" },
    { title: "Pass Records / Pass Rate", key: "pass", icon: BadgeCheck, source: "Achievement Records", summary: "Certification results, pass records, and education outcomes organized as trust content.", imageUrl: "/assets/client-smc/k-beauty-master-certificate.jpg" },
    { title: "Photo Gallery", key: "photo", icon: Image, source: "Field Photos", summary: "Partnership, training, competition, and completion ceremony images in one gallery.", imageUrl: "/assets/client-smc/global-competition-hall-wide.jpg" },
    { title: "Judges / Awards", key: "awards", icon: Award, source: "Credibility Records", summary: "Judge appointments, commendations, award history, and professional achievements.", imageUrl: "/assets/client-smc/competition-award-stage.jpg" },
    { title: "International Beauty Competitions", key: "competition", icon: Globe2, source: "Global Events", summary: "International beauty and health competitions, Human Olympic events, and global exchange activities.", imageUrl: "/assets/client-smc/global-judges-group-stage.jpg" },
    { title: "Corporate Invitation Events", key: "corporate-events", icon: Building2, source: "Partnership Activities", summary: "Corporate and institutional invitations, MOUs, and partnership network activities.", imageUrl: "/assets/client-smc/mou-handshake.jpg" },
    { title: "Media Coverage", key: "media", icon: Newspaper, source: "Press Records", summary: "Broadcast, press, interview, and public media exposure records.", imageUrl: "/assets/client-smc/president-speech.jpg" },
    { title: "Volunteer Activities", key: "volunteer", icon: Handshake, source: "Social Contribution", summary: "Volunteer and community contribution activities led by the association and trainees.", imageUrl: "/assets/client-smc/practical-massage-training.jpg" },
    { title: "Student Reviews", key: "reviews", icon: Users, source: "Education Reviews", summary: "Trainee experiences, satisfaction stories, and career or startup outcomes.", imageUrl: "/assets/client-smc/awards-books-consulting-room.jpg" }
  ],
  es: [
    { title: "Avisos / Calendario de Exámenes", key: "notice", icon: CalendarDays, source: "Actualizaciones oficiales", summary: "Calendarios de exámenes, avisos de inscripción y noticias de la asociación.", imageUrl: "/assets/client-smc/training-room-beds-wide.jpg" },
    { title: "Resultados / Tasa de Aprobación", key: "pass", icon: BadgeCheck, source: "Resultados", summary: "Registros de certificación, aprobados y logros educativos.", imageUrl: "/assets/client-smc/k-beauty-master-certificate.jpg" },
    { title: "Galería de Fotos", key: "photo", icon: Image, source: "Fotos de campo", summary: "Imágenes de alianzas, formación, competencias y ceremonias de finalización.", imageUrl: "/assets/client-smc/global-competition-hall-wide.jpg" },
    { title: "Jueces / Premios", key: "awards", icon: Award, source: "Credibilidad", summary: "Designaciones de jueces, reconocimientos, premios y logros profesionales.", imageUrl: "/assets/client-smc/competition-award-stage.jpg" },
    { title: "Concursos Internacionales de Belleza", key: "competition", icon: Globe2, source: "Eventos globales", summary: "Concursos internacionales de belleza y salud, Human Olympic e intercambios globales.", imageUrl: "/assets/client-smc/global-judges-group-stage.jpg" },
    { title: "Eventos por Invitación Corporativa", key: "corporate-events", icon: Building2, source: "Alianzas", summary: "Invitaciones corporativas e institucionales, MOUs y actividades de colaboración.", imageUrl: "/assets/client-smc/mou-handshake.jpg" },
    { title: "Cobertura en Medios", key: "media", icon: Newspaper, source: "Prensa", summary: "Registros de televisión, prensa, entrevistas y exposición pública.", imageUrl: "/assets/client-smc/president-speech.jpg" },
    { title: "Voluntariado", key: "volunteer", icon: Handshake, source: "Contribución social", summary: "Actividades de voluntariado y contribución comunitaria.", imageUrl: "/assets/client-smc/practical-massage-training.jpg" },
    { title: "Opiniones de Estudiantes", key: "reviews", icon: Users, source: "Reseñas educativas", summary: "Experiencias de estudiantes, satisfacción y resultados profesionales.", imageUrl: "/assets/client-smc/awards-books-consulting-room.jpg" }
  ]
};

export function getActivityGroups(locale: string) {
  if (locale === "zh-CN") {
    const labels: Record<string, [string, string, string]> = {
      notice: ["通知公告", "协会通知", "课程开班、考试安排与协会公告。"],
      pass: ["考试合格记录", "学习成果", "学员资格考试合格与结业记录。"],
      photo: ["活动相册", "现场照片", "课程、培训与活动的现场记录。"],
      awards: ["获奖记录", "荣誉与成果", "协会与学员的获奖和荣誉记录。"],
      competition: ["国际美容赛事", "国际交流", "国际美容大赛参与和交流活动。"],
      "corporate-events": ["企业活动", "企业合作", "与企业和机构共同举办的活动。"],
      media: ["媒体报道", "新闻与广播", "协会与教育活动相关媒体报道。"],
      volunteer: ["志愿服务", "社会贡献", "社区志愿服务与公益活动。"],
      reviews: ["学员评价", "学习体验", "学员的学习体验、反馈与职业发展故事。"]
    };
    return activityGroupsByLocale.en.map((group) => {
      const [title, source, summary] = labels[group.key];
      return { ...group, title, source, summary };
    });
  }
  return activityGroupsByLocale[getActiveLocale(locale)];
}

export function getActivityKeys() {
  return activityGroupsByLocale.ko.map((activity) => activity.key);
}

export function getActivityGroupByKey(locale: string, activityKey: string) {
  return getActivityGroups(locale).find((activity) => activity.key === activityKey);
}

export function getActivityPosts(locale: string, activityKey: string) {
  if (locale === "zh-CN") return [];
  const activeLocale = getActiveLocale(locale);
  const activity = getActivityGroupByKey(activeLocale, activityKey);

  if (!activity) {
    return [];
  }

  const copyByLocale: Record<LegacyContentLocale, {
    author: string;
    previewStatus: string;
    reviewStatus: string;
    firstBody: string;
    secondBody: string;
  }> = {
    ko: {
      author: "관리자",
      previewStatus: "게시 예정",
      reviewStatus: "검수 중",
      firstBody: "기존 SMC365 콘텐츠를 관리자 게시판 구조로 이관하기 위한 대표 게시글 예시입니다.",
      secondBody: "발주사 검수 후 최종 이미지, 원문 링크, 게시 상태를 확정해 공개합니다."
    },
    en: {
      author: "Admin",
      previewStatus: "Scheduled",
      reviewStatus: "Under review",
      firstBody: "A representative sample post for migrating existing SMC365 content into the admin board structure.",
      secondBody: "Final images, source links, and publish status will be confirmed after client review."
    },
    es: {
      author: "Admin",
      previewStatus: "Programado",
      reviewStatus: "En revisión",
      firstBody: "Publicación de ejemplo para migrar contenido existente de SMC365 a la estructura del tablero.",
      secondBody: "Las imágenes finales, enlaces de origen y estado se confirmarán después de la revisión del cliente."
    }
  };
  const text = copyByLocale[activeLocale];

  return [
    {
      author: text.author,
      title: activity.title,
      date: "2026-07-12",
      status: text.previewStatus,
      body: text.firstBody,
      slug: `${activityKey}-sample-01`,
      sourceUrl: "https://www.smc365.ac/index.asp",
      viewCount: 128
    },
    {
      author: text.author,
      title: `${activity.title} 02`,
      date: "2026-07-05",
      status: text.reviewStatus,
      body: text.secondBody,
      slug: `${activityKey}-sample-02`,
      sourceUrl: "https://www.smc365.ac/index.asp",
      viewCount: 96
    }
  ];
}

const statsByLocale: Record<LegacyContentLocale, Array<{ label: string; value: string }>> = {
  ko: [
    { label: "운영 경력", value: "25+" },
    { label: "연결 국가", value: "48+" },
    { label: "자격 전문가", value: "6,200+" },
    { label: "파트너 기관", value: "320+" }
  ],
  en: [
    { label: "Years of Excellence", value: "25+" },
    { label: "Countries", value: "48+" },
    { label: "Certified Professionals", value: "6,200+" },
    { label: "Partner Institutions", value: "320+" }
  ],
  es: [
    { label: "Años de Excelencia", value: "25+" },
    { label: "Países", value: "48+" },
    { label: "Profesionales Certificados", value: "6,200+" },
    { label: "Instituciones Socias", value: "320+" }
  ]
};

export function getStats(locale: string) {
  if (locale === "zh-CN") {
    const labels = ["运营经验", "交流国家", "资格专业人士", "合作机构"];
    return statsByLocale.en.map((item, index) => ({ ...item, label: labels[index] }));
  }
  return statsByLocale[getActiveLocale(locale)];
}

export const adminModules = [
  { title: "페이지 관리자", icon: BookOpen, status: "CMS", count: "12", description: "소개, 인사말, 연혁, 연락처 등 고정 페이지 관리" },
  { title: "과정 관리자", icon: GraduationCap, status: "CMS", count: "18", description: "과정 목록, 상세, 대표 이미지, 원본 URL 관리" },
  { title: "커뮤니티 관리자", icon: Newspaper, status: "CMS", count: "6", description: "공지, 합격현황, 갤러리, 방송/언론 게시글 관리" },
  { title: "문의 관리자", icon: Handshake, status: "Lead", count: "2", description: "파트너 문의와 수강 상담 처리 상태 관리" },
  { title: "사용자 관리자", icon: Users, status: "Auth", count: "4", description: "회원 계정, 역할, 계정 상태 관리" },
  { title: "자격 데이터", icon: ShieldCheck, status: "Secure", count: "2", description: "자격번호, 발급일, 상태, 검증 코드 관리" },
  { title: "팝업/배너", icon: Sparkles, status: "Content", count: "3", description: "메인 팝업, 상단 배너, 캠페인 노출 기간 관리" },
  { title: "번역 상태", icon: Globe2, status: "i18n", count: "4", description: "한국어, 영어, 스페인어, 중국어 콘텐츠 검수 상태 관리" }
];

export const adminContentRows = [
  { type: "Course", title: "피부미용사 국가자격증", locale: "ko", status: "published", updatedBy: "Content Manager", updatedAt: "2026-07-11" },
  { type: "Page", title: "About KHCPQA", locale: "en", status: "reviewed", updatedBy: "Content Manager", updatedAt: "2026-07-10" },
  { type: "Activity", title: "국제미용대회", locale: "es", status: "translated", updatedBy: "Content Manager", updatedAt: "2026-07-09" },
  { type: "Banner", title: "파트너 상담 CTA", locale: "all", status: "draft", updatedBy: "Super Admin", updatedAt: "2026-07-08" }
];

export const adminInquiryRows = [
  { receipt: "KHCPQA-2026-PREVIEW", name: "KHCPQA Demo Partner", organization: "Global Wellness Institute", country: "Mexico", type: "partnership", status: "new", submittedAt: "2026-07-12" },
  { receipt: "KHCPQA-2026-COURSE", name: "SMC Demo Student", organization: "Individual", country: "Korea", type: "course", status: "in_review", submittedAt: "2026-07-10" }
];

export const adminCertificationRows = [
  { user: "KHCPQA Demo Member", course: "피부미용사 국가자격증", number: "SMC-2026-001", issuedAt: "2026-05-18", status: "issued" },
  { user: "KHCPQA Demo Member", course: "아로마 테라피", number: "SMC-2026-014", issuedAt: "2026-06-21", status: "expired" }
];

export const adminUserRows = [
  { id: "demo-user-1", name: "KHCPQA Demo Member", email: "member@example.com", role: "user", status: "active", lastLoginAt: "2026-07-12" },
  { id: "demo-user-2", name: "Content Manager", email: "content@example.com", role: "content_manager", status: "active", lastLoginAt: "2026-07-11" },
  { id: "demo-user-3", name: "Inquiry Manager", email: "inquiry@example.com", role: "inquiry_manager", status: "active", lastLoginAt: "2026-07-10" },
  { id: "demo-user-4", name: "Suspended Admin", email: "suspended@example.com", role: "viewer", status: "suspended", lastLoginAt: "2026-07-01" }
];

export const adminReleaseTasks = [
  "초기 관리자 계정과 역할 정책 확정",
  "콘텐츠·배너 최종 문구와 이미지 검수",
  "문의 처리 담당자와 운영 메모 정책 확정",
  "자격 데이터 샘플 CSV 형식 확정",
  "운영 도메인, SSL, Supabase 환경변수 확인"
];

const locationsByLocale: Record<LegacyContentLocale, Array<{ name: string; address: string; phone: string }>> = {
  ko: [
    {
      name: "한국건강관리사자격협회 서울본사",
      address: "서울시 종로구 수표로 120 내인빌딩 8층",
      phone: "02-763-1271 / 010-7712-3362"
    },
    {
      name: "SMC아카데미 본점",
      address: "서울시 종로구 수표로 120 내인빌딩 7층",
      phone: "010-6283-1206"
    },
    {
      name: "강남SMC아카데미 구로디지털단지역점",
      address: "서울시 관악구 시흥대로 558-1 G밸리마인드 5층 505호",
      phone: "02-867-2280 / 010-6283-1206"
    },
    {
      name: "한국건강관리사자격협회 구로디지털단지역점",
      address: "서울시 관악구 시흥대로 558-1 G밸리마인드 5층 503호",
      phone: "02-867-2281 / 010-6283-1206"
    },
    {
      name: "한국건강관리사자격협회 대림캠퍼스",
      address: "서울시 영등포구 대림로 23길 30-1 골든타워 6층",
      phone: "010-5589-9812"
    }
  ],
  en: [
    {
      name: "KHCPQA Seoul Headquarters",
      address: "8F Naein Building, 120 Supyo-ro, Jongno-gu, Seoul",
      phone: "02-763-1271 / 010-7712-3362"
    },
    {
      name: "SMC Academy Main Campus",
      address: "7F Naein Building, 120 Supyo-ro, Jongno-gu, Seoul",
      phone: "010-6283-1206"
    },
    {
      name: "Gangnam SMC Academy Guro Digital Complex Branch",
      address: "5F 505, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seoul",
      phone: "02-867-2280 / 010-6283-1206"
    },
    {
      name: "KHCPQA Guro Digital Complex Branch",
      address: "5F 503, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seoul",
      phone: "02-867-2281 / 010-6283-1206"
    },
    {
      name: "KHCPQA Daerim Campus",
      address: "6F Golden Tower, 30-1 Daerim-ro 23-gil, Yeongdeungpo-gu, Seoul",
      phone: "010-5589-9812"
    }
  ],
  es: [
    {
      name: "Sede Central de KHCPQA en Seúl",
      address: "8F Naein Building, 120 Supyo-ro, Jongno-gu, Seúl",
      phone: "02-763-1271 / 010-7712-3362"
    },
    {
      name: "Campus Principal de SMC Academy",
      address: "7F Naein Building, 120 Supyo-ro, Jongno-gu, Seúl",
      phone: "010-6283-1206"
    },
    {
      name: "Sucursal Gangnam SMC Academy Guro Digital Complex",
      address: "5F 505, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seúl",
      phone: "02-867-2280 / 010-6283-1206"
    },
    {
      name: "Sucursal KHCPQA Guro Digital Complex",
      address: "5F 503, G Valley Mind, 558-1 Siheung-daero, Gwanak-gu, Seúl",
      phone: "02-867-2281 / 010-6283-1206"
    },
    {
      name: "Campus Daerim de KHCPQA",
      address: "6F Golden Tower, 30-1 Daerim-ro 23-gil, Yeongdeungpo-gu, Seúl",
      phone: "010-5589-9812"
    }
  ]
};

export function getLocations(locale: string) {
  return locationsByLocale[getActiveLocale(locale)];
}

export function getCopy(locale: string) {
  return copy[isLocale(locale) ? locale : defaultLocale];
}
