'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { CartItem } from '@/lib/types'; 

// Define a type for a single Order
// We'll use CartItem[] for items, but you can expand this type later
export type Order = {
  id: number; // Unique Order ID
  items: CartItem[];
  totalAmount: number;
  orderDate: string;
  // Add other necessary details like shipping, status, etc.
};

// Update the main Context Type to include the new states and functions
export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  userOrders: Order[]; // New state for past orders
  addItemToCart: (item: CartItem) => void;
  clearCart: () => void; // New function to clear the cart
  addOrder: (order: Order) => void; // New function to save an order
  // Add total amount calculation function/value if needed for checkout
}

// 1. Create the Context (We assume CartContextType is already imported or defined somewhere)
// Note: We use the defined interface for createContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// 2. Custom Hook for easy access to the context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 3. The Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]); // New state for orders

  // Function to add a product to the cart (kept existing logic)
  const addItemToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if an item with the same ID, size, and color already exists
      const existingItemIndex = prevItems.findIndex(
        i => 
          i.id === item.id && 
          i.selectedColor === item.selectedColor && 
          i.selectedSize === item.selectedSize
      );

      if (existingItemIndex > -1) {
        // If exists, update quantity
        return prevItems.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // If new, add the item
        return [...prevItems, item];
      }
    });
  };

  // ---------------------------------------------
  // NEW FUNCTIONS
  // ---------------------------------------------

  // Function to clear the cart after a successful order
  const clearCart = () => {
    setCartItems([]);
  };

  // Function to save a new order
  const addOrder = (order: Order) => {
    // Adds the new order to the beginning of the orders list
    setUserOrders(prevOrders => [order, ...prevOrders]); 
  };

  // ---------------------------------------------

  // Calculate total count for the icon
  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );
  
  // You should also calculate total amount here for the checkout process
  const totalAmount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0), 
    [cartItems]
  );

  const contextValue: CartContextType = useMemo(() => ({
    cartItems,
    cartCount,
    userOrders, // Export new state
    addItemToCart,
    clearCart, // Export new function
    addOrder, // Export new function
    // totalAmount will be useful in Checkout.tsx, but is not strictly necessary in the context value
    // unless you want to use it outside the useCart hook. Let's include it for completeness.
    // NOTE: I'm adding `totalAmount` to the returned context value, so make sure to update 
    // `CartContextType` interface in your lib/types file to include it.
    totalAmount,
  }), [cartItems, cartCount, userOrders, totalAmount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};