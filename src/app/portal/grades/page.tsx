import { CheckCircle, Clock, Lock, TrendingUp, Award } from "lucide-react";

const modules = [
  { title: "Nautical Science & Navigation", score: 85, grade: "B+", status: "completed", maxScore: 100, attempts: 1, date: "12 Mar 2026" },
  { title: "Radar Navigation & ARPA", score: 90, grade: "A", status: "completed", maxScore: 100, attempts: 1, date: "28 Mar 2026" },
  { title: "Ship Stability & Construction", score: 72, grade: "B", status: "completed", maxScore: 100, attempts: 2, date: "02 Apr 2026" },
  { title: "Meteorology & Oceanography", score: null, grade: null, status: "in-progress", maxScore: 100, attempts: 0, date: null },
  { title: "Cargo Handling & Stowage", score: null, grade: null, status: "locked", maxScore: 100, attempts: 0, date: null },
  { title: "Celestial Navigation", score: null, grade: null, status: "locked", maxScore: 100, attempts: 0, date: null },
  { title: "Bridge Resource Management", score: null, grade: null, status: "locked", maxScore: 100, attempts: 0, date: null },
  { title: "Maritime Law & STCW Conventions", score: null, grade: null, status: "locked", maxScore: 100, attempts: 0, date: null },
];

const gradeColor = (grade: string | null) => {
  if (!grade) return "text-muted";
  if (grade.startsWith("A")) return "text-jade";
  if (grade.startsWith("B")) return "text-ocean";
  return "text-amber";
};

const completedModules = modules.filter((m) => m.status === "completed");
const avgScore = completedModules.length
  ? Math.round(completedModules.reduce((s, m) => s + (m.score ?? 0), 0) / completedModules.length)
  : 0;

export default function GradesPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Grades & Progress</h1>
        <p className="text-muted text-sm mt-1">Pre-Sea Deck Cadet Programme · Academic Year 2025/26</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-jade">
          <div className="text-2xl font-bold text-jade font-cinzel">{completedModules.length}/{modules.length}</div>
          <div className="text-xs text-muted mt-0.5">Modules Completed</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-ocean">
          <div className="text-2xl font-bold text-ocean font-cinzel">{avgScore}%</div>
          <div className="text-xs text-muted mt-0.5">Average Score</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-gold">
          <div className="text-2xl font-bold text-amber font-cinzel">B+</div>
          <div className="text-xs text-muted mt-0.5">Current Grade</div>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-teal">
          <div className="text-2xl font-bold text-teal font-cinzel">37%</div>
          <div className="text-xs text-muted mt-0.5">Overall Progress</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-ocean" />
            <h2 className="font-bold text-navy">Course Completion</h2>
          </div>
          <span className="text-sm font-bold text-ocean">37%</span>
        </div>
        <div className="h-3 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-ocean to-teal rounded-full" style={{ width: "37%" }} />
        </div>
        <p className="text-xs text-muted mt-2">{completedModules.length} of {modules.length} modules completed · On track for Jun 2026 completion</p>
      </div>

      {/* Module grades table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Award size={16} className="text-gold" />
          <h2 className="font-bold text-navy">Module Results</h2>
        </div>
        <div className="divide-y divide-border">
          {modules.map((m, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.status === "completed" ? "bg-jade/10" : m.status === "in-progress" ? "bg-gold/10" : "bg-surface"
              }`}>
                {m.status === "completed" ? (
                  <CheckCircle size={16} className="text-jade" />
                ) : m.status === "in-progress" ? (
                  <Clock size={16} className="text-amber" />
                ) : (
                  <Lock size={14} className="text-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${m.status === "locked" ? "text-muted" : "text-navy"}`}>{m.title}</p>
                {m.date && <p className="text-xs text-muted mt-0.5">Assessed {m.date} · {m.attempts} attempt{m.attempts !== 1 ? "s" : ""}</p>}
                {m.status === "in-progress" && <p className="text-xs text-amber mt-0.5">In progress — assessment pending</p>}
                {m.status === "locked" && <p className="text-xs text-muted mt-0.5">Locked — complete previous modules first</p>}
              </div>
              {m.score !== null && (
                <div className="text-right shrink-0">
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke={m.score >= 80 ? "#10b981" : m.score >= 60 ? "#3b82f6" : "#f59e0b"} strokeWidth="3"
                        strokeDasharray={`${m.score} 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-navy">{m.score}%</span>
                    </div>
                  </div>
                </div>
              )}
              <div className={`text-xl font-bold font-cinzel w-10 text-right shrink-0 ${gradeColor(m.grade)}`}>
                {m.grade ?? "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STCW competency summary */}
      <div className="mt-6 bg-navy rounded-xl p-5 text-white">
        <h2 className="font-cinzel font-bold text-gold mb-3">STCW Competency Progress</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Navigation", done: 8, total: 14 },
            { label: "Cargo Operations", done: 3, total: 8 },
            { label: "Safety & Emergency", done: 6, total: 10 },
            { label: "Watchkeeping", done: 5, total: 12 },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{c.label}</span>
                <span className="text-white/80">{c.done}/{c.total}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${Math.round(c.done / c.total * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
