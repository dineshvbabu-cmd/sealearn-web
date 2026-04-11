import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, FileText, Video, Download, ExternalLink, Lock,
  BookOpen, Presentation,
} from "lucide-react";
import { getDownloadUrl } from "@/lib/r2";

export default async function CourseResourcesPage({
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
      resources: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    },
  });

  if (!course) notFound();

  const enrolment = await prisma.enrolment.findFirst({
    where: { userId: session.user.id, courseId: course.id },
  });

  if (!enrolment) redirect("/portal/courses");

  // Payment gate
  if (enrolment.status === "PENDING_PAYMENT") {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <Link href={`/portal/courses/${courseSlug}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy mb-6">
          <ArrowLeft size={14} /> Back to Course
        </Link>
        <div className="bg-white rounded-xl border border-amber/30 p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber" />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-navy mb-2">Payment Required</h2>
          <p className="text-muted text-sm mb-6">Complete your tuition payment to access the course library.</p>
          <Link href="/portal/fees" className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
            Pay Now
          </Link>
        </div>
      </div>
    );
  }

  // Resolve presigned URLs for R2-stored files
  const resourcesWithUrls = await Promise.all(
    course.resources.map(async (r) => {
      let accessUrl = r.url;
      if (r.storageKey) {
        try {
          accessUrl = await getDownloadUrl(r.storageKey);
        } catch {
          // fallback to stored URL
        }
      }
      return { ...r, accessUrl };
    })
  );

  // Group by topic
  const grouped = resourcesWithUrls.reduce<Record<string, typeof resourcesWithUrls>>(
    (acc, r) => {
      const key = r.topic ?? "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    },
    {}
  );

  const typeIcon = (type: string) => {
    if (type === "video") return <Video size={15} className="text-amber" />;
    if (type === "ppt") return <Presentation size={15} className="text-teal" />;
    return <FileText size={15} className="text-ocean" />;
  };

  const typeBg = (type: string) => {
    if (type === "video") return "bg-amber/10";
    if (type === "ppt") return "bg-teal/10";
    return "bg-ocean/10";
  };

  const typeLabel = (type: string) => {
    if (type === "video") return "VIDEO";
    if (type === "ppt") return "PRESENTATION";
    if (type === "pdf") return "PDF";
    return type.toUpperCase();
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link href={`/portal/courses/${courseSlug}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Course
      </Link>

      {/* Header */}
      <div className="bg-navy rounded-xl p-6 mb-6 text-white">
        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Library</p>
        <h1 className="font-cinzel text-xl font-bold mb-1">{course.title}</h1>
        <p className="text-white/50 text-sm">{course.resources.length} resources · Videos, PDFs & Presentations</p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <BookOpen size={40} className="text-muted mx-auto mb-3" />
          <h2 className="font-bold text-navy mb-2">No resources yet</h2>
          <p className="text-muted text-sm">Your instructor will add course materials here soon.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([topic, items]) => (
            <div key={topic} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Topic header */}
              <div className="px-5 py-4 border-b border-border bg-surface/50 flex items-center gap-2">
                <BookOpen size={14} className="text-muted" />
                <h2 className="font-bold text-navy text-sm">{topic}</h2>
                <span className="text-xs text-muted ml-auto">{items.length} resource{items.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="divide-y divide-border/60">
                {items.map((r) => (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${typeBg(r.type)}`}>
                        {typeIcon(r.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy text-sm leading-snug">{r.title}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {typeLabel(r.type)}
                          {r.fileSize && ` · ${r.fileSize}`}
                          {r.duration && ` · ${r.duration}`}
                        </p>
                        {r.description && (
                          <p className="text-xs text-muted mt-1 leading-relaxed">{r.description}</p>
                        )}
                      </div>
                      <a
                        href={r.accessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          r.type === "pdf" || r.storageKey
                            ? "bg-ocean/10 text-ocean hover:bg-ocean/20"
                            : "bg-amber/10 text-amber hover:bg-amber/20"
                        }`}
                      >
                        {r.type === "pdf" || r.storageKey ? (
                          <><Download size={12} /> Download</>
                        ) : (
                          <><ExternalLink size={12} /> Open</>
                        )}
                      </a>
                    </div>

                    {/* Inline YouTube embed */}
                    {r.type === "video" && r.accessUrl.includes("youtube.com/embed") && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-border">
                        <div className="relative" style={{ paddingBottom: "56.25%" }}>
                          <iframe
                            src={r.accessUrl}
                            title={r.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
