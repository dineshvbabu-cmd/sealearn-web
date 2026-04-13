import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createLeader } from "@/actions/leadership";
import LeaderPhotoField from "@/components/LeaderPhotoField";

export default function NewLeaderPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/about/leadership" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Add Leadership Member</h1>
          <p className="text-muted text-sm mt-0.5">New member will appear on the About page</p>
        </div>
      </div>

      <form action={createLeader} className="space-y-5 max-w-2xl">
        <LeaderFormFields />
        <div className="flex gap-3">
          <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm">
            Add Member
          </button>
          <Link href="/admin/about/leadership" className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

function LeaderFormFields({ defaults }: { defaults?: Record<string, string | boolean | null> }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <F name="name" label="Full Name *" defaultValue={defaults?.name as string} placeholder="Capt. Emeka Nwosu" />
        <F name="title" label="Job Title *" defaultValue={defaults?.title as string} placeholder="Director General & Principal" />
      </div>
      <F name="credential" label="Credential / Qualification" defaultValue={defaults?.credential as string} placeholder="Master Mariner (FG)" />
      <LeaderPhotoField defaultValue={defaults?.imageUrl as string} />
      <div>
        <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Bio (optional)</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={defaults?.bio as string}
          placeholder="Brief professional background…"
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal resize-y"
        />
      </div>
      {defaults !== undefined && (
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" name="isActive" value="true"
            defaultChecked={defaults?.isActive !== false}
            className="rounded border-border" />
          <label htmlFor="isActive" className="text-sm text-navy">Visible on About page</label>
        </div>
      )}
    </div>
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
