// app/api/products/[id]/favorite/route.ts
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import {createClient} from "@/supabase/server";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const productId = parseInt(params.id);

        const userProfile = await prisma.userProfile.findUnique({
            where: { supabaseUserId: user.id }
        });

        if (!userProfile) {
            return new NextResponse("User profile not found", { status: 404 });
        }

        const favorite = await prisma.favorite.create({
            data: {
                userProfileId: userProfile.id,
                productId,
            },
        });

        return NextResponse.json(favorite);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const productId = parseInt(params.id);

        const userProfile = await prisma.userProfile.findUnique({
            where: { supabaseUserId: user.id }
        });

        if (!userProfile) {
            return new NextResponse("User profile not found", { status: 404 });
        }

        await prisma.favorite.deleteMany({
            where: {
                userProfileId: userProfile.id,
                productId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}