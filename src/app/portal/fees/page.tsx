import { CheckCircle, AlertCircle, Download, CreditCard } from "lucide-react";

const transactions = [
  { date: "15 Jan 2026", description: "Application Fee — Pre-Sea Deck Cadet", amount: 15000, status: "paid", ref: "SL-2026-00142" },
  { date: "20 Jan 2026", description: "Tuition — Semester 1 (50%)", amount: 240000, status: "paid", ref: "SL-2026-00198" },
  { date: "01 Apr 2026", description: "Tuition — Semester 2 (50%)", amount: 240000, status: "due", ref: null },
  { date: "20 Jan 2026", description: "NIMASA Registration Fee", amount: 25000, status: "paid", ref: "SL-2026-00199" },
  { date: "20 Jan 2026", description: "Medical Examination Fee", amount: 10000, status: "paid", ref: "SL-2026-00200" },
  { date: "15 Jun 2026", description: "Certificate Processing Fee", amount: 5000, status: "upcoming", ref: null },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "bg-jade/10 text-jade border-jade/20" },
  due: { label: "Due Now", color: "bg-danger/10 text-danger border-danger/20" },
  upcoming: { label: "Upcoming", color: "bg-amber/10 text-amber border-amber/20" },
};

const totalFee = 480000;
const totalPaid = transactions.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
const totalDue = transactions.filter((t) => t.status === "due").reduce((s, t) => s + t.amount, 0);

export default function FeesPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="font-cinzel text-2xl font-bold text-navy">Fees & Payments</h1>
        <p className="text-muted text-sm mt-1">Pre-Sea Deck Cadet Programme · Academic Year 2025/26</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-navy">
          <p className="text-xs text-muted uppercase font-bold tracking-wide mb-1">Total Programme Fee</p>
          <p className="text-2xl font-bold text-navy font-cinzel">₦{totalFee.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-jade">
          <p className="text-xs text-muted uppercase font-bold tracking-wide mb-1">Amount Paid</p>
          <p className="text-2xl font-bold text-jade font-cinzel">₦{totalPaid.toLocaleString()}</p>
          <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-jade rounded-full" style={{ width: `${Math.round((totalPaid / totalFee) * 100)}%` }} />
          </div>
          <p className="text-xs text-muted mt-1">{Math.round((totalPaid / totalFee) * 100)}% of total</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-5 border-t-4 border-t-danger">
          <p className="text-xs text-muted uppercase font-bold tracking-wide mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-danger font-cinzel">₦{totalDue.toLocaleString()}</p>
          {totalDue > 0 && (
            <p className="text-xs text-danger mt-1 font-semibold">⚠ Payment due now</p>
          )}
        </div>
      </div>

      {/* Payment due alert */}
      {totalDue > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <AlertCircle size={20} className="text-danger shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-danger text-sm">Payment Due: ₦{totalDue.toLocaleString()}</p>
            <p className="text-xs text-muted mt-0.5">Semester 2 tuition is due. Please complete payment to avoid suspension of your enrolment.</p>
          </div>
          <button className="shrink-0 inline-flex items-center gap-2 bg-danger text-white font-bold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm">
            <CreditCard size={14} /> Pay Now
          </button>
        </div>
      )}

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-navy">Transaction History</h2>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((t, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                t.status === "paid" ? "bg-jade/10" : t.status === "due" ? "bg-danger/10" : "bg-amber/10"
              }`}>
                {t.status === "paid" ? (
                  <CheckCircle size={16} className="text-jade" />
                ) : (
                  <AlertCircle size={16} className={t.status === "due" ? "text-danger" : "text-amber"} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">{t.description}</p>
                <p className="text-xs text-muted">{t.date}{t.ref && ` · Ref: ${t.ref}`}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold text-sm ${t.status === "paid" ? "text-jade" : t.status === "due" ? "text-danger" : "text-amber"}`}>
                  ₦{t.amount.toLocaleString()}
                </p>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusConfig[t.status].color}`}>
                  {statusConfig[t.status].label}
                </span>
              </div>
              {t.status === "paid" && (
                <button title="Download receipt" className="text-muted hover:text-ocean transition-colors ml-1">
                  <Download size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="mt-6 bg-white rounded-xl border border-border shadow-sm p-5">
        <h2 className="font-bold text-navy mb-4">Accepted Payment Methods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Paystack (Card)", "Bank Transfer", "USSD (*737#)", "Flutterwave"].map((method) => (
            <div key={method} className="border border-border rounded-lg p-3 text-center text-xs text-muted font-semibold hover:border-ocean hover:text-ocean transition-colors cursor-pointer">
              {method}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">Bank: First Bank of Nigeria · Account: 3012345678 · Name: SeaLearn Nigeria Maritime Institute</p>
      </div>
    </div>
  );
}
