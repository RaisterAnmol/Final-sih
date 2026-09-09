import { ReactNode } from "react";

export type ErrorType =
  | "404"
  | "401"
  | "403"
  | "429"
  | "500"
  | "503"
  | "NETWORK"
  | "DATA_UNAVAILABLE"
  | "ML_ERROR"
  | "PROJECT_NOT_FOUND"
  | "RISK_CASE_NOT_FOUND"
  | "IMPORT_ERROR"
  | "REPORT_ERROR"
  | "MAINTENANCE";

export interface ErrorAction {
  label: string;
  onClick?: () => void;
  to?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  icon?: ReactNode;
}

export interface ErrorDetailsItem {
  label: string;
  value: string | number | boolean;
  status?: "available" | "unavailable" | "warning" | "neutral";
}

export interface ErrorProps {
  type?: ErrorType;
  code?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  incidentId?: string;
  resourceId?: string;
  requiredRole?: string;
  userRole?: string;
  cooldownSeconds?: number;
  details?: ErrorDetailsItem[];
  actions?: ErrorAction[];
  showSearch?: boolean;
  onRetry?: () => void | Promise<void>;
  className?: string;
}

