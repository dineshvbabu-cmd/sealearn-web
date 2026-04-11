"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SITE_DEFAULTS } from "@/lib/site-config";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) throw new Error("Unauthorized");
}

export async function saveSiteSection(section: string, formData: FormData) {
  await requireAdmin();
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
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admissions");
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED" | "UNDER_REVIEW" | "WAITLISTED"
) {
  await requireAdmin();

  const app = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      reviewedAt: new Date(),
    },
    include: { course: { select: { feeNaira: true } } },
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
    }
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin/enrolments");
}
