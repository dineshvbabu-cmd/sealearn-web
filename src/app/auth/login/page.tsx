"use client";

import Link from "next/link";
import { Anchor, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function StudentLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const registered = params.get("registered") === "1";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: fd.get("email") as string,
        password: fd.get("password") as string,
        redirect: false,
      });

      if (result?.error || result?.ok === false) {
        if (result?.code === "no_account") {
          setError("No account found with this email address. Check your email or register below.");
        } else if (result?.code === "wrong_password") {
          setError("Incorrect password. Please try again or use the forgot password link.");
        } else {
          setError("Sign in failed. Check your email and password and try again.");
        }
        setPending(false);
      } else {
        // Middleware handles admin role → /admin/dashboard redirect automatically
        const params = new URLSearchParams(window.location.search);
        const cb = params.get("callbackUrl");
        router.push(cb && cb.startsWith("/portal") ? cb : "/portal/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-ocean to-teal flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-navy px-8 py-7 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Anchor className="text-gold" size={20} />
              <span className="font-cinzel text-gold text-base tracking-widest font-bold">SEALEARN</span>
            </div>
            <p className="text-white/40 text-xs tracking-wide">Nigeria Maritime Institute · Student Login</p>
          </div>

          <div className="px-8 py-8">
            <h1 className="font-cinzel text-navy text-xl font-bold mb-1">Student Login</h1>
            <p className="text-muted text-sm mb-7">Sign in to access your student portal.</p>

            {registered && (
              <div className="bg-jade/10 border border-jade/30 text-jade text-sm px-4 py-3 rounded-lg mb-5">
                <span className="font-bold">Account created!</span> Please log in below. Our admissions team will review your application and contact you regarding next steps.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-navy uppercase tracking-wide">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-ocean hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Sign In to Portal"}
              </button>
            </form>

            <p className="text-center text-xs text-muted mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-ocean font-semibold hover:underline">
                Apply &amp; Register
              </Link>
            </p>
            <p className="text-center text-xs text-muted mt-3">
              <Link href="/auth/admin-login" className="text-steel hover:underline">
                Admin / Staff Login →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-5">
          Need help? Call <span className="text-white/60 font-semibold">+234 701 234 5678</span>
        </p>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense>
      <StudentLoginForm />
    </Suspense>
  );
}
