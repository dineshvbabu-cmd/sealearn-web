"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import RequestPriceModal from "./RequestPriceModal";

interface Props {
  courseTitle: string;
  courseId?: string;
  variant?: "hero" | "sidebar";
}

export default function RequestQuoteButton({ courseTitle, courseId, variant = "hero" }: Props) {
  const [open, setOpen] = useState(false);

  if (variant === "sidebar") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-gold text-navy font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm w-full mb-2"
        >
          <Mail size={14} /> Request a Quote
        </button>
        {open && (
          <RequestPriceModal
            courseTitle={courseTitle}
            courseId={courseId}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/30 font-semibold px-6 py-3 rounded-full hover:bg-white/25 transition-colors"
      >
        <Mail size={15} /> Request a Quote
      </button>
      {open && (
        <RequestPriceModal
          courseTitle={courseTitle}
          courseId={courseId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
