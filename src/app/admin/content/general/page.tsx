import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function GeneralSettingsPage() {
  const cfg = await getSiteSection("general");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("general", fd);
    redirect("/admin/content/general?saved=1");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">General Settings</h1>
          <p className="text-muted text-sm mt-0.5">Site name, tagline and accreditation references</p>
        </div>
      </div>

      <form action={action} className="space-y-5 max-w-2xl">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Site Identity</h2>
          <F name="site_name" label="Site Name" defaultValue={cfg.site_name} />
          <F name="tagline" label="Tagline (shown in navbar & footer)" defaultValue={cfg.tagline} />
          <div className="grid sm:grid-cols-2 gap-4">
            <F name="founded_year" label="Founded Year" defaultValue={cfg.founded_year} />
            <F name="nimasa_ref" label="NIMASA Reference Number" defaultValue={cfg.nimasa_ref} />
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

function F({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      <input name={name} defaultValue={defaultValue} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
    </div>
  );
}
