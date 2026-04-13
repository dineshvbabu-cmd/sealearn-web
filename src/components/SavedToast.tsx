"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle, X } from "lucide-react";

export default function SavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      setVisible(true);
      // Clean the URL so refreshing doesn't re-show it
      const params = new URLSearchParams(searchParams.toString());
      params.delete("saved");
      const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
      router.replace(newUrl, { scroll: false });
      // Auto-dismiss after 4 seconds
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams, pathname, router]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-lg rounded-xl px-4 py-3 text-sm animate-in slide-in-from-top-2">
      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
      <span className="text-green-800 font-medium">Changes saved successfully</span>
      <button onClick={() => setVisible(false)} className="text-green-400 hover:text-green-600 ml-1">
        <X size={14} />
      </button>
    </div>
  );
}
