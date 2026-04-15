"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// ── Shared validators ─────────────────────────────────────────
const nameRegex = /^[\p{L}\s'\-\.]{2,100}$/u;
const repetitiveRegex = /(.)\1{4,}/;

function isValidPhone(v: string): boolean {
  const digits = (v.match(/\d/g) ?? []).length;
  if (digits < 7 || digits > 15) return false;
  const stripped = v.replace(/\D/g, "");
  if (/^(\d)\1+$/.test(stripped)) return false;
  if (v.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(v);
    return !!parsed?.isValid();
  }
  return true; // local format accepted
}

const PersonalSchema = z.object({
  dateOfBirth: z.string()
    .min(1, "Date of birth is required.")
    .refine((v) => {
      const d = new Date(v);
      if (isNaN(d.getTime())) return false;
      const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 16 && age <= 80;
    }, "Applicant must be between 16 and 80 years old."),
  gender: z.enum(["Male", "Female", "Prefer not to say"], { error: "Please select a valid gender." }),
  stateOfOrigin: z.string().min(1, "Please select a state of origin."),
  lga: z.string().max(80).optional().refine(
    (v) => !v || (nameRegex.test(v) && !repetitiveRegex.test(v)),
    "LGA should only contain letters and spaces."
  ),
  address: z.string()
    .min(10, "Please enter a full address (at least 10 characters).")
    .max(500, "Address is too long.")
    .refine((v) => /\p{L}.*\p{L}/u.test(v), "Address must contain readable text.")
    .refine((v) => !repetitiveRegex.test(v), "Please enter a real address.")
    .refine((v) => !/^(test|asdf|qwerty|hello|abc|xxx|n\/a|none)\b/i.test(v.trim()), "Please enter your actual address."),
  nokName: z.string()
    .min(2, "Next of kin name must be at least 2 characters.")
    .max(100)
    .refine((v) => nameRegex.test(v.trim()), "Name should only contain letters, spaces, hyphens, or apostrophes — no numbers.")
    .refine((v) => !repetitiveRegex.test(v), "Please enter a real name."),
  nokRelationship: z.string().min(1, "Please select a relationship."),
  nokPhone: z.string()
    .min(1, "Phone number is required.")
    .refine(isValidPhone, "Please enter a valid phone number with country code (e.g. +234 803 000 0000)."),
});

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

  const raw = {
    dateOfBirth: (formData.get("dateOfBirth") as string ?? "").trim(),
    gender: (formData.get("gender") as string ?? "").trim(),
    stateOfOrigin: (formData.get("stateOfOrigin") as string ?? "").trim(),
    lga: (formData.get("lga") as string ?? "").trim() || undefined,
    address: (formData.get("address") as string ?? "").trim(),
    nokName: (formData.get("nokName") as string ?? "").trim(),
    nokRelationship: (formData.get("nokRelationship") as string ?? "").trim(),
    nokPhone: (formData.get("nokPhone") as string ?? "").trim(),
  };

  const result = PersonalSchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    return { error: first.message };
  }

  const data = result.data;

  const app = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
  });
  if (!app) redirect("/apply/programme");

  await prisma.application.update({
    where: { id: app.id },
    data: {
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      stateOfOrigin: data.stateOfOrigin,
      lga: data.lga ?? null,
      address: data.address,
      nokName: data.nokName,
      nokRelationship: data.nokRelationship,
      nokPhone: data.nokPhone,
    },
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
