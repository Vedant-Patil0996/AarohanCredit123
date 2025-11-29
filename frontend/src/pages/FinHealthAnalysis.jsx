import React, { useEffect, useMemo, useState } from 'react';
import { Activity, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const FinHealthAnalysis = ({ msmeId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/health-analysis/${msmeId}/latest`);
      if (!res.ok) throw new Error('No analysis available yet');
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis(null);
      setError(err.message);
    }
  };

  const runAnalysis = async () => {
    setIsRunning(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/health-analysis/${msmeId}/run`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Unable to trigger health analysis');
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [msmeId]);

  const monthlySeries = useMemo(() => {
    if (!analysis) return [];
    const inflow = analysis.monthly_inflow || {};
    const outflow = analysis.monthly_outflow || {};
    return Object.keys(inflow).map((month) => ({
      month: month.substring(5),
      inflow: inflow[month] || 0,
      outflow: outflow[month] || 0,
      net: (inflow[month] || 0) - (outflow[month] || 0),
    }));
  }, [analysis]);

  const formatCurrency = (val = 0) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#00FF75]" />
          <div>
            <p className="text-white font-semibold text-lg">Health Analysis Agent</p>
            <p className="text-white/60 text-sm">
              Calculates monthly inflow/outflow, volatility, EMI history, and GST hygiene before storing the report.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {analysis && (
            <span className="text-white/50 text-sm">
              Last generated: {new Date(analysis.generated_at || analysis.updatedAt).toLocaleString()}
            </span>
          )}
          <button
            onClick={analysis ? runAnalysis : fetchAnalysis}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00FF75] text-[#0a0d12] font-semibold hover:bg-[#0DF86A] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {analysis ? 'Run new analysis' : 'Get analysis'}
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-4 text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {analysis ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Net Cashflow</p>
              <p className="text-white text-2xl font-semibold">{formatCurrency(analysis.net_cashflow)}</p>
            </div>
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Avg Balance</p>
              <p className="text-white text-2xl font-semibold">{formatCurrency(analysis.avg_balance)}</p>
            </div>
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Cashflow Volatility</p>
              <p className="text-white text-2xl font-semibold">
                {(analysis.cashflow_volatility * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">EMI Transactions</p>
              <p className="text-white text-2xl font-semibold">{analysis.emi_transactions}</p>
            </div>
          </div>

          <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white font-semibold">Monthly inflow vs outflow</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySeries}>
                  <defs>
                    <linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF75" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00FF75" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0d12',
                      border: '1px solid rgba(0,255,117,0.2)',
                      borderRadius: '10px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="inflow" stroke="#00FF75" fillOpacity={1} fill="url(#inflow)" />
                  <Area type="monotone" dataKey="outflow" stroke="#ef4444" fillOpacity={1} fill="url(#outflow)" />
                  <Area type="monotone" dataKey="net" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Low balance days</p>
              <p className="text-white text-2xl font-semibold">{analysis.low_balance_days}</p>
            </div>
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Cheque bounces</p>
              <p className="text-white text-2xl font-semibold">{analysis.cheque_bounces}</p>
            </div>
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-4">
              <p className="text-white/50 text-xs uppercase tracking-wider">Overdraft days</p>
              <p className="text-white text-2xl font-semibold">{analysis.overdraft_days}</p>
            </div>
          </div>

          {analysis.gst_analysis && (
            <div className="bg-[#151920]/60 border border-[#00FF75]/15 rounded-2xl p-6">
              <p className="text-white font-semibold mb-4">GST compliance snapshot</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/50 text-xs uppercase">Filings</p>
                  <p className="text-white font-semibold">
                    {analysis.gst_analysis.filed_count}/{analysis.gst_analysis.total_filings}
                  </p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase">Compliance rate</p>
                  <p className="text-white font-semibold">{analysis.gst_analysis.compliance_rate}%</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase">Avg monthly sales</p>
                  <p className="text-white font-semibold">{formatCurrency(analysis.gst_analysis.avg_monthly_sales)}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase">B2B ratio</p>
                  <p className="text-white font-semibold">
                    {(analysis.gst_analysis.b2b_sales_ratio * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 border border-dashed border-white/15 rounded-2xl">
          <Database className="w-10 h-10 text-white/40 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">No analysis stored yet</p>
          <p className="text-white/60 text-sm">Tap the button above to trigger the Health Analysis Agent.</p>
        </div>
      )}
    </div>
  );
};

export default FinHealthAnalysis;

