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

export async function createLeader(formData: FormData) {
  await requireAdmin();
  const count = await prisma.leadershipMember.count();
  await prisma.leadershipMember.create({
    data: {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      credential: (formData.get("credential") as string) || null,
      bio: (formData.get("bio") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      sortOrder: count,
      isActive: true,
    },
  });
  revalidatePath("/about");
  revalidatePath("/admin/about/leadership");
  redirect("/admin/about/leadership?saved=1");
}

export async function updateLeader(id: string, formData: FormData) {
  await requireAdmin();
  await prisma.leadershipMember.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      title: formData.get("title") as string,
      credential: (formData.get("credential") as string) || null,
      bio: (formData.get("bio") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      isActive: formData.get("isActive") === "true",
    },
  });
  revalidatePath("/about");
  revalidatePath("/admin/about/leadership");
  redirect("/admin/about/leadership?saved=1");
}

export async function deleteLeader(id: string) {
  await requireAdmin();
  await prisma.leadershipMember.delete({ where: { id } });
  revalidatePath("/about");
  revalidatePath("/admin/about/leadership");
}

export async function moveLeader(id: string, direction: "up" | "down") {
  await requireAdmin();
  const member = await prisma.leadershipMember.findUnique({ where: { id } });
  if (!member) return;

  const swap = await prisma.leadershipMember.findFirst({
    where: direction === "up"
      ? { sortOrder: { lt: member.sortOrder } }
      : { sortOrder: { gt: member.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });

  if (!swap) return;

  await prisma.$transaction([
    prisma.leadershipMember.update({ where: { id }, data: { sortOrder: swap.sortOrder } }),
    prisma.leadershipMember.update({ where: { id: swap.id }, data: { sortOrder: member.sortOrder } }),
  ]);

  revalidatePath("/about");
  revalidatePath("/admin/about/leadership");
}
