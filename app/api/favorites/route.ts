import { prisma } from "@/lib/prismadb";
import { ensureUserProfile } from "@/supabase/ensure-user-profile";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    const { productId } = await req.json();

    const favorite = await prisma.favorite.create({
      data: {
        userProfile: {
          connect: {
            supabaseUserId: user.id,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error(
      "[FAVORITES_POST]",
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

    // Ukloni iz favorita
    await prisma.favorite.deleteMany({
      where: {
        userProfileId: userProfile.id,
        productId: body.productId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "[FAVORITES_DELETE]",
      error instanceof Error ? error.message : "Unknown error"
    );
    return new NextResponse("Internal error", { status: 500 });
  }
}
