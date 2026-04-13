import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MediaCMSPage() {
  const cfg = await getSiteSection("media");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("media", fd);
    redirect("/admin/content/media?saved=1");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Media — Videos & Images</h1>
          <p className="text-muted text-sm mt-0.5">Promotional videos, testimonials, and key image URLs</p>
        </div>
      </div>

      <form action={action} className="space-y-5 max-w-2xl">

        {/* Key Images */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Key Images</h2>
          <p className="text-xs text-muted">Paste direct image URLs (Unsplash, R2 CDN, or your image host). Recommended size: 1600×900 px.</p>
          <F name="hero_image_url" label="Homepage Hero Background Image" defaultValue={cfg.hero_image_url} placeholder="https://images.unsplash.com/..." />
          <F name="about_image_url" label="About Section Image" defaultValue={cfg.about_image_url} placeholder="https://..." />
          <div className="grid sm:grid-cols-3 gap-4">
            <F name="campus_photo1_url" label="Campus Photo 1" defaultValue={cfg.campus_photo1_url} />
            <F name="campus_photo2_url" label="Campus Photo 2" defaultValue={cfg.campus_photo2_url} />
            <F name="campus_photo3_url" label="Campus Photo 3" defaultValue={cfg.campus_photo3_url} />
          </div>
        </div>

        {/* Promotional Videos */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Promotional Videos</h2>
          <p className="text-xs text-muted">Paste YouTube or Vimeo embed URLs (e.g. https://www.youtube.com/embed/VIDEO_ID). Leave blank to hide video sections.</p>
          <F name="promo_video_url" label="Main Promotional / Intro Video" defaultValue={cfg.promo_video_url} placeholder="https://www.youtube.com/embed/..." />
          <F name="campus_tour_url" label="Campus Tour Video" defaultValue={cfg.campus_tour_url} placeholder="https://www.youtube.com/embed/..." />
        </div>

        {/* Student Testimonials */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Student Testimonial Videos</h2>
          <p className="text-xs text-muted">Short video testimonials from graduates. Leave blank to hide.</p>

          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 bg-surface rounded-lg space-y-3">
              <p className="text-xs font-bold text-muted uppercase tracking-wide">Testimonial {n}</p>
              <F name={`testimonial${n}_url`} label="Video URL (YouTube embed)" defaultValue={cfg[`testimonial${n}_url`]} placeholder="https://www.youtube.com/embed/..." />
              <div className="grid sm:grid-cols-2 gap-4">
                <F name={`testimonial${n}_name`} label="Student Name" defaultValue={cfg[`testimonial${n}_name`]} placeholder="e.g. Emeka Okafor" />
                <F name={`testimonial${n}_role`} label="Role / Programme" defaultValue={cfg[`testimonial${n}_role`]} placeholder="e.g. Deck Cadet, 2024 Graduate" />
              </div>
            </div>
          ))}
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
