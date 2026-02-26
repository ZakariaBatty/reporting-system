"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Users,
  CheckCircle,
  Car,
  Shield,
  Edit2,
  Trash2,
  Download,
} from "lucide-react";
import {
  StatCard,
  PageHeader,
  RoleBadge,
  UserStatusBadge,
} from "@/components/shared";
import { FormField } from "@/components/FormField";
import { Drawer } from "@/components/Drawer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/contexts/AuthContext";
import { users as initialUsers, User, UserRole, UserStatus } from "@/lib/data";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [userList, setUserList] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusF, setStatusF] = useState<UserStatus | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "DRIVER",
    status: "active",
    department: "",
  });

  const canManage =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";

  const filtered = useMemo(
    () =>
      userList.filter((u) => {
        if (roleFilter !== "all" && u.role !== roleFilter) return false;
        if (statusF !== "all" && u.status !== statusF) return false;
        if (
          search &&
          ![u.name, u.email].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          )
        )
          return false;
        return true;
      }),
    [userList, roleFilter, statusF, search],
  );

  const openCreate = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "DRIVER",
      status: "active",
      department: "",
    });
    setEditTarget(null);
    setDrawerOpen(true);
  };

  const openEdit = (u: User) => {
    setForm(u);
    setEditTarget(u);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      setUserList(
        userList.map((u) =>
          u.id === editTarget.id ? ({ ...u, ...form } as User) : u,
        ),
      );
    } else {
      setUserList([
        ...userList,
        {
          ...form,
          id: String(Date.now()),
          createdAt: "2026-02-22",
          lastLogin: "—",
        } as User,
      ]);
    }
    setDrawerOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget)
      setUserList(userList.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  if (!canManage) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">
          You do not have permission to manage users.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users Management"
        subtitle="Manage team members and access permissions"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export ({filtered.length})
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> New User
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={userList.length}
          icon={Users}
          variant="default"
        />
        <StatCard
          label="Active"
          value={userList.filter((u) => u.status === "active").length}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="Drivers"
          value={userList.filter((u) => u.role === "DRIVER").length}
          icon={Car}
          variant="accent"
        />
        <StatCard
          label="Admins"
          value={
            userList.filter(
              (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN",
            ).length
          }
          icon={Shield}
          variant="danger"
        />
      </div>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
          >
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="DRIVER">Driver</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusF}
            onValueChange={(v) => setStatusF(v as UserStatus | "all")}
          >
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setRoleFilter("all");
              setStatusF("all");
            }}
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Role",
                  "Status",
                  "Department",
                  "Last Login",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-2.5 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 text-xs">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {u.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-foreground">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{u.phone}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3">
                    <UserStatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.department || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-primary hover:text-primary"
                        onClick={() => openEdit(u)}
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(u)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editTarget ? "Edit User" : "Create New User"}
      >
        <FormField
          label="Full Name"
          value={form.name ?? ""}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="Full name"
        />
        <FormField
          label="Email"
          value={form.email ?? ""}
          onChange={(v) => setForm({ ...form, email: v })}
          type="email"
          placeholder="email@example.com"
        />
        <FormField
          label="Phone"
          value={form.phone ?? ""}
          onChange={(v) => setForm({ ...form, phone: v })}
          placeholder="+1 555-0000"
        />
        <FormField
          label="Role"
          value={form.role ?? "DRIVER"}
          onChange={(v) => setForm({ ...form, role: v as UserRole })}
          as="select"
          options={[
            { value: "DRIVER", label: "Driver" },
            { value: "MANAGER", label: "Manager" },
            { value: "ADMIN", label: "Admin" },
            { value: "SUPER_ADMIN", label: "Super Admin" },
          ]}
        />
        <FormField
          label="Status"
          value={form.status ?? "active"}
          onChange={(v) => setForm({ ...form, status: v as UserStatus })}
          as="select"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "suspended", label: "Suspended" },
          ]}
        />
        <FormField
          label="Department (optional)"
          value={form.department ?? ""}
          onChange={(v) => setForm({ ...form, department: v })}
          placeholder="Operations, Fleet…"
        />
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1">
            {editTarget ? "Update" : "Create"} User
          </Button>
          <Button
            onClick={() => setDrawerOpen(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Drawer>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
