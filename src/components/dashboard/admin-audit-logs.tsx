"use client";

import { format } from "date-fns";
import { ScrollText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilterSelect } from "@/components/shared/filter-select";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type { AuditLog } from "@/types/models";
import type { AuditAction } from "@/types/enums";

const FILTER_DEFAULTS = {
  entityType: "",
  action: "",
  page: 1,
};

const ENTITY_OPTIONS = [
  { label: "Event", value: "Event" },
  { label: "Ticket Tier", value: "TicketTier" },
  { label: "Booking", value: "Booking" },
  { label: "Payment", value: "Payment" },
  { label: "User", value: "User" },
  { label: "Coupon", value: "Coupon" },
  { label: "Review", value: "Review" },
  { label: "Waitlist", value: "Waitlist" },
];

const ACTION_OPTIONS = [
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
  { label: "Cancel", value: "CANCEL" },
  { label: "Status Change", value: "STATUS_CHANGE" },
  { label: "Role Change", value: "ROLE_CHANGE" },
  { label: "Suspend", value: "SUSPEND" },
  { label: "Check In", value: "CHECK_IN" },
  { label: "Payment Success", value: "PAYMENT_SUCCESS" },
  { label: "Refund", value: "REFUND" },
  { label: "Coupon Create", value: "COUPON_CREATE" },
];

const ACTION_COLORS: Record<string, string> = {
  CREATE:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  UPDATE: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
  DELETE: "bg-destructive/10 text-destructive border-destructive/30",
  SOFT_DELETE: "bg-destructive/10 text-destructive border-destructive/30",
  CANCEL:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  STATUS_CHANGE:
    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
  ROLE_CHANGE:
    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
  SUSPEND: "bg-destructive/10 text-destructive border-destructive/30",
  CHECK_IN:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  PAYMENT_SUCCESS:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  REFUND:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  COUPON_CREATE:
    "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
};

export function AdminAuditLogs() {
  const { values, setFilter } = useUrlFilters(FILTER_DEFAULTS);

  const { data, isLoading, isError, refetch } = useAuditLogs({
    entityType: values.entityType || undefined,
    action: values.action ? (values.action as AuditAction) : undefined,
    page: Number(values.page) || 1,
    limit: 30,
  });

  const columns: Column<AuditLog>[] = [
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
            ACTION_COLORS[row.action] ??
            "border-border bg-muted text-muted-foreground"
          }`}
        >
          {row.action.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      render: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-medium">{row.entityType}</p>
          <p className="text-muted-foreground truncate font-mono text-xs">
            {row.entityId.slice(0, 12)}…
          </p>
        </div>
      ),
    },
    {
      key: "user",
      header: "Actor",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm">{row.user?.name ?? "System"}</p>
          <p className="text-muted-foreground truncate text-xs">
            {row.user?.email ?? ""}
          </p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Details",
      render: (row) => (
        <p className="text-muted-foreground max-w-md truncate text-xs">
          {row.description ?? "—"}
        </p>
      ),
    },
    {
      key: "when",
      header: "When",
      className: "text-right",
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {format(new Date(row.createdAt), "MMM d, yyyy · h:mm a")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Audit Logs
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Every state-changing action across the platform.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FilterSelect
          value={values.entityType ?? ""}
          options={ENTITY_OPTIONS}
          placeholder="Entity type"
          onValueChange={(v) => setFilter({ entityType: v })}
        />
        <FilterSelect
          value={values.action ?? ""}
          options={ACTION_OPTIONS}
          placeholder="Action"
          onValueChange={(v) => setFilter({ action: v })}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && !data ? (
            <TableSkeleton rows={12} />
          ) : isError ? (
            <ErrorState
              title="Couldn't load audit logs"
              action={
                <Button variant="outline" onClick={() => refetch()}>
                  Try again
                </Button>
              }
            />
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No audit logs match these filters"
              description="Try clearing the entity type or action filter."
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                rows={data.items}
                rowKey={(row) => row.id}
              />
              <div className="pt-4">
                <Pagination meta={data.pagination} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
