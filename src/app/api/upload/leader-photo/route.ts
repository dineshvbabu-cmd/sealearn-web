import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import { getUploadUrl } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID === "your-cloudflare-account-id") {
    return NextResponse.json(
      { error: "File upload is not configured. Please paste an image URL instead." },
      { status: 503 }
    );
  }

  const { fileName, contentType } = await req.json() as { fileName: string; contentType: string };
  if (!fileName || !contentType) {
    return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
  }

  const ext = fileName.split(".").pop() ?? "jpg";
  const key = `leadership/${nanoid()}.${ext}`;
  const uploadUrl = await getUploadUrl(key, contentType);
  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
