"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin error]", error);
  }, [error]);

  const isDatabaseError =
    error.message.includes("prisma") ||
    error.message.includes("database") ||
    error.message.includes("P1") ||
    error.message.includes("P2") ||
    error.message.toLowerCase().includes("connect");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-white border border-border rounded-2xl shadow-sm p-8 text-center">
        <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="text-danger" size={28} />
        </div>

        <h1 className="font-cinzel text-xl font-bold text-navy mb-2">
          Page failed to load
        </h1>

        {isDatabaseError ? (
          <p className="text-muted text-sm mb-1">
            Could not reach the database. Check that{" "}
            <code className="bg-surface px-1 rounded text-xs">DATABASE_URL</code>{" "}
            is set in Railway and the service is linked.
          </p>
        ) : (
          <p className="text-muted text-sm mb-1">
            A server error occurred while rendering this page.
          </p>
        )}

        {error.message && (
          <p className="mt-3 mb-4 text-xs text-danger/80 bg-danger/5 border border-danger/10 rounded-lg px-3 py-2 text-left font-mono break-all">
            {error.message}
          </p>
        )}

        {error.digest && (
          <p className="text-[10px] text-muted mb-4">Error ID: {error.digest}</p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    </div>
  );
}
