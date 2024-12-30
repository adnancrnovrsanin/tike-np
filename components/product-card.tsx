"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBasket } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  isAddedToCart: boolean;
  isFavorited: boolean;
  basePrice: number;
  margin: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  isAddedToCart: initialIsAddedToCart,
  isFavorited: initialIsFavorited,
  basePrice,
  margin,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(initialIsAddedToCart);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const router = useRouter();
  const supabase = createClient();

  const handleClick = async () => {
    if (!id) return;
    try {
      await fetch("http://localhost:5000/interact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          interaction_type: "click",
        }),
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

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

  const handleFavoriteToggle = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!isFavorited) {
        await trackActivity("FAVORITE_ADD");
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });

        if (!res.ok) throw new Error("Failed to add to favorites");
        toast.success("Added to favorites!");
      } else {
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });

        if (!res.ok) throw new Error("Failed to remove from favorites");
        toast.success("Removed from favorites!");
      }

      setIsFavorited(!isFavorited);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartToggle = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (!isAddedToCart) {
        await trackActivity("CART_ADD");
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });

        if (!res.ok) throw new Error("Failed to add to cart");
        toast.success("Added to cart!");
      } else {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });

        if (!res.ok) throw new Error("Failed to remove from cart");
        toast.success("Removed from cart!");
      }

      setIsAddedToCart(!isAddedToCart);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="" onClick={handleClick}>
      <Card className="relative flex flex-col items-start w-[370px] h-fit bg-white rounded-xl overflow-hidden border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] group">
        <Link href={`/products/${id}`} className="w-full">
          <div className="absolute top-[100px] left-[8px] w-[350px] h-[70px] bg-[#ffefe5] border-2 border-[#262626]" />

          <div className="w-full h-[250px] p-4 mt-5 z-10 relative flex items-center justify-center overflow-hidden">
            <div className="w-full h-[230px] p-4 z-10 relative overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={name}
                layout="fill"
                objectFit="cover"
                className="absolute transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="flex flex-col items-center w-full px-6 pt-6 pb-2 gap-3">
            <h3 className="font-raleway font-bold text-2xl text-center text-[#262626]">
              {name}
            </h3>

            <p className="font-outfit font-medium text-base text-center text-[#4C4C4D]">
              ---------------------------------------------
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between w-full px-6 pb-6 mt-1">
          <button
            className={cn(
              "p-2 rounded-full transition-all duration-200 hover:bg-gray-100",
              isAddedToCart && "bg-main"
            )}
            onClick={(e) => {
              e.preventDefault();
              handleCartToggle();
            }}
            disabled={isLoading}
          >
            <ShoppingBasket
              className={cn(
                "w-6 h-6 transition-colors",
                isAddedToCart && "text-white"
              )}
            />
          </button>

          <p className="font-outfit font-medium text-3xl text-black">
            ${price}
          </p>

          <button
            className={cn(
              "p-2 rounded-full transition-all duration-200 hover:bg-gray-100"
            )}
            onClick={(e) => {
              e.preventDefault();
              handleFavoriteToggle();
            }}
            disabled={isLoading}
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-colors",
                isFavorited && "fill-red-500 text-red-500"
              )}
            />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
