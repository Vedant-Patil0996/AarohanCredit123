import React from 'react';
import { Award, ExternalLink, Stamp } from 'lucide-react';

const approvals = [
  {
    id: 'APR-2025-10-002',
    lender: 'FinServe NBFC',
    product: 'Digital Growth Loan',
    amount: '₹12,00,000',
    rate: '10.2% fixed',
    tenure: '24 months',
    validity: 'Valid till 05 Dec 2025',
    notes: 'Offer auto-generated after AA data sync + behavioral score 665.',
  },
  {
    id: 'APR-2025-09-005',
    lender: 'Apex Bank',
    product: 'Working Capital Prime',
    amount: '₹15,00,000',
    rate: '9.5% floating',
    tenure: '36 months',
    validity: 'Signed 12 Oct 2025',
    notes: 'Collateral waived owing to strong GST compliance & cashflow stability.',
  },
];

const Approvals = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6 flex items-center gap-4">
        <Stamp className="w-10 h-10 text-[#00FF75]" />
        <div>
          <p className="text-white font-semibold text-lg">Approved offers & proposals</p>
          <p className="text-white/60 text-sm">
            Every offer stays linked with the financial health snapshot used during underwriting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="bg-[#151920]/70 border border-[#00FF75]/15 rounded-2xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/50">{approval.id}</p>
                <p className="text-white font-semibold text-xl">{approval.product}</p>
                <p className="text-white/60">{approval.lender}</p>
              </div>
              <Award className="w-8 h-8 text-[#00FF75]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white/60 text-xs uppercase">Amount</p>
                <p className="text-white font-semibold">{approval.amount}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white/60 text-xs uppercase">Rate</p>
                <p className="text-white font-semibold">{approval.rate}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white/60 text-xs uppercase">Tenure</p>
                <p className="text-white font-semibold">{approval.tenure}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white/60 text-xs uppercase">Validity</p>
                <p className="text-white font-semibold">{approval.validity}</p>
              </div>
            </div>

            <p className="text-white/70 text-sm">{approval.notes}</p>

            <button className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold w-full py-3 rounded-xl border border-[#00FF75]/30 text-white hover:bg-[#00FF75]/10 transition">
              View offer file
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Approvals;

