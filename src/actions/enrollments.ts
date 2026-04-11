"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }
}

export async function createEnrolment(userId: string, courseId: string) {
  await requireAdmin();
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { feeNaira: true } });
  if (!course) throw new Error("Course not found");

  await prisma.enrolment.create({
    data: {
      userId,
      courseId,
      status: "ACTIVE",
      totalFee: course.feeNaira,
      amountPaid: course.feeNaira,
      startDate: new Date(),
    },
  });
  revalidatePath("/admin/enrolments");
}

export async function updateEnrolmentStatus(
  enrolmentId: string,
  status: "PENDING_PAYMENT" | "ACTIVE" | "COMPLETED" | "SUSPENDED" | "WITHDRAWN"
) {
  await requireAdmin();
  await prisma.enrolment.update({
    where: { id: enrolmentId },
    data: { status },
  });
  revalidatePath("/admin/enrolments");
}

export async function deleteEnrolment(enrolmentId: string) {
  await requireAdmin();
  await prisma.enrolment.delete({ where: { id: enrolmentId } });
  revalidatePath("/admin/enrolments");
}
