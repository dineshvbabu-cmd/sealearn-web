import { createPost } from "@/actions/news";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const categories = ["news", "event", "admissions", "achievement", "announcement"];

export default function NewPostPage() {
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/news" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">New Post</h1>
          <p className="text-muted text-sm mt-0.5">Create a news or event post</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-3xl">
        <form action={createPost} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Title *
              </label>
              <input
                name="title"
                required
                placeholder="Post title"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Slug * (URL)
              </label>
              <input
                name="slug"
                required
                placeholder="e.g. nimasa-award-2025"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Image URL
              </label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Excerpt (short summary)
              </label>
              <textarea
                name="excerpt"
                rows={2}
                placeholder="One or two sentences summarising the post…"
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
                rows={8}
                placeholder="Full article content…"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Event Date <span className="text-muted font-normal normal-case">(leave blank for non-events)</span>
              </label>
              <input
                name="eventDate"
                type="datetime-local"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Event Venue
              </label>
              <input
                name="eventVenue"
                placeholder="e.g. Main Auditorium, Apapa Campus"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                Publish Now?
              </label>
              <select
                name="publish"
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
              >
                <option value="true">Yes — publish immediately</option>
                <option value="false">No — save as draft</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-jade text-white font-bold px-6 py-2.5 rounded-lg hover:bg-jade/90 transition-colors text-sm"
            >
              Create Post
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
