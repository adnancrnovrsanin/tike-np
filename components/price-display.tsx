"use client";

import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  basePrice: number;
  margin: number;
  personalizedPrice?: number | null;
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "lg";
}

export function PriceDisplay({
  basePrice,
  margin,
  personalizedPrice = null,
  isLoading = false,
  className,
  size = "sm",
}: PriceDisplayProps) {
  const originalPrice = basePrice * (1 + margin);
  const hasDiscount =
    personalizedPrice != null && personalizedPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - personalizedPrice) / originalPrice) * 100)
    : 0;

  const containerClasses = cn(
    "flex items-end gap-3 font-outfit relative",
    size === "lg" ? "text-4xl" : "text-2xl",
    className
  );

  const priceTagClasses = cn(
    "absolute -top-4 -right-2 bg-red-500 text-white px-2 py-1 text-sm transform rotate-12 border-2 border-black shadow-[2px_2px_0px_0px_#000000] z-10",
    size === "lg" ? "text-lg -top-6" : "text-sm -top-4"
  );

  const originalPriceClasses = cn(
    "relative text-gray-500 line-through decoration-red-500 decoration-2",
    size === "lg" ? "text-2xl" : "text-lg"
  );

  const discountedPriceClasses = cn(
    "font-bold relative bg-yellow-300 px-2 border-2 border-black shadow-[4px_4px_0px_0px_#000000] transform transition-transform hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000000]",
    size === "lg" ? "text-4xl p-2" : "text-2xl"
  );

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="bg-gray-200 animate-pulse h-8 w-32 rounded"></div>
      </div>
    );
  }

  if (hasDiscount && personalizedPrice != null) {
    return (
      <div className={containerClasses}>
        <span className={originalPriceClasses}>
          ${originalPrice.toFixed(2)}
        </span>
        <div className="relative">
          <span className={priceTagClasses}>-{discountPercentage}%</span>
          <span className={discountedPriceClasses}>
            ${personalizedPrice.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <span className={discountedPriceClasses}>
        ${originalPrice.toFixed(2)}
      </span>
    </div>
  );
}
