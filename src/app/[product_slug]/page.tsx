'use client';

import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/index.d'; 
import { Button } from '@/components/ui/button'; 

// Mock Product data for demonstration (replace with actual data fetching)
const mockProduct: Product = {
  _id: "prod-123", // FIX: Changed 'id' to '_id' to match the Product type
  name: "Stylish T-Shirt",
  price: 29.99,
  imageUrl: "/images/tshirt.jpg",
  slug: "stylish-t-shirt",
  stock: 50,
  category: "Apparel",
  description: "A comfortable and stylish cotton t-shirt.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ProductDetailPage() {
  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.totalItems);

  const handleAddToCart = () => {
    // Add 1 unit of the product
    addItem(mockProduct, 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{mockProduct.name}</h1>
      <p className="text-xl text-gray-700">${mockProduct.price.toFixed(2)}</p>
      
      <div className="mt-6">
        <Button 
          onClick={handleAddToCart} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add to Cart
        </Button>
        
        <p className="mt-4 text-sm">Items in cart: {totalItems}</p>
      </div>
    </div>
  );
}