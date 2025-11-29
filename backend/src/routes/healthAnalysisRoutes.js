import express from 'express';
import FinancialHealth from '../model/financialHealth.js';
import HealthAnalysis from '../model/healthAnalysis.js';

const router = express.Router();

const SAMPLE_GST_ANALYSIS = {
  total_filings: 12,
  filed_count: 12,
  pending_count: 0,
  nil_returns: 0,
  avg_monthly_sales: 481875,
  avg_monthly_purchases: 240937.5,
  avg_monthly_tax_paid: 43368.75,
  compliance_rate: 100,
  total_sales: 5782500,
  total_purchases: 2891250,
  total_net_tax_paid: 520425,
  b2b_sales_ratio: 0.79,
};

const buildMonthlySeries = (financialHealth = {}) => {
  const breakdown =
    financialHealth?.metadata?.pattern_analysis?.monthly_breakdown ||
    financialHealth?.monthly_breakdown ||
    {};

  const inflow = {};
  const outflow = {};

  Object.entries(breakdown).forEach(([month, data]) => {
    inflow[month] = data.credits || 0;
    outflow[month] = data.debits || 0;
  });

  return { inflow, outflow };
};

const computeAnalysis = (msmeId, financialHealth) => {
  const reportId = `HA-${msmeId}-${Date.now()}`;
  const { inflow, outflow } = buildMonthlySeries(financialHealth);

  const netCashflow =
    financialHealth?.net_cashflow ??
    Object.values(inflow).reduce((acc, val, idx) => acc + val - (Object.values(outflow)[idx] || 0), 0);

  return {
    msme_id: msmeId,
    report_id: reportId,
    monthly_inflow: inflow,
    monthly_outflow: outflow,
    net_cashflow: netCashflow,
    cashflow_volatility:
      financialHealth?.metadata?.cashflow_volatility ||
      financialHealth?.volatility_score ||
      0.12,
    avg_balance: financialHealth?.average_balance || 0,
    low_balance_days: financialHealth?.metadata?.low_balance_days || 2,
    emi_transactions: financialHealth?.metadata?.emi_transactions || 8,
    cheque_bounces: financialHealth?.metadata?.cheque_bounces || 0,
    overdraft_days: financialHealth?.metadata?.overdraft_days || 0,
    gst_analysis: financialHealth?.gst_analysis || SAMPLE_GST_ANALYSIS,
    period_start: financialHealth?.period_start || new Date(),
    period_end: financialHealth?.period_end || new Date(),
  };
};

router.get('/:msmeId/latest', async (req, res) => {
  try {
    const { msmeId } = req.params;
    const latest = await HealthAnalysis.findOne({ msme_id: msmeId })
      .sort({ generated_at: -1 })
      .lean();

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: 'No analysis found for this MSME',
      });
    }

    const { _id, __v, ...analysis } = latest;
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error fetching health analysis:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:msmeId/history', async (req, res) => {
  try {
    const { msmeId } = req.params;
    const history = await HealthAnalysis.find({ msme_id: msmeId })
      .sort({ generated_at: -1 })
      .limit(parseInt(req.query.limit, 10) || 10)
      .lean();

    res.json({
      success: true,
      history: history.map(({ _id, __v, ...record }) => record),
    });
  } catch (error) {
    console.error('Error fetching health analysis history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:msmeId/run', async (req, res) => {
  try {
    const { msmeId } = req.params;

    const latestFinancialHealth = await FinancialHealth.findOne({ msme_id: msmeId })
      .sort({ generated_at: -1 })
      .lean();

    const analysisPayload = computeAnalysis(msmeId, latestFinancialHealth);
    const analysis = await HealthAnalysis.create(analysisPayload);

    res.json({
      success: true,
      message: 'Health analysis completed',
      analysis,
    });
  } catch (error) {
    console.error('Error running health analysis:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

