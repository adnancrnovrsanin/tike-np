// app/products/[id]/components/favorite-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
    productId: number;
    initialIsFavorited: boolean;
}

export function FavoriteButton({ productId, initialIsFavorited }: FavoriteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const router = useRouter();
    const supabase = createClient();

    const handleFavoriteToggle = async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const res = await fetch(`/api/products/${productId}/favorite`, {
                method: isFavorited ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error();

            setIsFavorited(!isFavorited);
            toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update favorites");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
    );
}