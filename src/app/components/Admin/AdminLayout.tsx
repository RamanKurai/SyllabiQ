import React, { useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
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
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { SidebarNavLink } from "../molecules/SidebarNavLink";
import { AdminNavItemWithSub, type ContentSubItem } from "../molecules/AdminNavItemWithSub";
import { UserMenu } from "../molecules/UserMenu";

const canSeeInstitutions = (roles: string[]) =>
  roles.includes("SuperAdmin") || roles.includes("InstitutionAdmin");
const canSeeContent = (roles: string[]) =>
  roles.includes("SuperAdmin") || roles.includes("InstitutionAdmin");
const canSeeRoles = (roles: string[]) =>
  roles.includes("SuperAdmin") || roles.includes("InstitutionAdmin");

const contentSubItems: ContentSubItem[] = [
  { key: "departments", label: "Departments", icon: GraduationCap, to: "/admin/content/departments" },
  { key: "courses", label: "Courses", icon: BookOpen, to: "/admin/content/courses" },
  { key: "subjects", label: "Subjects", icon: BookMarked, to: "/admin/content/subjects" },
  { key: "syllabi", label: "Syllabi", icon: Library, to: "/admin/content/syllabi" },
  { key: "topics", label: "Topics", icon: ListChecks, to: "/admin/content/topics" },
];

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout, roles } = useAuth();
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
            <span className="font-semibold group-data-[collapsible=icon]/sidebar-wrapper:hidden">SyllabiQ</span>
            <span className="hidden font-semibold group-data-[collapsible=icon]/sidebar-wrapper:inline">SQ</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarNavLink
                    to="/admin"
                    end
                    icon={LayoutDashboard}
                    label="Dashboard"
                    isActive={location.pathname === "/admin" || location.pathname === "/admin/"}
                    tooltip="Dashboard"
                  />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarNavLink
                    to="/admin/users"
                    icon={Users}
                    label="Users"
                    isActive={location.pathname === "/admin/users"}
                    tooltip="Users"
                  />
                </SidebarMenuItem>
                {canSeeInstitutions(roles) && (
                  <SidebarMenuItem>
                    <SidebarNavLink
                      to="/admin/institutions"
                      icon={Building2}
                      label="Institutions"
                      isActive={location.pathname === "/admin/institutions"}
                      tooltip="Institutions"
                    />
                  </SidebarMenuItem>
                )}
                {canSeeContent(roles) && (
                  <SidebarMenuItem>
                    <AdminNavItemWithSub
                      icon={<FileText className="size-4" aria-hidden />}
                      label="Content"
                      pathname={location.pathname}
                      navigate={navigate}
                      subItems={contentSubItems}
                    />
                  </SidebarMenuItem>
                )}
                {canSeeRoles(roles) && (
                  <SidebarMenuItem>
                    <SidebarNavLink
                      to="/admin/roles"
                      icon={Shield}
                      label="Roles"
                      isActive={location.pathname === "/admin/roles"}
                      tooltip="Roles"
                    />
                  </SidebarMenuItem>
                )}
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
            <UserMenu
              fullName={user?.full_name}
              email={user?.email}
              roles={roles}
              onLogout={doLogout}
              triggerLabel="User menu"
            />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6" role="main">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
