import ProductCard from "@/components/product-card";
import { prisma } from "@/lib/prismadb";
import { Product } from "@prisma/client";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {products.map((product: Product) => {
          const finalPrice = product.basePrice * (1 + product.margin);
          return (
            <ProductCard
              key={product.id}
              name={product.name || "Unnamed Product"}
              price={finalPrice.toFixed(2)}
              imageUrl={product.imageUrl || "/placeholder.png"}
            />
          );
        })}
      </div>
    </div>
  );
}
