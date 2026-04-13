import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import { deleteLeader, moveLeader } from "@/actions/leadership";

export default async function AdminLeadershipPage() {
  const members = await prisma.leadershipMember.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/content/about" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">Leadership Team</h1>
          <p className="text-muted text-sm mt-0.5">{members.length} member{members.length !== 1 ? "s" : ""} · shown on the About page</p>
        </div>
        <Link
          href="/admin/about/leadership/new"
          className="inline-flex items-center gap-2 bg-teal text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-teal/90 transition-colors"
        >
          <Plus size={14} /> Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-10 text-center">
          <p className="text-muted text-sm mb-4">No leadership members yet.</p>
          <Link href="/admin/about/leadership/new" className="inline-flex items-center gap-2 bg-teal text-white text-sm font-bold px-4 py-2.5 rounded-lg">
            <Plus size={14} /> Add First Member
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((m, idx) => (
            <div key={m.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
              {/* Photo */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold flex-shrink-0 bg-surface">
                {m.imageUrl ? (
                  <Image src={m.imageUrl} alt={m.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl text-muted">👤</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy text-sm">{m.name}</span>
                  {!m.isActive && (
                    <span className="text-[10px] bg-surface border border-border text-muted px-1.5 py-0.5 rounded-full">Hidden</span>
                  )}
                </div>
                <p className="text-muted text-xs">{m.title}</p>
                {m.credential && (
                  <span className="inline-block mt-1 bg-ocean/10 text-ocean text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {m.credential}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Reorder */}
                <form action={moveLeader.bind(null, m.id, "up")}>
                  <button
                    type="submit"
                    disabled={idx === 0}
                    className="p-2 text-muted hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                </form>
                <form action={moveLeader.bind(null, m.id, "down")}>
                  <button
                    type="submit"
                    disabled={idx === members.length - 1}
                    className="p-2 text-muted hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </form>

                <Link
                  href={`/admin/about/leadership/${m.id}/edit`}
                  className="p-2 text-muted hover:text-ocean"
                  title="Edit"
                >
                  <Pencil size={14} />
                </Link>

                <form action={deleteLeader.bind(null, m.id)} onSubmit={(e) => {
                  if (!confirm(`Remove ${m.name}?`)) e.preventDefault();
                }}>
                  <button type="submit" className="p-2 text-muted hover:text-red-500" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
