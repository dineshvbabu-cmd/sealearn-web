import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ContactContentPage() {
  const cfg = await getSiteSection("contact");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("contact", fd);
    redirect("/admin/content/contact");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">Contact Page</h1>
          <p className="text-muted text-sm mt-0.5">Address, phone, email shown on Contact page and Footer</p>
        </div>
        <a href="/contact" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-ocean border border-ocean/30 px-3 py-1.5 rounded-lg hover:bg-ocean/10">
          <ExternalLink size={12} /> Preview
        </a>
      </div>

      <form action={action} className="space-y-5 max-w-2xl">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Contact Details</h2>
          <F name="address" label="Physical Address" defaultValue={cfg.address} />
          <div className="grid sm:grid-cols-2 gap-4">
            <F name="phone" label="Main Phone" defaultValue={cfg.phone} />
            <F name="email" label="Email Address" defaultValue={cfg.email} />
          </div>
          <F name="office_hours" label="Office Hours" defaultValue={cfg.office_hours} />
          <F name="emergency_phone" label="Emergency Phone (24/7)" defaultValue={cfg.emergency_phone} />
          <F name="google_maps_url" label="Google Maps Embed URL (optional)" defaultValue={cfg.google_maps_url} />
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
