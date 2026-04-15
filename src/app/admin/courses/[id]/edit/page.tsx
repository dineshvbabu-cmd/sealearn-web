import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCourse } from "@/actions/courses";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const levels = [
  { value: "PRE_SEA", label: "Pre-Sea" },
  { value: "SHORT_COURSE", label: "Short Course" },
  { value: "DEGREE", label: "Degree" },
  { value: "POST_COC", label: "Post-CoC" },
  { value: "REFRESHER", label: "Refresher" },
];

export default async function EditCoursePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  const action = updateCourse.bind(null, id);

  return (
    <>
      {saved && (
        <div className="bg-jade/10 border border-jade/30 text-jade text-sm px-4 py-3 rounded-lg mb-5">
          Course saved successfully.
        </div>
      )}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/courses" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Edit Course</h1>
          <p className="text-muted text-sm mt-0.5">{course.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-3xl">
        <form action={action} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Course Title *
              </label>
              <input
                name="title"
                required
                defaultValue={course.title}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Course Image URL
              </label>
              <input
                name="imageUrl"
                type="url"
                defaultValue={course.imageUrl ?? ""}
                placeholder="https://sealearn.uk/wp-content/uploads/…"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
              <p className="text-[11px] text-muted mt-1">Shown on the course card. Leave blank to use the default ship photo.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                STCW Regulation
              </label>
              <input
                name="stcwRegulation"
                defaultValue={course.stcwRegulation ?? ""}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Level *
              </label>
              <select
                name="level"
                required
                defaultValue={course.level}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                {levels.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Duration (weeks) *
              </label>
              <input
                name="durationWeeks"
                type="number"
                required
                min={1}
                defaultValue={course.durationWeeks}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>


            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                NIMASA Ref Number
              </label>
              <input
                name="nimasaRefNumber"
                defaultValue={course.nimasaRefNumber ?? ""}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                NIMASA Approved
              </label>
              <select
                name="nimasaApproved"
                defaultValue={String(course.nimasaApproved)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Active
              </label>
              <select
                name="isActive"
                defaultValue={String(course.isActive)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                <option value="true">Yes — visible on site</option>
                <option value="false">No — hidden</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={course.description}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Eligibility (one per line)
              </label>
              <textarea
                name="eligibility"
                rows={3}
                defaultValue={course.eligibility}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Outcomes (one per line)
              </label>
              <textarea
                name="outcomes"
                rows={3}
                defaultValue={course.outcomes}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm"
            >
              Save Changes
            </button>
            <Link
              href="/admin/courses"
              className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
