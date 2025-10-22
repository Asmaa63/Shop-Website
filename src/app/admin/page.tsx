"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, ArrowRight } from "lucide-react";
import AdminDashboardPage from "./home/page";

export default function AdminPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center text-white space-y-6"
    >
      
      <BarChart3 size={60} className="text-blue-400" />
      <h1 className="text-4xl font-bold text-white/90">Welcome to Admin Panel</h1>
      <p className="text-gray-400 max-w-md">
        Manage your store efficiently — track orders, monitor sales, and explore detailed insights in your dashboard.
      </p>
      <AdminDashboardPage/>
      {/* <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
      >
        Go to Dashboard <ArrowRight size={18} />
      </Link> */}
    </motion.div>
  );
}
