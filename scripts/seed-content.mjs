// Seed real SeaLearn Nigeria content into SiteConfig and leadership team
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sections = [
  // ── ABOUT ────────────────────────────────────────────────────────────────
  {
    section: "about",
    data: {
      mission_heading: "Training World-Class Nigerian Seafarers Since 2008",
      mission: "To provide world-class, NIMASA-approved maritime training that equips Nigerian seafarers with the technical competencies, safety skills, and professional standards required to excel in the global maritime industry.",
      vision: "To be Africa's leading maritime training institution, producing certified, safety-conscious seafarers who are ready for global deployment and who contribute to Nigeria's growth as a maritime nation.",
      highlight_1: "NIMASA-approved institution with all programmes fully certified",
      highlight_2: "IMO/STCW 2010 Manila Amendment compliant training delivery",
      highlight_3: "State-of-the-art bridge and engine room simulators at Apapa campus",
      highlight_4: "Over 2,000 Nigerian seafarers trained and deployed internationally",
      value1_icon: "⚓",
      value1_title: "Safety First",
      value1_body: "Every programme is built around STCW safety standards. We instil a safety-first culture that our graduates carry throughout their careers.",
      value2_icon: "🎓",
      value2_title: "Excellence in Training",
      value2_body: "Our instructors are certified STCW assessors with active sea-going experience. We deliver training that meets and exceeds international benchmarks.",
      value3_icon: "🌍",
      value3_title: "Global Standards",
      value3_body: "All certificates issued are NIMASA-registered and internationally recognised under the STCW Convention, enabling our graduates to work on vessels worldwide.",
      value4_icon: "🤝",
      value4_title: "Integrity",
      value4_body: "We operate with full transparency — no hidden fees, no shortcuts. Our admissions process is merit-based and our certifications are earned, not bought.",
      value5_icon: "💡",
      value5_title: "Innovation",
      value5_body: "From digital student portals to AI-powered learning support, we continuously invest in technology to make quality maritime education accessible to every Nigerian.",
      value6_icon: "🇳🇬",
      value6_title: "Nigerian Pride",
      value6_body: "We are proudly Nigerian — our mission is to build a world-class Nigerian maritime workforce that can compete on the global stage without leaving our shores.",
      stats_seafarers: "2,000+",
      stats_programmes: "23",
      stats_years: "15+",
      stats_partners: "12",
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
      hero_headline: "Nigeria's Premier Maritime Training Institute",
      hero_subheadline: "NIMASA-Approved · IMO/STCW 2010 Manila Compliant · Apapa, Lagos",
      hero_tagline: "Join 2,000+ certified Nigerian seafarers trained at SeaLearn",
      cta_primary: "Browse Courses",
      cta_primary_href: "/courses",
      cta_secondary: "Start Application",
      cta_secondary_href: "/admissions",
      stats_1_value: "2,000+",
      stats_1_label: "Seafarers Trained",
      stats_2_value: "23",
      stats_2_label: "STCW Programmes",
      stats_3_value: "100%",
      stats_3_label: "NIMASA Approved",
      stats_4_value: "15+",
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
    section: "about",
    data: {
      mission_image_url: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs1.jpg",
    },
  },
  {
    section: "media",
    data: {
      hero_image_url: "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg",
      about_image_url: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs1.jpg",
    },
  },
];

const leadership = [
  {
    name: "Capt. Adebayo Okonkwo",
    title: "Executive Director / Principal",
    credential: "Master Mariner (FG), MBA, NIMASA Assessor",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/Capt-Deboos-imgs1.jpg",
    bio: "Capt. Okonkwo brings over 30 years of sea-going and maritime education experience. A former Master Mariner on VLCC tankers with Shell Nigeria, he founded SeaLearn Nigeria to bridge the gap between the demand for certified Nigerian seafarers and the quality of available training. He holds a Master Mariner Class 1 certificate, an MBA from Lagos Business School, and is a certified NIMASA assessor.",
    sortOrder: 1,
  },
  {
    name: "Mrs. Amaka Obi",
    title: "Head of Admissions & Student Affairs",
    credential: "B.Sc. Maritime Studies, NIMASA Registered",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/team-img1.jpg",
    bio: "Mrs. Obi oversees the admissions process, student welfare, and academic records. With over 12 years in maritime education administration, she ensures that every student's journey from application to certification is smooth, transparent, and in full compliance with NIMASA requirements.",
    sortOrder: 2,
  },
  {
    name: "Capt. Emeka Adeyemi",
    title: "Chief Instructor — Deck",
    credential: "Chief Mate (Unlimited), STCW Certified Assessor",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/team-img2.jpg",
    bio: "Capt. Adeyemi is a certified STCW assessor and Chief Mate with 18 years of sea service on container ships and tankers. He leads the Deck department, delivering OOW Deck, Pre-Sea Cadet, GMDSS and survival craft training. He is passionate about producing OOWs who are truly ready for watchkeeping responsibilities from day one.",
    sortOrder: 3,
  },
  {
    name: "Engr. Biodun Salami",
    title: "Chief Instructor — Engineering",
    credential: "Chief Engineer, MNI, STCW Certified Assessor",
    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/team-img3.jpg",
    bio: "Engr. Salami is a Chief Engineer with 22 years of experience on bulk carriers and offshore support vessels. He leads the Engineering department, delivering Pre-Sea Engineering Cadet, OOW Engine, and value-added technical courses. He holds a Chief Engineer certificate and is a Member of the Nigerian Institution of Engineers.",
    sortOrder: 4,
  },
  {
    name: "Dr. Ngozi Eze",
    title: "Head of Research & Quality Assurance",
    credential: "Ph.D. Maritime Law, M.Sc. Safety Engineering",
    bio: "Dr. Eze manages SeaLearn's ISO 9001:2015 quality management system, curriculum review, and academic research partnerships. She liaisons with NIMASA on regulatory compliance and represents SeaLearn at international maritime education conferences.",
    sortOrder: 5,
  },
  {
    name: "Mr. Chidi Nwosu",
    title: "IT & Digital Learning Manager",
    credential: "B.Sc. Computer Science, Certified EdTech Specialist",
    bio: "Mr. Nwosu leads SeaLearn's digital transformation — from the student portal and LMS to the AI-powered chatbot and digital certificate issuance. He ensures that technology serves learning and that every student has seamless access to their training resources.",
    sortOrder: 6,
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

  // Upsert leadership
  for (const leader of leadership) {
    const existing = await prisma.leadershipMember.findFirst({ where: { name: leader.name } });
    if (existing) {
      await prisma.leadershipMember.update({ where: { id: existing.id }, data: leader });
      results.push(`UPDATED leader: ${leader.name}`);
    } else {
      await prisma.leadershipMember.create({ data: { ...leader, isActive: true } });
      results.push(`CREATED leader: ${leader.name}`);
    }
  }

  // Update course images — assign sealearn.uk images by category
  const courseImages = [
    { titleContains: "Cadet",      imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/industrial-510-4.png" },
    { titleContains: "Officer",    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg" },
    { titleContains: "GMDSS",      imageUrl: "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg" },
    { titleContains: "Safety",     imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Medical",    imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Fire",       imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Survival",   imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg" },
    { titleContains: "Tanker",     imageUrl: "https://sealearn.uk/wp-content/uploads/2025/07/industrial-510-4.png" },
    { titleContains: "Security",   imageUrl: "https://sealearn.uk/wp-content/uploads/2025/08/About-imgs3.jpg" },
    { titleContains: "Maritime",   imageUrl: "https://sealearn.uk/wp-content/uploads/2025/08/About-imgs3.jpg" },
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
