"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

const STEPS = [
  { num: 1, title: "Create Account", path: "/auth/register" },
  { num: 2, title: "Select Programme", path: "/apply/programme" },
  { num: 3, title: "Personal Details", path: "/apply/personal" },
  { num: 4, title: "Upload Docs", path: "/apply/documents" },
  { num: 5, title: "Review & Submit", path: "/apply/review" },
];

function getActiveStep(pathname: string): number {
  // Match from most-specific to least-specific
  if (pathname.startsWith("/apply/review")) return 5;
  if (pathname.startsWith("/apply/documents")) return 4;
  if (pathname.startsWith("/apply/personal")) return 3;
  if (pathname.startsWith("/apply/programme")) return 2;
  return 1;
}

export default function ApplyStepBar() {
  const pathname = usePathname();
  const active = getActiveStep(pathname);

  return (
    <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
      {STEPS.map((s, i) => {
        const done = s.num < active;
        const current = s.num === active;
        return (
          <div key={s.num} className="flex items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                done
                  ? "bg-jade text-white"
                  : current
                  ? "bg-gold text-navy"
                  : "bg-white/15 text-white/40"
              }`}
            >
              {done ? <Check size={12} /> : s.num}
            </div>
            <span
              className={`text-xs hidden sm:block ${
                done
                  ? "text-white/60"
                  : current
                  ? "text-gold font-semibold"
                  : "text-white/30"
              }`}
            >
              {s.title}
            </span>
            {i < STEPS.length - 1 && (
              <div className="w-5 h-px bg-white/20 ml-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
