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

api.interceptors.response.use(
  (response) => {
    // If response is HTML text instead of JSON (e.g. index.html returned by SPA fallback)
    if (
      typeof response.data === "string" &&
      (response.data.trim().toLowerCase().startsWith("<!doctype html") ||
        response.data.trim().toLowerCase().startsWith("<html"))
    ) {
      if (
        import.meta.env.VITE_DEMO_MODE === "true" ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
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

    const isDemoMode =
      import.meta.env.VITE_DEMO_MODE === "true" ||
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (
      isDemoMode &&
      (!error.response ||
        [404, 405, 500, 502, 503, 504].includes(error.response.status) ||
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNREFUSED")
    ) {
      console.warn(
        `[API Fallback] Serving fallback for ${url} (VITE_DEMO_MODE=true)`,
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
          token: `demo_jwt_token_${role.toLowerCase()}`,
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
    const parts = url.split("/");
    const pid = parts[parts.length - 1];
    const project =
      MOCK_PROJECTS.find((p) => p._id === pid || p.projectId === pid) ||
      MOCK_PROJECTS[0];

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

  return {
    data: { success: true, data: {} },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  };
}

export default api;
