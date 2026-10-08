"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StepBasics } from "./wizard/step-basics";
import { StepLocation } from "./wizard/step-location";
import { StepTiers } from "./wizard/step-tiers";
import { StepSettings } from "./wizard/step-settings";
import { useEventWizard } from "@/hooks/use-event-wizard";
import { useCreateEvent } from "@/hooks/use-event-mutations";
import { useCreateTicketTier } from "@/hooks/use-event-mutations-tiers";
import { ROUTES } from "@/lib/constants/routes";

const STEPS = [
  { id: 1, title: "Basics" },
  { id: 2, title: "Location & Dates" },
  { id: 3, title: "Ticket Tiers" },
  { id: 4, title: "Settings & Review" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export function EventWizard() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const router = useRouter();
  const wizard = useEventWizard();
  const createEvent = useCreateEvent();

  function goNext() {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as StepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as StepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    const { basics, location, tiers, settings } = wizard.state;
    if (!basics || !location || !settings || tiers.length === 0) {
      toast.error("Please complete all steps before publishing");
      return;
    }

    const payload = {
      title: basics.title,
      description: basics.description,
      category: basics.category,
      subCategory: basics.subCategory || undefined,
      venue: location.venue,
      address: location.address,
      city: location.city,
      country: location.country,
      isVirtual: location.isVirtual,
      virtualLink:
        location.isVirtual && location.virtualLink
          ? location.virtualLink
          : undefined,
      startDate: new Date(location.startDate).toISOString(),
      endDate: new Date(location.endDate).toISOString(),
      maxTicketsPerUser: Number(settings.maxTicketsPerUser),
      isWaitlistEnabled: settings.isWaitlistEnabled,
      allowRefund: settings.allowRefund,
      ageRestriction: settings.ageRestriction
        ? Number(settings.ageRestriction)
        : undefined,
      bannerImage: settings.bannerImage || undefined,
    };

    createEvent.mutate(payload, {
      onSuccess: async (event) => {
        // Now create each ticket tier in sequence
        const tierCreator = async () => {
          for (const tier of tiers) {
            await new Promise<void>((resolve, reject) => {
              // Use the API directly rather than the hook so we can await in a loop
              import("@/lib/api/ticket-tiers").then(({ ticketTiersApi }) => {
                ticketTiersApi
                  .create(event.id, {
                    name: tier.name,
                    description: tier.description,
                    price: Number(tier.price),
                    quantity: Number(tier.quantity),
                    minPurchase: Number(tier.minPurchase),
                    maxPurchase: Number(tier.maxPurchase),
                    includes: tier.includes
                      ? tier.includes
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : undefined,
                  })
                  .then(() => resolve())
                  .catch(reject);
              });
            });
          }
        };

        try {
          await tierCreator();
          wizard.reset();
          toast.success("Event created — now publish it when ready");
          router.push(ROUTES.organizerEventDetail(event.id));
        } catch {
          toast.error(
            "Event created, but some tiers failed. Add them manually in the manage page.",
          );
          router.push(ROUTES.organizerEventDetail(event.id));
        }
      },
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Create a new event
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Four quick steps and you're ready to publish.
        </p>
      </div>

      {/* Step indicator */}
      <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <li key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : step.id}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  active && "font-medium",
                  !active && "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 ? (
                <ChevronRight className="text-muted-foreground hidden h-4 w-4 sm:inline" />
              ) : null}
            </li>
          );
        })}
      </ol>

      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 ? (
            <StepBasics
              initial={wizard.state.basics}
              onNext={(values) => {
                wizard.setBasics(values);
                goNext();
              }}
            />
          ) : null}
          {currentStep === 2 ? (
            <StepLocation
              initial={wizard.state.location}
              onNext={(values) => {
                wizard.setLocation(values);
                goNext();
              }}
              onBack={goBack}
            />
          ) : null}
          {currentStep === 3 ? (
            <StepTiers
              initial={wizard.state.tiers}
              onNext={(values) => {
                wizard.setTiers(values);
                goNext();
              }}
              onBack={goBack}
            />
          ) : null}
          {currentStep === 4 ? (
            <StepSettings
              initial={wizard.state.settings}
              state={wizard.state}
              onBack={goBack}
              onSubmit={(settings) => {
                wizard.setSettings(settings);
                void handleSubmit();
              }}
              isSubmitting={createEvent.isPending}
            />
          ) : null}
        </CardContent>
      </Card>

      {createEvent.isPending ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Publishing your event...
        </div>
      ) : null}
    </div>
  );
}
