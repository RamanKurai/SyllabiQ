import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Grid, Users, Home, Building, FileText } from "lucide-react";

type AdminTab = "users" | "institutions" | "roles" | "content" | "kpis";

const AdminContext = createContext<{
  activeTab: AdminTab;
  setActiveTab: (t: AdminTab) => void;
  contentSubTab: "courses" | "subjects" | "syllabi" | "topics";
  setContentSubTab: (s: "courses" | "subjects" | "syllabi" | "topics") => void;
} | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminLayout");
  return ctx;
}

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [contentSubTab, setContentSubTab] = useState<"courses" | "subjects" | "syllabi" | "topics">("courses");
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("adminSidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });

  function doLogout() {
    logout();
    navigate("/admin-login");
  }

  function toggleCollapsed() {
    const v = !collapsed;
    setCollapsed(v);
    try {
      localStorage.setItem("adminSidebarCollapsed", v ? "true" : "false");
    } catch {}
  }

  return (
    <AdminContext.Provider value={{ activeTab, setActiveTab, contentSubTab, setContentSubTab }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-white border-r border-gray-200 transition-all ${
            collapsed ? "w-16" : "w-56"
          }`}
          aria-label="Admin navigation"
        >
      <div className="h-full flex flex-col">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold">{collapsed ? "SQ" : "SyllabiQ"}</div>
              </div>
              <button
                onClick={toggleCollapsed}
                aria-expanded={!collapsed}
                className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Grid className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="p-3 flex-1 space-y-1" role="navigation" aria-label="Admin sections">
              <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" tab="kpis" collapsed={collapsed} />
              <NavItem icon={<Users className="w-5 h-5" />} label="Users" tab="users" collapsed={collapsed} />
              <NavItem icon={<Building className="w-5 h-5" />} label="Institutions" tab="institutions" collapsed={collapsed} />
              <div>
                <NavItem icon={<FileText className="w-5 h-5" />} label="Content" tab="content" collapsed={collapsed} />
                {!collapsed && (
                  <div className="mt-1 pl-4 space-y-1" role="menu" aria-label="Content sections">
                    <button
                      onClick={() => setContentSubTab("courses")}
                      className={`text-sm w-full text-left px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        contentSubTab === "courses" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                      }`}
                    >
                      Courses
                    </button>
                    <button
                      onClick={() => setContentSubTab("subjects")}
                      className={`text-sm w-full text-left px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        contentSubTab === "subjects" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                      }`}
                    >
                      Subjects
                    </button>
                    <button
                      onClick={() => setContentSubTab("syllabi")}
                      className={`text-sm w-full text-left px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        contentSubTab === "syllabi" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                      }`}
                    >
                      Syllabi
                    </button>
                    <button
                      onClick={() => setContentSubTab("topics")}
                      className={`text-sm w-full text-left px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        contentSubTab === "topics" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                      }`}
                    >
                      Topics
                    </button>
                  </div>
                )}
              </div>
              <NavItem icon={<LogOut className="w-5 h-5" />} label="Roles" tab="roles" collapsed={collapsed} />
            </nav>

            <div className="p-3 border-t">
              <button
                onClick={doLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="bg-white border-b p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="text-lg font-semibold">SyllabiQ — Admin</div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">{user?.email || ""}</div>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto py-6">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}

function NavItem({ icon, label, tab, collapsed }: { icon: React.ReactNode; label: string; tab: AdminTab; collapsed: boolean }) {
  const ctx = useContext(AdminContext);
  if (!ctx) return null;
  const active = ctx.activeTab === tab;
  return (
    <button
      onClick={() => ctx.setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        active ? "bg-blue-50" : ""
      }`}
      aria-pressed={active}
    >
      <div className={`text-gray-700 ${active ? "text-blue-600" : ""}`}>{icon}</div>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

