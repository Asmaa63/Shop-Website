import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types/index.d'; 


// ----------------------------------------------------
// 1. Define the Cart State and Actions
// ----------------------------------------------------

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  // FIX: Action parameters should be the MongoDB ID, which is a string
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Getters
  totalItems: number;
  totalPrice: number;
}

// ----------------------------------------------------
// 2. Zustand Store Implementation
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
      totalItems: 0,
      totalPrice: 0,

      // --- Actions Implementation ---

      addItem: (product, quantity = 1) => {
        set((state) => {
          const newItems = [...state.items]; 
          // FIX: Use item._id and product._id
          const itemIndex = newItems.findIndex(item => item._id === product._id);

          if (itemIndex > -1) {
            newItems[itemIndex].quantity += quantity;
          } else {
            // New item should include the product's _id
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
          // FIX: Use item._id to filter
          const newItems = state.items.filter(item => item._id !== productId);
          
          return { 
            items: newItems, 
            ...calculateTotals(newItems) 
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          // FIX for TypeScript error: Handle quantity <= 0 by simply removing the item in place
          if (quantity <= 0) {
            // FIX: Use item._id to filter
            const newItems = state.items.filter(item => item._id !== productId);
            return {
                items: newItems,
                ...calculateTotals(newItems)
            };
          }

          // FIX: Use item._id to map and update
          const newItems = state.items.map(item =>
            item._id === productId ? { ...item, quantity } : item
          );
          
          return { 
            items: newItems, 
            ...calculateTotals(newItems) 
          };
        });
      },

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'ecommerce-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);