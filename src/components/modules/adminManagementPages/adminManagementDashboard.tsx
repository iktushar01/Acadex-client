"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  ShieldAlert,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AdminRecord,
  ManageableAdminRole,
} from "@/services/adminManagement/adminManagement.service";

type CreateFormState = {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  profilePhoto: string;
  role: ManageableAdminRole;
};

type UpdateFormState = {
  name: string;
  contactNumber: string;
  profilePhoto: string;
};

const defaultCreateForm: CreateFormState = {
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  profilePhoto: "",
  role: "ADMIN",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const fetchAdminApi = async (path: string, options: RequestInit = {}) => {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload;
};

const AdminManagementDashboard = () => {
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);
  const [createForm, setCreateForm] = useState<CreateFormState>(defaultCreateForm);
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    name: "",
    contactNumber: "",
    profilePhoto: "",
  });

  const adminsQuery = useQuery({
    queryKey: ["admin-management-admins"],
    queryFn: async () => {
      const result = await fetchAdminApi("/admins");

      return {
        success: result?.success ?? true,
        data: result?.data ?? [],
        message: result?.message ?? "Admins fetched successfully.",
      };
    },
  });

  const admins = useMemo(
    () => (adminsQuery.data?.data as AdminRecord[] | undefined) ?? [],
    [adminsQuery.data],
  );

  const invalidateAdmins = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-management-admins"] });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      password: string;
      role: ManageableAdminRole;
      admin: {
        name: string;
        email: string;
        contactNumber?: string;
        profilePhoto?: string;
      };
    }) => {
      const result = await fetchAdminApi("/users/create-admin", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return {
        success: result?.success ?? true,
        data: result?.data ?? null,
        message: result?.message ?? "Admin created successfully.",
      };
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setCreateOpen(false);
      setCreateForm(defaultCreateForm);
      invalidateAdmins();
    },
    onError: () => toast.error("Failed to create admin."),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      adminId,
      payload,
    }: {
      adminId: string;
      payload: {
        admin: {
          name: string;
          contactNumber?: string;
          profilePhoto?: string;
        };
      };
    }) => {
      const result = await fetchAdminApi(`/admins/${adminId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      return {
        success: result?.success ?? true,
        data: result?.data ?? null,
        message: result?.message ?? "Admin updated successfully.",
      };
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setEditTarget(null);
      invalidateAdmins();
    },
    onError: () => toast.error("Failed to update admin."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (adminId: string) => {
      const result = await fetchAdminApi(`/admins/${adminId}`, {
        method: "DELETE",
      });

      return {
        success: result?.success ?? true,
        data: result?.data ?? null,
        message: result?.message ?? "Admin deleted successfully.",
      };
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setDeleteTarget(null);
      invalidateAdmins();
    },
    onError: () => toast.error("Failed to delete admin."),
  });

  const openEditDialog = (admin: AdminRecord) => {
    setEditTarget(admin);
    setUpdateForm({
      name: admin.name ?? "",
      contactNumber: admin.contactNumber ?? "",
      profilePhoto: admin.profilePhoto ?? "",
    });
  };

  const validateCreateForm = () => {
    if (!createForm.name.trim()) return "Name is required.";
    if (!createForm.email.trim()) return "Email is required.";
    if (!createForm.password.trim()) return "Password is required.";
    if (createForm.password.trim().length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const submitCreate = () => {
    const validationMessage = validateCreateForm();

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    createMutation.mutate({
      password: createForm.password.trim(),
      role: createForm.role,
      admin: {
        name: createForm.name.trim(),
        email: createForm.email.trim().toLowerCase(),
        contactNumber: createForm.contactNumber.trim() || undefined,
        profilePhoto: createForm.profilePhoto.trim() || undefined,
      },
    });
  };

  const submitUpdate = () => {
    if (!editTarget) return;

    if (!updateForm.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    updateMutation.mutate({
      adminId: editTarget.id,
      payload: {
        admin: {
          name: updateForm.name.trim(),
          contactNumber: updateForm.contactNumber.trim() || undefined,
          profilePhoto: updateForm.profilePhoto.trim() || undefined,
        },
      },
    });
  };

  if (adminsQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminsQuery.data?.success) {
    return (
      <AccessState
        title="Super Admin access required"
        description={
          (adminsQuery.error instanceof Error ? adminsQuery.error.message : adminsQuery.data?.message) ||
          "Admin management is restricted to SUPER_ADMIN accounts. Regular admins can access general admin pages, but not sensitive admin-management APIs or actions."
        }
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge className="bg-emerald-600 px-3 py-1 text-white">SUPER_ADMIN ONLY</Badge>
            <h1 className="text-3xl font-black tracking-tight">Admin Management</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Create, review, update, and deactivate admin accounts with enforced RBAC.
              Super admin accounts are visible for audit purposes, but protected from update
              and delete actions in this module.
            </p>
          </div>

          <Button
            className="h-10 rounded-xl px-4 font-semibold"
            onClick={() => setCreateOpen(true)}
          >
            <UserPlus className="size-4" />
            Create Admin
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Total Admin Accounts" value={String(admins.length)} />
          <StatCard
            label="Protected Super Admins"
            value={String(admins.filter((admin) => admin.user.role === "SUPER_ADMIN").length)}
          />
          <StatCard
            label="Manageable Admins"
            value={String(admins.filter((admin) => admin.user.role === "ADMIN").length)}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="pl-6">Admin</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminsQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Loading admin accounts...
                </TableCell>
              </TableRow>
            )}

            {!adminsQuery.isLoading && admins.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  {adminsQuery.data?.message || "No admin accounts found."}
                </TableCell>
              </TableRow>
            )}

            {admins.map((admin) => {
              const isProtected = admin.user.role === "SUPER_ADMIN";

              return (
                <TableRow key={admin.id}>
                  <TableCell className="pl-6">
                    <div className="space-y-1">
                      <p className="font-semibold">{admin.name}</p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isProtected ? "default" : "outline"}>
                      {admin.user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.user.status === "ACTIVE" ? "outline" : "secondary"}>
                      {admin.user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {admin.contactNumber || "Not provided"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
                        disabled={isProtected}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(admin)}
                        disabled={isProtected}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Admin</DialogTitle>
            <DialogDescription>
              Only SUPER_ADMIN can create admin accounts. You may also provision another
              super admin if needed.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 md:grid-cols-2">
            <Field
              label="Name"
              value={createForm.name}
              onChange={(value) => setCreateForm((prev) => ({ ...prev, name: value }))}
            />
            <Field
              label="Email"
              type="email"
              value={createForm.email}
              onChange={(value) => setCreateForm((prev) => ({ ...prev, email: value }))}
            />
            <Field
              label="Password"
              type="password"
              value={createForm.password}
              onChange={(value) => setCreateForm((prev) => ({ ...prev, password: value }))}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
                value={createForm.role}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    role: event.target.value as ManageableAdminRole,
                  }))
                }
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <Field
              label="Contact Number"
              value={createForm.contactNumber}
              onChange={(value) =>
                setCreateForm((prev) => ({ ...prev, contactNumber: value }))
              }
            />
            <div className="md:col-span-2">
              <Field
                label="Profile Photo URL"
                value={createForm.profilePhoto}
                onChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, profilePhoto: value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={submitCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Admin</DialogTitle>
            <DialogDescription>
              Keep core account details aligned without changing protected role assignments.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <Field
              label="Name"
              value={updateForm.name}
              onChange={(value) => setUpdateForm((prev) => ({ ...prev, name: value }))}
            />
            <Field
              label="Contact Number"
              value={updateForm.contactNumber}
              onChange={(value) =>
                setUpdateForm((prev) => ({ ...prev, contactNumber: value }))
              }
            />
            <Field
              label="Profile Photo URL"
              value={updateForm.profilePhoto}
              onChange={(value) =>
                setUpdateForm((prev) => ({ ...prev, profilePhoto: value }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={submitUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete admin account?</AlertDialogTitle>
            <AlertDialogDescription>
              This soft-deletes the admin profile, user account, sessions, and linked auth
              accounts. Super admin accounts are protected and cannot be deleted here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-background/60 p-4">
    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
  </div>
);

const AccessState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex min-h-[50vh] items-center justify-center p-6">
    <div className="max-w-xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
        <ShieldAlert className="size-7" />
      </div>
      <h2 className="mt-4 text-2xl font-black tracking-tight">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default AdminManagementDashboard;
