import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Mail, Download } from "lucide-react";

export default async function SubscribersPage() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/auth/login");

  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Newsletter Subscribers</h1>
          <p className="text-muted text-sm mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,Email,Subscribed\n${subscribers.map((s) => `${s.email},${s.createdAt.toISOString()}`).join("\n")}`}
          download="subscribers.csv"
          className="inline-flex items-center gap-2 bg-ocean text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-ocean/90 transition-colors"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-10 text-center">
          <Mail size={36} className="text-muted mx-auto mb-3" />
          <p className="text-muted text-sm">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-navy uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-navy uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-navy uppercase tracking-wide">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s, i) => (
                <tr key={s.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3 text-muted text-xs">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-navy">{s.email}</td>
                  <td className="px-5 py-3 text-muted text-xs">
                    {s.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
