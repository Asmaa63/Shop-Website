import { z } from "zod";

// Define the schema for the shipping address
export const ShippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters.")
    .max(100),
  street: z.string().min(5, "Street address is required.").max(200),
  city: z.string().min(2, "City is required.").max(50),
  zipCode: z.string().min(4, "Zip code is required.").max(10),
  country: z.string().min(2, "Country is required.").max(50),
  phone: z
    .string()
    // Accepts either: 01xxxxxxxxx  (national)  OR  +201xxxxxxxxx  (international)
    .regex(/^(?:\+20|0)1[0125]\d{8}$/, "Invalid Egyptian phone number. Use 01xxxxxxxxx or +201xxxxxxxxx.")
    .min(10, "Phone number must be at least 10 digits."),
});

// Define the full checkout form schema
export const CheckoutFormSchema = z.object({
  address: ShippingAddressSchema,
  paymentMethod: z.enum(["online", "cod"], {
    required_error: "Please select a payment method.",
  }),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type CheckoutFormInputs = z.infer<typeof CheckoutFormSchema>;
