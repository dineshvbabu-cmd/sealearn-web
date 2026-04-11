import Image from "next/image";
import Link from "next/link";
import { courses as staticCourses } from "@/lib/data";
import type { CourseLevel } from "@/lib/data";
import { ArrowRight, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

const LEVEL_LABEL: Record<string, string> = {
  PRE_SEA: "Pre-Sea",
  SHORT_COURSE: "Short Course",
  DEGREE: "Degree Level",
  POST_COC: "Post-CoC",
  REFRESHER: "Refresher",
};

const levelLabels: Record<CourseLevel, { label: string; className: string }> = {
  PRE_SEA: { label: "Pre-Sea", className: "bg-teal/10 text-teal" },
  SHORT_COURSE: { label: "Short Course", className: "bg-gold/15 text-amber" },
  DEGREE: { label: "Degree Level", className: "bg-ocean/10 text-ocean" },
  POST_COC: { label: "Post-CoC", className: "bg-jade/10 text-jade" },
  REFRESHER: { label: "Refresher", className: "bg-steel/10 text-steel" },
};

const allCourses = [
  { title: "Pre-Sea Deck Cadet Programme", reg: "II/1", duration: "6 months", level: "Pre-Sea", fee: "₦480,000" },
  { title: "Pre-Sea Engineering Cadet", reg: "III/1", duration: "6 months", level: "Pre-Sea", fee: "₦520,000" },
  { title: "Basic Safety Training (BST)", reg: "VI/1", duration: "4 weeks", level: "Short Course", fee: "₦120,000" },
  { title: "Proficiency in Survival Craft", reg: "VI/2.1", duration: "5 days", level: "Short Course", fee: "₦45,000" },
  { title: "Advanced Fire Fighting", reg: "VI/3", duration: "5 days", level: "Short Course", fee: "₦40,000" },
  { title: "Medical First Aid (MFAU)", reg: "VI/4.1", duration: "3 days", level: "Short Course", fee: "₦30,000" },
  { title: "GMDSS General Operator Certificate", reg: "IV/2", duration: "4 weeks", level: "Short Course", fee: "₦95,000" },
  { title: "OOW Deck (full programme)", reg: "II/1", duration: "3 years", level: "Degree Level", fee: "₦1,800,000" },
  { title: "Officer in Charge of Engine Watch", reg: "III/1", duration: "3 years", level: "Degree Level", fee: "₦1,800,000" },
  { title: "Chief Mate CoC Prep", reg: "II/2", duration: "18 months", level: "Post-CoC", fee: "₦650,000" },
  { title: "Master (Unlimited) CoC Class 2 Prep", reg: "II/2", duration: "12 months", level: "Post-CoC", fee: "₦550,000" },
  { title: "Chief Engineer (Motor Vessels)", reg: "III/2", duration: "18 months", level: "Post-CoC", fee: "₦700,000" },
  { title: "Ship Security Officer (SSO)", reg: "VI/5", duration: "3 days", level: "Short Course", fee: "₦35,000" },
  { title: "Tanker Endorsements (Crude/Chemical/Gas)", reg: "V/1", duration: "1–2 weeks", level: "Short Course", fee: "₦60,000–₦120,000" },
  { title: "Electro-Technical Officer (ETO)", reg: "III/6", duration: "12 months", level: "Degree Level", fee: "₦480,000" },
  { title: "Port & Shipping Management Diploma", reg: "—", duration: "1 year", level: "Post-CoC", fee: "₦380,000" },
  { title: "CoC Revalidation (STCW Refresher)", reg: "Various", duration: "5 days", level: "Refresher", fee: "₦85,000" },
  { title: "Bridge Resource Management (BRM)", reg: "II/1", duration: "5 days", level: "Short Course", fee: "₦65,000" },
];

const levelBadge: Record<string, string> = {
  "Pre-Sea": "bg-teal/10 text-teal",
  "Short Course": "bg-gold/15 text-amber",
  "Degree Level": "bg-ocean/10 text-ocean",
  "Post-CoC": "bg-jade/10 text-jade",
  Refresher: "bg-steel/10 text-muted",
};

export default async function CoursesPage() {
  // Fetch from DB; fall back to static data if DB is unavailable
  let dbCourses: Array<{ slug: string; title: string; stcwRegulation: string | null; level: string; durationWeeks: number; feeNaira: number; nimasaApproved: boolean }> = [];
  try {
    dbCourses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: [{ level: "asc" }, { title: "asc" }],
      select: { slug: true, title: true, stcwRegulation: true, level: true, durationWeeks: true, feeNaira: true, nimasaApproved: true },
    });
  } catch {
    // DB unavailable — static fallback
  }

  // For the featured cards, use DB data if available otherwise fall back to static
  const courses = dbCourses.length > 0
    ? dbCourses.map((c) => ({
        slug: c.slug,
        title: c.title,
        stcwRegulation: c.stcwRegulation ?? "—",
        durationText: `${c.durationWeeks >= 52 ? `${Math.round(c.durationWeeks / 52)} Year${c.durationWeeks >= 104 ? "s" : ""}` : c.durationWeeks >= 4 ? `${c.durationWeeks} Weeks` : `${c.durationWeeks * 5} Days`}`,
        feeNaira: c.feeNaira,
        feeText: `₦${c.feeNaira.toLocaleString()}`,
        imageUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=800&q=80",
        tag: `${LEVEL_LABEL[c.level] ?? c.level} · ${c.stcwRegulation ?? ""}`.trim().replace(/·\s*$/, ""),
        tagColor: c.level === "PRE_SEA" ? "bg-teal" : c.level === "SHORT_COURSE" ? "bg-gold" : c.level === "POST_COC" ? "bg-jade" : c.level === "REFRESHER" ? "bg-steel" : "bg-ocean",
        nimasaApproved: c.nimasaApproved,
      }))
    : staticCourses;

  // For the full table, merge DB + any extra static courses
  const tableData = dbCourses.length > 0
    ? dbCourses.map((c, i) => ({
        title: c.title,
        reg: c.stcwRegulation ?? "—",
        duration: `${c.durationWeeks >= 52 ? `${Math.round(c.durationWeeks / 52)} yr` : c.durationWeeks >= 4 ? `${c.durationWeeks} wks` : `${c.durationWeeks * 5} days`}`,
        level: LEVEL_LABEL[c.level] ?? c.level,
        fee: `₦${c.feeNaira.toLocaleString()}`,
      }))
    : allCourses;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Module 03 · STCW Course Catalogue
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">
            STCW & Pre-Sea Course Catalogue
          </h1>
          <p className="text-white/55 text-base max-w-2xl">
            Full IMO/STCW compliant programme directory — Pre-Sea, BST, Deck, Engine, Port Management
            and STCW refreshers. All programmes NIMASA approved.
          </p>
        </div>
      </div>
      <div className="divbar" />

      {/* Search & filter bar */}
      <div className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search STCW courses..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-surface outline-none focus:border-ocean"
            />
          </div>
          {["All", "Pre-Sea", "Short Course", "Degree Level", "Post-CoC", "Refresher"].map((f) => (
            <button
              key={f}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                f === "All"
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-muted border-border hover:border-ocean hover:text-ocean"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Featured course cards */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="font-cinzel text-xl text-navy font-bold mb-6">Featured Programmes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 text-white ${course.tagColor}`}>
                  {course.tag}
                </span>
                <h3 className="font-bold text-navy text-sm leading-tight mb-1">{course.title}</h3>
                <p className="text-muted text-xs mb-3">{course.durationText} · NIMASA Approved</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean text-sm">{course.feeText}</span>
                  <span className="inline-flex items-center gap-1 bg-navy text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⚓ {course.stcwRegulation}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-ocean text-xs font-semibold">
                  View details <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Full programme table */}
        <h2 className="font-cinzel text-xl text-navy font-bold mb-4">Full STCW Programme Directory</h2>
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide">Programme</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide hidden sm:table-cell">STCW Reg.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide hidden md:table-cell">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide hidden lg:table-cell">Level</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide">Fee</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((c, i) => (
                <tr key={c.title} className={`border-t border-border hover:bg-surface transition-colors ${i % 2 === 1 ? "bg-surface/50" : ""}`}>
                  <td className="px-4 py-3 text-muted text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-navy text-xs sm:text-sm">{c.title}</td>
                  <td className="px-4 py-3 text-muted text-xs hidden sm:table-cell">{c.reg}</td>
                  <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">{c.duration}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelBadge[c.level] || "bg-surface text-muted"}`}>
                      {c.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-ocean text-xs">{c.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Application note */}
        <div className="mt-6 bg-navy/5 border border-navy/15 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">🇳🇬</span>
          <div>
            <div className="font-bold text-navy text-sm">Application Fee</div>
            <div className="text-muted text-sm">
              ₦15,000 non-refundable application fee applies to all programmes. Pay via Paystack,
              Flutterwave, USSD *737# or bank transfer. Instalment plan: 50% on enrolment, 50% after Month 3.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
