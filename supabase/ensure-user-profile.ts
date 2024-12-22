import { prisma } from "@/lib/prismadb";

export async function ensureUserProfile(userId: string) {
  let profile = await prisma.userProfile.findUnique({
    where: {
      supabaseUserId: userId,
    },
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: {
        supabaseUserId: userId,
      },
    });
  }

  return profile;
}
