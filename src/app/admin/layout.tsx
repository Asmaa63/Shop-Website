"use client";

import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import AddProductModal from "./components/AddProductModal";
import { Toaster } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const isAdmin = localStorage.getItem("isAdmin");
    const adminData = localStorage.getItem("adminData");

    if (!isAdmin || !adminData) {
      router.push("/admin/login");
    } else {
      setAdmin(JSON.parse(adminData));
    }
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 ">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center p-6 border-b border-white/10 backdrop-blur-md bg-gray-200">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>

          {admin && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg shadow-md">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-blue-600 font-semibold ">{admin.name}</span>
            </div>
          )}
        </div>

        {showModal && (
          <AddProductModal onClose={() => setShowModal(false)} onSave={() => {}} />
        )}

        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
          {children}
          <Toaster position="top-right" />
        </main>
      </div>
    </div>
  );
}
