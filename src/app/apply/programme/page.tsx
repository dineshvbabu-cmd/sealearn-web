import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { saveProgramme } from "@/actions/apply";
import ProgrammeForm from "./ProgrammeForm";

export default async function ProgrammePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const userId = session.user.id as string;

  // Check if user already has a non-DRAFT application (already submitted)
  const submitted = await prisma.application.findFirst({
    where: { userId, status: { in: ["SUBMITTED", "UNDER_REVIEW", "ACCEPTED"] } },
  });
  if (submitted) redirect("/portal/dashboard");

  // Load existing DRAFT to pre-fill
  const draft = await prisma.application.findFirst({
    where: { userId, status: "DRAFT" },
    select: { courseId: true, intakeDateId: true },
  });

  // Load active courses with open intake dates
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    include: {
      intakeDates: {
        where: { isOpen: true, deadline: { gte: new Date() } },
        orderBy: { startDate: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-8 pt-7 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-ocean" />
          <h1 className="font-cinzel text-navy text-xl font-bold">Select Your Programme</h1>
        </div>
        <p className="text-muted text-sm">Step 2 of 5 — Choose the course you wish to apply for.</p>
      </div>

      <div className="px-8 py-6">
        <ProgrammeForm
          courses={courses}
          defaultCourseId={draft?.courseId ?? ""}
          defaultIntakeDateId={draft?.intakeDateId ?? ""}
          action={saveProgramme}
        />
      </div>
    </div>
  );
}
