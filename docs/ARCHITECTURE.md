# SyllabiQ (frontend) — Architecture Overview

High-level overview of the frontend app.

- **Stack:** Vite + React + TypeScript
- **API client:** `src/lib/api.ts` (typed helpers: `postQuery`, `streamQuery`, `getSubjects`, `getTopics`)
- **Main UI pieces:**
  - `App.tsx` / `LandingPage.tsx` — top-level routing and UX
  - `ChatInterface.tsx`, `ChatSidebar.tsx` — conversational UI
  - `NotesSummarizer.tsx`, `PracticeGenerator.tsx` — domain feature UIs
  - `Sidebar.tsx`, `Header.tsx`, `ThemeToggle.tsx` — layout and utilities
- **Integration:** connects to backend `/api/v1/query` and other subject/topic endpoints.

See `ER_DIAGRAM.mmd` and `SEQUENCE_DIAGRAMS.mmd` for component and flow diagrams.
