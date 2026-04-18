import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Users, Newspaper, GraduationCap, ArrowRight, ClipboardCheck } from "lucide-react";

export default async function AdminDashboardPage() {
  const [userCount, courseCount, postCount, applicationCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.post.count(),
    prisma.application.count(),
  ]);

  const recentApplications = await prisma.application.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const stats = [
    { label: "Total Students", value: userCount, icon: Users, color: "text-ocean", bg: "bg-ocean/10", href: "/admin/users" },
    { label: "Active Courses", value: courseCount, icon: BookOpen, color: "text-teal", bg: "bg-teal/10", href: "/admin/courses" },
    { label: "News & Events", value: postCount, icon: Newspaper, color: "text-jade", bg: "bg-jade/10", href: "/admin/news" },
    { label: "Applications", value: applicationCount, icon: GraduationCap, color: "text-amber", bg: "bg-amber/10", href: "/admin/applications" },
  ];

  return (
    <>
      <div className="mb-7">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">SeaLearn Nigeria CMS · Overview</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div className="font-cinzel text-2xl font-bold text-navy">{s.value}</div>
            <div className="text-muted text-xs mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-navy text-sm">Recent Applications</h2>
            <Link href="/admin/applications" className="text-xs text-ocean hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentApplications.length === 0 && (
              <p className="px-5 py-4 text-sm text-muted">No applications yet.</p>
            )}
            {recentApplications.map((app) => (
              <div key={app.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy">{app.user.name}</p>
                  <p className="text-xs text-muted">{app.course.title}</p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    app.status === "ACCEPTED"
                      ? "bg-jade/10 text-jade"
                      : app.status === "REJECTED"
                      ? "bg-danger/10 text-danger"
                      : "bg-amber/10 text-amber"
                  }`}
                >
                  {app.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-navy text-sm">New Registrations</h2>
            <Link href="/admin/users" className="text-xs text-ocean hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.length === 0 && (
              <p className="px-5 py-4 text-sm text-muted">No users yet.</p>
            )}
            {recentUsers.map((u) => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-surface text-muted">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl border border-border p-5">
        <h2 className="font-bold text-navy text-sm mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/courses/new" className="inline-flex items-center gap-2 bg-teal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal/90 transition-colors">
            <BookOpen size={14} /> Add Course
          </Link>
          <Link href="/admin/news/new" className="inline-flex items-center gap-2 bg-jade text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-jade/90 transition-colors">
            <Newspaper size={14} /> New Post
          </Link>
          <Link href="/admin/users" className="inline-flex items-center gap-2 bg-ocean text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-ocean/90 transition-colors">
            <Users size={14} /> Manage Users
          </Link>
          <Link href="/admin/vir" className="inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors">
            <ClipboardCheck size={14} /> Review VIR Module
          </Link>
        </div>
      </div>
    </>
  );
}
