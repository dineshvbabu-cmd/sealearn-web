import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { CourseLevel } from "@prisma/client";

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

const courseSeedData = [
  { slug: "pre-sea-deck-cadet", title: "Pre-Sea Deck Cadet Programme", stcwRegulation: "STCW Reg. II/1", level: "PRE_SEA", durationWeeks: 26, feeNaira: 480000, description: "Nigeria's flagship pre-sea deck officer training programme. Covers nautical science, navigation, seamanship, meteorology, GMDSS, and bridge resource management — fully NIMASA approved and IMO STCW 2010 compliant.", eligibility: "Minimum 5 O-Level credits including English, Mathematics and Physics\nAge 16–25\nValid ENG1 or ML5 medical certificate from NIMASA-approved centre\nNIN (National Identification Number)\nGood eyesight (correctable to 6/6)", outcomes: "Officer of the Watch (Deck) eligibility\nNIMASA-registered STCW II/1 certificate\nBridge watchkeeping competency\nPlacement with Nigerian and international shipping lines", nimasaApproved: true },
  { slug: "pre-sea-engineering-cadet", title: "Pre-Sea Engineering Cadet Programme", stcwRegulation: "STCW Reg. III/1", level: "PRE_SEA", durationWeeks: 26, feeNaira: 520000, description: "Comprehensive marine engineering cadet programme covering diesel engines, electrical systems, pumping, damage control, and engineering watchkeeping. NIMASA approved, STCW III/1 compliant.", eligibility: "Minimum 5 O-Level credits including English, Mathematics, Physics and Technical Drawing\nAge 16–25\nValid ENG1 or ML5 medical certificate\nNIN required", outcomes: "Officer of the Watch (Engine) eligibility\nNIMASA-registered STCW III/1 certificate\nEngine room watchkeeping competency\nNNPC and international shipping line placements available", nimasaApproved: true },
  { slug: "basic-safety-training", title: "Basic Safety Training (BST)", stcwRegulation: "STCW VI/1", level: "SHORT_COURSE", durationWeeks: 4, feeNaira: 120000, description: "The mandatory STCW basic safety package required for all seafarers. Covers personal survival techniques, fire prevention & fire-fighting, elementary first aid, and personal safety & social responsibilities.", eligibility: "Open to all persons seeking employment at sea\nMinimum age 16\nBasic literacy and numeracy\nMedical fitness certificate", outcomes: "STCW VI/1 certificate (mandatory for all seafarers)\nNIMASA-registered certification\nPersonal Survival Techniques\nFire Prevention & Fire Fighting\nElementary First Aid", nimasaApproved: true },
  { slug: "gmdss-general-operator", title: "GMDSS General Operator Certificate", stcwRegulation: "STCW IV/2", level: "SHORT_COURSE", durationWeeks: 4, feeNaira: 95000, description: "The GMDSS GOC qualifies officers to operate all GMDSS equipment including EPIRB, SART, VHF, MF/HF DSC, NAVTEX and Inmarsat systems on SOLAS vessels. IMO Model Course 1.25.", eligibility: "O-Level passes in English, Mathematics and Physics\nAge 18+\nMedical fitness certificate", outcomes: "GMDSS General Operator Certificate\nNIMASA-registered, internationally recognised\nMF/HF and VHF DSC operations\nEPIRB, SART and Inmarsat proficiency", nimasaApproved: true },
  { slug: "ship-security-officer", title: "Ship Security Officer (SSO)", stcwRegulation: "STCW VI/5", level: "SHORT_COURSE", durationWeeks: 1, feeNaira: 35000, description: "ISPS Code and STCW VI/5 compliant Ship Security Officer training for deck officers and security-conscious crew. Covers security threat assessment, SSP implementation and security drills.", eligibility: "Current or aspiring deck officer\nBasic Safety Training certificate\nAge 18+", outcomes: "STCW VI/5 SSO Certificate\nISPS Code competency\nSecurity plan implementation\nNIMASA-registered certification", nimasaApproved: true },
  { slug: "coc-revalidation-refresher", title: "CoC Revalidation (STCW Refresher)", stcwRegulation: "STCW Various", level: "REFRESHER", durationWeeks: 1, feeNaira: 85000, description: "Mandatory 5-year STCW revalidation refresher for officers whose Certificate of Competency is due for renewal. Covers updates to STCW Manila amendments, BRM, and safety management.", eligibility: "Valid or recently expired CoC\nProof of sea service\nMedical certificate", outcomes: "STCW revalidation endorsement\nUpdated Manila amendment competencies\nNIMASA certificate renewal", nimasaApproved: true },
  { slug: "chief-mate-coc-prep", title: "Chief Mate (Unlimited) CoC Prep", stcwRegulation: "STCW II/2", level: "POST_COC", durationWeeks: 78, feeNaira: 650000, description: "Advanced preparation programme for experienced OOW Deck officers seeking Chief Mate STCW II/2 certification. Covers advanced navigation, cargo operations, and vessel stability.", eligibility: "Valid OOW Deck CoC\nMinimum 12 months sea service as OOW\nMedical certificate", outcomes: "Chief Mate CoC (Unlimited)\nAdvanced navigation competency\nCargo and stability expertise\nCommand preparedness", nimasaApproved: true },
  { slug: "port-shipping-management", title: "Port & Shipping Management Diploma", stcwRegulation: null, level: "POST_COC", durationWeeks: 52, feeNaira: 380000, description: "A one-year professional diploma in port operations, shipping economics, logistics, and trade. Ideal for NPA, NIMASA and shipping company professionals.", eligibility: "Degree or HND in any discipline\nAge 21+\nWork experience preferred", outcomes: "Port Operations Certificate\nShipping economics competency\nNPA/NIMASA career readiness\nLogistics and trade expertise", nimasaApproved: false },
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

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sealearn.ng";
  const adminPass = process.env.ADMIN_PASSWORD || "SeaLearn@2025";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPass, 12);
    await prisma.user.create({
      data: { email: adminEmail, name: "SeaLearn Admin", role: "SUPER_ADMIN", passwordHash },
    });
    results.push(`Created admin user: ${adminEmail}`);
  } else {
    results.push(`Admin user already exists: ${adminEmail}`);
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
          isActive: true,
        },
      });
      results.push(`Created course: ${c.slug}`);
    } else {
      results.push(`Course exists: ${c.slug}`);
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
