"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/auth/admin-login");
}

export async function createPost(formData: FormData) {
  await requireAdmin();

  const session = await auth();

  const publishedAt = formData.get("publish") === "true" ? new Date() : null;

  await prisma.post.create({
    data: {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      body: formData.get("body") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      category: (formData.get("category") as string) || "news",
      authorId: session?.user?.id || null,
      publishedAt,
    },
  });

  revalidatePath("/news");
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();

  const publishedAt = formData.get("publish") === "true" ? new Date() : null;

  await prisma.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      body: formData.get("body") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      category: (formData.get("category") as string) || "news",
      publishedAt,
    },
  });

  revalidatePath("/news");
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/news");
  revalidatePath("/admin/news");
}
