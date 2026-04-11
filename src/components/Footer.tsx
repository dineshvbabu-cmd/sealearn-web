import Link from "next/link";
import { Anchor, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "STCW Courses", href: "/courses" },
  { label: "Admissions", href: "/admissions" },
  { label: "Student Portal", href: "/portal/dashboard" },
  { label: "News & Events", href: "/news" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];
const programmes = ["Pre-Sea Deck Cadet", "Pre-Sea Engineering", "Basic Safety Training", "GMDSS / GOC", "CoC Revalidation", "Port Management"];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Brand row */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
          <Anchor className="text-gold shrink-0" size={28} />
          <div className="flex-1">
            <div className="font-cinzel text-gold text-base tracking-widest">SEALEARN</div>
            <div className="text-white/30 text-xs tracking-wide">
              Nigeria Maritime Training Institute · NIMASA Approved · Est. 2000
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="border border-gold/30 bg-gold/10 rounded-lg px-4 py-2 text-xs text-gold">
              📧 Newsletter Sign-up
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-3">About SeaLearn</h4>
            <p className="text-white/45 text-sm leading-relaxed">
              Nigeria's premier NIMASA-approved maritime training centre, shaping the next
              generation of Nigerian seafarers since 2000.
            </p>
            <div className="flex gap-2 mt-4">
              {["𝕏", "in", "📘", "📸", "▶"].map((s, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs cursor-pointer hover:bg-white/20 transition-colors"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/45 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Programmes</h4>
            <ul className="space-y-1.5">
              {programmes.map((p) => (
                <li key={p}>
                  <Link href="/courses" className="text-white/45 text-sm hover:text-white transition-colors">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-white/45 text-sm">
                <MapPin size={14} className="shrink-0 mt-0.5 text-gold/60" />
                Apapa Port Road, Lagos, Nigeria
              </li>
              <li className="flex items-center gap-2 text-white/45 text-sm">
                <Phone size={14} className="shrink-0 text-gold/60" />
                +234 701 234 5678
              </li>
              <li className="flex items-center gap-2 text-white/45 text-sm">
                <Mail size={14} className="shrink-0 text-gold/60" />
                info@sealearn.edu.ng
              </li>
              <li className="mt-3 pt-3 border-t border-white/10 text-white/30 text-xs">
                Emergency (24/7)<br />
                <span className="text-white/45">+234 801 999 0001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Accreditations */}
        <div className="flex flex-wrap gap-3 mb-6 py-4 border-t border-b border-white/10">
          {[
            { icon: "🇳🇬", label: "NIMASA" },
            { icon: "🌊", label: "IMO" },
            { icon: "⚓", label: "STCW 2010" },
            { icon: "🏆", label: "ISO 9001" },
            { icon: "🎓", label: "NUC" },
          ].map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
            >
              <span className="text-base">{a.icon}</span>
              <span className="text-white/50 text-xs font-bold">{a.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-white/25 text-xs">
          <span>© 2025 SeaLearn Nigeria Maritime Institute. All rights reserved.</span>
          <span>NIMASA · IMO STCW 2010 · NUC · ISO 9001:2015</span>
          <Link href="/auth/admin-login" className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
