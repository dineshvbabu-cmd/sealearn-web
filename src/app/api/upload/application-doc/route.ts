import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import { getUploadUrl } from "@/lib/r2";

const ALLOWED_DOC_TYPES = ["passport", "waec", "nin", "medical", "seaservice"] as const;
type DocType = (typeof ALLOWED_DOC_TYPES)[number];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID === "your-cloudflare-account-id") {
    return NextResponse.json(
      { error: "File upload is not configured. Please contact admissions to submit documents." },
      { status: 503 }
    );
  }

  const { fileName, contentType, docType } = (await req.json()) as {
    fileName: string;
    contentType: string;
    docType: DocType;
  };

  if (!fileName || !contentType || !docType) {
    return NextResponse.json({ error: "Missing fileName, contentType, or docType" }, { status: 400 });
  }

  if (!ALLOWED_DOC_TYPES.includes(docType)) {
    return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
  }

  // Only allow images and PDFs
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and PDF files are allowed." }, { status: 400 });
  }

  const ext = fileName.split(".").pop() ?? "pdf";
  const userId = (session.user as { id?: string })?.id ?? "unknown";
  const key = `applications/${userId}/${docType}-${nanoid()}.${ext}`;
  const uploadUrl = await getUploadUrl(key, contentType);
  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
