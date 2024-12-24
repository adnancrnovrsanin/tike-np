"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export function ClearFiltersButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Proveravamo da li ima aktivnih filtera
  const hasActiveFilters = [
    "category",
    "gender",
    "brand",
    "color",
    "query",
  ].some((param) => searchParams.has(param));

  if (!hasActiveFilters) return null;

  return (
    <Button
      variant="neutral"
      className="ml-4 border-2 border-[#262626]"
      onClick={() => router.push("/products")}
    >
      Clear Filters
    </Button>
  );
}
