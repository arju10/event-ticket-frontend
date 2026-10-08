"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  ticketTierSchema,
  type TicketTierValues,
} from "@/lib/validations/event";
import {
  useCreateTicketTier,
  useUpdateTicketTier,
} from "@/hooks/use-event-mutations-tiers";
import type { TicketTier } from "@/types/models";

interface TicketTierDialogProps {
  eventId: string;
  tier?: TicketTier;
  trigger?: ReactNode;
}

export function TicketTierDialog({
  eventId,
  tier,
  trigger,
}: TicketTierDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(tier);
  const create = useCreateTicketTier(eventId);
  const update = useUpdateTicketTier(eventId);

  const form = useForm<TicketTierValues>({
    resolver: zodResolver(ticketTierSchema),
    defaultValues: tier
      ? {
          name: tier.name,
          description: tier.description ?? "",
          price: tier.price,
          quantity: tier.quantity,
          minPurchase: tier.minPurchase,
          maxPurchase: tier.maxPurchase,
          includes: tier.includes?.join(", ") ?? "",
        }
      : {
          name: "",
          description: "",
          price: 0,
          quantity: 100,
          minPurchase: 1,
          maxPurchase: 4,
          includes: "",
        },
  });

  function submit(values: TicketTierValues) {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      price: Number(values.price),
      quantity: Number(values.quantity),
      minPurchase: Number(values.minPurchase),
      maxPurchase: Number(values.maxPurchase),
      includes: values.includes
        ? values.includes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    };

    if (isEdit && tier) {
      update.mutate(
        { tierId: tier.id, payload },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  }

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add tier
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit tier" : "Add a ticket tier"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="text-foreground space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="General, VIP, Early Bird..."
                      {...field}
                    />
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Standard admission" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel>Min per user</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPurchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max per user</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="includes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Includes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Lunch, Swag bag, VIP Lounge"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add tier
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
