// app/order-confirmation/page.tsx
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function OrderConfirmationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Dohvati poslednju porudžbinu korisnika
  const lastOrder = await prisma.order.findFirst({
    where: {
      userProfile: {
        supabaseUserId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
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

  if (!lastOrder) {
    redirect("/products");
  }

  const shippingAddress = lastOrder.shippingAddress as {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };

  return (
    <div className="bg-[#fff4e0] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-2">Order Number</h2>
              <p className="text-gray-600">#{lastOrder.id}</p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>
              <p className="text-gray-600">
                {shippingAddress.firstName} {shippingAddress.lastName}
                <br />
                {shippingAddress.address}
                <br />
                {shippingAddress.city}, {shippingAddress.postalCode}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-4">
                {lastOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={
                          item.productVariant.product.imageUrl ||
                          "/placeholder.png"
                        }
                        alt={item.productVariant.product.name || "Product"}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.productVariant.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size:{" "}
                        {item.productVariant.shoeSize ||
                          item.productVariant.clothingSize}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${lastOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-x-4 text-center">
            <Link href="/products">
              <Button className="bg-[#fd9745] hover:bg-[#fd9745]/90 text-black">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
