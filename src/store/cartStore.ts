import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types/index.d'; 
import type { ShippingAddress } from '@/lib/validation/checkoutSchema'; 

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

interface CartState {
    items: CartItem[];
    orders: Order[];
    selectedItems: CartItem[];
    
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    removeSelectedItems: () => void;
    updateItemQuantity: (productId: string, quantity: number) => void; 
    clearCart: () => void;
    addOrder: (order: Order) => void;
    setSelectedItems: (items: CartItem[]) => void;
    
    totalItems: number;
    totalPrice: number;
    getItemQuantity: (productId: string) => number; 
}

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
            selectedItems: [],
            totalItems: 0,
            totalPrice: 0,

            getItemQuantity: (productId) => {
                const item = get().items.find(item => item._id === productId);
                return item ? item.quantity : 0;
            },

            addItem: (product, quantity = 1) => {
                set((state) => {
                    const newItems = [...state.items]; 
                    const itemIndex = newItems.findIndex(item => item._id === product._id);

                    if (itemIndex > -1) {
                        newItems[itemIndex].quantity += quantity;
                    } else {
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

            removeSelectedItems: () => {
                set((state) => {
                    const selectedIds = new Set(state.selectedItems.map(item => item._id));
                    const newItems = state.items.filter(item => !selectedIds.has(item._id));
                    
                    return { 
                        items: newItems,
                        selectedItems: [],
                        ...calculateTotals(newItems) 
                    };
                });
            },

            updateItemQuantity: (productId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return { 
                            items: state.items.filter(item => item._id !== productId),
                            ...calculateTotals(state.items.filter(item => item._id !== productId))
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

            clearCart: () => set({ 
                items: [], 
                selectedItems: [],
                totalItems: 0, 
                totalPrice: 0 
            }),
            
            addOrder: (order) => {
                set(state => ({
                    orders: [order, ...state.orders], 
                }));
            },

            setSelectedItems: (items) => set({ selectedItems: items }),
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