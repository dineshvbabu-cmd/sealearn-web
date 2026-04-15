import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";

const roleColors: Record<string, string> = {
  STUDENT: "bg-ocean/10 text-ocean",
  ADMIN: "bg-gold/10 text-gold",
  SUPER_ADMIN: "bg-danger/10 text-danger",
  INSTRUCTOR: "bg-teal/10 text-teal",
  REGISTRAR: "bg-jade/10 text-jade",
  CADET: "bg-steel/10 text-white/60",
  GUEST: "bg-surface text-muted",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const { q, role } = await searchParams;

  const users = await prisma.user.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        } : {},
        role ? { role: role as never } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { enrolments: true } },
    },
  });

  const roles = ["STUDENT", "CADET", "INSTRUCTOR", "REGISTRAR", "ADMIN", "SUPER_ADMIN"];

  return (
    <>
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Users &amp; Students</h1>
        <p className="text-muted text-sm mt-1">{users.length} users found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <form className="flex-1 min-w-48 flex items-center gap-2 border border-border rounded-lg px-3 py-2">
          <Search size={14} className="text-muted" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name or email…"
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          {roles.map((r) => (
            <a
              key={r}
              href={`/admin/users?role=${r}${q ? `&q=${q}` : ""}`}
              className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full transition-colors ${
                role === r ? "bg-navy text-white" : "bg-surface text-muted hover:bg-border"
              }`}
            >
              {r.replace("_", " ")}
            </a>
          ))}
          {(role || q) && (
            <a
              href="/admin/users"
              className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
            >
              Clear
            </a>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Phone</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Role</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Enrolments</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wide">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-navy">{user.name}</td>
                  <td className="px-4 py-3 text-muted text-xs">{user.email}</td>
                  <td className="px-4 py-3 text-muted text-xs">{user.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${roleColors[user.role] ?? "bg-surface text-muted"}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted text-xs">{user._count.enrolments}</td>
                  <td className="px-5 py-3 text-muted text-xs">
                    {user.createdAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-surface hover:bg-border text-navy transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="px-5 py-10 text-center text-muted text-sm">No users found.</div>
          )}
        </div>
      </div>
    </>
  );
}
