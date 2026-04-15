import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ClipboardList, CheckCircle, Clock, AlertCircle, TrendingUp, Lock } from "lucide-react";
import { requireEnrolment } from "@/lib/portal-guard";

export default async function AssessmentsPage() {
  const session = await requireEnrolment();

  const enrolments = await prisma.enrolment.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: {
      course: {
        include: {
          modules: {
            include: {
              quizzes: {
                include: {
                  attempts: {
                    where: { userId: session.user.id },
                    orderBy: { startedAt: "desc" },
                    take: 1,
                  },
                  _count: { select: { questions: true } },
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
      progress: true,
    },
  });

  // Flatten all quizzes with context
  const allQuizzes = enrolments.flatMap((e) =>
    e.course.modules.flatMap((mod) => {
      const modProgress = e.progress.find((p) => p.moduleId === mod.id);
      const isUnlocked = (modProgress?.percentDone ?? 0) > 0 || mod.order === 1;
      return mod.quizzes.map((quiz) => ({
        quizId: quiz.id,
        quizTitle: quiz.title,
        moduleTitle: mod.title,
        courseTitle: e.course.title,
        courseSlug: e.course.slug,
        moduleId: mod.id,
        timeLimitMin: quiz.timeLimitMin,
        passMark: quiz.passMark,
        questionCount: quiz._count.questions,
        lastAttempt: quiz.attempts[0] ?? null,
        isUnlocked,
      }));
    })
  );

  // Demo quizzes for when no real quizzes exist
  const demoQuizzes = [
    { id: "demo-1", title: "BST Fire Prevention & Fire Fighting", module: "Module 1: Basic Safety", passMark: 75, questions: 20, timeLimitMin: 30, status: "available", score: null },
    { id: "demo-2", title: "Personal Survival Techniques", module: "Module 1: Basic Safety", passMark: 75, questions: 15, timeLimitMin: 20, status: "passed", score: 82 },
    { id: "demo-3", title: "Elementary First Aid", module: "Module 2: First Aid", passMark: 70, questions: 25, timeLimitMin: 35, status: "failed", score: 58 },
    { id: "demo-4", title: "Radar Navigation & ARPA", module: "Module 3: Navigation", passMark: 80, questions: 30, timeLimitMin: 45, status: "available", score: null },
    { id: "demo-5", title: "Ship Stability Calculations", module: "Module 4: Stability", passMark: 70, questions: 20, timeLimitMin: 30, status: "locked", score: null },
    { id: "demo-6", title: "GMDSS Communications", module: "Module 5: Communications", passMark: 75, questions: 25, timeLimitMin: 40, status: "locked", score: null },
  ];

  const passedCount = demoQuizzes.filter((q) => q.status === "passed").length;
  const failedCount = demoQuizzes.filter((q) => q.status === "failed").length;
  const availableCount = demoQuizzes.filter((q) => q.status === "available").length;

  return (
    <div className="px-6 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-7">
        <div className="text-muted text-xs uppercase tracking-widest mb-1">Student Portal</div>
        <h1 className="font-cinzel text-2xl font-bold text-navy">Mock Assessments</h1>
        <p className="text-muted text-sm mt-1">
          Practice STCW-aligned quizzes for your enrolled courses. Must score above the pass mark to unlock the next module.
        </p>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <div className="bg-jade/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-jade">{allQuizzes.length > 0 ? allQuizzes.filter((q) => q.lastAttempt?.passed).length : passedCount}</div>
          <div className="text-xs text-muted mt-0.5">Passed</div>
        </div>
        <div className="bg-danger/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-danger">{allQuizzes.length > 0 ? allQuizzes.filter((q) => q.lastAttempt && !q.lastAttempt.passed).length : failedCount}</div>
          <div className="text-xs text-muted mt-0.5">Failed (retry)</div>
        </div>
        <div className="bg-ocean/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-ocean">{allQuizzes.length > 0 ? allQuizzes.filter((q) => !q.lastAttempt && q.isUnlocked).length : availableCount}</div>
          <div className="text-xs text-muted mt-0.5">Available</div>
        </div>
      </div>

      {allQuizzes.length === 0 ? (
        // Demo mode — show example quiz list
        <div className="space-y-3">
          <div className="bg-amber/5 border border-amber/20 rounded-xl p-3 text-xs text-amber flex items-center gap-2">
            <AlertCircle size={14} />
            Demo view — quizzes will appear here once your instructor adds them to your course modules.
          </div>
          {demoQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4 ${
                quiz.status === "locked" ? "opacity-60" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                quiz.status === "passed" ? "bg-jade/10" :
                quiz.status === "failed" ? "bg-danger/10" :
                quiz.status === "locked" ? "bg-surface" :
                "bg-ocean/10"
              }`}>
                {quiz.status === "passed" ? <CheckCircle size={18} className="text-jade" /> :
                 quiz.status === "failed" ? <AlertCircle size={18} className="text-danger" /> :
                 quiz.status === "locked" ? <Lock size={18} className="text-muted" /> :
                 <ClipboardList size={18} className="text-ocean" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-navy text-sm">{quiz.title}</div>
                <div className="text-muted text-xs mt-0.5">{quiz.module} · {quiz.questions} questions · {quiz.timeLimitMin} min</div>
                <div className="text-muted text-xs">Pass mark: {quiz.passMark}%</div>
              </div>
              <div className="text-right shrink-0">
                {quiz.status === "passed" && (
                  <div>
                    <div className="text-jade font-bold text-sm">{quiz.score}%</div>
                    <div className="text-[10px] text-jade">Passed ✓</div>
                  </div>
                )}
                {quiz.status === "failed" && (
                  <div>
                    <div className="text-danger font-bold text-sm">{quiz.score}%</div>
                    <div className="text-[10px] text-danger">Failed — retry</div>
                  </div>
                )}
                {quiz.status === "available" && (
                  <button className="bg-ocean text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-navy transition-colors">
                    Start Quiz
                  </button>
                )}
                {quiz.status === "locked" && (
                  <div className="text-muted text-xs flex items-center gap-1">
                    <Lock size={11} /> Locked
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Real quizzes from DB
        <div className="space-y-5">
          {enrolments.map((e) => {
            const courseQuizzes = allQuizzes.filter((q) => q.courseSlug === e.course.slug);
            if (courseQuizzes.length === 0) return null;
            return (
              <div key={e.id}>
                <h2 className="font-cinzel text-lg font-bold text-navy mb-3">{e.course.title}</h2>
                <div className="space-y-2">
                  {courseQuizzes.map((quiz) => {
                    const attempt = quiz.lastAttempt;
                    return (
                      <div key={quiz.quizId} className={`bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4 ${!quiz.isUnlocked ? "opacity-60" : ""}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          attempt?.passed ? "bg-jade/10" :
                          attempt && !attempt.passed ? "bg-danger/10" :
                          !quiz.isUnlocked ? "bg-surface" :
                          "bg-ocean/10"
                        }`}>
                          {attempt?.passed ? <CheckCircle size={18} className="text-jade" /> :
                           attempt && !attempt.passed ? <AlertCircle size={18} className="text-danger" /> :
                           !quiz.isUnlocked ? <Lock size={18} className="text-muted" /> :
                           <ClipboardList size={18} className="text-ocean" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-navy text-sm">{quiz.quizTitle}</div>
                          <div className="text-muted text-xs mt-0.5">{quiz.moduleTitle} · {quiz.questionCount} questions · {quiz.timeLimitMin} min</div>
                          <div className="text-muted text-xs">Pass mark: {quiz.passMark}%</div>
                        </div>
                        <div className="text-right shrink-0">
                          {attempt?.passed && (
                            <div>
                              <div className="text-jade font-bold text-sm">{attempt.score}%</div>
                              <div className="text-[10px] text-jade">Passed ✓</div>
                            </div>
                          )}
                          {attempt && !attempt.passed && (
                            <div>
                              <div className="text-danger font-bold text-sm">{attempt.score}%</div>
                              <div className="text-[10px] text-danger">Failed — retry</div>
                            </div>
                          )}
                          {!attempt && quiz.isUnlocked && (
                            <Link href={`/portal/courses/${quiz.courseSlug}/${quiz.moduleId}`} className="bg-ocean text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-navy transition-colors block">
                              Start Quiz
                            </Link>
                          )}
                          {!quiz.isUnlocked && (
                            <div className="text-muted text-xs flex items-center gap-1">
                              <Lock size={11} /> Complete previous module
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STCW info box */}
      <div className="mt-6 bg-navy/5 border border-navy/15 rounded-xl p-4 flex items-start gap-3">
        <TrendingUp size={18} className="text-navy shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-navy text-sm mb-1">STCW Competency Assessment</div>
          <p className="text-muted text-xs leading-relaxed">
            All quizzes are aligned to IMO STCW competency standards. A minimum pass mark of 70–80% is required per module.
            Failed assessments may be retried after a 24-hour cooling period. Your scores are visible to your instructor.
          </p>
        </div>
      </div>
    </div>
  );
}
