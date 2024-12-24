// app/orders/page.tsx
import { createClient } from "@/supabase/server";
import { prisma } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userProfile: {
        supabaseUserId: user.id,
      },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-[#fff4e0] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-8 text-center">
            <p className="text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order placed{" "}
                      {formatDistance(new Date(order.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="font-medium">Order #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                    <span
                      className={cn(
                        "inline-block px-2 py-1 text-sm rounded-full",
                        {
                          "bg-yellow-100 text-yellow-800":
                            order.status === "PENDING",
                          "bg-green-100 text-green-800":
                            order.status === "COMPLETED",
                          "bg-red-100 text-red-800":
                            order.status === "CANCELLED",
                        }
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
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
                        <h3 className="font-medium">
                          {item.productVariant.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size:{" "}
                          {item.productVariant.shoeSize ||
                            item.productVariant.clothingSize}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Shipped to:
                    {(() => {
                      const address = order.shippingAddress as {
                        firstName: string;
                        lastName: string;
                        address: string;
                        city: string;
                        postalCode: string;
                      };
                      return (
                        <p>
                          {address.firstName} {address.lastName}
                          <br />
                          {address.address}
                          <br />
                          {address.city}, {address.postalCode}
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
