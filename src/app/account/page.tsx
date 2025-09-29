"use client";

import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Settings,
  Heart,
  CreditCard,
  Bell,
  TrendingUp,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const stats = [
  { label: "Total Orders", value: "24", icon: Package, color: "from-blue-500 to-cyan-500" },
  { label: "Wishlist Items", value: "12", icon: Heart, color: "from-pink-500 to-rose-500" },
  { label: "Reward Points", value: "2,450", icon: Star, color: "from-yellow-500 to-orange-500" },
  { label: "Total Spent", value: "$3,299", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
];

const quickActions = [
  { title: "My Orders", href: "/account/orders", icon: Package, color: "bg-blue-500" },
  { title: "Addresses", href: "/account/addresses", icon: MapPin, color: "bg-purple-500" },
  { title: "Wishlist", href: "/wishlist", icon: Heart, color: "bg-pink-500" },
  { title: "Settings", href: "/account/settings", icon: Settings, color: "bg-gray-700" },
];

const recentOrders = [
  {
    id: "ORD-2024-001",
    date: "Jan 15, 2024",
    status: "Delivered",
    total: "$129.99",
    items: 3,
    image: "/placeholder-product.jpg",
  },
  {
    id: "ORD-2024-002",
    date: "Jan 10, 2024",
    status: "In Transit",
    total: "$89.99",
    items: 2,
    image: "/placeholder-product.jpg",
  },
];

export default function AccountOverviewPage() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder-avatar.jpg",
    memberSince: "Jan 2023",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative w-24 h-24 rounded-full bg-white p-1"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl">
                👤
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-blue-100 mb-1">{user.email}</p>
              <p className="text-sm text-blue-200">Member since {user.memberSince}</p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full bg-white text-blue-600 hover:bg-gray-100 gap-2"
            >
              <Bell className="w-5 h-5" />
              Notifications
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={action.title} href={action.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{action.title}</p>
                      </div>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="text-gray-400"
                      >
                        →
                      </motion.div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  Recent Orders
                </h2>
                <Link href="/account/orders">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All →
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-4xl">
                        📦
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-800">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {order.items} items • {order.total}
                          </div>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            Track Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">🎉 Exclusive Member Deal!</h3>
              <p className="text-lg text-white/90 mb-4">
                Get 20% off on your next purchase. Use code: <span className="font-bold">MEMBER20</span>
              </p>
              <Link href="/shop">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 rounded-full">
                  Shop Now
                </Button>
              </Link>
            </div>
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-8xl"
            >
              🎁
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}