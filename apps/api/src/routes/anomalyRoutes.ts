import { Router } from 'express';
import { getAnomalies } from '../controllers/anomalyController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getAnomalies);
router.get('/', authenticateToken, getAnomalies);

export default router;
