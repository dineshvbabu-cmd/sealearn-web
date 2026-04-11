import Link from "next/link";
import { Bell, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";

const statsCards = [
  { label: "Active Modules", value: "7", color: "border-t-ocean", valueClass: "text-navy" },
  { label: "Avg. Completion", value: "68%", color: "border-t-gold", valueClass: "text-amber" },
  { label: "Sim Hours Logged", value: "24 hrs", color: "border-t-teal", valueClass: "text-teal" },
  { label: "Fees Outstanding", value: "₦0", color: "border-t-jade", valueClass: "text-jade" },
];

const todaySchedule = [
  { time: "08:00", subject: "Radar Navigation", room: "Room 3B", color: "border-l-ocean" },
  { time: "11:00", subject: "Ship Stability", room: "Hall A", color: "border-l-teal" },
  { time: "14:00", subject: "Bridge Simulator", room: "Sim Lab 1", color: "border-l-jade" },
  { time: "16:00", subject: "Celestial Navigation", room: "Room 2A", color: "border-l-amber" },
];

const moduleProgress = [
  { title: "Module 1: Nautical Science", progress: 100, score: "85%", status: "completed" },
  { title: "Module 2: Radar & ARPA", progress: 100, score: "90%", status: "completed" },
  { title: "Module 3: Meteorology", progress: 35, score: "—", status: "in-progress" },
  { title: "Module 4: Seamanship & Cargo", progress: 0, score: "—", status: "locked" },
  { title: "Module 5: Celestial Navigation", progress: 0, score: "—", status: "locked" },
];

const notifications = [
  { icon: "📋", text: "Exam schedule released — BST Module", time: "2h ago", type: "info" },
  { icon: "🛳️", text: "Simulator booking open — Week 14", time: "5h ago", type: "info" },
  { icon: "💳", text: "Fee instalment due in 7 days", time: "1d ago", type: "warning" },
  { icon: "✅", text: "Module 2: Radar & ARPA — Completed", time: "2d ago", type: "success" },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-muted text-xs uppercase tracking-widest">Student Portal</div>
          <h1 className="font-cinzel text-2xl text-navy font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted">Fri, 11 Apr 2025</div>
          <div className="relative">
            <Bell size={18} className="text-muted" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((s) => (
          <div
            key={s.label}
            className={`bg-white rounded-xl p-4 border-t-4 ${s.color} shadow-sm`}
          >
            <div className={`text-2xl font-bold font-cinzel ${s.valueClass}`}>{s.value}</div>
            <div className="text-muted text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's timetable */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-cinzel text-navy font-bold text-base mb-4">Today — Fri 11 Apr</h2>
          <div className="space-y-2">
            {todaySchedule.map((s) => (
              <div
                key={s.time}
                className={`flex items-center gap-3 p-3 bg-surface rounded-lg border-l-4 ${s.color}`}
              >
                <div className="text-xs font-bold text-navy w-12 shrink-0">{s.time}</div>
                <div>
                  <div className="font-semibold text-navy text-xs">{s.subject}</div>
                  <div className="text-muted text-[10px]">{s.room}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module progress */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-navy font-bold text-base">Module Progress</h2>
            <Link href="/portal/courses" className="text-ocean text-xs font-semibold hover:underline">
              Open LMS
            </Link>
          </div>
          <div className="space-y-3">
            {moduleProgress.map((m) => (
              <div key={m.title}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-navy font-medium truncate max-w-[160px]">{m.title}</div>
                  <div className="text-xs text-muted">{m.score}</div>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      m.status === "completed" ? "bg-jade" : m.status === "in-progress" ? "bg-gold" : "bg-border"
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/portal/courses"
            className="mt-4 flex items-center justify-center gap-1 bg-ocean text-white text-xs font-bold py-2.5 rounded-lg hover:bg-navy transition-colors"
          >
            <BookOpen size={12} /> Continue Learning
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-navy font-bold text-base">Notifications</h2>
            <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3 new</span>
          </div>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-2.5 rounded-lg text-xs border ${
                  n.type === "warning"
                    ? "bg-amber/5 border-amber/20"
                    : n.type === "success"
                    ? "bg-jade/5 border-jade/20"
                    : "bg-surface border-border"
                }`}
              >
                <span className="text-base shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium leading-tight ${n.type === "warning" ? "text-amber" : "text-navy"}`}>
                    {n.text}
                  </div>
                  <div className="text-muted text-[10px] mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practical log CTA */}
      <div className="mt-5 bg-navy rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-cinzel text-gold font-bold text-base mb-1">Practical Log Book</div>
          <div className="text-white/50 text-sm">
            You have <strong className="text-white">12 STCW competency items</strong> due for
            instructor sign-off this week.
          </div>
        </div>
        <Link
          href="/portal/practical-log"
          className="shrink-0 bg-gold text-navy font-bold px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-colors text-sm"
        >
          Open Practical Log
        </Link>
      </div>
    </div>
  );
}
