// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  subcategory?: string;
  description?: string;
  inStock?: boolean;
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  colors?: string[];
  sizes?: string[];
}
