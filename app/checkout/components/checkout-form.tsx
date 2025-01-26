// app/checkout/components/checkout-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { checkoutFormSchema, type CheckoutFormValues } from "../schemas";
import { toast } from "sonner";
import { CartItem } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  savedAddress?: {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    phone: string | null;
  };
  cartTotal: number;
  cartItems: CartItem[]; // we can add a more precise type if needed
}

export function CheckoutForm({
  savedAddress,
  cartTotal,
  cartItems,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: savedAddress?.firstName || "",
      lastName: savedAddress?.lastName || "",
      address: savedAddress?.address || "",
      city: savedAddress?.city || "",
      postalCode: savedAddress?.postalCode || "",
      phone: savedAddress?.phone || "",
      saveAddress: false,
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setIsLoading(true);

      try {
        // Send purchase interaction for each item

        const purchasePromises = cartItems.map((item) =>
          fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/interact`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: item.productVariant.product.id,
              interaction_type: "purchase",
            }),
          })
        );
        await Promise.all(purchasePromises);
      } catch (error) {
        console.error("Error tracking purchases:", error);
      }

      // First save the address if checked
      if (data.saveAddress) {
        const addressRes = await fetch("/api/user/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            phone: data.phone,
          }),
        });

        if (!addressRes.ok) throw new Error("Failed to save address");
      }

      // Create order
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData: {
            totalAmount: cartTotal,
            shippingAddress: {
              firstName: data.firstName,
              lastName: data.lastName,
              address: data.address,
              city: data.city,
              postalCode: data.postalCode,
              phone: data.phone,
            },
            paymentInfo: {
              lastFourDigits: data.cardNumber.slice(-4),
            },
            status: "PENDING",
          },
          cartItems,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      router.push("/order-confirmation");
    } catch (error) {
      toast.error("Failed to process order");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="tel" placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment</h2>
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Card number" maxLength={16} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="MM/YY" maxLength={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="CVV"
                      maxLength={3}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="saveAddress"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm text-gray-600 cursor-pointer">
                Save this address for future purchases
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#fd9745] hover:bg-[#fd9745]/90 text-black h-12"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            "Place Order"
          )}
        </Button>
      </form>
    </Form>
  );
}
