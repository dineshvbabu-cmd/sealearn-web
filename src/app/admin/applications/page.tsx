import { prisma } from "@/lib/prisma";
import { updateApplicationStatus } from "@/actions/site-config";

const statusColors: Record<string, string> = {
  DRAFT: "bg-surface text-muted",
  SUBMITTED: "bg-ocean/10 text-ocean",
  UNDER_REVIEW: "bg-amber/10 text-amber",
  ACCEPTED: "bg-jade/10 text-jade",
  REJECTED: "bg-danger/10 text-danger",
  WAITLISTED: "bg-steel/10 text-muted",
};

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Applications</h1>
        <p className="text-muted text-sm mt-1">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Applicant</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Submitted</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy">{app.user.name}</p>
                    <p className="text-xs text-muted">{app.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs max-w-[200px] truncate">{app.course.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[app.status] ?? "bg-surface text-muted"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {app.status !== "UNDER_REVIEW" && app.status !== "ACCEPTED" && app.status !== "REJECTED" && (
                        <form action={async () => {
                          "use server";
                          await updateApplicationStatus(app.id, "UNDER_REVIEW");
                        }}>
                          <button type="submit" className="text-xs text-amber border border-amber/30 px-2.5 py-1 rounded-lg hover:bg-amber/10 transition-colors">
                            Review
                          </button>
                        </form>
                      )}
                      {app.status !== "ACCEPTED" && (
                        <form action={async () => {
                          "use server";
                          await updateApplicationStatus(app.id, "ACCEPTED");
                        }}>
                          <button type="submit" className="text-xs text-jade border border-jade/30 px-2.5 py-1 rounded-lg hover:bg-jade/10 transition-colors font-bold">
                            ✓ Accept
                          </button>
                        </form>
                      )}
                      {app.status !== "REJECTED" && app.status !== "ACCEPTED" && (
                        <form action={async () => {
                          "use server";
                          await updateApplicationStatus(app.id, "REJECTED");
                        }}>
                          <button type="submit" className="text-xs text-danger border border-danger/30 px-2.5 py-1 rounded-lg hover:bg-danger/10 transition-colors">
                            Reject
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">No applications yet.</div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-muted">
        <strong className="text-navy">Accepting an application</strong> automatically creates a pending enrolment for the student. They will then need to complete payment to activate their course access.
      </div>
    </>
  );
}
