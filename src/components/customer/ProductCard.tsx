"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useReviewStore } from "@/store/reviewStore";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/dddddd/444444?text=Image+Missing";

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const router = useRouter();
  const { addItem, updateItemQuantity, removeItem, getItemQuantity } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { getAverageRating } = useReviewStore();

  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setQuantity(getItemQuantity(product.id));
    }
  }, [mounted, product.id, getItemQuantity]);

  const isWishlisted = mounted ? isInWishlist(product.id) : false;
  const isAddedToCart = quantity > 0;
  const imageUrl = product.image && product.image.trim() !== "" ? product.image : PLACEHOLDER_IMAGE;

  const handleAddToCart = () => {
    if (quantity === 0) {
      addItem(product as any, 1);
      setQuantity(1);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 0 || newQuantity === quantity) return;

    if (newQuantity === 0) {
      removeItem(product.id);
      setQuantity(0);
      toast.info(`${product.name} removed from cart.`);
    } else {
      updateItemQuantity(product.id, newQuantity);
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = () => {
    toggleItem(product as any);
    if (isWishlisted) {
      toast.info(`Removed from wishlist`);
    } else {
      toast.success(`Added to wishlist!`);
    }
  };

  const discountValue =
    product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const averageRating = getAverageRating(product.id);

  const QuantityControl = ({ isQuickAction = false }: { isQuickAction?: boolean }) => (
    <div
      className={`flex items-center ${
        isQuickAction ? "w-full" : "w-full max-w-[150px]"
      } justify-between bg-blue-50 border border-blue-200 rounded-xl transition-all h-10`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-full w-1/3 text-blue-600 hover:bg-blue-100 rounded-r-none"
        onClick={() => handleUpdateQuantity(quantity - 1)}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="font-semibold text-sm text-blue-800 w-1/3 text-center">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-full w-1/3 text-blue-600 hover:bg-blue-100 rounded-l-none"
        onClick={() => handleUpdateQuantity(quantity + 1)}
        disabled={!product.inStock || quantity >= product.stock!}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 hover:shadow-xl transition-all"
      >
        <Link
          href={`/site/product/${product.id}`}
          className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          {discountValue > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">-{discountValue}%</Badge>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <Link href={`/site/product/${product.id}`}>
              <h3 className="font-bold text-xl text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            {averageRating > 0 && (
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    {i < Math.round(averageRating) ? "⭐" : "☆"}
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({averageRating.toFixed(1)})
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  EGP{product.price ? product.price.toFixed(2) : "0.00"}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    EGP{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {isAddedToCart ? (
              <QuantityControl />
            ) : (
              <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-40">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            )}

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
    <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-lg overflow-hidden group">
      <div
        onClick={() => router.push(`/site/product/${product.id}`)}
        className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
        {discountValue > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white z-10">
            -{discountValue}%
          </Badge>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isWishlisted ? "bg-pink-600 text-white" : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
          </motion.button>

          <Link href={`/site/product/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:bg-gray-100"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <Link href={`/site/product/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {averageRating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < Math.round(averageRating) ? "⭐" : "☆"}
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-1">({averageRating.toFixed(1)})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-600">
            EGP{product.price ? product.price.toFixed(2) : "0.00"}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              EGP{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {isAddedToCart ? (
          <QuantityControl />
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2 text-white"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        )}
      </div>
    </motion.div>
  );
}
