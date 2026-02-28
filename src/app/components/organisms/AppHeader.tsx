import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { Brand } from "../atoms/Brand";
import { SubjectSelector, type ContentItem } from "../molecules/SubjectSelector";
import { SidebarTrigger } from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";
import { showInfo } from "../../lib/toast";
import { getAuthMe } from "../../../lib/api";
import { useDashboard } from "../../context/DashboardContext";
import { getUserInitials } from "../../lib/user";

interface AppHeaderProps {
  selectedSubject: string;
  onSubjectChange: (subjectId: string) => void;
  subjects: ContentItem[];
  showSubjectSelector?: boolean;
}

export function AppHeader({
  selectedSubject,
  onSubjectChange,
  subjects,
  showSubjectSelector = true,
}: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sm:px-6 sticky top-0 z-10">
      <SidebarTrigger aria-label="Toggle sidebar" className="md:hidden" />
      <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
        <Link to="/" className="inline-flex items-center gap-3 min-w-0 shrink-0">
          <Brand size="sm" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
          {showSubjectSelector && (
            <div className="hidden md:block shrink-0">
              <SubjectSelector
                value={selectedSubject}
                onValueChange={onSubjectChange}
                options={subjects}
                placeholder="Select Subject"
              />
            </div>
          )}
          <ThemeToggle />
          <AuthHeaderActions />
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
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/login"
          className="text-sm text-primary hover:underline py-2"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="text-sm border border-primary px-3 py-2 rounded-md text-primary hover:bg-primary/5"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const [profile, setProfile] = React.useState<Record<string, any> | null>(
    auth.user || null
  );
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
    if (dashCtx?.dashboard) {
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
          className="inline-flex size-9 items-center justify-center rounded-full outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shrink-0"
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
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-64 max-w-[min(16rem,calc(100vw-2rem))]"
      >
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
