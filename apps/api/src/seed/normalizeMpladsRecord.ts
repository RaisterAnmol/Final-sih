import { ProjectStatus, RiskLevel, SourceType } from "../models/Project.js";
import crypto from "crypto";

export interface RawMpladsRow {
  "MP NAME"?: string;
  WORK?: string;
  CATEGORY?: string;
  STATE?: string;
  CONSTITUENCY?: string;
  IDA?: string;
  CITY?: string;
  WARD?: string;
  BLOCK?: string;
  VILLAGE?: string;
  "RECOMMENDED DATE"?: string;
  "ALLOCATION AMOUNT"?: string;
  "IDA APPROVAL"?: string;
  STATUS?: string;
  HOUSE?: string;
  [key: string]: any;
}

export interface NormalizedProject {
  projectId: string;
  title: string;
  description: string;
  category: string;
  state: string;
  district: string;
  constituency: string;
  mpName: string;
  house: string;
  ida: string;
  implementingAgency: string;
  city?: string;
  ward?: string;
  block?: string;
  village?: string;
  financialYear: string;
  allocatedAmount: number;
  utilizedAmount: number | null;
  progress: number | null;
  status: ProjectStatus;
  rawStatus: string;
  idaApproval: string;
  contractorName: string | null;
  contractorId: string | null;
  recommendedDate?: Date | null;
  approvalDate?: Date | null;
  startDate: Date | null;
  expectedCompletionDate: Date | null;
  actualCompletionDate: Date | null;
  latitude: number | null;
  longitude: number | null;
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
  signals: any[];
  similarProjects: any[];
  recommendation: string;
  dataQualityIssues: string[];
  isGroundTruthAnomaly: boolean;
  lastAnalyzedAt: Date;
  sourceType: SourceType;
  sourceName: string;
  sourceRecordId: string;
  sourceUrl: string;
  retrievedAt: Date;
  rawSourceRecord: RawMpladsRow;
  fieldProvenance: Record<
    string,
    "SOURCE" | "DERIVED" | "ANALYTICAL" | "UNAVAILABLE"
  >;
}

const STATE_CODE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TS",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",
  Delhi: "DL",
  "Jammu and Kashmir": "JK",
  Ladakh: "LA",
  Puducherry: "PY",
  Chandigarh: "CH",
  "Andaman and Nicobar Islands": "AN",
  "Dadra and Nagar Haveli and Daman and Diu": "DN",
  Lakshadweep: "LD",
};

function normalizeCategory(rawCategory: string, work: string): string {
  const w = (work || "").toLowerCase();
  const c = (rawCategory || "").toLowerCase();

  if (
    w.includes("road") ||
    w.includes("pathway") ||
    w.includes("link road") ||
    w.includes("bridge") ||
    w.includes("culvert") ||
    w.includes("tar road") ||
    w.includes("cc road")
  )
    return "Roads, Pathways & Bridges";
  if (
    w.includes("drinking water") ||
    w.includes("water plant") ||
    w.includes("water supply") ||
    w.includes("borewell") ||
    w.includes("tank") ||
    w.includes("hand pump") ||
    w.includes("pipeline")
  )
    return "Drinking Water & Sanitation";
  if (
    w.includes("street light") ||
    w.includes("lighting of public") ||
    w.includes("solar light") ||
    w.includes("high mast") ||
    w.includes("led light")
  )
    return "Public Lighting & Energy";
  if (
    w.includes("school") ||
    w.includes("college") ||
    w.includes("education") ||
    w.includes("classroom") ||
    w.includes("library") ||
    w.includes("hostel")
  )
    return "Education Infrastructure";
  if (
    w.includes("hospital") ||
    w.includes("health") ||
    w.includes("medical") ||
    w.includes("clinic") ||
    w.includes("ambulance") ||
    w.includes("primary health")
  )
    return "Public Health & Wellness";
  if (
    w.includes("community center") ||
    w.includes("community hall") ||
    w.includes("community building") ||
    w.includes("kalyan mantap") ||
    w.includes("samudayak bhavan")
  )
    return "Community Asset & Halls";
  if (
    w.includes("drainage") ||
    w.includes("sewerage") ||
    w.includes("sanitation") ||
    w.includes("toilet") ||
    w.includes("shauchalay")
  )
    return "Drinking Water & Sanitation";
  if (
    w.includes("sports") ||
    w.includes("playground") ||
    w.includes("stadium") ||
    w.includes("gym") ||
    w.includes("open gym")
  )
    return "Sports & Youth Development";
  if (
    w.includes("bus") ||
    w.includes("transport") ||
    w.includes("passenger shelter") ||
    w.includes("bus stand")
  )
    return "Transport Infrastructure";
  if (
    w.includes("solar") ||
    w.includes("non-conventional energy") ||
    w.includes("renewable") ||
    w.includes("solar power")
  )
    return "Rural Electrification";
  if (
    w.includes("cremator") ||
    w.includes("burial") ||
    w.includes("boundary wall") ||
    w.includes("kabristan") ||
    w.includes("shamshan")
  )
    return "Public Utilities";
  if (
    w.includes("cultural") ||
    w.includes("auditorium") ||
    w.includes("multipurpose") ||
    w.includes("rang mandir")
  )
    return "Cultural & Heritage Assets";
  if (c.includes("repair") || c.includes("renovation"))
    return "Repair and Renovation";
  if (c.includes("trust") || c.includes("society")) return "Trust and Society";
  if (c.includes("bar") || c.includes("association"))
    return "Bar and Associations";
  if (c.includes("special component")) return "Special Component Works";
  return "Normal/Others";
}

function mapStatus(rawStatus: string, idaApproval: string): ProjectStatus {
  const s = (rawStatus || "").toLowerCase().trim();
  const a = (idaApproval || "").toLowerCase().trim();

  if (s === "completed") return "COMPLETED";
  if (s === "cancelled" || s === "dropped" || s === "rejected")
    return "CANCELLED";
  if (s === "ongoing" || s === "in progress" || s === "work in progress")
    return "IN_PROGRESS";
  if (s === "delayed" || s === "time overrun") return "DELAYED";
  if (s === "sanctioned") return "SANCTIONED";
  if (a === "approved") return "SANCTIONED";
  return "SANCTIONED";
}

function extractDistrict(
  ida: string,
  constituency: string,
  block: string,
): string {
  if (ida) {
    const beforeIda = ida.replace(/_IDA$/i, "").trim();
    const cleaned = beforeIda
      .replace(/^DISTRICT\s+(COLLECTOR|MAGISTRATE)\s+/i, "")
      .replace(/^DEPUTY\s+COMMISSIONER\s+/i, "")
      .replace(/^COMMISSIONER\s+/i, "")
      .replace(/^ADM\s+/i, "")
      .replace(/^DC\s+/i, "")
      .replace(/^DM\s+/i, "")
      .trim();
    if (cleaned.length > 1) {
      return toTitleCase(cleaned);
    }
  }
  if (block && block.trim().length > 1) return toTitleCase(block.trim());
  if (constituency && constituency.trim().length > 1) {
    const c = constituency
      .trim()
      .replace(/\([^)]+\)/, "")
      .trim();
    return toTitleCase(c);
  }
  return "Unspecified District";
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveFinancialYear(dateStr: string): string {
  if (!dateStr) return "2023-2024";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "2023-2024";
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  if (month >= 4) return `${year}-${year + 1}`;
  return `${year - 1}-${year}`;
}

export function normalizeMpladsRecord(
  raw: RawMpladsRow,
  rowIndex: number,
  sourceUrl: string = "https://github.com/Vonter/india-mplads-works",
): NormalizedProject | null {
  const mpName = (raw["MP NAME"] || raw.mpName || "").trim();
  const work = (raw["WORK"] || raw.work || raw.title || "").trim();
  const state = (raw["STATE"] || raw.state || "").trim();
  const rawAmount = String(
    raw["ALLOCATION AMOUNT"] ||
      raw.allocationAmount ||
      raw.allocatedAmount ||
      "0",
  );
  const allocatedAmount = parseFloat(rawAmount.replace(/[^0-9.]/g, "")) || 0;

  // Accept all 60,359 rows including zero allocations for completed works
  if (!mpName || !work || !state || allocatedAmount < 0) {
    return null;
  }

  const constituency = (raw["CONSTITUENCY"] || raw.constituency || "").trim();
  const ida = (raw["IDA"] || raw.ida || "").trim();
  const city = (raw["CITY"] || raw.city || "").trim();
  const ward = (raw["WARD"] || raw.ward || "").trim();
  const block = (raw["BLOCK"] || raw.block || "").trim();
  const village = (raw["VILLAGE"] || raw.village || "").trim();
  const recommendedDateStr = (
    raw["RECOMMENDED DATE"] ||
    raw.recommendedDate ||
    ""
  ).trim();
  const idaApproval = (raw["IDA APPROVAL"] || raw.idaApproval || "").trim();
  const rawStatus =
    raw["STATUS"] && raw["STATUS"].trim().length > 0
      ? raw["STATUS"].trim()
      : "Unspecified";
  const house = (raw["HOUSE"] || raw.house || "Lok Sabha").trim();

  const district = extractDistrict(ida, constituency, block);
  const category = normalizeCategory(
    raw["CATEGORY"] || raw.category || "",
    work,
  );
  const financialYear = deriveFinancialYear(recommendedDateStr);
  const status = mapStatus(rawStatus, idaApproval);

  let recommendedDate: Date | null = null;
  if (recommendedDateStr) {
    const d = new Date(recommendedDateStr);
    if (!isNaN(d.getTime())) {
      recommendedDate = d;
    }
  }

  // District Authority is derived from IDA, NEVER labeled as a private contractor!
  const implementingAgency = ida || `${district} District Authority`;

  // Deterministic provenance hashing based on core source facts
  const provenanceKey = `${rowIndex}|${mpName}|${work}|${recommendedDateStr}|${state}|${constituency}|${allocatedAmount}`;
  const sha256Hash = crypto
    .createHash("sha256")
    .update(provenanceKey)
    .digest("hex");
  const stateCode =
    STATE_CODE_MAP[state] || state.substring(0, 2).toUpperCase();
  const distCode =
    district
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase() || "UNK";
  const yearCode = financialYear.substring(0, 4);
  const rowCode = String(rowIndex + 1).padStart(5, "0");

  const projectId = `MPLAD-${yearCode}-${stateCode}-${distCode}-${rowCode}`;
  const sourceRecordId = `SRC-SNAP-${rowCode}`;

  // Data Quality Signals based strictly on verified completeness
  const dataQualityIssues: string[] = [];
  if (!city && !block && !village)
    dataQualityIssues.push(
      "No specific sub-district location (city/block/village) reported in source snapshot",
    );
  if (!recommendedDate)
    dataQualityIssues.push("Recommendation date missing in source record");
  if (!ida)
    dataQualityIssues.push("District Authority (IDA) field unspecified");
  if (allocatedAmount < 1000)
    dataQualityIssues.push("Allocation amount unusually low (< ₹1,000)");

  const title = work
    .replace(/^NA - /i, "")
    .replace(/^NA-/i, "")
    .trim();

  const fieldProvenance: Record<
    string,
    "SOURCE" | "DERIVED" | "ANALYTICAL" | "UNAVAILABLE"
  > = {
    mpName: "SOURCE",
    workDescription: "SOURCE",
    house: "SOURCE",
    state: "SOURCE",
    constituency: "SOURCE",
    ida: "SOURCE",
    allocatedAmount: "SOURCE",
    rawStatus: "SOURCE",
    recommendedDate: recommendedDateStr ? "SOURCE" : "UNAVAILABLE",
    city: city ? "SOURCE" : "UNAVAILABLE",
    ward: ward ? "SOURCE" : "UNAVAILABLE",
    block: block ? "SOURCE" : "UNAVAILABLE",
    village: village ? "SOURCE" : "UNAVAILABLE",
    category: "DERIVED",
    district: "DERIVED",
    financialYear: "DERIVED",
    status: "DERIVED",
    implementingAgency: "DERIVED",
    utilizedAmount: "UNAVAILABLE",
    progress: "UNAVAILABLE",
    contractorName: "UNAVAILABLE",
    startDate: "UNAVAILABLE",
    expectedCompletionDate: "UNAVAILABLE",
    actualCompletionDate: "UNAVAILABLE",
    coordinates: "UNAVAILABLE",
    riskScore: "ANALYTICAL",
    signals: "ANALYTICAL",
  };

  return {
    projectId,
    title: title.length > 220 ? title.substring(0, 220) : title,
    description: `MPLADS work recommended by ${mpName} (${house}) for constituency ${toTitleCase(constituency)}. District Authority: ${implementingAgency}. Public-source snapshot record.`,
    category,
    state,
    district,
    constituency: toTitleCase(constituency),
    mpName,
    house,
    ida,
    implementingAgency,
    city: city || undefined,
    ward: ward || undefined,
    block: block || undefined,
    village: village || undefined,
    financialYear,
    allocatedAmount,
    utilizedAmount: null, // ZERO FABRICATION: null because source CSV contains only Allocation Amount
    progress: null, // ZERO FABRICATION: null because source CSV does not track milestone %
    status,
    rawStatus,
    idaApproval,
    contractorName: null, // ZERO FABRICATION: null because source has IDA, not private contractors
    contractorId: null,
    recommendedDate,
    approvalDate:
      idaApproval.toLowerCase() === "approved" ? recommendedDate : null,
    startDate: null, // ZERO FABRICATION: null
    expectedCompletionDate: null, // ZERO FABRICATION: null
    actualCompletionDate: null, // ZERO FABRICATION: null
    latitude: null, // ZERO FABRICATION: null
    longitude: null, // ZERO FABRICATION: null
    riskScore: 0,
    riskLevel: "LOW",
    confidenceScore: 80,
    dimensionScores: {
      financial: 0,
      contractor: 0,
      duplicate: 0,
      geographic: 0,
      temporal: 0,
      efficiency: 0,
      dataQuality: 0,
    },
    signals: [],
    similarProjects: [],
    recommendation: "Standard administrative review.",
    dataQualityIssues,
    isGroundTruthAnomaly: false,
    lastAnalyzedAt: new Date(),
    sourceType: "PUBLIC_SOURCE_SNAPSHOT",
    sourceName: "MPLADS public-source snapshot",
    sourceRecordId,
    sourceUrl,
    retrievedAt: new Date("2024-03-04T00:00:00Z"),
    rawSourceRecord: raw,
    fieldProvenance,
  };
}
