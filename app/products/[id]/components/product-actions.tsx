// app/products/[id]/components/product-actions.tsx
"use client";

import {useState} from "react";
import {Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {createClient} from "@/supabase/client";
import { toast } from "sonner";
import SizeSelector from "@/app/products/[id]/components/size-selector";
import {ProductVariant} from "@prisma/client";

interface ProductActionsProps {
    productId: number;
    variants: ProductVariant[];
    initialIsFavorited: boolean;
}

export function ProductActions({
   productId,
   variants,
   initialIsFavorited,
}: ProductActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAddToCart = async () => {
        try {
            if (!selectedVariantId) {
                toast.error("Please select a size first");
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
                body: JSON.stringify({ variantId: selectedVariantId }),
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

    const handleFavoriteToggle = async () => {
        try {
            setIsLoading(true);
            const {data: {user}} = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const res = await fetch(`/api/products/${productId}/favorite`, {
                method: isFavorited ? "DELETE" : "POST",
                headers: {"Content-Type": "application/json"},
            });

            if (!res.ok) throw new Error(isFavorited ? "Failed to remove from favorites" : "Failed to add to favorites");

            setIsFavorited(!isFavorited);
            toast.success(isFavorited ? "Removed from favorites!" : "Added to favorites!");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <SizeSelector
                variants={variants}
                onSelect={(variant) => setSelectedVariantId(variant)}
            />

            <div className="flex items-center gap-4">
                <Button
                    variant="neutral"
                    size="icon"
                    onClick={handleFavoriteToggle}
                    disabled={isLoading}
                    className={`w-12 h-12 rounded-full ${
                        isFavorited ? "text-red-500 fill-red-500" : ""
                    }`}
                >
                    <Heart className="w-6 h-6" />
                </Button>

                <Button
                    onClick={handleAddToCart}
                    disabled={isLoading || !selectedVariantId}
                    className="flex-1 h-12 bg-[#fd9745] hover:bg-[#fd9745]/90 text-black"
                >
                    ADD TO CART
                </Button>
            </div>
        </div>
    );
}