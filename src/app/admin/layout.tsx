import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";
import SavedToast from "@/components/SavedToast";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Anchor,
  GraduationCap,
  DollarSign,
  ClipboardList,
  FileEdit,
  Mail,
  UserSquare2,
  Activity,
  Clock,
  BadgeDollarSign,
  Video,
} from "lucide-react";

type NavItem = { href: string; icon: React.ElementType; label: string; roles?: string[] };

const navItems: NavItem[] = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/content", icon: FileEdit, label: "Content / CMS", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/about/leadership", icon: UserSquare2, label: "Leadership Team", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/courses", icon: BookOpen, label: "Courses & Fees" },
  { href: "/admin/enrolments", icon: ClipboardList, label: "Enrolments" },
  { href: "/admin/applications", icon: GraduationCap, label: "Applications" },
  { href: "/admin/waitlist", icon: Clock, label: "Waitlist" },
  { href: "/admin/price-requests", icon: BadgeDollarSign, label: "Price Requests" },
  { href: "/admin/lms", icon: Video, label: "LMS Links", roles: ["ADMIN", "SUPER_ADMIN", "LMS_ADMIN"] },
  { href: "/admin/news", icon: Newspaper, label: "News & Events", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/subscribers", icon: Mail, label: "Subscribers", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/users", icon: Users, label: "Users & Students" },
  { href: "/admin/payments", icon: DollarSign, label: "Payments" },
  { href: "/admin/activity", icon: Activity, label: "Activity Log", roles: ["ADMIN", "SUPER_ADMIN"] },
];

const STAFF_ROLES = ["INSTRUCTOR", "REGISTRAR", "LMS_ADMIN"];
const ALL_ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "INSTRUCTOR", "REGISTRAR", "LMS_ADMIN"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role as string | undefined;

  if (!session || !ALL_ADMIN_ROLES.includes(role ?? "")) {
    redirect("/auth/admin-login");
  }

  const isStaff = STAFF_ROLES.includes(role ?? "");

  const visibleNav = navItems.filter((item) => {
    if (!item.roles) return true; // visible to all admin roles
    return item.roles.includes(role ?? "");
  });

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-60 bg-steel flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-0.5">
            <Anchor className="text-gold" size={16} />
            <span className="font-cinzel text-gold text-sm tracking-widest font-bold">SEALEARN</span>
          </div>
          <p className="text-white/30 text-[10px] tracking-wide">{isStaff ? "Staff Portal" : "Admin Panel"}</p>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-white/80 text-sm font-semibold truncate">{session.user?.name}</p>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full mt-1">
            {role?.replace("_", " ")}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          {!isStaff && (
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              <Settings size={16} />
              Settings
            </Link>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-red-300 hover:bg-white/10 transition-colors text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Global save confirmation toast */}
      <Suspense>
        <SavedToast />
      </Suspense>
    </div>
  );
}
