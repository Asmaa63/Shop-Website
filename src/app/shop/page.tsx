"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Grid3x3, List, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/customer/ProductCard";
import { RawProductData } from '@/lib/types'; 
import productsData from "@/data/products.json";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const categories = ["All", "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors"];
const brands = ["All", "Nike", "Adidas", "Apple", "Samsung", "Sony", "IKEA"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...(productsData.products as RawProductData[])]; 

    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand !== "All") {
      products = products.filter((p) => p.brand === selectedBrand);
    }

    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (searchQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "low-high":
        products.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return products;
  }, [selectedCategory, selectedBrand, sortBy, priceRange, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange([0, 10000]);
    setSearchQuery("");
    setSortBy("default");
  };

  // Filters Panel Component
  const FiltersPanel = ({ isMobile = false }) => (
    <div className={isMobile ? "space-y-6" : "space-y-6"}>
      {/* Categories */}
      <div>
        <h3 className="font-bold mb-3 text-blue-700">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-4 py-2.5 rounded-xl transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold"
                  : "bg-gray-50 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-bold mb-3 text-purple-700">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <motion.button
              key={brand}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBrand(brand)}
              className={`block w-full text-left px-4 py-2.5 rounded-xl transition-all ${
                selectedBrand === brand
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold"
                  : "bg-gray-50 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {brand}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold mb-3 text-blue-700">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={50}
        />
        <div className="flex justify-between text-sm text-gray-700 font-medium mt-3">
          <span>EGP {priceRange[0]}</span>
          <span>EGP {priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Discover Amazing Products
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium products
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block w-72"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </Button>
              </div>
              <FiltersPanel />
            </div>
          </motion.aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Controls Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">
                  {filteredProducts.length} Products
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Filters Button - Mobile Only */}
                <Button
                  onClick={() => setShowFiltersDialog(true)}
                  className="lg:hidden gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>

                {/* View Mode */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="low-high">Price: Low to High</SelectItem>
                    <SelectItem value="high-low">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Products Grid/List */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product: RawProductData, index: number) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    >
                      <ProductCard
                        product={{
                          ...product,
                          productId: product.productId || Math.floor(Math.random() * 100000),
                          quantity: 1,
                          selectedColor: product.colors?.[0] || '',
                          selectedSize: product.sizes?.[0] || '',
                          id: String(product.id),
                          _id: String(product.id),
                          imageUrl: product.image || "",
                          stock: product.stockQuantity || 0,
                          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        }}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filters Dialog - Mobile */}
      <AnimatePresence>
        {showFiltersDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersDialog(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Dialog Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFiltersDialog(false)}
                  className="text-white hover:bg-white/20 p-1 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dialog Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-140px)] px-6 py-4">
                <FiltersPanel isMobile={true} />
              </div>

              {/* Dialog Footer */}
              <div className="border-t p-4 flex gap-2 sticky bottom-0 bg-gray-50">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFiltersDialog(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}