import React from "react";
import { Outlet, useLocation } from "react-router-dom";
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

export default function AdminDashboard() {
  const location = useLocation();
  const label = getBreadcrumbLabel(location.pathname);

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
