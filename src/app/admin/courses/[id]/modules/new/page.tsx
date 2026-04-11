import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createModule } from "@/actions/modules";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id }, select: { title: true, modules: { select: { order: true } } } });
  if (!course) notFound();

  const nextOrder = course.modules.length + 1;
  const action = createModule.bind(null, id);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/courses/${id}`} className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Add Module</h1>
          <p className="text-muted text-sm mt-0.5">{course.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-2xl">
        <form action={action} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Module Title *</label>
              <input name="title" required placeholder="e.g. Nautical Science & Navigation" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Order (position)</label>
              <input name="order" type="number" min={1} defaultValue={nextOrder} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Duration (minutes)</label>
              <input name="durationMin" type="number" min={1} placeholder="e.g. 45" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Video URL</label>
              <input name="videoUrl" type="url" placeholder="https://youtube.com/embed/... or Cloudflare Stream URL" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
              <p className="text-xs text-muted mt-1">Paste a YouTube embed URL, Vimeo, or Cloudflare Stream URL</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">PDF / Notes URL</label>
              <input name="pdfUrl" type="url" placeholder="https://... (link to PDF file)" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
              <p className="text-xs text-muted mt-1">Link to a PDF stored on Google Drive, R2, or any public URL</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm">
              Add Module
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
