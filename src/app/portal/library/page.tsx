import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, Video, ExternalLink, Download, Presentation } from "lucide-react";

export default async function LibraryPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  // Get all active enrolments with course resources
  const enrolments = await prisma.enrolment.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["ACTIVE", "COMPLETED"] },
    },
    include: {
      course: {
        include: {
          resources: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const typeIcon = (type: string) => {
    if (type === "video") return <Video size={14} className="text-amber" />;
    if (type === "ppt") return <Presentation size={14} className="text-teal" />;
    return <FileText size={14} className="text-ocean" />;
  };

  const typeBg = (type: string) => {
    if (type === "video") return "bg-amber/10";
    if (type === "ppt") return "bg-teal/10";
    return "bg-ocean/10";
  };

  const totalResources = enrolments.reduce((sum, e) => sum + e.course.resources.length, 0);

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-navy">Library</h1>
          <p className="text-muted text-sm mt-1">
            {totalResources} resource{totalResources !== 1 ? "s" : ""} across {enrolments.length} enrolled course{enrolments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {enrolments.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <BookOpen size={40} className="text-muted mx-auto mb-3" />
          <h2 className="font-bold text-navy mb-2">No resources yet</h2>
          <p className="text-muted text-sm mb-5">Enrol in a course to access its library materials.</p>
          <Link href="/portal/courses" className="inline-flex items-center gap-2 bg-teal text-white font-bold px-5 py-2.5 rounded-lg hover:bg-teal/90 transition-colors text-sm">
            My Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {enrolments.map((enrolment) => {
            const { course } = enrolment;
            if (course.resources.length === 0) return null;

            // Group by topic
            const grouped = course.resources.reduce<Record<string, typeof course.resources>>(
              (acc, r) => {
                const key = r.topic ?? "General";
                if (!acc[key]) acc[key] = [];
                acc[key].push(r);
                return acc;
              },
              {}
            );

            return (
              <div key={enrolment.id}>
                {/* Course heading */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-teal" />
                    <h2 className="font-cinzel font-bold text-navy text-base">{course.title}</h2>
                  </div>
                  <Link
                    href={`/portal/courses/${course.slug}/resources`}
                    className="text-xs text-ocean font-semibold hover:underline"
                  >
                    View all →
                  </Link>
                </div>

                {Object.entries(grouped).map(([topic, items]) => (
                  <div key={topic} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-3 border-b border-border bg-surface/50">
                      <span className="font-bold text-navy text-sm">{topic}</span>
                      <span className="text-xs text-muted ml-2">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {items.map((r) => (
                        <div key={r.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface/40 transition-colors group">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeBg(r.type)}`}>
                            {typeIcon(r.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-navy truncate">{r.title}</p>
                            <p className="text-xs text-muted">
                              {r.type.toUpperCase()}
                              {r.fileSize && ` · ${r.fileSize}`}
                              {r.duration && ` · ${r.duration}`}
                            </p>
                          </div>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted hover:text-ocean transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {r.storageKey ? <Download size={14} /> : <ExternalLink size={14} />}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Fallback if all enrolled courses have no resources */}
          {enrolments.every((e) => e.course.resources.length === 0) && (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <BookOpen size={40} className="text-muted mx-auto mb-3" />
              <h2 className="font-bold text-navy mb-2">Resources coming soon</h2>
              <p className="text-muted text-sm">Your instructors are preparing course materials. Check back soon.</p>
            </div>
          )}
        </div>
      )}

      {/* External links */}
      <div className="mt-8 bg-navy rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-gold" />
          <h2 className="font-cinzel font-bold text-gold">External Resources</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { name: "IMO Official Website", desc: "International Maritime Organization", url: "https://www.imo.org" },
            { name: "NIMASA Nigeria", desc: "Nigerian Maritime Administration", url: "https://www.nimasa.gov.ng" },
            { name: "UK MCA Publications", desc: "Maritime & Coastguard Agency", url: "https://www.gov.uk/government/organisations/maritime-and-coastguard-agency" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold group-hover:text-gold transition-colors">{link.name}</p>
                <p className="text-white/40 text-[10px]">{link.desc}</p>
              </div>
              <ExternalLink size={12} className="text-white/30 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
