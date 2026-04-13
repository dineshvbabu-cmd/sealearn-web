"use client";

import { useState, useMemo } from "react";
import { CheckCircle, Tag, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

type Course = {
  id: string;
  slug: string;
  title: string;
  level: string;
  stcwRegulation: string | null;
  feeNaira: number;
  durationText: string;
};

type Package = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  discountPercent: number;
  badgeText: string;
  badgeColor: string;
  courseIds: string[];
};

const LEVEL_LABEL: Record<string, string> = {
  PRE_SEA: "Pre-Sea", SHORT_COURSE: "Short Course",
  DEGREE: "Degree", POST_COC: "Post-CoC", REFRESHER: "Refresher",
};

const levelBadge: Record<string, string> = {
  PRE_SEA: "bg-teal/10 text-teal", SHORT_COURSE: "bg-gold/15 text-amber",
  DEGREE: "bg-ocean/10 text-ocean", POST_COC: "bg-jade/10 text-jade",
  REFRESHER: "bg-steel/10 text-muted",
};

export default function CoursePicker({ courses, packages }: { courses: Course[]; packages: Package[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Find all packages that are fully covered by current selection
  const matchedPackages = useMemo(
    () => packages.filter((p) => p.courseIds.length >= 2 && p.courseIds.every((id) => selected.has(id))),
    [selected, packages]
  );

  // Best deal: highest discount among matched packages
  const bestPackage = matchedPackages.reduce<Package | null>(
    (best, p) => (!best || p.discountPercent > best.discountPercent ? p : best),
    null
  );

  const selectedCourses = courses.filter((c) => selected.has(c.id));
  const totalFee = selectedCourses.reduce((s, c) => s + c.feeNaira, 0);
  const savings = bestPackage ? Math.round(totalFee * bestPackage.discountPercent / 100) : 0;
  const finalFee = totalFee - savings;

  // Partial match: packages where at least one course is selected (hint to user)
  const partialMatches = useMemo(
    () => packages.filter(
      (p) => !matchedPackages.includes(p) && p.courseIds.some((id) => selected.has(id))
    ),
    [selected, packages, matchedPackages]
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Course list */}
      <div className="lg:col-span-2">
        <p className="text-muted text-sm mb-4">
          Tick the courses you want. Qualifying bundles are detected automatically.
        </p>
        <div className="space-y-2">
          {courses.map((c) => {
            const isSelected = selected.has(c.id);
            // Is this course part of a matched package?
            const inBundle = bestPackage?.courseIds.includes(c.id);
            return (
              <label
                key={c.id}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? inBundle
                      ? "border-jade bg-jade/5 shadow-sm"
                      : "border-ocean bg-ocean/5 shadow-sm"
                    : "border-border bg-white hover:border-ocean/40 hover:bg-surface"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(c.id)}
                  className="accent-teal w-4 h-4 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy text-sm leading-tight">{c.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelBadge[c.level] ?? "bg-surface text-muted"}`}>
                      {LEVEL_LABEL[c.level] ?? c.level}
                    </span>
                    {c.stcwRegulation && (
                      <span className="text-[10px] text-muted">{c.stcwRegulation}</span>
                    )}
                    <span className="text-[10px] text-muted">{c.durationText}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold text-ocean text-sm">₦{c.feeNaira.toLocaleString()}</div>
                  {inBundle && (
                    <div className="text-[10px] text-jade font-bold mt-0.5">In bundle ✓</div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="space-y-4">
        {/* Package match banner */}
        {bestPackage && (
          <div className="bg-jade/5 border-2 border-jade rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-jade" />
              <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${bestPackage.badgeColor}`}>
                {bestPackage.badgeText}
              </span>
            </div>
            <div className="font-bold text-navy text-sm mb-1">{bestPackage.title}</div>
            {bestPackage.description && (
              <p className="text-muted text-xs mb-2">{bestPackage.description}</p>
            )}
            <div className="text-jade font-bold text-sm">{bestPackage.discountPercent}% bundle discount applied!</div>
          </div>
        )}

        {/* Partial match hint */}
        {!bestPackage && partialMatches.length > 0 && (
          <div className="bg-amber/5 border border-amber/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-amber" />
              <span className="text-xs font-bold text-amber">Bundle available!</span>
            </div>
            {partialMatches.slice(0, 1).map((p) => {
              const missing = p.courseIds.filter((id) => !selected.has(id));
              const missingTitles = courses.filter((c) => missing.includes(c.id)).map((c) => c.title);
              return (
                <div key={p.id} className="text-xs text-muted">
                  Add <span className="font-semibold text-navy">{missingTitles.slice(0, 2).join(" + ")}</span> to unlock{" "}
                  <span className="font-bold text-jade">{p.discountPercent}% off</span> with the{" "}
                  <span className="font-semibold">{p.title}</span> bundle.
                </div>
              );
            })}
          </div>
        )}

        {/* Price summary */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-5">
          <h3 className="font-cinzel text-navy font-bold mb-4">Your Selection</h3>

          {selectedCourses.length === 0 ? (
            <p className="text-muted text-xs">No courses selected yet.</p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {selectedCourses.map((c) => (
                  <div key={c.id} className="flex justify-between text-xs">
                    <span className="text-muted truncate pr-2 max-w-[160px]">{c.title}</span>
                    <span className="font-semibold text-navy shrink-0">₦{c.feeNaira.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Subtotal</span>
                  <span className={bestPackage ? "line-through text-muted" : "font-bold text-navy"}>
                    ₦{totalFee.toLocaleString()}
                  </span>
                </div>
                {bestPackage && savings > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-jade font-bold">Bundle Saving ({bestPackage.discountPercent}%)</span>
                    <span className="text-jade font-bold">−₦{savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-border">
                  <span className="font-bold text-navy text-sm">Total</span>
                  <span className="font-cinzel font-bold text-ocean text-base">₦{finalFee.toLocaleString()}</span>
                </div>
              </div>

              {selectedCourses.length > 0 && (
                <Link
                  href="/admissions"
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              )}
            </>
          )}
        </div>

        {/* All available packages */}
        {packages.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <h4 className="font-bold text-navy text-xs uppercase tracking-wide mb-3">Available Bundles</h4>
            <div className="space-y-2">
              {packages.map((p) => {
                const pkgCourses = courses.filter((c) => p.courseIds.includes(c.id));
                const pkgTotal = pkgCourses.reduce((s, c) => s + c.feeNaira, 0);
                const pkgFinal = pkgTotal - Math.round(pkgTotal * p.discountPercent / 100);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      // Select all courses in this package
                      setSelected(new Set(p.courseIds));
                    }}
                    className="w-full text-left p-3 rounded-lg border border-border bg-white hover:border-ocean/40 hover:bg-ocean/5 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-navy">{p.title}</span>
                      <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${p.badgeColor}`}>
                        {p.discountPercent}% off
                      </span>
                    </div>
                    <div className="text-muted">{pkgCourses.length} courses · ₦{pkgFinal.toLocaleString()}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
