import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Video, Plus, Eye, EyeOff, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { value: "general",    label: "General" },
  { value: "admissions", label: "Admissions" },
  { value: "portal",     label: "Student Portal" },
  { value: "lms",        label: "LMS / Courses" },
  { value: "stcw",       label: "STCW & Certification" },
];

export default async function HelpVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; cat?: string }>;
}) {
  const { saved, cat } = await searchParams;

  const videos = await prisma.helpVideo.findMany({
    where: cat ? { category: cat } : undefined,
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  async function createVideo(fd: FormData) {
    "use server";
    const title = (fd.get("title") as string).trim();
    const videoUrl = (fd.get("videoUrl") as string).trim();
    if (!title || !videoUrl) return;
    await prisma.helpVideo.create({
      data: {
        title,
        videoUrl,
        description: (fd.get("description") as string | null) ?? undefined,
        thumbnailUrl: (fd.get("thumbnailUrl") as string | null) ?? undefined,
        category: (fd.get("category") as string) || "general",
        sortOrder: parseInt(fd.get("sortOrder") as string) || 0,
        isActive: true,
      },
    });
    revalidatePath("/admin/help-videos");
    redirect("/admin/help-videos?saved=1");
  }

  async function toggleActive(fd: FormData) {
    "use server";
    const id = fd.get("id") as string;
    const current = await prisma.helpVideo.findUnique({ where: { id }, select: { isActive: true } });
    if (!current) return;
    await prisma.helpVideo.update({ where: { id }, data: { isActive: !current.isActive } });
    revalidatePath("/admin/help-videos");
    redirect("/admin/help-videos?saved=1");
  }

  async function deleteVideo(fd: FormData) {
    "use server";
    const id = fd.get("id") as string;
    await prisma.helpVideo.delete({ where: { id } });
    revalidatePath("/admin/help-videos");
    redirect("/admin/help-videos");
  }

  const grouped = CATEGORIES.map((c) => ({
    ...c,
    items: videos.filter((v) => v.category === c.value),
  }));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Help Videos</h1>
          <p className="text-muted text-sm mt-1">{videos.length} video{videos.length !== 1 ? "s" : ""} · shown on student portal Help page</p>
        </div>
      </div>

      {saved && (
        <div className="bg-jade/10 border border-jade/30 text-jade text-sm px-4 py-3 rounded-lg mb-5">
          Changes saved.
        </div>
      )}

      {/* Add new video form */}
      <details className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <summary className="px-5 py-4 cursor-pointer font-bold text-navy flex items-center gap-2 text-sm">
          <Plus size={16} className="text-teal" /> Add New Help Video
        </summary>
        <form action={createVideo} className="px-5 pb-5 pt-2 space-y-4 border-t border-border">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Title *</label>
              <input name="title" required placeholder="e.g. How to apply step-by-step" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Category</label>
              <select name="category" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Video URL * (YouTube embed or direct video link)</label>
            <input name="videoUrl" required placeholder="https://www.youtube.com/embed/..." className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Description</label>
            <textarea name="description" rows={2} placeholder="Brief description of what this video covers…" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal resize-y" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Thumbnail URL</label>
              <input name="thumbnailUrl" placeholder="https://img.youtube.com/vi/.../hqdefault.jpg" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Sort Order</label>
              <input name="sortOrder" type="number" defaultValue="0" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal" />
            </div>
          </div>
          <button type="submit" className="bg-teal text-white font-bold px-5 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors">
            Add Video
          </button>
        </form>
      </details>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        <a href="/admin/help-videos" className={`text-xs font-bold uppercase px-3 py-1 rounded-full transition-colors ${!cat ? "bg-navy text-white" : "bg-surface text-muted hover:bg-border"}`}>
          All
        </a>
        {CATEGORIES.map((c) => (
          <a key={c.value} href={`/admin/help-videos?cat=${c.value}`} className={`text-xs font-bold uppercase px-3 py-1 rounded-full transition-colors ${cat === c.value ? "bg-navy text-white" : "bg-surface text-muted hover:bg-border"}`}>
            {c.label}
          </a>
        ))}
      </div>

      {/* Video list grouped by category */}
      <div className="space-y-6">
        {grouped.map(({ label, items }) =>
          items.length === 0 ? null : (
            <div key={label}>
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">{label}</div>
              <div className="space-y-2">
                {items.map((v) => (
                  <div key={v.id} className={`bg-white rounded-xl border shadow-sm p-4 flex gap-4 items-start ${!v.isActive ? "opacity-60" : "border-border"}`}>
                    {/* Thumbnail */}
                    <div className="w-24 h-14 rounded-lg bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                      {v.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <Video size={24} className="text-muted" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-navy text-sm">{v.title}</span>
                        {!v.isActive && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted/20 text-muted">Hidden</span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-surface text-muted ml-auto">
                          order: {v.sortOrder}
                        </span>
                      </div>
                      {v.description && <p className="text-muted text-xs mt-0.5 line-clamp-1">{v.description}</p>}
                      <p className="text-muted text-[11px] mt-1 truncate">{v.videoUrl}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" title={v.isActive ? "Hide" : "Show"} className="p-1.5 rounded-lg text-muted hover:text-navy hover:bg-surface transition-colors">
                          {v.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </form>
                      <form action={deleteVideo} onSubmit={(e) => { if (!confirm(`Delete "${v.title}"?`)) e.preventDefault(); }}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" title="Delete" className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
        {videos.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <Video size={40} className="text-muted mx-auto mb-3" />
            <p className="font-bold text-navy mb-1">No help videos yet</p>
            <p className="text-muted text-sm">Use the form above to add your first help video.</p>
          </div>
        )}
      </div>
    </>
  );
}
