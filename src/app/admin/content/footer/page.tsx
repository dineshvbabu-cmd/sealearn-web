import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function FooterCMSPage() {
  const cfg = await getSiteSection("footer");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("footer", fd);
    redirect("/admin/content/footer?saved=1");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Footer Content</h1>
          <p className="text-muted text-sm mt-0.5">Social media links, copyright text, and footer contact details</p>
        </div>
      </div>

      <form action={action} className="space-y-5 max-w-2xl">

        {/* Social Media */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Social Media Links</h2>
          <p className="text-xs text-muted">Paste full URLs (e.g. https://linkedin.com/company/sealearn). Leave blank to hide the icon.</p>
          <F name="linkedin_url" label="LinkedIn URL" defaultValue={cfg.linkedin_url} placeholder="https://linkedin.com/company/sealearn-nigeria" />
          <F name="twitter_url" label="X (Twitter) URL" defaultValue={cfg.twitter_url} placeholder="https://x.com/sealearnnigeria" />
          <F name="facebook_url" label="Facebook URL" defaultValue={cfg.facebook_url} placeholder="https://facebook.com/sealearnnigeria" />
          <F name="instagram_url" label="Instagram URL" defaultValue={cfg.instagram_url} placeholder="https://instagram.com/sealearnnigeria" />
          <F name="youtube_url" label="YouTube Channel URL" defaultValue={cfg.youtube_url} placeholder="https://youtube.com/@sealearnnigeria" />
        </div>

        {/* Footer Contact */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Footer Contact Details</h2>
          <F name="address_short" label="Address (short, shown in footer)" defaultValue={cfg.address_short} />
          <div className="grid sm:grid-cols-2 gap-4">
            <F name="phone" label="Phone Number" defaultValue={cfg.phone} />
            <F name="email" label="Email Address" defaultValue={cfg.email} />
          </div>
        </div>

        {/* Footer Branding */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Footer Branding</h2>
          <F name="tagline" label="Footer Tagline (under logo)" defaultValue={cfg.tagline} />
          <F name="copyright" label="Copyright Text" defaultValue={cfg.copyright} />
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
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal"
      />
    </div>
  );
}
