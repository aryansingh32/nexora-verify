import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  getHolders,
  upsertHolder,
  setHolderStatus,
} from "@/lib/admin.functions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, Power, User } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";
import { HolderInput } from "@/lib/admin.schemas";

export const Route = createFileRoute("/admin/users/")({
  component: UsersPage,
});

function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHolder, setEditingHolder] = useState<HolderInput | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on search or filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, isLoading } = useQuery({
    queryKey: ["holders", debouncedSearch, status, page],
    queryFn: () =>
      getHolders({
        data: { search: debouncedSearch, status, page, pageSize: 10 },
      }),
  });

  const upsertMut = useMutation({
    mutationFn: (vars: HolderInput) => upsertHolder({ data: vars }),
    onSuccess: () => {
      toast.success("User saved successfully");
      queryClient.invalidateQueries({ queryKey: ["holders"] });
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: "active" | "inactive" }) =>
      setHolderStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["holders"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = () => {
    setEditingHolder({
      name: "",
      email: "",
      phone: "",
      organization: "",
      holderType: "Client",
      status: "active",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (holder: any) => {
    setEditingHolder({
      id: holder.id,
      name: holder.name,
      email: holder.email,
      phone: holder.phone || "",
      organization: holder.organization || "",
      holderType: holder.holder_type,
      status: holder.status,
    });
    setIsFormOpen(true);
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingHolder) {
      upsertMut.mutate(editingHolder);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingHolder) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be less than 5MB");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

    toast.promise(
      supabase.storage.from('profiles').upload(fileName, file),
      {
        loading: 'Uploading photo...',
        success: (res) => {
          if (res.error) throw res.error;
          const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
          setEditingHolder({ ...editingHolder, photoUrl: data.publicUrl });
          return 'Photo uploaded successfully';
        },
        error: (err) => `Upload failed: ${err.message}`
      }
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Users & Holders
          </h1>
          <p className="text-slate-500 text-sm">
            Manage certificate holders and client accounts.
          </p>
        </div>
        <Button onClick={handleCreate}>Create User</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by name, email or org..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.rows.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-900">
                      {user.name}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.email}</div>
                      {user.phone && (
                        <div className="text-xs text-slate-500">
                          {user.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {user.organization || "—"}
                    </TableCell>
                    <TableCell>{user.holder_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-transparent shadow-none"
                            : "bg-slate-100 text-slate-600 border-transparent shadow-none"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to="/admin/users/$id" params={{ id: user.id }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to ${
                                    user.status === "active"
                                      ? "deactivate"
                                      : "activate"
                                  } this user?`
                                )
                              ) {
                                statusMut.mutate({
                                  id: user.id,
                                  status:
                                    user.status === "active"
                                      ? "inactive"
                                      : "active",
                                });
                              }
                            }}
                          >
                            <Power className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && data && (
          <Pagination
            page={page}
            pageSize={10}
            total={data.total}
            onPageChange={setPage}
          />
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingHolder?.id ? "Edit User" : "Create User"}
            </DialogTitle>
          </DialogHeader>
          {editingHolder && (
            <form onSubmit={submitForm} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={editingHolder.name}
                  onChange={(e) =>
                    setEditingHolder({ ...editingHolder, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingHolder.email}
                  onChange={(e) =>
                    setEditingHolder({
                      ...editingHolder,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editingHolder.phone}
                  onChange={(e) =>
                    setEditingHolder({
                      ...editingHolder,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Input
                  id="org"
                  value={editingHolder.organization}
                  onChange={(e) =>
                    setEditingHolder({
                      ...editingHolder,
                      organization: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Profile Photo</Label>
                <div className="flex gap-4 items-center">
                  {editingHolder.photoUrl ? (
                    <img src={editingHolder.photoUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <Input
                    id="photoUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={editingHolder.holderType}
                  onValueChange={(v) =>
                    setEditingHolder({ ...editingHolder, holderType: v })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingHolder.status}
                  onValueChange={(v: "active" | "inactive") =>
                    setEditingHolder({ ...editingHolder, status: v })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertMut.isPending}>
                  {upsertMut.isPending ? "Saving..." : "Save User"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
