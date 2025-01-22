// app/api/admin/users/[userId]/block/route.ts
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
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

    // Dohvati i ažuriraj korisnika u Prisma bazi
    const updatedUser = await prisma.userProfile.update({
      where: {
        id: parseInt(params.userId),
      },
      data: {
        blocked: body.isBlocked,
      },
    });

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("[USER_BLOCK_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
