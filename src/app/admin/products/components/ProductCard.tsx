"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  subcategory?: string;
  inStock?: boolean;
};

export default function ProductCard({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: () => void;
}) {
  const handleDelete = async () => {
    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col gap-3"
          >
            <p className="font-semibold text-gray-800">
              Are you sure you want to delete this product?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    const loadingToast = toast.loading("Deleting product...");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Product deleted successfully!", { id: loadingToast });
      onDelete();
    } catch (error) {
      toast.error("Failed to delete product", { id: loadingToast });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 rounded-2xl overflow-hidden shadow-md border border-white/10 hover:shadow-2xl hover:border-purple-500/50"
      >
        <div className="relative h-44 bg-gradient-to-br from-purple-800 to-blue-800">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No image
            </div>
          )}

          {product.inStock === false ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold"
            >
              Out of stock
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold"
            >
              In stock
            </motion.div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-gray-300 mt-1 truncate">{product.brand}</p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-green-400">
                EGP {product.price}
              </div>
              {product.originalPrice && (
                <div className="text-sm line-through text-gray-400">
                  EGP {product.originalPrice}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/products/${product.id}`}>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-md bg-blue-600/20 hover:bg-blue-600/40 transition-all"
                  title="Edit"
                >
                  <Edit size={18} className="text-blue-400" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-2 rounded-md bg-red-600/20 hover:bg-red-600/40 transition-all"
                title="Delete"
              >
                <Trash2 size={18} className="text-red-400" />
              </motion.button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
            <span className="px-2 py-1 bg-purple-600/30 rounded">
              {product.category}
            </span>
            <span className="px-2 py-1 bg-blue-600/30 rounded">
              {product.subcategory}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}