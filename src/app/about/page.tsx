import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getSiteSection } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";

const accreditations = [
  { icon: "🇳🇬", label: "NIMASA", detail: "Institutional approval — all programmes" },
  { icon: "🌊", label: "IMO", detail: "IMO Model Course alignment" },
  { icon: "⚓", label: "STCW 2010", detail: "Manila amendment compliance" },
  { icon: "🏆", label: "ISO 9001", detail: "Quality Management System" },
  { icon: "🎓", label: "NUC", detail: "National Universities Commission" },
  { icon: "🔱", label: "BIMCO", detail: "Baltic & International Maritime Council" },
];

export default async function AboutPage() {
  const [cfg, leaders] = await Promise.all([
    getSiteSection("about"),
    prisma.leadershipMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const highlights = [1,2,3,4]
    .map(n => cfg[`highlight_${n}`])
    .filter(Boolean);

  const values = [1,2,3,4,5,6]
    .map(n => ({
      icon: cfg[`value${n}_icon`],
      title: cfg[`value${n}_title`],
      body: cfg[`value${n}_body`],
    }))
    .filter(v => v.title);

  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Module 02 · About SeaLearn
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold leading-snug mb-3">
            About Us &amp; Accreditations
          </h1>
          <p className="text-white/55 text-base max-w-xl">
            Nigeria's premier maritime training institute — NIMASA approved, IMO/STCW 2010 Manila
            compliant, shaping world-class seafarers since 2000.
          </p>
        </div>
      </div>
      <div className="divbar" />

      {/* Mission & Vision */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-teal/10 text-teal text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Mission &amp; Vision
            </div>
            <h2 className="font-cinzel text-2xl text-navy font-bold mb-4">
              {cfg.mission_heading}
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              <strong className="text-navy">Mission:</strong> {cfg.mission}
            </p>
            <p className="text-muted leading-relaxed mb-6">
              <strong className="text-navy">Vision:</strong> {cfg.vision}
            </p>
            {highlights.length > 0 && (
              <div className="space-y-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle size={14} className="text-teal shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={cfg.mission_image_url || "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs1.jpg"}
              alt="SeaLearn Nigeria campus"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      {values.length > 0 && (
        <section className="bg-surface py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-gold/15 text-amber text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Core Values
              </div>
              <h2 className="font-cinzel text-2xl text-navy font-bold">What We Stand For</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-xl p-5 border-l-4 border-teal shadow-sm">
                  <div className="text-2xl mb-2">{v.icon}</div>
                  <h3 className="font-bold text-navy text-sm mb-1">{v.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Accreditations */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-ocean/10 text-ocean text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Accreditations &amp; Affiliations
          </div>
          <h2 className="font-cinzel text-2xl text-navy font-bold">
            Recognised by the Best in the Industry
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {accreditations.map((a) => (
            <div key={a.label} className="bg-white border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-surface flex items-center justify-center text-3xl shrink-0">
                {a.icon}
              </div>
              <div>
                <div className="font-bold text-navy text-sm">{a.label}</div>
                <div className="text-muted text-xs mt-0.5">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      {leaders.length > 0 && (
        <section className="bg-navy py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Leadership Team
              </div>
              <h2 className="font-cinzel text-2xl text-white font-bold">Meet Our Leadership</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {leaders.map((l) => (
                <div key={l.id} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    {l.imageUrl ? (
                      <Image
                        src={l.imageUrl}
                        alt={l.name}
                        fill
                        className="object-cover rounded-full border-2 border-gold"
                        unoptimized
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-gold bg-white/10 flex items-center justify-center text-2xl">
                        👤
                      </div>
                    )}
                  </div>
                  <h3 className="text-white text-sm font-bold leading-tight">{l.name}</h3>
                  <p className="text-white/45 text-xs mt-0.5">{l.title}</p>
                  {l.credential && (
                    <span className="inline-block mt-2 bg-ocean text-white text-[10px] px-2 py-0.5 rounded-full">
                      {l.credential}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Campus gallery */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <h2 className="font-cinzel text-2xl text-navy font-bold mb-6">Campus Life</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs1.jpg",
            "https://sealearn.uk/wp-content/uploads/2025/07/About-sea-imgs3.jpg",
            "https://sealearn.uk/wp-content/uploads/2025/08/About-imgs3.jpg",
            "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg",
          ].map((src, i) => (
            <div key={i} className="relative h-44 rounded-xl overflow-hidden">
              <Image src={src} alt={`Campus ${i + 1}`} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-12 px-6 text-center">
        <h2 className="font-cinzel text-2xl text-white font-bold mb-3">
          Ready to Join SeaLearn Nigeria?
        </h2>
        <p className="text-white/60 mb-6">June 2025 intake applications are open. Deadline: 30 April 2025.</p>
        <Link
          href="/admissions"
          className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-yellow-400 transition-colors"
        >
          Apply Now <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
