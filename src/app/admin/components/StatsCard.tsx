"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon, // ✅ هنا بنعيد تسمية prop عشان نستخدمها كمكون
  color = "purple",
}: StatsCardProps) {
  const colorClasses = {
    red: "from-red-600 via-pink-600 to-purple-600",
    blue: "from-blue-600 via-purple-600 to-indigo-600",
    purple: "from-purple-700 via-fuchsia-700 to-pink-700",
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden p-5 rounded-2xl shadow-lg text-white bg-gradient-to-br ${colorClasses} group`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-all duration-300 blur-2xl" />

      {/* Icon */}
      <motion.div
        initial={{ rotate: -15, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"
      >
        <Icon size={20} className="text-white/90" />
      </motion.div>

      {/* Title */}
      <h3 className="text-sm uppercase tracking-wide text-white/80 font-medium mb-1">
        {title}
      </h3>

      {/* Value */}
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
