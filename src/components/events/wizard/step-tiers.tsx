"use client";

import { useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ticketTierSchema,
  type TicketTierValues,
} from "@/lib/validations/event";

const stepTiersSchema = z.object({
  tiers: z.array(ticketTierSchema).min(1, "Add at least one ticket tier"),
});

type StepTiersValues = z.infer<typeof stepTiersSchema>;

interface StepTiersProps {
  initial: TicketTierValues[];
  onNext: (values: TicketTierValues[]) => void;
  onBack: () => void;
}

const DEFAULT_TIER: TicketTierValues = {
  name: "",
  description: "",
  price: 0,
  quantity: 100,
  minPurchase: 1,
  maxPurchase: 4,
  includes: "",
};

export function StepTiers({ initial, onNext, onBack }: StepTiersProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StepTiersValues>({
    resolver: zodResolver(stepTiersSchema),
    defaultValues: {
      tiers:
        initial.length > 0 ? initial : [{ ...DEFAULT_TIER, name: "General" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tiers",
  });

  function submit(values: StepTiersValues) {
    onNext(values.tiers);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Ticket tiers</h3>
          <p className="text-muted-foreground text-xs">
            Define each tier with its own price and quantity.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ...DEFAULT_TIER })}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add tier
        </Button>
      </div>

      {errors.tiers && typeof errors.tiers.message === "string" ? (
        <p className="text-destructive text-sm">{errors.tiers.message}</p>
      ) : null}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="border-muted">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Tier {index + 1}</Badge>
                {fields.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Controller
                  control={control}
                  name={`tiers.${index}.name`}
                  render={({ field: f, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label>Name</Label>
                      <Input placeholder="General, VIP..." {...f} />
                      {fieldState.error ? (
                        <p className="text-destructive text-xs">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`tiers.${index}.description`}
                  render={({ field: f }) => (
                    <div className="space-y-1.5">
                      <Label>Short description</Label>
                      <Input placeholder="Standard admission" {...f} />
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`tiers.${index}.price`}
                  render={({ field: f, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label>Price (৳)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        {...f}
                        value={f.value}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                      />
                      {fieldState.error ? (
                        <p className="text-destructive text-xs">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`tiers.${index}.quantity`}
                  render={({ field: f, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label>Total quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        {...f}
                        value={f.value}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                      />
                      {fieldState.error ? (
                        <p className="text-destructive text-xs">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`tiers.${index}.minPurchase`}
                  render={({ field: f }) => (
                    <div className="space-y-1.5">
                      <Label>Min per user</Label>
                      <Input
                        type="number"
                        min={1}
                        {...f}
                        value={f.value}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                      />
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`tiers.${index}.maxPurchase`}
                  render={({ field: f, fieldState }) => (
                    <div className="space-y-1.5">
                      <Label>Max per user</Label>
                      <Input
                        type="number"
                        min={1}
                        {...f}
                        value={f.value}
                        onChange={(e) => f.onChange(Number(e.target.value))}
                      />
                      {fieldState.error ? (
                        <p className="text-destructive text-xs">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name={`tiers.${index}.includes`}
                  render={({ field: f }) => (
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>
                        Includes{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          (comma-separated, optional)
                        </span>
                      </Label>
                      <Textarea
                        rows={2}
                        placeholder="Lunch, Swag bag, VIP Lounge access"
                        {...f}
                      />
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
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
  );
}
