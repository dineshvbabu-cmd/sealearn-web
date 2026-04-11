import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";
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
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/content", icon: FileEdit, label: "Content / CMS" },
  { href: "/admin/courses", icon: BookOpen, label: "Courses & Fees" },
  { href: "/admin/enrolments", icon: ClipboardList, label: "Enrolments" },
  { href: "/admin/applications", icon: GraduationCap, label: "Applications" },
  { href: "/admin/news", icon: Newspaper, label: "News & Events" },
  { href: "/admin/users", icon: Users, label: "Users & Students" },
  { href: "/admin/payments", icon: DollarSign, label: "Payments" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/auth/admin-login");
  }

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
          <p className="text-white/30 text-[10px] tracking-wide">Admin Panel</p>
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
          {navItems.map((item) => (
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
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <Settings size={16} />
            Settings
          </Link>
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
    </div>
  );
}
