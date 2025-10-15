// File: store/cartStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types/index.d'; 
// Assuming ShippingAddress is available somewhere, or define a basic one if not
import type { ShippingAddress } from '@/lib/validation/checkoutSchema'; 

// ----------------------------------------------------
// 1. Define the Order Type and EXPORT it
// ----------------------------------------------------

export interface Order {
    id: number; 
    items: CartItem[];
    totalAmount: number;
    orderTotal: number;
    shippingDetails: ShippingAddress; 
    orderDate: string;
    paymentMethod: 'online' | 'cod';
    status: string;
}

// ----------------------------------------------------
// 2. Define the Cart State and Actions
// ----------------------------------------------------

// NOTE: We change 'updateQuantity' to 'updateItemQuantity' to match the ProductCard component
// and add 'getItemQuantity' (which is a Getter function)
interface CartState {
    items: CartItem[];
    orders: Order[];
    
    // Actions
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    
    // RENAMED from 'updateQuantity'
    updateItemQuantity: (productId: string, quantity: number) => void; 
    
    clearCart: () => void;
    addOrder: (order: Order) => void;
    
    // Getters
    totalItems: number;
    totalPrice: number;

    // ADDED: The function needed by ProductCard to get the current quantity
    getItemQuantity: (productId: string) => number; 
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
            orders: [],
            totalItems: 0,
            totalPrice: 0,

            // --- Getters Implementation (Needed for ProductCard) ---

            // IMPLEMENTED: getItemQuantity 
            getItemQuantity: (productId) => {
                const item = get().items.find(item => item._id === productId);
                return item ? item.quantity : 0;
            },


            // --- Actions Implementation ---

            addItem: (product, quantity = 1) => {
                set((state) => {
                    const newItems = [...state.items]; 
                    const itemIndex = newItems.findIndex(item => item._id === product._id);

                    if (itemIndex > -1) {
                        newItems[itemIndex].quantity += quantity;
                    } else {
                        // Using product._id as the identifier (as used in removeItem/updateQuantity)
                        newItems.push({ ...product, quantity, _id: product._id }); 
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

            // IMPLEMENTED: updateItemQuantity (Renamed from updateQuantity)
            updateItemQuantity: (productId, quantity) => {
                set((state) => {
                    // Check if quantity is zero or less, then remove the item
                    if (quantity <= 0) {
                        return { 
                            items: state.items.filter(item => item._id !== productId),
                            ...calculateTotals(state.items.filter(item => item._id !== productId))
                        };
                    }

                    // Update the quantity of the existing item
                    const newItems = state.items.map(item =>
                        item._id === productId ? { ...item, quantity } : item
                    );
                    
                    return { 
                        items: newItems, 
                        ...calculateTotals(newItems) 
                    };
                });
            },

            clearCart: () => set({ 
                items: [], 
                totalItems: 0, 
                totalPrice: 0 
            }),
            
            addOrder: (order) => {
                set(state => ({
                    orders: [order, ...state.orders], 
                }));
            }
        }),
        {
            name: 'ecommerce-cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                items: state.items, 
                orders: state.orders 
            }),
        }
    )
);