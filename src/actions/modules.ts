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

// ── MODULES ──────────────────────────────────────────────────

export async function createModule(courseId: string, formData: FormData) {
  await requireAdmin();

  const count = await prisma.module.count({ where: { courseId } });

  await prisma.module.create({
    data: {
      courseId,
      title: formData.get("title") as string,
      order: Number(formData.get("order") || count + 1),
      videoUrl: (formData.get("videoUrl") as string) || null,
      pdfUrl: (formData.get("pdfUrl") as string) || null,
      durationMin: formData.get("durationMin") ? Number(formData.get("durationMin")) : null,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function updateModule(moduleId: string, courseId: string, formData: FormData) {
  await requireAdmin();

  await prisma.module.update({
    where: { id: moduleId },
    data: {
      title: formData.get("title") as string,
      order: Number(formData.get("order")),
      videoUrl: (formData.get("videoUrl") as string) || null,
      pdfUrl: (formData.get("pdfUrl") as string) || null,
      durationMin: formData.get("durationMin") ? Number(formData.get("durationMin")) : null,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteModule(moduleId: string, courseId: string) {
  await requireAdmin();
  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath(`/admin/courses/${courseId}`);
}

// ── LESSONS ──────────────────────────────────────────────────

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  await requireAdmin();

  const count = await prisma.lesson.count({ where: { moduleId } });

  await prisma.lesson.create({
    data: {
      moduleId,
      title: formData.get("title") as string,
      order: Number(formData.get("order") || count + 1),
      videoUrl: (formData.get("videoUrl") as string) || null,
      pdfUrl: (formData.get("pdfUrl") as string) || null,
      durationMin: formData.get("durationMin") ? Number(formData.get("durationMin")) : null,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function updateLesson(lessonId: string, moduleId: string, courseId: string, formData: FormData) {
  await requireAdmin();

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: formData.get("title") as string,
      order: Number(formData.get("order")),
      videoUrl: (formData.get("videoUrl") as string) || null,
      pdfUrl: (formData.get("pdfUrl") as string) || null,
      durationMin: formData.get("durationMin") ? Number(formData.get("durationMin")) : null,
    },
  });

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/admin/courses/${courseId}`);
}
