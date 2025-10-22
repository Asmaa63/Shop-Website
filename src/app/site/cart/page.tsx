"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

const calculateShipping = (subtotal: number): number => {
  if (subtotal < 2000) return 70;
  if (subtotal >= 2000 && subtotal <= 3000) return 50;
  return 0;
};

export default function CartPage() {
  const { items: rawItems, updateItemQuantity, removeItem, clearCart } = useCartStore();
  const items = rawItems as unknown as CartItem[];

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const shipping = calculateShipping(subtotal - discount);
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon(couponCode);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center"
          >
            <ShoppingBag className="w-16 h-16 text-blue-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added anything to your cart yet. Start shopping now!
          </p>
          <Link href="/site/shop">
            <Button size="lg" className="rounded-full px-8 gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">{items.length} items in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative w-full sm:w-32 h-40 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors self-end sm:self-start"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 w-full sm:w-auto justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <div className="text-center sm:text-right">
                          <p className="text-xl sm:text-2xl font-bold text-blue-600">
                            EGP {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            EGP {item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">Order Summary</h2>

              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Coupon Code
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="rounded-lg flex-1"
                  />
                  <Button
                    onClick={applyCoupon}
                    variant="outline"
                    className="rounded-lg"
                  >
                    Apply
                  </Button>
                </div>
                {appliedCoupon && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600 mt-2 flex items-center gap-1"
                  >
                    ✓ Coupon &quot;{appliedCoupon}&quot; applied!
                  </motion.p>
                )}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>EGP {subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Discount (10%)</span>
                    <span>-EGP {discount.toFixed(2)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `EGP ${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-blue-600">
                  EGP {total.toFixed(2)}
                </span>
              </div>

              <Link href="/site/checkout">
                <Button
                  size="lg"
                  className="w-full rounded-xl bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/site/shop">
                <Button variant="ghost" className="w-full mt-3 rounded-xl">
                  Continue Shopping
                </Button>
              </Link>

              {subtotal < 3000 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 text-center lg:text-left"
                >
                  {subtotal < 2000 && (
                    <span>💡 Add EGP {(2000 - subtotal).toFixed(2)} more to reduce shipping to EGP 50!</span>
                  )}
                  {subtotal >= 2000 && subtotal <= 3000 && (
                    <span>💡 Add EGP {(3000 - subtotal).toFixed(2)} more to get FREE shipping!</span>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}