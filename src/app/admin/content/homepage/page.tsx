import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";

export default async function HomepageContentPage() {
  const cfg = await getSiteSection("homepage");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("homepage", fd);
    redirect("/admin/content/homepage");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy transition-colors"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">Homepage Content</h1>
          <p className="text-muted text-sm mt-0.5">Changes go live immediately</p>
        </div>
        <a href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-ocean border border-ocean/30 px-3 py-1.5 rounded-lg hover:bg-ocean/10 transition-colors">
          <ExternalLink size={12} /> Preview
        </a>
      </div>

      <form action={action} className="space-y-6 max-w-3xl">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4 pb-2 border-b border-border">Hero Section</h2>
          <div className="space-y-4">
            <Field name="hero_badge" label="Badge Text" defaultValue={cfg.hero_badge} />
            <Field name="hero_title" label="Main Heading" defaultValue={cfg.hero_title} large />
            <Field name="hero_subtitle" label="Subtitle / Tagline" defaultValue={cfg.hero_subtitle} textarea />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field name="hero_cta_primary" label="Primary Button Text" defaultValue={cfg.hero_cta_primary} />
              <Field name="hero_cta_secondary" label="Secondary Button Text" defaultValue={cfg.hero_cta_secondary} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4 pb-2 border-b border-border">Stats Bar</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="stat_students" label="Trained Seafarers (number)" defaultValue={cfg.stat_students} />
            <Field name="stat_students_label" label="Seafarers Label" defaultValue={cfg.stat_students_label} />
            <Field name="stat_passrate" label="Pass Rate (number)" defaultValue={cfg.stat_passrate} />
            <Field name="stat_passrate_label" label="Pass Rate Label" defaultValue={cfg.stat_passrate_label} />
            <Field name="stat_partners" label="Partners (number)" defaultValue={cfg.stat_partners} />
            <Field name="stat_partners_label" label="Partners Label" defaultValue={cfg.stat_partners_label} />
            <Field name="stat_years" label="Years (number)" defaultValue={cfg.stat_years} />
            <Field name="stat_years_label" label="Years Label" defaultValue={cfg.stat_years_label} />
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4 pb-2 border-b border-border">Why Choose Us (4 Feature Cards)</h2>
          <div className="space-y-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="grid sm:grid-cols-3 gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <Field name={`feature${n}_title`} label={`Feature ${n} Title`} defaultValue={cfg[`feature${n}_title`]} />
                <div className="sm:col-span-2">
                  <Field name={`feature${n}_body`} label={`Feature ${n} Description`} defaultValue={cfg[`feature${n}_body`]} textarea rows={2} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm">Save All Changes</button>
          <Link href="/admin/content" className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm">Cancel</Link>
        </div>
      </form>
    </>
  );
}

function Field({ name, label, defaultValue, textarea, rows = 3, large }: {
  name: string; label: string; defaultValue?: string;
  textarea?: boolean; rows?: number; large?: boolean;
}) {
  const base = "w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal";
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      {textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} className={`${base} resize-y`} />
      ) : (
        <input name={name} defaultValue={defaultValue} className={`${base} ${large ? "text-base font-semibold" : ""}`} />
      )}
    </div>
  );
}
