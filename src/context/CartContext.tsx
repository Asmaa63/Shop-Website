'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { CartItem, CartContextType } from '@/lib/types'; // Import the defined types

// 1. Create the Context (with initial values that match the type)
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

  // Function to add a product to the cart
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

  // Calculate total count for the icon
  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const contextValue = useMemo(() => ({
    cartItems,
    addItemToCart,
    cartCount,
  }), [cartItems, cartCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};