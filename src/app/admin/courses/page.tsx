import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { toggleCourseActive, deleteCourse } from "@/actions/courses";

const levelLabels: Record<string, string> = {
  PRE_SEA: "Pre-Sea",
  SHORT_COURSE: "Short Course",
  DEGREE: "Degree",
  POST_COC: "Post-CoC",
  REFRESHER: "Refresher",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ level: "asc" }, { title: "asc" }],
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Courses &amp; Fees</h1>
          <p className="text-muted text-sm mt-1">{courses.length} programmes in the database</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 bg-teal text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-teal/90 transition-colors"
        >
          <Plus size={14} /> Add Course
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Level</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">STCW</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Fee (₦)</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">App. Fee</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((course) => {
                const toggleAction = toggleCourseActive.bind(null, course.id, !course.isActive);
                const deleteAction = deleteCourse.bind(null, course.id);

                return (
                  <tr key={course.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/courses/${course.id}`} className="font-semibold text-navy hover:text-ocean transition-colors">
                        {course.title}
                      </Link>
                      <p className="text-xs text-muted">{course.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{levelLabels[course.level] ?? course.level}</td>
                    <td className="px-4 py-3 text-muted text-xs">{course.stcwRegulation ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ocean">
                      ₦{course.feeNaira.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-muted text-xs">
                      ₦{course.applicationFee.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <form action={toggleAction}>
                        <button type="submit" title={course.isActive ? "Deactivate" : "Activate"}>
                          {course.isActive ? (
                            <ToggleRight size={20} className="text-jade" />
                          ) : (
                            <ToggleLeft size={20} className="text-muted" />
                          )}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-ocean border border-ocean/30 px-2.5 py-1 rounded-lg hover:bg-ocean/10 transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </Link>
                        <form action={deleteAction}>
                          <button
                            type="submit"
                            className="text-xs text-danger border border-danger/30 px-2.5 py-1 rounded-lg hover:bg-danger/10 transition-colors"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {courses.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">
              No courses yet.{" "}
              <Link href="/admin/courses/new" className="text-ocean underline">Add the first one</Link>{" "}
              or run <code className="text-xs bg-surface px-1 rounded">/api/seed?secret=SEED_SECRET</code> to import demo data.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
