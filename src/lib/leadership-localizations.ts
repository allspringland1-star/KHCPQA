type Greeting = { name: string; role: string; imageUrl: string; paragraphs: string[]; meta?: string };
type Director = { name: string; role: string; imageUrl: string; profileImageUrl: string };

// The people, portraits and order follow the Korean public source.
export const leadershipGreetings: Record<"en" | "es" | "zh-CN", Greeting[]> = {
  en: [
    {
      name: "Bong Seong-jong", role: "International Chairman, Korea Health Manager Qualification Association",
      imageUrl: "/assets/greeting-bong-seongjong-smiling.jpg",
      paragraphs: [
        "The Korea Health Manager Qualification Association is building educational programs and international cooperation systems to support the continued development of the health, beauty and wellness industries and promote global educational exchange.",
        "K-Beauty and K-Wellness are attracting worldwide interest and recognition for their growth potential. In response, our association operates an international education network and a structured system for developing professional talent. We continue to improve our learning environment so that students gain practical skills and global competitiveness beyond technical training alone.",
        "Through cooperation with institutions and associations in Korea and abroad, we are expanding our global exchange network. We strive to grow alongside our members, helping them turn their present progress into future competitiveness.",
        "We will continue developing educational programs that create new opportunities and future value, fulfilling our role and responsibilities as an international educational institution. We will keep advancing to become an institution our members are proud of and a global association that grows together with the world.",
        "We appreciate your continued interest and support."
      ]
    },
    {
      name: "Hwang In-geun", role: "Korea Chairman, Korea Health Manager Qualification Association",
      imageUrl: "/assets/greeting-hwang-ingeun-chairman.jpg",
      paragraphs: [
        "I am Hwang In-geun, Chairman of the Korea Health Manager Qualification Association.",
        "With the growth potential of alternative medicine and service industries supported by the Korean Wave, our association is organized to create new educational synergies in the health and beauty industry.",
        "We have also established an exchange system through which learners can cooperate and support one another as they progress from the present toward the future.",
        "For continued growth, we will fulfill our responsibilities through a world-class education system and systematic organizational management. We aim to support our learners' efforts with dependable solutions that guide them toward success.",
        "The association continually develops programs with new possibilities, pursuing shared growth with our members and providing direction as a pioneer in education.",
        "We will strive to be an institution our members are proud of, offering outstanding techniques and first-class education.",
        "With clear goals rather than education focused only on formality, we will work to meet your expectations and grow alongside you."
      ]
    }
  ],
  es: [
    {
      name: "Bong Seong-jong", role: "Presidente internacional de la Asociación Coreana de Cualificación de Gestores de Salud",
      imageUrl: "/assets/greeting-bong-seongjong-smiling.jpg",
      paragraphs: [
        "La Asociación Coreana de Cualificación de Gestores de Salud desarrolla programas educativos y sistemas de cooperación internacional para apoyar el crecimiento continuo de los sectores de salud, belleza y bienestar, así como el intercambio educativo global.",
        "El K-Beauty y el K-Wellness reciben un creciente interés mundial y reconocimiento por su potencial de desarrollo. En respuesta, nuestra asociación mantiene una red educativa internacional y un sistema estructurado de formación profesional. Mejoramos continuamente el entorno de aprendizaje para que el alumnado adquiera competencias prácticas y competitividad internacional más allá de la formación técnica.",
        "Mediante la colaboración con instituciones y asociaciones de Corea y del extranjero, ampliamos nuestra red de intercambio global. Aspiramos a crecer junto a nuestros miembros y a convertir sus avances actuales en capacidades para el futuro.",
        "Seguiremos creando programas educativos que abran nuevas posibilidades y aporten valor futuro, cumpliendo nuestras funciones y responsabilidades como institución educativa internacional. Continuaremos avanzando para ser una institución de la que nuestros miembros se sientan orgullosos y una asociación que crezca junto con el mundo.",
        "Agradecemos su interés y apoyo continuos."
      ]
    },
    {
      name: "Hwang In-geun", role: "Presidente en Corea de la Asociación Coreana de Cualificación de Gestores de Salud",
      imageUrl: "/assets/greeting-hwang-ingeun-chairman.jpg",
      paragraphs: [
        "Soy Hwang In-geun, presidente de la Asociación Coreana de Cualificación de Gestores de Salud.",
        "Ante el potencial de crecimiento de la medicina alternativa y los servicios impulsados por la ola coreana, nuestra asociación está organizada para generar nuevas sinergias educativas en los sectores de salud y belleza.",
        "Hemos establecido un sistema de intercambio que permite al alumnado colaborar y apoyarse mutuamente en su desarrollo presente y futuro.",
        "Para mantener un crecimiento continuo, cumpliremos nuestras responsabilidades mediante un sistema educativo de nivel mundial y una gestión organizativa sistemática. Queremos respaldar los esfuerzos del alumnado con soluciones estables que lo orienten hacia el éxito.",
        "La asociación desarrolla continuamente programas que ofrecen nuevas posibilidades, busca crecer junto a sus miembros y aspira a orientar el sector como pionera de la educación.",
        "Nos esforzaremos por ser una institución de la que nuestros miembros se sientan orgullosos, con técnicas de excelencia y educación de primer nivel.",
        "Con objetivos claros y una educación que vaya más allá de las formalidades, trabajaremos para responder a sus expectativas y crecer a su lado."
      ]
    }
  ],
  "zh-CN": [
    {
      name: "Bong Seong-jong", role: "韩国健康管理师资格协会国际协会长",
      imageUrl: "/assets/greeting-bong-seongjong-smiling.jpg",
      paragraphs: [
        "韩国健康管理师资格协会以推动健康、美容与康养产业持续发展及国际教育交流为目标，不断建设多样化教育项目与国际合作体系。",
        "近年来，K-Beauty 与 K-Wellness 在全球受到广泛关注，其发展潜力也得到认可。顺应这一趋势，协会运营国际教育网络与专业人才培养体系，持续改善教育环境，帮助学员在技术学习之外，同时掌握实践能力与国际竞争力。",
        "我们通过与国内外机构及协会合作，拓展国际交流体系，致力于与会员共同成长，帮助大家从当下的进步走向未来的竞争力。",
        "协会将继续开发能够创造新机遇与未来价值的教育项目，尽力履行国际教育机构的职责。我们将持续发展，努力成为会员引以为豪的机构，以及与世界共同成长的全球协会。",
        "衷心感谢大家的关注与支持。"
      ]
    },
    {
      name: "Hwang In-geun", role: "韩国健康管理师资格协会韩国协会长",
      imageUrl: "/assets/greeting-hwang-ingeun-chairman.jpg",
      paragraphs: [
        "大家好，我是韩国健康管理师资格协会协会长 Hwang In-geun。",
        "随着韩流推动具有广阔潜力的替代医学与服务产业发展，本协会建立系统化机制，致力于为健康与美容产业创造新的教育协同效应。",
        "我们还建立了交流体系，帮助学员相互合作、互助成长，从当下走向未来。",
        "为实现持续发展，我们将通过世界水准的教育体系与系统化组织管理履行职责，成为支持学员努力的坚实力量，以稳定可靠的方案引导大家走向成功。",
        "协会将不断开发具有新可能性的教育项目，以与会员共同成长为目标，努力发挥教育先行者的引领作用。",
        "我们将努力成为会员引以为豪的机构，以优秀技术与一流教育确立自身地位。",
        "我们坚持明确的教育目标，不流于形式，回应大家的期待，与各位共同成长。"
      ]
    }
  ]
};

const portraits = ["/assets/instructor-profile-kim-moonsun.jpg", "/assets/instructor-profile-yoon-euneun.jpg", "/assets/instructor-profile-kim-haerim.jpg", "/assets/instructor-lee-yongho.jpg"];
const names = ["Kim Seung-cheol", "Yoo Jeong-won", "Kim Seong-gwon", "Lee Yong-ho"];

function directors(role: string, countries: string[]): Director[] {
  return names.map((name, index) => ({ name, role: `${role} · ${countries[index]}`, imageUrl: portraits[index], profileImageUrl: portraits[index] }));
}

export const internationalDirectors = {
  en: directors("International Director", ["Mongolia", "France", "Taiwan", "Vietnam, Thailand"]),
  es: directors("Director internacional", ["Mongolia", "Francia", "Taiwán", "Vietnam, Tailandia"]),
  "zh-CN": directors("国际总监", ["蒙古", "法国", "台湾", "越南、泰国"])
};
