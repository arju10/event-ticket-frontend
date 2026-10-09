"use client";

import { format } from "date-fns";
import { useState } from "react";
import { UserX, UserCheck, ShieldCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { UserRoleDialog } from "./user-role-dialog";
import { SuspendUserDialog } from "./suspend-user-dialog";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { USER_ROLE_COLORS } from "@/lib/constants/status-colors";
import type { AdminUser } from "@/types/models";
import type { UserRole } from "@/types/enums";

const FILTER_DEFAULTS = {
  search: "",
  role: "",
  active: "",
  page: 1,
};

const ROLE_OPTIONS = [
  { label: "Attendee", value: "ATTENDEE" },
  { label: "Organizer", value: "ORGANIZER" },
  { label: "Admin", value: "ADMIN" },
];

const ACTIVE_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Suspended", value: "false" },
];

export function AdminUsersList() {
  const { values, setFilter } = useUrlFilters(FILTER_DEFAULTS);

  const { data, isLoading, isError, refetch } = useAdminUsers({
    search: values.search || undefined,
    role: values.role ? (values.role as UserRole) : undefined,
    isActive:
      values.active === "true"
        ? true
        : values.active === "false"
          ? false
          : undefined,
    page: Number(values.page) || 1,
    limit: 20,
  });

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.name}</p>
          <p className="text-muted-foreground truncate text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <Badge
          variant="outline"
          className={
            row.role === "ADMIN"
              ? "border-destructive/50 text-destructive"
              : row.role === "ORGANIZER"
                ? "border-primary/50 text-primary"
                : ""
          }
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge
          status={row.isActive ? "ACTIVE" : "SUSPENDED"}
          variant={row.isActive ? "success" : "destructive"}
        />
      ),
    },
    {
      key: "bookings",
      header: "Bookings",
      render: (row) => (
        <span className="text-muted-foreground text-sm">
          {row.totalBookings}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[180px] text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <UserRoleDialog user={row} />
          <SuspendUserDialog user={row} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View, promote, or suspend any account on the platform.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={values.search ?? ""}
          onValueChange={(v) => setFilter({ search: v })}
          placeholder="Search by name or email..."
          className="sm:max-w-sm"
        />
        <div className="flex gap-2">
          <FilterSelect
            value={values.role ?? ""}
            options={ROLE_OPTIONS}
            placeholder="Role"
            onValueChange={(v) => setFilter({ role: v })}
          />
          <FilterSelect
            value={values.active ?? ""}
            options={ACTIVE_OPTIONS}
            placeholder="Status"
            onValueChange={(v) => setFilter({ active: v })}
          />
        </div>
      </div>

      {isLoading && !data ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load users"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No users match these filters"
          description="Try clearing the search or role filter."
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(row) => row.id}
          />
          <Pagination meta={data.pagination} />
        </>
      )}
    </div>
  );
}
