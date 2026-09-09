import { Router } from "express";
import {
  getProjects,
  getProjectById,
  exportProjectsCSV,
  runAnalysis,
  getMpDirectory,
} from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/rbac.js";

const router = Router();

router.get("/", getProjects);
// Public routes — parliamentary data directory and export are legitimately public
router.get("/mps/directory", getMpDirectory);
router.get("/export/csv", exportProjectsCSV);
router.get("/mps/directory", getMpDirectory);
router.get("/:id", getProjectById);

// Protected routes — project data contains sensitive risk analysis
router.get("/", authenticateToken, getProjects);
router.get("/:id", authenticateToken, getProjectById);
router.post(
  "/analyze",
  authenticateToken,
  authorizeRoles("ADMIN", "AUDITOR", "ANALYST"),
  runAnalysis,
);

export default router;
