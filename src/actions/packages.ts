"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/auth/admin-login");
}

export async function createPackage(formData: FormData) {
  await requireAdmin();

  const courseIds = formData.getAll("courseIds") as string[];

  const pkg = await prisma.coursePackage.create({
    data: {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      discountPercent: parseInt(formData.get("discountPercent") as string) || 0,
      badgeText: (formData.get("badgeText") as string) || "Bundle Offer",
      badgeColor: (formData.get("badgeColor") as string) || "bg-teal",
      isActive: formData.get("isActive") === "true",
      courses: {
        create: courseIds.map((id) => ({ courseId: id })),
      },
    },
  });

  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/admin/courses/packages");
  redirect("/admin/courses/packages?saved=1");
}

export async function updatePackage(id: string, formData: FormData) {
  await requireAdmin();

  const courseIds = formData.getAll("courseIds") as string[];

  await prisma.coursePackage.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      discountPercent: parseInt(formData.get("discountPercent") as string) || 0,
      badgeText: (formData.get("badgeText") as string) || "Bundle Offer",
      badgeColor: (formData.get("badgeColor") as string) || "bg-teal",
      isActive: formData.get("isActive") === "true",
      courses: {
        deleteMany: {},
        create: courseIds.map((cid) => ({ courseId: cid })),
      },
    },
  });

  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/admin/courses/packages");
  redirect("/admin/courses/packages?saved=1");
}

export async function deletePackage(id: string) {
  await requireAdmin();
  await prisma.coursePackage.delete({ where: { id } });
  revalidatePath("/courses");
  revalidatePath("/");
  revalidatePath("/admin/courses/packages");
}
