import { Router } from "express";
import {
  getDashboardSummary,
  validateDashboardData,
} from "../controllers/dashboardController.js";

const router = Router();

router.get("/summary", getDashboardSummary);
router.get("/validate", validateDashboardData);

export default router;
