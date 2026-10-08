"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FilterSelect } from "@/components/shared/filter-select";
import {
  eventBasicsSchema,
  type EventBasicsValues,
} from "@/lib/validations/event";
import { EVENT_CATEGORIES } from "@/lib/constants/event-constants";

interface StepBasicsProps {
  initial: EventBasicsValues | null;
  onNext: (values: EventBasicsValues) => void;
}

export function StepBasics({ initial, onNext }: StepBasicsProps) {
  const form = useForm<EventBasicsValues>({
    resolver: zodResolver(eventBasicsSchema),
    defaultValues: initial ?? {
      title: "",
      description: "",
      category: "",
      subCategory: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-5"
        id="event-basics-form"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tech Conference 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (min 50 characters)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="What makes this event special? Who should attend? What will they learn or experience?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FilterSelect
                  value={field.value}
                  options={EVENT_CATEGORIES.map((c) => ({
                    label: c,
                    value: c,
                  }))}
                  placeholder="Select a category"
                  allowClear={false}
                  onValueChange={(v) => field.onChange(v)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sub-category{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Technology, Music, Fitness"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
