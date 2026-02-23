import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AppHeader } from './components/organisms/AppHeader';
import { StudentSidebar } from './components/organisms/StudentSidebar';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from './components/ui/sidebar';
import { ChatInterface } from './components/ChatInterface';
import { NotesSummarizer } from './components/NotesSummarizer';
import { PracticeGenerator } from './components/PracticeGenerator';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import {
  AdminProtectedRoute,
  StudentProtectedRoute,
} from "./components/organisms/ProtectedRoute";
import DashboardPage from "./components/pages/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminKpis from "./components/Admin/AdminKpis";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminInstitutions from "./components/Admin/AdminInstitutions";
import AdminRoles from "./components/Admin/AdminRoles";
import AdminContentManager from "./components/Admin/AdminContentManager";
import AdminLoginPage from "./components/pages/AdminLoginPage";

// Mock data for demonstration
const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'History',
  'Economics',
];

const TOPICS: Record<string, string[]> = {
  'Computer Science': [
    'Data Structures',
    'Algorithms',
    'Operating Systems',
    'Database Management',
    'Computer Networks',
    'Software Engineering',
  ],
  'Mathematics': [
    'Calculus',
    'Linear Algebra',
    'Differential Equations',
    'Probability & Statistics',
    'Discrete Mathematics',
  ],
  'Physics': [
    'Mechanics',
    'Thermodynamics',
    'Electromagnetism',
    'Quantum Physics',
    'Optics',
  ],
  'Chemistry': [
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Physical Chemistry',
    'Analytical Chemistry',
  ],
  'Biology': [
    'Cell Biology',
    'Genetics',
    'Evolution',
    'Ecology',
    'Human Physiology',
  ],
  'English Literature': [
    'Shakespeare',
    'Modern Poetry',
    'Victorian Literature',
    'American Literature',
  ],
  'History': [
    'Ancient Civilizations',
    'Medieval History',
    'Modern History',
    'World Wars',
  ],
  'Economics': [
    'Microeconomics',
    'Macroeconomics',
    'International Trade',
    'Development Economics',
  ],
};

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [examMode, setExamMode] = useState<'2-mark' | '5-mark' | '10-mark'>('5-mark');
  const [history, setHistory] = useState<Array<{ id: string; query: string; timestamp: Date }>>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fullscreenPaths = ["/login", "/signup", "/admin", "/dashboard"];
  const isFullscreenRoute = fullscreenPaths.some((p) => location.pathname.startsWith(p));

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(''); // Reset topic when subject changes
  };

  const handleHistoryItemClick = (query: string) => {
    // In a real app, this would load the previous conversation
    console.log('Loading query:', query);
  };

  const addToHistory = (query: string) => {
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9), // Keep only last 10 items
    ]);
  };

  // Main app with sidebar
  const topics = selectedSubject ? TOPICS[selectedSubject] || [] : [];

  if (isFullscreenRoute) {
    // Fullscreen pages (auth + dashboard) — render without global header/sidebar
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}>
            <Route index element={<AdminKpis />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="institutions" element={<AdminInstitutions />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="content" element={<Outlet />}>
              <Route index element={<Navigate to="/admin/content/departments" replace />} />
              <Route path="departments" element={<AdminContentManager />} />
              <Route path="courses" element={<AdminContentManager />} />
              <Route path="subjects" element={<AdminContentManager />} />
              <Route path="syllabi" element={<AdminContentManager />} />
              <Route path="topics" element={<AdminContentManager />} />
            </Route>
          </Route>
          <Route path="/dashboard" element={<StudentProtectedRoute><DashboardPage /></StudentProtectedRoute>} />
          <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen
      className="min-h-svh"
      sidebarWidth="14rem"
      sidebarWidthMobile="16rem"
    >
      <Sidebar collapsible="offcanvas" side="left">
        <StudentSidebar
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
          examMode={examMode}
          subjects={SUBJECTS}
          onSubjectChange={handleSubjectChange}
          onTopicChange={setSelectedTopic}
          onExamModeChange={setExamMode}
          topics={topics}
          history={history}
          onHistoryItemClick={handleHistoryItemClick}
        />
      </Sidebar>

      <SidebarInset>
        <AppHeader
          selectedSubject={selectedSubject}
          onSubjectChange={handleSubjectChange}
          subjects={SUBJECTS}
        />

        <main className="flex-1 overflow-auto" role="main">
          <Routes>
            <Route
              path="/prepare"
                element={<StudentProtectedRoute><ChatInterface
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    examMode={examMode}
                    onSwitchToNotes={() => navigate("/notes")}
                    onSwitchToPractice={() => navigate("/practice")}
                  /></StudentProtectedRoute>}
            />
            {/* dashboard is rendered as a fullscreen route above; omit duplicate route here */}
            <Route
              path="/notes"
              element={<StudentProtectedRoute><NotesSummarizer
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    onBack={() => navigate("/prepare")}
                  /></StudentProtectedRoute>}
            />
            <Route
              path="/practice"
              element={<StudentProtectedRoute><PracticeGenerator
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    onBack={() => navigate("/prepare")}
                    topics={topics}
                  /></StudentProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/prepare" replace />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}