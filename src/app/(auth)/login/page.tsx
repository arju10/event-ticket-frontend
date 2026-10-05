import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { DemoLoginGrid } from "@/components/auth/demo-login-grid";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your EventHub account or try a demo login.",
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to continue to your dashboard.
        </p>
      </div>

      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

      <div className="relative">
        <Separator />
        <span className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs uppercase">
          or
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span aria-hidden>🚀</span>
          <span>Quick demo login</span>
        </div>
        <Suspense fallback={<DemoGridSkeleton />}>
          <DemoLoginGrid />
        </Suspense>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Don't have an account?{" "}
        <Link
          href={ROUTES.register}
          className="text-primary font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

function DemoGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full sm:col-span-2" />
    </div>
  );
}
