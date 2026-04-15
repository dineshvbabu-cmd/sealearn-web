import Link from "next/link";
import { Bell, BookOpen, ClipboardList, TrendingUp, Award, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const todaySchedule = [
  { time: "08:00", subject: "Radar Navigation", room: "Room 3B", color: "border-l-ocean" },
  { time: "11:00", subject: "Ship Stability", room: "Hall A", color: "border-l-teal" },
  { time: "14:00", subject: "Bridge Simulator", room: "Sim Lab 1", color: "border-l-jade" },
  { time: "16:00", subject: "Celestial Navigation", room: "Room 2A", color: "border-l-amber" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const enrolments = await prisma.enrolment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: { modules: { select: { id: true, title: true, order: true } } },
      },
      progress: true,
      certificates: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeEnrolments = enrolments.filter((e) => e.status === "ACTIVE");
  const completedEnrolments = enrolments.filter((e) => e.status === "COMPLETED");
  const pendingPayment = enrolments.filter((e) => e.status === "PENDING_PAYMENT");

  // Compute overall progress
  const totalModules = activeEnrolments.reduce((sum, e) => sum + e.course.modules.length, 0);
  const completedModules = activeEnrolments.reduce((sum, e) => sum + e.progress.filter((p) => p.completedAt !== null).length, 0);
  const avgProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Outstanding fees
  const outstanding = enrolments.reduce((sum, e) => sum + Math.max(0, e.totalFee - e.amountPaid), 0);

  const statsCards = [
    { label: "Active Courses", value: activeEnrolments.length.toString(), color: "border-t-ocean", valueClass: "text-navy" },
    { label: "Avg. Completion", value: `${avgProgress}%`, color: "border-t-gold", valueClass: "text-amber" },
    { label: "Certificates", value: completedEnrolments.length.toString(), color: "border-t-teal", valueClass: "text-teal" },
    { label: "Fees Outstanding", value: outstanding > 0 ? `₦${outstanding.toLocaleString()}` : "₦0", color: "border-t-jade", valueClass: outstanding > 0 ? "text-danger" : "text-jade" },
  ];

  // Module progress for sidebar
  const moduleProgressList = activeEnrolments.flatMap((e) =>
    e.course.modules.map((mod) => {
      const prog = e.progress.find((p) => p.moduleId === mod.id);
      const pct = prog?.percentDone ?? 0;
      return {
        title: `${mod.title}`,
        courseName: e.course.title,
        progress: pct,
        status: prog?.completedAt ? "completed" : pct > 0 ? "in-progress" : "locked",
      };
    })
  ).slice(0, 6);

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-muted text-xs uppercase tracking-widest">Student Portal</div>
          <h1 className="font-cinzel text-2xl text-navy font-bold">
            Welcome, {session.user?.name?.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted">{dateLabel}</div>
          <div className="relative">
            <Bell size={18} className="text-muted" />
            {pendingPayment.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                {pendingPayment.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment alert */}
      {pendingPayment.length > 0 && (
        <div className="mb-5 bg-amber/10 border border-amber/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={16} className="text-amber shrink-0" />
          <div className="flex-1 text-sm">
            <span className="font-bold text-amber">Payment required</span>{" "}
            <span className="text-muted">{pendingPayment.length} course{pendingPayment.length > 1 ? "s" : ""} awaiting payment to unlock access.</span>
          </div>
          <Link href="/portal/fees" className="text-xs font-bold text-amber border border-amber/30 px-3 py-1.5 rounded-lg hover:bg-amber/10 transition-colors shrink-0">
            Pay Now
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl p-4 border-t-4 ${s.color} shadow-sm`}>
            <div className={`text-2xl font-bold font-cinzel ${s.valueClass}`}>{s.value}</div>
            <div className="text-muted text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's timetable */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-cinzel text-navy font-bold text-base mb-4">Today — {dateLabel}</h2>
          <div className="space-y-2">
            {todaySchedule.map((s) => (
              <div key={s.time} className={`flex items-center gap-3 p-3 bg-surface rounded-lg border-l-4 ${s.color}`}>
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
          {moduleProgressList.length === 0 ? (
            <div className="py-6 text-center">
              <BookOpen size={28} className="text-muted mx-auto mb-2 opacity-40" />
              <p className="text-muted text-xs">No modules yet. Enrol in a course to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {moduleProgressList.map((m, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-navy font-medium truncate max-w-[160px]">{m.title}</div>
                    <div className="text-xs text-muted">{m.progress}%</div>
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
          )}
          <Link
            href="/portal/courses"
            className="mt-4 flex items-center justify-center gap-1 bg-ocean text-white text-xs font-bold py-2.5 rounded-lg hover:bg-navy transition-colors"
          >
            <BookOpen size={12} /> Continue Learning
          </Link>
        </div>

        {/* Quick links & KPI */}
        <div className="space-y-4">
          {/* KPI summary */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h2 className="font-cinzel text-navy font-bold text-base mb-4">My Progress KPI</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Overall Completion</span>
                  <span className="font-bold text-navy">{avgProgress}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal to-ocean rounded-full transition-all" style={{ width: `${avgProgress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="text-center">
                  <div className="text-lg font-bold text-navy">{activeEnrolments.length}</div>
                  <div className="text-[10px] text-muted">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-jade">{completedModules}</div>
                  <div className="text-[10px] text-muted">Modules Done</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gold">{totalModules - completedModules}</div>
                  <div className="text-[10px] text-muted">Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h2 className="font-cinzel text-navy font-bold text-sm mb-3">Quick Actions</h2>
            <div className="space-y-1.5">
              {[
                { href: "/portal/assessments", icon: ClipboardList, label: "Mock Assessments", color: "text-ocean" },
                { href: "/portal/grades", icon: TrendingUp, label: "Grades & KPI", color: "text-teal" },
                { href: "/portal/practical-log", icon: ClipboardList, label: "Practical Log", color: "text-amber" },
                { href: "/portal/certificates", icon: Award, label: "My Certificates", color: "text-jade" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors group"
                >
                  <link.icon size={14} className={link.color} />
                  <span className="text-xs text-navy group-hover:text-ocean transition-colors">{link.label}</span>
                  <ArrowRight size={11} className="ml-auto text-muted/50 group-hover:text-ocean transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Practical log CTA */}
      <div className="mt-5 bg-navy rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-cinzel text-gold font-bold text-base mb-1">Practical Log Book</div>
          <div className="text-white/50 text-sm">
            Record your STCW sea-service competencies and get them signed off by your instructor.
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
