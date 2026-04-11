import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, FileText, PlayCircle } from "lucide-react";
import { markModuleComplete } from "@/actions/lms";

export default async function ModuleViewerPage({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleId: string }>;
}) {
  const { courseSlug, moduleId } = await params;
  const session = await auth();
  if (!session) redirect("/auth/login");

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
    },
  });

  if (!course) notFound();

  const module = course.modules.find((m) => m.id === moduleId);
  if (!module) notFound();

  const enrolment = await prisma.enrolment.findFirst({
    where: { userId: session.user.id, courseId: course.id },
    include: { progress: { where: { moduleId } } },
  });

  if (!enrolment) redirect("/portal/courses");

  const isCompleted = !!enrolment.progress[0]?.completedAt;
  const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
  const prevModule = moduleIndex > 0 ? course.modules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < course.modules.length - 1 ? course.modules[moduleIndex + 1] : null;

  const completeAction = markModuleComplete.bind(null, enrolment.id, moduleId, courseSlug);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-3 text-sm">
          <Link href={`/portal/courses/${courseSlug}`} className="text-muted hover:text-navy flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} />
            {course.title}
          </Link>
          <span className="text-muted">/</span>
          <span className="text-navy font-semibold">Module {module.order}: {module.title}</span>
          {isCompleted && <CheckCircle size={14} className="text-jade ml-1" />}
        </div>

        {/* Video player area */}
        <div className="flex-1 p-6">
          {module.videoUrl ? (
            <div className="bg-black rounded-xl overflow-hidden aspect-video w-full max-w-4xl mb-6">
              <iframe
                src={module.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-navy/5 border border-border rounded-xl aspect-video w-full max-w-4xl mb-6 flex items-center justify-center">
              <div className="text-center text-muted">
                <PlayCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Video content not yet uploaded</p>
              </div>
            </div>
          )}

          {/* Module content */}
          <div className="max-w-4xl">
            <h1 className="font-cinzel text-xl font-bold text-navy mb-2">
              Module {module.order}: {module.title}
            </h1>
            {module.durationMin && (
              <p className="text-muted text-sm mb-5">Estimated time: {module.durationMin} minutes</p>
            )}

            {/* Lessons */}
            {module.lessons.length > 0 && (
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="font-bold text-navy text-sm">Lessons in this module</h2>
                </div>
                <div className="divide-y divide-border">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center shrink-0">
                        {lesson.videoUrl ? (
                          <PlayCircle size={14} className="text-teal" />
                        ) : lesson.pdfUrl ? (
                          <FileText size={14} className="text-ocean" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-border" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy">{lesson.title}</p>
                        {lesson.durationMin && (
                          <p className="text-xs text-muted">{lesson.durationMin} min</p>
                        )}
                      </div>
                      {lesson.pdfUrl && (
                        <a
                          href={lesson.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-ocean border border-ocean/30 px-2.5 py-1 rounded-lg hover:bg-ocean/10 transition-colors"
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF download */}
            {module.pdfUrl && (
              <div className="bg-ocean/5 border border-ocean/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <FileText size={20} className="text-ocean shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">Module Notes PDF</p>
                  <p className="text-xs text-muted">Downloadable study materials for this module</p>
                </div>
                <a
                  href={module.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-ocean border border-ocean/30 px-4 py-2 rounded-lg hover:bg-ocean/10 transition-colors"
                >
                  Download
                </a>
              </div>
            )}

            {/* Mark complete + navigation */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3">
                {prevModule && (
                  <Link
                    href={`/portal/courses/${courseSlug}/${prevModule.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-muted border border-border px-4 py-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <ArrowLeft size={14} /> Previous
                  </Link>
                )}
              </div>
              <div className="flex gap-3">
                {!isCompleted && (
                  <form action={completeAction}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-jade text-white font-bold text-sm px-5 py-2 rounded-lg hover:bg-jade/90 transition-colors"
                    >
                      <CheckCircle size={14} /> Mark as Complete
                    </button>
                  </form>
                )}
                {isCompleted && nextModule && (
                  <Link
                    href={`/portal/courses/${courseSlug}/${nextModule.id}`}
                    className="inline-flex items-center gap-2 bg-gold text-navy font-bold text-sm px-5 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Next Module <ArrowRight size={14} />
                  </Link>
                )}
                {isCompleted && !nextModule && (
                  <Link
                    href={`/portal/courses/${courseSlug}`}
                    className="inline-flex items-center gap-2 bg-jade text-white font-bold text-sm px-5 py-2 rounded-lg hover:bg-jade/90 transition-colors"
                  >
                    <CheckCircle size={14} /> Course Complete!
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar — module list */}
      <div className="hidden lg:block w-72 bg-white border-l border-border overflow-y-auto">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide">{course.title}</p>
        </div>
        <div className="divide-y divide-border">
          {course.modules.map((m, index) => {
            const isCurrent = m.id === moduleId;
            const isDone = false; // TODO: check progress map
            return (
              <Link
                key={m.id}
                href={`/portal/courses/${courseSlug}/${m.id}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isCurrent ? "bg-navy/5 border-l-2 border-gold" : "hover:bg-surface"
                }`}
              >
                <span className={`text-xs font-bold w-5 text-center shrink-0 ${isCurrent ? "text-gold" : "text-muted"}`}>
                  {index + 1}
                </span>
                <span className={`flex-1 text-xs leading-snug ${isCurrent ? "font-bold text-navy" : "text-muted"}`}>
                  {m.title}
                </span>
                {isDone && <CheckCircle size={12} className="text-jade shrink-0" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
