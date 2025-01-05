// app/checkout/components/cart-summary.tsx
import Image from "next/image";
import { CartItem, Product, ProductVariant } from "@prisma/client";

interface ExtendedCartItem extends CartItem {
    productVariant: ProductVariant & {
        product: Product;
    };
}

interface CartSummaryProps {
    items: ExtendedCartItem[];
    total: number;
}

export function CartSummary({ items, total }: CartSummaryProps) {
    return (
        <div className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="divide-y">
                {items.map((item) => {
                    const product = item.productVariant.product;

                    return (
                        <div key={item.id} className="py-4 flex gap-4">
                            <div className="relative w-20 h-20">
                                <Image
                                    src={product.imageUrl || "/placeholder.png"}
                                    alt={product.name || "Product"}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Size: {item.productVariant.shoeSize || item.productVariant.clothingSize}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                            <div className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}