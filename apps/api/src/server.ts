import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db.js";
import { seedDemoAccounts } from "./seed/seedData.js";
import { seedOfficialMplads } from "./seed/seedOfficialMplads.js";
import { Project } from "./models/Project.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contractorRoutes from "./routes/contractorRoutes.js";
import anomalyRoutes from "./routes/anomalyRoutes.js";
import riskCaseRoutes from "./routes/riskCaseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import districtRoutes from "./routes/districtRoutes.js";
import dataQualityRoutes from "./routes/dataQualityRoutes.js";
import auditLogRoutes from "./routes/auditRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Middlewares
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let isDataReady = false;

// Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Health Check (Non-blocking, reports service & database state)
app.get("/api/health", async (_req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  let count = 0;
  if (isDbConnected) {
    try {
      count = await Project.countDocuments();
    } catch {}
  }

  res.json({
    status: "ok",
    service: "mplad-insight-api",
    database: isDbConnected ? "connected" : "connecting",
    dataReady: isDataReady || count >= 60359,
    projectCount: count,
    timestamp: new Date().toISOString(),
    version: "1.0.0-SIH2026",
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contractors", contractorRoutes);
app.use("/api/anomalies", anomalyRoutes);
app.use("/api/risk-cases", riskCaseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/data-quality", dataQualityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api", auditLogRoutes); // Support both /api/audit-log and /api/settings

// Error Handling
app.use(errorHandler);

// Server Startup Lifecycle
async function startServer() {
  // Bind HTTP server immediately so port 5000 is open without refusal
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(
      `\n=============================================================`,
    );
    console.log(
      `  MPLAD INSIGHT API GATEWAY READY ON http://127.0.0.1:${PORT}`,
    );
    console.log(`  Health Check: http://127.0.0.1:${PORT}/api/health`);
    console.log(
      `=============================================================\n`,
    );
  });

  try {
    await connectDatabase();
    await seedDemoAccounts();

    // Ensure public-source snapshot is 100% seeded BEFORE accepting requests
    const projectCount = await Project.countDocuments();
    if (projectCount < 60359) {
      console.log(
        `[Bootstrap] Seeding public-source snapshot (current: ${projectCount}/60,359)...`,
      );
      const stats = await seedOfficialMplads();
      console.log(
        `[Bootstrap] ✓ Ingestion complete: ${stats.rowsImported} projects ready.`,
      );
    } else {
      console.log(
        `[Bootstrap] Database verified with ${projectCount} projects. Ready.`,
      );
    }

    isDataReady = true;
  } catch (err) {
    console.error("Database connection or bootstrap error:", err);
  }
}

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  startServer();
}

export default app;

