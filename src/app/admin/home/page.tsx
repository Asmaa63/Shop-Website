"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Users, Package, CircleDollarSign } from "lucide-react";
import Chart from "../components/Chart";
import StatsCard from "../components/StatsCard";
import { BarChart3, ArrowRight } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await fetch("/api/orders/admin", { cache: "no-store" });
        const ordersData = await ordersRes.json();
        const ordersArray = Array.isArray(ordersData)
          ? ordersData
          : Array.isArray(ordersData.orders)
          ? ordersData.orders
          : [];

        const totalSales = ordersArray.reduce((sum: number, order: Order) => {
          const itemsTotal =
            order.items?.reduce(
              (acc: number, item: OrderItem) => acc + item.price * item.quantity,
              0
            ) || 0;

          let shippingFee = 0;
          if (itemsTotal > 0 && itemsTotal < 2000) {
            shippingFee = 70;
          } else if (itemsTotal >= 2000 && itemsTotal < 3000) {
            shippingFee = 50;
          }

          return sum + itemsTotal + shippingFee;
        }, 0);

        const ordersCount = ordersArray.length;

        const usersRes = await fetch("/api/users-admins", { cache: "no-store" });
        const usersData = await usersRes.json();
        const usersCount = Array.isArray(usersData) ? usersData.length : 0;

        const productsRes = await fetch("/api/products", { cache: "no-store" });
        const productsData = await productsRes.json();
        const productsCount = Array.isArray(productsData)
          ? productsData.length
          : 0;

        setStats({
          totalSales,
          orders: ordersCount,
          customers: usersCount,
          products: productsCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );

  const statCards = [
    {
      title: "Total Sales ",
      value: ` ${stats.totalSales.toLocaleString()}`,
      icon: CircleDollarSign,
      color: "from-white via-gray-200 to-gray-400 text-gray-900",
      link: null,
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "from-blue-500 via-purple-500 to-pink-500 text-white",
      link: "/admin/orders",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      color: "from-indigo-500 via-blue-600 to-purple-700 text-white",
      link: "/admin/users",
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "from-red-500 via-black to-gray-800 text-white",
      link: "/admin/products",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      {/* Dashboard Title */}
      
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center text-center text-white space-y-2"
    >
      
      <BarChart3 size={60} className="text-blue-600" />
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-red-400 bg-clip-text text-transparent">Welcome to Admin Panel</h1>
      <p className="text-gray-600 max-w-md">
        Manage your store efficiently — track orders, monitor sales, and explore detailed insights in your dashboard.
      </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const CardContent = (
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: Math.random() * 3 - 1.5,
                boxShadow: "0 0 30px rgba(255,255,255,0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-2xl p-6 bg-gradient-to-br ${card.color} shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium opacity-90">{card.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full">
                  <card.icon className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          );

          return card.link ? (
            <Link key={i} href={card.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={i}>{CardContent}</div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold mb-4 text-blue-600 ">
          Performance Analytics
        </h2>
        <Chart />
      </div>
    </motion.div>
  );
}
