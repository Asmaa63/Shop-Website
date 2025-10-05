// File: store/cartStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types/index.d'; 
// Assuming ShippingAddress is available somewhere, or define a basic one if not
import type { ShippingAddress } from '@/lib/validation/checkoutSchema'; 

// ----------------------------------------------------
// 1. Define the Order Type and EXPORT it
// ----------------------------------------------------

// FIX 1: Define and Export the Order type
export interface Order {
    id: number; // Order ID (usually from backend, using number for temporary local ID)
    items: CartItem[];
    totalAmount: number;
    orderTotal: number;
    shippingDetails: ShippingAddress; // Use your actual ShippingAddress type
    orderDate: string;
    paymentMethod: 'online' | 'cod';
    status: string;
}

// ----------------------------------------------------
// 2. Define the Cart State and Actions
// ----------------------------------------------------

interface CartState {
    items: CartItem[];
    orders: Order[]; // FIX 2: Add state for user orders
    
    // Actions
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    addOrder: (order: Order) => void; // FIX 3: Add action to save an order
    
    // Getters
    totalItems: number;
    totalPrice: number;
}

// ----------------------------------------------------
// 3. Zustand Store Implementation
// ----------------------------------------------------

// Helper function to calculate totals (improves readability)
const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            orders: [], // FIX 4: Initialize the orders array
            totalItems: 0,
            totalPrice: 0,

            // --- Existing Actions Implementation (Unchanged logic) ---

            addItem: (product, quantity = 1) => {
                set((state) => {
                    const newItems = [...state.items]; 
                    const itemIndex = newItems.findIndex(item => item._id === product._id);

                    if (itemIndex > -1) {
                        newItems[itemIndex].quantity += quantity;
                    } else {
                        newItems.push({ ...product, quantity });
                    }

                    return { 
                        items: newItems, 
                        ...calculateTotals(newItems) 
                    };
                });
            },

            removeItem: (productId) => {
                set((state) => {
                    const newItems = state.items.filter(item => item._id !== productId);
                    
                    return { 
                        items: newItems, 
                        ...calculateTotals(newItems) 
                    };
                });
            },

            updateQuantity: (productId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        const newItems = state.items.filter(item => item._id !== productId);
                        return {
                            items: newItems,
                            ...calculateTotals(newItems)
                        };
                    }

                    const newItems = state.items.map(item =>
                        item._id === productId ? { ...item, quantity } : item
                    );
                    
                    return { 
                        items: newItems, 
                        ...calculateTotals(newItems) 
                    };
                });
            },

            // --- New/Modified Actions ---

            // FIX 5: Modified clearCart to also reset orders (optional, but good practice)
            clearCart: () => set({ 
                items: [], 
                totalItems: 0, 
                totalPrice: 0 
                // We keep 'orders' here so previous orders are still visible after checkout
            }),
            
            // FIX 6: Implementation of addOrder
            addOrder: (order) => {
                set(state => ({
                    orders: [order, ...state.orders], // Add the new order to the beginning
                }));
            }
        }),
        {
            name: 'ecommerce-cart-storage',
            storage: createJSONStorage(() => localStorage),
            // FIX 7: Include 'orders' state in persist keys
            partialize: (state) => ({ 
                items: state.items, 
                orders: state.orders 
            }),
        }
    )
);