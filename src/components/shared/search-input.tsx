"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search...",
  className,
  debounceMs = 400,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, debounceMs);

  // Sync external → local (e.g. URL reset)
  useEffect(() => setLocal(value), [value]);

  // Push debounced value upward
  useEffect(() => {
    if (debounced !== value) onValueChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={local}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLocal(e.target.value)
        }
        placeholder={placeholder}
        className="pr-9 pl-9"
        aria-label={placeholder}
      />
      {local ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
          onClick={() => {
            setLocal("");
            onValueChange("");
          }}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
