import React from "react";
import AdminLayout, { useAdmin } from "./AdminLayout";
import AdminUsers from "./AdminUsers";
import AdminInstitutions from "./AdminInstitutions";
import AdminRoles from "./AdminRoles";
import AdminContentManager from "./AdminContentManager";
import AdminKpis from "./AdminKpis";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
}

function AdminDashboardContent() {
  const { activeTab, setActiveTab } = useAdmin();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 hidden">
        {/* retained for visual parity but navigation is provided in left sidebar */}
        <button onClick={() => setActiveTab("users")} className={`px-3 py-1 mr-2 ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Users</button>
        <button onClick={() => setActiveTab("institutions")} className={`px-3 py-1 mr-2 ${activeTab === "institutions" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Institutions</button>
        <button onClick={() => setActiveTab("roles")} className={`px-3 py-1 mr-2 ${activeTab === "roles" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Roles</button>
        <button onClick={() => setActiveTab("content")} className={`px-3 py-1 ${activeTab === "content" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Content</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "institutions" && <AdminInstitutions />}
        {activeTab === "roles" && <AdminRoles />}
        {activeTab === "content" && <AdminContentManager />}
        {activeTab === "kpis" && <AdminKpis />}
      </div>
    </div>
  );
}

