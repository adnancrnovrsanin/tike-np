"use client";

import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Search({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full max-w-[300px]">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
      <Input
        {...props}
        className={cn(
          "pl-10 border-2 border-[#262626] rounded-lg bg-white",
          className
        )}
        placeholder="Nike Airforce 1"
      />
    </div>
  );
}
