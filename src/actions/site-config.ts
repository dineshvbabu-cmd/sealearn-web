"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SITE_DEFAULTS } from "@/lib/site-config";
import { logActivity } from "@/lib/activity";

const STAFF_ROLES = ["ADMIN", "SUPER_ADMIN", "REGISTRAR", "INSTRUCTOR"];

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || !STAFF_ROLES.includes(role ?? "")) throw new Error("Unauthorized");
  return session;
}

export async function saveSiteSection(section: string, formData: FormData) {
  const session = await requireAdmin();
  const defaults = SITE_DEFAULTS[section as keyof typeof SITE_DEFAULTS] ?? {};

  const updates = Object.keys(defaults).map((key) => {
    const value = (formData.get(key) as string) ?? "";
    return prisma.siteConfig.upsert({
      where: { section_key: { section, key } },
      update: { value },
      create: { section, key, value, label: key, type: "text" },
    });
  });

  await Promise.all(updates);

  await logActivity({
    actorId: session.user?.id,
    actorName: session.user?.name ?? undefined,
    actorRole: (session.user as { role?: string })?.role ?? undefined,
    action: "UPDATED_CMS",
    entity: "SiteConfig",
    entityLabel: section,
    detail: `Updated ${Object.keys(defaults).length} fields in "${section}" section`,
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admissions");
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED" | "UNDER_REVIEW" | "WAITLISTED"
) {
  const session = await requireAdmin();

  const app = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      reviewedAt: new Date(),
    },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true, feeNaira: true } },
    },
  });

  await logActivity({
    actorId: session.user?.id,
    actorName: session.user?.name ?? undefined,
    actorRole: (session.user as { role?: string })?.role ?? undefined,
    action: status === "ACCEPTED" ? "APPROVED_APPLICATION" : status === "REJECTED" ? "REJECTED_APPLICATION" : "UPDATED_APPLICATION",
    entity: "Application",
    entityId: applicationId,
    entityLabel: `${app.user.name} → ${app.course.title}`,
    detail: `Status changed to ${status}`,
  });

  // Auto-create enrolment when accepted
  if (status === "ACCEPTED") {
    const existing = await prisma.enrolment.findFirst({
      where: { userId: app.userId, courseId: app.courseId },
    });
    if (!existing) {
      await prisma.enrolment.create({
        data: {
          userId: app.userId,
          courseId: app.courseId,
          status: "PENDING_PAYMENT",
          totalFee: app.course.feeNaira,
          amountPaid: 0,
        },
      });
      await logActivity({
        actorId: session.user?.id,
        actorName: session.user?.name ?? undefined,
        actorRole: (session.user as { role?: string })?.role ?? undefined,
        action: "ENROLLED_STUDENT",
        entity: "Enrolment",
        entityLabel: `${app.user.name} → ${app.course.title}`,
        detail: "Enrolment created automatically on application acceptance",
      });
    }
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/enrolments");
  revalidatePath("/admin/waitlist");
  revalidatePath("/admin/activity");
}
