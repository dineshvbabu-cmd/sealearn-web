import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewsContentPage() {
  const cfg = await getSiteSection("news");
  const save = saveSiteSection.bind(null, "news");

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/content" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">News Page Settings</h1>
          <p className="text-muted text-sm mt-0.5">Newsletter sign-up text and media/press contact details</p>
        </div>
      </div>

      <form action={save} className="space-y-6 max-w-2xl">
        {/* Newsletter */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4">Newsletter Sign-up Widget</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Title</label>
              <input name="subscribe_title" defaultValue={cfg.subscribe_title}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Description</label>
              <textarea name="subscribe_body" defaultValue={cfg.subscribe_body} rows={2}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none" />
            </div>
          </div>
        </div>

        {/* Press */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4">Media & Press Enquiries</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Card Title</label>
              <input name="press_title" defaultValue={cfg.press_title}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Description</label>
              <textarea name="press_body" defaultValue={cfg.press_body} rows={2}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Phone</label>
                <input name="press_phone" defaultValue={cfg.press_phone}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Email</label>
                <input name="press_email" type="email" defaultValue={cfg.press_email}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit"
          className="bg-jade text-white font-bold px-6 py-2.5 rounded-lg hover:bg-jade/90 transition-colors text-sm">
          Save Changes
        </button>
      </form>
    </>
  );
}
