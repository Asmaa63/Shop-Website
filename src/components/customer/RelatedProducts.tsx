'use client';

import { Product } from '@/lib/types'; 
// NEW: Import ProductCard
import ProductCard from './ProductCard'; 


interface RelatedProductsProps {
  products: Product[];
}

// رابط صورة Placeholder (مُبقى كما هو)
// const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/dddddd/444444?text=Product+Image";

export default function RelatedProducts({ products }: RelatedProductsProps) {
  // CRITICAL FIX: Add a check for 'undefined' or 'null' before accessing .length
  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
        <p className="text-gray-600">You might also like these items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* FIX: Replacing the manual card drawing with the reusable ProductCard component */}
        {products.map((product) => (
          // ProductCard يحتوي على منطق Add to Cart وزر المفضلة جاهزًا لوضع Grid
          <ProductCard key={product.id} product={product} viewMode="grid" />
        ))}
      </div>
    </div>
  );
}