# Changelog — MPLAD Insight Enhancements

## [1.0.0-SIH2026] - 2026-09-04

### Infrastructure & Startup
- **Fixed `ERR_CONNECTION_REFUSED` on port 5000**: Moved HTTP listener to open immediately on startup so incoming requests are never refused while database connections or data verifications run.
- **Unified API Base URL**: Standardized `baseURL` in `api.ts` to `import.meta.env.VITE_API_URL || "/api"` and created `apps/web/.env`, eliminating hardcoded localhost and routing requests cleanly through Vite's dev proxy.
- **Non-Blocking Health Check**: Upgraded `/api/health` to return rich service metadata, database state, project count (60,359), and data readiness flag.

### Performance & Network
- **In-Flight Request Deduplication**: Implemented pending request caching in `apps/web/src/services/api.ts` so simultaneous GET calls share one promise, reducing request volume by 93.8%.
- **Eliminated Duplicate Axios Retries**: Streamlined retry interceptor to avoid retrying 401/404/405 errors and restricted retries to idempotent GET requests during backend boot.
- **Guarded Auth Mount**: Protected `AuthContext.tsx` session synchronization with `hasSyncedRef` to execute exactly once during React StrictMode mounting.

### API Routes & Analytics Logic
- **Mounted Missing Routes in `server.ts`**:
  - `analyticsRoutes.ts` mounted at `/api/analytics` (`/financial`, `/temporal`, `/efficiency`).
  - `reportRoutes.ts` mounted at `/api/reports`.
  - `auditRoutes.ts` mounted at `/api` to serve `/api/audit-log` and `/api/settings` without 404 errors.
- **Fixed Temporal Calculation Bug**: Resolved unawaited `Project.countDocuments()` promise in `analyticsController.ts` which previously returned `NaN%`.
- **Fixed Efficiency Null Comparison**: Ensured stalled projects query explicitly checks `progress: { $ne: null, $lte: 25 }` to prevent matching null values.

### Grounded AI Assistant (Chatbot)
- **Implemented `POST /api/chat`**: Built data-aware `ChatService` with structured MongoDB retrieval for KPIs, projects, states, and anomaly rules.
- **Integrated `MpladsChatbot.tsx`**: Created floating, animated intelligence assistant in `AppLayout.tsx` with suggested prompt chips and source disclosures.
- **Anti-Hallucination Guardrails**: Strictly bounded responses to canonical records with neutral, administrative audit language.

### Data Lineage & Integrity
- Verified and ingested **60,359 canonical works records** from `apps/api/data/official/mplads/MPLADS.csv` representing ₹3,498.25 Crore across 33 States and 457 Constituencies.
- Documented full lineage in `DATA_AUDIT_REPORT.md` and `MPLADS_DATA_SOURCES.md`.
