// File: checkout/page.tsx (Corrected/Simplified)
"use client";
import React from 'react';
import { useCartStore } from '@/store/cartStore';
import CheckoutForm from '@/components/checkout/CheckoutForm'; 
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Framer Motion variants for animated entry
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delayChildren: 0.3, 
      staggerChildren: 0.2 
    } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function CheckoutPage() {
    // Note: We only need items and totalPrice for the Summary column
    const { items, totalPrice } = useCartStore(state => ({
        items: state.items,
        totalPrice: state.totalPrice,
    }));
    
    const shippingCost = 10.00;
    const orderTotal = totalPrice + shippingCost;

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Your cart is empty!</h1>
                <p className="text-gray-600 mb-6">Add items to your cart to proceed to checkout.</p>
                <Button onClick={() => window.location.href = '/'}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <motion.div 
            className="container mx-auto py-12 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-4xl font-extrabold mb-10 text-center text-gray-900"
                variants={itemVariants}
            >
                Secure Checkout
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* --- Column 1: Shipping Form (Handles submission internally now) --- */}
                <motion.div 
                    className="lg:col-span-2"
                    variants={itemVariants}
                >
                    {/* The CheckoutForm component now manages the entire submission process */}
                    <CheckoutForm /> 
                </motion.div>
                
                {/* --- Column 2: Order Summary (Remains the same) --- */}
                <motion.div 
                    className="lg:col-span-1 p-6 bg-white border border-gray-200 rounded-xl shadow-2xl shadow-indigo-100 h-fit sticky top-5"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-indigo-700">Order Summary</h2>
                    
                    <ul className="space-y-3">
                        {items.map((item) => (
                            <motion.li 
                                key={item._id || `EGP{item.name}-EGP{item.price}-EGP{Math.random()}`} 
                                className="flex justify-between text-base"
                                variants={itemVariants}
                            >
                                <span className="text-gray-600 truncate mr-2">{item.name} (x{item.quantity})</span>
                                <span className="font-semibold text-gray-800">EGP{(item.price * item.quantity).toFixed(2)}</span>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="my-4 h-px bg-gray-300 w-full" />
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-lg font-medium">
                            <span>Subtotal:</span>
                            <span>EGP{totalPrice.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between text-base text-gray-600">
                            <span>Shipping:</span>
                            <span>EGP{shippingCost.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="my-4 h-px bg-gray-300 w-full" />

                    <motion.div 
                        className="flex justify-between text-2xl font-extrabold text-indigo-700 p-2 bg-indigo-50 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span>Order Total:</span>
                        <span>EGP{orderTotal.toFixed(2)}</span>
                    </motion.div>
                    
                </motion.div>
            </div>
        </motion.div>
    );
}