"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  // Kreiraj UserProfile nakon uspešne registracije
  if (authData.user) {
    try {
      await prisma.userProfile.create({
        data: {
          supabaseUserId: authData.user.id,
        },
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      redirect("/error");
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
