import { prisma } from "@/lib/prisma";
import { updateApplicationStatus } from "@/actions/site-config";
import { revalidatePath } from "next/cache";
import { FileText, ExternalLink, AlertCircle } from "lucide-react";

async function setReviewNotes(id: string, notes: string, status: string) {
  "use server";
  await prisma.application.update({
    where: { id },
    data: {
      reviewNotes: notes,
      reviewedAt: new Date(),
      status: status as "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WAITLISTED",
    },
  });
  revalidatePath("/admin/applications");
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-surface text-muted border-border",
  SUBMITTED: "bg-ocean/10 text-ocean border-ocean/30",
  UNDER_REVIEW: "bg-amber/10 text-amber border-amber/30",
  ACCEPTED: "bg-jade/10 text-jade border-jade/30",
  REJECTED: "bg-danger/10 text-danger border-danger/30",
  WAITLISTED: "bg-steel/10 text-muted border-steel/30",
};

const DOC_FIELDS = [
  { key: "passportPhotoUrl", label: "Passport Photo" },
  { key: "waecResultUrl", label: "WAEC/NECO Certificate" },
  { key: "ninDocUrl", label: "NIN Document" },
  { key: "medicalCertUrl", label: "Medical Certificate (ML5/ENG1)" },
  { key: "seaServiceUrl", label: "Sea Service Record" },
] as const;

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      course: { select: { title: true, registrationFormType: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "SUBMITTED").length,
    underReview: applications.filter((a) => a.status === "UNDER_REVIEW").length,
    accepted: applications.filter((a) => a.status === "ACCEPTED").length,
    waitlisted: applications.filter((a) => a.status === "WAITLISTED").length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Applications</h1>
        <p className="text-muted text-sm mt-1">{stats.total} total · {stats.submitted} awaiting review · {stats.underReview} under review</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-navy" },
          { label: "Submitted", value: stats.submitted, color: "text-ocean" },
          { label: "Under Review", value: stats.underReview, color: "text-amber" },
          { label: "Accepted", value: stats.accepted, color: "text-jade" },
          { label: "Waitlisted", value: stats.waitlisted, color: "text-muted" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-3 text-center">
            <div className={`font-cinzel text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const docs = DOC_FIELDS.filter((d) => (app as Record<string, unknown>)[d.key]);
          const missingDocs = DOC_FIELDS.filter((d) => !(app as Record<string, unknown>)[d.key]);
          const hasDocs = docs.length > 0;

          return (
            <details key={app.id} className="bg-white rounded-xl border border-border shadow-sm group">
              <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-surface/40 transition-colors rounded-xl list-none">
                {/* Applicant */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy text-sm">{app.user.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status] ?? "bg-surface text-muted border-border"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                    {app.course.registrationFormType === "GOOGLE_FORM" && (
                      <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">PRE-SEA</span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate">{app.user.email} · {app.course.title}</p>
                </div>

                {/* Doc indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted hidden sm:block">
                    {docs.length}/{DOC_FIELDS.length} docs
                  </span>
                  {docs.length < DOC_FIELDS.length && docs.length > 0 && (
                    <AlertCircle size={14} className="text-amber" />
                  )}
                  <span className="text-xs text-muted">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("en-GB") : "—"}
                  </span>
                  <span className="text-muted text-xs group-open:rotate-180 transition-transform">▾</span>
                </div>
              </summary>

              {/* Expanded detail */}
              <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                {/* Documents */}
                <div>
                  <div className="text-xs font-bold text-navy uppercase tracking-wide mb-2">Documents</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {DOC_FIELDS.map((d) => {
                      const url = (app as Record<string, unknown>)[d.key] as string | null;
                      return (
                        <div key={d.key} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${url ? "bg-jade/5 border border-jade/20" : "bg-surface border border-border"}`}>
                          <FileText size={12} className={url ? "text-jade" : "text-muted"} />
                          <span className={url ? "text-navy font-semibold" : "text-muted"}>{d.label}</span>
                          {url ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="ml-auto text-ocean hover:underline flex items-center gap-1">
                              View <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span className="ml-auto text-muted italic">Missing</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review notes */}
                {app.reviewNotes && (
                  <div className="bg-amber/5 border border-amber/20 rounded-lg px-3 py-2 text-xs text-body">
                    <span className="font-bold text-amber">Review Notes: </span>{app.reviewNotes}
                  </div>
                )}

                {/* Contact info */}
                {app.user.phone && (
                  <p className="text-xs text-muted">📞 {app.user.phone}</p>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {app.status !== "UNDER_REVIEW" && app.status !== "ACCEPTED" && app.status !== "REJECTED" && (
                    <form action={updateApplicationStatus.bind(null, app.id, "UNDER_REVIEW")}>
                      <button type="submit" className="text-xs text-amber border border-amber/40 bg-amber/5 px-3 py-1.5 rounded-lg hover:bg-amber/15 transition-colors font-semibold">
                        Mark Under Review
                      </button>
                    </form>
                  )}
                  {app.status !== "ACCEPTED" && (
                    <form action={updateApplicationStatus.bind(null, app.id, "ACCEPTED")}>
                      <button type="submit" className="text-xs text-jade border border-jade/40 bg-jade/5 px-3 py-1.5 rounded-lg hover:bg-jade/15 transition-colors font-bold">
                        ✓ Accept & Enrol
                      </button>
                    </form>
                  )}
                  {app.status !== "WAITLISTED" && app.status !== "ACCEPTED" && (
                    <form action={updateApplicationStatus.bind(null, app.id, "WAITLISTED")}>
                      <button type="submit" className="text-xs text-muted border border-border bg-surface px-3 py-1.5 rounded-lg hover:border-muted transition-colors font-semibold">
                        Add to Waitlist
                      </button>
                    </form>
                  )}
                  {app.status !== "REJECTED" && app.status !== "ACCEPTED" && (
                    <form action={updateApplicationStatus.bind(null, app.id, "REJECTED")}>
                      <button type="submit" className="text-xs text-danger border border-danger/40 bg-danger/5 px-3 py-1.5 rounded-lg hover:bg-danger/15 transition-colors">
                        ✗ Reject
                      </button>
                    </form>
                  )}

                  {/* Request More Info */}
                  {missingDocs.length > 0 && app.status !== "ACCEPTED" && app.status !== "REJECTED" && (
                    <a
                      href={`mailto:${app.user.email}?subject=SeaLearn Application — Additional Documents Required&body=Dear ${app.user.name},%0A%0AThank you for applying to SeaLearn Nigeria.%0A%0AWe require the following additional documents to proceed with your application:%0A${missingDocs.map((d) => "- " + d.label).join("%0A")}%0A%0APlease upload these to your applicant portal or email them to admissions@sealearn.edu.ng.%0A%0AKind regards,%0AAdmissions Team%0ASeaLearn Nigeria`}
                      className="text-xs text-ocean border border-ocean/40 bg-ocean/5 px-3 py-1.5 rounded-lg hover:bg-ocean/15 transition-colors font-semibold flex items-center gap-1"
                    >
                      📧 Request Missing Docs
                    </a>
                  )}
                </div>
              </div>
            </details>
          );
        })}
        {applications.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-muted text-sm">
            No applications yet. Applications will appear here once students submit their forms.
          </div>
        )}
      </div>

      <div className="mt-4 bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-muted">
        <strong className="text-navy">Accepting an application</strong> automatically creates a pending enrolment for the student. They will receive a personalised fee quote by email.
        <br />
        <strong className="text-navy">Missing documents</strong> — use the &ldquo;Request Missing Docs&rdquo; button to auto-generate a pre-filled email to the applicant.
      </div>
    </div>
  );
}
