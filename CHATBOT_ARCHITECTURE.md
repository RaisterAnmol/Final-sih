# Grounded MPLADS Intelligence Assistant — Architecture & Safety

## 1. Executive Summary
The **MPLADS Intelligence Assistant** is a data-aware, grounded natural language conversational system embedded directly inside the MPLAD Insight platform. Its primary objective is to assist auditors, administrators, MPs, and citizens in understanding official MPLADS scheme provisions, interpreting dashboard KPIs, explaining statistical anomaly signals, and querying verified project records across all 33 States.

---

## 2. System Architecture & Information Flow

```text
                  ┌─────────────────────────────────────────┐
                  │          Browser UI / User              │
                  │  (Floating Widget: MpladsChatbot.tsx)   │
                  └────────────────────┬────────────────────┘
                                       │ HTTP POST /api/chat
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │           Backend API Gateway           │
                  │         [chatController.ts]             │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Grounded ChatService.ts           │
                  │       (Intent & Entity Parsing)         │
                  └───────┬─────────────┬─────────────┬─────┘
                          │             │             │
        ┌─────────────────┘             │             └─────────────────┐
        ▼                               ▼                               ▼
 ┌───────────────┐              ┌───────────────┐               ┌───────────────┐
 │ Scheme Rules  │              │ MongoDB Core  │               │   Anomaly     │
 │  & Statutory  │              │ Works Records │               │  Methodology  │
 │  Guidelines   │              │  (60,359 rows)│               │  Definitions  │
 └───────┬───────┘              └───────┬───────┘               └───────┬───────┘
         │                              │                               │
         └──────────────────────┐       │       ┌───────────────────────┘
                                ▼       ▼       ▼
                  ┌─────────────────────────────────────────┐
                  │      Structured Response Builder        │
                  │  - Markdown Formatted Explanation       │
                  │  - Grounded Statistics & Aggregations   │
                  │  - Provenance Disclosures (MoSPI 23-24) │
                  │  - Interactive Suggested Prompts        │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │      Rendered Grounded Card in UI       │
                  │    Zero Hallucination Guarantee         │
                  └─────────────────────────────────────────┘
```

---

## 3. Core Capabilities & Supported Intent Handlers

### 3.1 Statutory Policy & Scheme Guidelines
- **Intent**: Answers queries regarding the constitutional and administrative provisions of MPLADS.
- **Knowledge Base**:
  - Annual entitlement: ₹5 Crore per MP in two equal tranches of ₹2.5 Crore.
  - Fund type: Non-lapsable, Central Sector Scheme administered by MoSPI.
  - Recommendation boundaries: Lok Sabha MPs recommend within constituency; Rajya Sabha MPs recommend within State; Nominated MPs recommend nationwide.
  - Role of Implementing District Authority (IDA): Technical sanction, tendering, and execution oversight.

### 3.2 Dynamic Aggregation of Platform KPIs
- **Intent**: Real-time queries for scheme totals and distribution.
- **Runtime Mechanism**: Executes MongoDB `$group` aggregation over canonical collection:
  - Total Works: 60,359
  - Cumulative Allocation: ₹3,498.25 Crore (₹34,982,467,506)
  - States Covered: 33
  - MPs Tracked: 633
  - Constituencies: 457
  - IDAs: 699

### 3.3 State & Regional Work Inquiries
- **Intent**: Queries regarding work counts and high-value allocations in specific States (e.g. Uttar Pradesh, Maharashtra, Rajasthan, Bihar, Karnataka).
- **Runtime Mechanism**: Server-side filtered query returning top works with Work ID, Recommending MP, Allocation Amount, and Risk Level.

### 3.4 Work Record Inspector
- **Intent**: Deep inspection of specific Project IDs (e.g., `MPLAD-2023-RJ-DHO-00001`).
- **Runtime Mechanism**: Fetches exact record and details:
  - Work description and developmental category.
  - Implementing District Authority (IDA).
  - Allocation amount and approval status.
  - Active detection signals and peer deviation factors.

### 3.5 Anomaly Signal & Risk Explanation
- **Intent**: Explains why a project received an analytical risk score or detection signal.
- **Runtime Mechanism**: Explains mathematical peer-median cost ratio (>=2.5x) and IDA concentration thresholds (>=45% of district works).

---

## 4. Anti-Hallucination Guardrails & Impartiality Rules

1. **Grounded Source Bounding**:
   - The assistant never generates synthetic numbers. Every financial figure, work count, and MP name is retrieved directly from MongoDB.
   - If an unverified attribute is queried (e.g. private contractor identities or progress percentages not present in the public snapshot), the assistant explicitly states that the attribute is **not available in the verified MoSPI public snapshot**.

2. **Impartial Audit Language**:
   - The assistant adheres strictly to neutral audit terminology.
   - Outputs are framed as:
     - *"Potential statistical anomaly indicator"*
     - *"Category peer cost deviation"*
     - *"Analytical observation for administrative review"*
   - The assistant **never** accuses individuals, MPs, or authorities of fraud, corruption, or legal wrongdoing.

3. **Source Provenance Disclosure**:
   - Every response includes structured metadata citing:
     - Dataset: MoSPI Public Snapshot
     - Coverage Period: 26 Apr 2023 – 04 Mar 2024
     - Record Count / Sample IDs utilized.
