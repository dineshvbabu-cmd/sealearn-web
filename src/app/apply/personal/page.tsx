"use client";

import { useActionState } from "react";
import { ArrowRight, AlertCircle, User, Users } from "lucide-react";
import { savePersonal } from "@/actions/apply";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT – Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

const RELATIONSHIPS = ["Parent","Sibling","Spouse","Child","Guardian","Uncle/Aunt","Other"];

export default function PersonalPage() {
  const [state, formAction, pending] = useActionState(savePersonal, null);

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
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
            <AlertCircle size={14} className="shrink-0" />
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Personal info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User size={14} className="text-ocean" />
              <span className="text-xs font-bold text-navy uppercase tracking-wide">Personal Information</span>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    name="gender"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors bg-white"
                  >
                    <option value="">— Select —</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    State of Origin <span className="text-danger">*</span>
                  </label>
                  <select
                    name="stateOfOrigin"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors bg-white"
                  >
                    <option value="">— Select state —</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    LGA of Origin
                  </label>
                  <input
                    name="lga"
                    type="text"
                    placeholder="e.g. Ikeja"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Residential Address <span className="text-danger">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder="Street, City, State"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Next of kin */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-ocean" />
              <span className="text-xs font-bold text-navy uppercase tracking-wide">Next of Kin</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  name="nokName"
                  type="text"
                  required
                  placeholder="Full name of next of kin"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Relationship <span className="text-danger">*</span>
                  </label>
                  <select
                    name="nokRelationship"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors bg-white"
                  >
                    <option value="">— Select —</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    name="nokPhone"
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
          >
            {pending ? "Saving…" : <><span>Continue to Upload Documents</span> <ArrowRight size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
