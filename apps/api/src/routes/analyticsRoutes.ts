import { Router } from 'express';
import {
  getFinancialAnalytics,
  getTemporalAnalytics,
  getEfficiencyAnalytics,
} from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/financial', getFinancialAnalytics);
router.get('/temporal', getTemporalAnalytics);
router.get('/efficiency', getEfficiencyAnalytics);
router.get('/financial', authenticateToken, getFinancialAnalytics);
router.get('/temporal', authenticateToken, getTemporalAnalytics);
router.get('/efficiency', authenticateToken, getEfficiencyAnalytics);

export default router;
