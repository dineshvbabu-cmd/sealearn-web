"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function addResource(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const url = formData.get("url") as string;
  const description = formData.get("description") as string;
  const fileSize = formData.get("fileSize") as string;
  const duration = formData.get("duration") as string;
  const topic = formData.get("topic") as string;
  const sortOrderRaw = formData.get("sortOrder") as string;
  const isPublic = formData.get("isPublic") === "on";

  await prisma.courseResource.create({
    data: {
      courseId,
      title: title.trim(),
      type,
      url: url.trim(),
      description: description?.trim() || null,
      fileSize: fileSize?.trim() || null,
      duration: duration?.trim() || null,
      topic: topic?.trim() || null,
      sortOrder: sortOrderRaw ? parseInt(sortOrderRaw) : 0,
      isPublic,
    },
  });

  revalidatePath(`/admin/courses/${courseId}/resources`);
  revalidatePath(`/portal/courses`);
}

export async function deleteResource(id: string, courseId: string) {
  const resource = await prisma.courseResource.findUnique({ where: { id } });
  if (!resource) return;

  // If stored in R2, delete the object
  if (resource.storageKey) {
    try {
      await r2.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: resource.storageKey,
      }));
    } catch {
      // Non-fatal: proceed with DB deletion even if R2 delete fails
    }
  }

  await prisma.courseResource.delete({ where: { id } });
  revalidatePath(`/admin/courses/${courseId}/resources`);
  revalidatePath(`/portal/courses`);
}
