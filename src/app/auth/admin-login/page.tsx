"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid admin credentials. Please try again.");
      setPending(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel via-navy to-ocean flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-steel px-8 py-7 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="text-gold" size={20} />
              <span className="font-cinzel text-gold text-base tracking-widest font-bold">SEALEARN</span>
            </div>
            <p className="text-white/40 text-xs tracking-wide">Admin &amp; Staff Portal</p>
          </div>

          <div className="px-8 py-8">
            <h1 className="font-cinzel text-navy text-xl font-bold mb-1">Admin Login</h1>
            <p className="text-muted text-sm mb-7">Restricted access. Staff credentials required.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Admin Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@sealearn.ng"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-steel transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-steel transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-steel text-white font-bold py-3.5 rounded-lg hover:bg-navy transition-colors text-sm disabled:opacity-60"
              >
                {pending ? "Verifying…" : "Access Admin Panel"}
              </button>
            </form>

            <p className="text-center text-xs text-muted mt-6">
              <Link href="/auth/login" className="text-ocean hover:underline">
                ← Back to Student Login
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-white/30 text-xs mt-5">
          Authorised personnel only · SeaLearn Nigeria CMS
        </p>
      </div>
    </div>
  );
}
