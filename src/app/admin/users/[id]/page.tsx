import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, User, Monitor } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// ── Admin page permissions (for STAFF roles) ──────────────────
const ADMIN_RESOURCES = [
  { slug: "dashboard",       label: "Dashboard",        group: "Core" },
  { slug: "content",         label: "Content / CMS",    group: "Core" },
  { slug: "courses",         label: "Courses & Fees",   group: "Academic" },
  { slug: "applications",    label: "Applications",     group: "Academic" },
  { slug: "enrolments",      label: "Enrolments",       group: "Academic" },
  { slug: "waitlist",        label: "Waitlist",         group: "Academic" },
  { slug: "lms",             label: "LMS Links",        group: "Academic" },
  { slug: "price-requests",  label: "Price Requests",   group: "Finance" },
  { slug: "payments",        label: "Payments",         group: "Finance" },
  { slug: "users",           label: "Users & Students", group: "Admin" },
  { slug: "news",            label: "News & Events",    group: "Content" },
  { slug: "subscribers",     label: "Subscribers",      group: "Content" },
  { slug: "help-videos",     label: "Help Videos",      group: "Content" },
  { slug: "email-templates", label: "Email Templates",  group: "Admin" },
  { slug: "activity",        label: "Activity Log",     group: "Admin" },
  { slug: "settings",        label: "Settings",         group: "Admin" },
];
const ADMIN_GROUPS = ["Core", "Academic", "Finance", "Content", "Admin"];

// ── Portal page permissions (for STUDENT / CADET) ─────────────
const PORTAL_RESOURCES = [
  { slug: "portal:courses",        label: "My Courses (LMS)",  group: "Learning" },
  { slug: "portal:assessments",    label: "Mock Assessments",  group: "Learning" },
  { slug: "portal:timetable",      label: "Timetable",         group: "Learning" },
  { slug: "portal:grades",         label: "Grades & KPI",      group: "Learning" },
  { slug: "portal:practical-log",  label: "Practical Log",     group: "Learning" },
  { slug: "portal:simulator",      label: "Simulator Booking", group: "Learning" },
  { slug: "portal:library",        label: "Library",           group: "Learning" },
  { slug: "portal:certificates",   label: "My Certificates",   group: "Records" },
  { slug: "portal:fees",           label: "Fees & Payments",   group: "Records" },
  { slug: "portal:notifications",  label: "Notifications",     group: "Records" },
  { slug: "portal:help",           label: "Help Centre",       group: "Records" },
];
const PORTAL_GROUPS = ["Learning", "Records"];

// ── Role classification ────────────────────────────────────────
const STUDENT_ROLES = ["STUDENT", "CADET", "GUEST"];
const STAFF_ROLES   = ["INSTRUCTOR", "LMS_ADMIN", "REGISTRAR"];
const ADMIN_ROLES   = ["ADMIN", "SUPER_ADMIN"];
const ALL_ROLES     = ["GUEST", "CADET", "STUDENT", "INSTRUCTOR", "LMS_ADMIN", "REGISTRAR", "ADMIN", "SUPER_ADMIN"];

const roleColors: Record<string, string> = {
  STUDENT:    "bg-ocean/10 text-ocean",
  ADMIN:      "bg-gold/10 text-gold",
  SUPER_ADMIN:"bg-danger/10 text-danger",
  INSTRUCTOR: "bg-teal/10 text-teal",
  REGISTRAR:  "bg-jade/10 text-jade",
  LMS_ADMIN:  "bg-amber/10 text-amber",
  CADET:      "bg-steel/10 text-steel",
  GUEST:      "bg-surface text-muted",
};

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
  if (!ADMIN_ROLES.includes(actorRole)) redirect("/admin/dashboard");

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, role: true, createdAt: true,
      _count: { select: { enrolments: true, applications: true } },
      permissions: true,
    },
  });

  if (!user) notFound();

  const isStudentRole = STUDENT_ROLES.includes(user.role);
  const isStaffRole   = STAFF_ROLES.includes(user.role);
  const isAdminRole   = ADMIN_ROLES.includes(user.role);

  // Build permission map
  const permMap = new Map(user.permissions.map((p) => [p.resource, { canView: p.canView, canEdit: p.canEdit }]));

  // Save portal permissions (for STUDENT/CADET) — view-only toggles
  async function savePortalPermissions(fd: FormData) {
    "use server";
    const ops = PORTAL_RESOURCES.map((r) => {
      const canView = fd.get(`view_${r.slug}`) === "on";
      return prisma.userPermission.upsert({
        where: { userId_resource: { userId: id, resource: r.slug } },
        update: { canView, canEdit: false },
        create: { userId: id, resource: r.slug, canView, canEdit: false },
      });
    });
    await prisma.$transaction(ops);
    revalidatePath(`/admin/users/${id}`);
    redirect(`/admin/users/${id}?saved=1`);
  }

  // Save admin permissions (for STAFF) — view + edit toggles
  async function saveAdminPermissions(fd: FormData) {
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
    // Clear permissions when role changes — context will differ
    await prisma.userPermission.deleteMany({ where: { userId: id } });
    await prisma.user.update({ where: { id }, data: { role: newRole as never } });
    revalidatePath(`/admin/users/${id}`);
    redirect(`/admin/users/${id}?saved=1`);
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-muted hover:text-navy"><ArrowLeft size={18} /></Link>
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
          <p className="text-muted text-xs mb-4">
            Changing role clears existing permissions (context changes with role).
          </p>
          <form action={changeRole} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Assign Role</label>
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
            <button type="submit" className="w-full bg-ocean text-white font-bold py-2 rounded-lg hover:bg-ocean/90 text-sm transition-colors">
              Update Role
            </button>
          </form>
        </div>

        {/* ── Permissions panel — context depends on user role ── */}
        <div className="lg:col-span-2">

          {/* ADMIN / SUPER_ADMIN — full access, no restrictions */}
          {isAdminRole && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5 h-full flex flex-col justify-center items-center text-center gap-3">
              <Shield size={32} className="text-gold" />
              <h2 className="font-bold text-navy">Full System Access</h2>
              <p className="text-muted text-sm max-w-xs">
                {user.role.replace("_", " ")} has unrestricted access to all admin pages and the student portal. Page-level permissions do not apply.
              </p>
              <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${roleColors[user.role]}`}>
                {user.role.replace("_", " ")}
              </span>
            </div>
          )}

          {/* STAFF — admin page permissions (view + edit) */}
          {isStaffRole && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <h2 className="font-bold text-navy mb-1 flex items-center gap-2">
                <Shield size={16} className="text-ocean" /> Admin Panel Permissions
              </h2>
              <p className="text-muted text-xs mb-4">
                Controls which admin pages this staff member can see and edit.
              </p>
              <form action={saveAdminPermissions}>
                <div className="space-y-5">
                  {ADMIN_GROUPS.map((group) => {
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
                                  <input type="checkbox" name={`view_${r.slug}`} defaultChecked={perm ? perm.canView : true} className="accent-teal" />
                                  View
                                </label>
                                <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                                  <input type="checkbox" name={`edit_${r.slug}`} defaultChecked={perm ? perm.canEdit : false} className="accent-ocean" />
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
                  <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors">
                    Save Admin Permissions
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STUDENT / CADET / GUEST — portal page permissions (view only) */}
          {isStudentRole && (
            <div className="bg-white rounded-xl border border-border shadow-sm p-5">
              <h2 className="font-bold text-navy mb-1 flex items-center gap-2">
                <Monitor size={16} className="text-teal" /> Student Portal Access
              </h2>
              <p className="text-muted text-xs mb-4">
                Controls which portal pages this student can see. Dashboard, Fees, Help and Notifications are always visible.
                If no restrictions are set, all pages are shown.
              </p>
              <form action={savePortalPermissions}>
                <div className="space-y-5">
                  {PORTAL_GROUPS.map((group) => {
                    const resources = PORTAL_RESOURCES.filter((r) => r.group === group);
                    return (
                      <div key={group}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">{group}</div>
                        <div className="space-y-1">
                          {resources.map((r) => {
                            const perm = permMap.get(r.slug);
                            // Default true — show page unless explicitly turned off
                            const defaultVisible = perm ? perm.canView : true;
                            return (
                              <div key={r.slug} className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface">
                                <span className="flex-1 text-sm text-navy">{r.label}</span>
                                <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                                  <input type="checkbox" name={`view_${r.slug}`} defaultChecked={defaultVisible} className="accent-teal" />
                                  Visible
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
                  <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors">
                    Save Portal Permissions
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
