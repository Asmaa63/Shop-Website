"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  status:
    | "Pending"
    | "Processing"
    | "Completed"
    | "Payment"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[];
}

interface User {
  id: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#9CA3AF",
  Processing: "#FACC15",
  Completed: "#10B981",
  Payment: "#3B82F6",
  Shipped: "#8B5CF6",
  Delivered: "#059669",
  Cancelled: "#EF4444",
};

export default function Chart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((res) => res.json()).catch(() => []),
      fetch("/api/users-admins").then((res) => res.json()).catch(() => []),
      fetch("https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products")
        .then((res) => res.json())
        .catch(() => []),
    ]).then(([ordersData, usersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.orders || []);
      setUsers(Array.isArray(usersData) ? usersData : usersData?.users || []);
      setProducts(Array.isArray(productsData) ? productsData : productsData?.products || []);
    });
  }, []);

  const orderStatusData = [
    { name: "Pending", value: orders.filter((o) => o.status === "Pending").length },
    { name: "Processing", value: orders.filter((o) => o.status === "Processing").length },
    { name: "Completed", value: orders.filter((o) => o.status === "Completed").length },
    { name: "Payment", value: orders.filter((o) => o.status === "Payment").length },
    { name: "Shipped", value: orders.filter((o) => o.status === "Shipped").length },
    { name: "Delivered", value: orders.filter((o) => o.status === "Delivered").length },
    { name: "Cancelled", value: orders.filter((o) => o.status === "Cancelled").length },
  ];

  const salesByDate = Object.values(
    orders.reduce<Record<string, { date: string; total: number }>>((acc, o) => {
      const date = new Date(o.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, total: 0 };
      acc[date].total += o.totalAmount || 0;
      return acc;
    }, {})
  );

  const usersByDate = Object.values(
    users.reduce<Record<string, { date: string; count: number }>>((acc, u) => {
      const date = new Date(u.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  const topProducts = Object.values(
    orders
      .flatMap((o) => o.items || [])
      .reduce<Record<string, { name: string; quantity: number }>>((acc, item) => {
        if (!acc[item.name]) acc[item.name] = { name: item.name, quantity: 0 };
        acc[item.name].quantity += item.quantity;
        return acc;
      }, {})
  ).slice(0, 5);

  const revenueVsOrders = Object.values(
    orders.reduce<Record<string, { date: string; revenue: number; orders: number }>>(
      (acc, o) => {
        const date = new Date(o.createdAt).toLocaleDateString();
        if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0 };
        acc[date].revenue += o.totalAmount;
        acc[date].orders += 1;
        return acc;
      },
      {}
    )
  );

  const totalCustomers = users.length;
  const newCustomers = users.filter((u) => {
    const created = new Date(u.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return created > thirtyDaysAgo;
  }).length;

  const customerGrowthData = [
    {
      name: "New Customers",
      value: (newCustomers / totalCustomers) * 100 || 0,
      fill: "#06B6D4",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-white">
      {/* Orders Status */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white/90">Orders Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={orderStatusData} dataKey="value" nameKey="name" label>
              {orderStatusData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Overview */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 border border-indigo-600 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white/90">Sales Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#A5B4FC" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Users Growth */}
      <div className="bg-gradient-to-br from-pink-900 to-pink-700 rounded-2xl p-6 border border-pink-600 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white/90">New Users Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usersByDate}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#F9A8D4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-2xl p-6 border border-emerald-600 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-white/90">Top Selling Products</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#6EE7B7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue vs Orders */}
      <div className="bg-gradient-to-br from-cyan-900 to-cyan-700 rounded-2xl p-6 border border-cyan-600 shadow-lg lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-white/90">Revenue vs Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueVsOrders}>
            <defs>
              <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#67E8F9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#67E8F9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22D3EE"
              fillOpacity={1}
              fill="url(#revenueColor)"
            />
            <Line type="monotone" dataKey="orders" stroke="#FBBF24" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Growth */}
<div className="bg-gradient-to-br from-teal-900 to-teal-700 rounded-2xl p-6 border border-teal-600 shadow-lg lg:col-span-2">
  <h3 className="text-lg font-semibold mb-4 text-white/90">Customer Growth</h3>
  <ResponsiveContainer width="100%" height={250}>
    <RadialBarChart
  cx="50%"
  cy="50%"
  innerRadius="60%"
  outerRadius="90%"
  barSize={16}
  data={customerGrowthData}
  startAngle={90}
  endAngle={-270} 
>
      <RadialBar background dataKey="value" cornerRadius={8} />
      <Tooltip />
    </RadialBarChart>
  </ResponsiveContainer>
</div>

    </div>
  );
}
