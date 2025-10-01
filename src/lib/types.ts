// src/lib/types.ts

export interface Product {
  id: string; // Must be string
  name: string;
  price: number;
  originalPrice: number; // Must be number
  image: string;
  category: string;
  subcategory: string; // Must be string
  description: string;
  inStock: boolean; // Must be boolean
  stockQuantity: number; // Must be number
  rating: number; // Must be number
  reviewCount: number; // Must be number
  features: string[];
  colors: string[];
  sizes: string[];
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