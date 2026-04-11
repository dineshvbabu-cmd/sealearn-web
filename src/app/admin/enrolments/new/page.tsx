import { prisma } from "@/lib/prisma";
import { createEnrolment } from "@/actions/enrollments";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewEnrolmentPage() {
  const [users, courses] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["STUDENT", "CADET"] } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.course.findMany({
      where: { isActive: true },
      select: { id: true, title: true, feeNaira: true },
      orderBy: { title: "asc" },
    }),
  ]);

  async function action(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const courseId = formData.get("courseId") as string;
    await createEnrolment(userId, courseId);
    const { redirect } = await import("next/navigation");
    redirect("/admin/enrolments");
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/enrolments" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Enrol Student</h1>
          <p className="text-muted text-sm mt-0.5">Manually enrol a student into a course (marks as paid/active)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 max-w-lg">
        <form action={action} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Student *</label>
            <select name="userId" required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal bg-white">
              <option value="">Select a student…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-xs text-danger mt-1">No students found. Ask them to register first.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Course *</label>
            <select name="courseId" required className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal bg-white">
              <option value="">Select a course…</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title} — ₦{c.feeNaira.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-muted">
            <strong className="text-navy">Note:</strong> This will immediately activate the enrolment (mark as paid). Use this for manual payments, scholarships, or test accounts.
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-teal text-white font-bold px-6 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm">
              Enrol Student
            </button>
            <Link href="/admin/enrolments" className="border border-border text-muted px-6 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
