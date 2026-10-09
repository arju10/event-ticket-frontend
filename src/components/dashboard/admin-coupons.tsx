"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2, Plus, Tag, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useCreateCoupon } from "@/hooks/use-create-coupon";

const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(30)
      .transform((v) => v.toUpperCase()),
    description: z.string().max(300).optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.coerce.number().positive("Must be positive"),
    minPurchase: z.coerce.number().nonnegative().optional(),
    maxDiscount: z.coerce.number().positive().optional(),
    usageLimit: z.coerce.number().int().positive().optional(),
    perUserLimit: z.coerce.number().int().positive().default(1),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (d) => new Date(d.endDate).getTime() > new Date(d.startDate).getTime(),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )
  .refine((d) => d.discountType !== "PERCENTAGE" || d.discountValue <= 100, {
    message: "Percentage cannot exceed 100",
    path: ["discountValue"],
  });

type CouponValues = z.infer<typeof couponSchema>;

export function AdminCoupons() {
  const create = useCreateCoupon();
  const [recentCoupons, setRecentCoupons] = useState<
    Array<{
      code: string;
      discountType: string;
      discountValue: number;
      createdAt: string;
    }>
  >([]);

  const form = useForm<CouponValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minPurchase: 0,
      maxDiscount: undefined,
      usageLimit: undefined,
      perUserLimit: 1,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
    },
  });

  const discountType = form.watch("discountType");

  function submit(values: CouponValues) {
    create.mutate(
      {
        code: values.code,
        description: values.description || undefined,
        discountType: values.discountType,
        discountValue: Number(values.discountValue),
        minPurchase: values.minPurchase
          ? Number(values.minPurchase)
          : undefined,
        maxDiscount: values.maxDiscount
          ? Number(values.maxDiscount)
          : undefined,
        usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
        perUserLimit: Number(values.perUserLimit),
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      },
      {
        onSuccess: (coupon) => {
          setRecentCoupons((prev) => [
            {
              code: coupon.code,
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              createdAt: coupon.createdAt,
            },
            ...prev,
          ]);
          form.reset({
            ...form.getValues(),
            code: "",
            description: "",
          });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Coupons
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create platform-wide discount codes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Create form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" />
              New coupon
            </CardTitle>
            <CardDescription>
              Discounts apply at checkout before payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SUMMER20"
                            className="font-mono uppercase"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">
                              Percentage (%)
                            </SelectItem>
                            <SelectItem value="FIXED">Fixed (৳)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="20% off summer promo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount value{" "}
                          {discountType === "PERCENTAGE" ? "(%)" : "(৳)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={discountType === "PERCENTAGE" ? 1 : 0.01}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="perUserLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Per-user limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minPurchase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min purchase (৳)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {discountType === "PERCENTAGE" ? (
                    <FormField
                      control={form.control}
                      name="maxDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max discount cap (৳)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}

                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total usage limit (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starts</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ends</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormDescription>
                  Attendees apply this code at checkout. The backend validates
                  all rules inside the booking transaction.
                </FormDescription>

                <Button
                  type="submit"
                  disabled={create.isPending}
                  className="w-full"
                >
                  {create.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create coupon
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info + recent */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Percent className="h-4 w-4" />
                How coupons work
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3 text-sm">
              <p>
                The discount is applied to the booking subtotal, then capped by{" "}
                <strong>max discount</strong> and finally by the total — a
                coupon can never make a booking free-and-then-some.
              </p>
              <p>
                All rule checks run inside the same transaction as the booking,
                so two users can't both claim the last use of a limited coupon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Recently created this session
              </CardTitle>
              <CardDescription>
                Full list lives in the backend database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCoupons.length === 0 ? (
                <EmptyState
                  icon={Tag}
                  title="No coupons created yet"
                  description="Create one on the left to see it appear here."
                />
              ) : (
                <ul className="divide-y">
                  {recentCoupons.map((coupon) => (
                    <li
                      key={`${coupon.code}-${coupon.createdAt}`}
                      className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-mono text-sm font-medium">
                          {coupon.code}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(coupon.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `৳${coupon.discountValue}`}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
