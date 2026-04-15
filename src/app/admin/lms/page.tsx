import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExternalLink, Link2, Link2Off } from "lucide-react";

async function saveLmsUrl(enrolmentId: string, formData: FormData) {
  "use server";
  const stepLmsUrl = (formData.get("stepLmsUrl") as string)?.trim() || null;
  const lmsActive = formData.get("lmsActive") === "true";
  await prisma.enrolment.update({
    where: { id: enrolmentId },
    data: { stepLmsUrl, lmsActive },
  });
  revalidatePath("/admin/lms");
}

async function revokeLms(enrolmentId: string) {
  "use server";
  await prisma.enrolment.update({
    where: { id: enrolmentId },
    data: { lmsActive: false, lmsRevokedAt: new Date() },
  });
  revalidatePath("/admin/lms");
}

function timeAgo(date: Date) {
  const d = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d} days ago`;
}

export default async function LmsAdminPage() {
  const enrolments = await prisma.enrolment.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const active = enrolments.filter((e) => e.lmsActive && e.stepLmsUrl);
  const pending = enrolments.filter((e) => !e.stepLmsUrl || !e.lmsActive);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">LMS Integration — Step LMS</h1>
        <p className="text-muted text-sm mt-1">
          Assign Step LMS deep-link URLs to active enrolments. Students see an &ldquo;Open LMS&rdquo; button in their portal when lmsActive = true.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Enrolments", value: enrolments.length, color: "text-navy" },
          { label: "LMS Active", value: active.length, color: "text-jade" },
          { label: "Pending LMS Link", value: pending.length, color: "text-amber" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
            <div className={`font-cinzel text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {enrolments.map((enrolment) => {
          const saveAction = saveLmsUrl.bind(null, enrolment.id);
          return (
            <div key={enrolment.id} className="bg-white rounded-xl border border-border shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-navy text-sm">{enrolment.user.name}</span>
                    {enrolment.lmsActive && enrolment.stepLmsUrl ? (
                      <span className="text-[10px] font-bold text-jade bg-jade/10 border border-jade/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Link2 size={10} /> LMS Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber bg-amber/10 border border-amber/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Link2Off size={10} /> No LMS Link
                      </span>
                    )}
                    {enrolment.lmsRevokedAt && (
                      <span className="text-[10px] text-danger">revoked {timeAgo(enrolment.lmsRevokedAt)}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">{enrolment.user.email} · {enrolment.course.title}</p>
                </div>

                {/* Current link */}
                {enrolment.stepLmsUrl && (
                  <a
                    href={enrolment.stepLmsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-ocean flex items-center gap-1 hover:underline shrink-0"
                  >
                    <ExternalLink size={11} /> Open in LMS
                  </a>
                )}
              </div>

              {/* Edit form */}
              <form action={saveAction} className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  name="stepLmsUrl"
                  defaultValue={enrolment.stepLmsUrl ?? ""}
                  placeholder="https://step.sealearn.uk/course/..."
                  className="flex-1 text-xs border border-border rounded-lg px-3 py-2 outline-none focus:border-ocean"
                />
                <label className="flex items-center gap-1.5 text-xs text-muted shrink-0 self-center">
                  <input
                    type="checkbox"
                    name="lmsActive"
                    value="true"
                    defaultChecked={enrolment.lmsActive}
                    className="rounded"
                  />
                  Activate
                </label>
                <button
                  type="submit"
                  className="bg-ocean text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-navy transition-colors shrink-0"
                >
                  Save
                </button>
                {enrolment.lmsActive && (
                  <form action={revokeLms.bind(null, enrolment.id)}>
                    <button
                      type="submit"
                      className="bg-danger/10 text-danger text-xs font-bold px-3 py-2 rounded-lg hover:bg-danger hover:text-white transition-colors"
                    >
                      Revoke
                    </button>
                  </form>
                )}
              </form>
            </div>
          );
        })}
        {enrolments.length === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center text-muted text-sm">
            No active enrolments yet. Accept applications to create enrolments.
          </div>
        )}
      </div>

      <div className="mt-4 bg-ocean/5 border border-ocean/20 rounded-lg p-3 text-xs text-muted">
        <strong className="text-navy">How it works:</strong> Enter the student&apos;s direct Step LMS course URL and check &ldquo;Activate&rdquo;. The student will see an &ldquo;Open LMS&rdquo; button in their portal dashboard. Use &ldquo;Revoke&rdquo; to remove access (records the revocation time for audit).
      </div>
    </div>
  );
}
