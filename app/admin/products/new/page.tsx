// app/admin/products/new/page.tsx
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prismadb";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
