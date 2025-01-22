// app/admin/products/[productId]/edit/page.tsx
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prismadb";
import { notFound } from "next/navigation";

interface Props {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(params.productId),
    },
    include: {
      variants: true,
      category: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
