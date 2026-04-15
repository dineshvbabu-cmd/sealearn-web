"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

interface Course {
  id: string;
  slug: string;
  title: string;
  stcwRegulation: string;
  level: string;
  durationWeeks: number;
  durationText: string;
  feeNaira: number;
  imageUrl: string;
  tagColor: string;
  nimasaApproved: boolean;
}

interface Props {
  courses: Course[];
}

const LEVEL_LABEL: Record<string, string> = {
  PRE_SEA: "Pre-Sea",
  SHORT_COURSE: "Short Course",
  DEGREE: "Degree Level",
  POST_COC: "Post-CoC",
  REFRESHER: "Refresher",
};

const LEVEL_ORDER = ["PRE_SEA", "DEGREE", "SHORT_COURSE", "POST_COC", "REFRESHER"];

const DURATION_FILTERS = [
  { label: "All durations", minWeeks: 0, maxWeeks: 999 },
  { label: "1–3 days", minWeeks: 0, maxWeeks: 1 },
  { label: "1 week", minWeeks: 1, maxWeeks: 2 },
  { label: "2–4 weeks", minWeeks: 2, maxWeeks: 5 },
  { label: "5+ weeks", minWeeks: 5, maxWeeks: 999 },
];

export default function CourseSearch({ courses }: Props) {
  const [query, setQuery] = useState("");
  const [durationIdx, setDurationIdx] = useState(0);
  const [levelFilter, setLevelFilter] = useState("ALL");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const dur = DURATION_FILTERS[durationIdx];
    return courses.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q) && !c.stcwRegulation.toLowerCase().includes(q)) return false;
      if (dur.minWeeks > 0 || dur.maxWeeks < 999) {
        if (c.durationWeeks < dur.minWeeks || c.durationWeeks >= dur.maxWeeks) return false;
      }
      if (levelFilter !== "ALL" && c.level !== levelFilter) return false;
      return true;
    });
  }, [courses, query, durationIdx, levelFilter]);

  const levels = LEVEL_ORDER.filter((l) => courses.some((c) => c.level === l));

  // Group filtered courses by level
  type CourseItem = typeof courses[number];
  const grouped = LEVEL_ORDER.reduce<Record<string, CourseItem[]>>((acc, lvl) => {
    const grp = filtered.filter((c) => c.level === lvl);
    if (grp.length) acc[lvl] = grp;
    return acc;
  }, {});

  const hasFilter = query || durationIdx > 0 || levelFilter !== "ALL";

  return (
    <div>
      {/* Search bar */}
      <div className="bg-white border border-border rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses (e.g. BST, GMDSS, Fire Fighting…)"
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-border rounded-lg outline-none focus:border-ocean"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Level filter */}
          <div className="flex flex-wrap gap-1.5">
            {["ALL", ...levels].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                  levelFilter === lvl
                    ? "bg-navy text-white border-navy"
                    : "text-muted border-border bg-surface hover:border-ocean hover:text-ocean"
                }`}
              >
                {lvl === "ALL" ? "All Levels" : LEVEL_LABEL[lvl] ?? lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Duration chips */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
          <span className="text-[11px] text-muted self-center">Duration:</span>
          {DURATION_FILTERS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setDurationIdx(i)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                durationIdx === i
                  ? "bg-teal text-white border-teal"
                  : "text-muted border-border bg-surface hover:border-teal hover:text-teal"
              }`}
            >
              {f.label}
            </button>
          ))}
          {hasFilter && (
            <button
              onClick={() => { setQuery(""); setDurationIdx(0); setLevelFilter("ALL"); }}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-danger/40 text-danger bg-danger/5 hover:bg-danger hover:text-white transition-colors ml-auto"
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results summary */}
      {hasFilter && (
        <p className="text-sm text-muted mb-4">
          {filtered.length === 0
            ? "No courses match your search."
            : `${filtered.length} course${filtered.length > 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Grouped course grid */}
      <div className="space-y-12">
        {Object.entries(grouped).map(([lvl, grp]) => (
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
                      <span className="text-xs text-ocean font-semibold group-hover:text-teal transition-colors">
                        View details →
                      </span>
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
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search or clearing filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
