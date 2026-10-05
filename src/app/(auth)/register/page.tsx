import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create an EventHub account to book tickets or host your own events.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Join as an attendee or start hosting your own events.
        </p>
      </div>

      <RegisterForm />

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
