"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { toast } from "sonner";
import SizeSelector from "@/app/products/[id]/components/size-selector";
import { ProductVariant } from "@prisma/client";

interface ProductActionsProps {
  productId: number;
  variants: ProductVariant[];
  initialIsFavorited: boolean;
  initialIsAddedToCart: boolean;
  basePrice: number;
  margin: number;
  id: number;
}

export function ProductActions({
  productId,
  variants,
  initialIsFavorited,
  initialIsAddedToCart,
  basePrice,
  margin,
  id,
}: ProductActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isAddedToCart, setIsAddedToCart] = useState(initialIsAddedToCart);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );

  const router = useRouter();
  const supabase = createClient();

  // Pomoćna funkcija za praćenje aktivnosti
  const trackActivity = async (activityType: string) => {
    try {
      const finalPrice = basePrice * (1 + margin);

      await fetch("/api/user/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          activityType,
          metadata: {
            price: finalPrice,
          },
        }),
      });
    } catch (error) {
      console.error("Failed to track activity:", error);
    }
  };

  // Funkcija za dodavanje/uklanjanje iz korpe
  const handleToggleCart = async () => {
    try {
      setIsLoading(true);

      // Ako još nije odabrana varijanta, a proizvod nije u korpi, vrati grešku
      if (!selectedVariantId && !isAddedToCart) {
        toast.error("Please select a size first");
        return;
      }

      // Proveri da li je korisnik ulogovan
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!isAddedToCart) {
        // Ako ga NEMA u korpi => DODAJ u korpu
        await trackActivity("CART_ADD");
        const res = await fetch(`/api/products/${productId}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId: selectedVariantId }),
        });
        if (!res.ok) throw new Error();
        setIsAddedToCart(true);
        toast.success("Added to cart!");
      } else {
        // Ako ga VEĆ ima u korpi => UKLONI iz korpe
        await trackActivity("CART_REMOVE");
        const res = await fetch(`/api/products/${productId}/cart`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId: selectedVariantId }),
        });
        if (!res.ok) throw new Error();
        setIsAddedToCart(false);
        toast.success("Removed from cart!");
      }

      router.refresh();
    } catch (error) {
      console.error("Error adding/removing item to/from cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcija za dodavanje/uklanjanje iz “Favorites”
  const handleFavoriteToggle = async () => {
    try {
      setIsLoading(true);

      // Proveri da li je korisnik ulogovan
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!isFavorited) {
        await trackActivity("FAVORITE_ADD");
      } else {
        await trackActivity("FAVORITE_REMOVE");
      }

      // POST ako nije favorit, DELETE ako jeste
      const res = await fetch(`/api/products/${productId}/favorite`, {
        method: isFavorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok)
        throw new Error(
          isFavorited
            ? "Failed to remove from favorites"
            : "Failed to add to favorites"
        );

      setIsFavorited((prev) => !prev);
      toast.success(
        isFavorited ? "Removed from favorites!" : "Added to favorites!"
      );
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
        {/* Taster za Favorite */}
        <Button
          variant="neutral"
          size="icon"
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          className={`w-12 h-12 rounded-full ${
            isFavorited ? "text-red-500 fill-red-500" : ""
          }`}
        >
          <Heart className="w-6 h-6" />
        </Button>

        {/* Taster za Cart (dodavanje/uklanjanje) */}
        <Button
          onClick={handleToggleCart}
          disabled={isLoading || (!selectedVariantId && !isAddedToCart)}
          className="flex-1 h-12 bg-[#fd9745] hover:bg-[#fd9745]/90 text-black"
        >
          {isAddedToCart ? "REMOVE FROM CART" : "ADD TO CART"}
        </Button>
      </div>
    </div>
  );
}
