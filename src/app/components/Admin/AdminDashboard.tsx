import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "./AdminLayout";
import { Card, CardContent } from "../ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const PATH_LABELS: Record<string, string> = {
  "": "Dashboard",
  users: "Users",
  institutions: "Institutions",
  roles: "Roles",
  content: "Content",
  courses: "Courses",
  subjects: "Subjects",
  syllabi: "Syllabi",
  topics: "Topics",
};

function getBreadcrumbLabel(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  const segments = pathname.replace(/^\/admin\/?/, "").split("/");
  const last = segments[segments.length - 1];
  return PATH_LABELS[last] ?? last ?? "Admin";
}

const RESTRICTED_FOR_PRINCIPAL_TEACHER = [
  "/admin/institutions",
  "/admin/roles",
  "/admin/content",
];

export default function AdminDashboard() {
  const location = useLocation();
  const { roles } = useAuth();
  const label = getBreadcrumbLabel(location.pathname);

  const isPrincipalOrTeacher =
    roles.includes("Principal") || roles.includes("Teacher");
  const isRestrictedPath = RESTRICTED_FOR_PRINCIPAL_TEACHER.some((p) =>
    location.pathname.startsWith(p)
  );
  if (isPrincipalOrTeacher && isRestrictedPath) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground">Admin</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
