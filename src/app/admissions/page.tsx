import Link from "next/link";
import { ArrowRight, CheckCircle, Upload, CreditCard, FileText, User } from "lucide-react";

const steps = [
  { num: "01", icon: <User size={20} />, title: "Register Account", detail: "Create your free SeaLearn account at sealearn.edu.ng" },
  { num: "02", icon: <FileText size={20} />, title: "Select Programme", detail: "Choose your course and preferred intake month (Jan, Jun, Sep)" },
  { num: "03", icon: <FileText size={20} />, title: "Fill Application", detail: "Complete the online form: personal details, academic history, sea service" },
  { num: "04", icon: <Upload size={20} />, title: "Upload Documents", detail: "WAEC/NECO results, NIN, passport photo, ML5/ENG1 medical certificate" },
  { num: "05", icon: <CreditCard size={20} />, title: "Pay Application Fee", detail: "₦15,000 via Paystack, Flutterwave, USSD *737# or bank transfer" },
  { num: "06", icon: <CheckCircle size={20} />, title: "Track Status", detail: "Monitor your application in real-time via the student portal" },
  { num: "07", icon: <FileText size={20} />, title: "Receive Offer Letter", detail: "Accepted applicants receive a digital offer letter within 10 working days" },
  { num: "08", icon: <CreditCard size={20} />, title: "Pay Tuition & Enrol", detail: "Confirm enrolment and pay first tuition instalment to activate your LMS access" },
];

const requiredDocs = [
  { label: "WAEC/NECO Results", detail: "Original + scan (PDF, max 5MB)", required: true },
  { label: "NIN Document", detail: "National Identification Number slip", required: true },
  { label: "Passport Photo", detail: "Recent colour photo, white background (JPG)", required: true },
  { label: "Medical Certificate", detail: "ENG1 or ML5 from NIMASA-approved centre", required: true },
  { label: "Birth Certificate", detail: "Or sworn affidavit", required: true },
  { label: "Sea Service Record", detail: "COE letters (CoC programmes only)", required: false },
];

const intakeCalendar = [
  { milestone: "Applications Open", jan: "01 Nov", jun: "01 Apr", sep: "01 Jul" },
  { milestone: "Application Deadline", jan: "30 Nov", jun: "30 Apr", sep: "31 Jul" },
  { milestone: "Results Published", jan: "10 Dec", jun: "15 May", sep: "10 Aug" },
  { milestone: "Commencement", jan: "05 Jan", jun: "07 Jun", sep: "10 Sep" },
];

const paymentMethods = [
  { icon: "💳", label: "Paystack", detail: "Card, bank account, mobile money" },
  { icon: "📱", label: "Flutterwave", detail: "International cards, GBP/USD" },
  { icon: "#️⃣", label: "USSD", detail: "*737# (GTBank) or *822# (Access)" },
  { icon: "🏦", label: "Bank Transfer", detail: "Auto-generated virtual account" },
];

export default function AdmissionsPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Module 04 · Admissions Portal
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">Admissions Portal</h1>
          <p className="text-white/55 text-base max-w-2xl">
            Online application, document upload, medical fitness, payment and real-time status
            tracking. Intakes: January, June & September.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors"
            >
              Start Your Application <ArrowRight size={16} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Browse Programmes
            </Link>
          </div>
        </div>
      </div>
      <div className="divbar" />

      {/* 8-step process */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-teal/10 text-teal text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Application Process
          </div>
          <h2 className="font-cinzel text-2xl text-navy font-bold">8-Step Admissions Journey</h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-8 left-16 right-16 h-0.5 bg-border z-0" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
            {steps.map((s, i) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white shadow-md ${
                    i < 2 ? "bg-ocean" : i < 4 ? "bg-teal" : i < 6 ? "bg-amber" : i === 6 ? "bg-gold" : "bg-jade"
                  }`}
                >
                  {s.icon}
                </div>
                <div className="text-[10px] text-muted uppercase tracking-widest mb-0.5">{s.num}</div>
                <div className="font-bold text-navy text-xs leading-tight mb-1">{s.title}</div>
                <div className="text-muted text-[11px] leading-relaxed">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-14 grid lg:grid-cols-2 gap-8">
        {/* Application form preview */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-cinzel text-navy text-lg font-bold mb-4 pb-3 border-b border-border">
            Application Form Fields
          </h2>
          <div className="space-y-4">
            {[
              { section: "Personal Details", fields: "Full name (as on NIN), Date of birth, Gender, NIN number, Passport photo upload" },
              { section: "Contact Information", fields: "Mobile (+234), Email, State of origin, LGA, Residential address" },
              { section: "Academic History", fields: "WAEC/NECO results with grades; certificate PDF upload (max 5MB)" },
              { section: "Programme Selection", fields: "Course (pre-filled from catalogue), Intake month, Mode (full-time/part-time)" },
              { section: "Sea Service Record", fields: "Employer, vessel name, rank, dates, COE upload (required for CoC programmes)" },
              { section: "Medical Fitness", fields: "ENG1 or ML5 certificate upload; NIMASA-approved medical centre" },
              { section: "Next of Kin", fields: "Name, relationship, phone number, address" },
              { section: "Declaration", fields: "Digital acknowledgement and typed name as e-signature" },
            ].map((row) => (
              <div key={row.section} className="grid sm:grid-cols-2 gap-1 text-sm border-b border-border/50 pb-3">
                <div className="font-semibold text-navy text-xs uppercase tracking-wide">{row.section}</div>
                <div className="text-muted text-xs leading-relaxed">{row.fields}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {/* Required documents */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-4 pb-3 border-b border-border">
              Required Documents
            </h2>
            <div className="space-y-2.5">
              {requiredDocs.map((doc) => (
                <div key={doc.label} className="flex items-start gap-3">
                  <CheckCircle
                    size={14}
                    className={`shrink-0 mt-0.5 ${doc.required ? "text-jade" : "text-muted"}`}
                  />
                  <div>
                    <span className="font-semibold text-navy text-sm">
                      {doc.label}
                      {!doc.required && (
                        <span className="ml-1 text-muted font-normal text-xs">(if applicable)</span>
                      )}
                    </span>
                    <div className="text-muted text-xs">{doc.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee card */}
          <div className="bg-navy rounded-xl p-5 text-white">
            <div className="text-white/45 text-xs uppercase tracking-wider mb-1">Application Fee</div>
            <div className="font-cinzel text-gold text-3xl font-bold mb-3">₦15,000</div>
            <div className="text-white/50 text-xs mb-4">One-time, non-refundable · Required to submit application</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {paymentMethods.map((m) => (
                <div key={m.label} className="bg-white/8 rounded-lg p-3">
                  <div className="text-lg mb-1">{m.icon}</div>
                  <div className="font-bold text-xs">{m.label}</div>
                  <div className="text-white/40 text-[10px]">{m.detail}</div>
                </div>
              ))}
            </div>
            <div className="bg-white/8 rounded-lg p-3 text-xs text-white/60">
              💡 Tuition instalment: 50% on enrolment · 50% after Month 3
            </div>
          </div>

          {/* Intake calendar */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-cinzel text-navy font-bold text-base mb-4">Intake Calendar 2025</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-navy text-white rounded-lg overflow-hidden">
                    <th className="text-left px-3 py-2 rounded-tl-lg">Milestone</th>
                    <th className="text-left px-3 py-2">January</th>
                    <th className="text-left px-3 py-2">June</th>
                    <th className="text-left px-3 py-2 rounded-tr-lg">September</th>
                  </tr>
                </thead>
                <tbody>
                  {intakeCalendar.map((row) => (
                    <tr key={row.milestone} className="border-b border-border">
                      <td className="px-3 py-2 text-muted">{row.milestone}</td>
                      <td className="px-3 py-2 font-semibold text-navy">{row.jan}</td>
                      <td className="px-3 py-2 font-semibold text-navy">{row.jun}</td>
                      <td className="px-3 py-2 font-semibold text-navy">{row.sep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-gradient-to-r from-ocean to-teal py-12 px-6 text-center">
        <h2 className="font-cinzel text-2xl text-white font-bold mb-3">
          June 2025 Applications Now Open
        </h2>
        <p className="text-white/60 mb-6 text-sm">Deadline: 30 April 2025 · Limited places available</p>
        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-3.5 rounded-full hover:bg-yellow-400 transition-colors"
        >
          Start Your Application Now <ArrowRight size={16} />
        </Link>
        <p className="text-white/35 text-xs mt-4">
          Questions? Call +234 701 234 5678 or chat with our AI assistant
        </p>
      </section>
    </>
  );
}
