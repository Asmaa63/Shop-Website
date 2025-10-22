"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import ProductFilters from "./components/ProductFilters";
import AddProductModal from "./add/page";

type Product = {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  inStock?: boolean;
  stockQuantity?: number;
  rating?: number;
  colors?: string[];
  sizes?: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // filters state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

const fetchProducts = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch("https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const data: Product[] = await res.json();
    setProducts(data);
  } catch (err: unknown) {
    if (err instanceof Error) setError(err.message);
    else setError("Unknown error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
}, []);


  // derive available brands and categories from fetched products
  const availableBrands = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.brand && s.add(p.brand));
    return Array.from(s).sort();
  }, [products]);

  const availableCategories = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.category && s.add(p.category));
    return Array.from(s).sort();
  }, [products]);

  // filtering
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (search) {
        const q = search.toLowerCase();
        const inName = p.name?.toLowerCase().includes(q);
        const inBrand = p.brand?.toLowerCase().includes(q);
        const inCategory = p.category?.toLowerCase().includes(q);
        return Boolean(inName || inBrand || inCategory);
      }
      return true;
    });
  }, [products, category, brand, search]);

  return (
    <div className="text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ➕ Add Product
        </button>
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)} // ✅ يقفل المودال
          onSave={() => {
            fetchProducts(); // ✅ يحدث القائمة بعد الإضافة
            setShowModal(false);
          }}
        />
      )}

      <ProductFilters
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        brand={brand}
        onBrand={setBrand}
        availableCategories={availableCategories}
        availableBrands={availableBrands}
      />

      <div className="mt-6">
        {loading && (
          <div className="text-center py-20 text-gray-300">Loading products…</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-400">Error: {error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-300">No products found.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onDelete={fetchProducts} />
          ))}
        </div>
      </div>
    </div>
  );
}
