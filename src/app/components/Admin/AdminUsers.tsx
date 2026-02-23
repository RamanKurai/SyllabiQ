import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  adminListUsers,
  approveUser,
  denyUser,
  suspendUser,
  adminAssignRole,
  adminListRoles,
  adminListInstitutions,
} from "../../hooks/useApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  PauseCircle,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "suspended", label: "Suspended" },
];

const ROLE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "SuperAdmin", label: "SuperAdmin" },
  { value: "InstitutionAdmin", label: "InstitutionAdmin" },
  { value: "Principal", label: "Principal" },
  { value: "Teacher", label: "Teacher" },
  { value: "Student", label: "Student" },
];

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "approved"
      ? "default"
      : status === "pending"
        ? "secondary"
        : status === "suspended"
          ? "destructive"
          : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function AdminUsers() {
  const { accessibleInstitutionIds, user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ?? null;
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [status, setStatus] = React.useState<string | null>(null);
  const [roleName, setRoleName] = React.useState<string | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = React.useState<number | null>(null);
  const [roles, setRoles] = React.useState<any[]>([]);
  const [institutions, setInstitutions] = React.useState<any[]>([]);
  const [assigningUser, setAssigningUser] = React.useState<number | null>(null);
  const [assignRoleId, setAssignRoleId] = React.useState<number | null>(null);
  const [assignInstitutionId, setAssignInstitutionId] = React.useState<number | null>(null);

  const load = React.useCallback(
    async (p = page, s: string | null = status, r: string | null = roleName) => {
      setLoading(true);
      setError(null);
      try {
        const instId = accessibleInstitutionIds.length > 0 ? (selectedInstitutionId ?? accessibleInstitutionIds[0]) : undefined;
        const res = await adminListUsers(pageSize, p * pageSize, s ?? undefined, instId ?? undefined, r ?? undefined);
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
        setError(e instanceof Error ? e.message : "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page, status, roleName, selectedInstitutionId, accessibleInstitutionIds, roles.length, institutions.length]
  );

  React.useEffect(() => {
    load();
  }, [load]);

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

  const onStatusChange = (s: string) => {
    setStatus(s === "all" ? null : s);
    setPage(0);
  };

  const onRoleChange = (r: string) => {
    setRoleName(r === "all" ? null : r);
    setPage(0);
  };

  const onStartAssign = (userId: number) => {
    setAssigningUser(userId);
    setAssignRoleId(null);
    setAssignInstitutionId(null);
  };

  const onCancelAssign = () => setAssigningUser(null);

  const onSubmitAssign = async (userId: number) => {
    if (!assignRoleId) return;
    await adminAssignRole({ user_id: userId, role_id: assignRoleId, institution_id: assignInstitutionId || null });
    setAssigningUser(null);
    await load();
  };

  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertCircle className="size-4" aria-hidden />
        <AlertTitle>Error loading users</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading && users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Users</h2>

        <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="page-size" className="text-sm text-muted-foreground">
            Page size
          </Label>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger id="page-size" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm text-muted-foreground">
            Status
          </Label>
          <Select value={status ?? "all"} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter" className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="role-filter" className="text-sm text-muted-foreground">
            Type
          </Label>
          <Select value={roleName ?? "all"} onValueChange={onRoleChange}>
            <SelectTrigger id="role-filter" className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {accessibleInstitutionIds.length > 1 && (
          <div className="flex items-center gap-2">
            <Label htmlFor="institution-filter" className="text-sm text-muted-foreground">
              Institution
            </Label>
            <Select
              value={selectedInstitutionId != null ? String(selectedInstitutionId) : String(accessibleInstitutionIds[0])}
              onValueChange={(v) => {
                setSelectedInstitutionId(Number(v));
                setPage(0);
              }}
            >
              <SelectTrigger id="institution-filter" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {institutions
                  .filter((i) => accessibleInstitutionIds.includes(i.id))
                  .map((i) => (
                    <SelectItem key={i.id} value={String(i.id)}>
                      {i.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const np = Math.max(0, page - 1);
                  setPage(np);
                  load(np, status, roleName);
                }}
                disabled={page === 0}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const np = page + 1;
                  setPage(np);
                  load(np, status, roleName);
                }}
                disabled={users.length < pageSize}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">ID</TableHead>
              <TableHead scope="col">Email</TableHead>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col" className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-sm">{u.id}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.full_name || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={u.status || "unknown"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onApprove(u.id)}
                            disabled={u.status === "approved" || u.id === currentUserId}
                            aria-label={`Approve user ${u.email}`}
                          >
                            <CheckCircle className="size-4" aria-hidden />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {u.id === currentUserId ? "Cannot approve yourself" : "Approve"}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDeny(u.id)}
                            disabled={u.status === "denied" || u.id === currentUserId}
                            aria-label={`Deny user ${u.email}`}
                          >
                            <XCircle className="size-4" aria-hidden />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {u.id === currentUserId ? "Cannot deny yourself" : "Deny"}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onSuspend(u.id)}
                            disabled={u.status === "suspended" || u.id === currentUserId}
                            aria-label={`Suspend user ${u.email}`}
                          >
                            <PauseCircle className="size-4" aria-hidden />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {u.id === currentUserId ? "Cannot suspend yourself" : "Suspend"}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onStartAssign(u.id)}
                            disabled={u.id === currentUserId}
                            aria-label={`Assign role to ${u.email}`}
                          >
                            <UserPlus className="size-4" aria-hidden />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {u.id === currentUserId ? "Cannot assign roles to yourself" : "Assign role"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!assigningUser} onOpenChange={(open) => !open && onCancelAssign()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign role</DialogTitle>
            <DialogDescription>
              Assign a role to user {assigningUser}. Optionally scope to an institution.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assign-role">Role</Label>
              <Select value={assignRoleId ?? ""} onValueChange={(v) => setAssignRoleId(v ? Number(v) : null)}>
                <SelectTrigger id="assign-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assign-institution">Institution (optional)</Label>
              <Select
                value={assignInstitutionId != null ? String(assignInstitutionId) : "global"}
                onValueChange={(v) => setAssignInstitutionId(v === "global" ? null : Number(v))}
              >
                <SelectTrigger id="assign-institution">
                  <SelectValue placeholder="Global" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  {institutions.map((it) => (
                    <SelectItem key={it.id} value={String(it.id)}>
                      {it.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancelAssign}>
              Cancel
            </Button>
            <Button
              onClick={() => assigningUser && onSubmitAssign(assigningUser)}
              disabled={!assignRoleId}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
