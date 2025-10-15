"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/types";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [isAdding, setIsAdding] = useState(false);

  const { addItem, updateItemQuantity, removeItem, getItemQuantity } = useCartStore();

  const quantity = getItemQuantity(product.id);
  const isAddedToCart = quantity > 0;
  const stockAvailable = product.stockQuantity ?? 0;

  const handleAddToCart = () => {
    if (!product.inStock || stockAvailable < 1) {
      toast.error("This product is currently out of stock.");
      return;
    }

    setIsAdding(true);

    // ✅ Add product with selected options
    const productWithSelections = {
      ...product,
      selectedColor,
      selectedSize,
    };
    addItem(productWithSelections, 1);

    toast.success(
      `${product.name} (${selectedColor || "N/A"}, ${selectedSize || "N/A"}) added to cart!`
    );
    setIsAdding(false);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id);
      toast.info(`${product.name} removed from cart.`);
    } else {
      updateItemQuantity(product.id, newQuantity);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-blue-600 font-medium">{product.category}</span>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* ⭐ Rating */}
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

          {/* 💰 Prices */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              EGP {product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  EGP {product.originalPrice}
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* 🟢 Stock */}
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

          {/* 📝 Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* 🎨 Colors */}
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

          {/* 📏 Sizes */}
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

          {/* 🛒 Add to Cart / Quantity Controls */}
          <div className="flex gap-4">
            {isAddedToCart ? (
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  className="rounded-r-none"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  className="rounded-l-none"
                  disabled={quantity >= stockAvailable}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding || stockAvailable === 0}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-10 py-6 text-2xl rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>
            )}
          </div>

          {/* 🚚 Info */}
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
