import mongoose from 'mongoose';

const gstAnalysisSchema = new mongoose.Schema(
  {
    total_filings: Number,
    filed_count: Number,
    pending_count: Number,
    nil_returns: Number,
    avg_monthly_sales: Number,
    avg_monthly_purchases: Number,
    avg_monthly_tax_paid: Number,
    compliance_rate: Number,
    total_sales: Number,
    total_purchases: Number,
    total_net_tax_paid: Number,
    b2b_sales_ratio: Number,
  },
  { _id: false }
);

const healthAnalysisSchema = new mongoose.Schema(
  {
    msme_id: {
      type: String,
      required: true,
      index: true,
    },
    report_id: {
      type: String,
      required: true,
      unique: true,
    },
    monthly_inflow: {
      type: Map,
      of: Number,
      default: {},
    },
    monthly_outflow: {
      type: Map,
      of: Number,
      default: {},
    },
    net_cashflow: {
      type: Number,
      default: 0,
    },
    cashflow_volatility: {
      type: Number,
      default: 0,
    },
    avg_balance: {
      type: Number,
      default: 0,
    },
    low_balance_days: {
      type: Number,
      default: 0,
    },
    emi_transactions: {
      type: Number,
      default: 0,
    },
    cheque_bounces: {
      type: Number,
      default: 0,
    },
    overdraft_days: {
      type: Number,
      default: 0,
    },
    gst_analysis: {
      type: gstAnalysisSchema,
      default: null,
    },
    period_start: {
      type: Date,
    },
    period_end: {
      type: Date,
    },
    generated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

healthAnalysisSchema.index({ msme_id: 1, generated_at: -1 });

const HealthAnalysis = mongoose.model('HealthAnalysis', healthAnalysisSchema);

export default HealthAnalysis;

