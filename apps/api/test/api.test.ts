import { describe, it, expect } from "vitest";
import { FallbackRuleEngine } from "../src/services/fallbackEngine.js";
import { normalizeMpladsRecord } from "../src/seed/normalizeMpladsRecord.js";
import { ChatService } from "../src/services/chatService.js";

describe("FallbackRuleEngine & Statistical Scoring", () => {
  it("should detect cost outliers when project cost deviates >= 2.5x peer median", () => {
    const mockProjects = [
      {
        projectId: "P1",
        title: "Community Hall Ward 1",
        category: "Community Assets",
        district: "Pune",
        allocatedAmount: 2000000,
        utilizedAmount: null,
        implementingAgency: "Pune District Collectorate",
      },
      {
        projectId: "P2",
        title: "Community Hall Ward 2",
        category: "Community Assets",
        district: "Pune",
        allocatedAmount: 2200000,
        utilizedAmount: null,
        implementingAgency: "Pune District Collectorate",
      },
      {
        projectId: "P3",
        title: "Community Hall Ward 3 Outlier",
        category: "Community Assets",
        district: "Pune",
        allocatedAmount: 8500000, // ~4x median
        utilizedAmount: null,
        implementingAgency: "Pune District Collectorate",
      },
    ];

    const results = FallbackRuleEngine.analyzeProjects(mockProjects);
    expect(results).toHaveLength(3);

    const outlier = results.find((r) => r.projectId === "P3");
    expect(outlier).toBeDefined();
    expect(outlier?.overallRiskScore).toBeGreaterThan(40);
    expect(
      outlier?.signals.some((s) => s.ruleId === "RULE_FIN_COST_DEVIATION"),
    ).toBe(true);
  });

  it("should detect authority workload concentration when agency share >= 45%", () => {
    const mockProjects = Array.from({ length: 10 }, (_, i) => ({
      projectId: `P-${i}`,
      title: `Road Construction Sector ${i}`,
      category: "Roads",
      district: "Nagpur",
      allocatedAmount: 1500000,
      implementingAgency:
        i < 5 ? "District Magistrate Nagpur" : `Local Council ${i}`,
    }));

    const results = FallbackRuleEngine.analyzeProjects(mockProjects);
    const flagged = results.filter((r) =>
      r.signals.some(
        (s) => s.ruleId === "RULE_AUTHORITY_WORKLOAD_CONCENTRATION",
      ),
    );
    expect(flagged.length).toBeGreaterThanOrEqual(5);
  });
});

describe("MPLADS Normalization & Zero-Fabrication Guarantee", () => {
  it("should normalize raw CSV row into canonical schema without synthetic data", () => {
    const rawRow = {
      "MP NAME": "Manoj Rajoria",
      WORK: "NA - Installing community drinking water plants",
      CATEGORY: "Normal/Others",
      STATE: "Rajasthan",
      CONSTITUENCY: "KARAULI-DHOLPUR(SC)",
      IDA: "DISTRICT COLLECTOR DHOLPUR_IDA",
      CITY: "",
      WARD: "",
      BLOCK: "Rajakhera",
      VILLAGE: "Nadauli",
      "RECOMMENDED DATE": "2024-03-04",
      "ALLOCATION AMOUNT": "100000",
      "IDA APPROVAL": "Action Pending",
      STATUS: "Unsanctioned",
      HOUSE: "Lok Sabha",
    };

    const normalized = normalizeMpladsRecord(rawRow, 0);
    expect(normalized).toBeDefined();
    expect(normalized?.mpName).toBe("Manoj Rajoria");
    expect(normalized?.allocatedAmount).toBe(100000);
    expect(normalized?.utilizedAmount).toBeNull(); // Strictly null — NO FABRICATION
    expect(normalized?.contractorName).toBeNull(); // Strictly null — NO FABRICATION
    expect(normalized?.progress).toBeNull(); // Strictly null — NO FABRICATION
    expect(normalized?.fieldProvenance.allocatedAmount).toBe("SOURCE");
    expect(normalized?.fieldProvenance.utilizedAmount).toBe("UNAVAILABLE");
    expect(normalized?.fieldProvenance.contractorName).toBe("UNAVAILABLE");
  });
});

describe("ChatService Grounded Guidance", () => {
  it("should return authoritative scheme guidelines for scheme inquiries", async () => {
    const res = await ChatService.processMessage("What is the MPLAD scheme?");
    expect(res.answer).toContain("₹5 Crore per annum");
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.suggestedPrompts.length).toBeGreaterThan(0);
  });

  it("should explain anomaly rules without accusing fraud", async () => {
    const res = await ChatService.processMessage("How is an anomaly flagged?");
    expect(res.answer).toContain("Cost Deviation");
    expect(res.answer).toContain("Rule-Based Statistical Engine");
    expect(res.sources[0].sourceType).toBe("ALGORITHMIC_BASELINE");
  });

  it("should explain status categories accurately", async () => {
    const res = await ChatService.processMessage("What are the status categories?");
    expect(res.answer).toContain("SANCTIONED");
    expect(res.answer).toContain("UNSANCTIONED");
    expect(res.answer).toContain("RECOMMENDED");
    expect(res.sources[0].sourceType).toBe("ADMINISTRATIVE_STANDARD");
  });

  it("should provide top states by allocation", async () => {
    const res = await ChatService.processMessage("Which states have the highest allocations?");
    expect(res.answer).toContain("Top States by Recommended MPLADS Allocation");
    expect(res.answer).toContain("Crore");
    expect(res.sources.length).toBeGreaterThan(0);
  });

  it("should return authoritative platform KPI summary with resilience", async () => {
    const res = await ChatService.processMessage("What is the total allocation across all works?");
    expect(res.answer).toContain("Total Recorded Works");
    expect(res.answer).toContain("Total Recommended Allocation");
    expect(res.sources[0].sourceType).toBe("PUBLIC_SOURCE_SNAPSHOT");
  });

  it("should explain dataset fields and zero-fabrication rule", async () => {
    const res = await ChatService.processMessage("What data fields are in the source?");
    expect(res.answer).toContain("15 verified public fields");
    expect(res.answer).toContain("Zero-Fabrication Rule");
    expect(res.answer).toContain("UNAVAILABLE");
  });

  it("should explain contractor handling and IDA concentration", async () => {
    const res = await ChatService.processMessage("Why are contractor names null in some records?");
    expect(res.answer).toContain("Implementing District Authorities (IDAs)");
    expect(res.answer).toContain("Zero Fabrication Rule");
  });
});
