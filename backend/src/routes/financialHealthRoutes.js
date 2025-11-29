import express from 'express';
import FinancialHealth from '../model/financialHealth.js';

const router = express.Router();

// GET financial health data for a specific MSME
router.get('/:msmeId', async (req, res) => {
  try {
    const { msmeId } = req.params;

    // Get the most recent financial health report for this MSME
    const financialHealth = await FinancialHealth.findOne({ msme_id: msmeId })
      .sort({ generated_at: -1 })
      .lean();

    if (!financialHealth) {
      return res.status(404).json({ 
        success: false, 
        message: 'Financial health data not found for this MSME' 
      });
    }

    // Remove MongoDB _id and __v from response
    const { _id, __v, ...cleanData } = financialHealth;

    res.json({
      success: true,
      financial_health: cleanData
    });
  } catch (error) {
    console.error('Error fetching financial health:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching financial health data',
      error: error.message 
    });
  }
});

// GET all financial health reports for an MSME (history)
router.get('/:msmeId/history', async (req, res) => {
  try {
    const { msmeId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const reports = await FinancialHealth.find({ msme_id: msmeId })
      .sort({ generated_at: -1 })
      .limit(limit)
      .select('-metadata') // Exclude full metadata for list view
      .lean();

    res.json({
      success: true,
      reports: reports.map(({ _id, __v, ...report }) => report)
    });
  } catch (error) {
    console.error('Error fetching financial health history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching financial health history',
      error: error.message 
    });
  }
});

// POST - Create/Update financial health data
router.post('/', async (req, res) => {
  try {
    const financialHealthData = req.body;
    
    // If report_id exists, update; otherwise create new
    if (financialHealthData.report_id) {
      const updated = await FinancialHealth.findOneAndUpdate(
        { report_id: financialHealthData.report_id },
        financialHealthData,
        { new: true, upsert: true }
      );
      
      res.json({
        success: true,
        message: 'Financial health data updated',
        financial_health: updated
      });
    } else {
      const newFinancialHealth = new FinancialHealth(financialHealthData);
      await newFinancialHealth.save();
      
      res.status(201).json({
        success: true,
        message: 'Financial health data created',
        financial_health: newFinancialHealth
      });
    }
  } catch (error) {
    console.error('Error saving financial health:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving financial health data',
      error: error.message 
    });
  }
});

export default router;

