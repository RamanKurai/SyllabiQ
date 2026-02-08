# SyllabiQ - Syllabus-Aware AI Learning Assistant

A modern, accessible educational AI chatbot designed for college students to help with syllabus-based learning, exam preparation, notes summarization, and practice question generation.

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
- Error messages with recovery suggestions
- Helper text for all inputs

### 7. Design System
- **Typography**: Inter font family
- **Color Scheme**: 
  - Light theme (primary)
  - Dark mode support
- **Components**: Consistent, reusable design patterns
- **Responsive**: Works on desktop and tablet

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Build Tool**: Vite

## Accessibility Compliance

This application follows WCAG 3.3 AA guidelines:

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

## Mock Data

The application uses mock data for demonstration:
- 8 subjects (Computer Science, Mathematics, Physics, etc.)
- Subject-specific topics
- Simulated AI responses based on exam mode
- Generated practice questions

## Future Enhancements

- Real AI backend integration
- User authentication
- Syllabus upload functionality
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

**Note**: This is a frontend demonstration. In production, connect to a real AI backend (like OpenAI, Anthropic, or custom models) and implement proper authentication and data persistence.
 
## Backend Integration (developer)

To connect the frontend to the SyllabiQ FastAPI backend during development:

1. Create a `.env` file from the example:

```bash
cp .env.example .env
```

2. Update `VITE_API_BASE` in `.env` if your backend runs on a different host/port (default: `http://localhost:8000/api`).

3. Start the backend (from `SyllabiQ-service`):

```bash
uvicorn app.main:app --reload --port 8000
```

4. Start the frontend:

```bash
pnpm install
pnpm dev
```

The chat UI will POST queries to `${VITE_API_BASE}/v1/query`. The frontend reads `VITE_API_BASE` from Vite env variables (defaults to `http://localhost:8000/api`).
