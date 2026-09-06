import mongoose, { Schema, Document } from "mongoose";

export type ProjectStatus =
  | "SANCTIONED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type SourceType =
  | "OFFICIAL"
  | "PUBLIC_SOURCE_SNAPSHOT"
  | "DERIVED"
  | "AI_ASSISTED"
  | "SYNTHETIC_DEMO";

export interface IDetectionSignal {
  ruleId: string;
  dimension: string;
  signal: string;
  severity: string;
  explanation: string;
  supportingValue?: Record<string, any>;
  weight: number;
}

export interface ISimilarProject {
  projectId: string;
  title: string;
  similarityScore: number;
  reasons: string[];
}

export interface IProject extends Document {
  projectId: string; // Deterministic SHA-256 derived ID
  title: string;
  description: string;
  category: string;
  state: string;
  district: string;
  constituency: string;
  mpName: string;
  house?: string; // Lok Sabha | Rajya Sabha
  ida?: string; // Implementing District Authority raw string
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
  rawStatus?: string; // Raw status from source CSV (Unsanctioned, Sanctioned, Ongoing, Completed, etc.)
  idaApproval?: string;
  contractorId?: string | null;
  contractorName?: string | null;
  recommendedDate?: Date | null;
  approvalDate?: Date | null;
  startDate?: Date | null;
  expectedCompletionDate?: Date | null;
  actualCompletionDate?: Date | null;
  latitude?: number | null;
  longitude?: number | null;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0 - 100
  dimensionScores: {
    financial: number;
    contractor: number;
    duplicate: number;
    geographic: number;
    temporal: number;
    efficiency: number;
    dataQuality: number;
  };
  signals: IDetectionSignal[];
  similarProjects: ISimilarProject[];
  recommendation: string;
  dataQualityIssues: string[];
  isGroundTruthAnomaly?: boolean;
  groundTruthType?: string;
  lastAnalyzedAt?: Date;
  sourceType: SourceType;
  sourceName: string;
  sourceRecordId: string;
  sourceUrl: string;
  retrievedAt?: Date;
  rawSourceRecord?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: "text" },
    description: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    constituency: { type: String, default: "", index: true },
    mpName: { type: String, default: "Hon. Member of Parliament", index: true },
    house: { type: String, default: "Lok Sabha", index: true },
    ida: { type: String, index: true },
    implementingAgency: { type: String, index: true },
    city: { type: String },
    ward: { type: String },
    block: { type: String },
    village: { type: String },
    financialYear: { type: String, default: "2023-2024", index: true },
    allocatedAmount: { type: Number, required: true, index: true },
    utilizedAmount: { type: Number, default: null },
    progress: { type: Number, default: null, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["SANCTIONED", "IN_PROGRESS", "COMPLETED", "DELAYED", "CANCELLED"],
      default: "SANCTIONED",
      index: true,
    },
    rawStatus: { type: String, index: true },
    idaApproval: { type: String },
    contractorId: { type: String, default: null, index: true },
    contractorName: { type: String, default: null, index: true },
    recommendedDate: { type: Date, index: true },
    approvalDate: { type: Date, index: true },
    startDate: { type: Date, default: null },
    expectedCompletionDate: { type: Date, default: null },
    actualCompletionDate: { type: Date, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    riskScore: { type: Number, default: 0, min: 0, max: 100, index: true },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
      index: true,
    },
    confidenceScore: { type: Number, default: 75.0 },
    dimensionScores: {
      financial: { type: Number, default: 0 },
      contractor: { type: Number, default: 0 },
      duplicate: { type: Number, default: 0 },
      geographic: { type: Number, default: 0 },
      temporal: { type: Number, default: 0 },
      efficiency: { type: Number, default: 0 },
      dataQuality: { type: Number, default: 0 },
    },
    signals: [
      {
        ruleId: { type: String },
        dimension: { type: String },
        signal: { type: String },
        severity: { type: String },
        explanation: { type: String },
        supportingValue: { type: Schema.Types.Mixed },
        weight: { type: Number, default: 1.0 },
      },
    ],
    similarProjects: [
      {
        projectId: { type: String },
        title: { type: String },
        similarityScore: { type: Number },
        reasons: [{ type: String }],
      },
    ],
    recommendation: {
      type: String,
      default: "Standard periodic verification and social audit review.",
    },
    dataQualityIssues: [{ type: String }],
    isGroundTruthAnomaly: { type: Boolean, default: false },
    groundTruthType: { type: String },
    lastAnalyzedAt: { type: Date },
    sourceType: {
      type: String,
      enum: [
        "OFFICIAL",
        "PUBLIC_SOURCE_SNAPSHOT",
        "DERIVED",
        "AI_ASSISTED",
        "SYNTHETIC_DEMO",
      ],
      default: "PUBLIC_SOURCE_SNAPSHOT",
      index: true,
    },
    sourceName: { type: String, default: "MPLADS public-source snapshot" },
    sourceRecordId: { type: String, index: true },
    sourceUrl: {
      type: String,
      default: "https://github.com/Vonter/india-mplads-works",
    },
    retrievedAt: {
      type: Date,
      default: () => new Date("2024-03-04T00:00:00Z"),
    },
    rawSourceRecord: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Compound indexes for rapid analytics & filtering
ProjectSchema.index({ state: 1, district: 1, status: 1 });
ProjectSchema.index({ riskScore: -1, allocatedAmount: -1 });
ProjectSchema.index({ mpName: 1, state: 1 });
ProjectSchema.index({ category: 1, state: 1 });

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
