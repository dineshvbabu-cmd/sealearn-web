import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateLesson } from "@/actions/modules";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string; lessonId: string }>;
}) {
  const { id, moduleId, lessonId } = await params;
  const [course, module, lesson] = await Promise.all([
    prisma.course.findUnique({ where: { id }, select: { title: true } }),
    prisma.module.findUnique({ where: { id: moduleId }, select: { title: true } }),
    prisma.lesson.findUnique({ where: { id: lessonId } }),
  ]);
  if (!course || !module || !lesson) notFound();

  const action = updateLesson.bind(null, lessonId, moduleId, id);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/courses/${id}`} className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Edit Lesson</h1>
          <p className="text-muted text-sm mt-0.5">{course.title} · {module.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-2xl">
        <form action={action} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Lesson Title *</label>
              <input name="title" required defaultValue={lesson.title} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Order</label>
              <input name="order" type="number" min={1} defaultValue={lesson.order} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Duration (minutes)</label>
              <input name="durationMin" type="number" min={1} defaultValue={lesson.durationMin ?? ""} placeholder="e.g. 12" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Video URL</label>
              <input name="videoUrl" type="url" defaultValue={lesson.videoUrl ?? ""} placeholder="https://www.youtube.com/embed/VIDEO_ID" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
              <p className="text-xs text-muted mt-1">YouTube embed URL, Vimeo, or Cloudflare Stream</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">PDF / Reading URL</label>
              <input name="pdfUrl" type="url" defaultValue={lesson.pdfUrl ?? ""} placeholder="https://..." className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm">
              Save Changes
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
