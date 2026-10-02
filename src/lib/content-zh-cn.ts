import { internationalDirectors, leadershipGreetings } from "./leadership-localizations";
import type { Copy } from "./content";

// Simplified Chinese public copy. Keep route keys, asset paths and identifiers stable.
export const chineseCopy = {
  brand: "KAHC",
  brandFull: "The Korea Association for Health & Beauty Certification",
  nav: { about: "协会介绍", curriculum: "教育课程", activities: "社区", partner: "合作咨询", contact: "联系我们", login: "登录" },
  heroBadge: "以专业培训开启职业之路",
  heroTitle: "让技能成就未来",
  heroLead: "以实践为核心的教育，培养专业人才，支持学员就业与创业准备。",
  primaryCta: "查看课程", secondaryCta: "合作咨询", secureCta: "登录查询资格证书",
  trustTitle: "从培训到就业与创业的全程支持", curriculumTitle: "一览教育课程", activitiesTitle: "社区",
  pageReady: "翻译与内容审核状态由管理员管理。", accountTitle: "我的账户", adminTitle: "管理后台",
  formSubmit: "提交咨询", menuOpen: "打开菜单", menuClose: "关闭菜单",
  a11y: { homeLink: "KAHC 首页", primaryNavigation: "主导航", mobileNavigation: "移动导航", languageSwitcher: "语言选择", socialLinks: "社交链接", accountNavigation: "账户导航", aboutNavigation: "协会介绍导航" },
  layout: { consultCta: "咨询", footerLead: "连接系统培训、就业与创业支持的专业教育平台。", customerCenter: "客户中心", phoneLabel: "电话", emailLabel: "电子邮箱", addressLabel: "地址", address: "韩国首尔特别市钟路区水标路120号Naein大厦8层", sitemap: "网站地图" },
  seo: { title: "KAHC 全球健康与美容职业教育", description: "立足韩国，提供健康与美容专业资格教育、课程介绍、国际活动及合作咨询的多语言平台。" },
  home: {
    heroImageAlt: "参与全球职业资格教育的 KAHC 学员与专业人士",
    heroTitlePrefix: "通过专业教育", heroTitleHighlight: "开启职业未来", heroTitleSuffix: "",
    heroFloatingTitle: "注册民间资格培训", heroFloatingLead: "通过系统课程支持专业资格学习与结业。",
    platformEyebrow: "学员支持", platformLead: "从咨询、课程规划、实践培训到就业与创业支持，为学员提供连贯的成长路径。",
    learnMore: "了解更多", viewCurriculum: "查看课程内容",
    platformFeatures: [
      { title: "一对一职业咨询", body: "通过专业咨询明确目标领域，并根据现有技能规划学习路径。" },
      { title: "就业支持体系", body: "结合实操技术、客户护理和服务能力培训，帮助学员做好就业准备。" },
      { title: "创业咨询", body: "为计划经营个人工作室或美容店的学员提供课程组合与经营方向建议。" }
    ],
    curriculumEyebrow: "教育课程", curriculumLead: "由经验丰富的讲师结合系统课程，帮助学员掌握专业实务技能。",
    activitiesEyebrow: "社区", activitiesLead: "在这里了解通知、考试合格记录、活动照片及国际交流。",
    viewAll: "查看全部", viewDetails: "查看详情", certificationEyebrow: "资格查询",
    certificationTitle: "登录后查看资格记录", certificationLead: "在个人账户中查看资格状态、结业记录与证书颁发信息。",
    certificationCta: "查询资格", certificateLabel: "证书验证", onlineInquiry: "在线咨询",
    featuredCoursesTitle: "推荐课程", featuredCoursesLead: "以实践为核心，帮助学员将所学应用于实际工作。",
    reasonsTitle: "选择 KAHC 的理由",
    reasons: [
      { title: "面向实务的培训", body: "以实践为主的课程，帮助学员在工作中运用技能。" },
      { title: "专业讲师团队", body: "经验丰富的讲师传授来自真实服务场景的技术要点。" },
      { title: "就业与创业支持", body: "通过合作伙伴网络，为求职与创业准备提供支持。" },
      { title: "一对一个性化指导", body: "根据每位学员的目标与情况规划成长路径。" }
    ],
    supportTitle: "就业与创业支持",
    supportPrograms: [
      { title: "一对一职业咨询", body: "专业顾问通过个别咨询提供适合您的就业建议。", image: "/assets/support-career-consulting-v2.png" },
      { title: "就业对接体系", body: "通过全国合作网络支持实际就业对接。", image: "/assets/support-job-network-v2.png" },
      { title: "创业咨询", body: "从商业规划到开业准备，提供专业咨询支持。", image: "/assets/support-startup-consulting-v2.png" },
      { title: "营销支持", body: "提供宣传、品牌建设与社交媒体营销方面的实务支持。", image: "/assets/support-marketing-v2.png" }
    ],
    noticesTitle: "通知公告", moreCta: "查看更多",
    notices: ["2024年6月课程开班通知", "芳香疗法专题讲座通知", "夏季皮肤护理活动", "5月资格考试安排", "参加招聘会通知"],
    scheduleTitle: "上课时间", schedules: [
      { label: "日间班", time: "周一至周五 10:00 - 14:00" },
      { label: "晚间班", time: "周一至周五 19:00 - 22:00" },
      { label: "周末班", time: "周六 10:00 - 16:00" },
      { label: "兴趣班", time: "周二、周四 14:00 - 16:00" }
    ],
    consultTitle: "从咨询开始\n向您的目标迈进", consultLead: "专业顾问将为您提供下一步指导。", consultCta: "预约咨询",
    finalKicker: "迈出第一步，开启新的未来 ✣", finalTitle: "立即预约咨询，让目标付诸行动。", finalCta: "预约咨询"
  },
  about: {
    eyebrow: "关于 KAHC", title: "协会介绍", lead: "KAHC 为健康与美容领域的学员搭建实践教育路径，将资格学习、就业与创业目标相连接。", greetingCta: "查看致辞",
    features: [
      { title: "资格备考与个性化培训", body: "顺应健康与美容产业的发展，提供面向国家资格考试的教育。通过高效课堂、备考视频、个别指导及专职讲师支持，帮助学员学习。" },
      { title: "面向就业的实践教育", body: "通过 SMC 专业技术与实操课程支持就业。从基础到进阶培训，结合咨询与职业指导，帮助学员提升实际技能。" },
      { title: "PSL 问题解决式学习", body: "将理论讲解与实践相结合，在操作中理解原理，轮流从客户与服务者的角度学习，逐步掌握技能。" },
      { title: "循序渐进实现目标", body: "在实操培训中融入职业素养与礼仪教育，指导技术、服务意识、客户护理、资格备考、就业、升学与创业准备。" },
      { title: "注重学员体验的支持体系", body: "通过讲师的细致指导、反馈跟进及系统支持，覆盖学习、报名、就业与创业准备各阶段，提升教育质量。" }
    ]
  },
  aboutSubnav: [
    { key: "intro", title: "协会介绍", href: "about" }, { key: "greeting", title: "领导致辞", href: "about/greeting" },
    { key: "instructors", title: "国际总监", href: "about/instructors" }, { key: "history", title: "发展历程", href: "about/history" },
    { key: "organization", title: "组织架构", href: "about/organization" }
  ],
  greetingPage: {
    eyebrow: "领导致辞", title: "领导致辞", lead: "",
    greetings: [
      ...leadershipGreetings["zh-CN"],
      { name: "Moon Soon-young", role: "副会长／首尔总部院长", imageUrl: "/assets/greeting-moon-soonyoung.jpg", paragraphs: [
        "首尔总部位于首尔市中心，毗邻地铁1、3、5号线交汇的钟路三街站。",
        "对于准备从事皮肤护理、美甲、化妆、美发与按摩工作的学员，选择教育机构十分重要。总部提供国家资格理论与实操课程，以及美容院技术、医学皮肤护理、芳香、经络、运动与足部按摩等从基础到进阶的培训。",
        "总部追求优质技术教育，帮助学员增强专业能力与自信，向职业目标迈进。"
      ] },
      { name: "Hwang Yu-jin", role: "大林校区院长", meta: "皮肤护理经营顾问", imageUrl: "/assets/greeting-hwang-yujin.jpg", paragraphs: [
        "大林校区位于地铁2、7号线大林站12号出口步行约一分钟处，交通便利，学习环境整洁舒适。",
        "校区提供皮肤护理、美甲、美发与按摩领域的国家资格强化教育及就业实务培训，同时注重专业人员所需的职业素养与礼仪。",
        "通过一至两个月的集中课程，帮助学员准备皮肤美容国家资格考试。希望每位学员都能自信学习，成长为专业人才。"
      ] },
      { name: "Lee Yong-ho", role: "江南按摩学院教育院长", imageUrl: "/assets/greeting-lee-yongho.jpg", paragraphs: [
        "江南按摩学院位于大林站12号出口步行约一分钟处，面向国际服务行业教授运动按摩、经络按摩、皮肤护理按摩与足部按摩。",
        "学院提供就业对接、创业咨询、海外就业推荐与留学咨询，涵盖水疗中心、按摩店、酒店、桑拿与皮肤护理机构等领域。",
        "通过一对一咨询了解学员的能力、期望工作场所、时间、待遇与地区，为学员对接合适的就业机会。"
      ] }
    ]
  },
  instructorsPage: { eyebrow: "国际总监", title: "国际总监", lead: "", instructors: internationalDirectors["zh-CN"] },
  historyPage: { eyebrow: "发展历程", title: "KAHC 发展历程", lead: "", imageAlt: "SMC Academy 发展历程图片", yearsLabel: "年份", timelineLabel: "年度历程", detailNote: "根据原发展历程页面的年度记录整理。", dateLabel: "日期", titleLabel: "事项" },
  organizationPage: { eyebrow: "组织架构", title: "KAHC 组织架构", lead: "", imageAlt: "KAHC 与 SMC Academy 组织架构图", units: [
    { title: "国际主席", body: "统筹国际教育交流与合作方向。" }, { title: "协会运营", body: "KAHC 管理教育、资格认证及分支机构运营体系。" },
    { title: "教育运营", body: "SMC Academy 与各校区团队提供资格培训与实践教育。" }, { title: "现场支持", body: "协调咨询、就业与创业支持、公共活动及合作项目。" }
  ] },
  curriculumPage: { eyebrow: "教育课程", lead: "了解专业培训课程、学习内容与适合人群，选择符合目标的学习路径。", heroTitlePrefix: "为您的目标", heroTitleHighlight: "选择专业课程", massageProgramsLabel: "按摩课程" },
  courseDetail: {
    inquiryCta: "咨询课程", allCoursesCta: "全部课程", overviewEyebrow: "课程概览", overviewTitle: "课程介绍",
    curriculumEyebrow: "课程内容", curriculumTitle: "核心培训内容", goalOverviewTitle: "目标导向课程介绍", goalPlanTitle: "学习计划", goalOutcomeTitle: "咨询与职业方向",
    durationTitle: "培训时长", detailGroupTraining: "课程结构", detailGroupCareer: "职业与收入指导", detailGroupSchedule: "上课安排",
    midCtaTitle: "咨询课程组合", midCtaLead: "根据目标职业与现有技能，帮助您规划科目和学习顺序。", sideSummaryTitle: "咨询概要",
    audienceTitle: "适合人群", certificationTitle: "结业与资格", sourceTitle: "原始链接", metricProgramTypeLabel: "课程类型", metricDurationLabel: "时长", metricLearningLabel: "学习方式",
    metricDurationFallback: "咨询确认", metricLearningFallback: "理论与实践", learningGoalsTitle: "学习目标", programStrengthsTitle: "课程优势", recommendedForTitle: "推荐人群",
    featureHighlights: ["针对性反馈", "实践为核心", "经验丰富的讲师", "结业指导"], coreTechniquesTitle: "核心技术", classProcessTitle: "教学流程",
    summaryEyebrow: "课程摘要", summaryTitle: "核心培训要点", summaryLead: "先了解学习目标、适合人群、核心技术与职业方向，再查看详细课程。",
    advancedEyebrow: "进阶指南", advancedTitle: "深入了解课程", advancedLead: "逐步了解理论、实践、护理原理及职业发展路径。",
    afterCompletionTitle: "结业后的发展", careerItems: ["专业美容院就业", "个人工作室创业", "水疗与酒店就业", "自由职业美容服务", "进阶课程学习"], landingCtaEyebrow: "培养专业技术"
  },
  activitiesPage: { eyebrow: "社区", lead: "了解通知公告、考试合格记录、活动相册、获奖、国际美容赛事、企业活动、媒体报道、志愿服务与学员评价。", detailEyebrow: "活动详情", latestPostsTitle: "最新文章", managedContentTitle: "发布内容", sourceLabel: "来源", statusLabel: "发布状态", managedStatus: "管理员发布的内容", allActivitiesCta: "全部活动", detailCta: "查看详情" },
  contact: { eyebrow: "来访路线", lead: "查看首尔总部、江南 SMC Academy 与大林校区的地址、地铁、公交及停车信息。", callCta: "拨打电话", mapCta: "打开地图", nearestStationLabel: "最近车站", mainPhoneLabel: "联系电话", parkingLabel: "停车", mapAltSuffix: "地图", addressTitle: "地址", roadAddressLabel: "道路名地址", lotAddressLabel: "地块地址", subwayTitle: "地铁路线", drivingTitle: "自驾路线", busTitle: "公交路线", busStopsCountLabel: "个站点", busExpandLabel: "展开线路", busCollapseLabel: "收起线路" },
  legal: { privacyTitle: "隐私政策", termsTitle: "使用条款", eyebrow: "法律文件", lead: "正式法律文本尚待确认。本页面为审核中的说明。", pendingTitle: "正式文本待确认", pendingBody: "本页面仅用于确认链接结构与展示位置。隐私政策和使用条款需根据实际运营政策最终确定。", requiredItems: ["收集的个人信息及使用目的", "保存与使用期限", "向第三方提供信息及委托处理", "注销账户与用户权利行使流程", "服务限制与责任范围"] },
  partnerInquiry: {
    eyebrow: "合作咨询", lead: "国际机构、教育合作伙伴与学员可通过此处提交咨询。",
    successTitle: "咨询已提交", successMessage: "您的咨询已保存，工作人员将审核并更新处理状态。", receiptLabel: "受理编号", submittedSummaryTitle: "提交内容", nextStepTitle: "后续处理流程",
    nextSteps: ["咨询进入待处理列表", "工作人员确认咨询类型与优先级", "更新处理状态与回复"],
    validation: { required: "请填写此必填项。", email: "请输入有效的电子邮箱地址。", consent: "请同意收集个人信息并处理咨询。" },
    fields: { name: "姓名", namePlaceholder: "请输入姓名", organization: "所属机构", organizationPlaceholder: "机构或公司名称", email: "电子邮箱", emailPlaceholder: "name@example.com", country: "国家或地区", countryPlaceholder: "请输入国家或地区", message: "咨询内容", messagePlaceholder: "请描述您的合作意向或问题", consent: "我同意收集个人信息并处理咨询。" }
  },
  login: {
    eyebrow: "安全登录", lead: "登录后可访问个人账户与资格记录。", email: "电子邮箱", emailPlaceholder: "name@example.com", password: "密码", passwordPlaceholder: "请输入密码",
    submitCta: "登录", forgotPassword: "忘记密码？", backToLogin: "返回登录", resetCta: "发送重置邮件", note: "登录后可查看个人资料、资格记录与咨询记录。",
    successTitle: "登录成功", successMessage: "即将跳转至您的页面。", resetSuccessTitle: "重置邮件已发送", resetSuccessMessage: "密码重置说明已发送至您的电子邮箱。",
    configurationError: "登录服务尚未连接，请联系管理员。", rateLimitError: "密码重置邮件发送次数已达上限，请稍后重试。",
    validation: { emailRequired: "请输入电子邮箱。", emailInvalid: "请输入有效的电子邮箱地址。", passwordRequired: "请输入密码。", passwordLength: "密码至少需要8个字符。" }
  },
  signup: {
    eyebrow: "创建账户", title: "注册账户", lead: "注册后可查看资格记录与咨询记录。", name: "姓名", namePlaceholder: "请输入姓名", email: "电子邮箱", emailPlaceholder: "name@example.com",
    phone: "手机号码", phonePlaceholder: "+86 138 0013 8000", country: "国家或地区", countryPlaceholder: "请选择国家或地区", interestedCourse: "感兴趣的课程", interestedCoursePlaceholder: "请选择课程",
    marketingConsent: "我同意接收教育与咨询相关信息。", password: "密码", passwordPlaceholder: "至少8个字符", confirmPassword: "确认密码", confirmPasswordPlaceholder: "请再次输入密码",
    consent: "我同意收集个人信息并创建账户。", submitCta: "注册", loginCta: "已有账户？", note: "开放注册。如需验证邮箱，请点击收件箱中的确认链接。",
    successTitle: "注册申请已提交", successMessage: "如需验证邮箱，请点击确认邮件中的链接以完成注册。", configurationError: "注册服务尚未连接，请联系管理员。",
    rateLimitError: "邮件发送次数已达上限，请稍后重试或联系管理员。", existingAccountError: "该邮箱已注册，请登录或重置密码。",
    validation: { required: "请填写必填项。", email: "请输入有效的电子邮箱地址。", passwordLength: "密码至少需要8个字符。", passwordMatch: "两次输入的密码不一致。", consent: "请同意收集个人信息并创建账户。" }
  },
  account: {
    eyebrow: "个人账户", lead: "此页面仅供已登录会员使用。", overviewTitle: "账户概览", overviewLead: "集中查看个人资料、资格记录与咨询记录。",
    profileStatus: { ready: "已填写", empty: "未填写" }, countSuffix: "条", noindexStatus: "非公开",
    nav: [{ title: "我的账户", href: "account", description: "账户概览" }, { title: "个人资料", href: "account/profile", description: "会员信息" }, { title: "资格查询", href: "account/certifications", description: "资格记录" }, { title: "咨询记录", href: "account/inquiries", description: "已提交的咨询" }],
    profile: {
      title: "个人资料", lead: "查看并更新您的会员信息。", editTitle: "编辑资料", editLead: "更新姓名、电话、国家或地区、感兴趣的课程及首选语言。", saveCta: "保存",
      successTitle: "资料已保存", successMessage: "您的会员信息已更新。", validation: { required: "请填写必填项。", email: "请输入有效的电子邮箱地址。" },
      fields: [{ label: "姓名", value: "KHCPQA 示例会员" }, { label: "电子邮箱", value: "member@example.com" }, { label: "电话", value: "+86 138 0013 8000" }, { label: "国家或地区", value: "韩国" }, { label: "感兴趣的课程", value: "皮肤美容师国家资格" }, { label: "营销信息接收", value: "已同意" }, { label: "首选语言", value: "简体中文" }]
    },
    certifications: {
      title: "资格查询", lead: "查看您的资格记录与验证信息。", lookupTitle: "查询证书", lookupLead: "输入证书编号与验证码，核验证书记录。",
      numberLabel: "证书编号", numberPlaceholder: "SMC-2026-001", verificationCodeLabel: "验证码", verificationCodePlaceholder: "PUBLIC-CODE-001",
      issuedLabel: "颁发日期", statusLabel: "状态", courseLabel: "课程", lookupCta: "查询", lookupSuccessTitle: "已找到资格记录", lookupEmptyTitle: "未找到匹配的资格记录", lookupEmptyMessage: "请检查证书编号与验证码。",
      demoHint: "示例：SMC-2026-001 / PUBLIC-CODE-001", emptyState: "暂无资格记录。", emptyGuide: "如有证书编号，可立即查询；尚未报名的学员可先了解教育课程。"
    },
    inquiries: {
      title: "咨询记录", lead: "查看合作咨询与课程咨询的受理状态。", allLabel: "全部", receiptLabel: "受理编号", typeLabel: "咨询类型", messageLabel: "咨询内容", emptyState: "此状态下暂无咨询记录。", statusLabel: "处理状态", submittedLabel: "提交日期",
      items: [{ receipt: "KHCPQA-2026-PREVIEW", title: "海外教育合作咨询", type: "partner", message: "咨询与海外教育机构开展课程合作及派遣讲师的可能性。", submittedAt: "2026-07-04", status: "已受理" }, { receipt: "KHCPQA-2026-COURSE", title: "芳香疗法课程咨询", type: "course", message: "咨询芳香疗法常规课程的时长及结业标准。", submittedAt: "2026-06-28", status: "正在准备回复" }]
    },
    modules: [{ title: "个人资料", body: "查看与编辑姓名、邮箱、国家或地区及首选语言。" }, { title: "资格查询", body: "查看课程名称、颁发日期、状态与验证信息。" }, { title: "咨询记录", body: "查看您已提交的咨询。" }, { title: "隐私保护", body: "账户页面不参与搜索引擎收录。" }],
    certificates: [{ title: "皮肤美容师国家资格", number: "SMC-2026-001", issuedAt: "2026-05-18", status: "有效", verificationCode: "PUBLIC-CODE-001" }, { title: "芳香疗法", number: "SMC-2026-014", issuedAt: "2026-06-21", status: "待审核", verificationCode: "PUBLIC-CODE-014" }]
  },
  curriculumCatalog: {
    searchLabel: "搜索课程", searchPlaceholder: "输入课程关键词", categoryLabel: "课程分类", categories: { all: "全部", certification: "资格课程", professional: "目标导向课程", practical: "实务课程" },
    goalTitle: "目标导向推荐课程", goalLead: "根据就业、创业准备、时间安排与学习目的设计课程。", catalogTitle: "实务与资格课程", catalogLead: "了解面向实际工作的技术培训与资格课程。",
    emptyState: "没有符合条件的课程，请调整关键词或分类。", viewDetails: "查看详情", courseCountLabel: "门课程", consultAriaLabel: "课程咨询", consultTitle: "不确定如何选择课程？",
    consultLead: "结合您的目标与现有技能，一起规划就业、创业或周末学习路径。", consultCta: "预约个性化咨询"
  }
} satisfies Copy;
