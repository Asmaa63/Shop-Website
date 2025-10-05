// File: components/checkout/CheckoutForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'sonner';
import { CheckoutFormInputs, CheckoutFormSchema, ShippingAddress } from '@/lib/validation/checkoutSchema';
// Fix 1: Import Order type and useCartStore from your store file
import { useCartStore, Order } from '@/store/cartStore'; 
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React from 'react';
import type { CartItem } from '@/types/index.d'; 

const createOrderObject = (data: CheckoutFormInputs, items: CartItem[], totalPrice: number, shippingCost: number): Order => { 
    
    return {
        id: Date.now(),
        items: items.map(item => ({...item})),
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
    
    // Fix 3: Select the specific state (items, totalPrice) and actions (addOrder, clearCart)
    // from the Zustand store. This resolves the 'Property does not exist on type CartState' error.
    const { items, totalPrice, addOrder, clearCart } = useCartStore(state => ({
        items: state.items,
        totalPrice: state.totalPrice, 
        addOrder: state.addOrder,
        clearCart: state.clearCart,
    }));
    
    // NOTE: Define shippingCost consistently
    const shippingCost = 10.00;
    
    const form = useForm<CheckoutFormInputs>({
        resolver: zodResolver(CheckoutFormSchema),
        defaultValues: {
            address: {
                fullName: '',
                street: '',
                city: '',
                zipCode: '',
                country: 'US',
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

    const onSubmit = async (data: CheckoutFormInputs) => {
        if (items.length === 0) {
            toast.error('Your cart is empty. Please add items before checkout.');
            return;
        }

        const order: Order = createOrderObject(data, items, totalPrice, shippingCost);

        // --- Case 1: Cash on Delivery (COD) ---
        if (data.paymentMethod === 'cod') {
            addOrder(order);
            clearCart();
            
            toast.success('Your order has been placed successfully! You will pay upon delivery.');
            
            // Redirect to a specific confirmation page
            setTimeout(() => router.push(`/order-confirmation?orderId=${order.id}`), 1000); 
            return;
        }

        // --- Case 2: Online Payment ---
        toast.loading('Processing payment, please wait...');

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items,
                    shippingAddress: data.address as ShippingAddress,
                    orderData: order, 
                }),
            });

            const result = await response.json();

            if (response.ok && result.url) {
                toast.dismiss();
                // IMPORTANT: In a real flow, you should save the order and clear the cart 
                // ONLY after the user returns successfully from the payment gateway.
                // For now, we redirect to the payment provider.
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
                {/* --- Shipping Address Fields --- */}
                {/* (Input fields code remains the same) */}

                <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" {...register('address.fullName')} />
                    {errors.address?.fullName && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.fullName.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" placeholder="123 Main St" {...register('address.street')} />
                    {errors.address?.street && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" {...register('address.city')} />
                        {errors.address?.city && (
                            <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" placeholder="10001" {...register('address.zipCode')} />
                        {errors.address?.zipCode && (
                            <p className="text-sm text-red-500 mt-1">{errors.address.zipCode.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="United States" {...register('address.country')} />
                    {errors.address?.country && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.country.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="555-123-4567" {...register('address.phone')} />
                    {errors.address?.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.phone.message}</p>
                    )}
                </div>


                {/* --- Payment Method Selection --- */}
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
                            Pay on Delivery
                        </label>
                    </div>
                </motion.div>

                {/* --- Submit Button --- */}
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