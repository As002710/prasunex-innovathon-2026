# 🎓 CAMPUS-NEXUS — Working MVP Prototype

> **Tagline:** *"Find why a student is failing. Then fix it."*  
> **Team:** Last-Mile Leaders  
> **Competition:** Prasunex Innovathon 2026 Hackathon Prototype  
> **Positioning:** An explainable add-on insight layer for colleges that sits next to Moodle, Canvas, and college ERPs.

---

## 🌐 Live Deployments & Repository Links

- **🌍 Live Deployed Application:** [https://campus-nexus0.netlify.app/](https://campus-nexus0.netlify.app/)
- **💻 GitHub Official Repository:** [https://github.com/vanshikayadav6153-ai/prasunex-innovathon-2026](https://github.com/vanshikayadav6153-ai/prasunex-innovathon-2026)
- **🖥️ Local Web Application:** `http://localhost:3000`

---

## 🚀 Quick Start & Setup

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/vanshikayadav6153-ai/prasunex-innovathon-2026.git
cd prasunex-innovathon-2026/frontend

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
# App starts instantly at http://localhost:3000
```

### 3. Run Production Build & Static Verification
```bash
npm run build
npm start
```

### 4. Run Core Algorithm Unit Tests
Verifies Bayesian Knowledge Tracing, Ticket Priority equation, Point-Biserial discrimination, and Gap-Aware cut-offs:
```bash
npm test
# Executes tests/unit_tests.ts using native TypeScript execution (100% passing)
```

---

## ⏱️ 3-Minute Hackathon Demo Script (Role by Role)

### 🧑‍🎓 Role 1: Student (1 Minute Walkthrough)
1. **Consent Gate:** On first student login, note the non-punitive consent screen stating *"data used only for academic and campus support"*. Click **Accept**.
2. **Mastery Map & DAG:** Click on **Deadlock Detection (28%)** (red). Observe the automated explainable diagnosis:
   > *"Deadlock Detection is red because its prerequisite Semaphores & Mutex is also weak (41%). Practise that first."*
3. **Mastery Trajectory Chart:** Inspect the 5-assessment trajectory line chart. Note Process Management rising (0.70 → 0.86) while Deadlocks falls below the 50% pass line (0.55 → 0.28), triggering the **Early Warning Badge**.
4. **Targeted Practice Set:** Answer the 3-question practice set on Semaphores & Mutex. Notice how Bayesian Knowledge Tracing updates concept mastery live in response to your answers.
5. **Report Issue:** Navigate to **Report Issue & Tickets**. Select *"Lab 2, Bench 14"*, upload a photo (note the automatic face-blurring privacy indicator), and describe a sparking socket. Notice instant duplicate matching that merges with ticket `#TKT-101` and elevates its priority.
6. **Contest Grade:** Click **My Grade & Contest** and file a grade contest request for professor review.

---

### 👩‍🏫 Role 2: Professor (1 Minute Walkthrough)
1. **1-Click Login:** Click **"Login as Professor"** from the top switcher bar or homepage.
2. **Class-Level Mastery Ranking:** In the Mastery Map view, inspect the ranking of concepts by weakness (Semaphores & Mutex: 41%, Deadlocks: 28%) and the cohort of students at risk.
3. **Marks Import:** Click **5-Min Template** to download a CSV template with auto-column matching, or upload an assessment sheet with 0 ≤ mark ≤ max validation.
4. **Grading Sandbox:** Open **Module 2 · Grading Sandbox**. Observe the 100-student distribution (mean: 60.4, SD: 10.6, peak at 55–60).
5. **1-Click Gap-Aware Toggle:**
   - **Fixed Mode:** 15 students are stranded within 1 mark below grade boundaries (C: 44.6, B: 54.1, B+: 60.4, A: 66.8, A+: 73.1, O: 79.4).
   - Click **"⚡ Gap-Aware"**: Cut-offs shift to 45.2, 54.1, 61.1, 67.9, 72.8, 77.5. Stranded students drop from **15 down to 3**, and 2 students are promoted.
6. **Human in Charge Approval:** Click **"Approve & Write to Audit Log"**. Note that no record changes until the professor explicitly approves.
7. **Item Discrimination Audit:** View the scatter plot of $r_{\text{pbis}}$ vs. difficulty. Notice:
   - **Q13 ($r_{\text{pbis}} = -0.24$):** Flagged for negative discrimination (strong students missed it). Click **Nullify Question** or **Give +2 Grace Marks**.
   - **Q14 ($r_{\text{pbis}} = 0.148$):** Flagged for low discrimination ($< 0.15$).

---

### 🛡️ Role 3: Admin / Warden (1 Minute Walkthrough)
1. **1-Click Login:** Click **"Login as Admin / Warden"**.
2. **Priority Radar Queue:** View tickets automatically ranked by the formula:
   $$\text{priority} = \text{base} \times \log_2(1 + \text{reports}) \times (1 + 0.1 \times \text{hours\_open})$$
   Notice that an overdue lab outage (TKT-104: priority ~507.2) significantly outranks a loose chair (TKT-105: priority ~9.6).
3. **SLA Countdown & Auto-Escalation:**
   - Labs have 48-hour SLAs; hostels have 24-hour SLAs.
   - Click **"+24h"** or **"+48h"** on the **Simulate Time** bar.
   - Watch SLA clocks breach live, automatically escalating tickets to the **Head of Department (HoD)**, and over 72 hours escalating directly to the **Dean of Infrastructure**.
4. **Priority vs. Repeats Chart:** Inspect the chart showing how priority curves rise across 1 to 10 repeat reports for New (0h), 24h open, and 48h open tickets.
5. **Audit Trail:** Open **Audit Log** to inspect the immutable historical trail of all approved cut-offs and grade modifications.

---

## 📁 Repository Directory Structure

```text
prasunex-innovathon-2026/
├── frontend/
│   ├── app/
│   │   ├── api/                     # Next.js Serverless Route Handlers
│   │   │   ├── audit/route.ts       # Audit trail & grade contests
│   │   │   ├── auth/route.ts        # Mock session & demo auth
│   │   │   ├── grading/route.ts     # Cohort cutoffs & discrimination
│   │   │   ├── mastery/route.ts     # Concepts DAG & BKT engine
│   │   │   └── tickets/route.ts     # Ticket desk & SLA engine
│   │   ├── globals.css              # Dark maroon/plum + pink/amber glass theme
│   │   ├── layout.tsx               # Root layout & PWA offline SW registration
│   │   ├── manifest.json            # PWA Web Manifest
│   │   └── page.tsx                 # Main application & role router
│   ├── components/
│   │   ├── AboutRoadmapView.tsx     # Phased roadmap & non-invasive architecture
│   │   ├── AuditLogView.tsx         # Immutable audit trail
│   │   ├── GradingSandboxModule.tsx # Module 2: Grading sandbox & IRT
│   │   ├── LandingPageView.tsx      # Public landing page & role selector
│   │   ├── Logo.tsx                 # Graduation cap over CAMPUS-NEXUS text
│   │   ├── MasteryMapModule.tsx     # Module 1: Mastery map & DAG reasoning
│   │   ├── StudentConsentModal.tsx  # Academic-only student consent gate
│   │   └── TicketDeskModule.tsx     # Module 3: Priority equation & SLA clocks
│   ├── data/
│   │   └── seed.ts                  # 100 students, 14 questions, 12 tickets
│   ├── lib/                         # Pure TypeScript Domain Engines
│   │   ├── bkt.ts                   # Bayesian Knowledge Tracing & DAG diagnosis
│   │   ├── gapAware.ts              # Fixed vs. Gap-Aware cut-offs algorithm
│   │   ├── pointBiserial.ts         # Point-biserial discrimination r_pbis
│   │   ├── priority.ts              # Ticket priority equation & SLA evaluator
│   │   ├── repository.ts            # Decoupled Repository Interface + LocalStorage
│   │   ├── similarity.ts            # TF-IDF cosine semantic deduplication
│   │   └── types.ts                 # Strongly-typed domain models
│   ├── public/
│   │   └── sw.js                    # Offline service worker cache
│   ├── tests/
│   │   └── unit_tests.ts            # End-to-end mathematical unit test suite
│   ├── package.json                 # Dependencies & test scripts
│   ├── tailwind.config.ts           # Dark plum, pink, amber, sky, mint colors
│   └── tsconfig.json                # TypeScript compiler options
└── README.md                        # Documentation & judge guide
```

---

## 🗄️ Architecture: How the Repository Interface Maps to PostgreSQL + FastAPI

CAMPUS-NEXUS uses a **Repository Pattern** (`frontend/lib/repository.ts`) with a clean interface:

```typescript
export interface CampusRepository {
  getStudents(): Promise<StudentScore[]>;
  getConcepts(): Promise<ConceptNode[]>;
  getQuestions(): Promise<Question[]>;
  setCutoffs(cutoffs: GradeCutoffs, mode: string, author: string, reason: string): Promise<GradeCutoffs>;
  getTickets(): Promise<Ticket[]>;
  createTicket(params: NewTicketParams): Promise<{ ticket: Ticket; isDuplicate: boolean }>;
  simulateTimeForward(hours: number): Promise<Ticket[]>;
  getAuditLogs(): Promise<AuditLogEntry[]>;
}
```

### Production Mapping:
1. **FastAPI Endpoints:** The methods map 1:1 to FastAPI backend routes:
   - `getStudents()` → `GET /api/v1/courses/{id}/students`
   - `setCutoffs()` → `POST /api/v1/grading/cutoffs`
   - `createTicket()` → `POST /api/v1/facilities/tickets`
2. **PostgreSQL Relational Tables:**
   - `students` & `marks`: Foreign key mapped to `assessments` and `questions`.
   - `concepts` & `concept_edges`: Prerequisite Directed Acyclic Graph (DAG) stored with recursive SQL queries.
   - `tickets` & `ticket_reports`: Many-to-one relationship for semantic duplicates.
   - `audit_logs`: Append-only immutable ledger.
3. **Zero Frontend Code Rewrites:** To switch from this hackathon prototype's client-side `LocalStorageCampusRepository` to PostgreSQL + FastAPI, simply implement `HttpCampusRepository implements CampusRepository` pointing `fetch()` calls to the FastAPI base URL. The UI components remain completely untouched!

---

## 🛡️ Privacy & Reliability Guarantees
- **Offline / PWA Ready:** Registered Service Worker (`/sw.js`) and IndexedDB / LocalStorage state caching enable full functionality during campus Wi-Fi failures.
- **Zero Paid APIs:** All algorithms (BKT, Point-Biserial, TF-IDF Cosine Similarity) run in pure TypeScript with zero reliance on paid external APIs.
- **Human in Charge:** No algorithmic grade curve or question adjustment is ever applied automatically without explicit instructor authorization and audit logging.

---

*Demo uses illustrative synthetic data.*
