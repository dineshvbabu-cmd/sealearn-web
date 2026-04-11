import Link from "next/link";
import { Anchor } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-ocean to-teal flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-navy px-8 py-7 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Anchor className="text-gold" size={20} />
              <span className="font-cinzel text-gold text-base tracking-widest font-bold">SEALEARN</span>
            </div>
            <p className="text-white/40 text-xs tracking-wide">Nigeria Maritime Institute · Student Login</p>
          </div>

          <div className="px-8 py-8">
            <h1 className="font-cinzel text-navy text-xl font-bold mb-1">Welcome Back</h1>
            <p className="text-muted text-sm mb-7">Sign in to access your student portal.</p>

            <form className="space-y-4">
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
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-navy uppercase tracking-wide">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-ocean hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-ocean transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-border" />
                <label htmlFor="remember" className="text-xs text-muted">Remember me for 30 days</label>
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
              >
                Sign In to Portal
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted text-xs">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google sign in */}
            <button className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-3 text-sm text-body hover:bg-surface transition-colors">
              <span>🔵</span> Continue with Google
            </button>

            <p className="text-center text-xs text-muted mt-6">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-ocean font-semibold hover:underline">
                Apply & Register
              </Link>
            </p>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-white/40 text-xs mt-5">
          Need help? Call{" "}
          <span className="text-white/60 font-semibold">+234 701 234 5678</span>
        </p>
      </div>
    </div>
  );
}
