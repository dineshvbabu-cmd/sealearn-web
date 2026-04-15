import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, User } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// All admin page resources that can have per-user permissions
const ADMIN_RESOURCES = [
  { slug: "dashboard",      label: "Dashboard",         group: "Core" },
  { slug: "content",        label: "Content / CMS",     group: "Core" },
  { slug: "courses",        label: "Courses & Fees",    group: "Academic" },
  { slug: "applications",   label: "Applications",      group: "Academic" },
  { slug: "enrolments",     label: "Enrolments",        group: "Academic" },
  { slug: "waitlist",       label: "Waitlist",          group: "Academic" },
  { slug: "lms",            label: "LMS Links",         group: "Academic" },
  { slug: "price-requests", label: "Price Requests",    group: "Finance" },
  { slug: "payments",       label: "Payments",          group: "Finance" },
  { slug: "users",          label: "Users & Students",  group: "Admin" },
  { slug: "news",           label: "News & Events",     group: "Content" },
  { slug: "subscribers",    label: "Subscribers",       group: "Content" },
  { slug: "help-videos",    label: "Help Videos",       group: "Content" },
  { slug: "email-templates",label: "Email Templates",   group: "Admin" },
  { slug: "activity",       label: "Activity Log",      group: "Admin" },
  { slug: "settings",       label: "Settings",          group: "Admin" },
];

const GROUPS = ["Core", "Academic", "Finance", "Content", "Admin"];

const roleColors: Record<string, string> = {
  STUDENT: "bg-ocean/10 text-ocean",
  ADMIN: "bg-gold/10 text-gold",
  SUPER_ADMIN: "bg-danger/10 text-danger",
  INSTRUCTOR: "bg-teal/10 text-teal",
  REGISTRAR: "bg-jade/10 text-jade",
  LMS_ADMIN: "bg-amber/10 text-amber",
  CADET: "bg-steel/10 text-steel",
  GUEST: "bg-surface text-muted",
};

const ALL_ROLES = ["GUEST", "CADET", "STUDENT", "INSTRUCTOR", "LMS_ADMIN", "REGISTRAR", "ADMIN", "SUPER_ADMIN"];

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  const session = await auth();
  const actorRole = (session?.user as { role?: string })?.role ?? "";
  if (!["ADMIN", "SUPER_ADMIN"].includes(actorRole)) redirect("/admin/dashboard");

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { enrolments: true, applications: true } },
      permissions: true,
    },
  });

  if (!user) notFound();

  // Build permission map: resource → { canView, canEdit }
  const permMap = new Map(
    user.permissions.map((p) => [p.resource, { canView: p.canView, canEdit: p.canEdit }])
  );

  async function savePermissions(fd: FormData) {
    "use server";
    const ops = ADMIN_RESOURCES.map((r) => {
      const canView = fd.get(`view_${r.slug}`) === "on";
      const canEdit = fd.get(`edit_${r.slug}`) === "on";
      return prisma.userPermission.upsert({
        where: { userId_resource: { userId: id, resource: r.slug } },
        update: { canView, canEdit },
        create: { userId: id, resource: r.slug, canView, canEdit },
      });
    });
    await prisma.$transaction(ops);
    revalidatePath(`/admin/users/${id}`);
    redirect(`/admin/users/${id}?saved=1`);
  }

  async function changeRole(fd: FormData) {
    "use server";
    const newRole = fd.get("role") as string;
    if (!ALL_ROLES.includes(newRole)) return;
    await prisma.user.update({ where: { id }, data: { role: newRole as never } });
    revalidatePath(`/admin/users/${id}`);
    redirect(`/admin/users/${id}?saved=1`);
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-muted hover:text-navy">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Manage User</h1>
          <p className="text-muted text-sm mt-0.5">Access control &amp; role management</p>
        </div>
      </div>

      {saved && (
        <div className="bg-jade/10 border border-jade/30 text-jade text-sm px-4 py-3 rounded-lg mb-5">
          Changes saved successfully.
        </div>
      )}

      {/* User info card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5 mb-6 flex flex-wrap gap-6 items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center">
            <User size={22} className="text-navy" />
          </div>
          <div>
            <div className="font-cinzel font-bold text-navy">{user.name}</div>
            <div className="text-muted text-xs">{user.email}</div>
            {user.phone && <div className="text-muted text-xs">{user.phone}</div>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm ml-auto">
          <div className="text-center">
            <div className="font-bold text-navy text-lg">{user._count.enrolments}</div>
            <div className="text-muted text-xs">Enrolments</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-navy text-lg">{user._count.applications}</div>
            <div className="text-muted text-xs">Applications</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-navy text-xs">Joined</div>
            <div className="text-muted text-xs">
              {user.createdAt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Role change */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-bold text-navy mb-1 flex items-center gap-2">
            <Shield size={16} className="text-ocean" /> Role
          </h2>
          <p className="text-muted text-xs mb-4">Changing role grants or revokes all default permissions for that role level.</p>
          <form action={changeRole} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Current Role</label>
              <select
                name="role"
                defaultValue={user.role}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-ocean"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${roleColors[user.role] ?? "bg-surface text-muted"}`}>
              Current: {user.role.replace("_", " ")}
            </span>
            <button
              type="submit"
              className="w-full bg-ocean text-white font-bold py-2 rounded-lg hover:bg-ocean/90 text-sm transition-colors"
            >
              Update Role
            </button>
          </form>
        </div>

        {/* Per-page permissions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm p-5">
          <h2 className="font-bold text-navy mb-1">Page-Level Permissions</h2>
          <p className="text-muted text-xs mb-4">
            Only applies to staff roles (INSTRUCTOR, REGISTRAR, LMS_ADMIN). Super Admin always has full access.
          </p>
          <form action={savePermissions}>
            <div className="space-y-5">
              {GROUPS.map((group) => {
                const resources = ADMIN_RESOURCES.filter((r) => r.group === group);
                return (
                  <div key={group}>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">{group}</div>
                    <div className="space-y-1">
                      {resources.map((r) => {
                        const perm = permMap.get(r.slug);
                        return (
                          <div key={r.slug} className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface">
                            <span className="flex-1 text-sm text-navy">{r.label}</span>
                            <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                              <input
                                type="checkbox"
                                name={`view_${r.slug}`}
                                defaultChecked={perm ? perm.canView : true}
                                className="accent-teal"
                              />
                              View
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                              <input
                                type="checkbox"
                                name={`edit_${r.slug}`}
                                defaultChecked={perm ? perm.canEdit : false}
                                className="accent-ocean"
                              />
                              Edit
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <button
                type="submit"
                className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors"
              >
                Save Permissions
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
