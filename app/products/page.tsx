import ProductCard from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import { Gender } from "@prisma/client";

interface SearchParams {
  query?: string;
  category?: string;
  gender?: string;
  brand?: string;
  size?: string;
  color?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prvo dohvatimo UserProfile ako postoji korisnik
  const userProfile = user
    ? await prisma.userProfile.findUnique({
        where: {
          supabaseUserId: user.id,
        },
      })
    : null;

  // Paralelno dohvatamo sve podatke
  const [categories, products, cartItems, favorites] = await Promise.all([
    // Kategorije
    prisma.category.findMany().then((categories) =>
      categories.map((category) => ({
        ...category,
        name: category.name || "Unnamed Category",
      }))
    ),

    // Proizvodi sa filterima
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(searchParams?.category && {
          categoryId: parseInt(searchParams.category),
        }),
        ...(searchParams?.gender && {
          gender: searchParams.gender as Gender,
        }),
        ...(searchParams?.brand && {
          brand: searchParams.brand,
        }),
        ...(searchParams?.color && {
          color: searchParams.color,
        }),
        ...(searchParams?.query && {
          OR: [
            { name: { contains: searchParams.query, mode: "insensitive" } },
            {
              description: {
                contains: searchParams.query,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
      include: {
        category: true,
        variants: {
          select: {
            shoeSize: true,
            clothingSize: true,
            quantity: true,
          },
        },
      },
    }),

    // Cart items - koristimo userProfile.id
    userProfile
      ? prisma.cartItem.findMany({
          where: {
            userProfileId: userProfile.id,
          },
          include: {
            productVariant: {
              select: {
                productId: true,
              },
            },
          },
        })
      : Promise.resolve([]),

    // Favorites - koristimo userProfile.id
    userProfile
      ? prisma.favorite.findMany({
          where: {
            userProfileId: userProfile.id,
          },
          select: {
            productId: true,
          },
        })
      : Promise.resolve([]),
  ]);

  // Kreiramo setove za proizvode u korpi i omiljene proizvode
  const cartProductIds = new Set(
    cartItems.map((item) => item.productVariant.productId)
  );
  const favoriteProductIds = new Set(favorites.map((item) => item.productId));

  // Izvlačimo jedinstvene vrednosti za filtere
  const brands = [
    ...new Set(
      products
        .map((p) => p.brand)
        .filter((brand): brand is string => brand !== null)
    ),
  ];

  const colors = [
    ...new Set(
      products
        .map((p) => p.color)
        .filter((color): color is string => color !== null)
    ),
  ];

  return (
    <div className="container mx-auto p-6">
      <ProductFilters categories={categories} brands={brands} colors={colors} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8">
        {products.map((product) => {
          const finalPrice = product.basePrice * (1 + product.margin);
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name || "Unnamed Product"}
              price={finalPrice.toFixed(2)}
              imageUrl={product.imageUrl || "/placeholder.png"}
              isAddedToCart={cartProductIds.has(product.id)}
              isFavorited={favoriteProductIds.has(product.id)}
            />
          );
        })}

        {products.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
