# Data Lineage & Audit Report — MPLAD Insight

## 1. Overview
This report establishes the complete data provenance, runtime source, classification, transformations, and limitations of all data elements across the **MPLAD Insight** platform.

**Classification Taxonomy:**
- `VERIFIED_REAL_MPLADS_DATA`: Directly parsed from official government / MoSPI public snapshot.
- `GOVERNMENT_REFERENCE_DATA`: Institutional rules, statutory ceiling provisions (e.g. ₹5 Cr/year per MP).
- `DERIVED_FROM_REAL_DATA`: Deterministic mathematical or categorization transformations over verified fields.
- `PROJECT_GENERATED_ANALYTICAL`: Algorithmic anomaly signals, statistical risk scoring, peer outlier calculations.
- `UNAVAILABLE_IN_SOURCE`: Attributes intentionally not populated (`null`) to preserve zero-fabrication integrity.

---

## 2. Feature & Dataset Lineage Matrix

| Feature / Page | Source File | Runtime Source | Data Type | Real / Derived / Mock | Government Source | Transformations |
| -------------- | ----------- | -------------- | --------- | --------------------- | ----------------- | --------------- |
| **Executive Dashboard KPIs** | `MPLADS.csv` | MongoDB `projects` collection (`$group`, `$sum`) | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI / Official Snapshot (2023–24) | Aggregation over 60,359 records. Zero fabrication. |
| **Works Register (Table)** | `MPLADS.csv` | `GET /api/projects` | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI / Official Snapshot | Normalized into canonical schema with deterministic IDs. |
| **Parliamentary MPs Directory** | `MPLADS.csv` | `GET /api/projects/mps/directory` | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI Snapshot (633 MPs) | Grouped by MP name, house, and state. |
| **State Distribution Chart** | `MPLADS.csv` | `GET /api/dashboard/summary` | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI Snapshot (33 States) | Sum of allocation per State and avg risk score. |
| **Sector / Category Breakdown** | `MPLADS.csv` | `GET /api/dashboard/summary` | `DERIVED_FROM_REAL_DATA` | **DERIVED** | Keyword classification of `WORK` & `CATEGORY` | Standardized into 10 official developmental sectors. |
| **Implementing Authorities (IDA)** | `MPLADS.csv` | `GET /api/contractors` | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI `IDA` field | Grouped by 699 District Authorities. Private vendors set to `null`. |
| **Spatial GIS Map** | `MPLADS.csv` | `GET /api/districts` | `DERIVED_FROM_REAL_DATA` | **DERIVED** | 724 District authorities in snapshot | Centroids mapped using State boundaries & deterministic hash offset. |
| **Cost Outlier Signals** | `MPLADS.csv` | `GET /api/anomalies` | `PROJECT_GENERATED_ANALYTICAL` | **ANALYTICAL** | MoSPI `ALLOCATION AMOUNT` | Peer ratio against district category median (>=2.5x). |
| **IDA Concentration Signals** | `MPLADS.csv` | `GET /api/anomalies` | `PROJECT_GENERATED_ANALYTICAL` | **ANALYTICAL** | MoSPI `IDA` assignments | Triggered when single authority has >=45% of district works. |
| **Administrative Review Inquiries** | Algorithm | `GET /api/risk-cases` | `PROJECT_GENERATED_ANALYTICAL` | **ANALYTICAL** | High/Critical flagged projects | 30 structured inquiries for administrative audit verification. |
| **Financial Allocation Analytics** | `MPLADS.csv` | `GET /api/analytics/financial` | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI Allocation amounts | Cost distribution histogram into Lakh bins. |
| **Temporal Trend Analytics** | `MPLADS.csv` | `GET /api/analytics/temporal` | `VERIFIED_REAL_MPLADS_DATA` | **REAL** | MoSPI `RECOMMENDED DATE` | Monthly distribution & March fiscal year-end spike ratio. |
| **Data Quality Metrics** | `MPLADS.csv` | `GET /api/data-quality` | `PROJECT_GENERATED_ANALYTICAL` | **ANALYTICAL** | Completeness across 15 attributes | Evaluates missing sub-district location or dates. |
| **Intelligence Assistant (Chatbot)** | Canonical DB | `POST /api/chat` | `PROJECT_GENERATED_ANALYTICAL` | **GROUNDED** | Database records & statutory rules | Grounded retrieval with explicit source citations and zero hallucination. |

---

## 3. Strict Zero-Fabrication Guarantees
1. **Contractors**: In official MPLADS administration, projects are sanctioned to **Implementing District Authorities (IDAs)**. Private vendor identities are not present in national portal snapshots and are **strictly recorded as `null`**.
2. **Physical & Financial Progress**: Where milestone percentage is not recorded in the public snapshot, fields are preserved as `null`. No simulated progress numbers are fabricated for real records.
3. **Impartial Language**: All anomaly outputs are labeled **"potential anomaly indicator"** or **"administrative review observation"**, strictly adhering to audit-support standards rather than asserting legal guilt.
