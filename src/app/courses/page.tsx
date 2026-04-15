import { courses as staticCourses } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import CoursePicker from "@/components/CoursePicker";
import CourseSearch from "@/components/CourseSearch";

export default async function CoursesPage() {
  const [dbCourses, dbPackages] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: [{ level: "asc" }, { title: "asc" }],
      select: { id: true, slug: true, title: true, stcwRegulation: true, level: true, durationWeeks: true, feeNaira: true, nimasaApproved: true, imageUrl: true },
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
        imageUrl: c.imageUrl ?? "https://sealearn.uk/wp-content/uploads/2025/09/sealearn3.jpg",
        tagColor: c.level === "PRE_SEA" ? "bg-teal" : c.level === "SHORT_COURSE" ? "bg-gold" : c.level === "POST_COC" ? "bg-jade" : c.level === "REFRESHER" ? "bg-steel" : "bg-ocean",
        nimasaApproved: c.nimasaApproved,
      }))
    : staticCourses.map((c) => ({
        ...c,
        id: c.slug,
        level: "SHORT_COURSE",
        durationText: c.durationText ?? "",
        durationWeeks: 4,
        stcwRegulation: "—",
        feeNaira: 0,
      }));

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
            {courses.length} programmes across {new Set(courses.map((c) => c.level)).size} categories.
            Search, filter by level or duration, and request a personalised fee quote.
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
          </div>
        </div>
      )}

      {/* Course search + grid */}
      <section className="py-10 px-6 max-w-7xl mx-auto space-y-12">
        <CourseSearch courses={courses} />

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
