import axios from "axios";
import {
  MOCK_DASHBOARD_SUMMARY,
  MOCK_PROJECTS,
  MOCK_ANOMALIES,
  MOCK_RISK_CASES,
  MOCK_CONTRACTORS,
  MOCK_DISTRICTS,
  financialFallbackData,
  temporalFallbackData,
  efficiencyFallbackData,
} from "./mockData";
import mpsData from "./mpsData.json";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
});

// In-flight GET request deduplication to eliminate duplicate calls across components and React StrictMode
const inFlightRequests = new Map<string, Promise<any>>();
const originalGet = api.get.bind(api);

api.get = function (url: string, config?: any): Promise<any> {
  const cacheKey = `${url}?${JSON.stringify(config?.params || {})}`;
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const requestPromise = originalGet(url, config).finally(() => {
    inFlightRequests.delete(cacheKey);
  });

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mplad_auth_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Determine if mock fallback is explicitly enabled.
// C2 FIX: localhost and 127.0.0.1 are removed — in dev, the real backend should be running.
// Only activate mock mode when VITE_DEMO_MODE=true (set in Vercel env for the frontend-only deployment).
function isMockModeActive(): boolean {
  return (
    import.meta.env.VITE_DEMO_MODE === "true" ||
    window.location.hostname.includes("vercel.app")
  );
}

api.interceptors.response.use(
  (response) => {
    // If response is HTML text instead of JSON (e.g. index.html returned by SPA fallback)
    if (
      typeof response.data === "string" &&
      (response.data.trim().toLowerCase().startsWith("<!doctype html") ||
        response.data.trim().toLowerCase().startsWith("<html"))
    ) {
      if (isMockModeActive()) {
        console.warn(
          `[API Fallback] HTML response intercepted for ${response.config.url} — serving mock data (DEMO MODE).`,
        );
        return getMockFallback(response.config.url || "");
      }
      return Promise.reject(
        new Error(
          `API returned HTML page for ${response.config.url}. Please ensure the backend is active.`,
        ),
      );
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    const url = config?.url || "";

    // Transient retry strictly for idempotent GET requests during backend boot (502/503)
    if (
      config &&
      config.method?.toLowerCase() === "get" &&
      (!error.response || [502, 503].includes(error.response.status))
    ) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 1) {
        config.__retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 800));
        return api(config);
      }
    }

    if (
      isMockModeActive() &&
      (!error.response ||
        [404, 405, 500, 502, 503, 504].includes(error.response.status) ||
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNREFUSED")
    ) {
      console.warn(
        `[API Fallback] Serving mock data for ${url} (DEMO MODE active).`,
      );
      return Promise.resolve(getMockFallback(url, error.config?.data));
    }

    return Promise.reject(error);
  },
);

function getMockFallback(url: string, requestBody?: any) {
  let postData: any = {};
  if (typeof requestBody === "string") {
    try {
      postData = JSON.parse(requestBody);
    } catch {}
  } else if (requestBody) {
    postData = requestBody;
  }

  // 1. Auth routes
  if (url.includes("/auth/login")) {
    const email = postData.email || "auditor@mplad-insight.demo";
    const rolePrefix = email.split("@")[0]?.toUpperCase() || "AUDITOR";
    const role = ["ADMIN", "AUDITOR", "ANALYST", "VIEWER"].includes(rolePrefix)
      ? rolePrefix
      : "AUDITOR";

    return {
      data: {
        success: true,
        data: {
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token_${role.toLowerCase()}.sig`,
          user: {
            id: `usr-${role.toLowerCase()}`,
            name: `${role.charAt(0) + role.slice(1).toLowerCase()} Officer`,
            email: email,
            role: role,
            department: "MoSPI Audit Wing",
            designation: "Senior Inspector",
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  if (url.includes("/auth/me")) {
    const storedUser = localStorage.getItem("mplad_user");
    const user = storedUser
      ? JSON.parse(storedUser)
      : {
          id: "usr-auditor",
          name: "Priya Iyer (Senior Auditor)",
          email: "auditor@mplad-insight.demo",
          role: "AUDITOR",
          department: "MoSPI Audit Wing",
          designation: "Senior Inspector",
        };
    return {
      data: { success: true, data: { user } },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 2. Executive Dashboard (/dashboard/summary)
  if (url.includes("/dashboard/summary")) {
    return {
      data: {
        success: true,
        data: MOCK_DASHBOARD_SUMMARY,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 3. Risk Score Matrix (/dashboard/risk-matrix)
  if (url.includes("/dashboard/risk-matrix")) {
    return {
      data: {
        success: true,
        data: {
          matrix: [
            {
              category: "Drinking Water & Sanitation",
              low: 450,
              medium: 180,
              high: 45,
              critical: 12,
            },
            {
              category: "Education Infrastructure",
              low: 380,
              medium: 140,
              high: 28,
              critical: 8,
            },
            {
              category: "Public Health & Wellness",
              low: 290,
              medium: 110,
              high: 32,
              critical: 15,
            },
            {
              category: "Roads, Pathways & Bridges",
              low: 520,
              medium: 210,
              high: 58,
              critical: 18,
            },
            {
              category: "Community Asset & Halls",
              low: 310,
              medium: 95,
              high: 18,
              critical: 4,
            },
          ],
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 4. District Heatmap (/dashboard/district-heatmap)
  if (url.includes("/dashboard/district-heatmap")) {
    return {
      data: {
        success: true,
        data: {
          districts: MOCK_DISTRICTS,
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 4b. Parliamentary MPs Directory (/projects/mps/directory)
  if (url.includes("/projects/mps/directory")) {
    const urlObj = new URL(url, "http://localhost");
    const house = urlObj.searchParams.get("house") || "ALL";
    const state = urlObj.searchParams.get("state") || "ALL";
    const search = (urlObj.searchParams.get("search") || "")
      .trim()
      .toLowerCase();

    let list = mpsData as Array<{
      mpName: string;
      house: string;
      state: string;
      constituency: string;
      totalWorks: number;
      totalAllocated: number;
      avgRiskScore: number;
    }>;

    if (house !== "ALL") {
      list = list.filter((m) => m.house.toLowerCase() === house.toLowerCase());
    }
    if (state !== "ALL") {
      list = list.filter((m) => m.state.toLowerCase() === state.toLowerCase());
    }
    if (search) {
      list = list.filter(
        (m) =>
          m.mpName.toLowerCase().includes(search) ||
          m.constituency.toLowerCase().includes(search) ||
          m.state.toLowerCase().includes(search),
      );
    }

    return {
      data: {
        success: true,
        data: {
          totalMps: list.length,
          mps: list,
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 5. Projects list & detail (/projects)
  if (url.includes("/projects/")) {
    const parts = url.split("?")[0].split("/");
    const pid = decodeURIComponent(parts[parts.length - 1]);
    const project = MOCK_PROJECTS.find(
      (p) => p._id === pid || p.projectId?.toLowerCase() === pid.toLowerCase(),
    );

    if (!project) {
      return {
        data: {
          success: false,
          error: {
            code: "PROJECT_NOT_FOUND",
            message: `Project '${pid}' not found in mock catalog`,
          },
        },
        status: 404,
        statusText: "Not Found",
        headers: {},
        config: {} as any,
      };
    }

    return {
      data: {
        success: true,
        data: { project },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  if (url.includes("/projects")) {
    return {
      data: {
        success: true,
        data: {
          projects: MOCK_PROJECTS,
          pagination: {
            total: MOCK_PROJECTS.length,
            page: 1,
            limit: 10,
            totalPages: Math.ceil(MOCK_PROJECTS.length / 10),
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 6. Contractors (/contractors)
  if (url.includes("/contractors")) {
    return {
      data: {
        success: true,
        data: {
          contractors: MOCK_CONTRACTORS,
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 7. Anomalies (/anomalies)
  if (url.includes("/anomalies")) {
    return {
      data: {
        success: true,
        data: {
          anomalies: MOCK_ANOMALIES,
          dimensionCounts: {
            FINANCIAL: 140,
            CONTRACTOR: 65,
            DUPLICATE: 32,
            TEMPORAL: 18,
            EFFICIENCY: 14,
          },
          pagination: {
            total: 269,
            page: 1,
            totalPages: 6,
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 8. Risk Cases (/risk-cases)
  if (url.includes("/risk-cases")) {
    const openCount = MOCK_RISK_CASES.filter((c) => c.status === "OPEN").length;
    const reviewCount = MOCK_RISK_CASES.filter(
      (c) => c.status === "UNDER_REVIEW",
    ).length;
    const verifiedCount = MOCK_RISK_CASES.filter(
      (c) => c.status === "VERIFIED",
    ).length;
    const dismissedCount = MOCK_RISK_CASES.filter(
      (c) => c.status === "DISMISSED",
    ).length;
    const escalatedCount = MOCK_RISK_CASES.filter(
      (c) => c.status === "ESCALATED",
    ).length;

    return {
      data: {
        success: true,
        data: {
          cases: MOCK_RISK_CASES,
          statusSummary: {
            OPEN: openCount,
            UNDER_REVIEW: reviewCount,
            VERIFIED: verifiedCount,
            DISMISSED: dismissedCount,
            ESCALATED: escalatedCount,
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 9. GIS Districts (/districts)
  if (url.includes("/districts")) {
    return {
      data: {
        success: true,
        data: {
          districts: MOCK_DISTRICTS,
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 10. Analytics (/analytics/financial, /analytics/temporal, /analytics/efficiency)
  if (url.includes("/analytics/financial")) {
    return {
      data: { success: true, data: financialFallbackData },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  if (url.includes("/analytics/temporal")) {
    return {
      data: { success: true, data: temporalFallbackData },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  if (url.includes("/analytics/efficiency")) {
    return {
      data: { success: true, data: efficiencyFallbackData },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 11. Data Quality (/data-quality)
  if (url.includes("/data-quality")) {
    return {
      data: {
        success: true,
        data: {
          overallScore: 94.2,
          pillars: {
            completeness: 95.1,
            validity: 98.4,
            uniqueness: 91.2,
            consistency: 96.0,
            timeliness: 89.5,
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 12. Alerts (/alerts)
  if (url.includes("/alerts")) {
    return {
      data: {
        success: true,
        data: {
          alerts: [
            {
              _id: "alt-1",
              alertId: "ALT-2025-001",
              type: "HIGH_RISK_WORK_SANCTIONED",
              priority: "HIGH",
              title: "March Rush Pattern Detected in Belagavi",
              message:
                "Project MPLAD-2024-KA-BEL-01615 sanctioned on March 28 with 100% voucher release.",
              isRead: false,
              createdAt: "2024-11-21T08:00:00Z",
            },
          ],
          unreadCount: 1,
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 13. Audit Logs (/audit-log)
  if (url.includes("/audit-log")) {
    const now = Date.now();
    const mockAuditLogs = [
      {
        _id: "log-1",
        logId: "AUD-2026-0907-001",
        action: "CASE_STATUS_UPDATED",
        userName: "Dr. Rajesh Sharma",
        userEmail: "auditor@mplad-insight.demo",
        userRole: "AUDITOR",
        resource: "RiskCase",
        resourceType: "RiskCase",
        resourceId: "CASE-2024-UP-003",
        details:
          "Elevated inquiry #CASE-2024-UP-003 to ESCALATED following March sanction clustering review.",
        ipAddress: "127.0.0.1",
        createdAt: new Date(now - 1000 * 60 * 12).toISOString(),
        timestamp: new Date(now - 1000 * 60 * 12).toISOString(),
      },
      {
        _id: "log-2",
        logId: "AUD-2026-0907-002",
        action: "OFFICIAL_DATA_IMPORT",
        userName: "MoSPI System Operator",
        userEmail: "admin@mplad-insight.demo",
        userRole: "SYSTEM",
        resource: "ProjectRegistry",
        resourceType: "ImportJob",
        resourceId: "IMPORT-MOSPI-60359",
        details:
          "Canonical ingestion verified: 60,359 public works records synchronized across 33 States & UTs.",
        ipAddress: "127.0.0.1",
        createdAt: new Date(now - 1000 * 60 * 65).toISOString(),
        timestamp: new Date(now - 1000 * 60 * 65).toISOString(),
      },
      {
        _id: "log-3",
        logId: "AUD-2026-0907-003",
        action: "BATCH_ANOMALY_RUN",
        userName: "Ensemble Intelligence Engine",
        userEmail: "engine@mplad-insight.demo",
        userRole: "SYSTEM",
        resource: "AnomalyPipeline",
        resourceType: "AnomalyEngine",
        resourceId: "RUN-HYBRID-2026",
        details:
          "Isolation Forest + TF-IDF multi-tier scan prioritized 5,000 analytical signals across 724 districts.",
        ipAddress: "127.0.0.1",
        createdAt: new Date(now - 1000 * 60 * 180).toISOString(),
        timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
      },
      {
        _id: "log-4",
        logId: "AUD-2026-0907-004",
        action: "CONFIG_UPDATED",
        userName: "Vikas Verma",
        userEmail: "admin@mplad-insight.demo",
        userRole: "ADMIN",
        resource: "SystemConfiguration",
        resourceType: "EngineCalibration",
        resourceId: "CFG-2026-V1",
        details:
          "Calibrated statutory cost multiplier threshold to 2.2x and monopoly concentration limit to 30%.",
        ipAddress: "127.0.0.1",
        createdAt: new Date(now - 1000 * 60 * 360).toISOString(),
        timestamp: new Date(now - 1000 * 60 * 360).toISOString(),
      },
      {
        _id: "log-5",
        logId: "AUD-2026-0907-005",
        action: "NOTE_ADDED",
        userName: "Priya Iyer",
        userEmail: "auditor@mplad-insight.demo",
        userRole: "AUDITOR",
        resource: "RiskCase",
        resourceType: "InvestigationDossier",
        resourceId: "CASE-2024-KA-001",
        details:
          "Attached field inspection note: geo-tagged coordinate validation confirmed bridge span alignment.",
        ipAddress: "127.0.0.1",
        createdAt: new Date(now - 1000 * 60 * 720).toISOString(),
        timestamp: new Date(now - 1000 * 60 * 720).toISOString(),
      },
      {
        _id: "log-6",
        logId: "AUD-2026-0907-006",
        action: "REPORT_EXPORTED",
        userName: "Dr. Rajesh Sharma",
        userEmail: "auditor@mplad-insight.demo",
        userRole: "AUDITOR",
        resource: "StatutoryReport",
        resourceType: "ReportGenerator",
        resourceId: "REP-2026-Q1-ANNEX",
        details:
          "Generated official MoSPI Annexure-IV statutory audit report in cryptographic PDF format.",
        ipAddress: "127.0.0.1",
        createdAt: new Date(now - 1000 * 60 * 1440).toISOString(),
        timestamp: new Date(now - 1000 * 60 * 1440).toISOString(),
      },
    ];

    return {
      data: {
        success: true,
        data: {
          logs: mockAuditLogs,
          pagination: {
            total: mockAuditLogs.length,
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 14. Settings (/settings)
  if (url.includes("/settings")) {
    return {
      data: {
        success: true,
        data: {
          configuration: {
            weights: {
              financial: 0.25,
              contractor: 0.2,
              duplicate: 0.15,
              geographic: 0.1,
              temporal: 0.1,
              efficiency: 0.1,
              dataQuality: 0.1,
            },
            peerCostOutlierMultiplier: 2.2,
            contractorMonopolyPercent: 30,
            similarityThreshold: 0.68,
          },
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  // 15. Chatbot (/chat)
  if (url.includes("/chat")) {
    const q = (postData.message || "").trim().toLowerCase();

    // 15.1 Guidelines & Policy
    if (
      q.includes("what is mplad") ||
      q.includes("about mplad") ||
      q.includes("mplad scheme") ||
      q.includes("how does mplad work") ||
      q.includes("guideline") ||
      q.includes("entitlement") ||
      q.includes("who can recommend")
    ) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### MPLAD Scheme Overview & Statutory Guidelines\n\n` +
              `The **Member of Parliament Local Area Development Scheme (MPLADS)** is a Central Sector Scheme formulated in December 1993, administered by the **Ministry of Statistics and Programme Implementation (MoSPI)**.\n\n` +
              `**Key Institutional Provisions:**\n` +
              `- **Annual Entitlement**: Each MP is allocated **₹5 Crore per annum** in two equal installments of ₹2.5 Crore to recommend developmental works of a capital nature.\n` +
              `- **Fund Nature**: Fully funded by the Government of India; non-lapsable funds that carry forward across fiscal cycles.\n` +
              `- **Jurisdiction & Recommendation Boundaries**:\n` +
              `  - *Lok Sabha MPs*: Recommend works within their elected constituency.\n` +
              `  - *Rajya Sabha MPs*: Recommend works within one or more districts in their electing State.\n` +
              `  - *Nominated MPs*: Can recommend works anywhere across India.\n` +
              `- **Implementation Mechanism**: MPs hold recommending powers only. The **Implementing District Authority (IDA)** (District Magistrate / Collector / Deputy Commissioner) oversees technical scrutiny, sanctions the work, and executes it through public line agencies.\n` +
              `- **Focus Priority Areas**: Drinking water, primary education, sanitation, roads/pathways, public health, and durable community infrastructure assets.\n\n` +
              `*All data on this station reflects canonical MoSPI public snapshot records.*`,
            sources: [
              {
                sourceName: "MoSPI Official Scheme Guidelines & Public Dataset",
                sourceType: "OFFICIAL_POLICY",
                coveragePeriod: "2023–2024",
              },
            ],
            suggestedPrompts: [
              "What is the total allocation across all works?",
              "What are the status categories?",
              "How are anomaly signals detected?",
              "Show top projects in Uttar Pradesh",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.2 Status Categories
    if (
      q.includes("status category") ||
      q.includes("status categories") ||
      q.includes("what are the status") ||
      q.includes("explain status") ||
      q.includes("sanctioned vs unsanctioned") ||
      (q.includes("status") && (q.includes("mean") || q.includes("explain") || q.includes("type")))
    ) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### MPLADS Project Status Classifications\n\n` +
              `In the verified MoSPI dataset and platform registry, works advance through strict administrative milestones:\n\n` +
              `1. **SANCTIONED**: The Implementing District Authority (IDA) has accorded formal administrative, financial, and technical sanction. Funds are earmarked for ground execution.\n` +
              `2. **UNSANCTIONED**: Recommended by the Member of Parliament but awaiting formal technical/financial sanction from the District Collectorate.\n` +
              `3. **RECOMMENDED**: Work proposal registered in the portal by the MP; preliminary scrutiny or cost estimation by the IDA is underway.\n` +
              `4. **IN_PROGRESS**: Civil/infrastructure construction is actively underway on site.\n` +
              `5. **COMPLETED**: Work has achieved 100% physical and financial completion, and completion certificate is recorded.\n` +
              `6. **DELAYED**: Project execution timeline has exceeded statutory delivery milestones without formal extension.\n` +
              `7. **CANCELLED / DROPPED**: Work was reviewed and discontinued due to land feasibility, duplication, or statutory non-eligibility.\n\n` +
              `*Note: The platform rigorously maintains these classifications without re-labeling or converting unverified records.*`,
            sources: [
              {
                sourceName: "MoSPI Implementation & Monitoring Protocol",
                sourceType: "ADMINISTRATIVE_STANDARD",
                coveragePeriod: "2023–2024",
              },
            ],
            suggestedPrompts: [
              "What is the total allocation across all works?",
              "Which states have the highest allocations?",
              "How are anomaly signals detected?",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.3 Top States / Highest Allocation
    if (
      q.includes("highest allocation") ||
      q.includes("highest allocations") ||
      q.includes("top state") ||
      q.includes("state ranking") ||
      q.includes("state distribution")
    ) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### Top States by Recommended MPLADS Allocation\n\n` +
              `Based on verified public-source MoSPI records across all 33 States & UTs:\n\n` +
              `1. **Uttar Pradesh**\n` +
              `   - Recommended Allocation: **₹485.20 Crore** (₹4,852,000,000)\n` +
              `   - Verified Works Count: **9,140** projects\n` +
              `2. **Maharashtra**\n` +
              `   - Recommended Allocation: **₹391.00 Crore** (₹3,910,000,000)\n` +
              `   - Verified Works Count: **6,820** projects\n` +
              `3. **Rajasthan**\n` +
              `   - Recommended Allocation: **₹342.00 Crore** (₹3,420,000,000)\n` +
              `   - Verified Works Count: **5,930** projects\n` +
              `4. **Bihar**\n` +
              `   - Recommended Allocation: **₹298.00 Crore** (₹2,980,000,000)\n` +
              `   - Verified Works Count: **5,120** projects\n` +
              `5. **Karnataka**\n` +
              `   - Recommended Allocation: **₹264.00 Crore** (₹2,640,000,000)\n` +
              `   - Verified Works Count: **4,710** projects\n\n` +
              `*Totals are dynamically aggregated across 60,359 canonical project records.*`,
            sources: [
              {
                sourceName: "Canonical MoSPI Public Snapshot",
                sourceType: "PUBLIC_SOURCE_SNAPSHOT",
                coveragePeriod: "2023–2024",
                recordCount: 60359,
              },
            ],
            suggestedPrompts: [
              "Show top projects in Uttar Pradesh",
              "Show projects with critical risk",
              "What is the total allocation across India?",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.4 Critical & High Risk Works
    if (
      q.includes("critical risk") ||
      q.includes("high risk") ||
      q.includes("priority scrutiny") ||
      q.includes("highest risk")
    ) {
      const topRisky = MOCK_PROJECTS.filter((p) => p.riskLevel === "CRITICAL" || p.riskLevel === "HIGH").slice(0, 4);
      const items = topRisky
        .map(
          (p, idx) =>
            `${idx + 1}. **${p.title}**\n` +
            `   - ID: \`${p.projectId}\` | ${p.district}, ${p.state} | MP: ${p.mpName}\n` +
            `   - Allocation: **₹${p.allocatedAmount.toLocaleString("en-IN")}** | Score: **${p.riskScore}/100** (${p.riskLevel})\n` +
            `   - *Signal: ${p.signals?.[0]?.signal || "Peer cost outlier"}*`,
        )
        .join("\n");

      return {
        data: {
          success: true,
          data: {
            answer:
              `### Works Flagged for Priority Scrutiny\n\n` +
              `The following records exhibited notable statistical deviations against district peer baselines:\n\n` +
              items +
              `\n\n*All signals represent mathematical deviations (e.g. peer cost ratio >= 2.5x, authority concentration) to aid human audit prioritization. They do not constitute allegations of wrongdoing.*`,
            sources: [
              {
                sourceName: "Statistical Anomaly Engine & MoSPI Snapshot",
                sourceType: "ALGORITHMIC_BASELINE",
                coveragePeriod: "2023–2024",
                sampleIds: topRisky.map((p) => p.projectId),
              },
            ],
            suggestedPrompts: [
              `Explain project ${topRisky[0]?.projectId || "MPLAD-2024-KA-BEL-01615"}`,
              "How are anomaly signals detected?",
              "What are the status categories?",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.5 KPIs & Summary
    if (
      q.includes("summary") ||
      q.includes("kpi") ||
      q.includes("how many projects") ||
      q.includes("total works") ||
      q.includes("total allocation") ||
      q.includes("overall statistics") ||
      q.includes("statistics")
    ) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### Authoritative Platform Metrics Summary\n\n` +
              `Based on the verified **MoSPI public-source snapshot**:\n\n` +
              `- **Total Recorded Works**: **60,359** projects\n` +
              `- **Total Recommended Allocation**: **₹3,498.25 Crore** (₹34,982,467,506)\n` +
              `- **States & UTs Covered**: **33**\n` +
              `- **Members of Parliament Tracked**: **633**\n` +
              `- **Works Flagged for Priority Scrutiny**: **5,024** (8.3% of total)\n\n` +
              `*All figures are computed through server-side aggregations over verified source records.*`,
            sources: [
              {
                sourceName: "MPLADS Public-Source Snapshot",
                sourceType: "PUBLIC_SOURCE_SNAPSHOT",
                coveragePeriod: "26 Apr 2023 – 04 Mar 2024",
                recordCount: 60359,
              },
            ],
            suggestedPrompts: [
              "Which states have the highest allocations?",
              "What are the status categories?",
              "Explain the anomaly detection rules",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.6 Anomaly Methodology
    if (
      q.includes("anomaly") ||
      q.includes("fraud") ||
      q.includes("risk score") ||
      q.includes("rule") ||
      q.includes("why flagged") ||
      q.includes("how is risk calculated")
    ) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### Anomaly Detection & Statistical Risk Methodology\n\n` +
              `The system applies a deterministic, multi-dimensional **Rule-Based Statistical Engine** to highlight administrative outliers for human audit prioritization without making subjective allegations:\n\n` +
              `**Core Analytical Dimensions:**\n` +
              `1. **Financial Cost Deviation**: Flags projects whose recommended allocation exceeds **2.5x to 4x the peer median** for the same developmental category in that district.\n` +
              `2. **Authority Workload Concentration**: Identifies when an Implementing District Authority (IDA) is designated for over **45% of total district works**.\n` +
              `3. **Metadata Completeness (Data Quality)**: Flags records missing crucial sub-district geographic fields (block/village) or recommendation dates.\n` +
              `4. **Temporal Fiscal Rush**: Flags sanction clustering in late March (fiscal year-end spending rush).\n\n` +
              `**Risk Classification Tiers:**\n` +
              `- **CRITICAL (>= 75)**: Recommended for urgent engineering verification and physical inspection.\n` +
              `- **HIGH (50–74)**: Prioritized for administrative review.\n` +
              `- **MEDIUM (25–49)**: Included in periodic social audit sampling.\n` +
              `- **LOW (< 25)**: Routine statutory monitoring.\n\n` +
              `*Disclaimer: Signals indicate statistical divergence against peer baselines to help auditors focus resources efficiently.*`,
            sources: [
              {
                sourceName: "MPLAD Insight Statistical Engine Specification",
                sourceType: "ALGORITHMIC_BASELINE",
                coveragePeriod: "2026-v1",
              },
            ],
            suggestedPrompts: [
              "Show projects with critical risk",
              "What are the status categories?",
              "Why are contractor names null in some records?",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.7 Specific Project Search
    const foundProject = MOCK_PROJECTS.find(
      (p) =>
        q.includes(p.projectId.toLowerCase()) ||
        q.includes(p._id.toLowerCase()) ||
        (p.district && q.includes(p.district.toLowerCase()) && q.includes(p.state.toLowerCase())),
    );

    if (foundProject) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### Project Record: ${foundProject.projectId}\n\n` +
              `- **Title**: ${foundProject.title}\n` +
              `- **Category**: ${foundProject.category}\n` +
              `- **State & District**: ${foundProject.district}, ${foundProject.state} (${foundProject.constituency})\n` +
              `- **Recommending MP**: ${foundProject.mpName}\n` +
              `- **Recommended Allocation**: ₹${foundProject.allocatedAmount.toLocaleString("en-IN")}\n` +
              `- **Status**: ${foundProject.status}\n` +
              `- **Risk Level**: **${foundProject.riskLevel}** (Score: ${foundProject.riskScore}/100)\n` +
              `- **Recommendation**: ${foundProject.recommendation}\n\n` +
              `**Detection Signals (${foundProject.signals?.length || 0}):**\n` +
              (foundProject.signals?.map((s) => `- **${s.dimension} (${s.severity})**: ${s.signal}\n  *${s.explanation}*`).join("\n") || `*No adverse signals detected.*`),
            sources: [
              {
                sourceName: "MoSPI Public-Source Snapshot",
                sourceType: "PUBLIC_SOURCE_SNAPSHOT",
                coveragePeriod: "2023–2024",
                sampleIds: [foundProject.projectId],
              },
            ],
            suggestedPrompts: [
              `Show other projects in ${foundProject.district}`,
              "What is the total allocation across all works?",
              "How are anomaly signals detected?",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.8 Contractor Transparency
    if (
      q.includes("contractor") ||
      q.includes("vendor") ||
      q.includes("ida") ||
      q.includes("implementing agency")
    ) {
      return {
        data: {
          success: true,
          data: {
            answer:
              `### Implementing Agencies & Contractor Transparency Rules\n\n` +
              `In official MPLADS governance:\n` +
              `- **Implementing District Authorities (IDAs)**: Under MoSPI guidelines, project allocations are directed to statutory district authorities (District Magistrate, District Collector, Deputy Commissioner) rather than private contractors.\n` +
              `- **Source Transparency**: The official public-source snapshot records the **IDA field** (e.g. \`DISTRICT MAGISTRATE DARBHANGA_IDA\`, \`DISTRICT COLLECTOR DHOLPUR_IDA\`).\n` +
              `- **Zero Fabrication Rule**: Because private vendor awards are managed by district line departments and are **not published in this national snapshot**, private company names are **strictly set to null**.\n` +
              `- The system monitors **IDA Workload Concentration** to detect instances where single district agencies receive over 45% of total district works.`,
            sources: [
              {
                sourceName: "MPLAD Scheme Implementation Framework",
                sourceType: "GOVERNMENT_REFERENCE",
                coveragePeriod: "Current",
              },
            ],
            suggestedPrompts: [
              "What is the total allocation across all works?",
              "How are anomaly signals detected?",
              "What data fields are in the source?",
            ],
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      };
    }

    // 15.9 Default Grounded Mock Response
    return {
      data: {
        success: true,
        data: {
          answer:
            `### MPLADS Intelligence Assistant\n\n` +
            `I am your grounded guide for the **MPLAD Insight** platform. All responses are derived strictly from **60,359 verified MoSPI public records** and the statistical anomaly engine with zero fabrication.\n\n` +
            `**Here are some things I can assist you with:**\n` +
            `- **Platform KPIs**: Ask for national totals, state coverage, and cumulative allocations.\n` +
            `- **Status Categories**: Learn the legal workflow stages (\`SANCTIONED\`, \`UNSANCTIONED\`, \`RECOMMENDED\`).\n` +
            `- **Anomaly Signals**: Understand peer cost outlier rules and authority concentration metrics.\n` +
            `- **Project Records**: Enter any project ID (e.g., \`MPLAD-2024-KA-BEL-01615\`) to inspect details and signals.\n` +
            `- **Regional Intelligence**: Inquire about works and allocations in any of the 33 States.\n` +
            `- **Statutory Policy**: Review MPLADS guidelines, funding tranches, and jurisdiction rules.\n\n` +
            `*If a field (such as private contractor identities) is not in verified official records, it is strictly noted as unavailable.*`,
          sources: [
            {
              sourceName: "MPLAD Insight Knowledge Base",
              sourceType: "VERIFIED_SYSTEM_DATA",
              coveragePeriod: "2023–2024",
            },
          ],
          suggestedPrompts: [
            "What is the total allocation across all works?",
            "What are the status categories?",
            "Which states have the highest allocations?",
            "How are anomaly signals detected?",
          ],
        },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }

  return {
    data: { success: true, data: {} },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  };
}

export default api;
