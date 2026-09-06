# Official MPLADS Data Sources & Provenance Specification

## 1. Primary Dataset Profile

| Attribute | Specification |
| --------- | ------------- |
| **Dataset Title** | India MPLADS Works Implementation Dataset Snapshot |
| **Official Publisher** | Ministry of Statistics & Programme Implementation (MoSPI) / MPLADS Portal |
| **Public Snapshot Repository** | [https://github.com/Vonter/india-mplads-works](https://github.com/Vonter/india-mplads-works) |
| **Official Portal URL** | [https://mplads.gov.in/](https://mplads.gov.in/) |
| **Coverage Period** | **26 April 2023 – 04 March 2024** |
| **File Format** | CSV (Semicolon-delimited, UTF-8) |
| **File Location** | `apps/api/data/official/mplads/MPLADS.csv` |
| **File Size** | 15,796,263 bytes (15.8 MB) |
| **Total Record Count** | **60,359 rows** (plus header row) |
| **Cumulative Allocation Value** | **₹34,982,467,506** (₹3,498.25 Crore) |

---

## 2. Source Column Dictionary & Canonical Mapping

| Original Header | Sample Value | Canonical Field | Classification | Notes |
| --------------- | ------------ | --------------- | -------------- | ----- |
| `MP NAME` | `Manoj Rajoria` | `mpName` | `SOURCE` | Recommending Member of Parliament |
| `WORK` | `NA - Street lights` | `title` | `SOURCE` | Description of developmental work |
| `CATEGORY` | `Normal/Others` | `category` | `DERIVED` | Normalized into standard sectors |
| `STATE` | `Rajasthan` | `state` | `SOURCE` | 33 States and Union Territories |
| `CONSTITUENCY` | `KARAULI-DHOLPUR(SC)` | `constituency` | `SOURCE` | Parliamentary constituency |
| `IDA` | `DISTRICT COLLECTOR DHOLPUR_IDA`| `ida` / `implementingAgency` | `SOURCE` | Implementing District Authority |
| `CITY` | *(Blank or City Name)* | `city` | `SOURCE` | Sub-district locality attribute |
| `WARD` | *(Blank or Ward No.)* | `ward` | `SOURCE` | Municipal ward |
| `BLOCK` | `Rajakhera` | `block` | `SOURCE` | Development block |
| `VILLAGE` | `Nadauli` | `village` | `SOURCE` | Gram Panchayat / Village |
| `RECOMMENDED DATE` | `2024-03-04` | `recommendedDate` | `SOURCE` | Date MP submitted recommendation |
| `ALLOCATION AMOUNT`| `100000` | `allocatedAmount` | `SOURCE` | Recommended work cost in INR |
| `IDA APPROVAL` | `Action Pending` | `idaApproval` | `SOURCE` | Feasibility / Approval status |
| `STATUS` | `Unsanctioned` | `rawStatus` / `status` | `SOURCE` | Implementation pipeline stage |
| `HOUSE` | `Lok Sabha` | `house` | `SOURCE` | Parliamentary House (Lok Sabha / Rajya Sabha) |

---

## 3. Coverage Summary by House & Status

### House Breakdown
- **Lok Sabha**: 46,348 works (76.8%)
- **Rajya Sabha**: 14,011 works (23.2%)

### Status Breakdown
- **Unsanctioned**: 50,888 works (84.3%)
- **Sanctioned**: 6,528 works (10.8%)
- **Completed**: 1,503 works (2.5%)
- **Ongoing**: 629 works (1.0%)
- **Unspecified / Blank**: 811 works (1.3%)

---

## 4. Known Source Limitations & Data Handling Rules
1. **Private Contractor Names**: The official portal tracks District Authorities (IDAs). Private contractor awards are managed under state line departments. Private contractor fields are strictly recorded as `null`.
2. **Physical Milestone Progress**: Physical completion percentage is not captured in this national recommendation feed and is kept as `null`.
3. **Sub-district Details**: Approximately 38% of works omit specific block or village details in the raw snapshot, flagged by the Data Quality engine as a metadata completeness observation.
