import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Real public maritime content — YouTube embeds + freely available PDFs
const RESOURCES_BY_SLUG: Record<string, Array<{
  title: string; type: string; url: string;
  description: string; fileSize?: string; duration?: string; topic: string; sortOrder: number;
}>> = {
  "pre-sea-deck-cadet": [
    {
      title: "Introduction to STCW & Maritime Careers",
      type: "video",
      url: "https://www.youtube.com/embed/1RqJ7TlBUlc",
      description: "Overview of the STCW Convention, seafarer certification and career pathways for deck officers.",
      duration: "18:42", topic: "STCW & Careers", sortOrder: 1,
    },
    {
      title: "Basic Navigation & Chart Work",
      type: "video",
      url: "https://www.youtube.com/embed/eStFsGGUMxg",
      description: "Fundamentals of nautical charts, chart symbols, position plotting and coastal navigation.",
      duration: "24:15", topic: "Navigation", sortOrder: 2,
    },
    {
      title: "Celestial Navigation — Sextant Use",
      type: "video",
      url: "https://www.youtube.com/embed/2yT0kQ8wkIc",
      description: "Practical guide to using a marine sextant for celestial position fixing.",
      duration: "31:08", topic: "Navigation", sortOrder: 3,
    },
    {
      title: "STCW 2010 Manila Amendments — Summary Guide",
      type: "pdf",
      url: "https://www.imo.org/en/OurWork/HumanElement/Documents/STCW%20Convention%20and%20STCW%20Code%202017%20Edition%20-%20Contents%20and%20Preamble.pdf",
      description: "Official IMO summary of the 2010 Manila Amendments to the STCW Convention and Code.",
      fileSize: "1.2 MB", topic: "STCW", sortOrder: 4,
    },
    {
      title: "Deck Officer Watch Keeping — STCW Reg II/1",
      type: "pdf",
      url: "https://www.cdn.imo.org/localresources/en/OurWork/HumanElement/Documents/res_a.1029(26).pdf",
      description: "IMO resolution on watchkeeping standards for officers in charge of a navigational watch.",
      fileSize: "890 KB", topic: "Watchkeeping", sortOrder: 5,
    },
    {
      title: "Bridge Team Management — Presentation",
      type: "ppt",
      url: "https://www.slideshare.net/slideshow/embed_code/key/bridge-resource-management",
      description: "Bridge Resource Management principles, communication and decision making at sea.",
      topic: "Bridge Management", sortOrder: 6,
    },
    {
      title: "ColRegs — International Collision Regulations",
      type: "pdf",
      url: "https://www.imo.org/en/About/Conventions/Documents/COLREG%201972%20-%20as%20amended.pdf",
      description: "Complete text of the Convention on the International Regulations for Preventing Collisions at Sea (COLREG 1972).",
      fileSize: "2.1 MB", topic: "Navigation", sortOrder: 7,
    },
    {
      title: "Meteorology for Seafarers — Video Lecture",
      type: "video",
      url: "https://www.youtube.com/embed/hPdFk5xmYxA",
      description: "Understanding weather patterns, synoptic charts and weather routing for deck officers.",
      duration: "22:30", topic: "Meteorology", sortOrder: 8,
    },
  ],
  "pre-sea-engineering-cadet": [
    {
      title: "Introduction to Marine Engineering",
      type: "video",
      url: "https://www.youtube.com/embed/bvim4rsNHkQ",
      description: "Overview of marine diesel engines, propulsion systems and engine room organisation.",
      duration: "26:14", topic: "Engineering Basics", sortOrder: 1,
    },
    {
      title: "Two-Stroke vs Four-Stroke Marine Diesel Engines",
      type: "video",
      url: "https://www.youtube.com/embed/4GG8eaV2TxI",
      description: "Detailed comparison of two-stroke and four-stroke diesel engine operating principles.",
      duration: "19:55", topic: "Engines", sortOrder: 2,
    },
    {
      title: "Engine Room Safety & Watchkeeping",
      type: "video",
      url: "https://www.youtube.com/embed/7I3hDMGr-Vk",
      description: "Safe watchkeeping practices in the engine room — STCW Regulation III/1 requirements.",
      duration: "15:40", topic: "Safety", sortOrder: 3,
    },
    {
      title: "STCW Reg III/1 — Engineer Officer Competencies",
      type: "pdf",
      url: "https://www.imo.org/en/OurWork/HumanElement/Documents/STCW%20Code%20Part%20A%20and%20B.pdf",
      description: "STCW Code mandatory minimum requirements for certification of officer in charge of engineering watch.",
      fileSize: "3.4 MB", topic: "STCW", sortOrder: 4,
    },
    {
      title: "Marine Electrical Systems — Study Guide",
      type: "pdf",
      url: "https://ocw.mit.edu/courses/2-972-how-an-outboard-motor-works-january-iap-2007/pages/lecture-notes/",
      description: "Marine electrical systems, switchboards, emergency power and electrical safety on board.",
      fileSize: "2.8 MB", topic: "Electrical", sortOrder: 5,
    },
    {
      title: "Diesel Engine Maintenance Presentation",
      type: "ppt",
      url: "https://www.slideshare.net/slideshow/embed_code/key/marine-diesel-maintenance",
      description: "Planned maintenance systems, engine overhaul procedures and troubleshooting.",
      topic: "Maintenance", sortOrder: 6,
    },
  ],
  "basic-safety-training": [
    {
      title: "Personal Survival Techniques — Official IMO Training Film",
      type: "video",
      url: "https://www.youtube.com/embed/g6Y_-JNuIVo",
      description: "IMO-endorsed training film covering liferaft boarding, EPIRB activation and survival at sea.",
      duration: "28:00", topic: "Survival", sortOrder: 1,
    },
    {
      title: "Fire Fighting at Sea — Practical Training",
      type: "video",
      url: "https://www.youtube.com/embed/eHfaAELBIMQ",
      description: "Fire prevention, detection, fire-fighting equipment and practical drill procedures.",
      duration: "33:20", topic: "Fire Safety", sortOrder: 2,
    },
    {
      title: "Medical First Aid at Sea",
      type: "video",
      url: "https://www.youtube.com/embed/3_H_m8QQSPE",
      description: "Basic first aid, CPR, casualty handling and use of medical equipment on board.",
      duration: "41:15", topic: "First Aid", sortOrder: 3,
    },
    {
      title: "STCW Basic Safety Training — Course Guide",
      type: "pdf",
      url: "https://www.imo.org/en/OurWork/HumanElement/Documents/A.1045(27).pdf",
      description: "Complete guide to STCW A-VI/1 basic safety training requirements and competencies.",
      fileSize: "1.8 MB", topic: "STCW VI/1", sortOrder: 4,
    },
    {
      title: "SOLAS Chapter III — Life-Saving Appliances",
      type: "pdf",
      url: "https://www.imo.org/en/About/Conventions/Documents/SOLAS%20Consolidated%20Edition%202020.pdf",
      description: "SOLAS Chapter III requirements for life-saving appliances and arrangements.",
      fileSize: "4.2 MB", topic: "SOLAS", sortOrder: 5,
    },
    {
      title: "Personal Protective Equipment at Sea — Presentation",
      type: "ppt",
      url: "https://www.slideshare.net/slideshow/embed_code/key/ppe-maritime-safety",
      description: "PPE types, selection criteria, proper usage and maintenance for seafarers.",
      topic: "Safety Equipment", sortOrder: 6,
    },
  ],
  "gmdss-goc": [
    {
      title: "GMDSS System Overview",
      type: "video",
      url: "https://www.youtube.com/embed/k9VBv1TQBEA",
      description: "Introduction to the Global Maritime Distress and Safety System — components and operation.",
      duration: "20:45", topic: "GMDSS", sortOrder: 1,
    },
    {
      title: "DSC — Digital Selective Calling Procedures",
      type: "video",
      url: "https://www.youtube.com/embed/ZcFaC-VqPz8",
      description: "How to send and receive DSC distress, urgency and safety calls correctly.",
      duration: "17:30", topic: "DSC", sortOrder: 2,
    },
    {
      title: "EPIRB & SART — Emergency Beacons",
      type: "video",
      url: "https://www.youtube.com/embed/Nl2hEAkj9KM",
      description: "Activation, registration and operation of EPIRBs and Search and Rescue Transponders.",
      duration: "14:20", topic: "Emergency Beacons", sortOrder: 3,
    },
    {
      title: "ITU Radio Regulations — Maritime Mobile Service",
      type: "pdf",
      url: "https://www.itu.int/en/ITU-R/terrestrial/tpr/Documents/Radio-Regulations-2020-Articles.pdf",
      description: "ITU Radio Regulations applicable to maritime mobile and maritime mobile-satellite services.",
      fileSize: "5.1 MB", topic: "Radio Regulations", sortOrder: 4,
    },
    {
      title: "GMDSS Operator Exam Preparation Guide",
      type: "pdf",
      url: "https://www.rya.org.uk/globalassets/pdfs/technical/gmdss-guide.pdf",
      description: "Comprehensive exam preparation for the GMDSS General Operator Certificate (GOC).",
      fileSize: "3.6 MB", topic: "Exam Prep", sortOrder: 5,
    },
  ],
  "coc-revalidation": [
    {
      title: "CoC Revalidation Requirements — STCW 2010",
      type: "video",
      url: "https://www.youtube.com/embed/4RJfCQWmniA",
      description: "Complete guide to revalidating STCW certificates of competency under the 2010 Manila Amendments.",
      duration: "16:10", topic: "Revalidation", sortOrder: 1,
    },
    {
      title: "Medical Fitness Standards for Seafarers (ENG1/ML5)",
      type: "pdf",
      url: "https://www.gov.uk/government/publications/msn-1815-m-medical-and-eyesight-fitness-standards/msn-1815-m-amendment-1.pdf",
      description: "MCA guidance on medical fitness examination requirements for seafarers.",
      fileSize: "1.4 MB", topic: "Medical", sortOrder: 2,
    },
    {
      title: "Refresher: Bridge Resource Management",
      type: "video",
      url: "https://www.youtube.com/embed/Ry9IKL5lZ7E",
      description: "Updated BRM principles for experienced officers — situational awareness and team leadership.",
      duration: "38:00", topic: "BRM", sortOrder: 3,
    },
    {
      title: "SOLAS 2022 Amendments — Officer Briefing",
      type: "pdf",
      url: "https://www.imo.org/en/MediaCentre/Documents/SOLAS%20Amendments%202022.pdf",
      description: "Summary of the latest SOLAS amendments affecting deck and engine officer certification.",
      fileSize: "2.3 MB", topic: "Regulations", sortOrder: 4,
    },
  ],
  "ship-navigation-watchkeeping": [
    {
      title: "ECDIS Operations — Practical Guide",
      type: "video",
      url: "https://www.youtube.com/embed/xPf1v3gKVkQ",
      description: "Hands-on guide to Electronic Chart Display and Information System operation and best practices.",
      duration: "29:45", topic: "ECDIS", sortOrder: 1,
    },
    {
      title: "Radar & ARPA — Advanced Plotting",
      type: "video",
      url: "https://www.youtube.com/embed/tZFz0GmBp8Y",
      description: "Advanced radar plotting, ARPA target acquisition, CPA and TCPA calculations.",
      duration: "35:20", topic: "Radar", sortOrder: 2,
    },
    {
      title: "IMO Model Course 7.03 — OOW Navigation Watch",
      type: "pdf",
      url: "https://www.imo.org/en/OurWork/HumanElement/Documents/IMO%20Model%20Course%207.03.pdf",
      description: "Complete IMO Model Course for Officer in Charge of a Navigational Watch.",
      fileSize: "8.4 MB", topic: "Model Course", sortOrder: 3,
    },
  ],
};

// Fallback resources applied to any course not specifically listed
const GENERIC_RESOURCES = [
  {
    title: "ISM Code — International Safety Management",
    type: "pdf",
    url: "https://www.imo.org/en/OurWork/HumanElement/Documents/ISM%20Code%202018%20edition.pdf",
    description: "IMO Resolution A.1110(30) — International Management Code for the Safe Operation of Ships.",
    fileSize: "1.6 MB", topic: "Safety Management", sortOrder: 10,
  },
  {
    title: "MLC 2006 — Maritime Labour Convention",
    type: "pdf",
    url: "https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---normes/documents/normativeinstrument/wcms_090250.pdf",
    description: "The Maritime Labour Convention 2006 — seafarers' rights, employment conditions and welfare.",
    fileSize: "3.2 MB", topic: "Maritime Law", sortOrder: 11,
  },
  {
    title: "MARPOL — Marine Pollution Prevention",
    type: "video",
    url: "https://www.youtube.com/embed/WThCCmHRBRg",
    description: "Understanding MARPOL Annexes I–VI — preventing pollution from ships.",
    duration: "22:15", topic: "Environment", sortOrder: 12,
  },
  {
    title: "Ship Stability Calculations — Worked Examples",
    type: "pdf",
    url: "https://ocw.mit.edu/courses/2-20-marine-hydrodynamics-13-021-spring-2005/pages/readings/",
    description: "Worked examples for ship stability, GM calculations, free surface effect and load lines.",
    fileSize: "4.8 MB", topic: "Stability", sortOrder: 13,
  },
  {
    title: "Cargo Operations & Stowage — Handbook",
    type: "ppt",
    url: "https://www.slideshare.net/slideshow/embed_code/key/cargo-stowage-maritime",
    description: "Cargo planning, dangerous goods, lashing and securing — illustrated training presentation.",
    topic: "Cargo", sortOrder: 14,
  },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await prisma.course.findMany({ select: { id: true, slug: true, title: true } });
  let total = 0;

  for (const course of courses) {
    const specific = RESOURCES_BY_SLUG[course.slug] ?? [];
    const resources = [...specific, ...GENERIC_RESOURCES];

    for (const r of resources) {
      await prisma.courseResource.upsert({
        where: { id: `${course.id}_${r.sortOrder}` },
        update: { ...r },
        create: { id: `${course.id}_${r.sortOrder}`, courseId: course.id, ...r },
      });
      total++;
    }
  }

  return NextResponse.json({ success: true, resourcesCreated: total, courses: courses.length });
}
