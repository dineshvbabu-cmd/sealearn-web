import { prisma } from "@/lib/prisma";

const statusColors: Record<string, string> = {
  SUCCESS: "bg-jade/10 text-jade",
  PENDING: "bg-amber/10 text-amber",
  FAILED: "bg-danger/10 text-danger",
  REFUNDED: "bg-steel/10 text-muted",
};

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      enrolment: { include: { course: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSuccess = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amountNaira, 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Payments</h1>
        <p className="text-muted text-sm mt-1">{payments.length} payment record{payments.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <p className="text-xs text-muted uppercase font-bold tracking-wide mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-jade">₦{totalSuccess.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <p className="text-xs text-muted uppercase font-bold tracking-wide mb-1">Transactions</p>
          <p className="text-2xl font-bold text-navy">{payments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <p className="text-xs text-muted uppercase font-bold tracking-wide mb-1">Successful</p>
          <p className="text-2xl font-bold text-ocean">{payments.filter((p) => p.status === "SUCCESS").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Course</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Method</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy">{p.user.name}</p>
                    <p className="text-xs text-muted">{p.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs max-w-[200px] truncate">
                    {p.enrolment?.course.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ocean text-sm">
                    ₦{p.amountNaira.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{p.method.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[p.status] ?? "bg-surface text-muted"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-GB") : new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">No payment records yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
