// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import ImageGallery from "./components/image-gallery";
import RelatedProducts from "./components/related-products";
import React from "react";
import { ProductActions } from "@/app/products/[id]/components/product-actions";
import { PriceDisplayContainer } from "@/components/price-display-container";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const supabase = await createClient();
    const productId = Number(params.id);

    // Provera da li je ID validan broj
    if (!productId || isNaN(productId)) {
      return notFound();
    }

    let isFavorited = false;
    let isAddedToCart = false;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return notFound();
    }

    let userProfile = null;

    if (user) {
      userProfile = await prisma.userProfile.findUnique({
        where: {
          supabaseUserId: user.id,
        },
        include: {
          favorites: {
            where: {
              productId,
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

      // Ako je korisnik ulogovan ali userProfile nije pronađen, po potrebi kreiraj novi:
      // userProfile = await prisma.userProfile.create(...) ili slično

      if (userProfile) {
        isFavorited = userProfile.favorites.some(
          (f) => f.productId === productId
        );
        isAddedToCart = userProfile.cartItems.some(
          (ci) => ci.productVariant.productId === productId
        );

        // Zabeležimo "VIEW" aktivnost
        await prisma.userActivity.create({
          data: {
            userProfileId: userProfile.id,
            productId,
            activityType: "VIEW",
            metadata: {
              price: product.basePrice * (1 + product.margin),
            },
          },
        });
      }
    }

    const productImage = product.imageUrl || "/placeholder.png";
    // Za sada pravimo array sa istom slikom, ali u produkciji ovo može da bude niz različitih URL-ova
    const images = [productImage, productImage, productImage];

    // userData (za personalizovane cene)
    const userData = userProfile
      ? {
          age: userProfile.age,
          averageSpent: userProfile.averageSpent,
          priceSensitivity: userProfile.priceSensitivity,
        }
      : null;

    return (
      <div className="bg-[#fff4e0] min-h-screen">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ImageGallery images={images} alt={product.name || "Product"} />

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold font-raleway text-[#1e1e1e]">
                  {product.name}
                </h1>
                <PriceDisplayContainer
                  productId={product.id}
                  basePrice={product.basePrice}
                  margin={product.margin}
                  userData={userData}
                />
              </div>

              <div className="space-y-8">
                <ProductActions
                  productId={product.id}
                  variants={product.variants}
                  initialIsFavorited={isFavorited}
                  initialIsAddedToCart={isAddedToCart}
                  basePrice={product.basePrice}
                  margin={product.margin}
                  id={product.id}
                  userData={userData}
                />
              </div>
            </div>
          </div>

          {/* Product description */}
          <div className="mt-16 text-center">
            <h2 className="text-4xl font-bold font-raleway mb-6">
              {product.name}
            </h2>
            <p className="text-lg text-[#4C4C4D] max-w-4xl mx-auto">
              {product.description}
            </p>
          </div>

          {/* Related products */}
          <div className="mt-16">
            <h3 className="text-3xl font-medium text-center mb-8">
              See also...
            </h3>
            <RelatedProducts
              currentProductId={product.id}
              categoryId={product.categoryId!}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return notFound();
  }
}
