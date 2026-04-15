// POST /api/price-request — Store a course price enquiry

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// RFC 5322 simplified email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, courseId, message } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email?.trim() || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    await prisma.priceRequest.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        courseId: courseId || null,
        message: message?.trim() || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[price-request]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
