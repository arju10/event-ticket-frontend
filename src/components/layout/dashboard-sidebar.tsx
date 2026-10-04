"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface DashboardSidebarProps {
  items: SidebarNavItem[];
  title: string;
  onNavigate?: () => void;
}

export function DashboardSidebar({
  items,
  title,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-muted/20 flex h-full w-64 flex-col border-r">
      <div className="border-border flex h-16 items-center border-b px-6">
        <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          {title}
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
