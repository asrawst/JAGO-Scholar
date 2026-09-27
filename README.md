# JAGO Scholar 🎓
> **"One Profile. One Dashboard. Every Scholarship."**  
> *Smart India Hackathon (SIH26238) — Ministry of Tribal Affairs (MoTA), Government of India*

---

## 🏛️ Executive Summary

The **Ministry of Tribal Affairs (MoTA)** administers five primary scholarship schemes for Scheduled Tribe (ST) students:
1. **Pre-Matric Scholarship for ST Students (Class 9 & 10)**
2. **Post-Matric Scholarship for ST Students (Class 11 to PG)**
3. **National Scholarship for Higher Education (Top Class Education)**
4. **National Fellowship for ST Students (NFST - M.Phil/Ph.D)**
5. **National Overseas Scholarship for ST Students (NOS)**

Historically, these schemes were fragmented across multiple portals (NSP, SFMP, NOS Portal, State e-Districts), forcing tribal students to repeatedly re-enter personal, category, and income credentials, resulting in high rejection rates and dropped applications.

**JAGO Scholar** solves this by establishing a **Unified Mobile Digital Scholarship Experience + Smart Integration Layer** powered by the core product principle:
> **"Enter Once → Verify Once → Reuse Everywhere."**

---

## 📱 Core Features & Modules

- **Unified Reusable Student Profile**: Single source of truth across Identity (Aadhaar e-KYC), Category (ST Tribe/PVTG), Academic (APAAR/AISHE/UDISE+), Family Income, and Bank DBT.
- **DigiLocker Document Vault**: 1-click OAuth consent sync for digitally signed caste and income certificates with SHA-256 tamper evidence.
- **Transparent Eligibility Engine**: Real-time rule evaluation that clearly explains *why* a student is eligible or what specific action is pending.
- **1-Click Application Flow**: 8-step streamlined application that automatically pre-populates verified profile data with zero duplicate entry.
- **Context-Aware JAGO AI Chatbot**: A grounded virtual assistant (in English and हिंदी) that knows the applicant's live application status, pending verifications, and DBT payout dates.
- **End-to-End Application Tracking**: Clear vertical timeline from Submission → Institution Verification → Department Verification → Sanction Order → PFMS DBT Direct Credit.
- **Deficiency & Empathetic Exception Flow**: Actionable deficiency resolution that routes data mismatches to human manual review rather than rejecting students outright.
- **Nodal Officer Portal & Audit Trail**: Officer verification queue with side-by-side evidence inspection and tamper-evident audit logs.
- **ST Outreach Discovery Engine**: Cross-matches UDISE+/APAAR student registries to proactively discover and notify non-beneficiary tribal youth.
- **Integration Gateway & Simulator**: Live judge evaluation tool to test API success, data mismatch, timeout, and downtime scenarios for DigiLocker, NSP, and PFMS.

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+`

### Installation
```bash
# 1. Clone or navigate to the project directory
cd "JAGO Scholar"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 3-Minute Hackathon Demo Script for Judges

1. **Launch App**: Open the mobile app. Notice the responsive mobile device shell with status bar and MoTA branding.
2. **Login**: View the pre-filled demo student **Rahul Kumar** (+91 98765 43210) and enter Demo OTP `123456`.
3. **Profile Completion**: Observe the dashboard displaying **82% Profile Completion** with Income Verification pending.
4. **DigiLocker 1-Click Sync**:
   - Tap **"Connect DigiLocker"** on the hero banner or Documents tab.
   - Grant consent → Enter demo OTP `123456` → Tap **"Import & Auto-Verify"**.
   - Watch the profile progress bar advance to **100% Verified ✓**.
5. **Explainable Eligibility**:
   - Tap the **Schemes** tab.
   - Open **Post-Matric Scholarship** to see all green checkmarks (ST Santhal verified, Income ₹1.80L ≤ ₹2.5L limit, B.Tech 2nd Year confirmed).
6. **1-Click Apply**:
   - Tap **"Apply with Verified Profile"**.
   - Notice how all 8 steps auto-populate verified data without asking Rahul to re-type his Aadhaar, caste cert, or bank account.
   - Submit the application.
7. **Live Tracking**:
   - Tap the **Applications** tab to view the live tracking timeline.
8. **Officer Review Workflow**:
   - In the top **Judge Demo Bar**, tap **"Officer Portal"**.
   - Review Rahul's application with side-by-side DigiLocker evidence.
   - Advance through Institution Verification → Department Verification.
9. **Ask JAGO AI Assistant**:
   - Tap the floating **JAGO AI** assistant button.
   - Ask: *"Where is my application?"*
   - See JAGO provide a real-time, grounded response referencing Rahul's exact stage and next steps.
10. **Sanction & DBT Simulation**:
    - In the Judge Demo Bar, tap **"DBT"** (or in Officer Portal, tap Credit DBT).
    - Watch the DBT status update with PFMS transaction ID and bank credit confirmation.

---

## 🔒 Security & Privacy Architecture

- **Aadhaar Protection**: Full Aadhaar numbers are never stored in plain text; only masked tokens (`XXXX-XXXX-8921`) and cryptographic hashes are used.
- **Role-Based Access Control (RBAC)**: Strict separation of privileges between Students, College Nodal Officers, and Ministry Administrators.
- **Audit Logging**: Every state transition and approval action creates an immutable log with actor ID, timestamp, and IP address.
- **Simulated Integration Disclaimer**: All government API connectors in this prototype are clearly simulated with mock adapters unless connected to production endpoints.

---

## 📂 Project Structure

```
JAGO Scholar/
├── public/
│   └── emblem.svg               # Government emblem icon
├── src/
│   ├── types/index.ts           # Data models & contracts
│   ├── mock/initialData.ts      # Demo data (Rahul Kumar, 5 Schemes, DigiLocker docs)
│   ├── services/
│   │   ├── eligibilityEngine.ts # Rule-based explainable eligibility evaluator
│   │   ├── jagoAiService.ts     # Context-aware AI chatbot engine
│   │   ├── integrationGateway.ts# Simulated government API gateway & error injector
│   │   └── auditService.ts      # Immutable event logging service
│   ├── context/
│   │   └── AppContext.tsx       # Central React state store
│   ├── components/
│   │   ├── common/              # MobileShell, TopHeader, BottomNav, JudgeDemoBar, Toast
│   │   ├── auth/                # OnboardingModal, MobileAuthModal
│   │   ├── home/                # HomeDashboard
│   │   ├── scholarships/        # ScholarshipDiscovery, SchemeDetailModal
│   │   ├── application/         # ApplicationTracker, ApplicationWizard
│   │   ├── documents/           # DocumentWallet, DigiLockerConsentModal
│   │   ├── profile/             # StudentProfileView (Verification Center)
│   │   ├── chat/                # JagoChatDrawer (Voice/Text AI)
│   │   ├── notifications/       # NotificationDrawer
│   │   └── admin/               # OfficerReviewDrawer, IntegrationSimulator, OutreachDemo, AuditLog
│   ├── database/
│   │   └── schema.sql           # PostgreSQL/Supabase production relational DDL
│   ├── App.tsx                  # Main App Coordinator
│   ├── main.tsx                 # App Entry
│   └── index.css                # Tailwind CSS with safe-area variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

---

*Developed for the Smart India Hackathon (SIH26238) — Ministry of Tribal Affairs (MoTA).*
