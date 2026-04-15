"use client";

import { useState, useCallback } from "react";
import { useActionState } from "react";
import { ArrowRight, AlertCircle, User, Users, CheckCircle } from "lucide-react";
import { savePersonal } from "@/actions/apply";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// ── Constants ────────────────────────────────────────────────
const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const RELATIONSHIPS = ["Parent","Sibling","Spouse","Child","Guardian","Uncle/Aunt","Other"];

// ── Validation helpers ────────────────────────────────────────

/** Letters (any script), spaces, hyphens, apostrophes, periods. No digits. */
const NAME_RE = /^[\p{L}\s'\-\.]{2,100}$/u;

/** At least 2 letters anywhere in the string. */
const CONTAINS_LETTERS = /\p{L}.*\p{L}/u;

/** Repeating single char 5+ times — "aaaa", "11111" etc. */
const REPETITIVE_RE = /(.)\1{4,}/;

function validateName(v: string): string | null {
  const t = v.trim();
  if (!t) return "Name is required.";
  if (t.length < 2) return "Name must be at least 2 characters.";
  if (t.length > 100) return "Name must be under 100 characters.";
  if (!NAME_RE.test(t)) return "Name should only contain letters, spaces, hyphens, or apostrophes — no numbers or special characters.";
  if (REPETITIVE_RE.test(t)) return "Please enter a real name.";
  return null;
}

function validateDateOfBirth(v: string): string | null {
  if (!v) return "Date of birth is required.";
  const dob = new Date(v);
  if (isNaN(dob.getTime())) return "Please enter a valid date.";
  const now = new Date();
  const ageMs = now.getTime() - dob.getTime();
  const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  if (dob > now) return "Date of birth cannot be in the future.";
  if (ageYears < 16) return "Applicant must be at least 16 years old.";
  if (ageYears > 80) return "Please check the date — age appears to be over 80 years.";
  return null;
}

function validatePhone(v: string): string | null {
  const t = v.trim();
  if (!t) return "Phone number is required.";

  // Strip whitespace/dashes/dots for digit check
  const digits = t.replace(/[\s\-\(\)\.]/g, "");

  // Must have at least 7 digits (shortest valid numbers)
  const digitCount = (digits.match(/\d/g) ?? []).length;
  if (digitCount < 7) return "Phone number is too short. Include your country code (e.g. +44 7911 123456).";
  if (digitCount > 15) return "Phone number is too long.";

  // Reject obviously fake: all same digit
  const stripped = t.replace(/\D/g, "");
  if (/^(\d)\1+$/.test(stripped)) return "Please enter a real phone number.";

  // Reject sequential runs like 1234567 or 7654321
  if (/^(0?1234567|0?9876543|1234567890|0987654321)/.test(stripped)) {
    return "Please enter a real phone number.";
  }

  // If starts with +, validate with libphonenumber-js
  if (t.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(t);
    if (!parsed || !parsed.isValid()) {
      return "Phone number is not valid for the indicated country. Check the country code and number.";
    }
    return null;
  }

  // Local number without +: accept if 7-15 digits (can't validate country without code)
  // but warn they should add country code
  if (digitCount >= 7 && digitCount <= 15) {
    return null; // Accept local format
  }

  return "Please enter a valid phone number.";
}

function validateAddress(v: string): string | null {
  const t = v.trim();
  if (!t) return "Address is required.";
  if (t.length < 10) return "Please enter a full address (at least 10 characters).";
  if (t.length > 500) return "Address is too long.";
  if (!CONTAINS_LETTERS.test(t)) return "Address must contain readable text.";
  if (REPETITIVE_RE.test(t)) return "Please enter a real address.";
  // Reject obviously fake: 'aaa', 'test', 'asdf', 'qwerty'
  if (/^(test|asdf|qwerty|hello|abc|xxx|yyy|zzz|n\/a|none|na)\b/i.test(t)) {
    return "Please enter your actual residential address.";
  }
  return null;
}

function validateLga(v: string): string | null {
  const t = v.trim();
  if (!t) return null; // optional
  if (t.length < 2) return "LGA name must be at least 2 characters.";
  if (!/^[\p{L}\s'\-\/\.]{2,80}$/u.test(t)) return "LGA should only contain letters, spaces, or hyphens.";
  if (REPETITIVE_RE.test(t)) return "Please enter a real LGA.";
  return null;
}

// ── Field state helpers ───────────────────────────────────────
type Errors = Record<string, string | null>;
type Touched = Record<string, boolean>;

// ── Component ────────────────────────────────────────────────
export default function PersonalPage() {
  const [serverState, formAction, pending] = useActionState(savePersonal, null);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [values, setValues] = useState<Record<string, string>>({});

  const validate = useCallback((vals: Record<string, string>): Errors => {
    return {
      dateOfBirth: validateDateOfBirth(vals.dateOfBirth ?? ""),
      gender: (vals.gender ?? "") ? null : "Please select your gender.",
      stateOfOrigin: (vals.stateOfOrigin ?? "") ? null : "Please select your state of origin.",
      lga: validateLga(vals.lga ?? ""),
      address: validateAddress(vals.address ?? ""),
      nokName: validateName(vals.nokName ?? ""),
      nokRelationship: (vals.nokRelationship ?? "") ? null : "Please select a relationship.",
      nokPhone: validatePhone(vals.nokPhone ?? ""),
    };
  }, []);

  function touch(name: string, value: string) {
    const newVals = { ...values, [name]: value };
    setValues(newVals);
    setTouched((t) => ({ ...t, [name]: true }));
    const fieldError = validate(newVals)[name];
    setErrors((e) => ({ ...e, [name]: fieldError ?? null }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const allErrors = validate(data);
    // Mark all as touched so errors show
    setTouched(Object.fromEntries(Object.keys(allErrors).map((k) => [k, true])));
    setErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) {
      e.preventDefault(); // Block submission
    }
  }

  function fieldClass(name: string) {
    if (!touched[name]) return "border-border focus:border-ocean";
    if (errors[name]) return "border-danger/60 bg-red-50/30 focus:border-danger";
    return "border-jade/50 bg-jade/5 focus:border-jade";
  }

  function FieldError({ name }: { name: string }) {
    if (!touched[name] || !errors[name]) return null;
    return (
      <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
        <AlertCircle size={11} /> {errors[name]}
      </p>
    );
  }

  function FieldOk({ name }: { name: string }) {
    if (!touched[name] || errors[name]) return null;
    return <CheckCircle size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-jade pointer-events-none" />;
  }

  const hasAnyError = Object.values(errors).some(Boolean) && Object.values(touched).some(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-8 pt-7 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <User size={18} className="text-ocean" />
          <h1 className="font-cinzel text-navy text-xl font-bold">Personal Details</h1>
        </div>
        <p className="text-muted text-sm">
          Step 3 of 5 — Personal information and next of kin. Required for NIMASA registration.
        </p>
      </div>

      <div className="px-8 py-6">
        {/* Server error */}
        {serverState?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
            <AlertCircle size={14} className="shrink-0" />
            {serverState.error}
          </div>
        )}

        {/* Client validation summary */}
        {hasAnyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-start gap-2 mb-5">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Please fix the errors below before continuing.</span>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                {Object.entries(errors).map(([, msg]) =>
                  msg ? <li key={msg}>{msg}</li> : null
                )}
              </ul>
            </div>
          </div>
        )}

        <form action={formAction} onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* ── Personal Information ──────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User size={14} className="text-ocean" />
              <span className="text-xs font-bold text-navy uppercase tracking-wide">Personal Information</span>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="dateOfBirth"
                      type="date"
                      required
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split("T")[0]}
                      min="1940-01-01"
                      className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${fieldClass("dateOfBirth")}`}
                      onChange={(e) => touch("dateOfBirth", e.target.value)}
                      onBlur={(e) => touch("dateOfBirth", e.target.value)}
                    />
                    <FieldOk name="dateOfBirth" />
                  </div>
                  <FieldError name="dateOfBirth" />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors bg-white ${fieldClass("gender")}`}
                    onChange={(e) => touch("gender", e.target.value)}
                    onBlur={(e) => touch("gender", e.target.value)}
                  >
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <FieldError name="gender" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* State of Origin */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    State of Origin <span className="text-danger">*</span>
                  </label>
                  <select
                    name="stateOfOrigin"
                    required
                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors bg-white ${fieldClass("stateOfOrigin")}`}
                    onChange={(e) => touch("stateOfOrigin", e.target.value)}
                    onBlur={(e) => touch("stateOfOrigin", e.target.value)}
                  >
                    <option value="">— Select state —</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <FieldError name="stateOfOrigin" />
                </div>

                {/* LGA */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    LGA of Origin
                  </label>
                  <div className="relative">
                    <input
                      name="lga"
                      type="text"
                      placeholder="e.g. Ikeja"
                      maxLength={80}
                      className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${fieldClass("lga")}`}
                      onChange={(e) => touch("lga", e.target.value)}
                      onBlur={(e) => touch("lga", e.target.value)}
                    />
                    <FieldOk name="lga" />
                  </div>
                  <FieldError name="lga" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Residential Address <span className="text-danger">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="e.g. 12 Marina Street, Lagos Island, Lagos"
                  maxLength={500}
                  className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors resize-none ${fieldClass("address")}`}
                  onChange={(e) => touch("address", e.target.value)}
                  onBlur={(e) => touch("address", e.target.value)}
                />
                <FieldError name="address" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* ── Next of Kin ───────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-ocean" />
              <span className="text-xs font-bold text-navy uppercase tracking-wide">Next of Kin</span>
            </div>

            <div className="space-y-4">
              {/* NOK Name */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    name="nokName"
                    type="text"
                    required
                    placeholder="e.g. Ngozi Okonkwo"
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors pr-9 ${fieldClass("nokName")}`}
                    onChange={(e) => touch("nokName", e.target.value)}
                    onBlur={(e) => touch("nokName", e.target.value)}
                  />
                  <FieldOk name="nokName" />
                </div>
                <FieldError name="nokName" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Relationship */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Relationship <span className="text-danger">*</span>
                  </label>
                  <select
                    name="nokRelationship"
                    required
                    className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors bg-white ${fieldClass("nokRelationship")}`}
                    onChange={(e) => touch("nokRelationship", e.target.value)}
                    onBlur={(e) => touch("nokRelationship", e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <FieldError name="nokRelationship" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="nokPhone"
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      maxLength={20}
                      className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors pr-9 ${fieldClass("nokPhone")}`}
                      onChange={(e) => touch("nokPhone", e.target.value)}
                      onBlur={(e) => touch("nokPhone", e.target.value)}
                    />
                    <FieldOk name="nokPhone" />
                  </div>
                  <p className="text-[11px] text-muted mt-1">
                    Include country code for international numbers (e.g. +44, +1, +234)
                  </p>
                  <FieldError name="nokPhone" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
          >
            {pending
              ? "Saving…"
              : <><span>Continue to Upload Documents</span> <ArrowRight size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
