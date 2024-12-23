"use client";

import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface CartHeaderProps {
  totalPrice: number;
}

export function CartHeader({ totalPrice }: CartHeaderProps) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout')
    console.log("Checkout clicked");
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">My Cart</h1>
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">
          Total: ${totalPrice.toFixed(2)}
        </div>
        <Button
          size="lg"
          className="bg-main hover:bg-main/90"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
