// app/checkout/components/checkout-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface CheckoutFormProps {
    savedAddress?: {
        firstName: string | null;
        lastName: string | null;
        address: string | null;
        city: string | null;
        postalCode: string | null;
        phone: string | null;
    };
}

export function CheckoutForm({ savedAddress }: CheckoutFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [saveAddress, setSaveAddress] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Ako je korisnik označio da želi da sačuva adresu
            if (saveAddress) {
                const addressData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    postalCode: formData.get('postalCode'),
                    phone: formData.get('phone'),
                };

                const res = await fetch('/api/user/address', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(addressData),
                });

                if (!res.ok) throw new Error('Failed to save address');
            }

            // Ovde bi išla integracija sa payment provider-om

            toast.success("Order placed successfully!");
            router.push('/order-confirmation');
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        name="firstName"
                        placeholder="First name"
                        defaultValue={savedAddress?.firstName || ''}
                        required
                    />
                    <Input
                        name="lastName"
                        placeholder="Last name"
                        defaultValue={savedAddress?.lastName || ''}
                        required
                    />
                </div>
                <Input
                    name="address"
                    placeholder="Address"
                    defaultValue={savedAddress?.address || ''}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        name="city"
                        placeholder="City"
                        defaultValue={savedAddress?.city || ''}
                        required
                    />
                    <Input
                        name="postalCode"
                        placeholder="Postal code"
                        defaultValue={savedAddress?.postalCode || ''}
                        required
                    />
                </div>
                <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    defaultValue={savedAddress?.phone || ''}
                    required
                />

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="saveAddress"
                        checked={saveAddress}
                        onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                    />
                    <label
                        htmlFor="saveAddress"
                        className="text-sm text-gray-600 cursor-pointer"
                    >
                        Save this address for future purchases
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Payment</h2>
                <Input
                    name="cardNumber"
                    placeholder="Card number"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        name="expiryDate"
                        placeholder="MM/YY"
                        required
                    />
                    <Input
                        name="cvv"
                        placeholder="CVV"
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#fd9745] hover:bg-[#fd9745]/90 text-black"
            >
                {isLoading ? "Processing..." : "Place Order"}
            </Button>
        </form>
    );
}