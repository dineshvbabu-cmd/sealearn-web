"use client";

import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";

// RFC 5322 simplified
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Props {
  courseId?: string;
  courseTitle?: string;
  onClose: () => void;
}

export default function RequestPriceModal({ courseId, courseTitle, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const emailValid = EMAIL_RE.test(email);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!emailValid) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/price-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, courseId, message }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-ocean px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-base">Request a Fee Quote</div>
            {courseTitle && (
              <div className="text-white/60 text-xs mt-0.5">{courseTitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="text-jade mx-auto mb-4" />
            <h3 className="font-cinzel text-navy font-bold text-lg mb-2">Quote Request Sent!</h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Thank you, <strong>{name}</strong>. Our admissions team will email you the fee details
              for <strong>{courseTitle || "your selected course"}</strong> within 1–2 working days.
            </p>
            <button
              onClick={onClose}
              className="bg-ocean text-white font-bold px-6 py-2.5 rounded-full hover:bg-navy transition-colors text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="p-5 space-y-4">
            <p className="text-muted text-xs leading-relaxed">
              Fees are shared privately. Fill in your details and we'll reply within 1–2 working days.
              <strong> No application fee</strong> is required.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chidi Nwachukwu"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-ocean"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-ocean ${
                  email && !emailValid ? "border-danger bg-red-50" : "border-border"
                }`}
                required
              />
              {email && !emailValid && (
                <p className="text-danger text-[11px] mt-1">Enter a valid email (e.g. name@domain.com)</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 701 234 5678"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any specific questions about the course or payment options…"
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-ocean resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || !emailValid}
              className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Send size={14} />
              {loading ? "Sending…" : "Send Quote Request"}
            </button>

            <p className="text-center text-muted text-[11px]">
              Or email directly:{" "}
              <a href="mailto:admissions@sealearn.edu.ng" className="text-ocean underline">
                admissions@sealearn.edu.ng
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
