// Static data for demo — replace with Prisma queries in production

export type CourseLevel = "PRE_SEA" | "SHORT_COURSE" | "DEGREE" | "POST_COC" | "REFRESHER";

export interface Course {
  slug: string;
  title: string;
  level: CourseLevel;
  levelLabel: string;
  stcwRegulation: string;
  durationText: string;
  feeNaira: number;
  feeText: string;
  applicationFee: number;
  description: string;
  eligibility: string[];
  outcomes: string[];
  imageUrl: string;
  tag: string;
  tagColor: string;
  modules: string[];
  nimasaApproved: boolean;
}

export const courses: Course[] = [
  {
    slug: "pre-sea-deck-cadet",
    title: "Pre-Sea Deck Cadet Programme",
    level: "PRE_SEA",
    levelLabel: "Pre-Sea",
    stcwRegulation: "STCW Reg. II/1",
    durationText: "6 Months · Full-Time",
    feeNaira: 480000,
    feeText: "₦480,000",
    applicationFee: 15000,
    description:
      "Nigeria's flagship pre-sea deck officer training programme. Covers nautical science, navigation, seamanship, meteorology, GMDSS, and bridge resource management — fully NIMASA approved and IMO STCW 2010 compliant.",
    eligibility: [
      "Minimum 5 O-Level credits including English, Mathematics and Physics",
      "Age 16–25",
      "Valid ENG1 or ML5 medical certificate from NIMASA-approved centre",
      "NIN (National Identification Number)",
      "Good eyesight (correctable to 6/6)",
    ],
    outcomes: [
      "Officer of the Watch (Deck) eligibility",
      "NIMASA-registered STCW II/1 certificate",
      "Bridge watchkeeping competency",
      "Placement with Nigerian and international shipping lines",
    ],
    imageUrl: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
    tag: "PRE-SEA · DECK",
    tagColor: "bg-teal",
    modules: [
      "Nautical Science & Navigation",
      "Radar & ARPA",
      "Meteorology & Oceanography",
      "Seamanship & Cargo",
      "Celestial Navigation",
      "Basic Fire Fighting",
      "GMDSS & Radio Communication",
      "Bridge Resource Management",
      "Practical Log Book",
    ],
    nimasaApproved: true,
  },
  {
    slug: "pre-sea-engineering-cadet",
    title: "Pre-Sea Engineering Cadet Programme",
    level: "PRE_SEA",
    levelLabel: "Pre-Sea",
    stcwRegulation: "STCW Reg. III/1",
    durationText: "6 Months · Full-Time",
    feeNaira: 520000,
    feeText: "₦520,000",
    applicationFee: 15000,
    description:
      "Comprehensive marine engineering cadet programme covering diesel engines, electrical systems, pumping, damage control, and engineering watchkeeping. NIMASA approved, STCW III/1 compliant.",
    eligibility: [
      "Minimum 5 O-Level credits including English, Mathematics, Physics and Technical Drawing",
      "Age 16–25",
      "Valid ENG1 or ML5 medical certificate",
      "NIN required",
    ],
    outcomes: [
      "Officer of the Watch (Engine) eligibility",
      "NIMASA-registered STCW III/1 certificate",
      "Engine room watchkeeping competency",
      "NNPC and international shipping line placements available",
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    tag: "PRE-SEA · ENGINE",
    tagColor: "bg-ocean",
    modules: [
      "Marine Diesel Engines",
      "Electrical Engineering",
      "Pumping Systems",
      "Damage Control & Stability",
      "Engineering Watchkeeping",
      "Maintenance & Repair",
      "Automation & Control Systems",
      "Engine Room Simulator",
    ],
    nimasaApproved: true,
  },
  {
    slug: "basic-safety-training",
    title: "Basic Safety Training (BST)",
    level: "SHORT_COURSE",
    levelLabel: "Short Course",
    stcwRegulation: "STCW VI/1",
    durationText: "4 Weeks · Full-Time",
    feeNaira: 120000,
    feeText: "₦120,000",
    applicationFee: 15000,
    description:
      "The mandatory STCW basic safety package required for all seafarers. Covers personal survival techniques, fire prevention & fire-fighting, elementary first aid, and personal safety & social responsibilities.",
    eligibility: [
      "Open to all persons seeking employment at sea",
      "Minimum age 16",
      "Basic literacy and numeracy",
      "Medical fitness certificate",
    ],
    outcomes: [
      "STCW VI/1 certificate (mandatory for all seafarers)",
      "NIMASA-registered certification",
      "Personal Survival Techniques",
      "Fire Prevention & Fire Fighting",
      "Elementary First Aid",
    ],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    tag: "STCW BASIC",
    tagColor: "bg-gold",
    modules: [
      "Personal Survival Techniques",
      "Fire Prevention & Fire Fighting",
      "Elementary First Aid",
      "Personal Safety & Social Responsibilities",
      "Sea Survival Pool Drills",
    ],
    nimasaApproved: true,
  },
  {
    slug: "gmdss-general-operator",
    title: "GMDSS General Operator Certificate",
    level: "SHORT_COURSE",
    levelLabel: "Short Course",
    stcwRegulation: "STCW IV/2",
    durationText: "4 Weeks · Full-Time",
    feeNaira: 95000,
    feeText: "₦95,000",
    applicationFee: 15000,
    description:
      "The GMDSS GOC qualifies officers to operate all GMDSS equipment including EPIRB, SART, VHF, MF/HF DSC, NAVTEX and Inmarsat systems on SOLAS vessels. IMO Model Course 1.25.",
    eligibility: [
      "O-Level passes in English, Mathematics and Physics",
      "Age 18+",
      "Medical fitness certificate",
    ],
    outcomes: [
      "GMDSS General Operator Certificate",
      "NIMASA-registered, internationally recognised",
      "MF/HF and VHF DSC operations",
      "EPIRB, SART and Inmarsat proficiency",
    ],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    tag: "GMDSS",
    tagColor: "bg-ocean",
    modules: [
      "GMDSS System Overview",
      "VHF DSC Operations",
      "MF/HF Radio Operations",
      "EPIRB & SART",
      "Inmarsat Systems",
      "NAVTEX & SAR Procedures",
    ],
    nimasaApproved: true,
  },
  {
    slug: "ship-security-officer",
    title: "Ship Security Officer (SSO)",
    level: "SHORT_COURSE",
    levelLabel: "Short Course",
    stcwRegulation: "STCW VI/5",
    durationText: "3 Days · Full-Time",
    feeNaira: 35000,
    feeText: "₦35,000",
    applicationFee: 15000,
    description:
      "ISPS Code and STCW VI/5 compliant Ship Security Officer training for deck officers and security-conscious crew. Covers security threat assessment, SSP implementation and security drills.",
    eligibility: [
      "Current or aspiring deck officer",
      "Basic Safety Training certificate",
      "Age 18+",
    ],
    outcomes: [
      "STCW VI/5 SSO Certificate",
      "ISPS Code competency",
      "Security plan implementation",
      "NIMASA-registered certification",
    ],
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    tag: "SECURITY",
    tagColor: "bg-steel",
    modules: ["ISPS Code", "Security Threat Assessment", "Security Drills", "SSP Implementation"],
    nimasaApproved: true,
  },
  {
    slug: "coc-revalidation-refresher",
    title: "CoC Revalidation (STCW Refresher)",
    level: "REFRESHER",
    levelLabel: "Refresher",
    stcwRegulation: "STCW Various",
    durationText: "5 Days",
    feeNaira: 85000,
    feeText: "₦85,000",
    applicationFee: 15000,
    description:
      "Mandatory 5-year STCW revalidation refresher for officers whose Certificate of Competency is due for renewal. Covers updates to STCW Manila amendments, BRM, and safety management.",
    eligibility: [
      "Valid or recently expired CoC",
      "Proof of sea service",
      "Medical certificate",
    ],
    outcomes: [
      "STCW revalidation endorsement",
      "Updated Manila amendment competencies",
      "NIMASA certificate renewal",
    ],
    imageUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=800&q=80",
    tag: "REFRESHER",
    tagColor: "bg-jade",
    modules: [
      "STCW Manila 2010 Updates",
      "Bridge Resource Management",
      "Emergency Procedures",
      "Environmental Protection",
      "BRM Simulator Session",
    ],
    nimasaApproved: true,
  },
  {
    slug: "chief-mate-coc-prep",
    title: "Chief Mate (Unlimited) CoC Prep",
    level: "POST_COC",
    levelLabel: "Post-CoC",
    stcwRegulation: "STCW II/2",
    durationText: "18 Months",
    feeNaira: 650000,
    feeText: "₦650,000",
    applicationFee: 15000,
    description:
      "Advanced preparation programme for experienced OOW Deck officers seeking Chief Mate STCW II/2 certification. Covers advanced navigation, cargo operations, and vessel stability.",
    eligibility: [
      "Valid OOW Deck CoC",
      "Minimum 12 months sea service as OOW",
      "Medical certificate",
    ],
    outcomes: [
      "Chief Mate CoC (Unlimited)",
      "Advanced navigation competency",
      "Cargo and stability expertise",
      "Command preparedness",
    ],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    tag: "POST-COC",
    tagColor: "bg-amber",
    modules: [
      "Advanced Navigation",
      "Cargo Operations",
      "Ship Stability",
      "Leadership & Management",
      "COLREGS & MLC 2006",
    ],
    nimasaApproved: true,
  },
  {
    slug: "port-shipping-management",
    title: "Port & Shipping Management Diploma",
    level: "POST_COC",
    levelLabel: "Diploma",
    stcwRegulation: "—",
    durationText: "1 Year",
    feeNaira: 380000,
    feeText: "₦380,000",
    applicationFee: 15000,
    description:
      "A one-year professional diploma in port operations, shipping economics, logistics, and trade. Ideal for NPA, NIMASA and shipping company professionals.",
    eligibility: ["Degree or HND in any discipline", "Age 21+", "Work experience preferred"],
    outcomes: [
      "Port Operations Certificate",
      "Shipping economics competency",
      "NPA/NIMASA career readiness",
      "Logistics and trade expertise",
    ],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    tag: "DIPLOMA",
    tagColor: "bg-jade",
    modules: [
      "Port Operations & Management",
      "Shipping Economics",
      "Maritime Law",
      "Logistics & Supply Chain",
      "Trade Finance",
      "NIMASA Regulatory Framework",
    ],
    nimasaApproved: false,
  },
];

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  category: "achievement" | "event" | "admissions" | "news";
  categoryLabel: string;
  categoryColor: string;
  publishedAt: string;
  imageUrl: string;
  eventDate?: string;
  eventVenue?: string;
}

export const newsItems: NewsItem[] = [
  {
    slug: "nimasa-institutional-award-2025",
    title: "SeaLearn Receives NIMASA Institutional Excellence Award 2025",
    excerpt:
      "SeaLearn Nigeria has been recognised by NIMASA as the outstanding maritime training institution of the year for the second consecutive time.",
    category: "achievement",
    categoryLabel: "Achievement",
    categoryColor: "text-teal",
    publishedAt: "07 Apr 2025",
    imageUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80",
  },
  {
    slug: "west-africa-maritime-forum-2025",
    title: "West Africa Maritime Forum 2025 — Call for Papers",
    excerpt:
      "SeaLearn Nigeria is co-hosting the West Africa Maritime Forum 2025. Researchers and practitioners are invited to submit papers on maritime safety, trade, and innovation.",
    category: "event",
    categoryLabel: "Event",
    categoryColor: "text-ocean",
    publishedAt: "02 Apr 2025",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
    eventDate: "07 May 2025",
    eventVenue: "Eko Hotel & Suites, Lagos",
  },
  {
    slug: "june-2025-intake-open",
    title: "June 2025 Intake — Applications Now Open",
    excerpt:
      "Applications for the June 2025 intake are now open for all programmes. The deadline is 30 April 2025. Apply early to secure your place.",
    category: "admissions",
    categoryLabel: "Admissions",
    categoryColor: "text-jade",
    publishedAt: "01 Apr 2025",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  },
  {
    slug: "new-bridge-simulator-installed",
    title: "State-of-the-Art Bridge Simulator Installed at SeaLearn Campus",
    excerpt:
      "SeaLearn Nigeria has installed a full-mission Class A bridge simulator, bringing our training facilities to international standards.",
    category: "news",
    categoryLabel: "News",
    categoryColor: "text-amber",
    publishedAt: "18 Mar 2025",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  },
  {
    slug: "nimasa-cadet-sponsorship-2025",
    title: "NIMASA Cadet Sponsorship Programme 2025 — Applications Invited",
    excerpt:
      "Qualified candidates can apply for the NIMASA-funded cadet scholarship programme. SeaLearn Nigeria is an approved training provider.",
    category: "admissions",
    categoryLabel: "Admissions",
    categoryColor: "text-jade",
    publishedAt: "10 Mar 2025",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
  },
  {
    slug: "sea-day-celebration-2025",
    title: "World Maritime Day Celebration at SeaLearn — 25 September",
    excerpt:
      "Join us as we celebrate World Maritime Day 2025 with port visits, industry talks, and our annual graduation ceremony.",
    category: "event",
    categoryLabel: "Event",
    categoryColor: "text-ocean",
    publishedAt: "01 Mar 2025",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
    eventDate: "25 Sep 2025",
    eventVenue: "Apapa Port & SeaLearn Campus, Lagos",
  },
];

export const stats = [
  { value: "3,200+", label: "Students Trained" },
  { value: "54", label: "STCW Programmes" },
  { value: "98%", label: "Pass Rate" },
  { value: "28+", label: "Shipping Partners" },
  { value: "25 Yrs", label: "of Excellence" },
];

export const leadership = [
  {
    name: "Capt. Emeka Nwosu",
    title: "Director General & Principal",
    credential: "Master Mariner (FG)",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
  },
  {
    name: "Dr. Amina Bello",
    title: "Dean of Academic Affairs",
    credential: "Ph.D. Maritime Studies",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
  {
    name: "Capt. Biodun Adeyemi",
    title: "Head of Nautical Training",
    credential: "Chief Mate CoC",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Mrs. Ngozi Okafor",
    title: "Registrar & Student Services",
    credential: "NIMASA Liaison Officer",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
  },
  {
    name: "Mr. Chukwudi Eze",
    title: "Director of Finance",
    credential: "ICAN Fellow",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
  },
];
