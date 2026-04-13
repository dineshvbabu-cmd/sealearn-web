"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const subjects = [
  "Admissions Enquiry",
  "Course Information",
  "Fees & Payments",
  "Student Portal Support",
  "Media & Press",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: subjects[0], message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-jade/10 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-jade" />
        </div>
        <h3 className="font-cinzel text-navy text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted text-sm max-w-xs mb-6">
          We've received your enquiry and will reply to <strong>{form.email || "your inbox"}</strong> within one working day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-ocean font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Subject</label>
        <select
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean bg-white"
        >
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Your message..."
          className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : <>Send Message <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}
