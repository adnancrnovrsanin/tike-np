// app/favourites/page.tsx
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";
import ProductCard from "@/components/product-card";
import { HeartOff } from "lucide-react";

export default async function FavoritesPage() {
  const supabase = await createClient();

  // Dohvati trenutnog korisnika
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500">
          Please log in to view your favorites
        </p>
      </div>
    );
  }

  // Dohvati UserProfile i njegove favorite sa proizvodima
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      supabaseUserId: user.id,
    },
    include: {
      favorites: {
        include: {
          product: {
            include: {
              variants: true,
            },
          },
        },
      },
      cartItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!userProfile) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500">Profile not found</p>
      </div>
    );
  }

  // Kreiranje seta proizvoda koji su u korpi
  const cartProductIds = new Set(
    userProfile.cartItems.map((item) => item.productVariant.product.id)
  );

  // Ako nema favorita, prikaži odgovarajuću poruku
  if (userProfile.favorites.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <HeartOff className="w-16 h-16 text-gray-400" />
          <p className="text-lg text-gray-500">No favorite items yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Don&apos;t let them wait...</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {userProfile.favorites.map(({ product }) => {
          const finalPrice = product.basePrice * (1 + product.margin);

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name || "Unnamed Product"}
              price={finalPrice.toFixed(2)}
              imageUrl={product.imageUrl || "/placeholder.png"}
              isAddedToCart={cartProductIds.has(product.id)}
              isFavorited={true}
            />
          );
        })}
      </div>
    </div>
  );
}
