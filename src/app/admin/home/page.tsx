"use client";

import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import Chart from "../components/Chart";
import { motion } from "framer-motion";
import { ShoppingBag, Users, Package, CircleDollarSign } from "lucide-react";

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
      // 🧾 Get Orders
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
  } else if (itemsTotal >= 3000) {
    shippingFee = 0;
  }

  const totalAmount = itemsTotal + shippingFee;
  return sum + totalAmount;
}, 0);


      const ordersCount = ordersArray.length;

      // 👤 Get Users
      const usersRes = await fetch("/api/users-admins", { cache: "no-store" });
      const usersData = await usersRes.json();
      const usersCount = Array.isArray(usersData) ? usersData.length : 0;

      // 📦 Get Products
      const productsRes = await fetch("/api/products", { cache: "no-store" });
      const productsData = await productsRes.json();
      const productsCount = Array.isArray(productsData)
        ? productsData.length
        : 0;

      // ✅ Update stats
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
      title: "Total Sales (EGP)",
      value: `EGP ${stats.totalSales.toLocaleString()}`,
      icon: CircleDollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      color: "from-purple-500 to-blue-600",
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "from-gray-700 to-gray-900",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-red-400 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <StatsCard
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold mb-4 text-white/90">
          Performance Analytics
        </h2>
        <Chart />
      </div>

      
    </motion.div>
  );
}
