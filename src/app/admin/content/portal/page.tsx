import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PortalCMSPage() {
  const cfg = await getSiteSection("portal");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("portal", fd);
    redirect("/admin/content/portal?saved=1");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Student Portal Content</h1>
          <p className="text-muted text-sm mt-0.5">Timetable, semester dates, payment details, and portal notices</p>
        </div>
      </div>

      <form action={action} className="space-y-5 max-w-2xl">

        {/* Academic Calendar */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Academic Calendar</h2>
          <F name="semester" label="Current Semester" defaultValue={cfg.semester} placeholder="e.g. 2025/2026 Second Semester" />
          <div className="grid sm:grid-cols-2 gap-4">
            <F name="semester_start" label="Semester Start" defaultValue={cfg.semester_start} placeholder="e.g. January 2026" />
            <F name="semester_end" label="Semester End" defaultValue={cfg.semester_end} placeholder="e.g. June 2026" />
          </div>
          <F name="next_exam_date" label="Next Examination Date" defaultValue={cfg.next_exam_date} placeholder="e.g. 15 March 2026" />
          <F name="exam_venue" label="Examination Venue" defaultValue={cfg.exam_venue} placeholder="e.g. SeaLearn Nigeria, Apapa Campus" />
          <TA name="timetable_notice" label="Timetable Notice (shown on Timetable page)" defaultValue={cfg.timetable_notice} rows={3} />
        </div>

        {/* Portal Welcome */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Portal Messages</h2>
          <F name="welcome_message" label="Dashboard Welcome Message" defaultValue={cfg.welcome_message} />
          <TA name="course_content_notice" label="Course Content Notice" defaultValue={cfg.course_content_notice} rows={2} />
          <TA name="library_notice" label="Library Notice" defaultValue={cfg.library_notice} rows={2} />
        </div>

        {/* LMS Integration note */}
        <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
          <p className="text-xs text-teal font-semibold mb-1">LMS Links are managed per-enrolment</p>
          <p className="text-xs text-muted">
            Each enrolled student&apos;s LMS access URL is set individually via{" "}
            <a href="/admin/lms" className="text-ocean hover:underline font-semibold">Admin → LMS Links</a>.
            No global LMS URL is used.
          </p>
        </div>

        {/* Support Contact */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Student Support Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <F name="support_email" label="Support Email" defaultValue={cfg.support_email} placeholder="support@sealearn.edu.ng" />
            <F name="support_phone" label="Support Phone" defaultValue={cfg.support_phone} placeholder="+234 701 234 5678" />
          </div>
        </div>

        {/* Payment / Bank Details */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Bank Transfer Payment Details</h2>
          <p className="text-xs text-muted">Shown to students on the Fees &amp; Payments page for manual bank transfers.</p>
          <F name="payment_bank" label="Bank Name" defaultValue={cfg.payment_bank} placeholder="e.g. First Bank of Nigeria" />
          <F name="payment_account_name" label="Account Name" defaultValue={cfg.payment_account_name} placeholder="SeaLearn Nigeria Limited" />
          <div className="grid sm:grid-cols-2 gap-4">
            <F name="payment_account_number" label="Account Number" defaultValue={cfg.payment_account_number} placeholder="2034567890" />
            <F name="payment_sort_code" label="Sort Code" defaultValue={cfg.payment_sort_code} placeholder="011151003" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm">Save Changes</button>
          <Link href="/admin/content" className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface text-sm">Cancel</Link>
        </div>
      </form>
    </>
  );
}

function F({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal"
      />
    </div>
  );
}

function TA({ name, label, defaultValue, rows = 3 }: { name: string; label: string; defaultValue?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal resize-y"
      />
    </div>
  );
}
