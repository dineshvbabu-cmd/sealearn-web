import { prisma } from "@/lib/prisma";
import { Mail, Phone, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

async function markReplied(id: string) {
  "use server";
  await prisma.priceRequest.update({
    where: { id },
    data: { status: "REPLIED", repliedAt: new Date() },
  });
  revalidatePath("/admin/price-requests");
}

async function markClosed(id: string) {
  "use server";
  await prisma.priceRequest.update({
    where: { id },
    data: { status: "CLOSED" },
  });
  revalidatePath("/admin/price-requests");
}

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-amber/15 text-amber border border-amber/30",
  REPLIED: "bg-jade/15 text-jade border border-jade/30",
  CLOSED: "bg-muted/15 text-muted border border-muted/30",
};

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default async function PriceRequestsPage() {
  const requests = await prisma.priceRequest.findMany({
    include: { course: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const counts = {
    new: requests.filter((r) => r.status === "NEW").length,
    replied: requests.filter((r) => r.status === "REPLIED").length,
    closed: requests.filter((r) => r.status === "CLOSED").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl text-navy font-bold">Price Quote Requests</h1>
        <p className="text-muted text-sm mt-1">Prospective students who requested fee information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "New", count: counts.new, color: "text-amber", bg: "bg-amber/10" },
          { label: "Replied", count: counts.replied, color: "text-jade", bg: "bg-jade/10" },
          { label: "Closed", count: counts.closed, color: "text-muted", bg: "bg-muted/10" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <div className={`font-cinzel text-3xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-muted">
          No price requests yet. They will appear here when prospective students use the Request a Quote form.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-navy text-sm">{r.name}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[r.status]}`}>
                    {r.status}
                  </span>
                  <span className="text-muted text-[11px] flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(r.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted mb-2">
                  <a
                    href={`mailto:${r.email}?subject=SeaLearn Fee Quote${r.course ? ` — ${r.course.title}` : ""}`}
                    className="flex items-center gap-1 text-ocean hover:underline"
                  >
                    <Mail size={12} /> {r.email}
                  </a>
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:underline">
                      <Phone size={12} /> {r.phone}
                    </a>
                  )}
                  {r.course && (
                    <span className="flex items-center gap-1 text-ocean font-medium">
                      📚 {r.course.title}
                    </span>
                  )}
                </div>

                {r.message && (
                  <div className="bg-surface rounded-lg px-3 py-2 text-xs text-body flex gap-2">
                    <MessageSquare size={12} className="shrink-0 mt-0.5 text-muted" />
                    <span>{r.message}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <a
                  href={`mailto:${r.email}?subject=SeaLearn Nigeria — Fee Quote${r.course ? ` for ${r.course.title}` : ""}&body=Dear ${r.name},%0A%0AThank you for your interest in SeaLearn Nigeria.%0A%0APlease find below the fee details for the course you enquired about.%0A%0AKind regards,%0AAdmissions Team%0ASeaLearn Nigeria`}
                  className="flex items-center gap-1.5 bg-ocean text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-navy transition-colors whitespace-nowrap"
                >
                  <Mail size={12} /> Reply by Email
                </a>
                {r.status === "NEW" && (
                  <form action={markReplied.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-jade/15 text-jade text-xs font-bold px-3 py-1.5 rounded-full hover:bg-jade hover:text-white transition-colors whitespace-nowrap w-full"
                    >
                      <CheckCircle size={12} /> Mark Replied
                    </button>
                  </form>
                )}
                {r.status !== "CLOSED" && (
                  <form action={markClosed.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-muted/10 text-muted text-xs font-bold px-3 py-1.5 rounded-full hover:bg-muted hover:text-white transition-colors whitespace-nowrap w-full"
                    >
                      <XCircle size={12} /> Close
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
