import React from "react";
import {
  adminListInstitutions,
  createInstitution,
  deleteInstitution,
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function AdminInstitutions() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [name, setName] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const load = React.useCallback(
    async (p = page) => {
      setLoading(true);
      setError(null);
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
        setError(e instanceof Error ? e.message : "Failed to load institutions");
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, page]
  );

  React.useEffect(() => {
    load();
  }, [load]);

  const onCreate = async () => {
    if (!name.trim()) return;
    await createInstitution({ name: name.trim() });
    setName("");
    setShowCreateModal(false);
    await load();
  };

  const onDelete = async (id: number) => {
    await deleteInstitution(id);
    setDeleteId(null);
    await load();
  };

  if (error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertCircle className="size-4" aria-hidden />
        <AlertTitle>Error loading institutions</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading && items.length === 0) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Institutions</h2>
        <Button onClick={() => { setName(""); setShowCreateModal(true); }}>
          Add Institution
        </Button>
      </div>

      <Dialog open={showCreateModal} onOpenChange={(open) => { if (!open) setShowCreateModal(false); setName(""); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Institution</DialogTitle>
            <DialogDescription>Enter the name for the new institution.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-institution">Institution name</Label>
              <Input
                id="new-institution"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Institution name"
                onKeyDown={(e) => e.key === "Enter" && onCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateModal(false); setName(""); }}>Cancel</Button>
            <Button onClick={onCreate} disabled={!name.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="page-size">Page size</Label>
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const np = Math.max(0, page - 1);
              setPage(np);
              load(np);
            }}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const np = page + 1;
              setPage(np);
              load(np);
            }}
            disabled={items.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">ID</TableHead>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Slug</TableHead>
              <TableHead scope="col" className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No institutions found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="font-mono text-sm">{it.id}</TableCell>
                  <TableCell>{it.name}</TableCell>
                  <TableCell className="text-muted-foreground">{it.slug}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(it.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete institution?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the institution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && onDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
