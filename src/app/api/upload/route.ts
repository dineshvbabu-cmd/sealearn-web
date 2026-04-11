import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUploadUrl } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType, courseId } = await req.json() as {
    fileName: string;
    contentType: string;
    courseId: string;
  };

  if (!fileName || !contentType || !courseId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify course exists
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const ext = fileName.split(".").pop() ?? "bin";
  const key = `courses/${courseId}/resources/${nanoid()}.${ext}`;

  const uploadUrl = await getUploadUrl(key, contentType);

  return NextResponse.json({ uploadUrl, key });
}
