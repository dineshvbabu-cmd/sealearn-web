"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// next-auth v5 throws a special NEXT_REDIRECT error on successful signIn.
// It MUST be re-thrown so Next.js can perform the navigation.
function isRedirect(err: unknown): boolean {
  return typeof (err as { digest?: string }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT");
}

// ── Student login ─────────────────────────────────────────────
// Signature matches useActionState: (prevState, formData) => state
export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = (formData.get("email") as string ?? "").trim();
  const password = formData.get("password") as string ?? "";

  if (!email || !password) return { error: "Email and password are required." };

  try {
    await signIn("credentials", { email, password, redirectTo: "/portal/dashboard" });
    return null; // unreachable — signIn always redirects or throws
  } catch (err) {
    if (isRedirect(err)) throw err; // let Next.js handle the navigation
    if (err instanceof AuthError) return { error: "Invalid email or password." };
    console.error("[loginAction]", err);
    return { error: "Login failed. Please try again." };
  }
}

// ── Admin / staff login ────────────────────────────────────────
export async function adminLoginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = (formData.get("email") as string ?? "").trim();
  const password = formData.get("password") as string ?? "";

  if (!email || !password) return { error: "Email and password are required." };

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin/dashboard" });
    return null;
  } catch (err) {
    if (isRedirect(err)) throw err;
    if (err instanceof AuthError) return { error: "Invalid admin credentials." };
    console.error("[adminLoginAction]", err);
    return { error: "Login failed. Please try again." };
  }
}

// ── Register ──────────────────────────────────────────────────
export async function registerAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const name = (formData.get("name") as string ?? "").trim();
  const email = (formData.get("email") as string ?? "").trim();
  const phone = (formData.get("phone") as string ?? "").trim();
  const password = formData.get("password") as string ?? "";
  const confirm = formData.get("confirm") as string ?? "";

  if (!name || !email || !password) return { error: "All fields are required." };
  if (password !== confirm) return { error: "Passwords do not match." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, phone, passwordHash, role: "STUDENT" } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/portal/dashboard" });
    return null;
  } catch (err) {
    if (isRedirect(err)) throw err;
    return { error: "Account created but auto-login failed. Please log in manually." };
  }
}

// ── Logout ────────────────────────────────────────────────────
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
