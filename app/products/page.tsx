import { ProductFilters } from "@/components/product-filters";
import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import { Gender } from "@prisma/client";
import { ClearFiltersButton } from "./components/clear-filters-button";
import ProductsGrid from "./components/products-grid";

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

  const userProfile = user
    ? await prisma.userProfile.findUnique({
        where: {
          supabaseUserId: user.id,
        },
      })
    : null;

  const [categories, products, cartItems, favorites] = await Promise.all([
    prisma.category.findMany().then((categories) =>
      categories.map((category) => ({
        ...category,
        name: category.name || "Unnamed Category",
      }))
    ),

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

  const cartProductIds = new Set(
    cartItems.map((item) => item.productVariant.productId)
  );
  const favoriteProductIds = new Set(favorites.map((item) => item.productId));

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

  // Pripremi userData za personalizovane cene
  const userData = userProfile
    ? {
        age: userProfile.age,
        averageSpent: userProfile.averageSpent,
        priceSensitivity: userProfile.priceSensitivity,
      }
    : null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <ProductFilters
          categories={categories}
          brands={brands}
          colors={colors}
        />
        <ClearFiltersButton />
      </div>

      <ProductsGrid
        products={products}
        cartProductIds={cartProductIds}
        favoriteProductIds={favoriteProductIds}
        userData={userData}
      />
    </div>
  );
}
