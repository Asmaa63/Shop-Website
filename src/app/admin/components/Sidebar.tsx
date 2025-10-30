"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
} from "lucide-react";

const links = [
  { href: "/admin/home", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={20} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={20} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
  { href: "/admin/messages", label: "Messages", icon: <MessageSquare size={20} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      className="bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white h-screen sticky top-0 flex flex-col justify-between shadow-2xl"
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!collapsed && (
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-extrabold text-white tracking-wide"
            >
              Admin Panel
            </motion.h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-4 space-y-2">
          {links.map((link, index) => {
            const active = pathname === link.href;
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 mx-3 px-3 py-2 rounded-lg font-medium text-lg transition-all duration-300  ${
                    active
                      ? "bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 shadow-lg text-white "
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <motion.div
        className="p-4 border-t border-white/10 text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-700 to-blue-700 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} Admin Dashboard
          </p>
        )}
      </motion.div>
    </motion.aside>
  );
}
