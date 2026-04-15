"use client";

import { useState, useActionState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

type IntakeDate = {
  id: string;
  startDate: Date;
  endDate: Date;
  deadline: Date;
  capacity: number;
};

type Course = {
  id: string;
  title: string;
  stcwRegulation: string | null;
  level: string;
  durationWeeks: number;
  feeNaira: number;
  intakeDates: IntakeDate[];
};

type Props = {
  courses: Course[];
  defaultCourseId: string;
  defaultIntakeDateId: string;
  action: (prev: { error?: string } | null, fd: FormData) => Promise<{ error: string } | null>;
};

function fmt(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProgrammeForm({ courses, defaultCourseId, defaultIntakeDateId, action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourseId);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const intakeDates = selectedCourse?.intakeDates ?? [];

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          {state.error}
        </div>
      )}

      {/* Course selection */}
      <div>
        <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
          Programme <span className="text-danger">*</span>
        </label>
        <select
          name="courseId"
          required
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors bg-white"
        >
          <option value="">— Choose a programme —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
              {c.stcwRegulation ? ` (STCW ${c.stcwRegulation})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Course info card */}
      {selectedCourse && (
        <div className="bg-ocean/5 border border-ocean/20 rounded-xl p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted">Duration</span>
            <span className="font-semibold text-navy">{selectedCourse.durationWeeks} weeks</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Programme Fee</span>
            <span className="font-semibold text-navy">₦{selectedCourse.feeNaira.toLocaleString()}</span>
          </div>
          {selectedCourse.stcwRegulation && (
            <div className="flex justify-between">
              <span className="text-muted">STCW</span>
              <span className="font-semibold text-navy">{selectedCourse.stcwRegulation}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted">Level</span>
            <span className="font-semibold text-navy">{selectedCourse.level.replace(/_/g, " ")}</span>
          </div>
        </div>
      )}

      {/* Intake date selection */}
      {selectedCourse && (
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
            Preferred Intake Date
          </label>
          {intakeDates.length === 0 ? (
            <div className="bg-amber/5 border border-amber/20 rounded-lg px-4 py-3 text-xs text-amber">
              No open intake dates for this programme yet. You may still apply — admissions will assign your intake.
            </div>
          ) : (
            <div className="space-y-2">
              {intakeDates.map((d) => (
                <label
                  key={d.id}
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg cursor-pointer hover:border-ocean/50 has-[:checked]:border-ocean has-[:checked]:bg-ocean/5 transition-colors"
                >
                  <input
                    type="radio"
                    name="intakeDateId"
                    value={d.id}
                    defaultChecked={d.id === defaultIntakeDateId}
                    className="text-ocean"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-navy">
                      {fmt(d.startDate)} – {fmt(d.endDate)}
                    </span>
                    <span className="text-muted ml-2 text-xs">
                      Apply by {fmt(d.deadline)} · {d.capacity} seats
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-3 text-xs text-muted">
        💡 No upfront payment required. Submit your documents and receive a personalised fee quote after review.
      </div>

      <button
        type="submit"
        disabled={pending || !selectedCourseId}
        className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
      >
        {pending ? "Saving…" : <><span>Continue to Personal Details</span> <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}
