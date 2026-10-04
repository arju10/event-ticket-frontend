"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function usePagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.max(1, Number(searchParams.get("limit") ?? 20));

  const setPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage <= 1) params.delete("page");
      else params.set("page", String(nextPage));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { page, limit, setPage };
}
