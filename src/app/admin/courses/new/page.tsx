import { createCourse } from "@/actions/courses";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const levels = [
  { value: "PRE_SEA", label: "Pre-Sea" },
  { value: "SHORT_COURSE", label: "Short Course" },
  { value: "DEGREE", label: "Degree" },
  { value: "POST_COC", label: "Post-CoC" },
  { value: "REFRESHER", label: "Refresher" },
];

export default function NewCoursePage() {
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/courses" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Add New Course</h1>
          <p className="text-muted text-sm mt-0.5">Create a new programme in the database</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-3xl">
        <form action={createCourse} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Course Title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g. Basic Safety Training (BST)"
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
                placeholder="https://sealearn.uk/wp-content/uploads/…"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
              <p className="text-[11px] text-muted mt-1">Shown on the course card. Leave blank to use the default ship photo.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Slug * (URL identifier)
              </label>
              <input
                name="slug"
                required
                placeholder="e.g. basic-safety-training"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                STCW Regulation
              </label>
              <input
                name="stcwRegulation"
                placeholder="e.g. STCW VI/1"
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
                placeholder="e.g. 4"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Course Fee (₦) *
              </label>
              <input
                name="feeNaira"
                type="number"
                required
                min={0}
                placeholder="e.g. 120000"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Application Fee (₦)
              </label>
              <input
                name="applicationFee"
                type="number"
                defaultValue={15000}
                min={0}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                NIMASA Ref Number
              </label>
              <input
                name="nimasaRefNumber"
                placeholder="e.g. NIMASA/2025/001"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                NIMASA Approved
              </label>
              <select
                name="nimasaApproved"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
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
                placeholder="Full course description…"
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
                placeholder="Minimum 5 O-Level credits&#10;Age 16–25&#10;Medical certificate"
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
                placeholder="STCW VI/1 Certificate&#10;NIMASA-registered certification"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm"
            >
              Create Course
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
