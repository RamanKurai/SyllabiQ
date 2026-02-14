import React from "react";
import {
  adminListPendingUsers,
  adminListUsers,
  approveUser,
  denyUser,
  suspendUser,
  adminAssignRole,
  adminListRoles,
  adminListInstitutions,
} from "../../hooks/useApi";

export default function AdminUsers() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [roles, setRoles] = React.useState<any[]>([]);
  const [institutions, setInstitutions] = React.useState<any[]>([]);
  const [assigningUser, setAssigningUser] = React.useState<number | null>(null);
  const [assignRoleId, setAssignRoleId] = React.useState<number | null>(null);
  const [assignInstitutionId, setAssignInstitutionId] = React.useState<number | null>(null);

  const load = React.useCallback(
    async (p = page, s = status) => {
      setLoading(true);
      try {
        const res = await adminListUsers(pageSize, p * pageSize, s ?? undefined);
        // normalize to array
        if (Array.isArray(res)) {
          setUsers(res);
        } else if (res && typeof res === "object" && Array.isArray((res as any).results)) {
          setUsers((res as any).results);
        } else {
          setUsers([]);
        }
        if (roles.length === 0) {
          const r = await adminListRoles(200, 0);
          setRoles(r || []);
        }
        if (institutions.length === 0) {
          const i = await adminListInstitutions(200, 0);
          setInstitutions(i || []);
        }
      } catch (e) {
        console.error(e);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page, roles.length, institutions.length, status]
  );

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApprove = async (id: number) => {
    await approveUser(id);
    await load();
  };

  const onDeny = async (id: number) => {
    await denyUser(id);
    await load();
  };

  const onSuspend = async (id: number) => {
    await suspendUser(id);
    await load();
  };

  const onStatusChange = async (s: string | null) => {
    setStatus(s);
    setPage(0);
    await load(0, s || undefined);
  };

  const onStartAssign = (userId: number) => {
    setAssigningUser(userId);
    setAssignRoleId(null);
    setAssignInstitutionId(null);
  };

  const onCancelAssign = () => setAssigningUser(null);

  const onSubmitAssign = async (userId: number) => {
    if (!assignRoleId) return alert("Select role");
    await adminAssignRole({ user_id: userId, role_id: assignRoleId, institution_id: assignInstitutionId || null });
    setAssigningUser(null);
    await load();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-medium mb-3">Users</h2>
      <div className="mb-3 flex items-center">
        <label className="text-sm mr-2">Page size:</label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="border px-2 py-1 mr-4"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <div>
          <button
            onClick={() => {
              const np = Math.max(0, page - 1);
              setPage(np);
              load(np);
            }}
            className="px-2 py-1 mr-2 bg-gray-200 rounded"
          >
            Prev
          </button>
          <button
            onClick={() => {
              const np = page + 1;
              setPage(np);
              load(np);
            }}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm">Status:</label>
        <select value={status ?? ""} onChange={(e) => onStatusChange(e.target.value || null)} className="border px-2 py-1">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1">ID</th>
            <th scope="col" className="px-2 py-1">Email</th>
            <th scope="col" className="px-2 py-1">Name</th>
            <th scope="col" className="px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No pending users.</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-2 py-2">{u.id}</td>
                <td className="px-2 py-2">{u.email}</td>
                <td className="px-2 py-2">{u.full_name || "-"}</td>
                <td className="px-2 py-2">
                  <button onClick={() => onApprove(u.id)} className="mr-2 px-2 py-1 bg-green-600 text-white rounded">
                    Approve
                  </button>
                  <button onClick={() => onDeny(u.id)} className="mr-2 px-2 py-1 bg-red-600 text-white rounded">
                    Deny
                  </button>
                  <button onClick={() => onSuspend(u.id)} className="mr-2 px-2 py-1 bg-yellow-600 text-white rounded">
                    Suspend
                  </button>
                  <button onClick={() => onStartAssign(u.id)} className="px-2 py-1 ml-2 bg-indigo-600 text-white rounded">
                    Assign role
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {assigningUser && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="font-medium mb-2">Assign role to user {assigningUser}</h3>
          <div className="mb-2">
            <label className="block text-sm">Role</label>
            <select value={assignRoleId ?? ""} onChange={(e) => setAssignRoleId(e.target.value ? Number(e.target.value) : null)} className="border px-2 py-1">
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm">Institution (optional)</label>
            <select value={assignInstitutionId ?? ""} onChange={(e) => setAssignInstitutionId(e.target.value ? Number(e.target.value) : null)} className="border px-2 py-1">
              <option value="">Global</option>
              {institutions.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={() => onSubmitAssign(assigningUser)} className="px-3 py-1 bg-blue-600 text-white rounded mr-2">
              Assign
            </button>
            <button onClick={onCancelAssign} className="px-3 py-1 bg-gray-200 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

