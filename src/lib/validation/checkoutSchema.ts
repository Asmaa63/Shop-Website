import { z } from 'zod';

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  governorate: z.string().min(1, 'Please select a governorate'),
  city: z.string().min(1, 'Please select a city'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  village: z.string().optional(),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
  country: z.string().default('Egypt'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const CheckoutFormSchema = z.object({
  address: ShippingAddressSchema,
  paymentMethod: z.enum(['online', 'cod']),
});

export type CheckoutFormInputs = z.infer<typeof CheckoutFormSchema>;