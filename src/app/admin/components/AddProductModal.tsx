"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import categoriesData from "@/data/products.json";

type AddProductModalProps = {
  onClose: () => void;
  onSave: () => void;
};

export default function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    description: "",
    inStock: true,
    stockQuantity: "",
    colors: "",
    sizes: "",
    image: "",
  });

  const [subcategories, setSubcategories] = useState<string[]>([]);

  useEffect(() => {
    const selected = categoriesData.categories.find(
      (cat) => cat.name === formData.category
    );
    setSubcategories(selected ? selected.subcategories : []);
  }, [formData.category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      colors: formData.colors.split(",").map((c) => c.trim()),
      sizes: formData.sizes.split(",").map((s) => s.trim()),
    };

    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (res.ok) {
      onSave();
      onClose();
    } else {
      alert("❌ Failed to add product, please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999]">
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-purple-600/40"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-red-500/80 transition-all"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-blue-400 bg-clip-text text-transparent">
          Add New Product
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />
          <input
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />
          <input
            name="originalPrice"
            placeholder="Original Price"
            type="number"
            value={formData.originalPrice}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Category</option>
            {categoriesData.categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>

          <input
            name="stockQuantity"
            placeholder="Stock Quantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg sm:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300 min-h-[80px]"
          />

          <input
            name="colors"
            placeholder="Colors (comma separated)"
            value={formData.colors}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg sm:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />
          <input
            name="sizes"
            placeholder="Sizes (comma separated)"
            value={formData.sizes}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg sm:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-300"
          />

          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((p) => ({ ...p, image: e.target.value }))
            }
            className="bg-white/10 border border-white/20 p-2.5 rounded-lg sm:col-span-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-300"
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-lg sm:col-span-2 transition-all shadow-md hover:shadow-lg"
          >
            Save Product
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
