import { getSiteSection } from "@/lib/site-config";
import { saveSiteSection } from "@/actions/site-config";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdmissionsContentPage() {
  const cfg = await getSiteSection("admissions");
  const action = async (fd: FormData) => {
    "use server";
    await saveSiteSection("admissions", fd);
    redirect("/admin/content/admissions");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">Admissions Page</h1>
          <p className="text-muted text-sm mt-0.5">Application steps, deadlines and requirements</p>
        </div>
        <a href="/admissions" target="_blank" className="inline-flex items-center gap-1.5 text-xs text-ocean border border-ocean/30 px-3 py-1.5 rounded-lg hover:bg-ocean/10">
          <ExternalLink size={12} /> Preview
        </a>
      </div>

      <form action={action} className="space-y-5 max-w-3xl">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-navy pb-2 border-b border-border">Overview</h2>
          <T name="intro" label="Intro Text" defaultValue={cfg.intro} rows={2} />
          <div className="grid sm:grid-cols-3 gap-4">
            <F name="deadline" label="Application Deadline" defaultValue={cfg.deadline} />
            <F name="intake_date" label="Intake / Start Date" defaultValue={cfg.intake_date} />
            <F name="application_fee" label="Application Fee" defaultValue={cfg.application_fee} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-navy mb-4 pb-2 border-b border-border">Application Steps (shown as numbered process)</h2>
          <div className="space-y-5">
            {[1,2,3,4].map(n => (
              <div key={n} className="grid sm:grid-cols-3 gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <F name={`step${n}_title`} label={`Step ${n} Title`} defaultValue={cfg[`step${n}_title`]} />
                <div className="sm:col-span-2">
                  <T name={`step${n}_body`} label={`Step ${n} Description`} defaultValue={cfg[`step${n}_body`]} rows={2} />
                </div>
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

function F({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">{label}</label>
      <input name={name} defaultValue={defaultValue} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
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
