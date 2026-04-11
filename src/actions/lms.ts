"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function markModuleComplete(
  enrolmentId: string,
  moduleId: string,
  courseSlug: string
) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  await prisma.moduleProgress.upsert({
    where: { enrolmentId_moduleId: { enrolmentId, moduleId } },
    update: { percentDone: 100, completedAt: new Date() },
    create: { enrolmentId, moduleId, percentDone: 100, completedAt: new Date() },
  });

  revalidatePath(`/portal/courses/${courseSlug}`);
  revalidatePath(`/portal/courses/${courseSlug}/${moduleId}`);
}
