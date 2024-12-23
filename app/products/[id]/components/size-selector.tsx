// app/products/[id]/components/size-selector.tsx
"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProductVariant } from "@prisma/client";

interface SizeSelectorProps {
    variants: ProductVariant[];
    onSelect?: (variantId: number | null) => void;
}

export default function SizeSelector({ variants, onSelect }: SizeSelectorProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

    const handleSelect = (variant: ProductVariant) => {
        const newId = selectedVariantId === variant.id ? null : variant.id;
        setSelectedVariantId(newId);
        onSelect?.(newId);
    };

    return (
        <div className="grid grid-cols-7 gap-2">
            {variants.map((variant) => {
                const size = variant.shoeSize || variant.clothingSize;
                const isSelected = selectedVariantId === variant.id;
                const isAvailable = variant.quantity > 0;

                return (
                    <button
                        key={variant.id}
                        onClick={() => handleSelect(variant)}
                        disabled={!isAvailable}
                        className={cn(
                            "h-16 rounded-lg border-2 border-[#262626] font-medium transition-colors",
                            isSelected && "bg-[#fd9745] text-white",
                            isAvailable ? "hover:bg-[#fd9745]/10" : "opacity-50 cursor-not-allowed",
                        )}
                    >
                        {size}
                    </button>
                );
            })}
        </div>
    );
}