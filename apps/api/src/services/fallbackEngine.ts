export interface AnalysisSignal {
  ruleId: string;
  dimension: string;
  signal: string;
  severity: string;
  explanation: string;
  supportingValue?: Record<string, any>;
  weight: number;
  limitation?: string;
}

export interface AnalysisOutput {
  projectId: string;
  overallRiskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceScore: number;
  signals: AnalysisSignal[];
  similarProjects: Array<{
    projectId: string;
    title: string;
    similarityScore: number;
    reasons: string[];
  }>;
  dimensionScores: {
    financial: number;
    contractor: number;
    duplicate: number;
    geographic: number;
    temporal: number;
    efficiency: number;
    dataQuality: number;
  };
  recommendation: string;
  modelMetadata: Record<string, any>;
}

export class FallbackRuleEngine {
  static analyzeProjects(projects: any[], customWeights?: Record<string, number>): AnalysisOutput[] {
    const weights: Record<string, number> = {
      financial: 0.35,
      contractor: 0.15,
      duplicate: 0.10,
      geographic: 0.10,
      temporal: 0.10,
      efficiency: 0.05,
      dataQuality: 0.15,
      ...(customWeights || {}),
    };

    // 1. Calculate District & Category medians and Agency concentrations
    const categoryMedianMap: Record<string, number[]> = {};
    const agencyDistrictCountMap: Record<string, number> = {};
    const districtTotalCountMap: Record<string, number> = {};

    projects.forEach((p) => {
      const key = `${p.district}_${p.category}`;
      if (!categoryMedianMap[key]) categoryMedianMap[key] = [];
      categoryMedianMap[key].push(p.allocatedAmount || 0);

      const agency = p.implementingAgency || p.ida || 'Unspecified Authority';
      const agencyKey = `${p.district}_${agency}`;
      agencyDistrictCountMap[agencyKey] = (agencyDistrictCountMap[agencyKey] || 0) + 1;
      districtTotalCountMap[p.district] = (districtTotalCountMap[p.district] || 0) + 1;
    });

    const medianValues: Record<string, number> = {};
    Object.keys(categoryMedianMap).forEach((k) => {
      const sorted = [...categoryMedianMap[k]].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      medianValues[k] = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    });

    return projects.map((p) => {
      const key = `${p.district}_${p.category}`;
      const median = medianValues[key] || p.allocatedAmount || 1000000;
      const peerRatio = median > 0 ? (p.allocatedAmount || 0) / median : 1.0;

      const agency = p.implementingAgency || p.ida || 'Unspecified Authority';
      const agencyKey = `${p.district}_${agency}`;
      const agencyDistCount = agencyDistrictCountMap[agencyKey] || 0;
      const distTotal = districtTotalCountMap[p.district] || 1;
      const agencyShare = distTotal > 0 ? agencyDistCount / distTotal : 0;

      const signals: AnalysisSignal[] = [];
      const dimScores = {
        financial: 0,
        contractor: 0,
        duplicate: 0,
        geographic: 0,
        temporal: 0,
        efficiency: 0,
        dataQuality: 0,
      };

      // 1. Financial Allocation Cost Deviation Signal
      if (peerRatio >= 2.5 && (p.allocatedAmount || 0) >= 500000) {
        const sev = peerRatio >= 4.0 ? 'CRITICAL' : peerRatio >= 3.0 ? 'HIGH' : 'MEDIUM';
        signals.push({
          ruleId: 'RULE_FIN_COST_DEVIATION',
          dimension: 'FINANCIAL',
          signal: `Cost deviation signal: ${peerRatio.toFixed(1)}x category peer median`,
          severity: sev,
          explanation: `Recommended allocation (₹${(p.allocatedAmount || 0).toLocaleString('en-IN')}) exceeds peer median (₹${Math.round(median).toLocaleString('en-IN')}) for '${p.category}' in ${p.district}.`,
          supportingValue: {
            allocated: p.allocatedAmount,
            peerMedian: median,
            ratio: Number(peerRatio.toFixed(2)),
          },
          weight: 1.0,
          limitation: 'Statistical peer deviation based on snapshot records; may reflect legitimate scope or geographical cost differentials.',
        });
        dimScores.financial = Math.min(100, Math.round(peerRatio * 22));
      }

      // 2. District Authority Workload Concentration Signal
      if (agency && agency !== 'Unspecified Authority' && agencyShare >= 0.45 && distTotal >= 10) {
        const sharePct = agencyShare * 100;
        signals.push({
          ruleId: 'RULE_AUTHORITY_WORKLOAD_CONCENTRATION',
          dimension: 'CONTRACTOR',
          signal: `District Authority workload signal: ${sharePct.toFixed(0)}% of district works assigned`,
          severity: sharePct >= 65 ? 'HIGH' : 'MEDIUM',
          explanation: `District Authority '${agency}' is designated for ${agencyDistCount} of ${distTotal} recorded works in ${p.district}. Analytical observation for administrative review.`,
          supportingValue: { agency, sharePercent: Number(sharePct.toFixed(1)), count: agencyDistCount },
          weight: 0.8,
          limitation: 'Reflects designated district authority workload in source snapshot; does not assess execution speed or quality.',
        });
        dimScores.contractor = Math.min(100, Math.round(sharePct * 1.2));
      }

      // 3. Metadata Completeness Signal
      const issues = p.dataQualityIssues || [];
      if (issues.length > 0) {
        dimScores.dataQuality = Math.min(100, issues.length * 25);
        if (issues.length >= 2) {
          signals.push({
            ruleId: 'RULE_METADATA_COMPLETENESS',
            dimension: 'DATA_QUALITY',
            signal: `Metadata completeness signal: ${issues.length} source attributes unpopulated`,
            severity: issues.length >= 3 ? 'HIGH' : 'LOW',
            explanation: `Source record has metadata gaps: ${issues.join('; ')}.`,
            supportingValue: { issueCount: issues.length, issues },
            weight: 0.6,
            limitation: 'Gaps reflect unpopulated fields in public CSV snapshot and do not indicate official non-compliance.',
          });
        }
      }

      // Unified Risk / Review Priority Calculation
      const weightedSum =
        dimScores.financial * weights.financial +
        dimScores.contractor * weights.contractor +
        dimScores.duplicate * weights.duplicate +
        dimScores.geographic * weights.geographic +
        dimScores.temporal * weights.temporal +
        dimScores.efficiency * weights.efficiency +
        dimScores.dataQuality * weights.dataQuality;

      const peakDim = Math.max(...Object.values(dimScores));
      const baseRisk = 0.5 * peakDim + 0.5 * weightedSum;
      let signalBonus = Math.min(15, signals.length * 5);
      if (signals.some((s) => s.severity === 'CRITICAL')) signalBonus += 15;
      else if (signals.some((s) => s.severity === 'HIGH')) signalBonus += 8;

      const overallRiskScore = Math.min(100, Math.max(0, Math.round(baseRisk + signalBonus)));

      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (overallRiskScore >= 75) riskLevel = 'CRITICAL';
      else if (overallRiskScore >= 50) riskLevel = 'HIGH';
      else if (overallRiskScore >= 25) riskLevel = 'MEDIUM';

      let recommendation = 'Standard administrative monitoring during regular review cycles.';
      if (riskLevel === 'CRITICAL') {
        recommendation = 'PRIORITY REVIEW: Verify supporting administrative sanctions, cost estimates, and implementing agency capacity.';
      } else if (riskLevel === 'HIGH') {
        recommendation = 'ROUTINE SCRUTINY: Review allocation documentation and verify location details against municipal records.';
      } else if (riskLevel === 'MEDIUM') {
        recommendation = 'PERIODIC AUDIT: Sample during routine district planning and social audit review.';
      }

      return {
        projectId: p.projectId,
        overallRiskScore,
        riskLevel,
        confidenceScore: signals.length > 0 ? 85.0 : 70.0,
        signals,
        similarProjects: [],
        dimensionScores: dimScores,
        recommendation,
        modelMetadata: {
          engine: 'Rule-Based Statistical Baseline Engine',
          signalsCount: signals.length,
          disclaimer: 'AI-assisted observations are analytical signals intended to support review and prioritization. They do not constitute findings of fraud, misconduct, or wrongdoing.',
        },
      };
    });
  }
}
