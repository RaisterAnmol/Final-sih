import { Router } from "express";
import {
  getDashboardSummary,
  validateDashboardData,
} from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/summary", getDashboardSummary);
router.get("/validate", validateDashboardData);
router.get("/summary", authenticateToken, getDashboardSummary);
router.get("/validate", authenticateToken, validateDashboardData);

export default router;
