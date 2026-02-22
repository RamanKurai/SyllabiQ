import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  FileText,
  Shield,
  BookOpen,
  BookMarked,
  Library,
  ListChecks,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { Button } from "../ui/button";

type ContentSubItem = {
  key: "departments" | "courses" | "subjects" | "syllabi" | "topics";
  label: string;
  icon: React.ComponentType;
  to: string;
};

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const doLogout = useCallback(() => {
    logout();
    navigate("/admin/login");
  }, [logout, navigate]);

  return (
    <SidebarProvider defaultOpen className="min-h-svh">
      <Sidebar collapsible="icon" side="left">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex h-8 items-center gap-2 px-2">
            <span className="font-semibold group-data-[collapsible=icon]:hidden">SyllabiQ</span>
            <span className="hidden font-semibold group-data-[collapsible=icon]:inline">SQ</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/admin" || location.pathname === "/admin/"} tooltip="Dashboard">
                    <NavLink to="/admin" end>
                      <LayoutDashboard className="size-4" aria-hidden />
                      <span>Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/admin/users"} tooltip="Users">
                    <NavLink to="/admin/users">
                      <Users className="size-4" aria-hidden />
                      <span>Users</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/admin/institutions"} tooltip="Institutions">
                    <NavLink to="/admin/institutions">
                      <Building2 className="size-4" aria-hidden />
                      <span>Institutions</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavItemWithSub
                    icon={<FileText className="size-4" aria-hidden />}
                    label="Content"
                    pathname={location.pathname}
                    subItems={[
                      { key: "departments", label: "Departments", icon: GraduationCap, to: "/admin/content/departments" },
                      { key: "courses", label: "Courses", icon: BookOpen, to: "/admin/content/courses" },
                      { key: "subjects", label: "Subjects", icon: BookMarked, to: "/admin/content/subjects" },
                      { key: "syllabi", label: "Syllabi", icon: Library, to: "/admin/content/syllabi" },
                      { key: "topics", label: "Topics", icon: ListChecks, to: "/admin/content/topics" },
                    ]}
                  />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/admin/roles"} tooltip="Roles">
                    <NavLink to="/admin/roles">
                      <Shield className="size-4" aria-hidden />
                      <span>Roles</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">SyllabiQ Admin</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground" aria-label="Logged in as">
                {user?.email || ""}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={doLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Logout"
              >
                <LogOut className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6" role="main">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function NavItemWithSub({
  icon,
  label,
  subItems,
  pathname,
}: {
  icon: React.ReactNode;
  label: string;
  subItems: ContentSubItem[];
  pathname: string;
}) {
  const isContentActive = pathname.startsWith("/admin/content");
  return (
    <>
      <SidebarMenuButton asChild isActive={isContentActive} tooltip={label}>
        <NavLink to="/admin/content/departments">
          {icon}
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
      <SidebarMenuSub>
        {subItems.map((item) => (
          <SidebarMenuSubItem key={item.key}>
            <SidebarMenuSubButton asChild isActive={pathname === item.to}>
              <NavLink to={item.to}>
                <item.icon className="size-4" aria-hidden />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </>
  );
}
