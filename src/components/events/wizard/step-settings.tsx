"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  eventSettingsSchema,
  type EventSettingsValues,
} from "@/lib/validations/event";
import type { WizardState } from "@/hooks/use-event-wizard";

interface StepSettingsProps {
  initial: EventSettingsValues | null;
  state: WizardState;
  onBack: () => void;
  onSubmit: (values: EventSettingsValues) => void;
  isSubmitting: boolean;
}

export function StepSettings({
  initial,
  state,
  onBack,
  onSubmit,
  isSubmitting,
}: StepSettingsProps) {
  const form = useForm<EventSettingsValues>({
    resolver: zodResolver(eventSettingsSchema),
    defaultValues: initial ?? {
      maxTicketsPerUser: 4,
      isWaitlistEnabled: true,
      allowRefund: true,
      ageRestriction: "",
      bannerImage: "",
    },
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="bg-muted/30 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Review</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <Row label="Title" value={state.basics?.title ?? "—"} />
              <Row label="Category" value={state.basics?.category ?? "—"} />
              {state.location ? (
                <>
                  <Row
                    label="When"
                    value={`${format(new Date(state.location.startDate), "MMM d, yyyy · h:mm a")} → ${format(new Date(state.location.endDate), "MMM d, yyyy · h:mm a")}`}
                  />
                  <Row
                    label="Where"
                    value={`${state.location.venue}, ${state.location.city}`}
                  />
                </>
              ) : null}
              <Row
                label="Tiers"
                value={
                  state.tiers.length > 0
                    ? state.tiers
                        .map((t) => `${t.name} (৳${t.price}×${t.quantity})`)
                        .join(", ")
                    : "—"
                }
              />
            </dl>
          </div>

          <FormField
            control={form.control}
            name="maxTicketsPerUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max tickets per user</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Banner image URL{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ageRestriction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Age restriction{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 18"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="isWaitlistEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <div>
                    <Label className="cursor-pointer">
                      Enable waitlist when sold out
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Attendees can join a queue and get offered freed slots.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowRefund"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-lg border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <div>
                    <Label className="cursor-pointer">Allow refunds</Label>
                    <p className="text-muted-foreground text-xs">
                      Refunds follow the platform policy: 100% / 50% / 0%.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Create event
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
