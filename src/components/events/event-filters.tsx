"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { useUrlFilters } from "@/hooks/use-url-filters";
import {
  BANGLADESH_CITIES,
  EVENT_CATEGORIES,
} from "@/lib/constants/event-constants";

interface EventFiltersProps {
  defaults: {
    search: string;
    category: string;
    city: string;
    sortBy: string;
    sortOrder: string;
  };
}

export function EventFilters({ defaults }: EventFiltersProps) {
  const { values, setFilter, reset } = useUrlFilters(defaults);

  const hasActiveFilters =
    Boolean(values.search) ||
    Boolean(values.category) ||
    Boolean(values.city) ||
    values.sortBy !== defaults.sortBy ||
    values.sortOrder !== defaults.sortOrder;

  const categoryOptions = EVENT_CATEGORIES.map((c) => ({
    label: c,
    value: c,
  }));
  const cityOptions = BANGLADESH_CITIES.map((c) => ({ label: c, value: c }));
  const sortOptions = [
    { label: "Date (soonest)", value: "startDate:asc" },
    { label: "Date (latest)", value: "startDate:desc" },
    { label: "Newest created", value: "createdAt:desc" },
  ];

  const currentSort = `${values.sortBy}:${values.sortOrder}`;

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput
          value={values.search ?? ""}
          onValueChange={(v) => setFilter({ search: v })}
          placeholder="Search events..."
          className="sm:col-span-2 lg:col-span-1"
        />

        <FilterSelect
          value={values.category ?? ""}
          options={categoryOptions}
          placeholder="Category"
          onValueChange={(v) => setFilter({ category: v })}
        />

        <FilterSelect
          value={values.city ?? ""}
          options={cityOptions}
          placeholder="City"
          onValueChange={(v) => setFilter({ city: v })}
        />

        <FilterSelect
          value={currentSort}
          options={sortOptions}
          placeholder="Sort by"
          allowClear={false}
          onValueChange={(v) => {
            const [sortBy = "startDate", sortOrder = "asc"] = v.split(":");
            setFilter({ sortBy, sortOrder });
          }}
        />
      </div>

      {hasActiveFilters ? (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="mr-1 h-3.5 w-3.5" />
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}
