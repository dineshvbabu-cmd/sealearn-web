import { prisma } from "@/lib/prisma";
import { createPackage } from "@/actions/packages";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const badgeColors = [
  { value: "bg-teal", label: "Teal" },
  { value: "bg-ocean", label: "Ocean Blue" },
  { value: "bg-jade", label: "Jade Green" },
  { value: "bg-gold", label: "Gold" },
  { value: "bg-navy", label: "Navy" },
  { value: "bg-amber", label: "Amber" },
];

export default async function NewPackagePage() {
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: [{ level: "asc" }, { title: "asc" }],
    select: { id: true, title: true, level: true, feeNaira: true, stcwRegulation: true },
  });

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/courses/packages" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">New Course Package</h1>
          <p className="text-muted text-sm mt-0.5">Bundle courses together with a discount</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <form action={createPackage} className="space-y-6">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-navy pb-2 border-b border-border">Package Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Title *</label>
                <input name="title" required placeholder="e.g. Deck Officer Starter Pack"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Slug * (URL)</label>
                <input name="slug" required placeholder="e.g. deck-officer-starter"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Description</label>
              <textarea name="description" rows={2} placeholder="Brief description of what this package includes and who it's for…"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Discount %</label>
                <input name="discountPercent" type="number" min="0" max="100" defaultValue="10" placeholder="10"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Badge Text</label>
                <input name="badgeText" defaultValue="Bundle Offer" placeholder="Bundle Offer"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Badge Colour</label>
                <select name="badgeColor" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white">
                  {badgeColors.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Status</label>
              <select name="isActive" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white">
                <option value="true">Active — visible to students</option>
                <option value="false">Draft — hidden from students</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-bold text-navy mb-1 pb-2 border-b border-border">Select Courses to Bundle</h2>
            <p className="text-muted text-xs mb-4">Select 2 or more courses. The total fee and discount are calculated automatically.</p>
            <div className="space-y-2">
              {courses.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface cursor-pointer transition-colors">
                  <input type="checkbox" name="courseIds" value={c.id} className="accent-teal w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-navy text-sm truncate">{c.title}</div>
                    <div className="text-muted text-xs">{c.level.replace("_", " ")} · {c.stcwRegulation ?? "—"}</div>
                  </div>
                  <div className="font-bold text-ocean text-sm shrink-0">₦{c.feeNaira.toLocaleString()}</div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-jade text-white font-bold px-6 py-2.5 rounded-lg hover:bg-jade/90 transition-colors text-sm">
              Create Package
            </button>
            <Link href="/admin/courses/packages" className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
