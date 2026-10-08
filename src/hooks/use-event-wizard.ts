"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  EventBasicsValues,
  EventLocationValues,
  EventSettingsValues,
  TicketTierValues,
} from "@/lib/validations/event";

export interface WizardState {
  basics: EventBasicsValues | null;
  location: EventLocationValues | null;
  tiers: TicketTierValues[];
  settings: EventSettingsValues | null;
}

const STORAGE_KEY = "etp_event_wizard_state";

const EMPTY: WizardState = {
  basics: null,
  location: null,
  tiers: [],
  settings: null,
};

export function useEventWizard() {
  const [state, setState] = useState<WizardState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  // Load from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as WizardState);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const setBasics = useCallback(
    (basics: EventBasicsValues) => setState((s) => ({ ...s, basics })),
    [],
  );
  const setLocation = useCallback(
    (location: EventLocationValues) => setState((s) => ({ ...s, location })),
    [],
  );
  const setTiers = useCallback(
    (tiers: TicketTierValues[]) => setState((s) => ({ ...s, tiers })),
    [],
  );
  const setSettings = useCallback(
    (settings: EventSettingsValues) => setState((s) => ({ ...s, settings })),
    [],
  );
  const reset = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(EMPTY);
  }, []);

  return {
    state,
    hydrated,
    setBasics,
    setLocation,
    setTiers,
    setSettings,
    reset,
  };
}
