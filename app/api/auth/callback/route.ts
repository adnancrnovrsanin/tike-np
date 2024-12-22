import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (user) {
      // Proveri da li već postoji UserProfile
      const existingProfile = await prisma.userProfile.findUnique({
        where: {
          supabaseUserId: user.id,
        },
      });

      // Ako ne postoji, kreiraj novi
      if (!existingProfile) {
        await prisma.userProfile.create({
          data: {
            supabaseUserId: user.id,
          },
        });
      }
    }
  }

  // Preusmeri korisnika nazad na aplikaciju
  return NextResponse.redirect(requestUrl.origin);
}
