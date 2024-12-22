import ProductCard from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { prisma } from "@/lib/prismadb";
import { Gender } from "@prisma/client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    gender?: string;
    brand?: string;
    size?: string;
    color?: string;
  };
}) {
  // Dohvatamo podatke za filtere
  const categories = (await prisma.category.findMany()).map((category) => ({
    ...category,
    name: category.name || "Unnamed Category",
  }));

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(searchParams.category && {
        categoryId: parseInt(searchParams.category),
      }),
      ...(searchParams.gender && { gender: searchParams.gender as Gender }),
      ...(searchParams.brand && { brand: searchParams.brand }),
      ...(searchParams.color && { color: searchParams.color }),
    },
    include: {
      category: true,
      variants: true,
    },
  });

  // Izvlačimo jedinstvene brendove i boje iz proizvoda za filtere
  const brands = [
    ...new Set(
      products
        .map((p) => p.brand)
        .filter((brand): brand is string => brand !== null)
    ),
  ];
  const colors = [
    ...new Set(
      products
        .map((p) => p.color)
        .filter((color): color is string => color !== null)
    ),
  ];

  return (
    <div className="container mx-auto p-6">
      <ProductFilters categories={categories} brands={brands} colors={colors} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8">
        {products.map((product) => {
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
