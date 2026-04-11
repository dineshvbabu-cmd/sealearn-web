import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { CheckCircle, Clock, ArrowRight, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const feeBreakdown =
    course.feeNaira === 480000
      ? [
          { label: "Tuition Fee", amount: "₦320,000" },
          { label: "Simulation Lab", amount: "₦80,000" },
          { label: "Materials & Uniform Kit", amount: "₦45,000" },
          { label: "NIMASA Certification Fee", amount: "₦20,000" },
          { label: "Application Fee (one-time)", amount: "₦15,000", muted: true },
        ]
      : [
          { label: "Programme Fee", amount: course.feeText },
          { label: "Application Fee (one-time)", amount: "₦15,000", muted: true },
        ];

  return (
    <>
      {/* Hero */}
      <div className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={course.imageUrl}
            alt={course.title}
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
            {course.levelLabel} · NIMASA Approved
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 max-w-2xl">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Clock size={13} /> {course.durationText}
            </span>
            <span className="inline-flex items-center gap-1 bg-navy text-gold text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30">
              ⚓ {course.stcwRegulation}
            </span>
            <span className="text-2xl font-cinzel font-bold text-gold">{course.feeText}</span>
          </div>
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-yellow-400 transition-colors"
          >
            Apply Now — ₦15,000 Application Fee <ArrowRight size={16} />
          </Link>
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
            <p className="text-muted leading-relaxed">{course.description}</p>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
              Curriculum & Modules
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {course.modules.map((mod, i) => (
                <div key={mod} className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-teal/10 text-teal flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-body">{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
              Eligibility Requirements
            </h2>
            <ul className="space-y-2">
              {course.eligibility.map((e) => (
                <li key={e} className="flex items-start gap-2 text-sm text-muted">
                  <CheckCircle size={14} className="text-jade shrink-0 mt-0.5" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* Career outcomes */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-3 pb-3 border-b border-border">
              Career Outcomes
            </h2>
            <ul className="space-y-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-muted">
                  <CheckCircle size={14} className="text-ocean shrink-0 mt-0.5" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Fee breakdown */}
          <div className="bg-navy rounded-xl p-5 text-white">
            <div className="text-white/45 text-xs uppercase tracking-wider mb-1">{course.title}</div>
            <div className="font-cinzel text-gold text-3xl font-bold mb-4">{course.feeText}</div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              {feeBreakdown.map((item) => (
                <div
                  key={item.label}
                  className={`flex justify-between text-sm ${item.muted ? "opacity-45" : ""}`}
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white/8 rounded-lg p-3 text-xs text-white/60">
              💡 Instalment: 50% on enrolment · 50% after Month 3
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
          <Link
            href="/admissions"
            className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors w-full text-sm"
          >
            Apply for This Programme <ArrowRight size={14} />
          </Link>

          {/* Help */}
          <div className="bg-surface border border-border rounded-xl p-4 text-sm">
            <div className="font-bold text-navy mb-1">Need help choosing?</div>
            <p className="text-muted text-xs mb-3">
              Our AI assistant can answer questions about this programme 24/7, or speak to our
              admissions team.
            </p>
            <div className="text-ocean text-xs font-semibold">+234 701 234 5678</div>
            <div className="text-muted text-xs">info@sealearn.edu.ng</div>
          </div>
        </div>
      </div>
    </>
  );
}
