// app/api/user/counts/route.ts
import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const counts = await prisma.userProfile.findUnique({
      where: {
        supabaseUserId: user.id,
      },
      select: {
        _count: {
          select: {
            favorites: true,
            cartItems: true,
          },
        },
      },
    });

    return NextResponse.json(counts?._count ?? { favorites: 0, cartItems: 0 });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
