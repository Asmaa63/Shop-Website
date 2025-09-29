"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import productsData from "@/data/products.json";

const categories = productsData.categories;

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold">Browse Categories</h1>
        <p className="text-gray-600 mt-2">
          Discover products by categories & subcategories
        </p>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all cursor-pointer group">
              {/* Category Title */}
              <h2 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition">
                {cat.name}
              </h2>

              {/* Subcategories */}
              <ul className="space-y-2">
                {cat.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/shop?category=${cat.id}&subcategory=${sub}`}
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
