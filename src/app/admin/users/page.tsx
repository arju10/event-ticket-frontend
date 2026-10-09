import type { Metadata } from "next";
import { AdminUsersList } from "@/components/dashboard/admin-users-list";

export const metadata: Metadata = {
  title: "User Management",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <AdminUsersList />;
}
