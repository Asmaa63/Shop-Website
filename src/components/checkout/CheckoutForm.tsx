'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from 'sonner';
import { CheckoutFormInputs, CheckoutFormSchema, ShippingAddress } from '@/lib/validation/checkoutSchema';
import { useCartStore, Order } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import type { CartItem } from '@/types/index.d';
import { getGovernoratesList, getCitiesByGovernorate } from '@/lib/egyptianLocations';

const createOrderObject = (
  data: CheckoutFormInputs,
  items: CartItem[],
  totalPrice: number,
  shippingCost: number
): Order => {
  return {
    id: Date.now(),
    items: items.map(item => ({ ...item })),
    totalAmount: totalPrice,
    orderTotal: totalPrice + shippingCost,
    shippingDetails: data.address as ShippingAddress,
    orderDate: new Date().toISOString(),
    paymentMethod: data.paymentMethod,
    status: data.paymentMethod === 'cod' ? 'Pending' : 'Processing Payment',
  } as Order;
};

export default function CheckoutForm() {
  const router = useRouter();

  const { selectedItems, addOrder, removeSelectedItems } = useCartStore(state => ({
    selectedItems: state.selectedItems,
    addOrder: state.addOrder,
    removeSelectedItems: state.removeSelectedItems,
  }));

  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const governorates = getGovernoratesList();

  const itemsTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let shippingCost = 0;
  if (itemsTotal > 0 && itemsTotal < 2000) {
    shippingCost = 70;
  } else if (itemsTotal >= 2000 && itemsTotal < 3000) {
    shippingCost = 50;
  } else if (itemsTotal >= 3000) {
    shippingCost = 0;
  }

  const totalPrice = itemsTotal + shippingCost;

  const form = useForm<CheckoutFormInputs>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      address: {
        fullName: '',
        email: '',
        governorate: '',
        city: '',
        street: '',
        village: '',
        zipCode: '',
        country: 'Egypt',
        phone: '',
      },
      paymentMethod: 'online',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (selectedGovernorate) {
      const cities = getCitiesByGovernorate(selectedGovernorate);
      setAvailableCities(cities);
      setValue('address.city', '');
    }
  }, [selectedGovernorate, setValue]);

  const onSubmit = async (data: CheckoutFormInputs) => {
  if (selectedItems.length === 0) {
    toast.error('Your cart is empty. Please add some items first.');
    return;
  }

  const order: Order = createOrderObject(data, selectedItems, itemsTotal, shippingCost);

  if (data.paymentMethod === 'cod') {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          items: selectedItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.imageUrl || item.image,
          })),
          shippingAddress: {
            fullName: data.address.fullName,
            email: data.address.email,
            phone: data.address.phone,
            governorate: data.address.governorate,
            city: data.address.city,
            street: data.address.street,
            village: data.address.village || '',
            zipCode: data.address.zipCode,
            country: data.address.country || 'Egypt',
          },
          totalAmount: totalPrice,
          status: "Pending",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to save order:", result);
        toast.error("Failed to save order to the database.");
        return;
      }

      addOrder(order);
      removeSelectedItems();

      toast.success("Your order has been placed successfully! You will pay on delivery.");

      setTimeout(() => {
        router.push(`/site/order-confirmation?orderId=${result.orderId}`);
      }, 1000);
    } catch (err) {
      console.error("Error saving COD order:", err);
      toast.error("An unexpected error occurred while saving your order.");
    }

    return;
  }

  toast.loading('Processing payment... Please wait.');

  try {
    localStorage.setItem("cartItems", JSON.stringify(selectedItems));
    localStorage.setItem("shippingAddress", JSON.stringify(data.address));

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: selectedItems,
        shippingAddress: data.address as ShippingAddress,
        orderData: order,
      }),
    });

    const result = await response.json();

    if (response.ok && result.url) {
      toast.dismiss();
      router.push(result.url);
    } else {
      toast.dismiss();
      toast.error(result.message || 'Failed to initiate payment.');
    }
  } catch (error) {
    toast.dismiss();
    toast.error('An unexpected error occurred during checkout.');
    console.error('Checkout submission failed:', error);
  }
};

  return (
    <motion.div
      className="max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10 border border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-extrabold mb-6 text-center text-indigo-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Checkout Information
      </motion.h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Your name" {...register('address.fullName')} />
          {errors.address?.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.address.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="email@example.com" {...register('address.email')} />
          {errors.address?.email && (
            <p className="text-sm text-red-500 mt-1">{errors.address.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="governorate">Governorate</Label>
            <Select
              value={selectedGovernorate}
              onValueChange={(value) => {
                setSelectedGovernorate(value);
                setValue('address.governorate', value);
              }}
            >
              <SelectTrigger id="governorate">
                <SelectValue placeholder="Select Governorate" />
              </SelectTrigger>
              <SelectContent className='bg-gray-300'>
                {governorates.map((gov) => (
                  <SelectItem key={gov} value={gov}>
                    {gov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.address?.governorate && (
              <p className="text-sm text-red-500 mt-1">{errors.address.governorate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Select
              value={watch('address.city')}
              onValueChange={(value) => setValue('address.city', value)}
              disabled={!selectedGovernorate}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className='bg-gray-300'>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.address?.city && (
              <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input id="street" placeholder="123 Main Street, Building 5, Floor 2" {...register('address.street')} />
          {errors.address?.street && (
            <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="village">Village / Area (Optional)</Label>
          <Input id="village" placeholder="Village or Area name" {...register('address.village')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" placeholder="11511" {...register('address.zipCode')} />
            {errors.address?.zipCode && (
              <p className="text-sm text-red-500 mt-1">{errors.address.zipCode.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="Egypt" {...register('address.country')} disabled />
            {errors.address?.country && (
              <p className="text-sm text-red-500 mt-1">{errors.address.country.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="01012345678" {...register('address.phone')} />
          {errors.address?.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.address.phone.message}</p>
          )}
        </div>

        <motion.div
          className="bg-gray-50 p-4 rounded-xl shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="text-lg font-semibold mb-3 block">Payment Method</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => setValue('paymentMethod', 'online')}
                className="accent-indigo-600"
              />
              Online Payment
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setValue('paymentMethod', 'cod')}
                className="accent-indigo-600"
              />
              Cash on Delivery
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-150"
          >
            {isSubmitting
              ? 'Processing...'
              : paymentMethod === 'cod'
              ? 'Place Order'
              : 'Continue to Payment'}
          </Button>
        </motion.div>
      </form>

      <Toaster />
    </motion.div>
  );
}