import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { deletePost } from "@/actions/news";

const categoryColors: Record<string, string> = {
  news: "bg-amber/10 text-amber",
  event: "bg-ocean/10 text-ocean",
  admissions: "bg-jade/10 text-jade",
  achievement: "bg-teal/10 text-teal",
  announcement: "bg-steel/10 text-steel",
};

export default async function AdminNewsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">News &amp; Events</h1>
          <p className="text-muted text-sm mt-1">{posts.length} posts in the database</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 bg-jade text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-jade/90 transition-colors"
        >
          <Plus size={14} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Published</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy">{post.title}</p>
                    <p className="text-xs text-muted">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? "bg-surface text-muted"}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {post.publishedAt
                      ? post.publishedAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })
                      : <span className="text-amber">Draft</span>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/news/${post.id}/edit`}
                        className="inline-flex items-center gap-1 text-xs text-ocean border border-ocean/30 px-2.5 py-1 rounded-lg hover:bg-ocean/10 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deletePost(post.id);
                      }}>
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
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">
              No posts yet.{" "}
              <Link href="/admin/news/new" className="text-ocean underline">Create the first one</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
