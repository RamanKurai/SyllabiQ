import React from "react";
import { adminListInstitutions, createInstitution, updateInstitution, deleteInstitution } from "../../hooks/useApi";

export default function AdminInstitutions() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [name, setName] = React.useState("");

  const load = React.useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await adminListInstitutions(pageSize, p * pageSize);
      if (Array.isArray(res)) {
        setItems(res);
      } else if (res && typeof res === "object" && Array.isArray((res as any).results)) {
        setItems((res as any).results);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, page]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onCreate = async () => {
    if (!name) return;
    await createInstitution({ name });
    setName("");
    await load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete institution?")) return;
    await deleteInstitution(id);
    await load();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-medium mb-3">Institutions</h2>
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
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New institution name" className="border px-2 py-1 mr-2" />
        <button onClick={onCreate} className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1">ID</th>
            <th scope="col" className="px-2 py-1">Name</th>
            <th scope="col" className="px-2 py-1">Slug</th>
            <th scope="col" className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No institutions found.</td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-2 py-2">{it.id}</td>
                <td className="px-2 py-2">{it.name}</td>
                <td className="px-2 py-2">{it.slug}</td>
                <td className="px-2 py-2">
                  <button onClick={() => onDelete(it.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

