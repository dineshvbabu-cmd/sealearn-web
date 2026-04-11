import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, FileText, Clock } from "lucide-react";

export default async function LMSCourseModulesPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const session = await auth();
  if (!session) redirect("/auth/login");

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  // Verify the user is enrolled
  const enrolment = await prisma.enrolment.findFirst({
    where: { userId: session.user.id, courseId: course.id },
    include: { progress: true },
  });

  if (!enrolment) redirect("/portal/courses");

  // Block access if payment not completed
  if (enrolment.status === "PENDING_PAYMENT") {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <Link href="/portal/courses" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy mb-6">
          <ArrowLeft size={14} /> My Courses
        </Link>
        <div className="bg-white rounded-xl border border-amber/30 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber" />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-navy mb-2">Payment Required</h2>
          <p className="text-muted text-sm mb-1">
            Your enrolment for <strong>{course.title}</strong> is pending payment.
          </p>
          <p className="text-muted text-sm mb-6">
            Complete your tuition payment to unlock all course content.
          </p>
          <div className="bg-surface rounded-lg p-4 inline-block text-left mb-6">
            <p className="text-xs text-muted mb-1">Amount due</p>
            <p className="text-2xl font-bold text-navy">₦{enrolment.totalFee.toLocaleString()}</p>
            {enrolment.amountPaid > 0 && (
              <p className="text-xs text-jade mt-1">₦{enrolment.amountPaid.toLocaleString()} already paid</p>
            )}
          </div>
          <div>
            <Link
              href="/portal/fees"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Pay Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressMap = new Map(enrolment.progress.map((p) => [p.moduleId, p]));

  const totalModules = course.modules.length;
  const completedModules = enrolment.progress.filter((p) => p.completedAt !== null).length;
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/portal/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        My Courses
      </Link>

      {/* Course header */}
      <div className="bg-navy rounded-xl p-6 mb-6 text-white">
        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2">
          {course.stcwRegulation ?? "STCW Programme"}
        </p>
        <h1 className="font-cinzel text-xl font-bold mb-3">{course.title}</h1>
        <div className="flex items-center gap-6 text-white/50 text-xs mb-4">
          <span className="flex items-center gap-1"><Clock size={12} />{course.durationWeeks} weeks</span>
          <span>{totalModules} modules</span>
        </div>
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Progress</span>
            <span>{completedModules}/{totalModules} modules · {progressPercent}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules list */}
      {course.modules.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-10 text-center">
          <FileText size={40} className="text-muted mx-auto mb-3" />
          <h2 className="font-bold text-navy mb-2">Content coming soon</h2>
          <p className="text-muted text-sm">
            Module content is being prepared by your instructor. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {course.modules.map((module, index) => {
            const progress = progressMap.get(module.id);
            const isCompleted = !!progress?.completedAt;
            const isUnlocked = index === 0 || !!progressMap.get(course.modules[index - 1]?.id)?.completedAt;

            return (
              <div
                key={module.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                  isUnlocked ? "border-border hover:shadow-md" : "border-border/50 opacity-60"
                } transition-shadow`}
              >
                {/* Module header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? "bg-jade/10 text-jade"
                          : isUnlocked
                          ? "bg-teal/10 text-teal"
                          : "bg-surface text-muted"
                      }`}
                    >
                      {isCompleted ? <CheckCircle size={16} /> : isUnlocked ? <PlayCircle size={16} /> : <Lock size={14} />}
                    </div>
                    <div>
                      <p className="text-xs text-muted">Module {module.order}</p>
                      <h3 className="font-bold text-navy text-sm">{module.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {module.durationMin && (
                      <span className="text-xs text-muted hidden sm:block">{module.durationMin} min</span>
                    )}
                    {isUnlocked && (
                      <Link
                        href={`/portal/courses/${courseSlug}/${module.id}`}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          isCompleted
                            ? "bg-jade/10 text-jade hover:bg-jade/20"
                            : "bg-gold text-navy hover:bg-yellow-400"
                        }`}
                      >
                        {isCompleted ? "Review" : "Start"}
                      </Link>
                    )}
                    {!isUnlocked && (
                      <span className="text-xs text-muted px-3 py-1.5 bg-surface rounded-lg">Locked</span>
                    )}
                  </div>
                </div>

                {/* Lessons list */}
                {module.lessons.length > 0 && (
                  <div className="border-t border-border/50 divide-y divide-border/50">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="px-5 py-2.5 flex items-center gap-3 text-xs text-muted">
                        {lesson.videoUrl ? (
                          <PlayCircle size={12} className="text-teal shrink-0" />
                        ) : lesson.pdfUrl ? (
                          <FileText size={12} className="text-ocean shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-border shrink-0" />
                        )}
                        <span>{lesson.title}</span>
                        {lesson.durationMin && <span className="ml-auto">{lesson.durationMin} min</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
