"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  eventLocationSchema,
  type EventLocationValues,
} from "@/lib/validations/event";

interface StepLocationProps {
  initial: EventLocationValues | null;
  onNext: (values: EventLocationValues) => void;
  onBack: () => void;
}

export function StepLocation({ initial, onNext, onBack }: StepLocationProps) {
  const form = useForm<EventLocationValues>({
    resolver: zodResolver(eventLocationSchema),
    defaultValues: initial ?? {
      venue: "",
      address: "",
      city: "",
      country: "Bangladesh",
      isVirtual: false,
      virtualLink: "",
      startDate: "",
      endDate: "",
    },
  });

  const isVirtual = form.watch("isVirtual");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-5">
        <FormField
          control={form.control}
          name="isVirtual"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  id="isVirtual"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(Boolean(v))}
                />
              </FormControl>
              <div className="flex-1">
                <Label htmlFor="isVirtual" className="cursor-pointer">
                  This is a virtual event
                </Label>
                <p className="text-muted-foreground text-xs">
                  Attendees will join online instead of showing up at a venue.
                </p>
              </div>
            </FormItem>
          )}
        />

        {isVirtual ? (
          <FormField
            control={form.control}
            name="virtualLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Virtual event link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Venue name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bangabandhu ICC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Street address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Dhaka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Bangladesh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date & time</FormLabel>
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
                <FormLabel>End date & time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
