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

    // -----------------------------
    // Dodaj aktivnost u bazu
    // -----------------------------
    await prisma.userActivity.create({
      data: {
        userProfileId: userProfile.id,
        productId,
        activityType,
        metadata,
      },
    });

    // -----------------------------
    // Ažuriraj priceSensitivity i averageSpent
    // -----------------------------
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
    CART_REMOVE: -0.15,
    FAVORITE_ADD: 0.2,
    FAVORITE_REMOVE: -0.1,
    PURCHASE: 0.4,
  };

  // Dohvati sve aktivnosti korisnika u poslednjih 30 dana
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

  let sensitivityScore = 0;
  let totalWeight = 0;

  activities.forEach((activity) => {
    // Koliko vredi aktivnost
    const weight = weights[activity.activityType as keyof typeof weights] || 0;

    // Cena proizvoda = basePrice * (1 + margin)
    const price = activity.product.basePrice * (1 + activity.product.margin);

    // Osnovna logika za PURCHASE i VIEW,
    // a možeš proširiti za CART_ADD, CART_REMOVE itd.
    switch (activity.activityType) {
      case "PURCHASE":
        // Kupio je skuplji proizvod => manja osetljivost na cenu
        sensitivityScore += (1 - price / 1000) * weight;
        break;

      case "VIEW":
        // Gleda skuplje proizvode, ali ne kupuje => veća osetljivost
        sensitivityScore += (price / 1000) * weight;
        break;

      // NEW: Primer kako da tretiraš CART_ADD
      case "CART_ADD":
        // Dodaje skuplji proizvod u korpu => znači manja osetljivost?
        sensitivityScore += (1 - price / 1000) * weight;
        break;

      // NEW: CART_REMOVE => možda "unazadimo" malo score
      //     (po želji: možeš i da ga preskočiš ili dodaš drugačiju logiku)
      case "CART_REMOVE":
        // Ako uklanja skuplji proizvod iz korpe => veća osetljivost
        sensitivityScore += (price / 1000) * weight;
        break;

      // NEW: FAVORITE_ADD => slično, čovek je "zainteresovan" za proizvod
      case "FAVORITE_ADD":
        sensitivityScore += (1 - price / 1000) * weight;
        break;

      // NEW: FAVORITE_REMOVE => signal da ipak nije toliko zainteresovan
      case "FAVORITE_REMOVE":
        sensitivityScore += (price / 1000) * weight;
        break;

      // default: ako ne postoji u weights, ignorišemo
      default:
        break;
    }

    totalWeight += Math.abs(weight); // obrati pažnju na ABS ako radiš s negativnim tegovima
  });

  // Ako totalWeight ispadne 0, nek priceSensitivity bude default 0.5
  const rawPriceSensitivity =
    totalWeight > 0 ? sensitivityScore / totalWeight : 0.5;

  // Price sensitivity je u opsegu [0, 1]
  const priceSensitivity = Math.max(0, Math.min(1, rawPriceSensitivity));

  // Računanje averageSpent (samo za PURCHASE)
  const purchases = activities.filter((a) => a.activityType === "PURCHASE");
  const totalSpend = purchases.reduce((sum, p) => {
    return sum + p.product.basePrice * (1 + p.product.margin);
  }, 0);
  const averageSpent = purchases.length > 0 ? totalSpend / purchases.length : 0;

  // Ažuriraj userProfile
  await prisma.userProfile.update({
    where: { id: userProfileId },
    data: {
      priceSensitivity,
      averageSpent,
      lastCalculated: new Date(),
    },
  });
}
