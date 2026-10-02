import type { Locale } from "@/lib/content";

type HistoryItem = {
  date: string;
  title: string;
  zhTitle: string;
  enTitle: string;
  esTitle: string;
};

export const historyByYear: Array<{ year: string; items: HistoryItem[] }> = [
  {
    year: "2025",
    items: [
      { date: "2025년 03월", title: "한국건강관리사자격협회 건강관리사 교육", zhTitle: "韩国健康管理师资格协会健康管理师培训", enTitle: "Health care practitioner training by the Korea Association for Health & Beauty Certification", esTitle: "Formación de profesionales del cuidado de la salud de la Asociación Coreana de Profesionales del Cuidado de la Salud" },
      { date: "2025년 05월", title: "제37회 한국휴먼 (미용,건강,문화,예술) 올림픽대회", zhTitle: "第37届韩国人类（美容、健康、文化、艺术）奥林匹克大赛", enTitle: "37th Korea Human Olympics (Beauty, Health, Culture and Arts)", esTitle: "37.ª Olimpiada Humana de Corea (Belleza, Salud, Cultura y Artes)" }
    ]
  },
  {
    year: "2024",
    items: [
      { date: "2024년 11월", title: "제36회 국제휴먼 (미용,건강,문화,예술) 올림픽대회", zhTitle: "第36届国际人类（美容、健康、文化、艺术）奥林匹克大赛", enTitle: "36th International Human Olympics (Beauty, Health, Culture and Arts)", esTitle: "36.ª Olimpiada Humana Internacional (Belleza, Salud, Cultura y Artes)" },
      { date: "2024년 12월", title: "국제미용건강신문-2024 최우수 교육기관 대상", zhTitle: "《国际美容健康新闻》2024年度最佳教育机构大奖", enTitle: "International Beauty and Health Newspaper — 2024 Grand Prize for Outstanding Educational Institution", esTitle: "Periódico Internacional de Belleza y Salud: Gran Premio a la Mejor Institución Educativa de 2024" }
    ]
  },
  {
    year: "2023",
    items: [
      { date: "2023년 10월", title: "제35회 국제휴먼 (미용,건강,문화,예술) 올림픽", zhTitle: "第35届国际人类（美容、健康、文化、艺术）奥林匹克大赛", enTitle: "35th International Human Olympics (Beauty, Health, Culture and Arts)", esTitle: "35.ª Olimpiada Humana Internacional (Belleza, Salud, Cultura y Artes)" },
      { date: "2023년 12월", title: "국제지도자 명인대상-SMC아카데미 회장 황인근", zhTitle: "国际领袖名人大奖——SMC Academy 会长 Hwang In-geun", enTitle: "International Leaders Master Award — SMC Academy Chairman Hwang In-geun", esTitle: "Premio Maestro de Líderes Internacionales: Hwang In-geun, presidente de SMC Academy" },
      { date: "2023년 5월", title: "제35회 한국휴먼 (미용,건강,문화,예술) 올림픽", zhTitle: "第35届韩国人类（美容、健康、文化、艺术）奥林匹克大赛", enTitle: "35th Korea Human Olympics (Beauty, Health, Culture and Arts)", esTitle: "35.ª Olimpiada Humana de Corea (Belleza, Salud, Cultura y Artes)" }
    ]
  },
  {
    year: "2019",
    items: [
      { date: "2019년 04월", title: "(사) 세계뷰티문화산업진흥원 표창장", zhTitle: "世界美容文化产业振兴院表彰状", enTitle: "Commendation from the World Beauty Culture Industry Promotion Institute (incorporated association)", esTitle: "Reconocimiento del Instituto de Promoción de la Industria Cultural de la Belleza Mundial (asociación constituida)" },
      { date: "2019년 05월", title: "국제휴먼(미용&건강)올림픽대회 카이로프랙틱 심사위원", zhTitle: "国际人类（美容与健康）奥林匹克大赛脊椎矫正项目评委", enTitle: "Chiropractic judge at the International Human Olympics (Beauty and Health)", esTitle: "Jurado de quiropráctica en la Olimpiada Humana Internacional (Belleza y Salud)" },
      { date: "2019년 06월", title: "세계뷰티문화산업진흥원 서울특별시 구로구 지부장 임명장", zhTitle: "获任世界美容文化产业振兴院首尔九老区分会负责人", enTitle: "Appointment as head of the Guro-gu, Seoul branch of the World Beauty Culture Industry Promotion Institute", esTitle: "Nombramiento como responsable de la delegación de Guro-gu, Seúl, del Instituto de Promoción de la Industria Cultural de la Belleza Mundial" },
      { date: "2019년 10월", title: "제31회 국제휴먼 (미용,건강,문화,예술) 올림픽", zhTitle: "第31届国际人类（美容、健康、文化、艺术）奥林匹克大赛", enTitle: "31st International Human Olympics (Beauty, Health, Culture and Arts)", esTitle: "31.ª Olimpiada Humana Internacional (Belleza, Salud, Cultura y Artes)" }
    ]
  },
  {
    year: "2017",
    items: [
      { date: "2017년 03월", title: "국제미용기능경기대회 심사위원장", zhTitle: "国际美容技能大赛评委会主席", enTitle: "Chair of judges at the International Beauty Skills Competition", esTitle: "Presidencia del jurado del Concurso Internacional de Técnicas de Belleza" },
      { date: "2017년 04월", title: "국제미용건강총연합회 심사위원", zhTitle: "国际美容健康总联合会评委", enTitle: "Judge for the International Beauty and Health Federation", esTitle: "Jurado de la Federación Internacional de Belleza y Salud" },
      { date: "2017년 08월", title: "미래에셋 20주년 기념 VIP고객 초청행사 핸드마사지", zhTitle: "未来资产20周年 VIP 客户邀请活动手部按摩服务", enTitle: "Hand massage at Mirae Asset's 20th anniversary VIP customer invitation event", esTitle: "Masaje de manos en el evento para clientes VIP del 20.º aniversario de Mirae Asset" },
      { date: "2017년 10월", title: "경기도 노인사회활동 활성화 대회 발마사지", zhTitle: "京畿道老年人社会活动促进大会足部按摩服务", enTitle: "Foot massage at the Gyeonggi-do Conference for Promoting Social Activities for Older Adults", esTitle: "Masaje de pies en el encuentro de Gyeonggi-do para fomentar las actividades sociales de las personas mayores" },
      { date: "2017년 10월", title: "BGF 골프대회 행사 핸드마사지", zhTitle: "BGF 高尔夫比赛手部按摩服务", enTitle: "Hand massage at the BGF golf tournament", esTitle: "Masaje de manos en el torneo de golf de BGF" }
    ]
  },
  {
    year: "2016",
    items: [
      { date: "2016년 03월", title: "일간스포츠 대한민국 고객만족 브랜드 대상", zhTitle: "《日刊体育》韩国客户满意品牌大奖", enTitle: "Ilgan Sports Korea Customer Satisfaction Brand Grand Prize", esTitle: "Gran Premio de Marca por Satisfacción del Cliente en Corea de Ilgan Sports" },
      { date: "2016년 04월", title: "국제휴먼(미용&건강)올림픽대회 위원장", zhTitle: "国际人类（美容与健康）奥林匹克大赛委员会主席", enTitle: "Chair of the International Human Olympics (Beauty and Health)", esTitle: "Presidencia de la Olimpiada Humana Internacional (Belleza y Salud)" },
      { date: "2016년 11월", title: "국제휴먼(미용&건강)올림픽대회 심사위원", zhTitle: "国际人类（美容与健康）奥林匹克大赛评委", enTitle: "Judge at the International Human Olympics (Beauty and Health)", esTitle: "Jurado de la Olimpiada Humana Internacional (Belleza y Salud)" }
    ]
  },
  {
    year: "2015",
    items: [
      { date: "2015년 04월", title: "한류FESTIVAL & K-BEAUTY WORLD FESTIVAL 심사위원", zhTitle: "韩流 FESTIVAL 与 K-BEAUTY WORLD FESTIVAL 评委", enTitle: "Judge at Hallyu FESTIVAL & K-BEAUTY WORLD FESTIVAL", esTitle: "Jurado de Hallyu FESTIVAL y K-BEAUTY WORLD FESTIVAL" }
    ]
  },
  {
    year: "2014",
    items: [
      { date: "2014년 03월", title: "그랜드힐튼 호텔에서 엔자임 Eucerin 핸드마사지", zhTitle: "首尔希尔顿大酒店 Enzyme Eucerin 手部按摩活动", enTitle: "Enzyme Eucerin hand massage at the Grand Hilton Hotel", esTitle: "Masaje de manos de Enzyme Eucerin en el Grand Hilton Hotel" },
      { date: "2014년 05월", title: "경기도 여주 렉스필드 골프장 서울대학교 보건대학원 총동문회장배 골프첼린지", zhTitle: "京畿道骊州 Rexfield 高尔夫球场首尔大学公共卫生研究生院校友会长杯挑战赛", enTitle: "Seoul National University Graduate School of Public Health Alumni Association President's Cup Golf Challenge at Rexfield Golf Club, Yeoju, Gyeonggi-do", esTitle: "Desafío de golf Copa del Presidente de la Asociación de Antiguos Alumnos de la Escuela de Posgrado de Salud Pública de la Universidad Nacional de Seúl, en Rexfield Golf Club, Yeoju, Gyeonggi-do" },
      { date: "2014년 05월", title: "송도 힐웨이 건강센터 발마사지", zhTitle: "松岛 Hillway 健康中心足部按摩服务", enTitle: "Foot massage at Songdo Hillway Health Center", esTitle: "Masaje de pies en el Centro de Salud Hillway de Songdo" },
      { date: "2014년 06월", title: "도쿄일렉트론 코리아 DTKS 청려수려원 행사 초청", zhTitle: "受邀参加 Tokyo Electron Korea DTKS 清丽修练院活动", enTitle: "Invitation to the Tokyo Electron Korea DTKS event at Cheongnyeo Suryeowon", esTitle: "Invitación al evento de Tokyo Electron Korea DTKS en Cheongnyeo Suryeowon" },
      { date: "2014년 06월", title: "사이퍼스 유저 3주년 간담회 일산 원마운트 핸드마사지", zhTitle: "Cyphers 玩家三周年座谈会——一山 One Mount 手部按摩服务", enTitle: "Hand massage at the Cyphers users' third anniversary gathering at One Mount, Ilsan", esTitle: "Masaje de manos en el encuentro del tercer aniversario de los usuarios de Cyphers en One Mount, Ilsan" },
      { date: "2014년 06월", title: "스킨 Rx 개업 핸드마사지", zhTitle: "Skin Rx 开业手部按摩服务", enTitle: "Hand massage for the opening of Skin Rx", esTitle: "Masaje de manos en la inauguración de Skin Rx" },
      { date: "2014년 10월", title: "대한정형외과학회 홍은동 그랜드 힐튼 호텔 체어마사지", zhTitle: "大韩骨科学会——弘恩洞希尔顿大酒店座椅按摩服务", enTitle: "Chair massage for the Korean Orthopaedic Association at the Grand Hilton Hotel, Hongeun-dong", esTitle: "Masaje en silla para la Asociación Coreana de Ortopedia en el Grand Hilton Hotel, Hongeun-dong" },
      { date: "2014년 10월", title: "2014 대한민국 국제 농기계자재박람회 천안 삼거리공원 체어마사지", zhTitle: "2014韩国国际农机及资材博览会——天安三岔路公园座椅按摩服务", enTitle: "Chair massage at the 2014 Korea International Exhibition of Machinery, Equipment and Materials for Agriculture at Cheonan Samgeori Park", esTitle: "Masaje en silla en la Exposición Internacional de Maquinaria, Equipos y Materiales Agrícolas de Corea de 2014, en el parque Samgeori de Cheonan" },
      { date: "2014년 11월", title: "이천 휘닉스 스프링스cc 골프대회 체어마사지", zhTitle: "利川 Phoenix Springs CC 高尔夫比赛座椅按摩服务", enTitle: "Chair massage at the golf tournament at Phoenix Springs CC, Icheon", esTitle: "Masaje en silla en el torneo de golf de Phoenix Springs CC, Icheon" },
      { date: "2014년 11월", title: "파주 헤이리마을 포레스타 체어마사지", zhTitle: "坡州 Heyri 艺术村 Foresta 座椅按摩服务", enTitle: "Chair massage at Foresta in Heyri Village, Paju", esTitle: "Masaje en silla en Foresta, en el pueblo de Heyri, Paju" }
    ]
  },
  {
    year: "2013",
    items: [
      { date: "2013년 02월", title: "K-BEAUTY DESIGN WORLD CONTEST 세계조직위원회", zhTitle: "K-BEAUTY DESIGN WORLD CONTEST 世界组织委员会", enTitle: "World Organizing Committee of K-BEAUTY DESIGN WORLD CONTEST", esTitle: "Comité Organizador Mundial de K-BEAUTY DESIGN WORLD CONTEST" },
      { date: "2013년 02월", title: "SMC아카데미 대림캠퍼스 오픈", zhTitle: "SMC Academy 大林校区开业", enTitle: "Opening of SMC Academy's Daerim campus", esTitle: "Inauguración del campus de Daerim de SMC Academy" },
      { date: "2013년 09월", title: "여의도 63빌딩 롯데카드 VIP고객 초청 아스타리프트 화장품 핸드마사지", zhTitle: "汝矣岛63大厦乐天信用卡 VIP 客户邀请活动——ASTALIFT 化妆品手部按摩服务", enTitle: "ASTALIFT cosmetics hand massage at the Lotte Card VIP customer invitation event at 63 Building, Yeouido", esTitle: "Masaje de manos con cosméticos ASTALIFT en el evento para clientes VIP de Lotte Card en el edificio 63, Yeouido" },
      { date: "2013년 10월", title: "가로수길 갤러리카페 '코노이스페이스'에서 진행된 Dr.G 런칭행사 핸드마사지", zhTitle: "林荫路画廊咖啡馆 Konoi Space Dr.G 发布活动手部按摩服务", enTitle: "Hand massage at the Dr.G launch event at Konoi Space gallery café, Garosu-gil", esTitle: "Masaje de manos en el lanzamiento de Dr.G en el café galería Konoi Space, Garosu-gil" },
      { date: "2013년 10월", title: "BGF리테일 골프대회 이천 휘닉스스프링스 골프장 VIP선수 체어마사지", zhTitle: "BGF Retail 高尔夫比赛——利川 Phoenix Springs 球场 VIP 选手座椅按摩服务", enTitle: "Chair massage for VIP players at the BGF Retail golf tournament at Phoenix Springs Golf Club, Icheon", esTitle: "Masaje en silla para jugadores VIP en el torneo de golf de BGF Retail en Phoenix Springs Golf Club, Icheon" },
      { date: "2013년 11월", title: "중앙일보 마라톤대회 잠실종합운동장", zhTitle: "《中央日报》马拉松赛——蚕室综合运动场", enTitle: "JoongAng Ilbo Marathon at Jamsil Sports Complex", esTitle: "Maratón de JoongAng Ilbo en el Complejo Deportivo de Jamsil" }
    ]
  },
  {
    year: "2012",
    items: [
      { date: "2012년 01월", title: "아모레퍼시픽 신제품 발표회 VIP고객 마사지", zhTitle: "爱茉莉太平洋新品发布会 VIP 客户按摩服务", enTitle: "VIP customer massage at the Amorepacific new product presentation", esTitle: "Masaje para clientes VIP en la presentación de nuevos productos de Amorepacific" },
      { date: "2012년 01월", title: "전우마라톤대회 스포츠마사지", zhTitle: "战友马拉松赛运动按摩服务", enTitle: "Sports massage at the Comrades Marathon", esTitle: "Masaje deportivo en el Maratón de Camaradas" },
      { date: "2012년 05월", title: "존슨&존슨 국제성형미용엑스포 코엑스 행사 VIP고객 마사지", zhTitle: "强生国际整形美容博览会 COEX 活动 VIP 客户按摩服务", enTitle: "VIP customer massage at the Johnson & Johnson International Plastic Surgery and Beauty Expo event at COEX", esTitle: "Masaje para clientes VIP en el evento de Johnson & Johnson de la Exposición Internacional de Cirugía Plástica y Belleza en COEX" },
      { date: "2012년 05월", title: "로에알 한국지사 코엑스 아셈타워 마사지", zhTitle: "欧莱雅韩国分公司 COEX ASEM Tower 按摩服务", enTitle: "Massage for L'Oréal's Korean branch at COEX ASEM Tower", esTitle: "Masaje para la delegación coreana de L'Oréal en ASEM Tower, COEX" },
      { date: "2012년 05월", title: "한국 노총 마라톤 대회 스포츠마사지", zhTitle: "韩国劳动组合总联盟马拉松赛运动按摩服务", enTitle: "Sports massage at the Federation of Korean Trade Unions marathon", esTitle: "Masaje deportivo en el maratón de la Federación de Sindicatos Coreanos" },
      { date: "2012년 07월", title: "서울특별시주최 여성주간 개막행사 베이비마사지", zhTitle: "首尔市妇女周开幕活动婴儿按摩服务", enTitle: "Baby massage at the opening event of Women's Week hosted by the Seoul Metropolitan Government", esTitle: "Masaje para bebés en la inauguración de la Semana de la Mujer organizada por el Gobierno Metropolitano de Seúl" },
      { date: "2012년 07월", title: "세계미용기능대회 조직위원 임명", zhTitle: "获任世界美容技能大赛组织委员", enTitle: "Appointment to the organizing committee of the World Beauty Skills Competition", esTitle: "Nombramiento como miembro del comité organizador del Concurso Mundial de Técnicas de Belleza" },
      { date: "2012년 08월", title: "카톨릭대학교 부평성모병원 의사 발마사지 서비스 지원활동", zhTitle: "天主教大学富平圣母医院医生足部按摩支持活动", enTitle: "Foot massage support for doctors at the Catholic University's Bupyeong St. Mary's Hospital", esTitle: "Servicio de apoyo con masaje de pies para médicos del Hospital St. Mary de Bupyeong de la Universidad Católica" },
      { date: "2012년 10월", title: "BGF리테일 골프대회 마사지 서비스 지원활동", zhTitle: "BGF Retail 高尔夫比赛按摩支持活动", enTitle: "Massage service support at the BGF Retail golf tournament", esTitle: "Servicio de apoyo con masajes en el torneo de golf de BGF Retail" },
      { date: "2012년 10월", title: "가평 크리스탈 밸리 골프장 EMC CLASSIC 2011 골프대회 VIP고객 마사지", zhTitle: "加平 Crystal Valley 球场 EMC CLASSIC 2011 高尔夫比赛 VIP 客户按摩服务", enTitle: "VIP customer massage at the EMC CLASSIC 2011 golf tournament at Crystal Valley Golf Club, Gapyeong", esTitle: "Masaje para clientes VIP en el torneo de golf EMC CLASSIC 2011 en Crystal Valley Golf Club, Gapyeong" },
      { date: "2012년 10월", title: "코엑스 대한피부과학회 추계학술대회 VIP고객 마사지", zhTitle: "COEX 大韩皮肤科学会秋季学术大会 VIP 客户按摩服务", enTitle: "VIP customer massage at the Korean Dermatological Association's autumn academic conference at COEX", esTitle: "Masaje para clientes VIP en el congreso académico de otoño de la Asociación Coreana de Dermatología en COEX" },
      { date: "2012년 11월", title: "잭니클라우스 골프장 LEXUS 도요타자동차 All New LS Launching 골프대회 마사지", zhTitle: "Jack Nicklaus 球场雷克萨斯 All New LS 发布高尔夫活动按摩服务", enTitle: "Massage at the LEXUS Toyota All New LS Launching golf tournament at Jack Nicklaus Golf Club", esTitle: "Masaje en el torneo de golf de lanzamiento del All New LS de LEXUS Toyota en Jack Nicklaus Golf Club" },
      { date: "2012년 11월", title: "블랙스톤 골프장 SPC GREEN SUMMIT 2012 골프대회 마사지", zhTitle: "Blackstone 球场 SPC GREEN SUMMIT 2012 高尔夫比赛按摩服务", enTitle: "Massage at the SPC GREEN SUMMIT 2012 golf tournament at Blackstone Golf Club", esTitle: "Masaje en el torneo de golf SPC GREEN SUMMIT 2012 en Blackstone Golf Club" },
      { date: "2012년 11월", title: "중앙일보 마라톤 대회 CU선수 전용마사지", zhTitle: "《中央日报》马拉松赛 CU 选手专属按摩服务", enTitle: "Exclusive massage for CU runners at the JoongAng Ilbo Marathon", esTitle: "Masaje exclusivo para corredores de CU en el Maratón de JoongAng Ilbo" },
      { date: "2012년 12월", title: "피부미용사 국가자격증 저작권 심의위원회 저작권 등록", zhTitle: "皮肤美容师国家资格相关著作权登记", enTitle: "Copyright registration with the Copyright Deliberation Committee for the national esthetician qualification", esTitle: "Registro de derechos de autor ante el Comité de Deliberación de Derechos de Autor para la certificación nacional de esteticista" },
      { date: "2012년 12월", title: "무통경락 저작권 심의위원회 저작권 등록", zhTitle: "无痛经络相关著作权登记", enTitle: "Copyright registration with the Copyright Deliberation Committee for painless meridian massage", esTitle: "Registro de derechos de autor ante el Comité de Deliberación de Derechos de Autor para el masaje de meridianos sin dolor" }
    ]
  },
  {
    year: "2011",
    items: [
      { date: "2011년 11월", title: "피부미용사 대회 심사위원 임명", zhTitle: "获任皮肤美容师大赛评委", enTitle: "Appointment as a judge at the Estheticians Competition", esTitle: "Nombramiento como jurado del Concurso de Esteticistas" }
    ]
  },
  {
    year: "2010",
    items: [
      { date: "2010년 03월", title: "SMC아카데미 전문가과정 저작권 심의위원회 저작권 등록", zhTitle: "SMC Academy 专业课程著作权登记", enTitle: "Copyright registration with the Copyright Deliberation Committee for SMC Academy's professional course", esTitle: "Registro de derechos de autor ante el Comité de Deliberación de Derechos de Autor para el curso profesional de SMC Academy" },
      { date: "2010년 04월", title: "SMC아카데미 / 사단법인 한국건강관리사자격협회 홈페이지 저작권 심의위원회 저작권 등록", zhTitle: "SMC Academy／韩国健康管理师资格协会网站著作权登记", enTitle: "Copyright registration with the Copyright Deliberation Committee for the SMC Academy / Korea Association for Health & Beauty Certification (incorporated association) website", esTitle: "Registro de derechos de autor ante el Comité de Deliberación de Derechos de Autor para el sitio web de SMC Academy / Asociación Coreana de Profesionales del Cuidado de la Salud (asociación constituida)" },
      { date: "2010년 05월", title: "국제미용심사위원 임명", zhTitle: "获任国际美容评委", enTitle: "Appointment as an international beauty judge", esTitle: "Nombramiento como jurado internacional de belleza" },
      { date: "2010년 05월", title: "노동절 마라톤대회 잠실 종합운동장 스포츠마사지", zhTitle: "劳动节马拉松赛——蚕室综合运动场运动按摩服务", enTitle: "Sports massage at the Labor Day Marathon at Jamsil Sports Complex", esTitle: "Masaje deportivo en el Maratón del Día del Trabajo en el Complejo Deportivo de Jamsil" },
      { date: "2010년 05월", title: "대림 e-편한세상 브랜드 홍보관 발마사지", zhTitle: "大林 e-Pyeonhansesang 品牌展示馆足部按摩服务", enTitle: "Foot massage at the Daelim e-Pyeonhansesang brand showroom", esTitle: "Masaje de pies en la sala de exposición de la marca e-Pyeonhansesang de Daelim" },
      { date: "2010년 05월", title: "AK프라자 가족사랑더하기 걷기 대회 마사지", zhTitle: "AK Plaza 家庭关爱徒步活动按摩服务", enTitle: "Massage at the AK Plaza Family Love Plus walking event", esTitle: "Masaje en la caminata Family Love Plus de AK Plaza" },
      { date: "2010년 05월", title: "대한민국 국회 우수지도사 표창장 수상", zhTitle: "获韩国国会优秀指导师表彰状", enTitle: "Outstanding Instructor Commendation from the National Assembly of the Republic of Korea", esTitle: "Reconocimiento como Instructor Destacado de la Asamblea Nacional de la República de Corea" },
      { date: "2010년 07월", title: "한솔 오크밸리 리조트 마사지", zhTitle: "Hansol Oak Valley 度假村按摩服务", enTitle: "Massage at Hansol Oak Valley Resort", esTitle: "Masaje en Hansol Oak Valley Resort" },
      { date: "2010년 08월", title: "가평 잣 축제 서울 명동 홍보행사 마사지", zhTitle: "加平松子节首尔明洞宣传活动按摩服务", enTitle: "Massage at the Gapyeong Pine Nut Festival promotional event in Myeong-dong, Seoul", esTitle: "Masaje en el evento promocional del Festival del Piñón de Gapyeong en Myeong-dong, Seúl" },
      { date: "2010년 09월", title: "가평 크리스탈 밸리 골프장 EMC CLASSIC 2010 골프대회 VIP고객 마사지", zhTitle: "加平 Crystal Valley 球场 EMC CLASSIC 2010 高尔夫比赛 VIP 客户按摩服务", enTitle: "VIP customer massage at the EMC CLASSIC 2010 golf tournament at Crystal Valley Golf Club, Gapyeong", esTitle: "Masaje para clientes VIP en el torneo de golf EMC CLASSIC 2010 en Crystal Valley Golf Club, Gapyeong" }
    ]
  },
  {
    year: "2009",
    items: [
      { date: "2009년 02월", title: "문화체육관광부 문화로 따뜻한 겨울나기 정선프란치스코집 봉사활동", zhTitle: "文化体育观光部“文化温暖过冬”活动——旌善方济各之家志愿服务", enTitle: "Volunteer service at Francis House, Jeongseon, for the Ministry of Culture, Sports and Tourism's Warm Winter through Culture program", esTitle: "Voluntariado en la Casa de San Francisco, Jeongseon, para el programa Un Invierno Cálido a través de la Cultura del Ministerio de Cultura, Deportes y Turismo" },
      { date: "2009년 02월", title: "문화체육관광부 문화로 따뜻한 겨울나기 태안볏가리마을 봉사활동", zhTitle: "文化体育观光部“文化温暖过冬”活动——泰安 Byeotgari 村志愿服务", enTitle: "Volunteer service at Byeotgari Village, Taean, for the Ministry of Culture, Sports and Tourism's Warm Winter through Culture program", esTitle: "Voluntariado en el pueblo de Byeotgari, Taean, para el programa Un Invierno Cálido a través de la Cultura del Ministerio de Cultura, Deportes y Turismo" },
      { date: "2009년 02월", title: "문화체육부 문화로 따뜻한 겨울나기 정선 마사지", zhTitle: "文化体育部“文化温暖过冬”活动——旌善按摩服务", enTitle: "Massage in Jeongseon for the Ministry of Culture and Sports' Warm Winter through Culture program", esTitle: "Masaje en Jeongseon para el programa Un Invierno Cálido a través de la Cultura del Ministerio de Cultura y Deportes" },
      { date: "2009년 04월", title: "롯데백화점 VIP고객 마사지", zhTitle: "乐天百货 VIP 客户按摩服务", enTitle: "Massage for Lotte Department Store VIP customers", esTitle: "Masaje para clientes VIP de Lotte Department Store" },
      { date: "2009년 05월", title: "제3회 국제헤어피부미용기능경진대회 피부미용부분 그랑프리수상", zhTitle: "第3届国际美发与皮肤美容技能大赛皮肤美容项目最高奖", enTitle: "Grand Prix in the skin care category at the 3rd International Hair and Skin Care Skills Competition", esTitle: "Gran Premio en la categoría de cuidado de la piel del 3.er Concurso Internacional de Técnicas de Peluquería y Cuidado de la Piel" },
      { date: "2009년 08월", title: "이로와지 프레스 화장품 런칭 행사 경락마사지", zhTitle: "Irowaji Press 化妆品发布活动经络按摩服务", enTitle: "Meridian massage at the Irowaji Press cosmetics launch event", esTitle: "Masaje de meridianos en el lanzamiento de cosméticos de Irowaji Press" },
      { date: "2009년 09월", title: "BMW자동차 신차 발표회 VIP고객 마사지", zhTitle: "宝马新车发布会 VIP 客户按摩服务", enTitle: "VIP customer massage at the BMW new car presentation", esTitle: "Masaje para clientes VIP en la presentación de un nuevo automóvil de BMW" }
    ]
  },
  {
    year: "2008",
    items: [
      { date: "2008년 01월", title: "롯데백화점 화장품 런칭 이벤트 마사지 서비스 지원활동", zhTitle: "乐天百货化妆品发布活动按摩支持服务", enTitle: "Massage service support at the Lotte Department Store cosmetics launch event", esTitle: "Servicio de apoyo con masajes en el lanzamiento de cosméticos de Lotte Department Store" },
      { date: "2008년 02월", title: "한국헤어피부미용중앙회 부회장 임명", zhTitle: "获任韩国美发皮肤美容中央会副会长", enTitle: "Appointment as vice president of the Korea Hair and Skin Care Central Association", esTitle: "Nombramiento como vicepresidente de la Asociación Central Coreana de Peluquería y Cuidado de la Piel" },
      { date: "2008년 02월", title: "벽성대학교 산학협동약정", zhTitle: "与碧城大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Byuksung College", esTitle: "Acuerdo de cooperación entre industria y academia con Byuksung College" },
      { date: "2008년 03월", title: "리첸시아 스킨케어 서비스 VIP고객 지원활동", zhTitle: "Richensia 皮肤护理 VIP 客户支持活动", enTitle: "Skin care service support for Richensia VIP customers", esTitle: "Servicio de apoyo de cuidado de la piel para clientes VIP de Richensia" },
      { date: "2008년 04월", title: "대한펄프 매직스 봄맞이 페스티발 VIP고객", zhTitle: "大韩纸浆 Magic's 迎春庆典 VIP 客户活动", enTitle: "VIP customers at Daehan Pulp Magic's Spring Festival", esTitle: "Clientes VIP en el Festival de Primavera de Magic's de Daehan Pulp" },
      { date: "2008년 05월", title: "캘빈클라인 스킨케어 VIP고객 마사지", zhTitle: "Calvin Klein 皮肤护理 VIP 客户按摩服务", enTitle: "Massage for Calvin Klein Skin Care VIP customers", esTitle: "Masaje para clientes VIP de Calvin Klein Skin Care" },
      { date: "2008년 06월", title: "LG생활용품 VIP고객 마사지", zhTitle: "LG 生活用品 VIP 客户按摩服务", enTitle: "Massage for LG Household Products VIP customers", esTitle: "Masaje para clientes VIP de LG Household Products" },
      { date: "2008년 06월", title: "한국건강관리사자격협회 부산점오픈", zhTitle: "韩国健康管理师资格协会釜山分部开业", enTitle: "Opening of the Korea Association for Health & Beauty Certification' Busan branch", esTitle: "Inauguración de la delegación de Busan de la Asociación Coreana de Profesionales del Cuidado de la Salud" },
      { date: "2008년 09월", title: "수원여자전문대학 산학협동약정", zhTitle: "与水原女子专门大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Suwon Women's College", esTitle: "Acuerdo de cooperación entre industria y academia con Suwon Women's College" },
      { date: "2008년 10월", title: "마이크로소프트 20주년 기념행사 마사지", zhTitle: "微软20周年纪念活动按摩服务", enTitle: "Massage at Microsoft's 20th anniversary event", esTitle: "Masaje en el evento del 20.º aniversario de Microsoft" },
      { date: "2008년 10월", title: "국방마라톤 대회 장병들 스포츠마사지", zhTitle: "国防马拉松赛官兵运动按摩服务", enTitle: "Sports massage for military personnel at the National Defense Marathon", esTitle: "Masaje deportivo para militares en el Maratón de Defensa Nacional" },
      { date: "2008년 10월", title: "신림순대축제 마사지", zhTitle: "新林米肠节按摩服务", enTitle: "Massage at the Sillim Sundae Festival", esTitle: "Masaje en el Festival de Sundae de Sillim" },
      { date: "2008년 10월", title: "노동부 한국사회적기업협의회 청계천 광장 봉사활동", zhTitle: "劳动部与韩国社会企业协议会清溪川广场志愿服务", enTitle: "Volunteer service at Cheonggyecheon Plaza for the Ministry of Labor and the Korea Social Enterprise Council", esTitle: "Voluntariado en la plaza de Cheonggyecheon para el Ministerio de Trabajo y el Consejo Coreano de Empresas Sociales" },
      { date: "2008년 10월", title: "노동부와 한국사회적기업협의회 마사지", zhTitle: "劳动部与韩国社会企业协议会按摩服务", enTitle: "Massage for the Ministry of Labor and the Korea Social Enterprise Council", esTitle: "Masaje para el Ministerio de Trabajo y el Consejo Coreano de Empresas Sociales" },
      { date: "2008년 11월", title: "서울디자인 행사 마사지", zhTitle: "首尔设计活动按摩服务", enTitle: "Massage at a Seoul Design event", esTitle: "Masaje en un evento de Diseño de Seúl" },
      { date: "2008년 11월", title: "교원 워크샵 마사지", zhTitle: "教员工作坊按摩服务", enTitle: "Massage at a teachers' workshop", esTitle: "Masaje en un taller para docentes" },
      { date: "2008년 11월", title: "대한민국 국회 윤리특별위원회 표창장 수상", zhTitle: "获韩国国会伦理特别委员会表彰状", enTitle: "Commendation from the Special Committee on Ethics of the National Assembly of the Republic of Korea", esTitle: "Reconocimiento del Comité Especial de Ética de la Asamblea Nacional de la República de Corea" },
      { date: "2008년 12월", title: "서울국제미용건강 올림픽대회 출전 대상 수상", zhTitle: "参加首尔国际美容健康奥林匹克大赛并获大奖", enTitle: "Participation and Grand Prize at the Seoul International Beauty and Health Olympics", esTitle: "Participación y Gran Premio en la Olimpiada Internacional de Belleza y Salud de Seúl" }
    ]
  },
  {
    year: "2007",
    items: [
      { date: "2007년 01월", title: "현대기술학교 산학협동약정", zhTitle: "与现代技术学校签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Hyundai Technical School", esTitle: "Acuerdo de cooperación entre industria y academia con Hyundai Technical School" },
      { date: "2007년 03월", title: "무주리조트 캐나디언클럽 스노우 캠프 위스키 VIP고객 마사지", zhTitle: "茂朱度假村 Canadian Club 冰雪营 VIP 客户按摩服务", enTitle: "Massage for Canadian Club whisky VIP customers at Snow Camp, Muju Resort", esTitle: "Masaje para clientes VIP del whisky Canadian Club en Snow Camp, Muju Resort" },
      { date: "2007년 03월", title: "용인 에버렌드 스피드웨이 자동차경주 VIP고객 마사지", zhTitle: "龙仁爱宝乐园 Speedway 赛车活动 VIP 客户按摩服务", enTitle: "VIP customer massage at the motor race at Everland Speedway, Yongin", esTitle: "Masaje para clientes VIP en la carrera de automóviles de Everland Speedway, Yongin" },
      { date: "2007년 03월", title: "애경백화점 VIP고객 마사지", zhTitle: "爱敬百货 VIP 客户按摩服务", enTitle: "Massage for Aekyung Department Store VIP customers", esTitle: "Masaje para clientes VIP de Aekyung Department Store" },
      { date: "2007년 04월", title: "아스트라 제네카 제약회사 아타칸데이 행사 마사지", zhTitle: "阿斯利康 Atacand Day 活动按摩服务", enTitle: "Massage at pharmaceutical company AstraZeneca's Atacand Day event", esTitle: "Masaje en el evento Atacand Day de la farmacéutica AstraZeneca" },
      { date: "2007년 05월", title: "제14회 서울국제미용경연대회 그랑프리수상", zhTitle: "第14届首尔国际美容大赛最高奖", enTitle: "Grand Prix at the 14th Seoul International Beauty Competition", esTitle: "Gran Premio en el 14.º Concurso Internacional de Belleza de Seúl" },
      { date: "2007년 05월", title: "인하대학교 봄 축제 봉사활동", zhTitle: "仁荷大学春季庆典志愿服务", enTitle: "Volunteer service at Inha University's spring festival", esTitle: "Voluntariado en el festival de primavera de la Universidad de Inha" },
      { date: "2007년 05월", title: "인하대학교 봄축제 마사지", zhTitle: "仁荷大学春季庆典按摩服务", enTitle: "Massage at Inha University's spring festival", esTitle: "Masaje en el festival de primavera de la Universidad de Inha" },
      { date: "2007년 05월", title: "대구 동아백화점 VIP고객 피부관리 마사지", zhTitle: "大邱东亚百货 VIP 客户皮肤护理按摩服务", enTitle: "Skin care massage for Dong-A Department Store VIP customers in Daegu", esTitle: "Masaje de cuidado de la piel para clientes VIP de Dong-A Department Store en Daegu" },
      { date: "2007년 06월", title: "서울여자간호전문대학 산학협동약정", zhTitle: "与首尔女子护理专门大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Seoul Women's College of Nursing", esTitle: "Acuerdo de cooperación entre industria y academia con Seoul Women's College of Nursing" },
      { date: "2007년 06월", title: "서울호서전문대학 산학협동약정", zhTitle: "与首尔湖西专门大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Seoul Hoseo College", esTitle: "Acuerdo de cooperación entre industria y academia con Seoul Hoseo College" },
      { date: "2007년 06월", title: "대구 롯데백화점 VIP고객 피부관리", zhTitle: "大邱乐天百货 VIP 客户皮肤护理服务", enTitle: "Skin care for Lotte Department Store VIP customers in Daegu", esTitle: "Cuidado de la piel para clientes VIP de Lotte Department Store en Daegu" },
      { date: "2007년 09월", title: "뉴트로지나 풋크림 샘플링 이벤트 마사지", zhTitle: "露得清足霜试用活动按摩服务", enTitle: "Massage at the Neutrogena foot cream sampling event", esTitle: "Masaje en el evento de muestras de crema para pies de Neutrogena" },
      { date: "2007년 09월", title: "에버랜드 BAT Korea Company Event VIP고객 마사지 서비스", zhTitle: "爱宝乐园 BAT Korea 公司活动 VIP 客户按摩服务", enTitle: "VIP customer massage service at the BAT Korea Company Event at Everland", esTitle: "Servicio de masaje para clientes VIP en el evento de BAT Korea en Everland" },
      { date: "2007년 10월", title: "제34회 일본큐슈이미용경연대회 대상 수상", zhTitle: "第34届日本九州理美容大赛大奖", enTitle: "Grand Prize at the 34th Kyushu Hairdressing and Beauty Competition in Japan", esTitle: "Gran Premio en el 34.º Concurso de Peluquería y Belleza de Kyushu, Japón" },
      { date: "2007년 10월", title: "KBS 해피투게더 TV방송출연", zhTitle: "出演 KBS《Happy Together》电视节目", enTitle: "TV appearance on KBS Happy Together", esTitle: "Aparición en el programa de televisión Happy Together de KBS" },
      { date: "2007년 10월", title: "제23회 국제미용경연대회 대상수상", zhTitle: "第23届国际美容大赛大奖", enTitle: "Grand Prize at the 23rd International Beauty Competition", esTitle: "Gran Premio en el 23.er Concurso Internacional de Belleza" },
      { date: "2007년 11월", title: "2007 국제헤어피부미용대회 최다수상", zhTitle: "2007国际美发皮肤美容大赛获奖数量最多", enTitle: "Most awards at the 2007 International Hair and Skin Care Competition", esTitle: "Mayor número de premios en el Concurso Internacional de Peluquería y Cuidado de la Piel de 2007" },
      { date: "2007년 11월", title: "국제미용뉴스사 주체 국제미용문화제 예술대상 수상", zhTitle: "国际美容新闻社主办国际美容文化节艺术大奖", enTitle: "Arts Grand Prize at the International Beauty Culture Festival hosted by International Beauty News", esTitle: "Gran Premio de las Artes en el Festival Internacional de Cultura de la Belleza organizado por International Beauty News" },
      { date: "2007년 11월", title: "대한민국국회 보건복지위원회 표창장 수상", zhTitle: "获韩国国会保健福利委员会表彰状", enTitle: "Commendation from the Health and Welfare Committee of the National Assembly of the Republic of Korea", esTitle: "Reconocimiento del Comité de Salud y Bienestar de la Asamblea Nacional de la República de Corea" },
      { date: "2007년 11월", title: "직능정책본부 행정자치위원회 헤어피부미용특별위원회부위원장 임명", zhTitle: "获任职能政策本部行政自治委员会美发皮肤美容特别委员会副委员长", enTitle: "Appointment as vice chair of the Special Committee on Hair and Skin Care under the Administration and Local Autonomy Committee of the Occupational Policy Headquarters", esTitle: "Nombramiento como vicepresidente del Comité Especial de Peluquería y Cuidado de la Piel del Comité de Administración y Autonomía Local de la Sede de Política Ocupacional" },
      { date: "2007년 11월", title: "LG전자 VIP초청 마사지", zhTitle: "LG 电子 VIP 邀请活动按摩服务", enTitle: "Massage at an LG Electronics VIP invitation event", esTitle: "Masaje en un evento para invitados VIP de LG Electronics" },
      { date: "2007년 12월", title: "창조문학신문사 대한민국 CEO대상", zhTitle: "创作文艺新闻社韩国 CEO 大奖", enTitle: "Korea CEO Grand Prize from Changjo Literature Newspaper", esTitle: "Gran Premio CEO de Corea del periódico literario Changjo" },
      { date: "2007년 12월", title: "제17대 대통령선거 중앙선거 대책위원회 부위원장 임명", zhTitle: "获任第17届总统选举中央选举对策委员会副委员长", enTitle: "Appointment as vice chair of the Central Election Campaign Committee for the 17th presidential election", esTitle: "Nombramiento como vicepresidente del Comité Central de Campaña Electoral para las 17.as elecciones presidenciales" },
      { date: "2007년 12월", title: "강남 인터컨티넨탈호텔 뉴트로지나 스킨케어 아카데미 마사지", zhTitle: "江南洲际酒店露得清护肤学院按摩服务", enTitle: "Massage at the Neutrogena Skin Care Academy at the InterContinental Hotel, Gangnam", esTitle: "Masaje en la Academia de Cuidado de la Piel de Neutrogena en el Hotel InterContinental, Gangnam" }
    ]
  },
  {
    year: "2006",
    items: [
      { date: "2006년 02월", title: "삼성프라자 백화점 VIP고객 마사지", zhTitle: "三星 Plaza 百货 VIP 客户按摩服务", enTitle: "Massage for Samsung Plaza Department Store VIP customers", esTitle: "Masaje para clientes VIP de Samsung Plaza Department Store" },
      { date: "2006년 02월", title: "부천 LG백화점 VIP고객 마사지", zhTitle: "富川 LG 百货 VIP 客户按摩服务", enTitle: "Massage for LG Department Store VIP customers in Bucheon", esTitle: "Masaje para clientes VIP de LG Department Store en Bucheon" },
      { date: "2006년 02월", title: "이화여자대학교 축제 건강관리 봉사활동", zhTitle: "梨花女子大学庆典健康管理志愿服务", enTitle: "Health care volunteer service at Ewha Womans University's festival", esTitle: "Voluntariado de cuidado de la salud en el festival de la Universidad Femenina Ewha" },
      { date: "2006년 02월", title: "포스포건설 인천 송도 모델하우스 VIP고객 마사지", zhTitle: "POSCO 建设仁川松岛样板房 VIP 客户按摩服务", enTitle: "VIP customer massage at the Pospo Construction model home in Songdo, Incheon", esTitle: "Masaje para clientes VIP en la vivienda de muestra de Pospo Construction en Songdo, Incheon" },
      { date: "2006년 03월", title: "한국건강관리사자격협회 압구정점 오픈", zhTitle: "韩国健康管理师资格协会狎鸥亭分部开业", enTitle: "Opening of the Korea Association for Health & Beauty Certification' Apgujeong branch", esTitle: "Inauguración de la delegación de Apgujeong de la Asociación Coreana de Profesionales del Cuidado de la Salud" },
      { date: "2006년 03월", title: "CJ증권 VIP고객 마사지", zhTitle: "CJ 证券 VIP 客户按摩服务", enTitle: "Massage for CJ Securities VIP customers", esTitle: "Masaje para clientes VIP de CJ Securities" },
      { date: "2006년 03월", title: "한국건강관리사자격협회 수원점 오픈", zhTitle: "韩国健康管理师资格协会水原分部开业", enTitle: "Opening of the Korea Association for Health & Beauty Certification' Suwon branch", esTitle: "Inauguración de la delegación de Suwon de la Asociación Coreana de Profesionales del Cuidado de la Salud" },
      { date: "2006년 04월", title: "건강백화점 오픈 마사지", zhTitle: "健康百货开业按摩服务", enTitle: "Massage for the opening of Health Department Store", esTitle: "Masaje en la inauguración de Health Department Store" },
      { date: "2006년 05월", title: "한국건강관리사자격협회 대구점 오픈", zhTitle: "韩国健康管理师资格协会大邱分部开业", enTitle: "Opening of the Korea Association for Health & Beauty Certification' Daegu branch", esTitle: "Inauguración de la delegación de Daegu de la Asociación Coreana de Profesionales del Cuidado de la Salud" },
      { date: "2006년 05월", title: "특허청 SMC 서비스표 상표등록", zhTitle: "韩国专利厅 SMC 服务商标注册", enTitle: "Registration of the SMC service mark with the Korean Intellectual Property Office", esTitle: "Registro de la marca de servicios SMC en la Oficina Coreana de Propiedad Intelectual" },
      { date: "2006년 05월", title: "수유시장 상인회 봉사활동", zhTitle: "水逾市场商人协会志愿服务", enTitle: "Volunteer service for the Suyu Market Merchants Association", esTitle: "Voluntariado para la Asociación de Comerciantes del Mercado de Suyu" },
      { date: "2006년 05월", title: "서울 수유시장 발마사지", zhTitle: "首尔水逾市场足部按摩服务", enTitle: "Foot massage at Suyu Market, Seoul", esTitle: "Masaje de pies en el Mercado de Suyu, Seúl" },
      { date: "2006년 06월", title: "GM대우 신차 발표회 무주리조트 VIP고객 마사지", zhTitle: "GM 大宇新车发布会——茂朱度假村 VIP 客户按摩服务", enTitle: "VIP customer massage at the GM Daewoo new car presentation at Muju Resort", esTitle: "Masaje para clientes VIP en la presentación de un nuevo automóvil de GM Daewoo en Muju Resort" },
      { date: "2006년 07월", title: "프리미엄 위스키 SINGLETON 런칭파티 VIP고객 건강", zhTitle: "SINGLETON 威士忌发布派对 VIP 客户健康服务", enTitle: "VIP customer health services at the SINGLETON premium whisky launch party", esTitle: "Servicios de salud para clientes VIP en la fiesta de lanzamiento del whisky prémium SINGLETON" },
      { date: "2006년 07월", title: "코엑스 화장품 박람회 VIP고객 피부미용마사지", zhTitle: "COEX 化妆品博览会 VIP 客户皮肤美容按摩服务", enTitle: "Skin care massage for VIP customers at the COEX Cosmetics Expo", esTitle: "Masaje de cuidado de la piel para clientes VIP en la Exposición de Cosméticos de COEX" },
      { date: "2006년 08월", title: "롯데캐슬 아파트 선정 마사지 서비스 지원활동", zhTitle: "乐天 Castle 公寓按摩支持活动", enTitle: "Massage service support at selected Lotte Castle apartments", esTitle: "Servicio de apoyo con masajes en apartamentos seleccionados de Lotte Castle" },
      { date: "2006년 08월", title: "KBS, MBC, SBS '티라소테라피' TV방영", zhTitle: "KBS、MBC、SBS 播出海洋疗法相关电视节目", enTitle: "TV broadcasts of 'Tirasotherapy' on KBS, MBC and SBS", esTitle: "Emisiones televisivas de «Tirasoterapia» en KBS, MBC y SBS" },
      { date: "2006년 10월", title: "서경대학교 산학협동약정", zhTitle: "与西京大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Seokyeong University", esTitle: "Acuerdo de cooperación entre industria y academia con la Universidad de Seokyeong" },
      { date: "2006년 10월", title: "압구정 갤러리아 백화점 Aesop 화장품 브랜드 VIP고객 마사지", zhTitle: "狎鸥亭 Galleria 百货 Aesop 化妆品 VIP 客户按摩服务", enTitle: "Massage for Aesop cosmetics VIP customers at Galleria Department Store, Apgujeong", esTitle: "Masaje para clientes VIP de cosméticos Aesop en Galleria Department Store, Apgujeong" },
      { date: "2006년 10월", title: "동북사범대학 산학협동약정", zhTitle: "与东北师范大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Northeast Normal University", esTitle: "Acuerdo de cooperación entre industria y academia con la Universidad Normal del Nordeste" },
      { date: "2006년 12월", title: "한국건강관리사자격협회 국제 사단법인 등록", zhTitle: "韩国健康管理师资格协会完成国际社团法人登记", enTitle: "Registration of the Korea Association for Health & Beauty Certification as an international incorporated association", esTitle: "Registro de la Asociación Coreana de Profesionales del Cuidado de la Salud como asociación internacional constituida" }
    ]
  },
  {
    year: "2005",
    items: [
      { date: "2005년 01월", title: "경문대학 산학협동약정", zhTitle: "与京文大学签订产学合作协议", enTitle: "Industry-academia cooperation agreement with Kyungmoon College", esTitle: "Acuerdo de cooperación entre industria y academia con Kyungmoon College" },
      { date: "2005년 10월", title: "SMC아카데미 종로총본부 오픈", zhTitle: "SMC Academy 钟路总部开业", enTitle: "Opening of SMC Academy's Jongno headquarters", esTitle: "Inauguración de la sede central de Jongno de SMC Academy" },
      { date: "2005년 12월", title: "한국건광관리사자격협회 인천점 오픈", zhTitle: "韩国健康管理师资格协会仁川分部开业", enTitle: "Opening of the Korea Association for Health & Beauty Certification' Incheon branch", esTitle: "Inauguración de la delegación de Incheon de la Asociación Coreana de Profesionales del Cuidado de la Salud" }
    ]
  },
  {
    year: "2004",
    items: [
      { date: "2004년 04월", title: "스포츠마사지 저작권 심사위원회 저작권 등록", zhTitle: "运动按摩著作权登记", enTitle: "Copyright registration with the Copyright Review Committee for sports massage", esTitle: "Registro de derechos de autor ante el Comité de Revisión de Derechos de Autor para el masaje deportivo" }
    ]
  },
  {
    year: "2003",
    items: [
      { date: "2003년 02월", title: "연세대학교 의과대학 학생실습 지도 산학협동약정", zhTitle: "与延世大学医学院签订学生实习指导产学合作协议", enTitle: "Industry-academia cooperation agreement with Yonsei University College of Medicine for student practical training supervision", esTitle: "Acuerdo de cooperación entre industria y academia con la Facultad de Medicina de la Universidad de Yonsei para supervisar las prácticas de estudiantes" }
    ]
  },
  {
    year: "2001",
    items: [
      { date: "2001년 09월", title: "SMC아카데미 / 한국건강관리사자격협회 서울총본부 창립", zhTitle: "SMC Academy／韩国健康管理师资格协会首尔总部成立", enTitle: "Establishment of the Seoul headquarters of SMC Academy / Korea Association for Health & Beauty Certification", esTitle: "Fundación de la sede central de Seúl de SMC Academy / Asociación Coreana de Profesionales del Cuidado de la Salud" }
    ]
  }
];

export const historyHighlights: HistoryItem[] = [
  { date: "2001년 09월", title: "SMC아카데미 / 한국건강관리사자격협회 서울총본부 창립", zhTitle: "SMC Academy／韩国健康管理师资格协会首尔总部成立", enTitle: "Establishment of the Seoul headquarters of SMC Academy / Korea Association for Health & Beauty Certification", esTitle: "Fundación de la sede central de Seúl de SMC Academy / Asociación Coreana de Profesionales del Cuidado de la Salud" },
  { date: "2005년 10월", title: "SMC아카데미 종로총본부 오픈", zhTitle: "SMC Academy 钟路总部开业", enTitle: "Opening of SMC Academy's Jongno headquarters", esTitle: "Inauguración de la sede central de Jongno de SMC Academy" },
  { date: "2013년 02월", title: "SMC아카데미 대림캠퍼스 오픈", zhTitle: "SMC Academy 大林校区开业", enTitle: "Opening of SMC Academy's Daerim campus", esTitle: "Inauguración del campus de Daerim de SMC Academy" },
  { date: "2025년 05월", title: "제37회 한국휴먼 (미용,건강,문화,예술) 올림픽대회", zhTitle: "第37届韩国人类（美容、健康、文化、艺术）奥林匹克大赛", enTitle: "37th Korea Human Olympics (Beauty, Health, Culture and Arts)", esTitle: "37.ª Olimpiada Humana de Corea (Belleza, Salud, Cultura y Artes)" }
];


export function localizeHistoryItem(item: HistoryItem, locale: Locale): { date: string; title: string } {
  if (locale === "ko") return { date: item.date, title: item.title };
  if (locale === "zh-CN") {
    return { date: item.date.replace("년 ", "年").replace("월", "月"), title: item.zhTitle };
  }
  const [, year, month] = /^(\d{4})년 (\d{1,2})월$/.exec(item.date)!;
  const date = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
  return { date, title: locale === "es" ? item.esTitle : item.enTitle };
}
