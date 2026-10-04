"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import type { PaginationMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginationMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const { setPage } = usePagination();

  if (meta.totalPages <= 1) return null;

  const page = meta.page;
  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(meta.totalPages, start + windowSize - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 pt-4"
      aria-label="Pagination"
    >
      <p className="text-muted-foreground text-sm">
        Page <span className="text-foreground font-medium">{meta.page}</span> of{" "}
        {meta.totalPages} · {meta.total} total
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page - 1)}
          disabled={!meta.hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            onClick={() => setPage(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page + 1)}
          disabled={!meta.hasNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
