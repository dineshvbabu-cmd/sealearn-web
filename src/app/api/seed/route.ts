import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { CourseLevel, RegistrationFormType } from "@prisma/client";

// GET or POST /api/seed?secret=SEED_SECRET
// Seeds DB with admin user, courses, and news posts from static data.
// Disable or delete this route after first run in production.

const LEVEL_MAP: Record<string, CourseLevel> = {
  PRE_SEA: "PRE_SEA",
  SHORT_COURSE: "SHORT_COURSE",
  DEGREE: "DEGREE",
  POST_COC: "POST_COC",
  REFRESHER: "REFRESHER",
};

const courseSeedData: Array<{
  slug: string; title: string; stcwRegulation: string | null;
  level: string; durationWeeks: number; feeNaira: number;
  description: string; eligibility: string; outcomes: string;
  nimasaApproved: boolean; registrationFormType: RegistrationFormType;
}> = [
  // ── PRE-SEA ────────────────────────────────────────────────
  { slug: "pre-sea-deck-cadet", title: "Pre-Sea Deck Cadet Programme", stcwRegulation: "STCW II/1", level: "PRE_SEA", durationWeeks: 26, feeNaira: 0, registrationFormType: "GOOGLE_FORM", description: "Nigeria's flagship pre-sea deck officer training programme. Covers nautical science, navigation, seamanship, meteorology, GMDSS, and bridge resource management — fully NIMASA approved and IMO STCW 2010 Manila compliant.", eligibility: "Minimum 5 O-Level credits including English, Mathematics and Physics\nAge 16–25\nValid ENG1 or ML5 medical certificate from NIMASA-approved centre\nNIN (National Identification Number)\nGood eyesight (correctable to 6/6)", outcomes: "Officer of the Watch (Deck) eligibility\nNIMASA-registered STCW II/1 certificate\nBridge watchkeeping competency\nPlacement with Nigerian and international shipping lines", nimasaApproved: true },
  { slug: "pre-sea-engineering-cadet", title: "Pre-Sea Engineering Cadet Programme", stcwRegulation: "STCW III/1", level: "PRE_SEA", durationWeeks: 26, feeNaira: 0, registrationFormType: "GOOGLE_FORM", description: "Comprehensive marine engineering cadet programme covering diesel engines, electrical systems, pumping, damage control, and engineering watchkeeping. NIMASA approved, STCW III/1 compliant.", eligibility: "Minimum 5 O-Level credits including English, Mathematics, Physics and Technical Drawing\nAge 16–25\nValid ENG1 or ML5 medical certificate\nNIN required", outcomes: "Officer of the Watch (Engine) eligibility\nNIMASA-registered STCW III/1 certificate\nEngine room watchkeeping competency\nNNPC and international shipping line placements available", nimasaApproved: true },
  // ── BASIC STCW SAFETY TRAINING ────────────────────────────
  { slug: "basic-safety-training", title: "Basic Safety Training (BST)", stcwRegulation: "STCW VI/1", level: "SHORT_COURSE", durationWeeks: 4, feeNaira: 0, registrationFormType: "MS_FORM", description: "The mandatory STCW basic safety package required for all seafarers. Covers personal survival techniques, fire prevention & fire-fighting, elementary first aid, and personal safety & social responsibilities.", eligibility: "Open to all persons seeking employment at sea\nMinimum age 16\nBasic literacy and numeracy\nMedical fitness certificate", outcomes: "STCW VI/1 certificate (mandatory for all seafarers)\nNIMASA-registered certification\nPersonal Survival Techniques\nFire Prevention & Fire Fighting\nElementary First Aid", nimasaApproved: true },
  { slug: "security-awareness", title: "Security Awareness Training", stcwRegulation: "STCW VI/6", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "STCW VI/6 Security Awareness training for all crew without designated security duties. Covers ISPS Code, recognising security threats, and reporting procedures.", eligibility: "All seafarers required to have security awareness training\nAge 18+\nNo prerequisites", outcomes: "STCW VI/6 Security Awareness certificate\nNIMASA-registered\nISPS Code understanding\nSecurity threat recognition", nimasaApproved: true },
  { slug: "bst-refresher", title: "BST Refresher Course", stcwRegulation: "STCW VI/1", level: "REFRESHER", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "5-year refresher for seafarers revalidating their Basic Safety Training certificate. Covers updated STCW Manila amendments, revised fire-fighting drills, and updated survival techniques.", eligibility: "Existing BST certificate holder\nCertificate due for revalidation within 12 months or expired within 5 years\nMedical certificate", outcomes: "BST Revalidation endorsement\nNIMASA-registered\nUpdated STCW Manila competencies", nimasaApproved: true },
  // ── OTHER BASIC STCW ──────────────────────────────────────
  { slug: "gmdss-general-operator", title: "GMDSS General Operator Certificate", stcwRegulation: "STCW IV/2", level: "SHORT_COURSE", durationWeeks: 4, feeNaira: 0, registrationFormType: "MS_FORM", description: "The GMDSS GOC qualifies officers to operate all GMDSS equipment including EPIRB, SART, VHF, MF/HF DSC, NAVTEX and Inmarsat systems on SOLAS vessels. IMO Model Course 1.25.", eligibility: "O-Level passes in English, Mathematics and Physics\nAge 18+\nMedical fitness certificate", outcomes: "GMDSS General Operator Certificate\nNIMASA-registered, internationally recognised\nMF/HF and VHF DSC operations\nEPIRB, SART and Inmarsat proficiency", nimasaApproved: true },
  { slug: "medical-first-aid-mfau", title: "Medical First Aid (MFAU)", stcwRegulation: "STCW VI/4.1", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "STCW VI/4.1 Medical First Aid training equips seafarers to provide immediate medical care in emergencies at sea. Covers CPR, trauma management, burns, and use of a ship's medical kit.", eligibility: "All seafarers required to complete medical first aid training\nAge 18+\nBasic literacy", outcomes: "STCW VI/4.1 MFAU Certificate\nNIMASA-registered\nCPR and AED competency\nTrauma and burn management\nMedical kit operation", nimasaApproved: true },
  { slug: "proficiency-survival-craft", title: "Proficiency in Survival Craft & Rescue Boats", stcwRegulation: "STCW VI/2.1", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "STCW VI/2.1 training in the use, deployment and handling of liferaft, lifeboats and rescue boats. Covers emergency procedures, distress signals, and survivor care.", eligibility: "Seafarers required to take charge of a survival craft\nValid BST certificate preferred\nAge 18+", outcomes: "STCW VI/2.1 Certificate\nNIMASA-registered\nLiferaft and lifeboat handling\nDistress signal operation\nSurvivor recovery and care", nimasaApproved: true },
  { slug: "psc-awareness", title: "PSC Awareness (Port State Control)", stcwRegulation: null, level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Practical training on Port State Control inspection procedures. Prepares officers and crew to pass PSC inspections by understanding deficiency categories, detainable deficiencies, and PSC officer expectations.", eligibility: "Officers and ratings seeking PSC inspection readiness\nAge 18+", outcomes: "PSC readiness certificate\nDeficiency category knowledge\nDetainable deficiency avoidance\nInspection confidence", nimasaApproved: true },
  // ── ADVANCED STCW ─────────────────────────────────────────
  { slug: "advanced-fire-fighting", title: "Advanced Fire Fighting", stcwRegulation: "STCW VI/3", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "STCW VI/3 Advanced Fire Fighting for officers and ratings who may be required to take charge of fire-fighting operations. Live fire exercises using industry-standard equipment.", eligibility: "Valid BST certificate\nDeck or engineering officer or rating\nAge 18+", outcomes: "STCW VI/3 Advanced Fire Fighting Certificate\nNIMASA-registered\nFire plan interpretation\nFire team command\nLive fire exercises", nimasaApproved: true },
  { slug: "medical-care-onboard", title: "Medical Care Onboard", stcwRegulation: "STCW VI/4.2", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "STCW VI/4.2 Medical Care training for officers designated to provide medical care onboard. Covers diagnosis, treatment, use of telemedicine, and medication management.", eligibility: "Deck or engineering officer\nValid BST / MFAU certificate\nAge 18+", outcomes: "STCW VI/4.2 Medical Care Certificate\nNIMASA-registered\nMedical diagnosis skills\nTelemedicine usage\nMedication management", nimasaApproved: true },
  { slug: "oow-deck-prep", title: "Officer of the Watch — Deck (OOW Prep)", stcwRegulation: "STCW II/1", level: "POST_COC", durationWeeks: 12, feeNaira: 0, registrationFormType: "MS_FORM", description: "Intensive preparation course for officers seeking the OOW (Deck) STCW II/1 Certificate of Competency. Covers celestial navigation, COLREGS, passage planning, and bridge watchkeeping.", eligibility: "Valid Cadet certificate or sea service record\nMinimum 12 months sea service\nMedical certificate", outcomes: "Preparation for STCW II/1 CoC examination\nNIMASA examination readiness\nCelestial navigation\nBridge simulator hours\nCOLREGS competency", nimasaApproved: true },
  { slug: "oow-engine-prep", title: "Officer of the Watch — Engine (OOW Prep)", stcwRegulation: "STCW III/1", level: "POST_COC", durationWeeks: 12, feeNaira: 0, registrationFormType: "MS_FORM", description: "Intensive preparation for the OOW (Engine) STCW III/1 CoC examination. Covers diesel engine theory, electrical systems, auxiliary machinery, and engine room watchkeeping.", eligibility: "Valid Engineering Cadet certificate or sea service\nMinimum 12 months sea service\nMedical certificate", outcomes: "Preparation for STCW III/1 CoC examination\nDiesel engine systems competency\nElectrical systems knowledge\nEngine room watchkeeping\nNIMASA examination readiness", nimasaApproved: true },
  { slug: "chief-mate-coc-prep", title: "Chief Mate (Unlimited) CoC Prep", stcwRegulation: "STCW II/2", level: "POST_COC", durationWeeks: 78, feeNaira: 0, registrationFormType: "MS_FORM", description: "Advanced preparation programme for experienced OOW Deck officers seeking Chief Mate STCW II/2 certification. Covers advanced navigation, cargo operations, and vessel stability.", eligibility: "Valid OOW Deck CoC\nMinimum 12 months sea service as OOW\nMedical certificate", outcomes: "Chief Mate CoC (Unlimited)\nAdvanced navigation competency\nCargo and stability expertise\nCommand preparedness", nimasaApproved: true },
  { slug: "master-coc-class-2", title: "Master Mariner CoC Class 2", stcwRegulation: "STCW II/2", level: "POST_COC", durationWeeks: 26, feeNaira: 0, registrationFormType: "MS_FORM", description: "Preparation and assessment programme for experienced Chief Mates seeking the Master Mariner (Class 2) Certificate of Competency. The highest deck officer qualification recognised by NIMASA.", eligibility: "Valid Chief Mate CoC\nMinimum 12 months sea service as Chief Mate\nMedical certificate\nAge 25+", outcomes: "Master Mariner CoC Class 2\nNIMASA-registered\nVessel command authority\nSafety management system competency\nISM Code compliance", nimasaApproved: true },
  { slug: "coc-revalidation-refresher", title: "CoC Revalidation (STCW Refresher)", stcwRegulation: "STCW Various", level: "REFRESHER", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Mandatory 5-year STCW revalidation refresher for officers whose Certificate of Competency is due for renewal. Covers updates to STCW Manila amendments, BRM, and safety management.", eligibility: "Valid or recently expired CoC\nProof of sea service\nMedical certificate", outcomes: "STCW revalidation endorsement\nUpdated Manila amendment competencies\nNIMASA certificate renewal", nimasaApproved: true },
  // ── VALUE-ADDED COURSES ───────────────────────────────────
  { slug: "vessel-steering-ror", title: "Vessel Steering & Rules of the Road (ROR)", stcwRegulation: null, level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Practical training in vessel steering techniques and full COLREGS (Rules of the Road) compliance for deck officers and ratings. Includes simulator sessions.", eligibility: "Deck officers and ratings\nAge 18+", outcomes: "ROR competency certificate\nColision regulation mastery\nSteering techniques\nNIMASA-endorsed", nimasaApproved: true },
  { slug: "incident-investigation", title: "Maritime Incident Investigation", stcwRegulation: null, level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Equips officers with the skills to conduct onboard incident and accident investigations using root-cause analysis, ISM Code procedures, and flag state reporting.", eligibility: "Officers and safety officers\nAge 18+", outcomes: "Incident investigation methodology\nRoot cause analysis\nISM Code compliance\nFlag state reporting", nimasaApproved: false },
  { slug: "risk-assessment", title: "Maritime Risk Assessment", stcwRegulation: null, level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Training in formal maritime risk assessment techniques including HAZID, bow-tie analysis, and permit-to-work systems. Designed for safety officers and officers of the watch.", eligibility: "Officers and safety officers\nAge 18+", outcomes: "Risk matrix methodology\nHAZID and bow-tie analysis\nPermit-to-work systems\nISM safety management", nimasaApproved: false },
  { slug: "psc-sire-inspection-prep", title: "PSC & SIRE 2.0 Inspection Preparation", stcwRegulation: null, level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Comprehensive preparation for Port State Control and OCIMF SIRE 2.0 tanker inspections. Covers VIQ 7, deficiency management, and best practice vessel presentation.", eligibility: "Officers on tankers or vessels subject to SIRE inspection\nAge 18+", outcomes: "SIRE 2.0 VIQ awareness\nPSC deficiency avoidance\nTanker inspection readiness\nOCIMF best practices", nimasaApproved: false },
  { slug: "ism-code", title: "ISM Code & Safety Management", stcwRegulation: null, level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "Understanding and implementing the International Safety Management (ISM) Code for officers, DPAs, and vessel operators. Covers SMS development, auditing, and near-miss reporting.", eligibility: "Officers, DPAs, fleet managers\nAge 18+", outcomes: "ISM Code competency\nSMS development skills\nISM auditing methodology\nNear-miss reporting culture", nimasaApproved: false },
  // ── LEGACY ────────────────────────────────────────────────
  { slug: "port-shipping-management", title: "Port & Shipping Management Diploma", stcwRegulation: null, level: "POST_COC", durationWeeks: 52, feeNaira: 0, registrationFormType: "MS_FORM", description: "A one-year professional diploma in port operations, shipping economics, logistics, and trade. Ideal for NPA, NIMASA and shipping company professionals.", eligibility: "Degree or HND in any discipline\nAge 21+\nWork experience preferred", outcomes: "Port Operations Certificate\nShipping economics competency\nNPA/NIMASA career readiness\nLogistics and trade expertise", nimasaApproved: false },
  { slug: "ship-security-officer", title: "Ship Security Officer (SSO)", stcwRegulation: "STCW VI/5", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 0, registrationFormType: "MS_FORM", description: "ISPS Code and STCW VI/5 compliant Ship Security Officer training for deck officers and security-conscious crew. Covers security threat assessment, SSP implementation and security drills.", eligibility: "Current or aspiring deck officer\nBasic Safety Training certificate\nAge 18+", outcomes: "STCW VI/5 SSO Certificate\nISPS Code competency\nSecurity plan implementation\nNIMASA-registered certification", nimasaApproved: true },
];

const newsSeedData = [
  { slug: "nimasa-institutional-award-2025", title: "SeaLearn Receives NIMASA Institutional Excellence Award 2025", excerpt: "SeaLearn Nigeria has been recognised by NIMASA as the outstanding maritime training institution of the year for the second consecutive time.", body: "SeaLearn Nigeria has been recognised by NIMASA as the outstanding maritime training institution of the year for the second consecutive time. This prestigious award acknowledges our commitment to world-class maritime education and STCW compliance.", category: "achievement", imageUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600&q=80", publishedAt: new Date("2025-04-07") },
  { slug: "west-africa-maritime-forum-2025", title: "West Africa Maritime Forum 2025 — Call for Papers", excerpt: "SeaLearn Nigeria is co-hosting the West Africa Maritime Forum 2025. Researchers and practitioners are invited to submit papers on maritime safety, trade, and innovation.", body: "SeaLearn Nigeria is proud to co-host the West Africa Maritime Forum 2025. We invite researchers, practitioners, and industry professionals to submit papers on maritime safety, trade, and innovation. The deadline for submissions is 15 April 2025.", category: "event", imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80", publishedAt: new Date("2025-04-02"), eventDate: new Date("2025-05-07"), eventVenue: "Eko Hotel & Suites, Lagos" },
  { slug: "june-2025-intake-open", title: "June 2025 Intake — Applications Now Open", excerpt: "Applications for the June 2025 intake are now open for all programmes. The deadline is 30 April 2025. Apply early to secure your place.", body: "We are pleased to announce that applications for the June 2025 intake are now open for all our NIMASA-approved programmes. The application deadline is 30 April 2025. Apply early to secure your preferred programme.", category: "admissions", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", publishedAt: new Date("2025-04-01") },
  { slug: "new-bridge-simulator-installed", title: "State-of-the-Art Bridge Simulator Installed at SeaLearn Campus", excerpt: "SeaLearn Nigeria has installed a full-mission Class A bridge simulator, bringing our training facilities to international standards.", body: "SeaLearn Nigeria has completed the installation of a full-mission Class A bridge simulator at our Apapa campus. This state-of-the-art facility will significantly enhance the quality of our nautical training programmes.", category: "news", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", publishedAt: new Date("2025-03-18") },
  { slug: "nimasa-cadet-sponsorship-2025", title: "NIMASA Cadet Sponsorship Programme 2025 — Applications Invited", excerpt: "Qualified candidates can apply for the NIMASA-funded cadet scholarship programme. SeaLearn Nigeria is an approved training provider.", body: "The NIMASA Cadet Sponsorship Programme 2025 is now open. SeaLearn Nigeria, as an approved training provider, invites qualified candidates to apply for this fully-funded scholarship programme.", category: "admissions", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80", publishedAt: new Date("2025-03-10") },
  { slug: "sea-day-celebration-2025", title: "World Maritime Day Celebration at SeaLearn — 25 September", excerpt: "Join us as we celebrate World Maritime Day 2025 with port visits, industry talks, and our annual graduation ceremony.", body: "SeaLearn Nigeria will host World Maritime Day 2025 celebrations with port visits to Apapa and Tin Can Island ports, industry talks from leading maritime professionals, and our annual graduation ceremony.", category: "event", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80", publishedAt: new Date("2025-03-01"), eventDate: new Date("2025-09-25"), eventVenue: "Apapa Port & SeaLearn Campus, Lagos" },
];

async function runSeed(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const results: string[] = [];

  // ── Demo accounts ────────────────────────────────────────────
  const demoAccounts = [
    { email: process.env.ADMIN_EMAIL || "admin@sealearn.ng", name: "SeaLearn Admin", role: "SUPER_ADMIN", pass: process.env.ADMIN_PASSWORD || "SeaLearn@2025" },
    { email: "registrar@sealearn.ng", name: "Amaka Obi", role: "REGISTRAR", pass: "SeaLearn@2025" },
    { email: "instructor@sealearn.ng", name: "Capt. Emeka Adeyemi", role: "INSTRUCTOR", pass: "SeaLearn@2025" },
    { email: "student@sealearn.ng", name: "Chidi Nwachukwu", role: "STUDENT", pass: "Student@2025" },
    { email: "student2@sealearn.ng", name: "Fatima Bello", role: "STUDENT", pass: "Student@2025" },
  ];

  for (const acc of demoAccounts) {
    const existing = await prisma.user.findUnique({ where: { email: acc.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(acc.pass, 12);
      await prisma.user.create({
        data: { email: acc.email, name: acc.name, role: acc.role as "SUPER_ADMIN" | "ADMIN" | "REGISTRAR" | "INSTRUCTOR" | "STUDENT", passwordHash },
      });
      results.push(`Created ${acc.role}: ${acc.email}`);
    } else {
      results.push(`${acc.role} exists: ${acc.email}`);
    }
  }

  // Enrol demo student in BST course if enrolment doesn't exist
  const bstCourse = await prisma.course.findUnique({ where: { slug: "basic-safety-training" } });
  const demoStudent = await prisma.user.findUnique({ where: { email: "student@sealearn.ng" } });
  if (bstCourse && demoStudent) {
    const existingEnrol = await prisma.enrolment.findFirst({ where: { userId: demoStudent.id, courseId: bstCourse.id } });
    if (!existingEnrol) {
      await prisma.enrolment.create({
        data: { userId: demoStudent.id, courseId: bstCourse.id, status: "ACTIVE", totalFee: bstCourse.feeNaira, amountPaid: bstCourse.feeNaira },
      });
      results.push("Enrolled demo student in BST");
    } else {
      results.push("Demo student already enrolled in BST");
    }
  }

  // Courses
  for (const c of courseSeedData) {
    const exists = await prisma.course.findUnique({ where: { slug: c.slug } });
    if (!exists) {
      await prisma.course.create({
        data: {
          slug: c.slug,
          title: c.title,
          stcwRegulation: c.stcwRegulation,
          level: LEVEL_MAP[c.level],
          durationWeeks: c.durationWeeks,
          feeNaira: c.feeNaira,
          description: c.description,
          eligibility: c.eligibility,
          outcomes: c.outcomes,
          nimasaApproved: c.nimasaApproved,
          registrationFormType: c.registrationFormType,
          isActive: true,
        },
      });
      results.push(`Created course: ${c.slug}`);
    } else {
      results.push(`Course exists: ${c.slug}`);
    }
  }

  // Course Packages (seed after courses so IDs exist)
  const packageSeedData = [
    {
      slug: "deck-officer-complete",
      title: "Deck Officer Complete Package",
      description: "Everything a Pre-Sea Deck Cadet needs: full cadet programme, mandatory BST, and GMDSS. Best value for aspiring deck officers.",
      discountPercent: 15,
      badgeText: "Best Value",
      badgeColor: "bg-teal",
      courseSlugs: ["pre-sea-deck-cadet", "basic-safety-training", "gmdss-general-operator"],
    },
    {
      slug: "safety-essentials-bundle",
      title: "Safety Essentials Bundle",
      description: "All mandatory STCW safety courses in one package. Ideal for seafarers joining their first vessel or revalidating.",
      discountPercent: 10,
      badgeText: "Most Popular",
      badgeColor: "bg-ocean",
      courseSlugs: ["basic-safety-training", "ship-security-officer", "coc-revalidation-refresher"],
    },
    {
      slug: "maritime-career-starter",
      title: "Maritime Career Starter",
      description: "Pre-Sea Engineering Cadet plus mandatory BST — the complete entry-level package for aspiring marine engineers.",
      discountPercent: 12,
      badgeText: "Starter Pack",
      badgeColor: "bg-jade",
      courseSlugs: ["pre-sea-engineering-cadet", "basic-safety-training"],
    },
  ];

  for (const p of packageSeedData) {
    const exists = await prisma.coursePackage.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      // Resolve course IDs from slugs
      const courseRecords = await prisma.course.findMany({
        where: { slug: { in: p.courseSlugs } },
        select: { id: true },
      });
      if (courseRecords.length >= 2) {
        await prisma.coursePackage.create({
          data: {
            slug: p.slug,
            title: p.title,
            description: p.description,
            discountPercent: p.discountPercent,
            badgeText: p.badgeText,
            badgeColor: p.badgeColor,
            isActive: true,
            courses: { create: courseRecords.map((c) => ({ courseId: c.id })) },
          },
        });
        results.push(`Created package: ${p.slug}`);
      } else {
        results.push(`Skipped package (courses not found): ${p.slug}`);
      }
    } else {
      results.push(`Package exists: ${p.slug}`);
    }
  }

  // News
  for (const n of newsSeedData) {
    const exists = await prisma.post.findUnique({ where: { slug: n.slug } });
    if (!exists) {
      await prisma.post.create({ data: n });
      results.push(`Created post: ${n.slug}`);
    } else {
      results.push(`Post exists: ${n.slug}`);
    }
  }

  return NextResponse.json({ ok: true, results });
}

export const GET = runSeed;
export const POST = runSeed;
