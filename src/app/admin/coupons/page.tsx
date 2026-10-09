import type { Metadata } from "next";
import { AdminCoupons } from "@/components/dashboard/admin-coupons";

export const metadata: Metadata = {
  title: "Coupons",
  robots: { index: false, follow: false },
};

export default function AdminCouponsPage() {
  return <AdminCoupons />;
}
