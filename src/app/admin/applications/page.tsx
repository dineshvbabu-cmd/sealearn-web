import { prisma } from "@/lib/prisma";

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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy">{app.user.name}</p>
                    <p className="text-xs text-muted">{app.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs max-w-[220px] truncate">{app.course.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[app.status] ?? "bg-surface text-muted"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("en-GB") : "—"}
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
    </>
  );
}
