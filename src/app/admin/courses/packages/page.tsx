import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { deletePackage } from "@/actions/packages";

export default async function PackagesPage() {
  const packages = await prisma.coursePackage.findMany({
    include: { courses: { include: { course: { select: { title: true, feeNaira: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Course Packages</h1>
          <p className="text-muted text-sm mt-1">Bundle courses with discounts for students</p>
        </div>
        <Link
          href="/admin/courses/packages/new"
          className="inline-flex items-center gap-2 bg-jade text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-jade/90 transition-colors"
        >
          <Plus size={15} /> New Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Package size={40} className="text-muted mx-auto mb-3" />
          <h2 className="font-bold text-navy mb-2">No packages yet</h2>
          <p className="text-muted text-sm mb-5">Create your first course bundle with a discount.</p>
          <Link href="/admin/courses/packages/new" className="inline-flex items-center gap-2 bg-jade text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-jade/90 transition-colors">
            <Plus size={14} /> Create Package
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const totalFee = pkg.courses.reduce((sum, c) => sum + c.course.feeNaira, 0);
            const savings = Math.round(totalFee * pkg.discountPercent / 100);
            const discountedFee = totalFee - savings;
            const deleteAction = deletePackage.bind(null, pkg.id);

            return (
              <div key={pkg.id} className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col ${pkg.isActive ? "border-border" : "border-border opacity-60"}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${pkg.badgeColor}`}>
                    {pkg.badgeText}
                  </span>
                  {!pkg.isActive && (
                    <span className="text-[10px] font-bold text-muted bg-surface px-2 py-0.5 rounded-full border border-border">Draft</span>
                  )}
                </div>

                <h3 className="font-bold text-navy mb-2">{pkg.title}</h3>
                {pkg.description && <p className="text-muted text-xs mb-3 line-clamp-2">{pkg.description}</p>}

                <div className="space-y-1 mb-3">
                  {pkg.courses.map((c) => (
                    <div key={c.courseId} className="flex items-center gap-1.5 text-xs text-muted">
                      <span className="w-1 h-1 rounded-full bg-teal shrink-0" />
                      {c.course.title}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-border">
                  {pkg.discountPercent > 0 && (
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted line-through">₦{totalFee.toLocaleString()}</span>
                      <span className="text-jade font-bold">{pkg.discountPercent}% off — Save ₦{savings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="font-cinzel text-ocean font-bold text-base">₦{discountedFee.toLocaleString()}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/admin/courses/packages/${pkg.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-ocean/30 text-ocean text-xs font-bold px-3 py-2 rounded-lg hover:bg-ocean/10 transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <form action={deleteAction}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 border border-danger/30 text-danger text-xs font-bold px-3 py-2 rounded-lg hover:bg-danger/10 transition-colors"
                      onClick={(e) => { if (!confirm("Delete this package?")) e.preventDefault(); }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <Link href="/admin/courses" className="text-sm text-muted hover:text-navy transition-colors">
          ← Back to Courses
        </Link>
      </div>
    </>
  );
}
