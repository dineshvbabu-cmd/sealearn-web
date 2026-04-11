import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, PlayCircle, FileText, GripVertical, Library } from "lucide-react";
import { deleteModule, deleteLesson } from "@/actions/modules";

export default async function AdminCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/courses" className="text-muted hover:text-navy transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="font-cinzel text-2xl font-bold text-navy">{course.title}</h1>
          <p className="text-muted text-sm mt-0.5">
            {course.stcwRegulation ?? "No STCW"} · {course.modules.length} modules
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/courses/${id}/resources`}
            className="inline-flex items-center gap-2 border border-border text-muted px-4 py-2 rounded-lg hover:bg-surface text-sm transition-colors"
          >
            <Library size={13} /> Library
          </Link>
          <Link
            href={`/admin/courses/${id}/edit`}
            className="inline-flex items-center gap-2 border border-border text-muted px-4 py-2 rounded-lg hover:bg-surface text-sm transition-colors"
          >
            <Pencil size={13} /> Edit Details
          </Link>
          <Link
            href={`/admin/courses/${id}/modules/new`}
            className="inline-flex items-center gap-2 bg-teal text-white font-bold px-4 py-2 rounded-lg hover:bg-teal/90 text-sm transition-colors"
          >
            <Plus size={14} /> Add Module
          </Link>
        </div>
      </div>

      {/* Course info strip */}
      <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 mb-6 flex flex-wrap gap-6 text-sm">
        <div><span className="text-muted text-xs uppercase tracking-wide block mb-0.5">Fee</span><span className="font-bold text-ocean">₦{course.feeNaira.toLocaleString()}</span></div>
        <div><span className="text-muted text-xs uppercase tracking-wide block mb-0.5">Duration</span><span className="font-semibold text-navy">{course.durationWeeks} weeks</span></div>
        <div><span className="text-muted text-xs uppercase tracking-wide block mb-0.5">Level</span><span className="font-semibold text-navy">{course.level.replace("_", " ")}</span></div>
        <div><span className="text-muted text-xs uppercase tracking-wide block mb-0.5">Status</span><span className={`font-bold ${course.isActive ? "text-jade" : "text-danger"}`}>{course.isActive ? "Active" : "Hidden"}</span></div>
      </div>

      {/* Modules */}
      {course.modules.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <div className="text-4xl mb-3">📚</div>
          <h2 className="font-bold text-navy text-lg mb-2">No modules yet</h2>
          <p className="text-muted text-sm mb-5">Add modules to build the course content. Each module can have lessons, videos and PDFs.</p>
          <Link
            href={`/admin/courses/${id}/modules/new`}
            className="inline-flex items-center gap-2 bg-teal text-white font-bold px-5 py-2.5 rounded-lg hover:bg-teal/90 text-sm transition-colors"
          >
            <Plus size={14} /> Add First Module
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((module) => (
            <div key={module.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Module header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60">
                <GripVertical size={16} className="text-muted/40 shrink-0" />
                <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {module.order}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy text-sm">{module.title}</h3>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted">
                    {module.durationMin && <span>{module.durationMin} min</span>}
                    {module.videoUrl && <span className="flex items-center gap-1"><PlayCircle size={11} /> Video</span>}
                    {module.pdfUrl && <span className="flex items-center gap-1"><FileText size={11} /> PDF</span>}
                    <span>{module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/courses/${id}/modules/${module.id}/lessons/new`}
                    className="inline-flex items-center gap-1 text-xs text-jade border border-jade/30 px-2.5 py-1 rounded-lg hover:bg-jade/10 transition-colors"
                  >
                    <Plus size={11} /> Lesson
                  </Link>
                  <Link
                    href={`/admin/courses/${id}/modules/${module.id}/edit`}
                    className="inline-flex items-center gap-1 text-xs text-ocean border border-ocean/30 px-2.5 py-1 rounded-lg hover:bg-ocean/10 transition-colors"
                  >
                    <Pencil size={11} /> Edit
                  </Link>
                  <form action={async () => {
                    "use server";
                    await deleteModule(module.id, id);
                  }}>
                    <button type="submit" className="inline-flex items-center gap-1 text-xs text-danger border border-danger/30 px-2.5 py-1 rounded-lg hover:bg-danger/10 transition-colors">
                      <Trash2 size={11} /> Delete
                    </button>
                  </form>
                </div>
              </div>

              {/* Lessons list */}
              {module.lessons.length > 0 && (
                <div className="divide-y divide-border/40">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3 px-6 py-2.5">
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
                        {lesson.videoUrl ? (
                          <PlayCircle size={14} className="text-teal" />
                        ) : lesson.pdfUrl ? (
                          <FileText size={14} className="text-ocean" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-border" />
                        )}
                      </div>
                      <span className="flex-1 text-xs text-navy">{lesson.order}. {lesson.title}</span>
                      {lesson.durationMin && <span className="text-xs text-muted">{lesson.durationMin} min</span>}
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/courses/${id}/modules/${module.id}/lessons/${lesson.id}/edit`}
                          className="text-xs text-ocean hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteLesson(lesson.id, id);
                        }}>
                          <button type="submit" className="text-xs text-danger hover:underline">Delete</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add lesson prompt if none */}
              {module.lessons.length === 0 && (
                <div className="px-6 py-3 text-xs text-muted flex items-center gap-2">
                  <span>No lessons yet —</span>
                  <Link href={`/admin/courses/${id}/modules/${module.id}/lessons/new`} className="text-ocean hover:underline">
                    add the first lesson
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
