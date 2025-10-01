// src/lib/types.ts

export interface Product {
  id: string; // Changed from number to string
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface SortOptions {
  field: 'name' | 'price' | 'rating' | 'newest';
  direction: 'asc' | 'desc';
}