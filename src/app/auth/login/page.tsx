"use client";

import Link from "next/link";
import { Anchor } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

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
        setError("Invalid email or password. Please try again.");
        setPending(false);
      } else {
        router.push("/portal/dashboard");
        router.refresh();
      }
    } catch {
      setError("Login failed. Please try again.");
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
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                />
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
