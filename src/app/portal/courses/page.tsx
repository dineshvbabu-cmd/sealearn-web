import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, PlayCircle, ArrowRight } from "lucide-react";
import { requireEnrolment } from "@/lib/portal-guard";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-jade/10 text-jade",
  COMPLETED: "bg-ocean/10 text-ocean",
  PENDING_PAYMENT: "bg-amber/10 text-amber",
  SUSPENDED: "bg-danger/10 text-danger",
  WITHDRAWN: "bg-steel/10 text-muted",
};

export default async function LMSCoursesPage() {
  const session = await requireEnrolment();

  const enrolments = await prisma.enrolment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: { modules: { orderBy: { order: "asc" } } },
      },
      progress: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-6 py-8">
      <div className="mb-7">
        <h1 className="font-cinzel text-2xl font-bold text-navy">My Courses</h1>
        <p className="text-muted text-sm mt-1">
          {enrolments.length} enrolment{enrolments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {enrolments.length === 0 && (
        <div className="bg-white rounded-xl border border-border p-10 text-center">
          <BookOpen size={40} className="text-muted mx-auto mb-3" />
          <h2 className="font-bold text-navy text-lg mb-2">No courses yet</h2>
          <p className="text-muted text-sm mb-5">
            You haven&apos;t been enrolled in any courses. Apply for a programme to get started.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-5 py-2.5 rounded-full text-sm hover:bg-yellow-400 transition-colors"
          >
            Browse Courses <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {enrolments.map((enrolment) => {
          const course = enrolment.course;
          const totalModules = course.modules.length;
          const completedModules = enrolment.progress.filter((p) => p.completedAt !== null).length;
          const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

          const cardHref = enrolment.status === "PENDING_PAYMENT"
            ? "/portal/fees"
            : `/portal/courses/${course.slug}`;

          return (
            <Link
              key={enrolment.id}
              href={cardHref}
              className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow group p-5 flex flex-col ${
                enrolment.status === "PENDING_PAYMENT"
                  ? "border-amber/30 bg-amber/5"
                  : "border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-teal" />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[enrolment.status] ?? "bg-surface text-muted"}`}>
                  {enrolment.status.replace("_", " ")}
                </span>
              </div>

              <h3 className="font-bold text-navy text-sm leading-tight mb-1 group-hover:text-ocean transition-colors">
                {course.title}
              </h3>
              {course.stcwRegulation && (
                <p className="text-muted text-xs mb-4">STCW {course.stcwRegulation}</p>
              )}

              {/* Progress bar */}
              {totalModules > 0 && enrolment.status === "ACTIVE" && (
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>{completedModules}/{totalModules} modules</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {totalModules === 0 && enrolment.status === "ACTIVE" && (
                <div className="mt-auto flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />
                  Course content coming soon
                </div>
              )}

              {enrolment.status === "COMPLETED" && (
                <div className="mt-auto flex items-center gap-1 text-xs text-jade font-semibold">
                  <CheckCircle size={12} />
                  Completed
                </div>
              )}

              {enrolment.status === "PENDING_PAYMENT" && (
                <div className="mt-auto space-y-2">
                  <div className="text-xs text-amber font-semibold flex items-center gap-1">
                    💳 Payment required to access content
                  </div>
                  <div className="text-[10px] text-muted">
                    Outstanding: ₦{(enrolment.totalFee - enrolment.amountPaid).toLocaleString()}
                  </div>
                </div>
              )}

              {enrolment.status === "ACTIVE" && (
                <div className="mt-3 flex items-center gap-1 text-ocean text-xs font-semibold group-hover:gap-2 transition-all">
                  <PlayCircle size={12} />
                  Continue Learning
                </div>
              )}

              {enrolment.status === "PENDING_PAYMENT" && (
                <div className="mt-3 flex items-center gap-1 text-amber text-xs font-bold">
                  💳 Pay Now
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
