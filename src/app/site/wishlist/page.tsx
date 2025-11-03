"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function WishlistPage() {
  const userId = "guest"; // Replace with actual user ID from auth context/store
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const moveToCart = (product: any) => {
    addItem(product);
    removeItem(userId, product.id);
    toast.success(`${product.name} added to cart!`);
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Wishlist",
        text: "Check out my wishlist!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!");
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center"
          >
            <Heart className="w-16 h-16 text-pink-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Save your favorite items here and never lose track of what you love!
          </p>
          <Link href="/site/shop">
            <Button size="lg" className="rounded-full px-8 gap-2 bg-gradient-to-r from-pink-600 to-purple-600">
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">{items.length} items saved</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => clearWishlist(userId)}
              className="rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
            <Button
              variant="outline"
              onClick={shareWishlist}
              className="rounded-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Share Wishlist
            </Button>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveToCart(item)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(userId, item.id)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </motion.div>

                  {item.discount && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                    >
                      -{item.discount}%
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                  </motion.div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        EGP{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          EGP{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => moveToCart(item)}
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(userId, item.id)}
                      className="rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/site/shop">
            <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 border-2">
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
