'use client';

import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button'; 
import { Trash2 } from 'lucide-react'; 
import { motion } from 'framer-motion';

export default function CartSummary() {
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return <div className="p-4 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shopping Cart ({items.length} items)</h2>
      
      <motion.ul 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {items.map((item) => (
          <motion.li 
            key={item._id} 
            className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 transition-colors duration-150 rounded-md p-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded shadow" 
              />
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Quantity controls */}
              <input
                type="number"
                min="1"
                value={item.quantity}
                // FIX: Use item._id
                onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))} 
                className="w-16 p-1 border rounded text-center focus:border-indigo-500 transition-colors"
              />
              
              {/* Total price for the item */}
              <span className="font-semibold w-20 text-right text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>

              <Button 
                variant="ghost" 
                size="icon" 
                // FIX: Use item._id
                onClick={() => removeItem(item._id)}
                className="hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xl font-bold">Cart Total:</span>
        <span className="text-2xl font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
      </div>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3 transition duration-150"
          onClick={() => window.location.href = '/checkout'}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}