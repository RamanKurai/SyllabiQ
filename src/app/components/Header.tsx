import { BookOpen, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  subjects: string[];
}

export function Header({ selectedSubject, onSubjectChange, subjects }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">SyllabiQ</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <label htmlFor="subject-selector" className="sr-only">
              Select subject
            </label>
            <select
              id="subject-selector"
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 cursor-pointer min-w-[200px]"
              aria-label="Select your subject"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none" aria-hidden="true" />
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthHeaderActions />
          </div>
        </div>
      </div>
    </header>
  );
}

function AuthHeaderActions() {
  const auth = useAuth();

  if (!auth) return null;

  if (!auth.isAuthenticated) {
    return (
      <>
        <Link to="/login" className="text-sm text-primary hover:underline">
          Sign in
        </Link>
        <Link to="/signup" className="text-sm border border-primary px-3 py-1 rounded-md text-primary hover:bg-primary/5">
          Sign up
        </Link>
      </>
    );
  }

  const name = auth.user?.full_name || auth.user?.email || "User";

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-muted-foreground">{name}</div>
      <button
        onClick={() => auth.logout()}
        className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Logout
      </button>
    </div>
  );
}