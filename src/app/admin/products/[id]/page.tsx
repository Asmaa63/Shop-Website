"use client";

import { useState, useEffect, ChangeEvent, FormEvent, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Link2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  name: string;
  subcategories: string[];
};

type FormDataType = {
  name: string;
  brand: string;
  price: string;
  originalPrice: string;
  category: string;
  subcategory: string;
  description: string;
  inStock: boolean;
  stockQuantity: string;
  colors: string;
  sizes: string;
  image: string;
};

const categories: Category[] = [
  { name: "Electronics", subcategories: ["Phones", "Laptops", "Headphones", "Cameras"] },
  { name: "Fashion", subcategories: ["Men", "Women", "Kids", "Accessories"] },
  { name: "Home & Kitchen", subcategories: ["Furniture", "Appliances", "Decor", "Cookware"] },
  { name: "Beauty", subcategories: ["Skincare", "Makeup", "Fragrances", "Hair Care"] },
  { name: "Sports", subcategories: ["Fitness", "Outdoor", "Footwear", "Apparel"] },
];

const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "Dell"];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormDataType>({
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<"url" | "file">("url");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setFormData({
          name: data.name || "",
          brand: data.brand || "",
          price: data.price?.toString() || "",
          originalPrice: data.originalPrice?.toString() || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          description: data.description || "",
          inStock: data.inStock ?? true,
          stockQuantity: data.stockQuantity?.toString() || "",
          colors: Array.isArray(data.colors) ? data.colors.join(", ") : "",
          sizes: Array.isArray(data.sizes) ? data.sizes.join(", ") : "",
          image: data.image || "",
        });

        if (data.image) setImagePreview(data.image);
      } catch (error) {
        toast.error("Failed to load product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  useEffect(() => {
    const selected = categories.find((cat) => cat.name === formData.category);
    setSubcategories(selected ? selected.subcategories : []);
  }, [formData.category]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col gap-3 text-gray-900"
          >
            <p className="font-semibold">Are you sure you want to update this product?</p>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;

    const loadingToast = toast.loading("Updating product...");

    const formattedData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      colors: formData.colors.split(",").map((c) => c.trim()),
      sizes: formData.sizes.split(",").map((s) => s.trim()),
    };

    try {
      const res = await fetch(`/api/products/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Product updated successfully!", { id: loadingToast });
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch (error) {
      toast.error("Failed to update product", { id: loadingToast });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 p-4 md:p-6 mx-auto bg-white min-h-screen">
      <Toaster position="top-center" />

      <Link href="/admin/products">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-500 transition"
        >
          <ArrowLeft size={20} />
          Back to Products
        </motion.button>
      </Link>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
      >
        Edit Product
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-2xl border border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Product Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Price (EGP)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Original Price (EGP)</label>
          <input
            name="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Subcategory</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Stock Quantity</label>
          <input
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="text-sm text-gray-700 mb-1 flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="w-4 h-4"
            />
            In Stock
          </label>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Colors (comma separated)</label>
          <input
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Red, Blue, Black"
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Sizes (comma separated)</label>
          <input
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="S, M, L, XL"
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="sm:col-span-2 flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="sm:col-span-2 flex gap-4 justify-center my-2">
          <button
            type="button"
            onClick={() => setUploadType("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              uploadType === "url"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Link2 size={18} /> Use Image URL
          </button>

          <button
            type="button"
            onClick={() => setUploadType("file")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              uploadType === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Upload size={18} /> Upload from Device
          </button>
        </div>

        {uploadType === "url" ? (
          <input
            name="image"
            type="url"
            placeholder="Image URL"
            value={formData.image || ""}
            onChange={(e) => {
              handleChange(e);
              setImagePreview(e.target.value);
            }}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none sm:col-span-2"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 sm:col-span-2"
          />
        )}

        {imagePreview && (
          <motion.img
            src={imagePreview}
            alt="Preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-40 h-40 object-cover rounded-lg shadow-md mx-auto border sm:col-span-2"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg sm:col-span-2 mt-4 font-semibold shadow-lg"
        >
          Update Product
        </motion.button>
      </motion.form>
    </div>
  );
}
