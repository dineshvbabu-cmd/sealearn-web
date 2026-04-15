import Image from "next/image";
import Link from "next/link";
import { courses as staticCourses } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CoursePicker from "@/components/CoursePicker";

const LEVEL_LABEL: Record<string, string> = {
  PRE_SEA: "Pre-Sea", SHORT_COURSE: "Short Course",
  DEGREE: "Degree Level", POST_COC: "Post-CoC", REFRESHER: "Refresher",
};

const levelBadge: Record<string, string> = {
  "Pre-Sea": "bg-teal/10 text-teal", "Short Course": "bg-gold/15 text-amber",
  "Degree Level": "bg-ocean/10 text-ocean", "Post-CoC": "bg-jade/10 text-jade",
  Refresher: "bg-steel/10 text-muted",
};

export default async function CoursesPage() {
  const [dbCourses, dbPackages] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: [{ level: "asc" }, { title: "asc" }],
      select: { id: true, slug: true, title: true, stcwRegulation: true, level: true, durationWeeks: true, feeNaira: true, nimasaApproved: true },
    }).catch(() => []),
    prisma.coursePackage.findMany({
      where: { isActive: true },
      include: { courses: { select: { courseId: true } } },
      orderBy: { discountPercent: "desc" },
    }).catch(() => []),
  ]);

  function durationText(weeks: number) {
    if (weeks >= 52) return `${Math.round(weeks / 52)} Year${weeks >= 104 ? "s" : ""}`;
    if (weeks >= 4) return `${weeks} Weeks`;
    return `${weeks * 5} Days`;
  }

  const courses = dbCourses.length > 0
    ? dbCourses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        stcwRegulation: c.stcwRegulation ?? "—",
        level: c.level,
        durationWeeks: c.durationWeeks,
        durationText: durationText(c.durationWeeks),
        feeNaira: c.feeNaira,
        feeText: `₦${c.feeNaira.toLocaleString()}`,
        imageUrl: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=800&q=80",
        tagColor: c.level === "PRE_SEA" ? "bg-teal" : c.level === "SHORT_COURSE" ? "bg-gold" : c.level === "POST_COC" ? "bg-jade" : c.level === "REFRESHER" ? "bg-steel" : "bg-ocean",
        nimasaApproved: c.nimasaApproved,
      }))
    : staticCourses.map((c) => ({ ...c, id: c.slug, level: "SHORT_COURSE", durationText: c.durationText ?? "", durationWeeks: 4, stcwRegulation: "—", feeNaira: 0 }));

  // Group by level for display
  type CourseItem = typeof courses[number];
  const LEVEL_ORDER = ["PRE_SEA", "DEGREE", "SHORT_COURSE", "POST_COC", "REFRESHER"];
  const coursesByLevel = LEVEL_ORDER.reduce<Record<string, CourseItem[]>>((acc, lvl) => {
    const grp = courses.filter((c) => c.level === lvl);
    if (grp.length) acc[lvl] = grp;
    return acc;
  }, {});

  const packages = dbPackages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    discountPercent: p.discountPercent,
    badgeText: p.badgeText,
    badgeColor: p.badgeColor,
    courseIds: p.courses.map((c) => c.courseId),
  }));

  // For the picker, use full course objects
  const pickerCourses = courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    level: c.level,
    stcwRegulation: c.stcwRegulation ?? null,
    feeNaira: c.feeNaira,
    durationText: c.durationText,
  }));

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            STCW Course Catalogue
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">
            STCW & Pre-Sea Course Catalogue
          </h1>
          <p className="text-white/55 text-base max-w-2xl">
            Select courses below to build your programme. Bundle qualifying courses together for automatic discounts.
          </p>
        </div>
      </div>
      <div className="divbar" />

      {/* Packages banner */}
      {packages.length > 0 && (
        <div className="bg-jade/5 border-b border-jade/20 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
            <span className="text-jade font-bold">💰 Bundle & Save:</span>
            <span className="text-muted">
              {packages.slice(0, 3).map((p) => (
                <span key={p.id} className="mr-3">
                  <span className="font-semibold text-navy">{p.title}</span>
                  <span className="text-jade ml-1">{p.discountPercent}% off</span>
                </span>
              ))}
            </span>
            <span className="text-muted text-xs">↓ Select courses below to activate</span>
          </div>
        </div>
      )}

      {/* Courses grouped by category */}
      <section className="py-10 px-6 max-w-7xl mx-auto space-y-12">
        {Object.entries(coursesByLevel).map(([lvl, grp]) => (
          <div key={lvl}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full text-white ${grp[0].tagColor}`}>
                {LEVEL_LABEL[lvl] ?? lvl.replace("_", " ")}
              </div>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">{grp.length} programme{grp.length > 1 ? "s" : ""}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {grp.map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.nimasaApproved && (
                      <div className="absolute top-2 right-2 bg-jade text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        NIMASA ✓
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy text-sm leading-tight mb-1">{course.title}</h3>
                    <p className="text-muted text-xs mb-3">{course.durationText}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ocean font-semibold group-hover:text-teal transition-colors">View details →</span>
                      {course.stcwRegulation && course.stcwRegulation !== "—" && (
                        <span className="inline-flex items-center gap-1 bg-navy text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚓ {course.stcwRegulation}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Multi-select course picker */}
        {packages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-cinzel text-xl text-navy font-bold">Build Your Programme Bundle</h2>
              <span className="text-xs text-muted bg-surface border border-border px-3 py-1 rounded-full">
                Select multiple courses — bundle discounts auto-apply
              </span>
            </div>
            <CoursePicker courses={pickerCourses} packages={packages} />
          </div>
        )}

        {/* No application fee callout */}
        <div className="bg-jade/5 border border-jade/20 rounded-xl p-5 flex items-start gap-4">
          <span className="text-3xl shrink-0">✅</span>
          <div>
            <div className="font-bold text-navy text-sm mb-1">No Application Fee</div>
            <div className="text-muted text-sm leading-relaxed">
              SeaLearn Nigeria charges <strong>no application fee</strong>. Submit your documents, receive a personalised fee quote, and confirm your place — all at no upfront cost.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
