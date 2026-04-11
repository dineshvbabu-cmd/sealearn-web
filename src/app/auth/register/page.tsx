import Link from "next/link";
import { Anchor, ArrowRight } from "lucide-react";

const steps = [
  { num: 1, title: "Create Account", active: true },
  { num: 2, title: "Select Programme", active: false },
  { num: 3, title: "Upload Docs", active: false },
  { num: 4, title: "Pay & Submit", active: false },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-ocean to-teal px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Anchor className="text-gold" size={20} />
            <span className="font-cinzel text-gold text-base tracking-widest font-bold">SEALEARN</span>
          </div>
          <p className="text-white/40 text-xs">Nigeria Maritime Institute · New Application</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.active ? "bg-gold text-navy" : "bg-white/15 text-white/40"
                }`}
              >
                {s.num}
              </div>
              <span className={`text-xs hidden sm:block ${s.active ? "text-gold font-semibold" : "text-white/30"}`}>
                {s.title}
              </span>
              {i < steps.length - 1 && <div className="w-6 h-px bg-white/20 ml-1" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-7 pb-2">
            <h1 className="font-cinzel text-navy text-xl font-bold mb-1">Create Your Account</h1>
            <p className="text-muted text-sm">
              Step 1 of 4 — Account details. All fields required.
            </p>
          </div>

          <div className="px-8 py-6">
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Chidi"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Okonkwo"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Phone Number (+234)
                </label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                </div>
              </div>

              {/* Programme hint */}
              <div className="bg-surface border border-border rounded-lg p-3 text-xs text-muted">
                🎓 In the next step, you'll select your programme. Intakes: January, June, September.
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-0.5 rounded border-border" />
                <label htmlFor="terms" className="text-xs text-muted leading-relaxed">
                  I agree to SeaLearn's{" "}
                  <Link href="/terms" className="text-ocean hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-ocean hover:underline">Privacy Policy (NDPR)</Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
              >
                Create Account & Continue <ArrowRight size={14} />
              </button>
            </form>

            <p className="text-center text-xs text-muted mt-5">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-ocean font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 bg-white/8 border border-white/15 rounded-xl p-4 text-xs text-white/50">
          <div className="font-semibold text-white/70 mb-1">🇳🇬 Nigeria-First Application</div>
          ₦15,000 application fee payable via Paystack, Flutterwave, USSD *737# or bank transfer.
          Your data is stored securely in compliance with the NDPR.
        </div>
      </div>
    </div>
  );
}
