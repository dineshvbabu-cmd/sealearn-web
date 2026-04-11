import Image from "next/image";
import Link from "next/link";
import { courses, newsItems } from "@/lib/data";
import { ArrowRight, CheckCircle, Shield, Award, Users } from "lucide-react";
import { getSiteSection } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";

const featureIcons = [
  <Shield key="shield" size={22} className="text-teal" />,
  <Award key="award" size={22} className="text-gold" />,
  <Users key="users" size={22} className="text-ocean" />,
  <CheckCircle key="check" size={22} className="text-jade" />,
];

const accreditations = [
  { icon: "🇳🇬", label: "NIMASA" },
  { icon: "🌊", label: "IMO" },
  { icon: "⚓", label: "STCW 2010" },
  { icon: "🏆", label: "ISO 9001" },
  { icon: "🎓", label: "NUC" },
];

const levelTagColor: Record<string, string> = {
  PRE_SEA: "bg-teal", SHORT_COURSE: "bg-gold", DEGREE: "bg-ocean",
  POST_COC: "bg-jade", REFRESHER: "bg-steel",
};
const levelTag: Record<string, string> = {
  PRE_SEA: "Pre-Sea", SHORT_COURSE: "Short Course", DEGREE: "Degree",
  POST_COC: "Post-CoC", REFRESHER: "Refresher",
};
const fallbackImages = [
  "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
];

export default async function HomePage() {
  const [cfg, dbCourses, dbNews] = await Promise.all([
    getSiteSection("homepage"),
    prisma.course.findMany({ where: { isActive: true }, orderBy: { level: "asc" }, take: 3 }).catch(() => []),
    prisma.post.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
  ]);

  // Normalize DB courses to display shape; fall back to static if empty
  const catColor: Record<string, string> = { news: "text-ocean", event: "text-jade", announcement: "text-amber" };
  const catLabel: Record<string, string> = { news: "News", event: "Event", announcement: "Announcement" };

  const featuredCourses = dbCourses.length
    ? dbCourses.map((c, i) => ({
        ...c,
        imageUrl: fallbackImages[i % fallbackImages.length],
        tag: levelTag[c.level] ?? c.level,
        tagColor: levelTagColor[c.level] ?? "bg-navy",
        durationText: `${c.durationWeeks} Weeks`,
        feeText: `₦${c.feeNaira.toLocaleString()}`,
      }))
    : courses.slice(0, 3);

  const latestNews = (dbNews.length ? dbNews.map((p) => ({
    ...p,
    imageUrl: p.imageUrl ?? fallbackImages[0],
    categoryColor: catColor[p.category] ?? "text-ocean",
    categoryLabel: catLabel[p.category] ?? p.category,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "",
  })) : newsItems.slice(0, 3)) as typeof newsItems;

  const statsBar = [
    { value: cfg.stat_students, label: cfg.stat_students_label },
    { value: cfg.stat_passrate, label: cfg.stat_passrate_label },
    { value: cfg.stat_partners, label: cfg.stat_partners_label },
    { value: cfg.stat_years, label: cfg.stat_years_label },
  ];
  const features = [1,2,3,4].map((n, i) => ({
    icon: featureIcons[i],
    title: cfg[`feature${n}_title`],
    body: cfg[`feature${n}_body`],
  }));

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-navy via-ocean to-teal overflow-hidden">
        {/* Background ship image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1600&q=80"
            alt="Maritime vessel"
            fill
            className="object-cover opacity-15"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              {cfg.hero_badge}
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight mb-4">
              {cfg.hero_title}
            </h1>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8">
              {cfg.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/admissions" className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors">
                {cfg.hero_cta_primary} <ArrowRight size={16} />
              </Link>
              <Link href="/courses" className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                {cfg.hero_cta_secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <div className="bg-gold">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4">
          {statsBar.map((s, i) => (
            <div key={i} className={`py-4 px-4 text-center ${i < statsBar.length - 1 ? "border-r border-black/10" : ""}`}>
              <div className="font-cinzel text-2xl font-bold text-navy">{s.value}</div>
              <div className="text-navy/60 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY SEALEARN ──────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-teal/10 text-teal text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Why Choose SeaLearn
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-navy font-bold">
            Nigeria's Most Trusted Maritime Academy
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-bold text-navy text-sm mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT SNIPPET ─────────────────────────────────────── */}
      <section className="bg-navy py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              About SeaLearn Nigeria
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mb-5 leading-tight">
              Shaping World-Class Nigerian Seafarers Since 2000
            </h2>
            <p className="text-white/55 leading-relaxed mb-5">
              SeaLearn Nigeria is the foremost NIMASA-approved maritime training institute, located
              at Apapa Port Road, Lagos. We deliver IMO/STCW 2010 Manila compliant programmes
              from Pre-Sea Cadet through to Master CoC, serving over 3,200 graduates now serving
              on vessels worldwide.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "NIMASA-approved for all programmes",
                "State-of-the-art Class A bridge and engine room simulators",
                "50% instalment plan available",
                "AI-powered student support chatbot (24/7)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-white/65 text-sm">
                  <CheckCircle size={15} className="text-teal shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-colors text-sm"
            >
              Learn More About Us <ArrowRight size={14} />
            </Link>
          </div>
          {/* Accreditations grid */}
          <div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {accreditations.map((a) => (
                <div
                  key={a.label}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className="text-white/60 text-xs font-bold">{a.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-white/30 text-xs mb-1">ISO Certified</div>
              <div className="text-white/70 font-bold text-sm">
                ISO 9001:2015 Quality Management System
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ──────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-block bg-ocean/10 text-ocean text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              STCW Programmes
            </div>
            <h2 className="font-cinzel text-2xl text-navy font-bold">Featured Courses</h2>
          </div>
          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-ocean font-semibold hover:underline"
          >
            View all courses <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <span
                  className={`inline-block text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${course.tagColor}`}
                >
                  {course.tag}
                </span>
                <h3 className="font-bold text-navy text-sm leading-tight mb-1">{course.title}</h3>
                <p className="text-muted text-xs mb-3">{course.durationText} · NIMASA Approved</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean">{course.feeText}</span>
                  <span className="inline-flex items-center gap-1 bg-navy text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⚓ {course.stcwRegulation}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm text-ocean font-semibold"
          >
            View all courses <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── NEWS PREVIEW ──────────────────────────────────────── */}
      <section className="bg-surface py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block bg-jade/10 text-jade text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                Latest Updates
              </div>
              <h2 className="font-cinzel text-2xl text-navy font-bold">News & Events</h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-ocean font-semibold hover:underline"
            >
              All news <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestNews.map((item) => (
              <div
                key={item.slug}
                className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-36">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className={`text-xs font-bold uppercase tracking-wide ${item.categoryColor}`}>
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-bold text-navy text-sm leading-snug mt-1 mb-2">{item.title}</h3>
                  <p className="text-muted text-xs line-clamp-2 leading-relaxed">{item.excerpt}</p>
                  <p className="text-muted text-xs mt-2">{item.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-teal to-ocean py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold mb-3">
            Ready to Start Your Maritime Career?
          </h2>
          <p className="text-white/60 mb-7">
            Applications for June 2025 intake are open. Deadline: 30 April 2025.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-yellow-400 transition-colors"
            >
              Apply Now — June 2025 Intake <ArrowRight size={16} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Browse Programmes
            </Link>
          </div>
          <p className="text-white/35 text-xs mt-5">
            Application fee: ₦15,000 · Pay via Paystack, Flutterwave, USSD *737# or bank transfer
          </p>
        </div>
      </section>
    </>
  );
}
