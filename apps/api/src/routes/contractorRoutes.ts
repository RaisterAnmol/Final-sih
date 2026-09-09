import { Router } from 'express';
import { getContractors, getContractorById } from '../controllers/contractorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getContractors);
router.get('/:id', getContractorById);
router.get('/', authenticateToken, getContractors);
router.get('/:id', authenticateToken, getContractorById);

export default router;
