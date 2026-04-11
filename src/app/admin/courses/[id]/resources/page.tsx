import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, Video, FileText, Presentation,
  ExternalLink, BookOpen, Globe,
} from "lucide-react";
import { addResource, deleteResource } from "@/actions/resources";

const typeIcon: Record<string, React.ReactNode> = {
  video: <Video size={14} className="text-amber" />,
  pdf: <FileText size={14} className="text-ocean" />,
  ppt: <Presentation size={14} className="text-teal" />,
  doc: <FileText size={14} className="text-jade" />,
};

const typeBg: Record<string, string> = {
  video: "bg-amber/10",
  pdf: "bg-ocean/10",
  ppt: "bg-teal/10",
  doc: "bg-jade/10",
};

export default async function AdminCourseResourcesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      resources: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
  });

  if (!course) notFound();

  const grouped = course.resources.reduce<Record<string, typeof course.resources>>(
    (acc, r) => {
      const key = r.topic ?? "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/courses/${id}`} className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">Library Resources</h1>
          <p className="text-muted text-sm mt-0.5">{course.title} · {course.resources.length} resource{course.resources.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href={`/admin/courses/${id}`}
          className="text-sm text-muted border border-border px-4 py-2 rounded-lg hover:bg-surface transition-colors"
        >
          Back to Course
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resource list */}
        <div className="lg:col-span-2 space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <BookOpen size={40} className="text-muted mx-auto mb-3" />
              <h2 className="font-bold text-navy mb-2">No resources yet</h2>
              <p className="text-muted text-sm">Add videos, PDFs and presentations using the form on the right.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([topic, items]) => (
              <div key={topic} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <Globe size={14} className="text-muted" />
                  <span className="font-bold text-navy text-sm">{topic}</span>
                  <span className="text-xs text-muted ml-auto">{items.length}</span>
                </div>
                <div className="divide-y divide-border">
                  {items.map((r) => (
                    <div key={r.id} className="flex items-start gap-3 px-5 py-3 hover:bg-surface/40 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${typeBg[r.type] ?? "bg-surface"}`}>
                        {typeIcon[r.type] ?? <FileText size={14} className="text-muted" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy leading-snug">{r.title}</p>
                        <p className="text-xs text-muted mt-0.5 truncate">
                          {r.type.toUpperCase()}
                          {r.fileSize && ` · ${r.fileSize}`}
                          {r.duration && ` · ${r.duration}`}
                          {r.isPublic && <span className="ml-1 text-jade font-bold">· Public</span>}
                        </p>
                        {r.description && (
                          <p className="text-xs text-muted mt-1 line-clamp-1">{r.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-ocean transition-colors opacity-0 group-hover:opacity-100"
                          title="Open URL"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <form action={async () => {
                          "use server";
                          await deleteResource(r.id, id);
                        }}>
                          <button
                            type="submit"
                            className="text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete resource"
                          >
                            <Trash2 size={13} />
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add resource form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus size={16} className="text-teal" />
              <h2 className="font-bold text-navy text-sm">Add Resource</h2>
            </div>

            <form
              action={async (formData: FormData) => {
                "use server";
                await addResource(id, formData);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Title *</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. ColRegs Study Guide"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Type *</label>
                <select
                  name="type"
                  required
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal bg-white"
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="ppt">Presentation (PPT)</option>
                  <option value="doc">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">URL *</label>
                <input
                  name="url"
                  required
                  type="url"
                  placeholder="https://... or YouTube embed URL"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                />
                <p className="text-[10px] text-muted mt-1">YouTube: use https://www.youtube.com/embed/VIDEO_ID</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Topic / Category</label>
                <input
                  name="topic"
                  placeholder="e.g. Navigation, Safety, Cargo"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">File Size</label>
                  <input
                    name="fileSize"
                    placeholder="e.g. 2.4 MB"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Duration</label>
                  <input
                    name="duration"
                    placeholder="e.g. 18:42"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Brief description of this resource…"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1">Sort Order</label>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue="0"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  className="rounded border-border"
                />
                <label htmlFor="isPublic" className="text-xs text-muted">
                  Public (visible without enrollment)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal text-white font-bold py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm mt-1"
              >
                Add Resource
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted font-bold mb-2">Quick tips</p>
              <ul className="text-[11px] text-muted space-y-1">
                <li>• YouTube embed: replace /watch?v= with /embed/</li>
                <li>• IMO PDFs: use imo.org direct links</li>
                <li>• Run seed to load sample content for all courses</li>
              </ul>
              <a
                href={`/api/seed-resources?secret=${process.env.SEED_SECRET ?? "sealearn2025seed"}`}
                className="block mt-3 text-center text-xs text-ocean border border-ocean/30 px-3 py-2 rounded-lg hover:bg-ocean/5 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Run Sample Content Seed
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
