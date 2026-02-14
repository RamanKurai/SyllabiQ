# SyllabiQ (frontend) — Architecture Overview

High-level overview of the frontend app.

- **Stack:** Vite + React + TypeScript
- **API client:** `src/lib/api.ts` (typed helpers: `postQuery`, `streamQuery`, `getSubjects`, `getTopics`). The client reads `VITE_API_BASE` and prefixes routes with `/api` so runtime calls go to `/api/v1/...`.
- **Main UI pieces:**
  - `App.tsx` / `LandingPage.tsx` — top-level routing and UX
  - `ChatInterface.tsx`, `ChatSidebar.tsx` — conversational UI
  - `NotesSummarizer.tsx`, `PracticeGenerator.tsx` — domain feature UIs
  - `Sidebar.tsx`, `Header.tsx`, `ThemeToggle.tsx` — layout and utilities
- **Auth:** Login returns JWT (access_token + roles). Token is stored in localStorage by `src/lib/auth.ts` and attached as `Authorization: Bearer <token>` for protected requests.
- **Streaming:** `streamQuery` attempts to consume SSE/chunked responses but the backend currently returns JSON; the client gracefully falls back to the full JSON payload.
- **Integration:** connects to backend `/api/v1/query` and other subject/topic endpoints.

See `ER_DIAGRAM.mmd` and `SEQUENCE_DIAGRAMS.mmd` for component and flow diagrams. For a **full architecture diagram** including all layers (Presentation, API, Business, Data, Persistence), see `../../docs/ARCHITECTURE_DIAGRAM.mmd`. For implementation details, see `src/lib/api.ts` and `src/lib/auth.ts`.
