"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterValue = string | number | undefined | null;

export function useUrlFilters<T extends Record<string, FilterValue>>(
  defaults: T,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const values = useMemo(() => {
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const raw = searchParams.get(String(key));
      if (raw !== null) {
        const defaultVal = defaults[key];
        result[key] = (
          typeof defaultVal === "number" ? Number(raw) : raw
        ) as T[keyof T];
      }
    }
    return result;
  }, [defaults, searchParams]);

  const setFilter = useCallback(
    (updates: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates) as [string, FilterValue][]) {
        if (
          v === undefined ||
          v === null ||
          v === "" ||
          v === defaults[k as keyof T]
        ) {
          params.delete(k);
        } else {
          params.set(k, String(v));
        }
      }
      // Reset page when a non-page filter changes
      if (!("page" in updates) && "page" in defaults) {
        params.delete("page");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams, defaults],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { values, setFilter, reset, searchParams };
}
