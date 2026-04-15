"use client";

import { useFormStatus } from "react-dom";
import { Send, Loader2 } from "lucide-react";

export default function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full flex items-center justify-center gap-2 bg-jade text-white font-bold py-4 rounded-xl hover:bg-jade/90 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Submitting Application…
        </>
      ) : disabled ? (
        "Complete all required fields to submit"
      ) : (
        <>
          <Send size={16} />
          Submit Application to Admissions
        </>
      )}
    </button>
  );
}
