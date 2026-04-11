import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/reset-admin?secret=SEED_SECRET&password=NEW_PASSWORD
// Resets (or creates) the admin user's password.
// Protected by SEED_SECRET — remove this route after use.

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const newPassword = req.nextUrl.searchParams.get("password");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sealearn.edu.ng" },
    update: { passwordHash },
    create: {
      email: "admin@sealearn.edu.ng",
      name: "SeaLearn Admin",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  return NextResponse.json({
    success: true,
    message: `Password updated for ${admin.email}`,
  });
}
