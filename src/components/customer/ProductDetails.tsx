"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/types";


interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCartStore();

  const stockAvailable = product.stockQuantity ?? 0;

  const handleAddToCart = () => {
    if (!product.inStock || stockAvailable < 1) {
      toast.error("This product is currently out of stock.");
      return;
    }

    setIsAdding(true);

    const productWithSelections: Product = {
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    };

    // Correctly typed call to addItem
    addItem(productWithSelections as any, quantity);

    toast.success(
      `${quantity} x ${product.name} (${selectedColor || "N/A"}, ${
        selectedSize || "N/A"
      }) added to cart!`
    );

    setIsAdding(false);
    setQuantity(1);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-blue-600 font-medium">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.floor(product.rating ?? 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-lg font-medium">{product.rating}</span>
            <span className="text-gray-600">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                product.inStock ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`font-medium ${
                product.inStock ? "text-green-700" : "text-red-700"
              }`}
            >
              {product.inStock
                ? `In Stock (${stockAvailable} available)`
                : "Out of Stock"}
            </span>
          </div>

          <div>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Key Features:
              </h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Color: {selectedColor}
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedColor === color
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Size: {selectedSize}
              </h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSize === size
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quantity:</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 rounded-l-lg transition-all"
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(stockAvailable, quantity + 1))
                  }
                  className="p-2 hover:bg-gray-100 rounded-r-lg transition-all"
                  disabled={quantity >= stockAvailable}
                >
                  +
                </button>
              </div>
              <span className="text-gray-600">
                Total: ${(product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={
                !product.inStock || isAdding || quantity === 0 || stockAvailable === 0
              }
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
            <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-100 transition-all">
              ❤️
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>🚚</span>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>🛡️</span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>↩️</span>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
