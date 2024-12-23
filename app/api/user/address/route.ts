// app/api/user/address/route.ts
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import {createClient} from "@/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const userProfile = await prisma.userProfile.update({
            where: {
                supabaseUserId: user.id
            },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                address: body.address,
                city: body.city,
                postalCode: body.postalCode,
                phone: body.phone,
            },
        });

        return NextResponse.json(userProfile);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}