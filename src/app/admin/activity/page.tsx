import { prisma } from "@/lib/prisma";
import { Activity, User, FileEdit, ClipboardList, BookOpen, DollarSign, GraduationCap } from "lucide-react";

const actionIcons: Record<string, React.ElementType> = {
  UPDATED_CMS: FileEdit,
  APPROVED_APPLICATION: GraduationCap,
  REJECTED_APPLICATION: GraduationCap,
  ENROLLED_STUDENT: ClipboardList,
  UPDATED_COURSE: BookOpen,
  PAYMENT_RECORDED: DollarSign,
  UPDATED_USER: User,
};

const actionColors: Record<string, string> = {
  UPDATED_CMS: "bg-ocean/10 text-ocean",
  APPROVED_APPLICATION: "bg-jade/10 text-jade",
  REJECTED_APPLICATION: "bg-danger/10 text-danger",
  ENROLLED_STUDENT: "bg-teal/10 text-teal",
  UPDATED_COURSE: "bg-gold/10 text-amber",
  PAYMENT_RECORDED: "bg-jade/10 text-jade",
  UPDATED_USER: "bg-ocean/10 text-ocean",
};

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export default async function ActivityLogPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Group by date
  const grouped: Record<string, typeof logs> = {};
  for (const log of logs) {
    const day = log.createdAt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(log);
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Activity size={22} className="text-navy" />
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Activity Log</h1>
          <p className="text-muted text-sm mt-0.5">Audit trail of all admin actions — {logs.length} entries</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-border shadow-sm p-12 text-center">
          <Activity size={36} className="text-muted mx-auto mb-3 opacity-30" />
          <p className="text-muted text-sm">No activity recorded yet.</p>
          <p className="text-muted/60 text-xs mt-1">Actions taken in the admin panel will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, entries]) => (
            <div key={day}>
              <div className="text-xs font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                {day}
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="bg-white rounded-xl border border-border shadow-sm divide-y divide-border">
                {entries.map((log) => {
                  const Icon = actionIcons[log.action] ?? Activity;
                  const colorClass = actionColors[log.action] ?? "bg-surface text-muted";
                  return (
                    <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-surface/50 transition-colors">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-semibold text-navy text-sm">
                            {log.actorName ?? "System"}
                          </span>
                          {log.actorRole && (
                            <span className="text-[10px] font-bold uppercase text-muted/60 bg-surface px-1.5 py-0.5 rounded">
                              {log.actorRole.replace("_", " ")}
                            </span>
                          )}
                          <span className="text-xs text-muted">
                            {log.action.replace(/_/g, " ").toLowerCase()}
                          </span>
                          {log.entityLabel && (
                            <span className="text-xs text-navy font-medium">"{log.entityLabel}"</span>
                          )}
                        </div>
                        {log.detail && (
                          <p className="text-xs text-muted mt-0.5 truncate max-w-xl">{log.detail}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted/60 shrink-0 tabular-nums">
                        {timeAgo(log.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
