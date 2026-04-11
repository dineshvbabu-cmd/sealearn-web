import { auth } from "@/auth";
import { Shield, Database, Key, Globe } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();

  return (
    <>
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Settings</h1>
        <p className="text-muted text-sm mt-1">System configuration and admin account</p>
      </div>

      <div className="grid gap-5 max-w-2xl">
        {/* Account */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-teal" />
            <h2 className="font-bold text-navy">Admin Account</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Name</span>
              <span className="font-semibold text-navy">{session?.user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Email</span>
              <span className="font-semibold text-navy">{session?.user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">Role</span>
              <span className="text-xs font-bold uppercase bg-gold/15 text-navy px-2 py-0.5 rounded-full">
                {(session?.user as { role?: string })?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Password reset */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key size={18} className="text-ocean" />
            <h2 className="font-bold text-navy">Change Admin Password</h2>
          </div>
          <p className="text-sm text-muted mb-3">
            To change the admin password, visit the reset URL:
          </p>
          <div className="bg-surface rounded-lg px-4 py-3 text-xs font-mono text-muted break-all">
            /api/reset-admin?secret=SEED_SECRET&password=NEW_PASSWORD
          </div>
          <p className="text-xs text-muted mt-2">Replace SEED_SECRET with your seed secret and NEW_PASSWORD with your new password (min 8 chars).</p>
        </div>

        {/* Environment */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={18} className="text-jade" />
            <h2 className="font-bold text-navy">Environment</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Node Environment</span>
              <span className="font-semibold text-navy">{process.env.NODE_ENV}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">Database</span>
              <span className="font-semibold text-jade">Connected (Railway PostgreSQL)</span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-danger/30 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={18} className="text-danger" />
            <h2 className="font-bold text-danger">Danger Zone</h2>
          </div>
          <p className="text-sm text-muted mb-3">
            Re-run the seed to restore demo courses, news, and admin account. This will not delete existing data.
          </p>
          <a
            href="/api/seed?secret=sealearn2025seed"
            target="_blank"
            className="inline-flex text-sm font-bold text-danger border border-danger/30 px-4 py-2 rounded-lg hover:bg-danger/5 transition-colors"
          >
            Re-run Seed
          </a>
        </div>
      </div>
    </>
  );
}
