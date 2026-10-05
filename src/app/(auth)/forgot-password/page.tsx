import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your EventHub password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <Link
        href={ROUTES.login}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
