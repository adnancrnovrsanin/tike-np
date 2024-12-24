// app/api/order/route.ts
import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import { CartItem, ProductVariant, Product } from "@prisma/client";
import { NextResponse } from "next/server";

interface ExtendedCartItem extends CartItem {
  productVariant: ProductVariant & {
    product: Product;
  };
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderData, cartItems } = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userProfile: {
            connect: {
              supabaseUserId: user.id,
            },
          },
          totalAmount: orderData.totalAmount,
          status: "PENDING",
          shippingAddress: orderData.shippingAddress,
          paymentInfo: orderData.paymentInfo,
          items: {
            create: cartItems.map((item: ExtendedCartItem) => ({
              quantity: item.quantity,
              price:
                item.productVariant.product.basePrice *
                (1 + item.productVariant.product.margin),
              productVariant: {
                connect: {
                  id: item.productVariantId,
                },
              },
            })),
          },
        },
      });

      // Update inventory
      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: {
          userProfile: {
            supabaseUserId: user.id,
          },
        },
      });

      return order;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
