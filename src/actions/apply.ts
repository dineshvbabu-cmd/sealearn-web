"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  return session.user.id as string;
}

// ── Step 2: Save programme selection ──────────────────────────
export async function saveProgramme(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const userId = await getUser();
  const courseId = (formData.get("courseId") as string ?? "").trim();
  const intakeDateId = (formData.get("intakeDateId") as string ?? "").trim() || null;

  if (!courseId) return { error: "Please select a programme." };

  // Validate course exists
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Invalid programme selected." };

  // Check for existing DRAFT application for this user
  const existing = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
  });

  if (existing) {
    await prisma.application.update({
      where: { id: existing.id },
      data: { courseId, intakeDateId },
    });
  } else {
    await prisma.application.create({
      data: { userId, courseId, intakeDateId, status: "DRAFT" },
    });
  }

  redirect("/apply/personal");
}

// ── Step 3: Save personal details ─────────────────────────────
export async function savePersonal(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const userId = await getUser();

  const dobRaw = formData.get("dateOfBirth") as string;
  const dateOfBirth = dobRaw ? new Date(dobRaw) : null;
  const gender = (formData.get("gender") as string ?? "").trim() || null;
  const stateOfOrigin = (formData.get("stateOfOrigin") as string ?? "").trim() || null;
  const lga = (formData.get("lga") as string ?? "").trim() || null;
  const address = (formData.get("address") as string ?? "").trim() || null;
  const nokName = (formData.get("nokName") as string ?? "").trim() || null;
  const nokRelationship = (formData.get("nokRelationship") as string ?? "").trim() || null;
  const nokPhone = (formData.get("nokPhone") as string ?? "").trim() || null;

  const app = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
  });
  if (!app) redirect("/apply/programme");

  await prisma.application.update({
    where: { id: app.id },
    data: { dateOfBirth, gender, stateOfOrigin, lga, address, nokName, nokRelationship, nokPhone },
  });

  redirect("/apply/documents");
}

// ── Step 4: Save document URLs ────────────────────────────────
export async function saveDocuments(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const userId = await getUser();

  const passportPhotoUrl = (formData.get("passportPhotoUrl") as string ?? "").trim() || null;
  const waecResultUrl = (formData.get("waecResultUrl") as string ?? "").trim() || null;
  const ninDocUrl = (formData.get("ninDocUrl") as string ?? "").trim() || null;
  const medicalCertUrl = (formData.get("medicalCertUrl") as string ?? "").trim() || null;
  const seaServiceUrl = (formData.get("seaServiceUrl") as string ?? "").trim() || null;

  if (!passportPhotoUrl) return { error: "Passport photograph is required." };
  if (!waecResultUrl) return { error: "WAEC/NECO result is required." };
  if (!ninDocUrl) return { error: "NIN document is required." };
  if (!medicalCertUrl) return { error: "Medical certificate (ENG1/ML5) is required." };

  const app = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
  });
  if (!app) redirect("/apply/programme");

  await prisma.application.update({
    where: { id: app.id },
    data: { passportPhotoUrl, waecResultUrl, ninDocUrl, medicalCertUrl, seaServiceUrl },
  });

  redirect("/apply/review");
}

// ── Step 5: Submit application ────────────────────────────────
export async function submitApplication(_formData: FormData): Promise<void> {
  const userId = await getUser();

  const app = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
  });
  if (!app) redirect("/apply/programme");

  // Validate minimum required fields — redirect back if missing
  if (!app.passportPhotoUrl || !app.waecResultUrl || !app.ninDocUrl || !app.medicalCertUrl) {
    redirect("/apply/documents");
  }

  await prisma.application.update({
    where: { id: app.id },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });

  redirect("/portal/dashboard?submitted=1");
}
