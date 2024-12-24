// app/checkout/schemas.ts
import { z } from "zod";

export const checkoutFormSchema = z.object({
  // Contact
  email: z.string().email("Invalid email address"),

  // Shipping Address
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  phone: z.string().min(9, "Valid phone number is required"),

  // Payment (basic validation)
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Must be in MM/YY format"),
  cvv: z.string().length(3, "CVV must be 3 digits"),

  // Save address checkbox
  saveAddress: z.boolean().default(false),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
