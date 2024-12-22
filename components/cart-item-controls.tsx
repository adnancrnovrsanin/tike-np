// app/cart/components/cart-item-controls.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartItemControlsProps {
  cartItemId: number;
  initialQuantity: number;
  maxQuantity: number;
}

export function CartItemControls({
  cartItemId,
  initialQuantity,
  maxQuantity,
}: CartItemControlsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error();

      setQuantity(newQuantity);
      router.refresh();
    } catch {
      toast.error("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Removed from cart");
      router.refresh();
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="neutral"
          size="icon"
          disabled={quantity <= 1 || isLoading}
          onClick={() => updateQuantity(quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center">{quantity}</span>

        <Button
          variant="neutral"
          size="icon"
          disabled={quantity >= maxQuantity || isLoading}
          onClick={() => updateQuantity(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="neutral"
        size="icon"
        disabled={isLoading}
        onClick={removeFromCart}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
