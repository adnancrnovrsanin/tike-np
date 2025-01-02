"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { toast } from "sonner";
import SizeSelector from "@/app/products/[id]/components/size-selector";
import { ProductVariant } from "@prisma/client";
import { usePersonalizedPrice } from "@/hooks/use-personalized-prices";

interface ProductActionsProps {
  productId: number;
  variants: ProductVariant[];
  initialIsFavorited: boolean;
  initialIsAddedToCart: boolean;
  basePrice: number;
  margin: number;
  id: number;
  userData: {
    age: number | null | undefined;
    averageSpent: number | null | undefined;
    priceSensitivity: number | null | undefined;
  } | null;
}

export function ProductActions({
  productId,
  variants,
  initialIsFavorited,
  initialIsAddedToCart,
  basePrice,
  margin,
  id,
  userData,
}: ProductActionsProps) {
  const [actionLoading, setActionLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isAddedToCart, setIsAddedToCart] = useState(initialIsAddedToCart);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );

  const router = useRouter();
  const supabase = createClient();

  const {
    personalizedPrice: hookPersonalizedPrice,
    isLoading: priceIsLoading,
  } = usePersonalizedPrice(productId, basePrice, margin, userData);

  // Helper funkcija za praćenje aktivnosti
  const trackActivity = async (activityType: string) => {
    try {
      // Uzimamo "finalPrice" iz hookPersonalizedPrice ili računamo fallback
      const finalPrice = hookPersonalizedPrice || basePrice * (1 + margin);

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

  // Dodavanje/uklanjanje proizvoda iz korpe
  const handleToggleCart = async () => {
    try {
      setActionLoading(true);
      // Iz hook-a uzimamo "hookPersonalizedPrice", ali ga sada čuvamo u finalPrice
      const finalPrice = hookPersonalizedPrice || basePrice * (1 + margin);
      console.log("1. Starting cart toggle with:", {
        productId,
        basePrice,
        margin,
        finalPrice,
      });

      if (!isAddedToCart) {
        const requestData = {
          productId,
          personalizedPrice: finalPrice,
        };
        console.log("2. Sending request with:", requestData);

        let res;
        try {
          res = await fetch(`/api/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          });

          console.log("3. Response status:", res.status);
          console.log(
            "4. Response headers:",
            Object.fromEntries(res.headers.entries())
          );

          const responseText = await res.text();
          console.log("5. Raw response text:", responseText);

          if (!res.ok) {
            console.error("Response not OK:", {
              status: res.status,
              statusText: res.statusText,
              body: responseText,
            });
            throw new Error(responseText || "Failed to add to cart");
          }

          // Ako je response OK, probamo parsirati odgovor
          if (responseText) {
            const responseData = JSON.parse(responseText);
            console.log("6. Parsed response:", responseData);
          }
        } catch (fetchError: any) {
          console.error("Fetch error:", {
            name: fetchError.name,
            message: fetchError.message,
            stack: fetchError.stack,
          });
          throw fetchError;
        }

        setIsAddedToCart(true);
        toast.success("Added to cart!");
      } else {
        // Ako već jeste u korpi, znači da ga uklanjamo
        await trackActivity("CART_REMOVE");
        const res = await fetch(`/api/cart`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId: selectedVariantId }),
        });
        if (!res.ok) throw new Error();
        setIsAddedToCart(false);
        toast.success("Removed from cart!");
      }

      // refreshujemo stranicu
      router.refresh();
    } catch (error: any) {
      console.error("Cart error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        error,
      });
      toast.error("Failed to update cart");
    } finally {
      setActionLoading(false);
    }
  };

  // Dodavanje/uklanjanje iz Favorites
  const handleFavoriteToggle = async () => {
    try {
      setActionLoading(true);

      // Proveri da li je korisnik logovan
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Beležimo aktivnost
      if (!isFavorited) {
        await trackActivity("FAVORITE_ADD");
      } else {
        await trackActivity("FAVORITE_REMOVE");
      }

      // Ako nije favorit -> POST, ako jeste -> DELETE
      const res = await fetch(`/api/favorite`, {
        method: isFavorited ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(
          isFavorited
            ? "Failed to remove from favorites"
            : "Failed to add to favorites"
        );
      }

      setIsFavorited((prev) => !prev);
      toast.success(
        isFavorited ? "Removed from favorites!" : "Added to favorites!"
      );
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SizeSelector
        variants={variants}
        onSelect={(variant) => setSelectedVariantId(variant)}
      />

      <div className="flex items-center gap-4">
        {/* Dugme za Favorite */}
        <Button
          variant="neutral"
          size="icon"
          onClick={handleFavoriteToggle}
          disabled={actionLoading}
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          className={`w-12 h-12 rounded-full ${
            isFavorited ? "text-red-500 fill-red-500" : ""
          }`}
        >
          <Heart className="w-6 h-6" />
        </Button>

        {/* Dugme za Cart */}
        <Button
          onClick={handleToggleCart}
          disabled={actionLoading || (!selectedVariantId && !isAddedToCart)}
          className="flex-1 h-12 bg-[#fd9745] hover:bg-[#fd9745]/90 text-black"
        >
          {isAddedToCart ? "REMOVE FROM CART" : "ADD TO CART"}
        </Button>
      </div>
    </div>
  );
}
