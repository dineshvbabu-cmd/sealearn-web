import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckCircle, AlertCircle, FileText, User, BookOpen, Send } from "lucide-react";
import { submitApplication } from "@/actions/apply";
import SubmitButton from "./SubmitButton";

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs font-semibold text-navy text-right max-w-[55%] truncate">
        {value ?? <span className="text-muted/60 italic">Not provided</span>}
      </span>
    </div>
  );
}

function DocRow({ label, url }: { label: string; url: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      {url ? (
        <span className="text-xs font-semibold text-jade flex items-center gap-1">
          <CheckCircle size={11} /> Uploaded
        </span>
      ) : (
        <span className="text-xs text-danger flex items-center gap-1">
          <AlertCircle size={11} /> Missing
        </span>
      )}
    </div>
  );
}

export default async function ReviewPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const userId = session.user.id as string;

  const app = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
    include: {
      course: { select: { title: true, stcwRegulation: true, feeNaira: true, durationWeeks: true } },
      intakeDate: { select: { startDate: true, endDate: true } },
    },
  });

  if (!app) redirect("/apply/programme");

  // Check if minimum docs are uploaded
  const docsComplete = !!(app.passportPhotoUrl && app.waecResultUrl && app.ninDocUrl && app.medicalCertUrl);

  function fmt(d: Date | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-8 pt-7 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Send size={18} className="text-ocean" />
          <h1 className="font-cinzel text-navy text-xl font-bold">Review & Submit</h1>
        </div>
        <p className="text-muted text-sm">
          Step 5 of 5 — Confirm your application before submitting to the admissions team.
        </p>
      </div>

      <div className="px-8 py-6 space-y-5">
        {!docsComplete && (
          <div className="bg-amber/5 border border-amber/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber text-sm">Missing required documents</div>
              <div className="text-muted text-xs mt-0.5">
                Please go back and upload all required documents before submitting.
              </div>
              <a href="/apply/documents" className="text-xs text-ocean font-semibold hover:underline mt-1 inline-block">
                ← Go back to Upload Documents
              </a>
            </div>
          </div>
        )}

        {/* Programme */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-surface/50 border-b border-border flex items-center gap-2">
            <BookOpen size={14} className="text-ocean" />
            <span className="text-xs font-bold text-navy uppercase tracking-wide">Programme</span>
          </div>
          <div className="px-4 py-1">
            <Row label="Course" value={app.course.title} />
            {app.course.stcwRegulation && (
              <Row label="STCW" value={`Reg. ${app.course.stcwRegulation}`} />
            )}
            <Row label="Duration" value={`${app.course.durationWeeks} weeks`} />
            <Row label="Programme Fee" value={`₦${app.course.feeNaira.toLocaleString()}`} />
            {app.intakeDate && (
              <Row
                label="Preferred Intake"
                value={`${fmt(app.intakeDate.startDate)} – ${fmt(app.intakeDate.endDate)}`}
              />
            )}
          </div>
        </div>

        {/* Personal details */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-surface/50 border-b border-border flex items-center gap-2">
            <User size={14} className="text-ocean" />
            <span className="text-xs font-bold text-navy uppercase tracking-wide">Personal Details</span>
          </div>
          <div className="px-4 py-1">
            <Row label="Applicant" value={session.user.name} />
            <Row label="Email" value={session.user.email} />
            <Row label="Date of Birth" value={fmt(app.dateOfBirth ?? null)} />
            <Row label="Gender" value={app.gender} />
            <Row label="State of Origin" value={app.stateOfOrigin} />
            <Row label="LGA" value={app.lga} />
            <Row label="Address" value={app.address} />
          </div>
        </div>

        {/* Next of kin */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-surface/50 border-b border-border">
            <span className="text-xs font-bold text-navy uppercase tracking-wide">Next of Kin</span>
          </div>
          <div className="px-4 py-1">
            <Row label="Name" value={app.nokName} />
            <Row label="Relationship" value={app.nokRelationship} />
            <Row label="Phone" value={app.nokPhone} />
          </div>
        </div>

        {/* Documents */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-surface/50 border-b border-border flex items-center gap-2">
            <FileText size={14} className="text-ocean" />
            <span className="text-xs font-bold text-navy uppercase tracking-wide">Documents</span>
          </div>
          <div className="px-4 py-1">
            <DocRow label="Passport Photograph" url={app.passportPhotoUrl} />
            <DocRow label="WAEC / NECO Result" url={app.waecResultUrl} />
            <DocRow label="NIN Slip" url={app.ninDocUrl} />
            <DocRow label="Medical Certificate" url={app.medicalCertUrl} />
            <DocRow label="Sea Service Letter" url={app.seaServiceUrl} />
          </div>
        </div>

        {/* Declaration */}
        <div className="bg-navy/5 border border-navy/15 rounded-xl p-4 text-xs text-muted leading-relaxed">
          By submitting this application, I confirm that all information provided is true and accurate.
          I understand that providing false information may result in my application being rejected or
          my enrolment being cancelled. I consent to SeaLearn Nigeria processing my personal data in
          accordance with the Nigeria Data Protection Regulation (NDPR).
        </div>

        {/* Submit button */}
        <form action={submitApplication}>
          <SubmitButton disabled={!docsComplete} />
        </form>

        <div className="text-center text-xs text-muted">
          Need to make changes?{" "}
          <a href="/apply/personal" className="text-ocean hover:underline">Edit personal details</a>
          {" · "}
          <a href="/apply/documents" className="text-ocean hover:underline">Re-upload documents</a>
        </div>
      </div>
    </div>
  );
}
