import Link from "next/link";
import { ArrowRight, CheckCircle, Upload, FileText, User, Mail, Search, ExternalLink } from "lucide-react";

const steps = [
  {
    num: "01", icon: <User size={20} />, title: "Register Free Account",
    detail: "Create your free SeaLearn Nigeria account on the student portal — no application fee, ever.",
    color: "bg-ocean",
  },
  {
    num: "02", icon: <Search size={20} />, title: "Select Your Programme",
    detail: "Browse all 23 NIMASA-approved programmes. Choose your course and preferred intake: January, June, or September.",
    color: "bg-ocean",
  },
  {
    num: "03", icon: <FileText size={20} />, title: "Fill Application Form",
    detail: "Pre-Sea Cadets complete our Google Form. All STCW and Value-Added courses use our Microsoft Form. Both are free to submit.",
    color: "bg-teal",
  },
  {
    num: "04", icon: <Upload size={20} />, title: "Upload Documents",
    detail: "Pre-Sea: WAEC/NECO, NIN, passport photo, ML5/ENG1 medical cert. STCW: CoC (if applicable), Discharge Book, International Passport, 2 passport photos.",
    color: "bg-teal",
  },
  {
    num: "05", icon: <CheckCircle size={20} />, title: "Document Verification",
    detail: "Our admissions team reviews all uploaded documents within 3 working days. You can track status in your portal.",
    color: "bg-amber",
  },
  {
    num: "06", icon: <FileText size={20} />, title: "Receive Offer Letter",
    detail: "If approved, you receive a digital offer letter within 10 working days. Check your email and student portal.",
    color: "bg-gold",
  },
  {
    num: "07", icon: <Mail size={20} />, title: "Receive Personalised Fee Quote",
    detail: "We email your personalised fee schedule. Fees are not published publicly — they are shared privately based on your programme and intake.",
    color: "bg-jade",
  },
  {
    num: "08", icon: <CheckCircle size={20} />, title: "Confirm & Enrol",
    detail: "Accept the fee quote and make payment via Paystack, Flutterwave, USSD or bank transfer. Your LMS access is activated immediately.",
    color: "bg-jade",
  },
];

const preSea = [
  { label: "WAEC/NECO Certificate", detail: "Min 5 credits: English, Maths, Physics (original + scan PDF)" },
  { label: "NIN Document", detail: "National Identification Number slip" },
  { label: "International Passport", detail: "Valid, not expired" },
  { label: "2 Passport Photographs", detail: "Recent, colour, white background (JPG)" },
  { label: "ML5 or ENG1 Medical Certificate", detail: "From a NIMASA-approved medical centre" },
];

const stcwDocs = [
  { label: "Certificate of Competency (CoC)", detail: "Valid — not expired (if applicable to course)" },
  { label: "Seaman's Discharge Book", detail: "Original for verification" },
  { label: "International Passport", detail: "Valid, not expired" },
  { label: "2 Passport Photographs", detail: "Recent, colour, white background" },
];

const intakeCalendar = [
  { milestone: "Applications Open", jan: "01 Nov", jun: "01 Apr", sep: "01 Jul" },
  { milestone: "Application Deadline", jan: "30 Nov", jun: "30 Apr", sep: "31 Jul" },
  { milestone: "Offer Letters Issued", jan: "10 Dec", jun: "15 May", sep: "10 Aug" },
  { milestone: "Commencement", jan: "05 Jan", jun: "07 Jun", sep: "10 Sep" },
];

const paymentMethods = [
  { icon: "💳", label: "Paystack", detail: "Card, bank account, mobile money" },
  { icon: "🌍", label: "Flutterwave", detail: "International cards, GBP/USD accepted" },
  { icon: "#️⃣", label: "USSD", detail: "*737# (GTBank) · *822# (Access Bank)" },
  { icon: "🏦", label: "Bank Transfer", detail: "Auto-generated virtual account number" },
];

export default function AdmissionsPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Admissions
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">How to Apply</h1>
          <p className="text-white/55 text-base max-w-2xl">
            Free to apply. No application fee. Intake dates: January, June &amp; September each year.
            Fees are shared privately after your documents are verified.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors"
            >
              Start Free Application <ArrowRight size={16} />
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

      {/* Registration form info */}
      <div className="bg-teal/5 border-b border-teal/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex items-center gap-3 flex-1 bg-white rounded-xl border border-teal/20 p-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-bold text-navy text-sm">Pre-Sea Programmes</div>
              <div className="text-muted text-xs">Deck Cadet &amp; Engineering Cadet applications use a <strong>Google Form</strong>.</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 bg-white rounded-xl border border-ocean/20 p-3">
            <span className="text-2xl">📝</span>
            <div>
              <div className="font-bold text-navy text-sm">STCW &amp; Value-Added Courses</div>
              <div className="text-muted text-xs">All short courses use a <strong>Microsoft Form</strong>. Links provided after account registration.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8-step process */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-teal/10 text-teal text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Application Process
          </div>
          <h2 className="font-cinzel text-2xl text-navy font-bold">8-Step Admissions Journey</h2>
          <p className="text-muted text-sm mt-2">Free to apply — fees quoted privately after document verification</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-16 right-16 h-0.5 bg-border z-0" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white shadow-md ${s.color}`}>
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
        {/* Documents — Pre-Sea */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-1">Pre-Sea Programme Documents</h2>
            <p className="text-muted text-xs mb-4">Deck Cadet (STCW II/1) &amp; Engineering Cadet (STCW III/1)</p>
            <div className="space-y-3">
              {preSea.map((doc) => (
                <div key={doc.label} className="flex items-start gap-3">
                  <CheckCircle size={14} className="shrink-0 mt-0.5 text-teal" />
                  <div>
                    <span className="font-semibold text-navy text-sm">{doc.label}</span>
                    <div className="text-muted text-xs">{doc.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-cinzel text-navy text-lg font-bold mb-1">STCW &amp; Value-Added Course Documents</h2>
            <p className="text-muted text-xs mb-4">All short courses, advanced STCW, refresher programmes</p>
            <div className="space-y-3">
              {stcwDocs.map((doc) => (
                <div key={doc.label} className="flex items-start gap-3">
                  <CheckCircle size={14} className="shrink-0 mt-0.5 text-ocean" />
                  <div>
                    <span className="font-semibold text-navy text-sm">{doc.label}</span>
                    <div className="text-muted text-xs">{doc.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* No fee callout */}
          <div className="bg-navy rounded-xl p-5 text-white">
            <div className="text-white/45 text-xs uppercase tracking-wider mb-1">Application Policy</div>
            <div className="font-cinzel text-gold text-2xl font-bold mb-2">No Application Fee</div>
            <div className="text-white/60 text-sm mb-4 leading-relaxed">
              SeaLearn Nigeria does not charge an application fee. Submit your documents, receive your offer letter, get a personalised fee quote — all at zero upfront cost.
            </div>
            <a
              href="mailto:admissions@sealearn.edu.ng?subject=Course Fee Enquiry"
              className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
            >
              <Mail size={14} /> Request a Fee Quote by Email
            </a>
            <div className="mt-3 bg-white/8 rounded-lg p-3 text-xs text-white/60">
              💡 Fees vary by programme and intake date. Flexible payment plans available upon enrolment confirmation.
            </div>
          </div>

          {/* Intake calendar */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-cinzel text-navy font-bold text-base mb-4">Intake Calendar 2025–2026</h3>
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

          {/* Payment methods */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-cinzel text-navy font-bold text-base mb-4">Payment Methods (after offer)</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((p) => (
                <div key={p.label} className="bg-surface rounded-lg p-3">
                  <div className="text-xl mb-1">{p.icon}</div>
                  <div className="font-bold text-navy text-xs">{p.label}</div>
                  <div className="text-muted text-[11px]">{p.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-gradient-to-r from-ocean to-teal py-12 px-6 text-center">
        <h2 className="font-cinzel text-2xl text-white font-bold mb-3">
          September 2025 Applications Open
        </h2>
        <p className="text-white/60 mb-6 text-sm">Deadline: 31 July 2025 · Limited places available · No application fee</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-3.5 rounded-full hover:bg-yellow-400 transition-colors"
          >
            Start Free Application <ArrowRight size={16} />
          </Link>
          <a
            href="mailto:admissions@sealearn.edu.ng?subject=Admissions Enquiry"
            className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Mail size={15} /> Email Admissions
          </a>
        </div>
        <p className="text-white/35 text-xs mt-4">
          Questions? Call +234 704 280 6167 or use our AI chatbot (bottom-right)
        </p>
      </section>
    </>
  );
}
