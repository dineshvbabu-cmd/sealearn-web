import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createLesson } from "@/actions/modules";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewLessonPage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const { id, moduleId } = await params;
  const [course, module] = await Promise.all([
    prisma.course.findUnique({ where: { id }, select: { title: true } }),
    prisma.module.findUnique({ where: { id: moduleId }, include: { lessons: { select: { order: true } } } }),
  ]);
  if (!course || !module) notFound();

  const nextOrder = module.lessons.length + 1;
  const action = createLesson.bind(null, moduleId, id);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/courses/${id}`} className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Add Lesson</h1>
          <p className="text-muted text-sm mt-0.5">{course.title} · {module.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-2xl">
        <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 mb-5 text-xs text-muted">
          <strong className="text-navy">Tip:</strong> A lesson is a single unit of content inside a module — e.g. one video lecture, one PDF reading, or one topic. Keep lessons focused and short.
        </div>

        <form action={action} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Lesson Title *</label>
              <input name="title" required placeholder="e.g. Introduction to Chart Plotting" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Order (position)</label>
              <input name="order" type="number" min={1} defaultValue={nextOrder} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Duration (minutes)</label>
              <input name="durationMin" type="number" min={1} placeholder="e.g. 12" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Video URL</label>
              <input name="videoUrl" type="url" placeholder="https://www.youtube.com/embed/VIDEO_ID" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
              <p className="text-xs text-muted mt-1">
                For YouTube: go to a video → Share → Embed → copy the URL from src="..." (e.g. https://www.youtube.com/embed/abc123)
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">PDF / Reading URL</label>
              <input name="pdfUrl" type="url" placeholder="https://... (Google Drive share link or direct PDF URL)" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
              <p className="text-xs text-muted mt-1">
                For Google Drive: open the file → Share → Change to &quot;Anyone with link&quot; → copy the link
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-jade text-white font-bold px-6 py-2.5 rounded-lg hover:bg-jade/90 transition-colors text-sm">
              Add Lesson
            </button>
            <Link href={`/admin/courses/${id}`} className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
