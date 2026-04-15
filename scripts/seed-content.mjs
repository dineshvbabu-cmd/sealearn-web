// Seed real SeaLearn Nigeria content into SiteConfig and leadership team
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sections = [
  // ── ABOUT ────────────────────────────────────────────────────────────────
  {
    section: "about",
    data: {
      mission_heading: "Shaping World-Class Nigerian Seafarers Since 2000",
      mission: "To provide world-class, NIMASA-approved maritime education that empowers Nigerian seafarers with the knowledge, skills, and certifications needed for successful careers in the global shipping industry.",
      vision: "To be West Africa's leading maritime training institution, recognised internationally for excellence in STCW education and seafarer development.",
      highlight_1: "Lagos campus at Apapa Port Road — Africa's busiest port",
      highlight_2: "IMO/STCW 2010 Manila Amendment compliant training delivery",
      highlight_3: "Class A bridge and engine room simulators on campus",
      highlight_4: "3,200+ graduates serving on vessels worldwide",
      value1_icon: "⚓",
      value1_title: "Safety First",
      value1_body: "Safety is non-negotiable — in training, at sea, and on campus.",
      value2_icon: "🤝",
      value2_title: "Integrity",
      value2_body: "Transparent operations, honest assessments, accountable leadership.",
      value3_icon: "🏆",
      value3_title: "Excellence",
      value3_body: "98% pass rate and industry-leading placement backed by expert faculty.",
      value4_icon: "📋",
      value4_title: "Compliance",
      value4_body: "Fully aligned with NIMASA, IMO, STCW 2010 Manila and MLC 2006.",
      value5_icon: "💡",
      value5_title: "Innovation",
      value5_body: "AI-powered student support, Class A simulators and digital LMS.",
      value6_icon: "🌍",
      value6_title: "Community",
      value6_body: "A strong alumni network of 3,200+ seafarers serving globally.",
      stats_seafarers: "3,200+",
      stats_programmes: "23",
      stats_years: "25+",
      stats_partners: "28",
      mission_image_url: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs1.jpg",
    },
  },
  // ── CONTACT ──────────────────────────────────────────────────────────────
  {
    section: "contact",
    data: {
      address: "25A Marine Road, Apapa, Lagos 102272, Nigeria",
      phone: "+234 704 280 6167",
      email: "sealearn@sealearn.uk",
      admissions_email: "admissions@sealearn.edu.ng",
      office_hours: "Monday – Friday: 08:00 – 17:00 WAT\nSaturday: 09:00 – 13:00 WAT",
      emergency_phone: "+234 704 280 6167",
      linkedin: "https://www.linkedin.com/company/sealearn",
      youtube: "https://www.youtube.com/@sealearnlimited",
      facebook: "https://www.facebook.com/SeaLearnNigeria",
    },
  },
  // ── HOMEPAGE ─────────────────────────────────────────────────────────────
  {
    section: "home",
    data: {
      hero_headline: "Nigeria's Premier Maritime Training Institution",
      hero_subheadline: "NIMASA Approved · IMO/STCW 2010 Manila Compliant · Pre-Sea to CoC Programmes. Shaping world-class Nigerian seafarers since 2000.",
      hero_tagline: "Join 3,200+ certified Nigerian seafarers trained at SeaLearn",
      cta_primary: "Apply Now",
      cta_primary_href: "/admissions",
      cta_secondary: "View STCW Courses",
      cta_secondary_href: "/courses",
      stats_1_value: "3,200+",
      stats_1_label: "Seafarers Trained",
      stats_2_value: "98%",
      stats_2_label: "STCW Pass Rate",
      stats_3_value: "28+",
      stats_3_label: "Industry Partners",
      stats_4_value: "25+",
      stats_4_label: "Years Experience",
    },
  },
  // ── PORTAL CMS ───────────────────────────────────────────────────────────
  {
    section: "portal",
    data: {
      lms_label: "SeaLearn LMS",
      welcome_message: "Welcome to the SeaLearn Nigeria Student Portal. Access your courses, track progress, download certificates, and manage your maritime training journey.",
    },
  },
  // ── MEDIA / IMAGES ────────────────────────────────────────────────────────
  {
    section: "media",
    data: {
      hero_image_url: "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg",
      about_image_url: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs1.jpg",
    },
  },
];

// Real leadership team from sealearn.uk (names and photos as shown on the website)
const leadership = [
  {
    name: "Bhannesh Dogra",
    title: "Chief Executive Officer",
    credential: "Senior Maritime Executive",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/team-img1.jpg",
    bio: "Bhannesh Dogra has over thirty years of experience in the maritime and shipping industry, with a proven track record in maritime operations, cargo handling, crew management, and fleet management. He has worked at leading ship management companies delivering crew management, crew training, quality, safety, and environmental management, and will elevate the crew management solutions its shareholders.",
    sortOrder: 1,
  },
  {
    name: "Captain Kersi Nariman Deboo",
    title: "Head of Training",
    credential: "Master Mariner, STCW Certified Assessor",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/Capt-Deboos-imgs1.jpg",
    bio: "Captain Kersi Nariman Deboo has over 30 years of experience in maritime education and training, including 17 years sailing as a Master Mariner. He has served as Director and Principal of leading maritime training institutes in India. Captain Deboo was a Member (Executive Council) of the Nautical Institute and India & Sri Lanka Branch Chairman. He has also held positions on the Executive Council and Academic committees of the Indian Maritime University, as well as with the Steamship Owners of Shipping.",
    sortOrder: 2,
  },
  {
    name: "Engr. Hakeem Olanipekan Odeinde MNSE",
    title: "General Manager — Hullwheel Affairs",
    credential: "MNSE, MSc Marine Engineering",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/team-img2.jpg",
    bio: "Engr. Hakeem Olanipekan Odeinde has over 35 years of experience in marine surveying, ship repairs and drydocking, as well as MSc Marine Engineering. Before joining SeaLearn, he worked at NIMASA as Assisstant Director for the Quality Assurance Unit and served as a Maritime Lecturer at the Petroleum Training Institute of Warri.",
    sortOrder: 3,
  },
  {
    name: "Balamurugan",
    title: "General Manager",
    credential: "Senior Maritime Manager",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/team-img3.jpg",
    bio: "Balamurugan has 20 years of experience in project management, consulting, and market research. Before joining SeaLearn, he has worked with leading engineering institutions and Fortune 500 companies, including Deloitte, Capgemini, DXC, and Accenture.",
    sortOrder: 4,
  },
];

async function main() {
  const results = [];

  // Upsert site config sections
  for (const { section, data } of sections) {
    for (const [key, value] of Object.entries(data)) {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const existing = await prisma.siteConfig.findFirst({ where: { section, key } });
      if (existing) {
        await prisma.siteConfig.update({ where: { id: existing.id }, data: { value } });
        results.push(`UPDATED ${section}.${key}`);
      } else {
        await prisma.siteConfig.create({ data: { section, key, value, label } });
        results.push(`CREATED ${section}.${key}`);
      }
    }
  }

  // Replace all leadership members with real sealearn.uk team
  await prisma.leadershipMember.deleteMany({});
  results.push("CLEARED existing leadership members");

  for (const leader of leadership) {
    await prisma.leadershipMember.create({ data: { ...leader, isActive: true } });
    results.push(`CREATED leader: ${leader.name}`);
  }

  // Update course images — assign sealearn.uk images by keyword in title
  const courseImages = [
    { titleContains: "Cadet",    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/industrial-510-4.png" },
    { titleContains: "Officer",  imageUrl: "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg" },
    { titleContains: "GMDSS",    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg" },
    { titleContains: "Safety",   imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Medical",  imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Fire",     imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Survival", imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Tanker",   imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/industrial-510-4.png" },
    { titleContains: "Security", imageUrl: "https://sealearn.uk/wp-content/uploads/2025/08/About-imgs3.jpg" },
    { titleContains: "Maritime", imageUrl: "https://sealearn.uk/wp-content/uploads/2025/08/About-imgs3.jpg" },
  ];

  const allCourses = await prisma.course.findMany({ select: { id: true, title: true } });
  for (const course of allCourses) {
    const match = courseImages.find((ci) => course.title.includes(ci.titleContains));
    const imageUrl = match?.imageUrl ?? "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg";
    await prisma.course.update({ where: { id: course.id }, data: { imageUrl } });
    results.push(`UPDATED course image: ${course.title}`);
  }

  console.log(results.join("\n"));
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
