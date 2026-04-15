import Link from "next/link";
import { Anchor, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";
import { redirect } from "next/navigation";

const sidebarLinks = [
  { href: "/portal/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/portal/courses", icon: "📚", label: "My Courses (LMS)" },
  { href: "/portal/assessments", icon: "📝", label: "Mock Assessments" },
  { href: "/portal/timetable", icon: "📅", label: "Timetable" },
  { href: "/portal/grades", icon: "📊", label: "Grades & KPI" },
  { href: "/portal/practical-log", icon: "📋", label: "Practical Log" },
  { href: "/portal/simulator", icon: "🛳️", label: "Simulator Booking" },
  { href: "/portal/fees", icon: "💳", label: "Fees & Payments" },
  { href: "/portal/certificates", icon: "🎓", label: "My Certificates" },
  { href: "/portal/library", icon: "📖", label: "Library" },
  { href: "/portal/notifications", icon: "🔔", label: "Notifications" },
  { href: "/portal/help", icon: "❓", label: "Help Centre" },
];

const STAFF_ROLES = ["INSTRUCTOR", "REGISTRAR"];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  // Admin accounts belong in the admin panel, not the student portal
  const role = (session.user as { role?: string })?.role;
  if (role === "ADMIN" || role === "SUPER_ADMIN") redirect("/admin/dashboard");

  const isStaff = STAFF_ROLES.includes(role ?? "");

  const user = session.user;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "S";

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-surface flex-col">
      {/* Staff read-only banner */}
      {isStaff && (
        <div className="bg-amber-500 text-white text-xs font-bold text-center py-2 px-4 flex items-center justify-center gap-3">
          <span>👁 STAFF READ-ONLY VIEW — {role?.replace("_", " ")} — You are viewing the student portal. Changes made here may not be saved.</span>
          <a href="/admin/dashboard" className="underline hover:text-white/80">← Back to Staff Panel</a>
        </div>
      )}
      <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 bg-steel flex-col shrink-0">
        {/* Student info header */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-white text-xs font-bold truncate max-w-[100px]">{user?.name}</div>
              <div className="text-white/30 text-[10px]">{(user as { role?: string })?.role ?? "Student"}</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col py-2 flex-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/8 text-xs transition-colors border-l-2 border-transparent hover:border-gold"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            <Anchor size={12} />
            Back to main site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 text-white/30 hover:text-red-300 text-xs transition-colors"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      </div>
    </div>
  );
}
