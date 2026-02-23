import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SubjectSelector } from './molecules/SubjectSelector';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brand } from './atoms/Brand';
import { Avatar, AvatarFallback } from './ui/avatar';
import { getUserInitials } from '../lib/user';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-12">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="inline-flex items-center gap-3">
            <Brand />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {showSubjectSelector && (
            <SubjectSelector
              value={selectedSubject}
              onValueChange={onSubjectChange}
              options={subjects}
              placeholder="Select Subject"
            />
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
  const initials = getUserInitials(user.full_name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-haspopup="menu"
          aria-label="User menu"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-2">
              <div className="font-medium">{user.full_name || user.email}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              auth.logout();
              showInfo("Signed out.");
            }}
            className="cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}