// app/api/user/activity/route.ts
import { prisma } from "@/lib/prismadb";
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

    const { productId, activityType, metadata } = await req.json();

    const userProfile = await prisma.userProfile.findUnique({
      where: { supabaseUserId: user.id },
    });

    if (!userProfile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    // Dodaj aktivnost
    await prisma.userActivity.create({
      data: {
        userProfileId: userProfile.id,
        productId,
        activityType,
        metadata,
      },
    });

    // Ažuriraj price sensitivity i average spend
    // Ovo bi trebalo da se radi periodično ili u background job-u,
    // ali za demonstraciju ćemo raditi odmah
    await calculateUserMetrics(userProfile.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function calculateUserMetrics(userProfileId: number) {
  const weights = {
    VIEW: 0.1,
    CART_ADD: 0.3,
    FAVORITE_ADD: 0.2,
    PURCHASE: 0.4,
  };

  // Dohvati sve aktivnosti korisnika
  const activities = await prisma.userActivity.findMany({
    where: {
      userProfileId,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // zadnjih 30 dana
      },
    },
    include: {
      product: true,
    },
  });

  // Računanje price sensitivity
  let sensitivityScore = 0;
  let totalWeight = 0;

  activities.forEach((activity) => {
    const weight = weights[activity.activityType as keyof typeof weights] || 0;
    const price = activity.product.basePrice * (1 + activity.product.margin);

    // Ako je korisnik kupio skuplje proizvode, manje je price sensitive
    if (activity.activityType === "PURCHASE") {
      sensitivityScore += (1 - price / 1000) * weight; // normalizujemo cenu
    }
    // Ako često gleda skuplje proizvode ali ih ne kupuje, više je price sensitive
    else if (activity.activityType === "VIEW") {
      sensitivityScore += (price / 1000) * weight;
    }

    totalWeight += weight;
  });

  const priceSensitivity =
    totalWeight > 0 ? sensitivityScore / totalWeight : 0.5;

  // Računanje average spend
  const purchases = activities.filter((a) => a.activityType === "PURCHASE");
  const totalSpend = purchases.reduce((sum, p) => {
    return sum + p.product.basePrice * (1 + p.product.margin);
  }, 0);
  const averageSpent = purchases.length > 0 ? totalSpend / purchases.length : 0;

  // Ažuriraj UserProfile
  await prisma.userProfile.update({
    where: { id: userProfileId },
    data: {
      priceSensitivity,
      averageSpent,
      lastCalculated: new Date(),
    },
  });
}
