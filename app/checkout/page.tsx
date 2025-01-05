// app/checkout/page.tsx
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { CartSummary } from "./components/cart-summary";
import { CheckoutForm } from "./components/checkout-form";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
              product: true,
            },
          },
        },
      },
    },
  });

  if (!userProfile || userProfile.cartItems.length === 0) {
    redirect("/cart");
  }

  const total = userProfile.cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="bg-[#fff4e0] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-6">
            <CheckoutForm
              savedAddress={{
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                address: userProfile.address,
                city: userProfile.city,
                postalCode: userProfile.postalCode,
                phone: userProfile.phone,
              }}
              cartTotal={total}
              cartItems={userProfile.cartItems}
            />
          </div>

          <div>
            <CartSummary items={userProfile.cartItems} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
