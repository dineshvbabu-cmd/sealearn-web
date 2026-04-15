import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time fix: swap imageUrl between Balamurugan and Hakeem Odeinde
// GET /api/fix-leader-photos?secret=SEED_SECRET
export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Find both leaders (partial name match)
  const all = await prisma.leadershipMember.findMany();
  const bala = all.find((m) => m.name.toLowerCase().includes("bala"));
  const hakeem = all.find((m) => m.name.toLowerCase().includes("hakeem") || m.name.toLowerCase().includes("odeinde"));

  if (!bala || !hakeem) {
    return NextResponse.json({
      error: "Could not find both members",
      found: all.map((m) => ({ id: m.id, name: m.name, imageUrl: m.imageUrl })),
    }, { status: 404 });
  }

  // Swap their imageUrls
  const balaImg = bala.imageUrl;
  const hakeemImg = hakeem.imageUrl;

  await prisma.$transaction([
    prisma.leadershipMember.update({ where: { id: bala.id }, data: { imageUrl: hakeemImg } }),
    prisma.leadershipMember.update({ where: { id: hakeem.id }, data: { imageUrl: balaImg } }),
  ]);

  return NextResponse.json({
    success: true,
    swapped: [
      { name: bala.name, oldImage: balaImg, newImage: hakeemImg },
      { name: hakeem.name, oldImage: hakeemImg, newImage: balaImg },
    ],
  });
}
