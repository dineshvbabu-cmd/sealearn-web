import { prisma } from "@/lib/prisma";
import { Clock, Users, Mail, CheckCircle } from "lucide-react";
import { updateApplicationStatus } from "@/actions/site-config";

export default async function WaitlistPage() {
  // Get waitlisted applications + waitlist entries
  const [waitlistedApps, waitlistEntries] = await Promise.all([
    prisma.application.findMany({
      where: { status: "WAITLISTED" },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        course: { select: { title: true, level: true } },
      },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.waitlist.findMany({
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const intakeDates = await prisma.intakeDate.findMany({
    where: { isOpen: true },
    include: { course: { select: { title: true } } },
    orderBy: { startDate: "asc" },
  });

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Clock size={22} className="text-navy" />
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Waitlist Management</h1>
          <p className="text-muted text-sm mt-0.5">
            {waitlistedApps.length} waitlisted application{waitlistedApps.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Waiting", count: waitlistedApps.length, color: "text-amber", bg: "bg-amber/10" },
          { label: "Open Intakes", count: intakeDates.length, color: "text-ocean", bg: "bg-ocean/10" },
          { label: "Notified", count: waitlistEntries.filter(w => w.status === "NOTIFIED").length, color: "text-teal", bg: "bg-teal/10" },
          { label: "Enrolled", count: waitlistEntries.filter(w => w.status === "ENROLLED").length, color: "text-jade", bg: "bg-jade/10" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Waitlisted Applications */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Users size={16} className="text-muted" />
          <h2 className="font-bold text-navy text-sm">Waitlisted Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-xs">
                <th className="text-left px-5 py-3 font-bold text-muted uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 font-bold text-muted uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 font-bold text-muted uppercase tracking-wide">Level</th>
                <th className="text-left px-4 py-3 font-bold text-muted uppercase tracking-wide">Waitlisted</th>
                <th className="text-right px-5 py-3 font-bold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {waitlistedApps.map((app) => (
                <tr key={app.id} className="hover:bg-surface/50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy">{app.user.name}</p>
                    <p className="text-xs text-muted">{app.user.email}</p>
                    {app.user.phone && <p className="text-xs text-muted">{app.user.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted max-w-[200px]">
                    <p className="font-medium text-navy text-xs leading-tight">{app.course.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase bg-surface text-muted px-2 py-0.5 rounded-full">
                      {app.course.level.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {app.updatedAt.toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`mailto:${app.user.email}?subject=SeaLearn Nigeria – Course Availability Update&body=Dear ${app.user.name},%0A%0AWe are pleased to inform you that a place has become available for ${app.course.title}.%0A%0APlease log in to your portal to confirm your enrolment.%0A%0ARegards,%0ASeaLearn Nigeria Admissions Team`}
                        className="text-xs text-ocean border border-ocean/30 px-2.5 py-1 rounded-lg hover:bg-ocean/10 transition-colors flex items-center gap-1"
                      >
                        <Mail size={11} /> Notify
                      </a>
                      <form action={updateApplicationStatus.bind(null, app.id, "ACCEPTED")}>
                        <button type="submit" className="text-xs text-jade border border-jade/30 px-2.5 py-1 rounded-lg hover:bg-jade/10 transition-colors flex items-center gap-1">
                          <CheckCircle size={11} /> Admit
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {waitlistedApps.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">
              <Clock size={28} className="mx-auto mb-2 opacity-30" />
              No waitlisted applications.
            </div>
          )}
        </div>
      </div>

      {/* Open Intake Dates */}
      {intakeDates.length > 0 && (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-navy text-sm">Open Intake Dates (available for assignment)</h2>
          </div>
          <div className="divide-y divide-border">
            {intakeDates.map((intake) => (
              <div key={intake.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-navy text-sm">{intake.course.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {intake.startDate.toLocaleDateString("en-GB")} → {intake.endDate.toLocaleDateString("en-GB")}
                    &nbsp;·&nbsp;Deadline: {intake.deadline.toLocaleDateString("en-GB")}
                    &nbsp;·&nbsp;Capacity: {intake.capacity}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-jade uppercase bg-jade/10 px-2 py-0.5 rounded-full">Open</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-muted">
        <strong className="text-navy">Admitting a student</strong> changes the application to ACCEPTED and automatically triggers enrolment creation. Use the <strong>Notify</strong> button to send a personalised email before admitting.
      </div>
    </>
  );
}
