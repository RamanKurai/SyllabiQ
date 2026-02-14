import React from "react";
import { adminPost, adminDelete, adminListRoles } from "../../hooks/useApi";

export default function AdminRoles() {
  const [roles, setRoles] = React.useState<any[]>([]);
  const [name, setName] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const load = React.useCallback(
    async (p = page) => {
      try {
        const res = await adminListRoles(pageSize, p * pageSize);
        if (Array.isArray(res)) {
          setRoles(res);
        } else if (res && typeof res === "object" && Array.isArray((res as any).results)) {
          setRoles((res as any).results);
        } else {
          setRoles([]);
        }
      } catch (e) {
        console.error(e);
        setRoles([]);
      }
    },
    [pageSize, page]
  );

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async () => {
    if (!name) return;
    await adminPost("/roles", { name });
    setName("");
    await load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete role?")) return;
    await adminDelete(`/roles/${id}`);
    await load();
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-3">Roles</h2>
      <div className="mb-3 flex items-center">
        <label className="text-sm mr-2">Page size:</label>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border px-2 py-1 mr-4">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <div>
          <button onClick={() => { const np = Math.max(0, page - 1); setPage(np); load(np); }} className="px-2 py-1 mr-2 bg-gray-200 rounded">Prev</button>
          <button onClick={() => { const np = page + 1; setPage(np); load(np); }} className="px-2 py-1 bg-gray-200 rounded">Next</button>
        </div>
      </div>
      <div className="mb-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New role name" className="border px-2 py-1 mr-2" />
        <button onClick={onCreate} className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1">ID</th>
            <th scope="col" className="px-2 py-1">Name</th>
            <th scope="col" className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-sm text-gray-600">No roles found.</td>
            </tr>
          ) : (
            roles.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-2 py-2">{r.id}</td>
                <td className="px-2 py-2">{r.name}</td>
                <td className="px-2 py-2">
                  <button onClick={() => onDelete(r.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

