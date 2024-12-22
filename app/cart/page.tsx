// app/cart/page.tsx
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";
import { ShoppingCart } from "lucide-react";
import ProductCard from "@/components/product-card";
import { CartHeader } from "@/components/cart-header";
import { CartItemControls } from "@/components/cart-item-controls";

export default async function CartPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500">Please log in to view your cart</p>
      </div>
    );
  }

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      supabaseUserId: user.id,
    },
    include: {
      cartItems: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  variants: true,
                },
              },
            },
          },
        },
      },
      favorites: {
        select: {
          productId: true,
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

  const favoriteProductIds = new Set(
    userProfile.favorites.map((favorite) => favorite.productId)
  );

  const totalPrice = userProfile.cartItems.reduce((sum, cartItem) => {
    const product = cartItem.productVariant.product;
    const price = product.basePrice * (1 + product.margin);
    return sum + price * cartItem.quantity;
  }, 0);

  if (userProfile.cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Cart</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
          <p className="text-lg text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <CartHeader totalPrice={totalPrice} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {userProfile.cartItems.map(
          ({ id: cartItemId, productVariant, quantity }) => {
            const product = productVariant.product;
            const finalPrice = product.basePrice * (1 + product.margin);

            return (
              <div key={productVariant.id} className="w-full">
                <ProductCard
                  id={product.id}
                  name={product.name || "Unnamed Product"}
                  price={finalPrice.toFixed(2)}
                  imageUrl={product.imageUrl || "/placeholder.png"}
                  isAddedToCart={true}
                  isFavorited={favoriteProductIds.has(product.id)}
                />
                <div className="mt-4 flex items-center justify-between px-4">
                  <CartItemControls
                    cartItemId={cartItemId}
                    initialQuantity={quantity}
                    maxQuantity={productVariant.quantity}
                  />
                  <div className="text-sm">
                    Size:{" "}
                    {productVariant.shoeSize || productVariant.clothingSize}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
