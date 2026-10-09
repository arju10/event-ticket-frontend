import type { Metadata } from "next";
import { AdminAuditLogs } from "@/components/dashboard/admin-audit-logs";

export const metadata: Metadata = {
  title: "Audit Logs",
  robots: { index: false, follow: false },
};

export default function AdminAuditLogsPage() {
  return <AdminAuditLogs />;
}
