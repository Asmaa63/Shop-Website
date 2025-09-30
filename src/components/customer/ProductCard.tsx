"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  image: string;
  rating?: number;
  discount?: number;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const [mounted, setMounted] = useState(false); // 👈 flag
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    if (isWishlisted) {
      toast.info(`Removed from wishlist`);
    } else {
      toast.success(`Added to wishlist!`);
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 hover:shadow-xl transition-all"
      >
        <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
          {product.discount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              -{product.discount}%
            </Badge>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h3 className="font-bold text-xl text-gray-800 mb-2">{product.name}</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAddToCart} className="flex-1 gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className={isWishlisted ? "text-pink-600 border-pink-600" : ""}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-pink-600" : ""}`} />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {/* Placeholder Image */}
        <div className="w-full h-full flex items-center justify-center text-8xl">
          📦
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
            -{product.discount}%
          </Badge>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isWishlisted
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
          </motion.button>
          <Link href={`/product/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < Math.floor(product.rating!) ? "⭐" : "☆"}
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}