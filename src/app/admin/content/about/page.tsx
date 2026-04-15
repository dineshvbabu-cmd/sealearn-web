import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AboutContentPage() {
  const cfg = await getSiteSection("about");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("about", fd);
    redirect("/admin/content/about?saved=1");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">About Page</h1>
          <p className="text-muted text-sm mt-0.5">Mission, vision, highlights, core values and statistics</p>
        </div>
        <a href="/about" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-ocean border border-ocean/30 px-3 py-1.5 rounded-lg hover:bg-ocean/10">
          <ExternalLink size={12} /> Preview
        </a>
      </div>

      {/* Leadership shortcut */}
      <Link
        href="/admin/about/leadership"
        className="flex items-center gap-3 bg-navy/5 border border-navy/15 rounded-xl p-4 mb-5 hover:bg-navy/10 transition-colors"
      >
        <Users size={20} className="text-navy" />
        <div className="flex-1">
          <div className="font-bold text-navy text-sm">Leadership Team</div>
          <p className="text-muted text-xs">Add, edit, reorder and upload photos for team members</p>
        </div>
        <span className="text-xs text-ocean font-semibold">Manage →</span>
      </Link>

      <form action={action} className="space-y-5 max-w-3xl">

        {/* Mission & Vision */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Mission & Vision</h2>
          <F name="mission_heading" label="Section Heading" defaultValue={cfg.mission_heading} />
          <F name="mission_image_url" label="Section Image URL" defaultValue={cfg.mission_image_url} placeholder="https://…" />
          <T name="mission" label="Mission Statement" defaultValue={cfg.mission} rows={3} />
          <T name="vision" label="Vision Statement" defaultValue={cfg.vision} rows={3} />
          <T name="history" label="About / History Paragraph" defaultValue={cfg.history} rows={4} />
        </div>

        {/* Key Highlights */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Key Highlights (bullet points under mission)</h2>
          {[1,2,3,4].map(n => (
            <F key={n} name={`highlight_${n}`} label={`Highlight ${n}`} defaultValue={cfg[`highlight_${n}`]} placeholder="e.g. 3,200+ graduates serving worldwide" />
          ))}
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4 pb-2 border-b border-border">Core Values (6 cards)</h2>
          <div className="space-y-5">
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="grid grid-cols-[60px_1fr_2fr] gap-3 items-start">
                <F name={`value${n}_icon`} label={`#${n} Icon`} defaultValue={cfg[`value${n}_icon`]} placeholder="⚓" />
                <F name={`value${n}_title`} label="Title" defaultValue={cfg[`value${n}_title`]} placeholder="Safety First" />
                <F name={`value${n}_body`} label="Description" defaultValue={cfg[`value${n}_body`]} placeholder="One-line description…" />
              </div>
            ))}
          </div>
        </div>

        {/* Campus Gallery Photos */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Campus Life Gallery (4 photos)</h2>
          <p className="text-muted text-xs -mt-2">These appear in the Campus Life grid on the About page. Paste image URLs from sealearn.uk or R2.</p>
          <F name="campus_photo1_url" label="Photo 1 URL" defaultValue={cfg.campus_photo1_url} placeholder="https://sealearn.uk/wp-content/uploads/…" />
          <F name="campus_photo2_url" label="Photo 2 URL" defaultValue={cfg.campus_photo2_url} placeholder="https://sealearn.uk/wp-content/uploads/…" />
          <F name="campus_photo3_url" label="Photo 3 URL" defaultValue={cfg.campus_photo3_url} placeholder="https://sealearn.uk/wp-content/uploads/…" />
          <F name="about_image_url"   label="Photo 4 URL" defaultValue={cfg.about_image_url}   placeholder="https://sealearn.uk/wp-content/uploads/…" />
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4 pb-2 border-b border-border">Key Statistics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(n => (
              <div key={n} className="grid grid-cols-2 gap-2">
                <F name={`stat${n}_value`} label={`Stat ${n} Value`} defaultValue={cfg[`stat${n}_value`]} />
                <F name={`stat${n}_label`} label={`Stat ${n} Label`} defaultValue={cfg[`stat${n}_label`]} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm">Save Changes</button>
          <Link href="/admin/content" className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface text-sm">Cancel</Link>
        </div>
      </form>
    </>
  );
}

function F({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
    </div>
  );
}
function T({ name, label, defaultValue, rows = 3 }: { name: string; label: string; defaultValue?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      <textarea name={name} rows={rows} defaultValue={defaultValue} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal resize-y" />
    </div>
  );
}
