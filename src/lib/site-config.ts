import { prisma } from "./prisma";

// Default values — used as fallback if not in DB
export const SITE_DEFAULTS: Record<string, Record<string, string>> = {
  general: {
    site_name: "SeaLearn Nigeria",
    tagline: "Nigeria Maritime Training Institute · NIMASA Approved · Est. 2000",
    founded_year: "2000",
    nimasa_ref: "NMA/2000/001",
  },
  homepage: {
    hero_badge: "🇳🇬 NIMASA Approved · Lagos, Nigeria",
    hero_title: "Nigeria's Premier Maritime Training Institution",
    hero_subtitle: "NIMASA Approved · IMO / STCW 2010 Manila Compliant · Pre-Sea to CoC Programmes. Shaping world-class Nigerian seafarers since 2000.",
    hero_cta_primary: "Apply Now",
    hero_cta_secondary: "View STCW Courses",
    stat_students: "2,400+",
    stat_students_label: "Trained Seafarers",
    stat_passrate: "98%",
    stat_passrate_label: "STCW Pass Rate",
    stat_partners: "28+",
    stat_partners_label: "Industry Partners",
    stat_years: "25+",
    stat_years_label: "Years of Excellence",
    feature1_title: "NIMASA Approved",
    feature1_body: "All programmes fully approved by NIMASA and compliant with IMO/STCW 2010 Manila amendments.",
    feature2_title: "98% Pass Rate",
    feature2_body: "Industry-leading pass rates backed by world-class instructors and state-of-the-art simulators.",
    feature3_title: "28+ Industry Partners",
    feature3_body: "Direct placement partnerships with leading Nigerian and international shipping companies.",
    feature4_title: "Digital Certificates",
    feature4_body: "NIMASA-registered, QR-verifiable digital certificates stored securely on Cloudflare R2.",
  },
  contact: {
    address: "Apapa Port Road, Lagos, Nigeria",
    phone: "+234 701 234 5678",
    email: "info@sealearn.edu.ng",
    office_hours: "Mon–Fri, 8:00 AM – 5:00 PM WAT",
    emergency_phone: "+234 801 999 0001",
    google_maps_url: "",
  },
  about: {
    mission: "To provide world-class, NIMASA-approved maritime education that empowers Nigerian seafarers with the knowledge, skills, and certifications needed for successful careers in the global shipping industry.",
    vision: "To be West Africa's leading maritime training institution, recognised internationally for excellence in STCW education and seafarer development.",
    history: "Founded in 2000, SeaLearn Nigeria has trained over 2,400 seafarers in partnership with leading shipping companies. Our state-of-the-art bridge simulators and NIMASA-accredited programmes set the standard for maritime education in Nigeria.",
    stat1_value: "2,400+",
    stat1_label: "Trained Seafarers",
    stat2_value: "25+",
    stat2_label: "Years of Excellence",
    stat3_value: "98%",
    stat3_label: "STCW Pass Rate",
    stat4_value: "28+",
    stat4_label: "Industry Partners",
  },
  admissions: {
    intro: "Applications for the 2026 intake are now open. Spaces are limited — apply early to secure your place.",
    deadline: "30 April 2026",
    intake_date: "June 2026",
    application_fee: "₦15,000",
    step1_title: "Submit Application",
    step1_body: "Complete the online application form and pay the ₦15,000 application fee.",
    step2_title: "Document Verification",
    step2_body: "Upload your WAEC results, medical certificate (ML5/ENG1), NIN, and passport photos.",
    step3_title: "Assessment",
    step3_body: "Attend an aptitude test and medical fitness review at our Lagos campus.",
    step4_title: "Offer Letter",
    step4_body: "Successful applicants receive a NIMASA-registered offer letter within 5 working days.",
  },
};

type SectionKey = keyof typeof SITE_DEFAULTS;

// Fetch all config values for a section, merging with defaults
export async function getSiteSection(section: string): Promise<Record<string, string>> {
  const defaults = SITE_DEFAULTS[section as SectionKey] ?? {};
  try {
    const rows = await prisma.siteConfig.findMany({ where: { section } });
    const fromDb = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaults, ...fromDb };
  } catch {
    return defaults;
  }
}

// Fetch a single config value
export async function getSiteValue(section: string, key: string): Promise<string> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { section_key: { section, key } } });
    if (row) return row.value;
  } catch {}
  return SITE_DEFAULTS[section as SectionKey]?.[key] ?? "";
}
