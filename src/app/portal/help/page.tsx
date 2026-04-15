import { prisma } from "@/lib/prisma";
import { Video } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  general:    "General",
  admissions: "Admissions",
  portal:     "Student Portal",
  lms:        "LMS & Courses",
  stcw:       "STCW & Certification",
};

export default async function PortalHelpPage() {
  const videos = await prisma.helpVideo.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const categories = [...new Set(videos.map((v) => v.category))];

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Help Centre</h1>
        <p className="text-muted text-sm mt-1">
          Video guides to help you navigate your maritime training journey at SeaLearn Nigeria.
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-14 text-center">
          <Video size={44} className="text-muted mx-auto mb-3" />
          <h2 className="font-bold text-navy mb-2">Help videos coming soon</h2>
          <p className="text-muted text-sm">
            We&apos;re preparing video guides for you. In the meantime, contact us at{" "}
            <a href="mailto:admissions@sealearn.edu.ng" className="text-ocean hover:underline">
              admissions@sealearn.edu.ng
            </a>{" "}
            or call <strong>+234 704 280 6167</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => {
            const catVideos = videos.filter((v) => v.category === cat);
            return (
              <section key={cat}>
                <h2 className="font-cinzel text-lg font-bold text-navy mb-4">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catVideos.map((v) => (
                    <div key={v.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden group">
                      {/* Video embed / thumbnail */}
                      <div className="aspect-video bg-navy/5 relative">
                        {v.videoUrl.includes("youtube.com/embed") || v.videoUrl.includes("youtu.be") ? (
                          <iframe
                            src={v.videoUrl}
                            title={v.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : v.thumbnailUrl ? (
                          <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-navy/80 flex items-center justify-center">
                                <Video size={20} className="text-white ml-0.5" />
                              </div>
                            </div>
                          </a>
                        ) : (
                          <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                            <Video size={32} className="text-muted" />
                          </a>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-navy text-sm mb-1">{v.title}</h3>
                        {v.description && (
                          <p className="text-muted text-xs line-clamp-2">{v.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Still need help? */}
      <div className="mt-12 bg-navy rounded-xl p-6 text-white text-center">
        <h3 className="font-cinzel text-lg font-bold mb-2">Still Need Help?</h3>
        <p className="text-white/60 text-sm mb-4">
          Our admissions team is available Monday–Friday 08:00–17:00 WAT.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:admissions@sealearn.edu.ng"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
          >
            Email Support
          </a>
          <a
            href="tel:+2347042806167"
            className="inline-flex items-center gap-2 border border-white/30 text-white px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            +234 704 280 6167
          </a>
        </div>
      </div>
    </div>
  );
}
