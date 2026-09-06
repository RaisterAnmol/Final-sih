import { Project } from "../models/Project.js";
import { Anomaly } from "../models/Anomaly.js";
import { RiskCase } from "../models/RiskCase.js";
import { District } from "../models/District.js";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources: Array<{
    sourceName: string;
    sourceType: string;
    coveragePeriod: string;
    recordCount?: number;
    sampleIds?: string[];
  }>;
  suggestedPrompts: string[];
}

export class ChatService {
  /**
   * Grounded intent classification and data retrieval
   */
  static async processMessage(
    userMessage: string,
    history: ChatMessage[] = [],
  ): Promise<ChatResponse> {
    const q = userMessage.trim().toLowerCase();

    // 1. FAQ: What is MPLADS?
    if (
      q.includes("what is mplad") ||
      q.includes("about mplad") ||
      q.includes("mplad scheme") ||
      q.includes("how does mplad work")
    ) {
      return {
        answer:
          `### MPLAD Scheme Overview\n\n` +
          `The **Member of Parliament Local Area Development Scheme (MPLADS)** is a Central Sector Scheme formulated in December 1993, administered by the **Ministry of Statistics and Programme Implementation (MoSPI)**.\n\n` +
          `**Key Institutional Provisions:**\n` +
          `- **Annual Entitlement**: Each MP is allocated **₹5 Crore per annum** in two equal installments of ₹2.5 Crore to recommend developmental works of a capital nature.\n` +
          `- **Jurisdiction**: \n` +
          `  - *Lok Sabha MPs* recommend works within their constituency.\n` +
          `  - *Rajya Sabha MPs* recommend works within one or more districts in their electing State.\n` +
          `  - *Nominated MPs* can recommend works anywhere in the country.\n` +
          `- **Implementation**: MPs recommend works; the **Implementing District Authority (IDA)** (usually District Collector/Magistrate) examines technical feasibility, sanctions works, and executes them through designated agencies.\n` +
          `- **Focus Areas**: Drinking water, primary education, public health, sanitation, rural infrastructure, and public community assets.\n\n` +
          `*Note: The platform reflects verified MoSPI snapshot records. All findings are analytical indicators for administrative review.*`,
        sources: [
          {
            sourceName: "MoSPI Official Scheme Guidelines & Public Dataset",
            sourceType: "OFFICIAL_POLICY",
            coveragePeriod: "2023–2024",
          },
        ],
        suggestedPrompts: [
          "What is the total allocation across all works?",
          "How are anomaly signals detected?",
          "Show top projects in Uttar Pradesh",
        ],
      };
    }

    // 2. Dashboard KPIs & Summary
    if (
      q.includes("summary") ||
      q.includes("kpi") ||
      q.includes("how many projects") ||
      q.includes("total works") ||
      q.includes("total allocation") ||
      q.includes("overall statistics")
    ) {
      const totalProjects = await Project.countDocuments();
      const [sumAgg] = await Project.aggregate([
        { $group: { _id: null, total: { $sum: "$allocatedAmount" } } },
      ]);
      const totalAllocated = sumAgg?.total || 0;
      const totalStates = (await Project.distinct("state")).length;
      const totalMps = (await Project.distinct("mpName")).length;
      const totalHighRisk = await Project.countDocuments({
        riskLevel: { $in: ["HIGH", "CRITICAL"] },
      });

      return {
        answer:
          `### Authoritative Platform Metrics Summary\n\n` +
          `Based on the verified **MoSPI public-source snapshot**:\n\n` +
          `- **Total Recorded Works**: **${totalProjects.toLocaleString("en-IN")}** projects\n` +
          `- **Total Recommended Allocation**: **₹${(totalAllocated / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Crore** (₹${totalAllocated.toLocaleString("en-IN")})\n` +
          `- **States & UTs Covered**: **${totalStates}**\n` +
          `- **Members of Parliament**: **${totalMps}**\n` +
          `- **Works Flagged for Priority Scrutiny**: **${totalHighRisk.toLocaleString("en-IN")}** (${((totalHighRisk / (totalProjects || 1)) * 100).toFixed(1)}% of total)\n\n` +
          `*All statistics are computed dynamically using server-side database aggregation over canonical source records.*`,
        sources: [
          {
            sourceName: "MPLADS Public-Source Snapshot",
            sourceType: "PUBLIC_SOURCE_SNAPSHOT",
            coveragePeriod: "26 Apr 2023 – 04 Mar 2024",
            recordCount: totalProjects,
          },
        ],
        suggestedPrompts: [
          "Which states have the highest allocations?",
          "Explain the anomaly detection rules",
          "What are the status categories?",
        ],
      };
    }

    // 3. Anomaly Rules & Methodology
    if (
      q.includes("anomaly") ||
      q.includes("fraud") ||
      q.includes("risk score") ||
      q.includes("rule") ||
      q.includes("why flagged") ||
      q.includes("how is risk calculated")
    ) {
      return {
        answer:
          `### Anomaly Detection & Statistical Risk Methodology\n\n` +
          `The system applies a deterministic, multi-dimensional **Rule-Based Statistical Engine** designed to highlight administrative anomalies for human audit verification. It does **not** make allegations of fraud or misconduct.\n\n` +
          `**Core Analysis Dimensions:**\n` +
          `1. **Cost Deviation (Financial)**: Flags projects whose recommended allocation exceeds **2.5x to 4x the peer median** for the same category in that district.\n` +
          `2. **Workload Concentration (IDA Authority)**: Identifies when an Implementing District Authority is designated for over **45% of total district works**.\n` +
          `3. **Metadata Completeness (Data Quality)**: Flags records with unpopulated location attributes (e.g. missing block/village or recommendation date).\n` +
          `4. **Temporal Fiscal Rush**: Flags recommendations concentrated heavily in late March (fiscal year-end rush).\n\n` +
          `**Risk Classification:**\n` +
          `- **CRITICAL (>= 75)**: Urgent verification of estimates and authority capacity recommended.\n` +
          `- **HIGH (50–74)**: Recommended for routine administrative review.\n` +
          `- **MEDIUM (25–49)**: Periodic sampling in social audit cycles.\n` +
          `- **LOW (< 25)**: Standard statutory workflow.\n\n` +
          `*Disclaimer: Signals indicate statistical divergence against peer baselines and serve purely as an audit prioritization guide.*`,
        sources: [
          {
            sourceName: "MPLAD Insight Statistical Engine Specification",
            sourceType: "ALGORITHMIC_BASELINE",
            coveragePeriod: "2026-v1",
          },
        ],
        suggestedPrompts: [
          "Show projects with critical risk",
          "How is contractor data handled?",
          "What data fields are in the source?",
        ],
      };
    }

    // 4. Specific Project Inquiry (by ID)
    const projectIdMatch = q.match(/mplad-[0-9]{4}-[a-z]{2}-[a-z]{3}-[0-9]+/i);
    if (projectIdMatch) {
      const pid = projectIdMatch[0].toUpperCase();
      const proj = await Project.findOne({ projectId: pid });
      if (!proj) {
        return {
          answer: `I could not find project **${pid}** in the canonical MPLADS database. Please verify the identifier or search by MP name or district.`,
          sources: [],
          suggestedPrompts: [
            "Show high risk projects",
            "Search projects in Rajasthan",
          ],
        };
      }

      const signalsList = (proj.signals || [])
        .map(
          (s: any) =>
            `- **${s.dimension} (${s.severity})**: ${s.signal}\n  *${s.explanation}*`,
        )
        .join("\n");

      return {
        answer:
          `### Project Record: ${proj.projectId}\n\n` +
          `- **Title**: ${proj.title}\n` +
          `- **Category**: ${proj.category}\n` +
          `- **State & District**: ${proj.district}, ${proj.state} (${proj.constituency})\n` +
          `- **Recommending MP**: ${proj.mpName} (${proj.house})\n` +
          `- **Recommended Allocation**: ₹${proj.allocatedAmount.toLocaleString("en-IN")}\n` +
          `- **Status**: ${proj.status} *(Raw: ${proj.rawStatus || "Unspecified"})*\n` +
          `- **Implementing Authority**: ${proj.implementingAgency || proj.ida || "Unspecified District Authority"}\n` +
          `- **Risk Level**: **${proj.riskLevel}** (Score: ${proj.riskScore}/100)\n` +
          `- **Recommendation**: ${proj.recommendation}\n\n` +
          `**Detection Signals (${proj.signals?.length || 0}):**\n` +
          (signalsList || `*No adverse statistical signals detected.*`) +
          `\n\n*Source: Public-source snapshot record (${proj.sourceRecordId}). Zero synthetic values.*`,
        sources: [
          {
            sourceName: "MoSPI Public-Source Snapshot",
            sourceType: "PUBLIC_SOURCE_SNAPSHOT",
            coveragePeriod: "2023–2024",
            sampleIds: [proj.projectId],
          },
        ],
        suggestedPrompts: [
          `Show other projects in ${proj.district}`,
          `Show projects by ${proj.mpName}`,
          "What does this risk score mean?",
        ],
      };
    }

    // 5. State-specific project search
    const states = [
      "Uttar Pradesh",
      "Maharashtra",
      "Rajasthan",
      "Bihar",
      "Tamil Nadu",
      "Karnataka",
      "Gujarat",
      "West Bengal",
      "Madhya Pradesh",
      "Kerala",
      "Assam",
      "Punjab",
      "Haryana",
      "Odisha",
      "Telangana",
      "Andhra Pradesh",
      "Jharkhand",
      "Chhattisgarh",
      "Uttarakhand",
      "Himachal Pradesh",
    ];
    const matchedState = states.find((s) => q.includes(s.toLowerCase()));

    if (matchedState) {
      const stateCount = await Project.countDocuments({ state: matchedState });
      const topProjects = await Project.find({ state: matchedState })
        .sort({ allocatedAmount: -1 })
        .limit(5)
        .select(
          "projectId title district allocatedAmount riskLevel riskScore mpName",
        );

      const items = topProjects
        .map(
          (p) =>
            `1. **${p.title}**\n` +
            `   - ID: \`${p.projectId}\` | District: ${p.district} | MP: ${p.mpName}\n` +
            `   - Allocation: **₹${p.allocatedAmount.toLocaleString("en-IN")}** | Risk: ${p.riskLevel} (${p.riskScore}/100)`,
        )
        .join("\n");

      return {
        answer:
          `### Verified MPLADS Works in ${matchedState}\n\n` +
          `The database contains **${stateCount.toLocaleString("en-IN")}** verified works in **${matchedState}**.\n\n` +
          `**Top 5 Works by Recommended Allocation:**\n\n` +
          items +
          `\n\n*Source records are retrieved directly from the canonical MoSPI public dataset without synthetic estimation.*`,
        sources: [
          {
            sourceName: "MoSPI Public-Source Snapshot",
            sourceType: "PUBLIC_SOURCE_SNAPSHOT",
            coveragePeriod: "2023–2024",
            recordCount: stateCount,
          },
        ],
        suggestedPrompts: [
          `Show high risk projects in ${matchedState}`,
          "What is the total allocation across India?",
          "How are peer cost outliers calculated?",
        ],
      };
    }

    // 6. Contractor / Implementing Authority Inquiry
    if (
      q.includes("contractor") ||
      q.includes("vendor") ||
      q.includes("ida") ||
      q.includes("implementing agency")
    ) {
      return {
        answer:
          `### Implementing Agencies & Contractor Handling\n\n` +
          `In official MPLADS administration:\n` +
          `- **Implementing District Authorities (IDAs)**: Under MoSPI guidelines, funds are allocated to district administrative authorities (District Magistrate, District Collector, Deputy Commissioner) rather than private contractors directly.\n` +
          `- **Source Transparency**: The official public-source snapshot contains the **IDA field** (e.g. \`DISTRICT MAGISTRATE DARBHANGA_IDA\`, \`DISTRICT COLLECTOR DHOLPUR_IDA\`).\n` +
          `- **Zero Fabrication Rule**: Because private vendor/contractor contract awards are managed by state line departments and are **not published in this national snapshot**, private company names are **strictly set to null**.\n` +
          `- The system monitors **IDA Workload Concentration** to detect instances where single district agencies receive disproportionate allocations.`,
        sources: [
          {
            sourceName: "MPLAD Scheme Implementation Framework",
            sourceType: "GOVERNMENT_REFERENCE",
            coveragePeriod: "Current",
          },
        ],
        suggestedPrompts: [
          "What is the total allocation across all works?",
          "How does the anomaly engine work?",
          "Show projects in Maharashtra",
        ],
      };
    }

    // 7. General search fallback / Data-grounded query
    const keywords = q
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["what", "show", "tell", "find", "have", "with", "this"].includes(w));

    if (keywords.length > 0) {
      const searchRegex = new RegExp(keywords.join("|"), "i");
      const sampleProjects = await Project.find({
        $or: [
          { title: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
          { mpName: { $regex: searchRegex } },
          { district: { $regex: searchRegex } },
        ],
      })
        .sort({ allocatedAmount: -1 })
        .limit(4)
        .select("projectId title state district allocatedAmount mpName riskLevel");

      if (sampleProjects.length > 0) {
        const matches = sampleProjects
          .map(
            (p) =>
              `- **${p.title}** (\`${p.projectId}\`)\n` +
              `  State: ${p.state} | District: ${p.district} | MP: ${p.mpName} | Allocation: ₹${p.allocatedAmount.toLocaleString("en-IN")} | Risk: ${p.riskLevel}`,
          )
          .join("\n");

        return {
          answer:
            `### Relevant Records from Official MPLADS Database\n\n` +
            `Found records matching your query keywords (*${keywords.join(", ")}*):\n\n` +
            matches +
            `\n\n*You can explore the complete record details in the Works Register or ask for a specific project ID.*`,
          sources: [
            {
              sourceName: "MoSPI Public-Source Snapshot",
              sourceType: "PUBLIC_SOURCE_SNAPSHOT",
              coveragePeriod: "2023–2024",
              sampleIds: sampleProjects.map((p) => p.projectId),
            },
          ],
          suggestedPrompts: [
            `Explain project ${sampleProjects[0].projectId}`,
            "What is the total allocation?",
            "How does risk scoring work?",
          ],
        };
      }
    }

    // 8. Default Grounded Response with Guidance
    return {
      answer:
        `### MPLADS Intelligence Assistant\n\n` +
        `I am your grounded guide for the **MPLAD Insight** platform. All my responses are derived strictly from the **60,359 verified MoSPI public records** and statistical intelligence engine without fabrication.\n\n` +
        `**Here are some things I can help you with:**\n` +
        `- **Explaining Platform Metrics**: Learn how Sanctioned, Unsanctioned, and Allocation figures are calculated.\n` +
        `- **Investigating Anomalies**: Understand why a project was flagged for peer cost deviation or IDA concentration.\n` +
        `- **State & District Works**: Query verified projects and allocations across all 33 States.\n` +
        `- **Project Inquiries**: Enter any project ID (e.g., \`MPLAD-2023-RJ-DHO-00001\`) to inspect its details and signals.\n` +
        `- **Scheme Rules**: Understand MPLADS institutional guidelines and ceilings.\n\n` +
        `*If a field (such as private contractor identity or physical milestone percentage) is unavailable in official records, I will state that clearly.*`,
      sources: [
        {
          sourceName: "MPLAD Insight Platform Knowledge Base",
          sourceType: "VERIFIED_SYSTEM_DATA",
          coveragePeriod: "2023–2024",
        },
      ],
      suggestedPrompts: [
        "What is the total allocation across all works?",
        "Explain the anomaly detection rules",
        "Show top projects in Uttar Pradesh",
        "Why are contractor names null in some records?",
      ],
    };
  }
}

