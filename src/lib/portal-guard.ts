import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Call at the top of any portal page that requires an active enrolment.
 * Unenrolled students are sent back to the dashboard (Application Pending screen).
 * Returns the session so the page doesn't need a second auth() call.
 */
export async function requireEnrolment() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const role = (session.user as { role?: string })?.role ?? "STUDENT";

  // Admin / staff can preview everything — no restriction
  const UNRESTRICTED = ["ADMIN", "SUPER_ADMIN", "INSTRUCTOR", "REGISTRAR", "LMS_ADMIN"];
  if (UNRESTRICTED.includes(role)) return session;

  // Students / cadets must have at least one enrolment to access gated pages
  const count = await prisma.enrolment.count({ where: { userId: session.user.id } });
  if (count === 0) redirect("/portal/dashboard");

  return session;
}
