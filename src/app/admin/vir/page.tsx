import { prisma } from "@/lib/prisma";
import {
  VIR_IMPLEMENTATION_PHASES,
  VIR_INSPECTION_TYPES,
  VIR_SAMPLE_TEMPLATE_PAYLOAD,
  VIR_SPEC_COUNTS,
} from "@/lib/vir/catalog";
import { summarizeVirTemplate } from "@/lib/vir/import";
import {
  ClipboardCheck,
  Database,
  FileJson,
  GitBranch,
  Layers3,
  Rocket,
  ShieldCheck,
  ShipWheel,
  Sparkles,
} from "lucide-react";

const sampleTemplateSummary = summarizeVirTemplate(VIR_SAMPLE_TEMPLATE_PAYLOAD);

const categoryLabels: Record<string, string> = {
  VETTING: "Vetting",
  PSC: "PSC / Regulatory",
  CLASS: "Class / Survey",
  INTERNAL: "Internal",
  AUDIT: "Audit / ISO",
};

export default async function VirAdminPage() {
  const [inspectionTypeCount, templateCount, vesselCount, inspectionCount] = await Promise.all([
    prisma.virInspectionType.count().catch(() => 0),
    prisma.virTemplate.count().catch(() => 0),
    prisma.vessel.count().catch(() => 0),
    prisma.virInspection.count().catch(() => 0),
  ]);

  const categoryCards = Object.entries(
    VIR_INSPECTION_TYPES.reduce<Record<string, number>>((acc, type) => {
      acc[type.category] = (acc[type.category] ?? 0) + 1;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="bg-navy px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold/80">QHSE / Management Review</p>
              <h1 className="font-cinzel text-3xl font-bold mt-2">Vessel Inspection Report Module</h1>
              <p className="text-sm text-white/75 mt-2 max-w-3xl">
                A production-fit VIR foundation inside this existing Next.js platform, covering vessel inspections,
                questionnaire templates, findings workflow, corrective actions, shore review, and AI-import readiness.
              </p>
            </div>
            <div className="bg-white/8 border border-white/10 rounded-xl px-4 py-3 min-w-56">
              <div className="text-[11px] uppercase tracking-wider text-white/60 mb-2">Current Position</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-white/65">Repo stack</span>
                  <span className="font-semibold">Next 16 + Prisma</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/65">Deployment target</span>
                  <span className="font-semibold">GitHub + Railway</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/65">Review mode</span>
                  <span className="font-semibold">Management-ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 p-6 bg-surface">
          {[
            { label: "Spec inspection types", value: VIR_SPEC_COUNTS.extractedInspectionTypes, icon: Layers3, tone: "text-ocean bg-ocean/10" },
            { label: "Seeded in database", value: inspectionTypeCount, icon: Database, tone: "text-teal bg-teal/10" },
            { label: "Templates loaded", value: templateCount, icon: ClipboardCheck, tone: "text-jade bg-jade/10" },
            { label: "VIR records", value: inspectionCount, icon: ShipWheel, tone: "text-amber bg-amber/10" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-border p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.tone}`}>
                <item.icon size={18} />
              </div>
              <div className="font-cinzel text-3xl text-navy font-bold mt-3">{item.value}</div>
              <div className="text-xs text-muted mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.25fr_0.95fr] gap-6">
        <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={18} className="text-teal" />
            <h2 className="font-bold text-navy">Management Summary</h2>
          </div>
          <div className="space-y-4 text-sm text-body">
            <p>
              The supplied HTML specification describes a much larger standalone product, originally framed for
              Angular + .NET. This repository is already a working Next.js 16 and PostgreSQL platform, so the
              fastest low-risk route is to implement VIR inside the current stack rather than restart as a separate
              .NET codebase.
            </p>
            <p>
              The foundation added here is intentionally thorough at the data-model layer: vessel master, inspection
              type catalogue, questionnaire templates, answers, findings, corrective actions, sign-off records, and
              AI import audit entities are all ready to support a phased rollout.
            </p>
            <div className="rounded-xl border border-amber/30 bg-amber/5 p-4">
              <p className="text-sm text-body">
                <strong className="text-navy">Spec discrepancy to review:</strong> the supplied document subtitle says
                there are {VIR_SPEC_COUNTS.claimedInspectionTypes} inspection types, but the HTML list actually
                contains {VIR_SPEC_COUNTS.extractedInspectionTypes}. Management should confirm the final master list
                before sign-off.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={18} className="text-ocean" />
            <h2 className="font-bold text-navy">Catalogue Coverage</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categoryCards.map(([category, count]) => (
              <div key={category} className="rounded-xl border border-border bg-surface px-4 py-3">
                <div className="text-xs text-muted">{categoryLabels[category] ?? category}</div>
                <div className="font-cinzel text-2xl text-navy font-bold mt-1">{count}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            Demo vessel master currently loaded: <strong className="text-navy">{vesselCount}</strong>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <Rocket size={18} className="text-jade" />
          <h2 className="font-bold text-navy">Recommended Delivery Shape</h2>
        </div>
        <div className="grid lg:grid-cols-4 gap-4">
          {VIR_IMPLEMENTATION_PHASES.map((phase) => (
            <div key={phase.phase} className="rounded-xl border border-border bg-surface p-4">
              <div className="text-[11px] uppercase tracking-wider text-ocean font-bold">{phase.phase}</div>
              <h3 className="font-semibold text-navy mt-1">{phase.title}</h3>
              <p className="text-sm text-muted mt-2">{phase.outcome}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-6">
        <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileJson size={18} className="text-amber" />
            <h2 className="font-bold text-navy">Questionnaire Import Engine</h2>
          </div>
          <div className="space-y-4 text-sm text-body">
            <p>
              The first import layer is designed around structured JSON so the QHSE office can validate and load
              questionnaire templates safely before we add PDF extraction and AI-assisted field mapping.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Sections", value: sampleTemplateSummary.sections },
                { label: "Questions", value: sampleTemplateSummary.questions },
                { label: "Mandatory / High risk", value: `${sampleTemplateSummary.mandatoryQuestions} / ${sampleTemplateSummary.highRiskQuestions}` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <div className="text-xs text-muted">{item.label}</div>
                  <div className="font-cinzel text-2xl text-navy font-bold mt-1">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-navy mb-2">Available now</p>
              <ul className="space-y-2 text-sm text-muted list-disc pl-5">
                <li>Schema validation for sections, questions, options, risk levels, and CIC flags.</li>
                <li>Dry-run preview route: <code className="bg-white px-1.5 py-0.5 rounded">POST /api/vir/templates/import</code></li>
                <li>Commit mode route: <code className="bg-white px-1.5 py-0.5 rounded">POST /api/vir/templates/import?commit=true</code></li>
                <li>Seed route for inspection catalogue and PSC starter template: <code className="bg-white px-1.5 py-0.5 rounded">/api/seed-vir?secret=SEED_SECRET</code></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-navy mb-2">Starter import payload</p>
              <pre className="rounded-xl bg-navy text-white text-xs overflow-x-auto p-4 leading-6">
                {JSON.stringify(VIR_SAMPLE_TEMPLATE_PAYLOAD, null, 2)}
              </pre>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={18} className="text-gold" />
            <h2 className="font-bold text-navy">Architecture Fit</h2>
          </div>
          <div className="space-y-3 text-sm text-body">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-navy">Current app stack</p>
              <p className="text-muted mt-2">Next.js 16, React 19, Prisma 6, PostgreSQL, NextAuth, Railway deployment.</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-navy">Best-fit VIR approach</p>
              <p className="text-muted mt-2">
                Keep admin workflow in the current web app, use PostgreSQL for normalized VIR data, and add AI import
                as an app route / background workflow later.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-navy">What should wait</p>
              <p className="text-muted mt-2">
                PDF parsing, OCR for scanned reports, offline tablet sync, and polished dashboarding should come after
                template governance and inspection workflow are stable.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch size={18} className="text-ocean" />
          <h2 className="font-bold text-navy">Build & Deployment Path</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="font-semibold text-navy">1. Local in VS Code</p>
            <p className="text-muted mt-2">
              Open this folder in Visual Studio Code, install dependencies, populate environment variables, run
              Prisma, then start the app locally.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="font-semibold text-navy">2. GitHub as source of truth</p>
            <p className="text-muted mt-2">
              This repository already has a GitHub remote configured, so the operational next step is to commit the
              VIR foundation cleanly and push it as the deployment source.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="font-semibold text-navy">3. Railway deployment</p>
            <p className="text-muted mt-2">
              Connect the GitHub repo in Railway, reference the PostgreSQL service as <code className="bg-white px-1.5 py-0.5 rounded">DATABASE_URL</code>,
              add the remaining app secrets, and run Prisma migrations before serving traffic.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
