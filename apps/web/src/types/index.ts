export type ProjectStatus =
  | "PROPOSED"
  | "APPROVED"
  | "SANCTIONED"
  | "UNSANCTIONED"
  | "RECOMMENDED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED"
  | "STALLED"
  | "CANCELLED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AnomalyDimension =
  | "FINANCIAL"
  | "CONTRACTOR"
  | "DUPLICATE"
  | "GEOGRAPHIC"
  | "TEMPORAL"
  | "EFFICIENCY"
  | "DATA_QUALITY";

export type AnomalySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type RiskCaseStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "ESCALATED"
  | "RESOLVED"
  | "DISMISSED"
  | "VERIFIED";

export type UserRole = "ADMIN" | "AUDITOR" | "ANALYST" | "VIEWER";

export interface DetectionSignal {
  ruleId: string;
  dimension: AnomalyDimension;
  severity: AnomalySeverity;
  score?: number;
  weight?: number;
  signal: string;
  explanation: string;
  supportingValue?: string | number;
}

export interface SimilarProject {
  projectId: string;
  title: string;
  similarityScore: number;
  reasons: string[];
}

export interface Project {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  category: string;
  state: string;
  district: string;
  constituency?: string;
  mpName?: string;
  house?: string;
  ida?: string;
  implementingAgency?: string;
  city?: string;
  ward?: string;
  block?: string;
  village?: string;
  financialYear: string;
  allocatedAmount: number;
  utilizedAmount?: number | null;
  progress?: number | null;
  status: ProjectStatus;
  rawStatus?: string;
  idaApproval?: string;
  contractorName?: string | null;
  contractorId?: string | null;
  recommendedDate?: string | null;
  approvalDate?: string | null;
  startDate?: string | null;
  expectedCompletionDate?: string | null;
  actualCompletionDate?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  riskScore: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  dimensionScores: {
    financial: number;
    contractor: number;
    duplicate: number;
    geographic: number;
    temporal: number;
    efficiency: number;
    dataQuality: number;
  };
  signals: DetectionSignal[];
  similarProjects: SimilarProject[];
  recommendation: string;
  dataQualityIssues?: string[];
  isGroundTruthAnomaly?: boolean;
  fieldProvenance?: Record<
    string,
    "SOURCE" | "DERIVED" | "ANALYTICAL" | "UNAVAILABLE"
  >;
  createdAt: string;
  [key: string]: any;
}

export interface Contractor {
  _id: string;
  contractorId: string;
  name: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  blacklisted?: boolean;
  blacklistReason?: string;
  totalProjects: number;
  completedProjects?: number;
  delayedProjects?: number;
  activeProjects?: number;
  totalAllocatedAmount?: number;
  totalAllocatedValue?: number;
  averageProjectValue?: number;
  totalUtilizedAmount?: number;
  totalUtilizedValue?: number;
  statesOperating: string[];
  districtsOperating: string[];
  avgDelayDays?: number;
  costOverrunPercentage?: number;
  riskScore?: number;
  riskLevel?: RiskLevel;
  winRate?: number;
  winRateByDistrict?: Record<string, number>;
  clusterPartners?: string[];
  isFlaggedConcentration?: boolean;
  createdAt?: string;
  [key: string]: any;
}

export interface AnomalyItem {
  _id: string;
  anomalyId: string;
  projectId: string;
  projectTitle: string;
  state: string;
  district: string;
  category: string;
  contractorName?: string;
  dimension: AnomalyDimension;
  ruleId: string;
  signal: string;
  severity: AnomalySeverity;
  score: number;
  explanation: string;
  supportingValue?: string | number;
  hasInvestigationCase: boolean;
  riskCaseId?: string;
  createdAt: string;
  [key: string]: any;
}

export interface RiskCase {
  _id: string;
  caseId: string;
  title?: string;
  projectId: string;
  projectTitle: string;
  state: string;
  district: string;
  category: string;
  contractorName: string;
  allocatedAmount?: number;
  riskScore?: number;
  riskLevel?: RiskLevel;
  overallScore?: number;
  status: RiskCaseStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "CRITICAL";
  assignedTo?: {
    userId: string;
    name: string;
    email: string;
  };
  assignedToName?: string;
  assignedToEmail?: string;
  initialFlagReasons?: string[];
  notes?: any;
  findings?: any;
  findingsSummary?: string;
  investigationOutcome?: string;
  actionTaken?: string;
  auditTrail?: {
    action: string;
    performedBy: string;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface District {
  _id: string;
  districtId?: string;
  district: string;
  name?: string;
  state: string;
  totalProjects: number;
  totalAllocatedAmount?: number;
  totalAllocated: number;
  totalUtilizedAmount?: number;
  totalUtilized: number;
  utilizationRate?: number;
  avgRiskScore?: number;
  averageRiskScore: number;
  averageProjectCost: number;
  riskLevel?: RiskLevel;
  contractorCount?: number;
  topSector?: string;
  coordinates?: [number, number];
  latitude: number;
  longitude: number;
  anomalousProjectCount?: number;
  highRiskProjectsCount: number;
  [key: string]: any;
}

export interface AlertItem {
  _id: string;
  alertId: string;
  type: string;
  title: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "NEW" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED";
  entityId?: string;
  projectId?: string;
  isRead?: boolean;
  priority?: string;
  entityType?: "PROJECT" | "CONTRACTOR" | "DISTRICT" | "RISK_CASE";
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  [key: string]: any;
}

export interface DashboardSummary {
  kpis: {
    totalProjects: number;
    totalAllocatedAmount: number;
    totalUtilizedAmount?: number;
    overallUtilizationRate?: number;
    avgRiskScore: number;
    criticalRiskCount: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    totalStates?: number;
    totalDistricts?: number;
    totalContractors?: number;
    totalAnomalies: number;
    totalRiskCases?: number;
    openRiskCases: number;
    totalMPs?: number;
    totalConstituencies?: number;
    totalIDAs?: number;
    constituencyBreakdown?: {
      namedLokSabha: number;
      rajyaSabhaGroupings: number;
      totalUnits: number;
    };
    [key: string]: any;
  };
  charts: {
    riskDistribution?: {
      riskLevel?: string;
      name?: string;
      count: number;
      percentage?: number;
      color?: string;
    }[];
    dimensionRadar?: { dimension: string; score: number; count: number }[];
    topRiskDistricts?: {
      district: string;
      state: string;
      avgRisk: number;
      projectCount: number;
    }[];
    sectorBreakdown?: {
      category: string;
      count: number;
      totalAllocated: number;
      totalUtilized?: number;
      avgRisk: number;
    }[];
    temporalTrends?: {
      financialYear: string;
      totalProjects: number;
      avgRisk: number;
    }[];
    statusBreakdown?: { status: string; count: number; totalAmount?: number }[];
    rawStatusBreakdown?: { rawStatus: string; count: number }[];
    houseBreakdown?: { house: string; count: number; totalAmount?: number }[];
    categoryBreakdown?: {
      category: string;
      count: number;
      totalAllocated: number;
      avgRisk: number;
    }[];
    stateDistribution?: {
      state: string;
      count: number;
      totalAllocated: number;
      avgRisk: number;
    }[];
    districtRisk?: any;
    spendingByYear?: any;
    [key: string]: any;
  };
  topHighRiskProjects: Project[];
  provenance?: {
    sourceName: string;
    sourceType: string;
    sourceUrl: string;
    officialPortalUrl: string;
    coveragePeriod: string;
    disclaimer: string;
  };
  [key: string]: any;
}

export interface User {
  _id?: string;
  id?: string;
  userId?: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation?: string;
  state?: string;
  district?: string;
  [key: string]: any;
}
