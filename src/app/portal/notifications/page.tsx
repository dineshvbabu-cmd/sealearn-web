import { Bell, CheckCircle, AlertCircle, Info, BookOpen, CreditCard, Calendar } from "lucide-react";

const notifications = [
  {
    id: 1, type: "exam", icon: "📋", title: "Exam Schedule Released — BST Module",
    message: "Your Basic Safety Training written exam has been scheduled for Friday 18 April 2026 at 09:00 in Hall A. Duration: 2 hours. Please bring your student ID.",
    time: "2 hours ago", date: "11 Apr 2026", read: false,
  },
  {
    id: 2, type: "simulator", icon: "🛳️", title: "Simulator Booking Confirmed — Week 14",
    message: "Your bridge simulator session has been confirmed: Tuesday 15 April 2026, 08:00–11:00, Sim Lab 1. Scenario: Port Approach — Lagos Harbour. Instructor: Capt. Balogun.",
    time: "5 hours ago", date: "11 Apr 2026", read: false,
  },
  {
    id: 3, type: "fee", icon: "💳", title: "Fee Instalment Due in 7 Days",
    message: "Your Semester 2 tuition payment of ₦240,000 is due on 18 April 2026. Please ensure payment is made before the due date to avoid suspension of your enrolment.",
    time: "1 day ago", date: "10 Apr 2026", read: false,
  },
  {
    id: 4, type: "success", icon: "✅", title: "Module 2: Radar & ARPA — Completed",
    message: "Congratulations! You have successfully completed Module 2: Radar Navigation & ARPA with a score of 90% (Grade A). Module 3: Meteorology is now unlocked.",
    time: "2 days ago", date: "09 Apr 2026", read: true,
  },
  {
    id: 5, type: "info", icon: "📢", title: "New Library Resource Added",
    message: "IMO Model Course 7.03 — Officer in Charge of a Navigation Watch has been added to the library. This is required reading for your OOW certification.",
    time: "3 days ago", date: "08 Apr 2026", read: true,
  },
  {
    id: 6, type: "success", icon: "🎓", title: "BST Certificate Issued",
    message: "Your Basic Safety Training certificate has been issued. NIMASA Number: NIM/BST/2026/04521. Valid until 14 March 2031. Download available in My Certificates.",
    time: "4 weeks ago", date: "15 Mar 2026", read: true,
  },
  {
    id: 7, type: "info", icon: "📅", title: "Week 14 Timetable Published",
    message: "Your timetable for the week of 14–18 April 2026 has been published. You have 5 scheduled sessions including 2 simulator sessions. Check your timetable for details.",
    time: "5 days ago", date: "06 Apr 2026", read: true,
  },
  {
    id: 8, type: "info", icon: "👩‍🏫", title: "Instructor Message — Capt. Adeyemi",
    message: "Please ensure you have completed the pre-reading for this week's Celestial Navigation lecture: Admiralty Manual of Navigation Vol. 1, Chapters 4–6. Available in the library.",
    time: "6 days ago", date: "05 Apr 2026", read: true,
  },
];

const typeConfig: Record<string, { bg: string; border: string }> = {
  exam: { bg: "bg-ocean/5", border: "border-l-ocean" },
  simulator: { bg: "bg-jade/5", border: "border-l-jade" },
  fee: { bg: "bg-amber/5", border: "border-l-amber" },
  success: { bg: "bg-jade/5", border: "border-l-jade" },
  info: { bg: "bg-surface", border: "border-l-border" },
};

const unreadCount = notifications.filter((n) => !n.read).length;

export default function NotificationsPage() {
  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Notifications</h1>
          <p className="text-muted text-sm mt-1">
            {unreadCount > 0 ? (
              <span><strong className="text-navy">{unreadCount} unread</strong> · {notifications.length} total</span>
            ) : (
              `${notifications.length} notifications`
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="text-xs text-ocean font-bold hover:underline">Mark all as read</button>
        )}
      </div>

      {/* Unread section */}
      {unreadCount > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-3">New</h2>
          <div className="space-y-2">
            {notifications.filter((n) => !n.read).map((n) => {
              const cfg = typeConfig[n.type] ?? typeConfig.info;
              return (
                <div key={n.id} className={`rounded-xl border border-l-4 ${cfg.bg} ${cfg.border} border-border p-4 flex gap-4`}>
                  <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-lg shrink-0">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-navy text-sm">{n.title}</p>
                      <span className="w-2 h-2 rounded-full bg-ocean mt-1.5 shrink-0" />
                    </div>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted mt-2">{n.time} · {n.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Read section */}
      <div>
        <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Earlier</h2>
        <div className="space-y-2">
          {notifications.filter((n) => n.read).map((n) => {
            const cfg = typeConfig[n.type] ?? typeConfig.info;
            return (
              <div key={n.id} className={`rounded-xl border border-l-4 ${cfg.border} border-border bg-white p-4 flex gap-4 opacity-70 hover:opacity-100 transition-opacity`}>
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-lg shrink-0">
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm">{n.title}</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-muted mt-2">{n.time} · {n.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
