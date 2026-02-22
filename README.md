# SyllabiQ - Frontend
**Syllabus-Aware AI Learning Assistant (React + TypeScript)**

A modern, accessible educational AI chatbot designed for college students to help with syllabus-based learning, exam preparation, notes summarization, and practice question generation.

> 📌 **This is the frontend repository.** For the backend service, see [SyllabiQ-Service](../SyllabiQ-Service/README.md).

## Features

### 1. Landing Page
- Engaging hero section with clear value proposition
- Feature highlights
- "How it Works" section
- Call-to-action buttons

### 2. Main Chat Interface
- Real-time AI conversation
- Syllabus-aware Q&A
- Exam-oriented explanations (2-mark, 5-mark, 10-mark)
- Quick action buttons for common tasks
- Empty state with helpful suggestions

### 3. Sidebar Navigation
- Subject and topic selection
- Exam mode toggle (answer length preference)
- Query history with timestamps
- Collapsible sections for better space management

### 4. Notes Summarization
- Large text input area for pasting notes
- AI-powered bullet-point summaries
- Character counter
- Clear error handling and guidance

### 5. Practice Question Generator
- Configurable question settings:
  - Topic selection
  - Difficulty levels (Easy, Medium, Hard)
  - Question types (MCQ, Short Answer, Long Answer)
  - Number of questions (1-20)
- Formatted output with show/hide answers
- Multiple choice options for MCQs

### 6. Accessibility Features (WCAG AA Compliant)
- Text contrast ratio ≥ 4.5:1 for all text
- Clear visual hierarchy
- Icons paired with descriptive text
- Proper ARIA labels and roles
- Keyboard navigation support
- Visible focus states (4px focus rings)
- Screen reader friendly

### 7. Design System
- **Typography**: Inter font family
- **Color Scheme**: Light theme (primary) with Dark mode support
- **Components**: Consistent, reusable design patterns
- **Responsive**: Works on desktop and tablet

---

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend**: FastAPI (Python)
- **Environment**: `uv` (Next-gen Python manager)

---

## Accessibility Compliance

This application follows WCAG 2.1 AA guidelines:

✓ Color contrast ratios meet minimum requirements  
✓ Keyboard navigation fully supported  
✓ Focus indicators are clearly visible  
✓ All form inputs have associated labels  
✓ Error messages provide actionable guidance  
✓ Icon-only buttons have aria-labels  
✓ Loading states announced to screen readers  
✓ Semantic HTML structure  
✓ Proper heading hierarchy  

## User Experience

### Target Audience
College and university students (18-25 years old)

### Design Philosophy
- **Minimal**: Clean, distraction-free interface
- **Academic**: Professional and trustworthy aesthetic
- **Focused**: Calm learning environment
- **Modern**: Contemporary AI product design

### Key UX Features
- Friendly, academic AI tone
- Loading indicators with descriptive text
- Clear error handling with recovery paths
- Contextual helper text
- Progressive disclosure (collapsible sections)
- Persistent navigation
- State preservation

## Admin Dashboard

- **Departments:** Create and manage departments (e.g., Computer Science, Finance) per institution
- **Courses:** Manage courses with department assignment (BCA, BBA, BTech)
- **Subjects, Syllabi, Topics:** Full content hierarchy management
- **Topic content upload:** Upload PDF, CSV, or DOCX files per topic for RAG indexing

## Backend Integration

The application connects to the SyllabiQ FastAPI backend:
- **Auth:** Signup with institution + department selection; login returns JWT
- **RAG:** Chat queries use syllabus/topic content indexed from uploaded files
- **Content:** Admin manages departments, courses, subjects, syllabi, topics, and topic file uploads

## Future Enhancements

- PDF export for summaries and practice questions
- Progress tracking
- Personalized learning recommendations
- Study schedule planner
- Collaborative study groups

## Design Decisions

### Why Inter Font?
Inter is highly readable at small sizes, has excellent character distinction, and is optimized for digital interfaces.

### Why These Color Choices?
- Blue: Trust, knowledge, professionalism
- High contrast: Ensures readability for all users
- Muted palette: Reduces eye strain during long study sessions

### Why Mock Responses?
Provides immediate feedback without backend dependencies, allowing users to understand the UX flow.

## Accessibility Statement

SyllabiQ is committed to providing an accessible learning experience for all students. If you encounter any accessibility barriers, please let us know.

---

**Note**: The frontend connects to the SyllabiQ FastAPI backend for auth, RAG-based Q&A, and content management. Set `OPENAI_API_KEY` in the backend `.env` for full RAG support.

---

## Backend Integration (Developer)

To connect the frontend to the SyllabiQ FastAPI backend during development, follow these steps. 

### Why we use `uv`
Standard `pip` often struggles with "Resolution Conflicts" or tries to compile heavy libraries (like `onnxruntime` or `chromadb`) from source, which can take hours. `uv` is written in Rust and handles these dependencies in seconds. It also ensures the correct Python version is used, avoiding "ABI Compatibility" errors found in experimental versions like Python 3.14.



### 1. Environment Setup
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Note: Ensure VITE_API_BASE matches your backend URL (default: http://localhost:8000/api).

### 2. Install Dependencies
Choose the method that fits your workflow. Method A is highly recommended.

#### Method A: The uv Method (Fastest)
This avoids "Command not found" issues and handles dependency conflicts automatically.

```bash 
# 1. Create a virtual environment using a stable Python version (e.g., 3.12)
uv venv --python 3.12

# 2. Activate the environment
source .venv/bin/activate

# 3. Install dependencies
uv pip install -r requirements.txt

```bash 
# 3. Install dependencies
uv pip install -r requirements.txt
```

#### Method B: The Standard pip Method
```bash 
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Start the Backend Server
From the `SyllabiQ-Service` directory, use:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

### 4. Configure Frontend Environment
Create a `.env.local` file in the `SyllabiQ` directory:

```bash
VITE_API_BASE=http://localhost:8000/api
```

### 5. Install Frontend Dependencies & Run
```bash 
# Using pnpm (recommended)
pnpm install
pnpm dev

# Or using yarn
yarn install
yarn dev

# Or using npm
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and will POST queries to `${VITE_API_BASE}/v1/query`.

---

## 🔗 Integration with Backend

The frontend communicates with the [SyllabiQ Backend Service](../SyllabiQ-Service/README.md) via REST API:

- **Chat queries** → `POST /v1/query`
- **Notes summarization** → `POST /v1/summarize`
- **Practice questions** → `POST /v1/generate-questions`
- **User authentication** → `POST /auth/login`

For backend architecture details, see the [Backend README](../SyllabiQ-Service/README.md#-core-system-components).

---

## ♿ Accessibility Statement
SyllabiQ is committed to providing an accessible learning experience. This application follows **WCAG 2.1 AA guidelines**, ensuring:
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- Screen reader compatibility  
- Semantic HTML structure
- Clear focus indicators
- ARIA labels and roles

---

## 📦 Project Structure

```
SyllabiQ/
├── src/
│   ├── main.tsx                       # Vite entry point
│   ├── styles/                        # Global CSS
│   │   ├── index.css
│   │   ├── theme.css
│   │   ├── fonts.css
│   │   └── tailwind.css
│   ├── types/                         # TypeScript type definitions
│   │   └── custom.d.ts
│   ├── lib/                           # Shared utilities
│   │   ├── api.ts                     # API client & queries
│   │   └── auth.ts                    # Authentication helpers
│   └── app/
│       ├── App.tsx                    # Root component
│       ├── design/
│       │   └── brand.ts               # Design tokens & color palette
│       ├── context/
│       │   ├── AuthContext.tsx        # User authentication state
│       │   └── DashboardContext.tsx   # Dashboard state management
│       ├── hooks/
│       │   ├── useApi.ts              # API request hook
│       │   └── useTheme.ts            # Theme management hook
│       ├── lib/
│       │   └── toast.ts               # Toast notification utilities
│       └── components/
│           ├── ChatInterface.tsx      # Main chat component
│           ├── ChatSidebar.tsx        # Chat history sidebar
│           ├── Header.tsx             # Top navigation header
│           ├── LandingPage.tsx        # Hero landing page
│           ├── NotesSummarizer.tsx    # Notes summarization UI
│           ├── PracticeGenerator.tsx  # Practice questions UI
│           ├── Sidebar.tsx            # Main app sidebar (subjects/topics)
│           ├── ThemeToggle.tsx        # Dark/light mode toggle
│           ├── Admin/                 # Admin panel components
│           │   ├── AdminLayout.tsx
│           │   ├── AdminDashboard.tsx
│           │   ├── AdminUsers.tsx
│           │   ├── AdminRoles.tsx
│           │   ├── AdminInstitutions.tsx
│           │   ├── AdminKpis.tsx
│           │   └── AdminContentManager.tsx
│           ├── Auth/                  # Authentication components
│           ├── atoms/                 # Atomic design: Base components
│           │   ├── Brand.tsx
│           │   ├── Logo.tsx
│           │   ├── KpiCard.tsx
│           │   ├── SectionHeader.tsx
│           │   └── index.tsx
│           ├── molecules/             # Atomic design: Composite components
│           │   └── AuthCard.tsx
│           ├── organisms/             # Atomic design: Complex components
│           │   └── ProtectedRoute.tsx
│           ├── pages/                 # Full page layouts
│           │   ├── Dashboard.tsx
│           │   ├── LoginPage.tsx
│           │   └── SignupPage.tsx
│           ├── templates/             # Page templates
│           │   ├── AuthTemplate.tsx
│           │   └── FullscreenAuthTemplate.tsx
│           ├── figma/                 # Figma design integrations
│           └── ui/                    # ShadCN UI components
│               ├── button.tsx
│               ├── card.tsx
│               ├── input.tsx
│               ├── dialog.tsx
│               ├── sidebar.tsx
│               └── ... (40+ UI components)
├── index.html                 # HTML entry template
├── vite.config.ts             # Vite bundler config
├── tailwind.config.cjs        # Tailwind CSS config
├── postcss.config.mjs         # PostCSS config
├── package.json               # Dependencies & scripts
└── .env.example               # Environment template
```

---

## 🏗️ Component Architecture

### Atomic Design Pattern
The frontend uses a scalable atomic design structure:
- **Atoms** (`atoms/`) - Base building blocks (Button, Badge, etc.)
- **Molecules** (`molecules/`) - Combinations of atoms (AuthCard, etc.)
- **Organisms** (`organisms/`) - Complex component groups (ProtectedRoute, etc.)
- **Pages** (`pages/`) - Full-page layouts (Dashboard, LoginPage, etc.)
- **Templates** (`templates/`) - Page wrappers (AuthTemplate, etc.)

### Feature Components
- **ChatInterface** - Main chat UI with message history
- **ChatSidebar** - Query history and subject selection
- **NotesSummarizer** - Notes upload and summarization UI
- **PracticeGenerator** - Question generation with difficulty controls
- **Admin/** - Admin dashboard and management interfaces
- **Auth/** - Authentication & authorization components

### UI Components
ShadCN/UI library provides 40+ pre-built, accessible components in `ui/`.

---

## 🎯 Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/lib/` | Shared utilities (API client, auth helpers) |
| `src/app/lib/` | App-specific utilities (toast notifications) |
| `src/app/context/` | React Context for global state (Auth, Dashboard) |
| `src/app/hooks/` | Custom React hooks (useApi, useTheme) |
| `src/app/design/` | Design tokens and branding |
| `src/app/components/` | All React components |
| `src/styles/` | Global CSS, theme, typography |
| `src/types/` | TypeScript interfaces |

---

## 🚀 Development Tips

- **Hot Reload**: Vite provides fast refresh on file changes
- **API Debugging**: Check browser DevTools Network tab for API calls
- **Theme Toggling**: Use the ThemeToggle component to test dark/light modes
- **Component Testing**: Install and use React DevTools browser extension

---

## 📚 Related Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Schema](../SyllabiQ-Service/docs/API.md)
- [ER Diagram](docs/ER_DIAGRAM.mmd)
- [Sequence Diagrams](docs/SEQUENCE_DIAGRAMS.mmd)
