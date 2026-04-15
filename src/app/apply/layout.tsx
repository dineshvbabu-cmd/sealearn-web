import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Anchor } from "lucide-react";
import ApplyStepBar from "./StepBar";

export const metadata = { title: "Apply | SeaLearn Nigeria" };

export default async function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login?next=/apply/programme");

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-ocean to-teal px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Anchor className="text-gold" size={20} />
            <span className="font-cinzel text-gold text-base tracking-widest font-bold">
              SEALEARN
            </span>
          </div>
          <p className="text-white/40 text-xs">
            Nigeria Maritime Institute · Admissions Application
          </p>
        </div>

        {/* Step indicator */}
        <ApplyStepBar />

        {/* Page content */}
        {children}

        {/* Footer note */}
        <p className="text-center text-white/30 text-xs mt-6">
          Need help?{" "}
          <a
            href="mailto:admissions@sealearn.edu.ng"
            className="text-white/50 hover:text-white underline"
          >
            admissions@sealearn.edu.ng
          </a>{" "}
          · +234 704 280 6167
        </p>
      </div>
    </div>
  );
}
