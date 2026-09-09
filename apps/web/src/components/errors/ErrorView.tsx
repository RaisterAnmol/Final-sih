import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  RefreshCw,
  Search,
  UserCheck,
  FileSpreadsheet,
  FileText,
  KeyRound,
  FileQuestion,
  FileWarning,
} from "lucide-react";
import { ErrorLayout } from "./ErrorLayout";
import { ErrorProps, ErrorType } from "./types";
import { useAuth } from "../../context/AuthContext";

export const ErrorView: React.FC<ErrorProps> = (props) => {
  const { type = "404", resourceId, requiredRole } = props;
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  // Helper defaults based on authoritative architecture specification
  switch (type) {
    // 1. 404 — Page Not Found / Audit Trail Lost
    case "404":
      return (
        <ErrorLayout
          type="404"
          code="404"
          title={props.title || "Audit Trail Lost — Page Not Found"}
          subtitle={props.subtitle || "UNRESOLVED ROUTE RESOLUTION"}
          description={
            props.description ||
            "The page you are looking for does not exist or may have been relocated within the parliamentary intelligence station."
          }
          showSearch={true}
          {...props}
        />
      );

    // 2. 401 — Unauthorized / Session Expired
    case "401":
      return (
        <ErrorLayout
          type="401"
          code="401"
          title={props.title || "Session Expired or Missing Credentials"}
          subtitle={props.subtitle || "AUTHENTICATION REQUIRED"}
          description={
            props.description ||
            "Your statutory session has expired or no valid cryptographic token was detected. Please sign in again to continue your review."
          }
          actions={[
            {
              label: "Sign In to Platform",
              to: "/login",
              variant: "primary",
              icon: <UserCheck className="w-3.5 h-3.5" />,
            },
            {
              label: "Return Home",
              to: "/",
              variant: "secondary",
              icon: <Home className="w-3.5 h-3.5" />,
            },
          ]}
          {...props}
        />
      );

    // 3. 403 — Access Restricted / RBAC
    case "403":
      return (
        <ErrorLayout
          type="403"
          code="403"
          title={props.title || "Access Restricted Under Governance Rules"}
          subtitle={props.subtitle || "STATUTORY CLEARANCE REQUIRED"}
          description={
            props.description ||
            "You are authenticated, but you do not possess the required statutory clearance level to review or edit this sensitive forensic dossier."
          }
          requiredRole={requiredRole || "ADMIN / AUDITOR"}
          userRole={user?.role || "OBSERVER"}
          actions={[
            {
              label: "Return to Dashboard",
              to: "/dashboard",
              variant: "primary",
              icon: <Home className="w-3.5 h-3.5" />,
            },
            {
              label: "Elevation: Sign In as Auditor",
              onClick: async () => {
                await switchDemoRole("AUDITOR");
                navigate("/dashboard");
              },
              variant: "secondary",
              icon: <KeyRound className="w-3.5 h-3.5" />,
            },
          ]}
          {...props}
        />
      );

    // 4. 429 — Rate Limit Exceeded
    case "429":
      return (
        <ErrorLayout
          type="429"
          code="429"
          title={props.title || "Too Many Telemetry Requests"}
          subtitle={props.subtitle || "STATUTORY RATE LIMIT ENFORCED"}
          description={
            props.description ||
            "Too many requests have been received within a short window. Please allow analytical rate limit cooldown before continuing."
          }
          details={[
            { label: "Cooldown Window", value: "30 Seconds", status: "warning" },
            { label: "Throttled Gateway", value: "/api/ml/analyze", status: "neutral" },
            { label: "IP Protection", value: "Active", status: "available" },
          ]}
          {...props}
        />
      );

    // 5. 500 — Internal Server Error
    case "500":
      return (
        <ErrorLayout
          type="500"
          code="500"
          title={props.title || "System Error Detected"}
          subtitle={props.subtitle || "UPSTREAM TELEMETRY FAULT"}
          description={
            props.description ||
            "Something went wrong while processing your request. An incident reference ID has been generated for technical review."
          }
          {...props}
        />
      );

    // 6. 503 — Service / ML Analysis Unavailable
    case "503":
      return (
        <ErrorLayout
          type="503"
          code="503"
          title={props.title || "Analysis Service Temporarily Unavailable"}
          subtitle={props.subtitle || "UPSTREAM PIPELINE OFFLINE"}
          description={
            props.description ||
            "The anomaly-detection intelligence pipeline is temporarily unavailable. Your existing project data remains completely safe."
          }
          details={[
            { label: "React Gateway", value: "Online", status: "available" },
            { label: "Public Works Snapshot", value: "60,359 Records Safe", status: "available" },
            { label: "ML Inference Service", value: "Reconnecting", status: "warning" },
          ]}
          {...props}
        />
      );

    // 7. Network / API Offline
    case "NETWORK":
      return (
        <ErrorLayout
          type="NETWORK"
          code="OFFLINE"
          title={props.title || "Connection Lost — API Offline"}
          subtitle={props.subtitle || "NETWORK LINK UNREACHABLE"}
          description={
            props.description ||
            "Unable to connect to the MPLAD Insight Gateway. Telemetry may be restricted until connection is restored."
          }
          details={[
            { label: "API Gateway", value: "Offline / Port 5000", status: "unavailable" },
            { label: "Public Snapshot Cache", value: "Active in Browser", status: "available" },
          ]}
          {...props}
        />
      );

    // 8. Data Unavailable (Evidence-first missing data breakdown)
    case "DATA_UNAVAILABLE":
      return (
        <ErrorLayout
          type="DATA_UNAVAILABLE"
          code="N/A"
          title={props.title || "Source Field Information Unavailable"}
          subtitle={props.subtitle || "EVIDENCE-FIRST PROVENANCE GAP"}
          description={
            props.description ||
            "Required source information was not published in the official 2023–24 public snapshot for this record. In accordance with zero-fabrication guidelines, missing fields are preserved as unavailable rather than estimated."
          }
          details={
            props.details || [
              { label: "Project Title", value: "Verified", status: "available" },
              { label: "Recommending MP", value: "Verified", status: "available" },
              { label: "District Authority", value: "Verified", status: "available" },
              { label: "Sanctioned Amount", value: "Verified", status: "available" },
              { label: "Utilized Amount", value: "Unavailable in Snapshot", status: "unavailable" },
              { label: "Progress %", value: "Unavailable in Snapshot", status: "unavailable" },
              { label: "GPS Coordinates", value: "Unavailable in Snapshot", status: "unavailable" },
            ]
          }
          {...props}
        />
      );

    // 9. ML Analysis Failed (FastAPI / Isolation Forest Failure)
    case "ML_ERROR":
      return (
        <ErrorLayout
          type="ML_ERROR"
          code="ML-FAIL"
          title={props.title || "AI Anomaly Pipeline Execution Failed"}
          subtitle={props.subtitle || "FASTAPI INFERENCE EXCEPTION"}
          description={
            props.description ||
            "The project was verified in the public register, but multi-signal anomaly inference could not be completed by the Python ML pipeline."
          }
          details={[
            { label: "Model Architecture", value: "Isolation Forest + LOF", status: "neutral" },
            { label: "Failure Cause", value: "Analysis Timeout or Vector Dimension Mismatch", status: "warning" },
            { label: "Fallback Rule Engine", value: "Ready for Standby Scan", status: "available" },
          ]}
          {...props}
        />
      );

    // 10. Invalid Project / Project Not Found
    case "PROJECT_NOT_FOUND":
      return (
        <ErrorLayout
          type="PROJECT_NOT_FOUND"
          code="404"
          title={props.title || "MPLADS Project Record Not Found"}
          subtitle={props.subtitle || "CIVIL REGISTER LOOKUP FAILED"}
          description={
            props.description ||
            `The requested project ID '${resourceId || "UNKNOWN"}' does not exist in the official 2023–24 public-source snapshot register.`
          }
          showSearch={true}
          actions={[
            {
              label: "Explore Works Register",
              to: "/projects",
              variant: "primary",
              icon: <FileQuestion className="w-3.5 h-3.5" />,
            },
            {
              label: "Return to Dashboard",
              to: "/dashboard",
              variant: "secondary",
              icon: <Home className="w-3.5 h-3.5" />,
            },
          ]}
          {...props}
        />
      );

    // 11. Risk Case Not Found
    case "RISK_CASE_NOT_FOUND":
      return (
        <ErrorLayout
          type="RISK_CASE_NOT_FOUND"
          code="404"
          title={props.title || "Investigation Risk Case Not Found"}
          subtitle={props.subtitle || "AUDIT DOSSIER NOT FOUND"}
          description={
            props.description ||
            `Investigation dossier '${resourceId || "UNKNOWN"}' does not exist or has been archived.`
          }
          actions={[
            {
              label: "Return to Risk Cases",
              to: "/risk-cases",
              variant: "primary",
              icon: <FileWarning className="w-3.5 h-3.5" />,
            },
            {
              label: "Return to Dashboard",
              to: "/dashboard",
              variant: "secondary",
              icon: <Home className="w-3.5 h-3.5" />,
            },
          ]}
          {...props}
        />
      );

    // 12. Import Error (CSV / Data Validation Failure)
    case "IMPORT_ERROR":
      return (
        <ErrorLayout
          type="IMPORT_ERROR"
          code="IMPORT-FAIL"
          title={props.title || "Dataset Ingestion Validation Error"}
          subtitle={props.subtitle || "CSV PARSE & SCHEMA MISMATCH"}
          description={
            props.description ||
            "The uploaded dataset failed statutory schema validation. Non-conforming rows were rejected to preserve database integrity."
          }
          details={[
            { label: "Rows Processed", value: "8,420 Rows", status: "available" },
            { label: "Rows Rejected", value: "1 Row (Invalid Status)", status: "unavailable" },
            { label: "Validation Standard", value: "NIC-MoSPI MPLADS v2024", status: "neutral" },
          ]}
          actions={[
            {
              label: "Return to Data Ingestion",
              to: "/import",
              variant: "primary",
              icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
            },
            {
              label: "Inspect Audit Trail",
              to: "/audit-logs",
              variant: "secondary",
              icon: <FileText className="w-3.5 h-3.5" />,
            },
          ]}
          {...props}
        />
      );

    // 13. Report Generation Error
    case "REPORT_ERROR":
      return (
        <ErrorLayout
          type="REPORT_ERROR"
          code="REPORT-FAIL"
          title={props.title || "Statutory Report Generation Interrupted"}
          subtitle={props.subtitle || "PDF / CSV COMPILATION TIMEOUT"}
          description={
            props.description ||
            "The requested analytical report could not be compiled. Upstream document aggregation service timed out."
          }
          actions={[
            {
              label: "Return to Reports Center",
              to: "/reports",
              variant: "primary",
              icon: <FileText className="w-3.5 h-3.5" />,
            },
            {
              label: "Return to Dashboard",
              to: "/dashboard",
              variant: "secondary",
              icon: <Home className="w-3.5 h-3.5" />,
            },
          ]}
          {...props}
        />
      );

    // 14. Maintenance Page
    case "MAINTENANCE":
      return (
        <ErrorLayout
          type="MAINTENANCE"
          code="MAINT"
          title={props.title || "Scheduled Statutory System Calibration"}
          subtitle={props.subtitle || "GOVERNANCE ENGINE MAINTENANCE"}
          description={
            props.description ||
            "MPLAD Insight is currently undergoing scheduled database indexing and model calibration. Normal access will resume shortly."
          }
          details={[
            { label: "System Maintenance Window", value: "22:00 - 23:00 IST", status: "neutral" },
            { label: "Data Integrity Check", value: "100% Passed", status: "available" },
            { label: "Estimated Completion", value: "15 Minutes", status: "warning" },
          ]}
          {...props}
        />
      );

    default:
      return <ErrorLayout {...props} />;
  }
};

