import Link from "next/link";
import { Home, Phone, Info, GraduationCap, Settings2, ExternalLink } from "lucide-react";

const sections = [
  {
    href: "/admin/content/homepage",
    icon: Home,
    label: "Homepage",
    description: "Hero title, subtitle, CTA buttons, stats, and feature highlights",
    color: "text-ocean bg-ocean/10",
  },
  {
    href: "/admin/content/contact",
    icon: Phone,
    label: "Contact Page",
    description: "Address, phone number, email, office hours, emergency contact",
    color: "text-jade bg-jade/10",
  },
  {
    href: "/admin/content/about",
    icon: Info,
    label: "About Page",
    description: "Mission, vision, history, key statistics and achievements",
    color: "text-teal bg-teal/10",
  },
  {
    href: "/admin/content/admissions",
    icon: GraduationCap,
    label: "Admissions Page",
    description: "Application steps, deadline, intake dates, requirements",
    color: "text-gold bg-gold/10",
  },
  {
    href: "/admin/content/general",
    icon: Settings2,
    label: "General Settings",
    description: "Site name, tagline, accreditation references, footer info",
    color: "text-muted bg-surface",
  },
];

export default function ContentPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Content Management</h1>
          <p className="text-muted text-sm mt-1">Edit all public-facing page content from here</p>
        </div>
        <a href="/" target="_blank" className="inline-flex items-center gap-2 text-sm text-ocean border border-ocean/30 px-4 py-2 rounded-lg hover:bg-ocean/10 transition-colors">
          <ExternalLink size={14} /> View Site
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-xl border border-border shadow-sm p-5 hover:shadow-md hover:border-ocean/30 transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-4`}>
              <s.icon size={18} />
            </div>
            <h2 className="font-bold text-navy group-hover:text-ocean transition-colors mb-1">{s.label}</h2>
            <p className="text-muted text-xs leading-relaxed">{s.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-teal/5 border border-teal/20 rounded-xl p-5 text-sm text-muted">
        <strong className="text-navy">How it works:</strong> Changes you make here are saved to the database and appear live on the public website immediately. Each section has its own editor with all editable fields.
      </div>
    </>
  );
}
