"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value?: string;
  options: FilterOption[];
  placeholder?: string;
  onValueChange: (value: string) => void;
  className?: string;
  allowClear?: boolean;
}

const ALL_VALUE = "__all__";

export function FilterSelect({
  value,
  options,
  placeholder = "Select...",
  onValueChange,
  className,
  allowClear = true,
}: FilterSelectProps) {
  return (
    <Select
      value={value && value.length > 0 ? value : ALL_VALUE}
      onValueChange={(v: string) => onValueChange(v === ALL_VALUE ? "" : v)}
    >
      <SelectTrigger className={cn("w-full sm:w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowClear ? <SelectItem value={ALL_VALUE}>All</SelectItem> : null}
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
