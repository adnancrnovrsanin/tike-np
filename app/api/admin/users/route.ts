// app/api/admin/users/route.ts
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== "adnancrnovrsanin48@gmail.com") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Dohvati sve korisnike iz Supabase-a
    const { data: supabaseUsers } = await supabase.auth.admin.listUsers();

    const response = await supabase.auth.admin.listUsers();
    console.log("response", response);

    // Dohvati sve profile iz Prisma baze
    const userProfiles = await prisma.userProfile.findMany();

    // Spoji podatke iz obe baze
    const combinedUsers = userProfiles.map((profile) => {
      const supabaseUser = supabaseUsers.users.find(
        (user) => user.id === profile.supabaseUserId
      );

      console.log("supabaseUsers", supabaseUsers);

      return {
        ...profile,
        email: supabaseUser?.email,
      };
    });

    return NextResponse.json(combinedUsers);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
