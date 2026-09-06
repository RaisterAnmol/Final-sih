# Runbook & Operations Guide — MPLAD Insight

## 1. Quick Start Commands

### Single-Command Start (Monorepo Root)
From `c:\Users\anmol\.gemini\antigravity\scratch\MPLADS_sih\mpld sih`:
```bash
npm run dev
```
Starts API Gateway (port 5000), Vite Web Station (port 3000), and Python ML service (port 8000) concurrently.

### Isolated Workspace Start Commands
- **Backend API Gateway**:
  ```bash
  npm --workspace=apps/api run dev
  ```
  Runs at: `http://127.0.0.1:5000`
- **Frontend Intelligence Station**:
  ```bash
  npm --workspace=apps/web run dev
  ```
  Runs at: `http://localhost:3000`

---

## 2. Port & Service Map

| Service | Protocol | Host / Port | Health URL | Purpose |
| ------- | -------- | ----------- | ---------- | ------- |
| **Vite Frontend** | HTTP | `http://localhost:3000` | `http://localhost:3000/` | React Intelligence UI |
| **API Gateway** | HTTP | `http://127.0.0.1:5000` | `http://127.0.0.1:5000/api/health` | Node.js Express REST API |
| **Embedded DB** | MongoDB Wire | `127.0.0.1:auto` | Embedded In-Memory Engine | Automatic fallback database |
| **ML Engine** | HTTP | `http://127.0.0.1:8000` | `http://127.0.0.1:8000/health` | Python FastAPI ML service |

---

## 3. Demo Persona Accounts

| Persona Role | Email | Password | Pre-seeded Designation |
| ------------ | ----- | -------- | ---------------------- |
| **Admin** | `admin@mplad-insight.demo` | `Demo@12345` | Dr. Rajesh Sharma (Director General, MoSPI) |
| **Auditor** | `auditor@mplad-insight.demo` | `Demo@12345` | Priya Iyer (Senior Audit Officer, CAG Nominee) |
| **Analyst** | `analyst@mplad-insight.demo` | `Demo@12345` | Vikram Singh (Lead Statistical Analyst, NIC) |
| **Viewer** | `viewer@mplad-insight.demo` | `Demo@12345` | Ananya Deshmukh (Oversight Officer, Citizen Cell) |

---

## 4. Verification Health Check
To verify everything is operating properly on localhost:
```bash
curl http://localhost:3000/api/health
```
Expected output:
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
