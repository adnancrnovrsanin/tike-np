import { prisma } from "@/lib/prismadb";
import { ensureUserProfile } from "@/supabase/ensure-user-profile";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("POST REQ", req);
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Osiguraj da postoji UserProfile
    await ensureUserProfile(user.id);

    const { productId, personalizedPrice } = await req.json();

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Prvo pronađi dostupnu varijantu
    const variant = await prisma.productVariant.findFirst({
      where: {
        productId: productId,
        quantity: {
          gt: 0,
        },
      },
      include: {
        product: true,
      },
    });

    if (!variant) {
      return new NextResponse("Product out of stock", { status: 400 });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userProfile: {
          connect: {
            supabaseUserId: user.id,
          },
        },
        productVariant: {
          connect: {
            id: variant.id,
          },
        },
        quantity: 1,
        price: personalizedPrice,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error(
      "[CART_POST]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    if (!body.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Prvo pronađi UserProfile
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    });

    if (!userProfile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    // Pronađi i ukloni CartItem za dati proizvod
    await prisma.cartItem.deleteMany({
      where: {
        userProfileId: userProfile.id,
        productVariant: {
          productId: body.productId,
        },
      },
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
