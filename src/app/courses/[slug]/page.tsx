import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses as staticCourses } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock, ArrowRight, ArrowLeft, Phone, ExternalLink } from "lucide-react";
import RequestQuoteButton from "@/components/RequestQuoteButton";

export const dynamic = "force-dynamic";

const LEVEL_LABEL: Record<string, string> = {
  PRE_SEA: "Pre-Sea", SHORT_COURSE: "Short Course",
  DEGREE: "Degree Level", POST_COC: "Post-CoC", REFRESHER: "Refresher",
};

const COURSE_IMAGE = "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1200&q=80";

function toLines(text: string): string[] {
  return text.split(/\n|\r/).map((l) => l.trim()).filter(Boolean);
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try DB first
  const dbCourse = await prisma.course.findUnique({
    where: { slug, isActive: true },
    include: {
      modules: { orderBy: { order: "asc" }, select: { title: true } },
      intakeDates: { where: { isOpen: true }, orderBy: { startDate: "asc" }, take: 3 },
    },
  }).catch(() => null);

  // Fall back to static data
  const staticCourse = !dbCourse ? staticCourses.find((c) => c.slug === slug) : null;
  if (!dbCourse && !staticCourse) notFound();

  const title = dbCourse?.title ?? staticCourse!.title;
  const description = dbCourse?.description ?? staticCourse!.description ?? "";
  const stcwRegulation = dbCourse?.stcwRegulation ?? (staticCourse as any)?.stcwRegulation ?? null;
  const levelKey = dbCourse?.level ?? "SHORT_COURSE";
  const levelLabel = LEVEL_LABEL[levelKey] ?? levelKey;
  const durationWeeks = dbCourse?.durationWeeks ?? 4;
  const durationText = durationWeeks >= 52
    ? `${Math.round(durationWeeks / 52)} Year${durationWeeks >= 104 ? "s" : ""}`
    : durationWeeks >= 4 ? `${durationWeeks} Weeks` : `${durationWeeks * 5} Days`;
  const nimasaApproved = dbCourse?.nimasaApproved ?? true;
  const courseId = dbCourse?.id;

  // Registration form routing
  const regFormType = dbCourse?.registrationFormType ?? "MS_FORM";
  const regFormUrl = dbCourse?.registrationFormUrl;
  const isPreSea = regFormType === "GOOGLE_FORM";
  const applyLabel = isPreSea ? "Apply via Google Form" : "Apply via MS Form";
  const applyHref = regFormUrl || "/admissions";

  // Eligibility and outcomes as arrays
  const eligibilityLines: string[] = dbCourse
    ? toLines(dbCourse.eligibility)
    : Array.isArray((staticCourse as any)?.eligibility)
      ? (staticCourse as any).eligibility
      : toLines((staticCourse as any)?.eligibility ?? "");

  const outcomesLines: string[] = dbCourse
    ? toLines(dbCourse.outcomes)
    : Array.isArray((staticCourse as any)?.outcomes)
      ? (staticCourse as any).outcomes
      : toLines((staticCourse as any)?.outcomes ?? "");

  const moduleList: string[] = dbCourse?.modules.length
    ? dbCourse.modules.map((m) => m.title)
    : Array.isArray((staticCourse as any)?.modules)
      ? (staticCourse as any).modules
      : [];

  const imageUrl = (staticCourse as any)?.imageUrl ?? COURSE_IMAGE;

  return (
    <>
      {/* Hero */}
      <div className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Courses
          </Link>
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {levelLabel}{nimasaApproved ? " · NIMASA Approved" : ""}
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 max-w-2xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Clock size={13} /> {durationText}
            </span>
            {stcwRegulation && (
              <span className="inline-flex items-center gap-1 bg-navy text-gold text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30">
                ⚓ {stcwRegulation}
              </span>
            )}
            {isPreSea && (
              <span className="inline-flex items-center gap-1 bg-teal text-white text-xs font-bold px-3 py-1.5 rounded-full">
                📋 Google Form Application
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {regFormUrl ? (
              <a
                href={applyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-yellow-400 transition-colors"
              >
                {applyLabel} <ExternalLink size={14} />
              </a>
            ) : (
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-yellow-400 transition-colors"
              >
                Apply Now <ArrowRight size={16} />
              </Link>
            )}
            <RequestQuoteButton courseTitle={title} courseId={courseId} variant="hero" />
          </div>
        </div>
      </div>
      <div className="divbar" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
              Programme Overview
            </h2>
            <p className="text-muted leading-relaxed">{description}</p>
          </div>

          {/* Registration form info */}
          <div className={`rounded-xl p-4 border flex items-start gap-3 ${isPreSea ? "bg-teal/5 border-teal/20" : "bg-ocean/5 border-ocean/20"}`}>
            <span className="text-2xl shrink-0">{isPreSea ? "📋" : "📝"}</span>
            <div>
              <div className="font-bold text-navy text-sm mb-1">
                {isPreSea ? "Pre-Sea Application — Google Form" : "STCW Application — Microsoft Form"}
              </div>
              <p className="text-muted text-xs leading-relaxed">
                {isPreSea
                  ? "Pre-Sea Cadet applications use our Google Form. Requires WAEC/NECO results, NIN, passport photo, and ML5/ENG1 medical certificate."
                  : "STCW and Value-Added course applications use our Microsoft Form. Requires CoC (if applicable), Seaman's Discharge Book, International Passport, and passport photographs."}
              </p>
              <Link href="/admissions" className="text-ocean text-xs font-semibold hover:underline mt-1 inline-block">
                View full admissions process →
              </Link>
            </div>
          </div>

          {/* Curriculum */}
          {moduleList.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
                Curriculum & Modules
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {moduleList.map((mod, i) => (
                  <div key={mod} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-teal/10 text-teal flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-body">{mod}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility */}
          {eligibilityLines.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
                Eligibility Requirements
              </h2>
              <ul className="space-y-2">
                {eligibilityLines.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle size={14} className="text-jade shrink-0 mt-0.5" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Career outcomes */}
          {outcomesLines.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
                Career Outcomes
              </h2>
              <ul className="space-y-2">
                {outcomesLines.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle size={14} className="text-ocean shrink-0 mt-0.5" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Request a Quote card */}
          <div className="bg-navy rounded-xl p-5 text-white">
            <div className="text-white/45 text-xs uppercase tracking-wider mb-1">{title}</div>
            <div className="font-cinzel text-gold text-xl font-bold mb-1">Fees on Request</div>
            <p className="text-white/55 text-xs mb-4 leading-relaxed">
              Course fees are tailored to your background and intake date. Request a personalised fee schedule with no obligation.
            </p>
            <RequestQuoteButton courseTitle={title} courseId={courseId} variant="sidebar" />
            <a
              href="tel:+2347042806167"
              className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-2.5 rounded-lg hover:bg-white/20 transition-colors text-sm w-full"
            >
              <Phone size={14} /> +234 704 280 6167
            </a>
            <div className="mt-4 bg-white/8 rounded-lg p-3 text-xs text-white/60">
              💡 Flexible payment plans available. No application fee.
            </div>
          </div>

          {/* Intake calendar */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-cinzel text-navy font-bold text-base mb-4">Intake Dates</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted border-b border-border">
                  <th className="text-left pb-2">Milestone</th>
                  <th className="text-left pb-2">Jan</th>
                  <th className="text-left pb-2">Jun</th>
                  <th className="text-left pb-2">Sep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Applications Open", "01 Nov", "01 Apr", "01 Jul"],
                  ["Deadline", "30 Nov", "30 Apr", "31 Jul"],
                  ["Results", "10 Dec", "15 May", "10 Aug"],
                  ["Start", "05 Jan", "07 Jun", "10 Sep"],
                ].map(([label, ...dates]) => (
                  <tr key={label}>
                    <td className="py-2 text-muted">{label}</td>
                    {dates.map((d, i) => (
                      <td key={i} className="py-2 font-medium text-navy">{d}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Apply CTA */}
          {regFormUrl ? (
            <a
              href={regFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors w-full text-sm"
            >
              {applyLabel} <ExternalLink size={14} />
            </a>
          ) : (
            <Link
              href="/admissions"
              className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors w-full text-sm"
            >
              Apply for This Programme <ArrowRight size={14} />
            </Link>
          )}

          {/* Help */}
          <div className="bg-surface border border-border rounded-xl p-4 text-sm">
            <div className="font-bold text-navy mb-1">Need help choosing?</div>
            <p className="text-muted text-xs mb-3">
              Our AI assistant can answer questions about this programme 24/7, or speak to our admissions team.
            </p>
            <div className="text-ocean text-xs font-semibold">+234 704 280 6167</div>
            <div className="text-muted text-xs">sealearn@sealearn.uk</div>
          </div>
        </div>
      </div>
    </>
  );
}
