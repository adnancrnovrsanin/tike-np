// app/products/[id]/components/add-to-cart-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
    productId: number;
    variantId: number | null;
}

export function AddToCartButton({ productId, variantId }: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAddToCart = async () => {
        try {
            if (!variantId) {
                toast.error("Please select a size");
                return;
            }

            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const res = await fetch(`/api/products/${productId}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId }),
            });

            if (!res.ok) throw new Error();

            toast.success("Added to cart!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1 h-12 bg-[#fd9745] hover:bg-[#fd9745]/90 text-black"
        >
            ADD TO CART
        </Button>
    );
}