import React, { useState } from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const APPLICATIONS = [
  {
    id: 'APP-2025-11-001',
    lender: 'Apex Bank',
    product: 'Working Capital Prime',
    amount: '₹15,00,000',
    submittedOn: '24 Nov 2025',
    status: 'Underwriting',
    stage: 'Credit team evaluating behavioral score & cashflow stability.',
    badge: 'text-amber-300 bg-amber-400/10 border border-amber-400/40',
  },
  {
    id: 'APP-2025-10-014',
    lender: 'FinServe NBFC',
    product: 'Digital Growth Loan',
    amount: '₹12,00,000',
    submittedOn: '12 Oct 2025',
    status: 'Offer Received',
    stage: 'Offer accepted, awaiting document signing.',
    badge: 'text-emerald-300 bg-emerald-400/10 border border-emerald-400/40',
  },
  {
    id: 'APP-2025-09-008',
    lender: 'Regional Credit Union',
    product: 'Inventory Plus',
    amount: '₹9,00,000',
    submittedOn: '29 Sep 2025',
    status: 'Docs Pending',
    stage: 'Upload updated GST filings to move to approval.',
    badge: 'text-white/80 bg-white/5 border border-white/10',
  },
];

const LoanApplications = () => {
  const [selected, setSelected] = useState(APPLICATIONS[0]);

  return (
    <div className="space-y-6">
      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-6 h-6 text-[#00FF75]" />
          <div>
            <p className="text-white font-semibold text-lg">Application Timeline</p>
            <p className="text-white/60 text-sm">Every submission stays linked to your financial health snapshot.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {APPLICATIONS.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelected(app)}
              className={`text-left rounded-2xl border p-4 transition ${
                selected.id === app.id
                  ? 'border-[#00FF75]/60 bg-[#00FF75]/10 shadow-[0_0_20px_#00ff75]/20'
                  : 'border-white/10 hover:border-[#00FF75]/30'
              }`}
            >
              <p className="text-xs text-white/40 mb-1">{app.id}</p>
              <p className="text-white font-semibold">{app.lender}</p>
              <p className="text-white/60 text-sm">{app.product}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${app.badge}`}>{app.status}</span>
                <span className="text-white/40 text-xs">{app.submittedOn}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white font-semibold text-xl">{selected.product}</p>
            <p className="text-white/60">{selected.lender}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Requested Amount</p>
            <p className="text-2xl font-semibold text-white">{selected.amount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <Clock className="w-5 h-5 text-[#00FF75] mb-2" />
            <p className="text-white/60 text-xs uppercase tracking-wide">Submitted On</p>
            <p className="text-white font-semibold">{selected.submittedOn}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-[#00FF75] mb-2" />
            <p className="text-white/60 text-xs uppercase tracking-wide">Current Status</p>
            <p className="text-white font-semibold">{selected.status}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <AlertCircle className="w-5 h-5 text-[#00FF75] mb-2" />
            <p className="text-white/60 text-xs uppercase tracking-wide">Next Action</p>
            <p className="text-white font-semibold">{selected.stage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplications;