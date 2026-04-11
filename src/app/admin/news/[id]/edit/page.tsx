import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updatePost } from "@/actions/news";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const categories = ["news", "event", "admissions", "achievement", "announcement"];

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const action = updatePost.bind(null, id);

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/news" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Edit Post</h1>
          <p className="text-muted text-sm mt-0.5">{post.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-3xl">
        <form action={action} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Title *
              </label>
              <input
                name="title"
                required
                defaultValue={post.title}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                name="category"
                defaultValue={post.category}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Status
              </label>
              <select
                name="publish"
                defaultValue={post.publishedAt ? "true" : "false"}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Image URL
              </label>
              <input
                name="imageUrl"
                type="url"
                defaultValue={post.imageUrl ?? ""}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                rows={2}
                defaultValue={post.excerpt ?? ""}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Body *
              </label>
              <textarea
                name="body"
                required
                rows={10}
                defaultValue={post.body}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-jade text-white font-bold px-6 py-2.5 rounded-lg hover:bg-jade/90 transition-colors text-sm"
            >
              Save Changes
            </button>
            <Link
              href="/admin/news"
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
