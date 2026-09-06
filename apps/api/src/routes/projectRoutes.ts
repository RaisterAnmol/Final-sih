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
router.get("/export/csv", exportProjectsCSV);
router.get("/mps/directory", getMpDirectory);
router.get("/:id", getProjectById);
router.post(
  "/analyze",
  authenticateToken,
  authorizeRoles("ADMIN", "AUDITOR", "ANALYST"),
  runAnalysis,
);

export default router;
