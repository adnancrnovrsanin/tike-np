import { useState, useEffect } from "react";

interface UserData {
  age: number | null | undefined;
  averageSpent: number | null | undefined;
  priceSensitivity: number | null | undefined;
}

interface Product {
  id: number;
  basePrice: number;
  margin: number;
}

interface PersonalizedPriceResponse {
  results: Array<{
    product_id: number;
    personalized_price: number;
    price_change_percent: number;
  }>;
}

interface SinglePriceResponse {
  personalized_price: number;
  price_change: number;
}

export const usePersonalizedPrices = (
  products: Product[],
  userData: UserData | null
) => {
  const [personalizedPrices, setPersonalizedPrices] = useState<
    Record<number, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalizedPrices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/predict-prices-bulk",
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
              },
              products: products.map((product) => ({
                product_id: product.id,
                base_price: product.basePrice,
                margin: product.margin,
              })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch personalized prices");
        }

        const data: PersonalizedPriceResponse = await response.json();
        const pricesMap: Record<number, number> = {};
        data.results.forEach((result) => {
          pricesMap[result.product_id] = result.personalized_price;
        });
        setPersonalizedPrices(pricesMap);
      } catch (error) {
        console.error("Error fetching personalized prices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (products?.length > 0) {
      fetchPersonalizedPrices();
    }
  }, [products, userData]);

  return { personalizedPrices, isLoading };
};

export const usePersonalizedPrice = (
  productId: number,
  basePrice: number,
  margin: number,
  userData: UserData | null
) => {
  const [personalizedPrice, setPersonalizedPrice] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalizedPrice = async () => {
      try {
        const response = await fetch("http://localhost:5000/predict-price", {
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
        });

        if (!response.ok) {
          throw new Error("Failed to fetch personalized price");
        }

        const data: SinglePriceResponse = await response.json();
        setPersonalizedPrice(data.personalized_price);
      } catch (error) {
        console.error("Error fetching personalized price:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalizedPrice();
  }, [productId, basePrice, margin, userData]);

  return { personalizedPrice, isLoading };
};
