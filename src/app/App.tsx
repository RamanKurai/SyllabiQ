import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { NotesSummarizer } from './components/NotesSummarizer';
import { PracticeGenerator } from './components/PracticeGenerator';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import ProtectedRoute from './components/organisms/ProtectedRoute';
import DashboardPage from './components/pages/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

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

  const fullscreenPaths = ['/login', '/signup', '/admin-login', '/admin', '/dashboard'];
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
          <Route path="/admin-login" element={<div className="p-6"><Login redirectTo="/admin" /></div>} />
          <Route path="/admin" element={<ProtectedRoute children={<AdminDashboard />} />} />
          <Route path="/dashboard" element={<ProtectedRoute children={<DashboardPage />} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header
        selectedSubject={selectedSubject}
        onSubjectChange={handleSubjectChange}
        subjects={SUBJECTS}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
          examMode={examMode}
          onTopicChange={setSelectedTopic}
          onExamModeChange={setExamMode}
          topics={topics}
          history={history}
          onHistoryItemClick={handleHistoryItemClick}
        />

        <div className="flex-1">
          <Routes>
            <Route
              path="/prepare"
                element={<ProtectedRoute children={<ChatInterface
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    examMode={examMode}
                    onSwitchToNotes={() => navigate("/notes")}
                    onSwitchToPractice={() => navigate("/practice")}
                  />} />}
            />
            {/* dashboard is rendered as a fullscreen route above; omit duplicate route here */}
            <Route
              path="/notes"
              element={<ProtectedRoute children={<NotesSummarizer
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    onBack={() => navigate("/prepare")}
                  />} />}
            />
            <Route
              path="/practice"
              element={<ProtectedRoute children={<PracticeGenerator
                    selectedSubject={selectedSubject}
                    selectedTopic={selectedTopic}
                    onBack={() => navigate("/prepare")}
                    topics={topics}
                  />} />}
            />
            <Route path="*" element={<Navigate to="/prepare" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}