import { prisma } from "@/lib/prisma";
import { updateEnrolmentStatus, deleteEnrolment } from "@/actions/enrollments";
import Link from "next/link";
import { UserPlus } from "lucide-react";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-jade/10 text-jade",
  COMPLETED: "bg-ocean/10 text-ocean",
  PENDING_PAYMENT: "bg-amber/10 text-amber",
  SUSPENDED: "bg-danger/10 text-danger",
  WITHDRAWN: "bg-steel/10 text-muted",
};

export default async function AdminEnrolmentsPage() {
  const enrolments = await prisma.enrolment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Enrolments</h1>
          <p className="text-muted text-sm mt-1">{enrolments.length} enrolment{enrolments.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/enrolments/new"
          className="inline-flex items-center gap-2 bg-teal text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-teal/90 transition-colors"
        >
          <UserPlus size={14} /> Enrol Student
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Fee</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Paid</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrolments.map((e) => {
                const activateAction = updateEnrolmentStatus.bind(null, e.id, "ACTIVE");
                const suspendAction = updateEnrolmentStatus.bind(null, e.id, "SUSPENDED");
                const deleteAction = deleteEnrolment.bind(null, e.id);
                return (
                <tr key={e.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy">{e.user.name}</p>
                    <p className="text-xs text-muted">{e.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs max-w-[200px] truncate">{e.course.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[e.status] ?? "bg-surface text-muted"}`}>
                      {e.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted">₦{e.totalFee.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs font-semibold text-jade">₦{e.amountPaid.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {e.status !== "ACTIVE" && (
                        <form action={activateAction}>
                          <button type="submit" className="text-xs text-jade border border-jade/30 px-2.5 py-1 rounded-lg hover:bg-jade/10 transition-colors">
                            Activate
                          </button>
                        </form>
                      )}
                      {e.status === "ACTIVE" && (
                        <form action={suspendAction}>
                          <button type="submit" className="text-xs text-amber border border-amber/30 px-2.5 py-1 rounded-lg hover:bg-amber/10 transition-colors">
                            Suspend
                          </button>
                        </form>
                      )}
                      <form action={deleteAction}>
                        <button type="submit" className="text-xs text-danger border border-danger/30 px-2.5 py-1 rounded-lg hover:bg-danger/10 transition-colors">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          {enrolments.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">
              No enrolments yet.{" "}
              <Link href="/admin/enrolments/new" className="text-ocean underline">Enrol a student</Link> to get started.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
