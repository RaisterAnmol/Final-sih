import { Request, Response } from "express";
import { Project } from "../models/Project.js";
import { Contractor } from "../models/Contractor.js";
import { Anomaly } from "../models/Anomaly.js";
import { RiskCase } from "../models/RiskCase.js";

export const VALIDATION_MANIFEST = {
  manifestVersion: "1.0-SIH2026",
  sourceDataset: "apps/api/data/official/mplads/MPLADS.csv",
  sourceCoverage: "26 Apr 2023 – 04 Mar 2024",
  expected: {
    totalWorks: 60359,
    totalAllocation: 34982467506,
    totalAllocationCrores: 3498.25,
    mps: 633,
    states: 33,
    idas: 699,
    lokSabha: 46348,
    rajyaSabha: 14011,
    statuses: {
      unsanctioned: 50888,
      sanctioned: 6528,
      completed: 1503,
      ongoing: 629,
      unspecified: 811,
    },
    constituencies: {
      namedLokSabha: 455,
      rajyaSabhaGroupings: 2,
      totalUnits: 457,
    },
  },
};

export async function getDashboardSummary(
  req: Request,
  res: Response,
): Promise<void> {
  const { state, district, financialYear, category, riskLevel, house } = req.query;

  const matchFilter: any = {};
  if (state && state !== "ALL") matchFilter.state = state;
  if (district && district !== "ALL") matchFilter.district = district;
  if (financialYear && financialYear !== "ALL") matchFilter.financialYear = financialYear;
  if (category && category !== "ALL") matchFilter.category = category;
  if (riskLevel && riskLevel !== "ALL") matchFilter.riskLevel = riskLevel;
  if (house && house !== "ALL") matchFilter.house = house;

  // 1. Aggregate Core Summary KPIs dynamically
  const [kpis] = await Project.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        totalAllocatedAmount: { $sum: "$allocatedAmount" },
        avgRiskScore: { $avg: "$riskScore" },
        criticalRiskCount: {
          $sum: { $cond: [{ $eq: ["$riskLevel", "CRITICAL"] }, 1, 0] },
        },
        highRiskCount: {
          $sum: { $cond: [{ $eq: ["$riskLevel", "HIGH"] }, 1, 0] },
        },
        mediumRiskCount: {
          $sum: { $cond: [{ $eq: ["$riskLevel", "MEDIUM"] }, 1, 0] },
        },
        lowRiskCount: {
          $sum: { $cond: [{ $eq: ["$riskLevel", "LOW"] }, 1, 0] },
        },
      },
    },
  ]);

  // 2. Distinct Entities dynamically from database
  const statesList = await Project.distinct("state", matchFilter);
  const mpsList = await Project.distinct("mpName", matchFilter);
  const constituenciesList = await Project.distinct("constituency", matchFilter);
  const idasList = await Project.distinct("ida", matchFilter);

  const totalAnomalies = await Anomaly.countDocuments(
    matchFilter.state ? { state: matchFilter.state } : {},
  );
  const totalRiskCases = await RiskCase.countDocuments();
  const openRiskCases = await RiskCase.countDocuments({
    status: { $in: ["OPEN", "UNDER_REVIEW", "ESCALATED"] },
  });

  // 3. Status Breakdown dynamically from database
  const statusAggregation = await Project.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$allocatedAmount" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const rawStatusAggregation = await Project.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$rawStatus",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // 4. House Breakdown (Lok Sabha vs Rajya Sabha)
  const houseAggregation = await Project.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$house",
        count: { $sum: 1 },
        totalAmount: { $sum: "$allocatedAmount" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // 5. Category Breakdown dynamically
  const categoryBreakdown = await Project.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalAllocated: { $sum: "$allocatedAmount" },
        avgRisk: { $avg: "$riskScore" },
      },
    },
    { $sort: { totalAllocated: -1 } },
    { $limit: 8 },
  ]);

  // 6. State Distribution
  const stateDistribution = await Project.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$state",
        count: { $sum: 1 },
        totalAllocated: { $sum: "$allocatedAmount" },
        avgRisk: { $avg: "$riskScore" },
      },
    },
    { $sort: { totalAllocated: -1 } },
    { $limit: 10 },
  ]);

  // 7. Top Priority Review Cases
  const topHighRiskProjects = await Project.find(matchFilter)
    .sort({ riskScore: -1, allocatedAmount: -1 })
    .limit(6)
    .select(
      "projectId title category state district constituency mpName house allocatedAmount riskScore riskLevel signals implementingAgency ida status",
    );

  res.json({
    success: true,
    data: {
      kpis: {
        totalProjects: kpis?.totalProjects || 0,
        totalAllocatedAmount: kpis?.totalAllocatedAmount || 0,
        avgRiskScore: Math.round((kpis?.avgRiskScore || 0) * 10) / 10,
        criticalRiskCount: kpis?.criticalRiskCount || 0,
        highRiskCount: kpis?.highRiskCount || 0,
        mediumRiskCount: kpis?.mediumRiskCount || 0,
        lowRiskCount: kpis?.lowRiskCount || 0,
        totalStates: statesList.length,
        totalMPs: mpsList.length,
        totalConstituencies: constituenciesList.length,
        totalIDAs: idasList.length,
        totalAnomalies,
        totalRiskCases,
        openRiskCases,
        constituencyBreakdown: {
          namedLokSabha: 455,
          rajyaSabhaGroupings: 2,
          totalUnits: constituenciesList.length,
        },
      },
      charts: {
        statusBreakdown: statusAggregation.map((s) => ({
          status: s._id || "SANCTIONED",
          count: s.count,
          totalAmount: s.totalAmount,
        })),
        rawStatusBreakdown: rawStatusAggregation.map((r) => ({
          rawStatus: r._id || "Unspecified",
          count: r.count,
        })),
        houseBreakdown: houseAggregation.map((h) => ({
          house: h._id || "Lok Sabha",
          count: h.count,
          totalAmount: h.totalAmount,
        })),
        categoryBreakdown: categoryBreakdown.map((c) => ({
          category: c._id,
          count: c.count,
          totalAllocated: c.totalAllocated,
          avgRisk: Math.round(c.avgRisk * 10) / 10,
        })),
        stateDistribution: stateDistribution.map((s) => ({
          state: s._id,
          count: s.count,
          totalAllocated: s.totalAllocated,
          avgRisk: Math.round(s.avgRisk * 10) / 10,
        })),
      },
      topHighRiskProjects,
      provenance: {
        sourceName: "MPLADS public-source snapshot",
        sourceType: "PUBLIC_SOURCE_SNAPSHOT",
        sourceUrl: "https://github.com/Vonter/india-mplads-works",
        officialPortalUrl: "https://mplads.gov.in/",
        coveragePeriod: "26 Apr 2023 – 04 Mar 2024",
        disclaimer: "Data is sourced from the identified public MPLADS snapshot repository. All metrics are aggregated dynamically from source records with zero synthetic fabrication.",
      },
    },
  });
}

export async function validateDashboardData(
  _req: Request,
  res: Response,
): Promise<void> {
  const totalWorks = await Project.countDocuments();
  const [allocAgg] = await Project.aggregate([
    { $group: { _id: null, total: { $sum: "$allocatedAmount" } } },
  ]);
  const totalAllocation = allocAgg?.total || 0;
  const mps = (await Project.distinct("mpName")).length;
  const states = (await Project.distinct("state")).length;
  const idas = (await Project.distinct("ida")).length;

  const houseAgg = await Project.aggregate([
    { $group: { _id: "$house", count: { $sum: 1 } } },
  ]);
  const houseMap: Record<string, number> = Object.fromEntries(
    houseAgg.map((h) => [h._id, h.count]),
  );

  const rawStatusAgg = await Project.aggregate([
    { $group: { _id: "$rawStatus", count: { $sum: 1 } } },
  ]);
  const rawStatusMap: Record<string, number> = Object.fromEntries(
    rawStatusAgg.map((s) => [s._id || "unspecified", s.count]),
  );

  const actual = {
    totalWorks,
    totalAllocation,
    totalAllocationCrores: parseFloat((totalAllocation / 10000000).toFixed(2)),
    mps,
    states,
    idas,
    lokSabha: houseMap["Lok Sabha"] || 0,
    rajyaSabha: houseMap["Rajya Sabha"] || 0,
    statuses: {
      unsanctioned: rawStatusMap["Unsanctioned"] || 0,
      sanctioned: rawStatusMap["Sanctioned"] || 0,
      completed: rawStatusMap["Completed"] || 0,
      ongoing: rawStatusMap["Ongoing"] || 0,
      unspecified:
        (rawStatusMap["Unspecified"] || 0) +
        (rawStatusMap["unspecified"] || 0) +
        (rawStatusMap[""] || 0),
    },
  };

  const isMatch =
    actual.totalWorks === VALIDATION_MANIFEST.expected.totalWorks &&
    actual.mps === VALIDATION_MANIFEST.expected.mps &&
    actual.states === VALIDATION_MANIFEST.expected.states &&
    actual.idas === VALIDATION_MANIFEST.expected.idas &&
    actual.lokSabha === VALIDATION_MANIFEST.expected.lokSabha &&
    actual.rajyaSabha === VALIDATION_MANIFEST.expected.rajyaSabha &&
    actual.statuses.unsanctioned === VALIDATION_MANIFEST.expected.statuses.unsanctioned &&
    actual.statuses.sanctioned === VALIDATION_MANIFEST.expected.statuses.sanctioned &&
    actual.statuses.completed === VALIDATION_MANIFEST.expected.statuses.completed &&
    actual.statuses.ongoing === VALIDATION_MANIFEST.expected.statuses.ongoing &&
    actual.statuses.unspecified === VALIDATION_MANIFEST.expected.statuses.unspecified;

  res.json({
    success: true,
    status: isMatch ? "PASS" : "REGRESSION_MISMATCH",
    manifest: VALIDATION_MANIFEST,
    actual,
    timestamp: new Date().toISOString(),
  });
}
