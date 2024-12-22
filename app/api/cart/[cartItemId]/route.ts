import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const { quantity } = await req.json();
    const cartItemId = parseInt(params.cartItemId);

    if (!quantity || quantity < 1) {
      return new NextResponse("Invalid quantity", { status: 400 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error(
      "[CART_PATCH]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { cartItemId: string } }
) {
  try {
    const cartItemId = parseInt(params.cartItemId);

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "[CART_DELETE]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return new NextResponse("Internal error", { status: 500 });
  }
}
