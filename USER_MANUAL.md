# Responsible AI Global University Ranking (RAI)

A human-friendly user manual covering setup, roles, and day‑to‑day usage for the RAI website. This manual also includes quick developer notes for installing and testing the app locally.

Version: 0.1.0  
Project Type: Next.js full‑stack app with optional backend split, Supabase, and Gemini AI integration

---

## 1. What This App Does
RAI is a university ranking platform that blends quantitative metrics with bounded, responsible AI–generated insights. Admins can review submissions, trigger AI analysis, and publish updated, transparent ranking tables. The public can browse, search, and compare universities and read the methodology.

Key highlights:
- Public rankings with filters and detail pages
- Admin dashboard for submissions, user roles, AI analysis, and score processing
- Transparent methodology and responsible AI guardrails

---

## 2. Roles and Access

### Public User
- Browse the landing page and the rankings table
- Filter and search universities
- Open a university detail page
- Read the methodology page

### Admin
- Sign in securely (email/password or configured method)
- Manage users and assign roles
- Review university submissions (accept or reject)
- Run AI analysis (Gemini) to enrich qualitative insights
- Process scores and publish new ranking snapshots

---

## 3. Getting Started (Local)

### 3.1 Requirements
- Node.js 20 LTS recommended
- npm 10+
- A Supabase project (URL + keys)
- A Gemini API key

### 3.2 Clone and install
Use Windows PowerShell (v5.1 or later):

```powershell
# Navigate to your project directory
Set-Location "E:\Main Room\ITworkerwannabe\computerengineer\Sem 5\rpl\project_RPL\RAI-website"

# Install dependencies using the lockfile
npm ci
```

If you don’t have a lockfile, use:

```powershell
npm install
```

### 3.3 Configure environment variables
Create a file named `.env.local` at the project root and add:

```bash
# Public client keys (browser use)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server keys (server-only use)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini (AI)
GEMINI_API_KEY=your_gemini_api_key
```

Notes:
- Public keys are safe to expose in the browser (still protect them in practice). Service role keys must remain server-only.
- The app logs a helpful check when it can read Supabase envs in development.

### 3.4 Run the app

```powershell
# Development server (default port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

### 3.5 Optional: Split backend mode
The repository includes `backend/` (a Next.js app) for optional separation.

```powershell
# In a new terminal
Set-Location "E:\Main Room\ITworkerwannabe\computerengineer\Sem 5\rpl\project_RPL\RAI-website\backend"
npm ci
npm run dev  # runs on port 3001 by default
```

In most cases you can use the single app at the root. The split mode is useful if you want to evolve a separate API boundary.

---

## 4. Main Screens and Navigation

### 4.1 Public site
- Landing page: overview and entry to rankings
- Rankings page: interactive table with sorting, filters, and links to details
- University detail: specific university profile with metrics and AI insights
- Methodology: how scores are calculated and how AI contributes

Components you’ll see: `NavBar`, `RankingTable`, `FilterBar`, `ScoreBadge`, `Footer`.

### 4.2 Admin dashboard
- User Management: view users and update roles
- University Submissions: review incoming data; accept or reject
- AI Analysis: run Gemini analysis for selected universities
- Process Scores: aggregate quantitative metrics + AI insights into final rankings
- Manage Rankings: publish and review ranking snapshots

Guards: `AuthGuard` (signed-in), `AdminGuard` (admin-only) ensure features appear only where permitted.

---

## 5. Typical Workflows

### 5.1 Public user
1. Visit the home page and open Rankings
2. Use filters/search to narrow results
3. Click a university to view details
4. Read methodology to understand how scores are formed

### 5.2 Admin
1. Sign in at `/login`
2. Open Admin dashboard
3. Review Submissions and accept/reject as needed
4. Open AI Analysis, select a university, and run analysis
5. Run Process Scores to generate updated rankings
6. Confirm changes in Rankings and publish
7. Update user roles if needed in User Management

---

## 6. Authentication
- API route: `/api/auth/login` for signing in
- Frontend page: `/login`
- The app stores session/role through `AuthContext` and `useAuth`
- Admin features are protected on both client (guards) and server (API checks)

---

## 7. Data and AI

### 7.1 Data storage (Supabase)
- Tables typically include: users, roles, submissions, scores, ranking snapshots, and university details
- PostgreSQL provides strong relational integrity and flexible querying
- Consider Row-Level Security (RLS) for fine-grained access controls

### 7.2 AI analysis (Gemini)
- Module: `src/lib/geminiAI.ts`
- Admin-only analysis converts a prompt + metrics into qualitative insights
- Outputs are normalized and capped in influence during score processing
- If AI is unavailable or returns invalid output, the app falls back to a deterministic path

---

## 8. Testing
This repo includes ready-to-run tests.

Run tests:

```powershell
npm test
```

Useful scripts:

```powershell
npm run test:watch
npm run test:coverage
```

Tests live in `__tests__/` (API routes, components, pages, and helpers). See `TESTING_SETUP.md` and `TESTING_COMPLETE.md` for additional guidance.

---

## 9. Admin Features in Detail

### 9.1 User Management
- List users and update role assignments
- Server route example: `PUT /api/admin/users/[id]/role` expects `{ role: "admin" | "user" | ... }`

### 9.2 Submissions
- Ingest candidate universities or data updates
- Approve or reject submissions to keep the dataset clean

### 9.3 AI Analysis
- Select a university and trigger analysis
- Review generated insights and confirm suitability

### 9.4 Process Scores
- Combine numeric metrics with normalized AI factors
- Persist a new ranking snapshot for reproducibility

### 9.5 Manage Rankings
- Review the final ordered list before publishing
- Compare recent snapshots if needed

---

## 10. Responsible AI and Guardrails
- AI outputs are supplemental and bounded; they cannot dominate final scores
- Prompts are structured to avoid subjective exaggeration
- Only Admins can trigger AI analysis
- If AI output is empty or malformed, the system falls back to deterministic scoring
- The Methodology page explains how AI contributes to the final score
- Future guardrails may include bias audits, anomaly detection, logging for audits, and moderator overrides

---

## 11. Troubleshooting

### Missing Supabase env vars
Symptom: console warns about missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Fix: set values in `.env.local` and restart `npm run dev`.

### Gemini errors
Symptom: `Gemini API key is not configured` or 5xx responses.
Fix: ensure `GEMINI_API_KEY` is set and valid; check network and retry.

### Dependency or lockfile issues
If you pulled updates and have conflicts with `package-lock.json`, prefer taking the remote lockfile and run:

```powershell
npm ci
```

### Port conflicts
If port 3000 is used, set `PORT=3002` before running `npm run dev` (or stop other processes).

### Authentication issues
If Admin features don’t appear, ensure your user has an admin role and you’re logged in. Re-login if your role changed recently.

---

## 12. Project Structure (Quick Map)
- Root Next.js app: `src/app` (pages, API routes)
- Admin UI components: `src/components/admin`
- Auth and guards: `src/context/AuthContext.tsx`, `src/components/auth`
- Libraries and services: `src/lib` (Supabase, AI, mappers, utils)
- Optional split backend: `backend/`
- Database notes: `database/`
- Tests: `__tests__/`

---

## 13. Glossary
- Ranking snapshot: a persisted, immutable set of scores used for public display
- Qualitative factor: normalized AI output that enriches, not replaces, quantitative metrics
- RBAC: Role-Based Access Control (e.g., Admin vs Public)

---

## 14. Support
- For environment setup and deployment, see: `SUPABASE_IMPLEMENTATION.md` and `AI_ANALYSIS_SETUP.md`
- For admin workflows and submission details, see: `SUBMISSION_FLOW.md`
- For testing setup and examples, see: `TESTING_SETUP.md` and `TESTING_COMPLETE.md`

If you need help or want this manual tailored to your deployment (e.g., Vercel or custom domains), let us know.
