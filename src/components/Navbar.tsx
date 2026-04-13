"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, Anchor, LayoutDashboard } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/admissions", label: "Admissions" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated" && !!session?.user;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Anchor className="text-gold" size={22} />
            <div>
              <div className="text-gold font-cinzel text-sm font-bold tracking-widest leading-none">
                SEALEARN
              </div>
              <div className="text-white/30 text-[10px] tracking-wide leading-none mt-0.5">
                Nigeria Maritime Institute
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  isActive(link.href)
                    ? "text-gold font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/portal/dashboard"
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-full transition-colors ${
                    pathname.startsWith("/portal")
                      ? "bg-gold text-navy"
                      : "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25"
                  }`}
                >
                  <LayoutDashboard size={14} />
                  My Portal
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 text-sm text-white/70 border border-white/20 rounded-full hover:border-white/50 hover:text-white transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  href="/admissions"
                  className="px-4 py-1.5 text-sm font-bold text-navy bg-gold rounded-full hover:bg-yellow-400 transition-colors"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navy">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 text-sm rounded ${
                  isActive(link.href)
                    ? "text-gold font-semibold bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
              {isLoggedIn ? (
                <Link
                  href="/portal/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-bold text-navy bg-gold rounded-full"
                >
                  My Portal
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 text-sm text-white/70 border border-white/20 rounded-full"
                  >
                    Student Login
                  </Link>
                  <Link
                    href="/admissions"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 text-sm font-bold text-navy bg-gold rounded-full"
                  >
                    Apply Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
