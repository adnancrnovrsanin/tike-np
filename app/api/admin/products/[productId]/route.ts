// app/api/admin/products/[productId]/route.ts
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "adnancrnovrsanin48@gmail.com") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.productId),
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "adnancrnovrsanin48@gmail.com") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(params.productId),
      },
      data: {
        ...body,
        variants: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          upsert: body.variants.map((variant: any) => ({
            where: { id: variant.id || 0 },
            update: variant,
            create: variant,
          })),
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "adnancrnovrsanin48@gmail.com") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Prvo brišemo sve varijante proizvoda
    await prisma.productVariant.deleteMany({
      where: {
        productId: parseInt(params.productId),
      },
    });

    // Zatim brišemo sam proizvod
    await prisma.product.delete({
      where: {
        id: parseInt(params.productId),
      },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
