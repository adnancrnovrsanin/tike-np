"use client";

import { usePersonalizedPrices } from "@/hooks/use-personalized-prices";
import ProductCard from "@/components/product-card";
import { Category, Product } from "@prisma/client";

interface ProductWithCategory extends Product {
  category: Category | null;
  variants: {
    shoeSize: string | null;
    clothingSize: string | null;
    quantity: number;
  }[];
}

interface ProductsGridProps {
  products: ProductWithCategory[];
  cartProductIds: Set<number>;
  favoriteProductIds: Set<number>;
  userData: {
    age: number | null | undefined;
    averageSpent: number | null | undefined;
    priceSensitivity: number | null | undefined;
  } | null;
}

export default function ProductsGrid({
  products,
  cartProductIds,
  favoriteProductIds,
  userData,
}: ProductsGridProps) {
  const { personalizedPrices, isLoading } = usePersonalizedPrices(
    products,
    userData
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8">
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name || "Unnamed Product"}
            imageUrl={product.imageUrl || "/placeholder.png"}
            isAddedToCart={cartProductIds.has(product.id)}
            isFavorited={favoriteProductIds.has(product.id)}
            basePrice={product.basePrice}
            margin={product.margin}
            personalizedPrice={personalizedPrices[product.id]}
            isLoading={isLoading}
          />
        );
      })}

      {products.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
