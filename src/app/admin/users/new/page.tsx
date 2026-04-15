import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import bcrypt from "bcryptjs";

// Which roles each actor can create
const CREATABLE_ROLES: Record<string, string[]> = {
  SUPER_ADMIN: ["STUDENT", "CADET", "INSTRUCTOR", "LMS_ADMIN", "REGISTRAR", "ADMIN", "SUPER_ADMIN"],
  ADMIN:       ["STUDENT", "CADET", "INSTRUCTOR", "LMS_ADMIN", "REGISTRAR"],
  REGISTRAR:   ["STUDENT", "CADET"],
};

const ROLE_LABELS: Record<string, string> = {
  STUDENT:    "Student",
  CADET:      "Cadet (Pre-Sea)",
  INSTRUCTOR: "Instructor",
  LMS_ADMIN:  "LMS Admin",
  REGISTRAR:  "Registrar",
  ADMIN:      "Admin",
  SUPER_ADMIN:"Super Admin",
};

export default async function NewUserPage() {
  const session = await auth();
  const actorRole = (session?.user as { role?: string })?.role ?? "";

  const creatableRoles = CREATABLE_ROLES[actorRole] ?? [];
  if (creatableRoles.length === 0) redirect("/admin/users");

  async function createUser(fd: FormData) {
    "use server";
    const s = await auth();
    const role = (s?.user as { role?: string })?.role ?? "";
    const allowed = CREATABLE_ROLES[role] ?? [];

    const name     = (fd.get("name") as string).trim();
    const email    = (fd.get("email") as string).trim().toLowerCase();
    const phone    = (fd.get("phone") as string | null)?.trim() || null;
    const newRole  = fd.get("role") as string;
    const password = (fd.get("password") as string);

    if (!name || !email || !password || !allowed.includes(newRole)) return;

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, phone, role: newRole as never, passwordHash },
    });

    revalidatePath("/admin/users");
    redirect("/admin/users?saved=1");
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-muted hover:text-navy">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Add New User</h1>
          <p className="text-muted text-sm mt-0.5">Create a new portal account</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-lg">
        <form action={createUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Full Name *</label>
            <input name="name" required placeholder="e.g. Emeka Okafor" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Email Address *</label>
            <input name="email" type="email" required placeholder="user@example.com" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Phone Number</label>
            <input name="phone" type="tel" placeholder="+234 700 000 0000" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Role *</label>
            <select name="role" required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white">
              <option value="">— Select role —</option>
              {creatableRoles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
              ))}
            </select>
            <p className="text-[11px] text-muted mt-1">
              {actorRole === "SUPER_ADMIN" && "Super Admin can create any role."}
              {actorRole === "ADMIN" && "Admin can create Students, Cadets, and Staff (not other Admins)."}
              {actorRole === "REGISTRAR" && "Registrar can only create Students and Cadets."}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Temporary Password *</label>
            <input name="password" type="password" required minLength={8} placeholder="Min. 8 characters" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-ocean" />
            <p className="text-[11px] text-muted mt-1">User should change this on first login.</p>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors">
              Create User
            </button>
            <Link href="/admin/users" className="border border-border text-muted px-5 py-2.5 rounded-lg hover:bg-surface text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
