# LegalInsightAI — System Report

Last updated: 2026-06-24

## Purpose

LegalInsightAI is an internal/legal-tech assistant platform that performs automated analysis of legal documents, surfaces compliance and risk findings, and provides a web-based dashboard for teams to manage documents, run analyses, and review results.

Primary use cases:
- Upload and store legal documents (PDF, DOCX, TXT).
- Run automated analysis to detect risk items and compliance issues.
- Provide an analytics dashboard showing trends, distributions, and top issues.
- Store and retrieve analysis results and generate reports.

## High-level architecture

- Frontend: Next.js + React + Tailwind CSS. Provides UI pages such as `dashboard`, `documents`, `team`, auth flows, and an analytics component.
- Backend: Python Flask/FastAPI app (backend/app) exposing REST endpoints for auth, document upload, analysis, reports, and health checks.
- Database/persistence: lightweight SQLite in `backend/` for development (`legal_assistant.db`) and Chroma for vector storage (`chroma_db/chroma.sqlite3`).
- RAG and parsing utilities: `backend/app/rag` contains document parsing and retrieval-augmented generation helpers.

## Key repositories and folders

- `frontend/` — Next.js app (UI). Important files:
  - `src/pages/dashboard.tsx` — main dashboard page.
  - `src/components/AnalyticsDashboard.tsx` — analytics visuals.
  - `src/utils/api.ts` — client for backend API.
  - `src/utils/store.ts` — simple Zustand store for auth and documents.
- `backend/` — Python backend. Important folders:
  - `app/routes/` — HTTP endpoints.
  - `app/services/` — business logic (document_service, report_service, email_service).
  - `app/agents/` — higher-level agents for workflows and analyses.
  - `chroma_db/` — Chroma vector DB file for local development.

## How the pieces interact

- The frontend authenticates users and calls `NEXT_PUBLIC_API_URL` endpoints via `apiClient` (`frontend/src/utils/api.ts`).
- Documents are uploaded to the backend which persists metadata to the DB and stores vectors in Chroma.
- Analysis jobs are triggered via REST endpoints (e.g., `/analysis/analyze/{docId}`), with results stored and exposed via `/documents/{id}/analysis`.
- The dashboard consumes the documents list and transforms it into analytics metrics shown by `AnalyticsDashboard`.

## Running locally (development)

1. Start the backend (Python). From repo root:
```powershell
cd backend
pip install -r requirements_minimal.txt
python run.py
```

2. Start the frontend (Next.js). From repo root:
```powershell
cd frontend
npm install
npm run dev
```

3. Open the app at: http://localhost:3000 (default)

Environment variables
- `NEXT_PUBLIC_API_URL` — base URL for backend API (e.g., `http://localhost:8000`).
- Backend may require additional secrets (check `backend/app/config.py` for expected env vars).

## Endpoints of interest (backend)
- `POST /auth/login` — authenticate user.
- `GET /documents/` — list documents and metadata.
- `POST /documents/upload` — upload document file.
- `GET /documents/{id}/analysis` — retrieve analysis results.
- `POST /analysis/analyze/{docId}` — trigger analysis run.
- `POST /reports/generate/{docId}` — create a downloadable report.

## Notable implementation details
- Frontend uses `recharts` for charts and `tailwindcss` for styling.
- State: `zustand` holds auth and document state for simple persistence.
- Accessibility: dashboard and analytics components include ARIA roles and focus styles.
- Fallback behavior: frontend will surface fallback/mock data when the API is unreachable to keep the UI functional for demos.

## Testing and verification
- Use the dev server to visually verify pages (http://localhost:3000).
- Backend unit tests (if present) are under `backend/tests/` — run via pytest.

## Deployment notes
- There are Dockerfiles in the repo for backend/frontend and a `docker-compose.yml` enabling containerized local deployment. Ensure sensitive env vars are provided securely in production.

## Security and privacy considerations
- Documents may contain sensitive information — treat storage and logs accordingly.
- Use HTTPS and secure token storage for production. Rotate and protect API keys and tokens.

## Next recommended improvements
- Add end-to-end tests (Cypress/Playwright) for the main flows: auth, upload, analyze, view report.
- Improve background job processing for long-running analyses (queue worker + task status endpoints).
- Add role-based access control checks and audit logging for sensitive operations.
- Improve CI pipeline to run linting, type-checking, and tests before merging.

## Contact / Maintainers
- Primary developer: `priyanshu051sharma-blip` (repo owner). Check GitHub issues and PRs for project history.

---
This document was generated and added to the repository by an automated assistant to summarize system purpose, architecture, run instructions, and next steps.
