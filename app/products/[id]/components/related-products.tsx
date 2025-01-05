// app/products/[id]/components/related-products.tsx
import { prisma } from "@/lib/prismadb";
import ProductCard from "@/components/product-card";
import { Product } from "@prisma/client";

interface RelatedProductsProps {
  currentProductId: number;
  categoryId: number | null;
}

export default async function RelatedProducts({
  currentProductId,
  categoryId,
}: RelatedProductsProps) {
  let relatedProducts = [];

  const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/recommend?num=3`);
  if (!response.ok) {
    relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: currentProductId },
        categoryId: categoryId,
        isActive: true,
      },
      take: 3,
    });
    throw new Error("Failed to fetch recommendations");
  } else {
    const data = await response.json();
    console.log(data);
    relatedProducts = data.recommendations;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {relatedProducts.map((product: Product) => {
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name || "Unnamed Product"}
            basePrice={product.basePrice}
            margin={product.margin}
            imageUrl={product.imageUrl || "/placeholder.png"}
            isAddedToCart={false}
            isFavorited={false}
          />
        );
      })}
    </div>
  );
}
