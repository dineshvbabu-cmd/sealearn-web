import Link from "next/link";
import { Anchor, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// ── Role classification ────────────────────────────────────────
const STAFF_ROLES   = ["INSTRUCTOR", "REGISTRAR", "LMS_ADMIN"];
const ADMIN_ROLES   = ["ADMIN", "SUPER_ADMIN"];
const STUDENT_ROLES = ["STUDENT", "CADET", "GUEST"];

// ── Sidebar links that require an active enrolment ─────────────
const ENROLMENT_REQUIRED = new Set([
  "portal:courses", "portal:assessments", "portal:timetable",
  "portal:grades",  "portal:practical-log", "portal:simulator",
  "portal:certificates", "portal:library",
]);

// ── Pages always visible regardless of permissions / enrolment ──
const ALWAYS_VISIBLE = new Set([
  "portal:dashboard", "portal:fees", "portal:help", "portal:notifications",
]);

// ── All portal sidebar links ───────────────────────────────────
const ALL_STUDENT_LINKS = [
  { href: "/portal/dashboard",     icon: "🏠", label: "Dashboard",         resource: "portal:dashboard"    },
  { href: "/portal/courses",       icon: "📚", label: "My Courses (LMS)",  resource: "portal:courses"      },
  { href: "/portal/assessments",   icon: "📝", label: "Mock Assessments",  resource: "portal:assessments"  },
  { href: "/portal/timetable",     icon: "📅", label: "Timetable",         resource: "portal:timetable"    },
  { href: "/portal/grades",        icon: "📊", label: "Grades & KPI",      resource: "portal:grades"       },
  { href: "/portal/practical-log", icon: "📋", label: "Practical Log",     resource: "portal:practical-log"},
  { href: "/portal/simulator",     icon: "🛳️", label: "Simulator Booking", resource: "portal:simulator"    },
  { href: "/portal/fees",          icon: "💳", label: "Fees & Payments",   resource: "portal:fees"         },
  { href: "/portal/certificates",  icon: "🎓", label: "My Certificates",   resource: "portal:certificates" },
  { href: "/portal/library",       icon: "📖", label: "Library",           resource: "portal:library"      },
  { href: "/portal/notifications", icon: "🔔", label: "Notifications",     resource: "portal:notifications"},
  { href: "/portal/help",          icon: "❓", label: "Help Centre",       resource: "portal:help"         },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const role      = (session.user as { role?: string })?.role ?? "STUDENT";
  const isStaff   = STAFF_ROLES.includes(role);
  const isAdmin   = ADMIN_ROLES.includes(role);
  const isStudent = STUDENT_ROLES.includes(role);

  // ── Determine visible sidebar links ───────────────────────────
  let visibleLinks = ALL_STUDENT_LINKS;

  if (isStudent) {
    // 1. Check whether this student has ANY enrolment (any status)
    const enrolmentCount = await prisma.enrolment.count({
      where: { userId: session.user.id },
    });
    const hasEnrolment = enrolmentCount > 0;

    if (!hasEnrolment) {
      // Not yet enrolled — lock sidebar to always-visible pages only
      visibleLinks = ALL_STUDENT_LINKS.filter((l) => ALWAYS_VISIBLE.has(l.resource));
    } else {
      // Enrolled — respect admin-set per-page permissions
      const perms = await prisma.userPermission.findMany({
        where: { userId: session.user.id, resource: { startsWith: "portal:" } },
      });

      if (perms.length > 0) {
        const allowed = new Set(perms.filter((p) => p.canView).map((p) => p.resource));
        visibleLinks = ALL_STUDENT_LINKS.filter(
          (l) => ALWAYS_VISIBLE.has(l.resource) || allowed.has(l.resource)
        );
      }
      // No permissions set → show all links (default for enrolled students)
    }
  }

  const user     = session.user;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "S";

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-surface flex-col">
      {/* Admin preview banner */}
      {isAdmin && (
        <div className="bg-danger text-white text-xs font-bold text-center py-2 px-4 flex items-center justify-center gap-3">
          <span>🔴 ADMIN PREVIEW MODE — {role.replace("_", " ")} — You are previewing the student portal.</span>
          <a href="/admin/dashboard" className="underline hover:text-white/80">← Back to Admin Panel</a>
        </div>
      )}
      {/* Staff read-only banner */}
      {isStaff && (
        <div className="bg-amber text-navy text-xs font-bold text-center py-2 px-4 flex items-center justify-center gap-3">
          <span>👁 STAFF VIEW — {role.replace("_", " ")} — You are viewing the student portal.</span>
          <a href="/admin/dashboard" className="underline hover:text-navy/70">← Back to Staff Panel</a>
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
                <div className="text-white/30 text-[10px]">{role.replace("_", " ")}</div>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col py-2 flex-1">
            {visibleLinks.map((link) => (
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
            <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors">
              <Anchor size={12} />
              Back to main site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 text-white/30 hover:text-red-300 text-xs transition-colors">
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
