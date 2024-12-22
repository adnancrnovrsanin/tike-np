// app/products/components/ProductFilters.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "@/components/search";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductFiltersProps {
  categories: Array<{ id: number; name: string }>;
  brands: string[];
  colors: string[];
}

export function ProductFilters({
  categories,
  brands,
  colors,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search bar */}
      <div className="w-full max-w-[300px]">
        <Search
          defaultValue={searchParams.get("query") ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="text-sm text-gray-500 mt-1">
          {searchParams.get("query") ? "59 results" : ""}{" "}
          {/* Ovde možete dodati stvarni broj rezultata */}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          onValueChange={(value) => updateFilters("category", value || null)}
          defaultValue={searchParams.get("category") ?? undefined}
        >
          <SelectTrigger className="w-[150px] border-2 border-[#262626]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilters("gender", value || null)}
          defaultValue={searchParams.get("gender") ?? undefined}
        >
          <SelectTrigger className="w-[150px] border-2 border-[#262626]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilters("brand", value || null)}
          defaultValue={searchParams.get("brand") ?? undefined}
        >
          <SelectTrigger className="w-[150px] border-2 border-[#262626]">
            <SelectValue placeholder="Brands" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => updateFilters("color", value || null)}
          defaultValue={searchParams.get("color") ?? undefined}
        >
          <SelectTrigger className="w-[150px] border-2 border-[#262626]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
