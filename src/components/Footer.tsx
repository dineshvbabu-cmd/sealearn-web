import Link from "next/link";
import { Anchor, Phone, Mail, MapPin } from "lucide-react";
import { getSiteSection } from "@/lib/site-config";

const quickLinks = [
  { label: "STCW Courses", href: "/courses" },
  { label: "Admissions", href: "/admissions" },
  { label: "News & Events", href: "/news" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

const programmes = [
  "Pre-Sea Deck Cadet",
  "Pre-Sea Engineering",
  "Basic Safety Training",
  "GMDSS / GOC",
  "CoC Revalidation",
  "Port Management",
];

type SocialLink = { url: string; label: string; icon: string };

export default async function Footer() {
  const cfg = await getSiteSection("footer").catch(() => ({} as Record<string, string>));

  const socialLinks: SocialLink[] = [
    { url: cfg.twitter_url ?? "", label: "X (Twitter)", icon: "𝕏" },
    { url: cfg.linkedin_url ?? "", label: "LinkedIn", icon: "in" },
    { url: cfg.facebook_url ?? "", label: "Facebook", icon: "f" },
    { url: cfg.instagram_url ?? "", label: "Instagram", icon: "📸" },
    { url: cfg.youtube_url ?? "", label: "YouTube", icon: "▶" },
  ].filter((s) => s.url.trim() !== "");

  const tagline = cfg.tagline || "Nigeria Maritime Training Institute · NIMASA Approved · Est. 2000";
  const copyright = cfg.copyright || "© 2025 SeaLearn Nigeria Maritime Institute. All rights reserved.";
  const address = cfg.address_short || "Apapa Port Road, Lagos, Nigeria";
  const phone = cfg.phone || "+234 701 234 5678";
  const email = cfg.email || "info@sealearn.edu.ng";

  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Brand row */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
          <Anchor className="text-gold shrink-0" size={28} />
          <div className="flex-1">
            <div className="font-cinzel text-gold text-base tracking-widest">SEALEARN</div>
            <div className="text-white/30 text-xs tracking-wide">{tagline}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About + Social */}
          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-widest mb-3">About SeaLearn</h4>
            <p className="text-white/45 text-sm leading-relaxed">
              Nigeria's premier NIMASA-approved maritime training centre, shaping the next
              generation of Nigerian seafarers since 2000.
            </p>
            {socialLinks.length > 0 ? (
              <div className="flex gap-2 mt-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-white/25 transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                {["𝕏", "in", "f", "📸", "▶"].map((icon, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs opacity-40">
                    {icon}
                  </div>
                ))}
              </div>
            )}
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
                {address}
              </li>
              <li className="flex items-center gap-2 text-white/45 text-sm">
                <Phone size={14} className="shrink-0 text-gold/60" />
                {phone}
              </li>
              <li className="flex items-center gap-2 text-white/45 text-sm">
                <Mail size={14} className="shrink-0 text-gold/60" />
                {email}
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
            <div key={a.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <span className="text-base">{a.icon}</span>
              <span className="text-white/50 text-xs font-bold">{a.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-white/25 text-xs">
          <span>{copyright}</span>
          <span>NIMASA · IMO STCW 2010 · NUC · ISO 9001:2015</span>
          <Link href="/auth/admin-login" className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
