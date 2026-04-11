import Link from "next/link";
import { Anchor } from "lucide-react";

const sidebarLinks = [
  { href: "/portal/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/portal/courses", icon: "📚", label: "My Courses (LMS)" },
  { href: "/portal/timetable", icon: "📅", label: "Timetable" },
  { href: "/portal/grades", icon: "📊", label: "Grades & Progress" },
  { href: "/portal/practical-log", icon: "📋", label: "Practical Log" },
  { href: "/portal/simulator", icon: "🛳️", label: "Simulator Booking" },
  { href: "/portal/fees", icon: "💳", label: "Fees & Payments" },
  { href: "/portal/certificates", icon: "🎓", label: "My Certificates" },
  { href: "/portal/library", icon: "📖", label: "Library" },
  { href: "/portal/notifications", icon: "🔔", label: "Notifications" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-surface">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 bg-steel flex-col shrink-0">
        {/* Student info header */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm shrink-0">
              C
            </div>
            <div>
              <div className="text-white text-xs font-bold">Chidi Okonkwo</div>
              <div className="text-white/30 text-[10px]">Pre-Sea Deck · Jan 2025</div>
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
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            <Anchor size={12} />
            Back to main site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
