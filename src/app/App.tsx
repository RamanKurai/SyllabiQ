import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AppHeader } from './components/organisms/AppHeader';
import { StudentSidebar } from './components/organisms/StudentSidebar';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from './components/ui/sidebar';
import { ChatInterface } from './components/ChatInterface';
import type { Message as ChatMessage } from './components/ChatInterface';
import { NotesSummarizer } from './components/NotesSummarizer';
import { PracticeGenerator } from './components/PracticeGenerator';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import {
  AdminProtectedRoute,
  StudentProtectedRoute,
} from "./components/organisms/ProtectedRoute";
import DashboardPage from "./components/pages/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminKpis from "./components/Admin/AdminKpis";
import AdminAiInsights from "./components/Admin/AdminAiInsights";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminInstitutions from "./components/Admin/AdminInstitutions";
import AdminRoles from "./components/Admin/AdminRoles";
import AdminContentManager from "./components/Admin/AdminContentManager";
import AdminLoginPage from "./components/pages/AdminLoginPage";
import { getSubjects, getTopics } from '../lib/api';
import type { ContentItem } from './components/molecules/SubjectSelector';
import { useAuth } from './context/AuthContext';

export default function App() {
  const auth = useAuth();
  const [subjects, setSubjects] = useState<ContentItem[]>([]);
  const [topics, setTopics] = useState<ContentItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [examMode, setExamMode] = useState<'2-mark' | '5-mark' | '10-mark'>('5-mark');
  const [history, setHistory] = useState<Array<{ id: string; query: string; timestamp: Date }>>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fullscreenPaths = ["/login", "/signup", "/admin", "/dashboard"];
  const isFullscreenRoute = fullscreenPaths.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setSubjects([]);
      return;
    }
    getSubjects()
      .then(setSubjects)
      .catch(() => setSubjects([]));
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (selectedSubject) {
      getTopics(selectedSubject)
        .then(setTopics)
        .catch(() => setTopics([]));
    } else {
      setTopics([]);
    }
  }, [selectedSubject]);

  const selectedSubjectName = subjects.find((s) => s.id === selectedSubject)?.name ?? '';
  const selectedTopicName = topics.find((t) => t.id === selectedTopic)?.name ?? '';

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic('');
  };

  // Keep sidebar history in sync with chat messages (user messages only)
  useEffect(() => {
    const userMsgs = chatMessages.filter((m) => m.type === 'user');
    setHistory(
      userMsgs.map((m) => ({ id: m.id, query: m.content, timestamp: m.timestamp }))
    );
  }, [chatMessages]);

  const handleHistoryItemClick = (query: string) => {
    navigate('/prepare');
    // Pre-fill the chat input is a UX enhancement; for now just navigate back
    console.log('Navigating to query:', query);
  };

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
            <Route path="ai-insights" element={<AdminAiInsights />} />
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
          subjects={subjects}
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
          subjects={subjects}
        />

        <main className="flex-1 overflow-auto" role="main">
          <Routes>
            <Route
              path="/prepare"
                element={<StudentProtectedRoute><ChatInterface
                    selectedSubject={selectedSubject}
                    selectedSubjectName={selectedSubjectName}
                    selectedTopic={selectedTopic}
                    selectedTopicName={selectedTopicName}
                    examMode={examMode}
                    onSwitchToNotes={() => navigate("/notes")}
                    onSwitchToPractice={() => navigate("/practice")}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                  /></StudentProtectedRoute>}
            />
            {/* dashboard is rendered as a fullscreen route above; omit duplicate route here */}
            <Route
              path="/notes"
              element={<StudentProtectedRoute><NotesSummarizer
                    selectedSubject={selectedSubject}
                    selectedSubjectName={selectedSubjectName}
                    selectedTopic={selectedTopic}
                    selectedTopicName={selectedTopicName}
                    onBack={() => navigate("/prepare")}
                  /></StudentProtectedRoute>}
            />
            <Route
              path="/practice"
              element={<StudentProtectedRoute><PracticeGenerator
                    selectedSubject={selectedSubject}
                    selectedSubjectName={selectedSubjectName}
                    selectedTopic={selectedTopic}
                    selectedTopicName={selectedTopicName}
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