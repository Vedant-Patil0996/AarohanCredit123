import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Sparkles, Shield, TrendingUp } from 'lucide-react';

const lenders = [
  {
    id: 1,
    name: 'Apex Bank MSME Suite',
    focus: 'Working Capital',
    risk: 'low',
    rate: '9.4%',
    maxAmount: '₹18L',
    turnaround: '36 hrs',
    description: 'Prefers MSMEs with high cashflow stability and GST compliance.',
  },
  {
    id: 2,
    name: 'FinServe Digital Lending',
    focus: 'Growth Capital',
    risk: 'medium',
    rate: '10.8%',
    maxAmount: '₹12L',
    turnaround: '24 hrs',
    description: 'Optimised for digitally compliant MSMEs with strong inflows.',
  },
  {
    id: 3,
    name: 'Regional Credit Union',
    focus: 'Equipment Finance',
    risk: 'medium',
    rate: '11.6%',
    maxAmount: '₹10L',
    turnaround: '48 hrs',
    description: 'Looks for predictable behavioral scores and GST history.',
  },
  {
    id: 4,
    name: 'Velocity NBFC',
    focus: 'Invoice Financing',
    risk: 'high',
    rate: '13.0%',
    maxAmount: '₹8L',
    turnaround: '12 hrs',
    description: 'Accepts higher volatility MSMEs with strong receivable cycles.',
  },
];

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const formatCurrency = (val = 0) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const SearchLoans = () => {
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [financialSnapshot, setFinancialSnapshot] = useState(null);
  const msme = JSON.parse(localStorage.getItem('user') || '{}');
  const msmeId = msme.msme_id || msme.id || 'MSME002';

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/financial-health/${msmeId}`);
        if (!res.ok) throw new Error('Failed to fetch financial health');
        const data = await res.json();
        setFinancialSnapshot(data.financial_health || data);
      } catch (error) {
        console.error('Error loading financial snapshot', error);
        setFinancialSnapshot(null);
      }
    };
    fetchSnapshot();
  }, [msmeId]);

  const filteredLenders = useMemo(() => {
    return lenders.filter((lender) => {
      const matchesQuery =
        lender.name.toLowerCase().includes(query.toLowerCase()) ||
        lender.focus.toLowerCase().includes(query.toLowerCase());
      const matchesRisk = riskFilter === 'all' || lender.risk === riskFilter;
      return matchesQuery && matchesRisk;
    });
  }, [query, riskFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">Search for lenders mapped to your current health metrics.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {['all', 'low', 'medium', 'high'].map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                riskFilter === risk
                  ? 'bg-[#00FF75]/20 border-[#00FF75]/40 text-white'
                  : 'border-white/10 text-white/60 hover:border-[#00FF75]/30'
              }`}
            >
              {risk === 'all' ? 'All Risk Bands' : `${risk[0].toUpperCase()}${risk.slice(1)} Risk`}
            </button>
          ))}
        </div>
      </div>

      {financialSnapshot && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Net Cashflow</span>
              <TrendingUp className="w-4 h-4 text-[#00FF75]" />
            </div>
            <p className="text-2xl font-semibold text-white">
              {formatCurrency(Math.abs(financialSnapshot.net_cashflow || 0))}
            </p>
          </div>
          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Cashflow Stability</span>
              <Shield className="w-4 h-4 text-[#00FF75]" />
            </div>
            <p className="text-2xl font-semibold text-white">
              {Math.round((financialSnapshot.cashflow_stability_score || 0) * 100)}%
            </p>
          </div>
          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Average Balance</span>
              <Sparkles className="w-4 h-4 text-[#00FF75]" />
            </div>
            <p className="text-2xl font-semibold text-white">{formatCurrency(financialSnapshot.average_balance || 0)}</p>
          </div>
        </div>
      )}

      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-5 flex items-center gap-3">
        <Search className="w-5 h-5 text-white/60" />
        <input
          type="text"
          placeholder="Search lenders by name, focus area, or risk band..."
          className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLenders.map((lender) => (
          <div
            key={lender.id}
            className="bg-[#151920]/70 border border-[#00FF75]/15 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00FF75]/40 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{lender.name}</h3>
                  <p className="text-white/50 text-sm">{lender.focus}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/70 uppercase">
                  {lender.risk} risk
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{lender.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white text-lg font-semibold">{lender.rate}</p>
                <p className="text-xs text-white/50">Rate</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white text-lg font-semibold">{lender.maxAmount}</p>
                <p className="text-xs text-white/50">Max</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white text-lg font-semibold">{lender.turnaround}</p>
                <p className="text-xs text-white/50">TAT</p>
              </div>
            </div>
            <button className="mt-6 w-full py-3 rounded-xl bg-[#00FF75] text-[#0a0d12] font-semibold hover:bg-[#0DF86A] transition">
              View Policy Fit
            </button>
          </div>
        ))}
      </div>

      {filteredLenders.length === 0 && (
        <div className="text-center py-10 border border-dashed border-white/20 rounded-2xl text-white/60">
          <Filter className="w-8 h-8 mx-auto mb-3" />
          No lenders match this filter. Try changing the risk band or keyword.
        </div>
      )}
    </div>
  );
};

export default SearchLoans;

