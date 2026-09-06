# API Endpoint Audit & Specification — MPLAD Insight

## 1. Overview
This document records the complete HTTP interface contract, authentication requirements, query parameters, response schemas, and latency profiles for all endpoints exposed by the API Gateway (`http://127.0.0.1:5000` / `/api`).

---

## 2. Endpoint Contract Inventory

### 2.1 System & Infrastructure
- **`GET /api/health`**
  - **Purpose**: Non-blocking health, service name, database connection state, and project ingestion readiness.
  - **Auth**: None
  - **Payload Size**: ~170 B
  - **Typical Latency**: < 10 ms
  - **Response Schema**:
    ```json
    {
      "status": "ok",
      "service": "mplad-insight-api",
      "database": "connected",
      "dataReady": true,
      "projectCount": 60359,
      "version": "1.0.0-SIH2026"
    }
    ```

### 2.2 Executive Dashboard
- **`GET /api/dashboard/summary`**
  - **Purpose**: Dynamic server-side aggregation for executive KPIs, status breakdowns, house distribution, and top priority cases.
  - **Auth**: None (Public executive view)
  - **Query Parameters**: `state`, `district`, `financialYear`, `category`, `riskLevel`, `house`
  - **Payload Size**: ~13.5 KB (compact summary, NOT the entire dataset)
  - **Typical Latency**: 200–450 ms (via indexed MongoDB aggregation pipeline)
  - **Response Schema**:
    ```json
    {
      "success": true,
      "data": {
        "kpis": { "totalProjects": 60359, "totalAllocatedAmount": 34982467506, "avgRiskScore": 70.9, ... },
        "charts": { "statusBreakdown": [...], "rawStatusBreakdown": [...], "houseBreakdown": [...], "categoryBreakdown": [...], "stateDistribution": [...] },
        "topHighRiskProjects": [...],
        "provenance": { ... }
      }
    }
    ```

### 2.3 Works Register (Paginated Projects)
- **`GET /api/projects`**
  - **Purpose**: Paginated search and filtering over 60,359 canonical works records.
  - **Auth**: None
  - **Query Parameters**: `page` (default 1), `limit` (default 15, max 100), `search`, `state`, `district`, `category`, `riskLevel`, `status`, `financialYear`, `sortBy`, `sortOrder`
  - **Payload Size**: ~15 KB per page (15 items)
  - **Typical Latency**: 25–60 ms

### 2.4 Grounded Intelligence Assistant (Chatbot)
- **`POST /api/chat`**
  - **Purpose**: Natural-language grounded retrieval and assistance over canonical records and scheme rules.
  - **Auth**: None
  - **Body**: `{ "message": "string", "history": [] }`
  - **Payload Size**: ~1.2 KB
  - **Typical Latency**: 35–80 ms

### 2.5 Analytics & Intelligence
- **`GET /api/analytics/financial`**: Binned cost distribution histogram and category spending velocity.
- **`GET /api/analytics/temporal`**: Monthly sanction trend and March fiscal year-end spike ratio.
- **`GET /api/analytics/efficiency`**: Progress vs utilization scatter points and stalled works identification.
- **`GET /api/anomalies`**: Statistical signals for cost deviation and authority concentration.
- **`GET /api/risk-cases`**: 30 structured administrative review dossiers.
- **`GET /api/districts`**: 724 district records with GIS coordinates for Spatial Map.
- **`GET /api/contractors`**: 699 Implementing District Authorities (IDAs).

### 2.6 Governance & Administration
- **`POST /api/auth/login`**: Issues 24-hour signed JWT for role-based personas.
- **`GET /api/auth/me`**: Returns authenticated user profile.
- **`GET /api/audit-log`**: Forensic audit trail of system operations and reviews.
- **`GET /api/settings`**: System scoring parameters and peer multiplier thresholds.
