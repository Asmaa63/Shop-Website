'use client';

import Link from 'next/link';
// Import the correct Product type from your types file
import { Product } from '@/lib/types'; 

interface RelatedProductsProps {
  products: Product[];
}

// رابط صورة Placeholder يستخدمه المتصفح إذا لم يتم العثور على صورة المنتج
// (هذا الرابط يعمل كبديل للصورة الحالية التي تظهر كصندوق)
const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/dddddd/444444?text=Product+Image";

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
        {products.map((product) => {
          const discount = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          // التحقق من وجود الصورة: إذا لم يكن هناك مسار صورة صحيح، استخدم الـ Placeholder
          const imageUrl = product.image && product.image.trim() !== "" 
            ? product.image 
            : PLACEHOLDER_IMAGE;

          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="aspect-square relative bg-gray-100 overflow-hidden">
                <img
                  // استخدام الرابط المتحقق منه (imageUrl)
                  src={imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-blue-600 font-medium mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-smooth">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
