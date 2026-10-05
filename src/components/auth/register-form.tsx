"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, Ticket, CalendarCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegister } from "@/hooks/use-auth-mutations";
import { extractFieldErrors } from "@/lib/api/client";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: Array<{
  value: RegisterValues["role"];
  label: string;
  description: string;
  Icon: typeof Ticket;
}> = [
  {
    value: "ATTENDEE",
    label: "Attendee",
    description: "Book tickets to events",
    Icon: Ticket,
  },
  {
    value: "ORGANIZER",
    label: "Organizer",
    description: "Create and manage events",
    Icon: CalendarCog,
  },
];

export function RegisterForm() {
  const register = useRegister();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "ATTENDEE",
    },
  });

  useEffect(() => {
    const fieldErrors = extractFieldErrors(register.error);
    if (fieldErrors) {
      for (const [field, message] of Object.entries(fieldErrors)) {
        form.setError(field as keyof RegisterValues, { message });
      }
    }
  }, [register.error, form]);

  function onSubmit(values: RegisterValues) {
    register.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selector */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I want to join as</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map(({ value, label, description, Icon }) => {
                  const selected = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/5 ring-primary ring-1"
                          : "hover:bg-muted/50",
                      )}
                      aria-pressed={selected}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-muted-foreground text-xs">
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="John Doe"
                  disabled={register.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={register.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+880 1700 000000"
                  disabled={register.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={register.isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                At least 8 characters, one uppercase, one lowercase, one number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={register.isPending}
          aria-busy={register.isPending}
        >
          {register.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
