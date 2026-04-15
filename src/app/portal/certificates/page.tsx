import { requireEnrolment } from "@/lib/portal-guard";
import { Award, Download, ExternalLink, Lock } from "lucide-react";

const earned = [
  {
    id: 1, title: "Basic Safety Training (BST)", stcw: "STCW Reg. VI/1", issued: "15 Mar 2026",
    expiry: "14 Mar 2031", nimasa: "NIM/BST/2026/04521", status: "valid",
  },
  {
    id: 2, title: "Personal Survival Techniques", stcw: "STCW Reg. VI/1-1", issued: "15 Mar 2026",
    expiry: "14 Mar 2031", nimasa: "NIM/PST/2026/04522", status: "valid",
  },
  {
    id: 3, title: "Fire Prevention & Fire Fighting", stcw: "STCW Reg. VI/1-2", issued: "15 Mar 2026",
    expiry: "14 Mar 2031", nimasa: "NIM/FPFF/2026/04523", status: "valid",
  },
];

const pending = [
  { title: "Officer of the Watch (Deck)", stcw: "STCW Reg. II/1", requirement: "Complete all 8 modules + sea service" },
  { title: "GMDSS General Operator Certificate (GOC)", stcw: "STCW Reg. IV/2", requirement: "Complete GMDSS module + practical assessment" },
  { title: "Radar Navigation & ARPA", stcw: "STCW Reg. II/1", requirement: "Pass simulator assessment (scheduled Apr 18)" },
  { title: "Certificate of Competency (CoC)", stcw: "STCW Reg. II/2", requirement: "Complete programme + NIMASA examination" },
];

export default async function CertificatesPage() {
  await requireEnrolment();
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">My Certificates</h1>
        <p className="text-muted text-sm mt-1">STCW & NIMASA Certificates — Dinesh Babu</p>
      </div>

      {/* Earned certificates */}
      <div className="mb-2">
        <h2 className="font-bold text-navy text-sm uppercase tracking-wide flex items-center gap-2 mb-4">
          <Award size={16} className="text-jade" /> Issued Certificates ({earned.length})
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earned.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl border border-jade/20 shadow-sm overflow-hidden">
              {/* Certificate header */}
              <div className="bg-gradient-to-r from-navy to-steel p-4 relative">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <Award size={16} className="text-gold" />
                </div>
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-1">NIMASA Approved</p>
                <p className="text-white font-bold text-sm leading-tight">{cert.title}</p>
                <p className="text-white/50 text-[10px] mt-1">{cert.stcw}</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">NIMASA No.</span>
                  <span className="font-mono font-semibold text-navy">{cert.nimasa}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Issued</span>
                  <span className="text-navy">{cert.issued}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Expires</span>
                  <span className="text-jade font-semibold">{cert.expiry}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold text-ocean border border-ocean/30 py-2 rounded-lg hover:bg-ocean/10 transition-colors">
                    <Download size={12} /> Download
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-bold text-muted border border-border py-2 rounded-lg hover:bg-surface transition-colors">
                    <ExternalLink size={12} /> Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending certificates */}
      <div className="mt-8">
        <h2 className="font-bold text-navy text-sm uppercase tracking-wide flex items-center gap-2 mb-4">
          <Lock size={16} className="text-muted" /> Certificates to Earn ({pending.length})
        </h2>
        <div className="bg-white rounded-xl border border-border shadow-sm divide-y divide-border overflow-hidden">
          {pending.map((cert, i) => (
            <div key={i} className="px-5 py-4 flex items-start gap-4 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                <Lock size={14} className="text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm">{cert.title}</p>
                <p className="text-xs text-ocean mt-0.5">{cert.stcw}</p>
                <p className="text-xs text-muted mt-1">{cert.requirement}</p>
              </div>
              <span className="text-[10px] font-bold text-muted bg-surface border border-border px-2 py-0.5 rounded-full shrink-0">Locked</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
