// app/actions/login.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    redirect("/error");
  }

  if (authData.user) {
    try {
      // Proveri da li postoji UserProfile
      const existingProfile = await prisma.userProfile.findUnique({
        where: {
          supabaseUserId: authData.user.id,
        },
      });

      if (!existingProfile) {
        // Ako ne postoji, kreiraj ga sa emailom
        await prisma.userProfile.create({
          data: {
            supabaseUserId: authData.user.id,
            email: authData.user.email ?? "",
          },
        });
      } else if (!existingProfile.email) {
        // Ako postoji ali nema email, dodaj ga
        await prisma.userProfile.update({
          where: {
            id: existingProfile.id,
          },
          data: {
            email: authData.user.email,
          },
        });
      }
    } catch (error) {
      console.error("Error checking/creating user profile:", error);
      redirect("/error");
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
