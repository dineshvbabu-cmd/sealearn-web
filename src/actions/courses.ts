"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { CourseLevel } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/auth/admin-login");
}

export async function createCourse(formData: FormData) {
  await requireAdmin();

  await prisma.course.create({
    data: {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      stcwRegulation: (formData.get("stcwRegulation") as string) || null,
      level: formData.get("level") as CourseLevel,
      durationWeeks: Number(formData.get("durationWeeks")),
      feeNaira: Number(formData.get("feeNaira")),
      applicationFee: Number(formData.get("applicationFee") || 15000),
      description: formData.get("description") as string,
      eligibility: formData.get("eligibility") as string,
      outcomes: formData.get("outcomes") as string,
      nimasaApproved: formData.get("nimasaApproved") === "true",
      nimasaRefNumber: (formData.get("nimasaRefNumber") as string) || null,
      isActive: true,
    },
  });

  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?saved=1");
}

export async function updateCourse(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.course.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      stcwRegulation: (formData.get("stcwRegulation") as string) || null,
      level: formData.get("level") as CourseLevel,
      durationWeeks: Number(formData.get("durationWeeks")),
      feeNaira: Number(formData.get("feeNaira")),
      applicationFee: Number(formData.get("applicationFee") || 15000),
      description: formData.get("description") as string,
      eligibility: formData.get("eligibility") as string,
      outcomes: formData.get("outcomes") as string,
      nimasaApproved: formData.get("nimasaApproved") === "true",
      nimasaRefNumber: (formData.get("nimasaRefNumber") as string) || null,
      isActive: formData.get("isActive") === "true",
    },
  });

  revalidatePath("/courses");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?saved=1");
}

export async function deleteCourse(id: string) {
  await requireAdmin();
  await prisma.course.delete({ where: { id } });
  revalidatePath("/courses");
  revalidatePath("/admin/courses");
}

export async function toggleCourseActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.course.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/courses");
}
