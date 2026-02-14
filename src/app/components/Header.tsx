import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brand } from './atoms/Brand';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { showInfo } from '../lib/toast';
import { getAuthMe } from '../../lib/api';
import { useDashboard } from '../context/DashboardContext';

interface HeaderProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  subjects: string[];
  showSubjectSelector?: boolean;
}

export function Header({ selectedSubject, onSubjectChange, subjects, showSubjectSelector = true }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-12">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="inline-flex items-center gap-3">
            <Brand />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {showSubjectSelector && (
            <div className="relative">
              <label htmlFor="subject-selector" className="sr-only">
                Select subject
              </label>
              <select
                id="subject-selector"
                value={selectedSubject}
                onChange={(e) => onSubjectChange(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-4 pr-10 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 cursor-pointer min-w-[220px]"
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
          )}
          
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

  const [profile, setProfile] = React.useState<Record<string, any> | null>(auth.user || null);
  const dashCtx = (() => {
    try {
      return (useDashboard as any)();
    } catch {
      return null;
    }
  })();

  React.useEffect(() => {
    let cancelled = false;
    if (!auth.isAuthenticated) return;
    if (dashCtx && dashCtx.dashboard) {
      setProfile(dashCtx.dashboard.account);
    } else if (!auth.user) {
      getAuthMe()
        .then((me) => {
          if (!cancelled) setProfile(me);
        })
        .catch(() => {})
        .finally(() => {});
    } else {
      setProfile(auth.user);
    }
    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, auth.user]);

  const user = profile || {};
  const initials = (user.full_name ? user.full_name.split(" ").map((n: string) => n[0]).join("") : (user.email || "U")).slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-2 p-0 rounded-md hover:bg-accent px-1"
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <div className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-2 py-1">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuLabel>
          <div className="font-medium">{user.full_name || user.email}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { auth.logout(); showInfo("Signed out."); }}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}