"use client";

import { useState, useEffect } from "react";
import { PriceDisplay } from "@/components/price-display";

interface PriceDisplayContainerProps {
  productId: number;
  basePrice: number;
  margin: number;
  userData: {
    age: number | null | undefined;
    averageSpent: number | null | undefined;
    priceSensitivity: number | null | undefined;
  } | null;
}

export function PriceDisplayContainer({
  productId,
  basePrice,
  margin,
  userData,
}: PriceDisplayContainerProps) {
  const [personalizedPrice, setPersonalizedPrice] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FLASK_API_URL}/predict-price`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_data: {
                age: userData?.age ?? 30,
                average_spent: userData?.averageSpent ?? 300,
                price_sensitivity: userData?.priceSensitivity ?? 0.5,
                base_price: basePrice,
                margin: margin,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch price");
        }

        const data = await response.json();
        setPersonalizedPrice(data.personalized_price);
      } catch (error) {
        console.error("Error fetching price:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData !== null) {
      fetchPrice();
    } else {
      setIsLoading(false);
    }
  }, [productId, basePrice, margin, userData]);

  return (
    <div className="mt-6">
      <PriceDisplay
        basePrice={basePrice}
        margin={margin}
        personalizedPrice={personalizedPrice}
        isLoading={isLoading}
        size="lg"
      />
      {personalizedPrice && personalizedPrice < basePrice * (1 + margin) && (
        <div className="mt-4">
          <span className="inline-block bg-green-100 border-2 border-black px-4 py-2 font-medium transform -rotate-2 shadow-[4px_4px_0px_0px_#000000]">
            🎉 Posebna ponuda!
          </span>
        </div>
      )}
    </div>
  );
}
