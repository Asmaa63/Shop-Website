"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { X, Upload, Link2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type AddProductModalProps = {
  onClose: () => void;
  onSave: () => void;
};

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

type InputFieldProps = {
  name: keyof FormDataType;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
};

const categories: Category[] = [
  { name: "Electronics", subcategories: ["Phones", "Laptops", "Headphones", "Cameras"] },
  { name: "Fashion", subcategories: ["Men", "Women", "Kids", "Accessories"] },
  { name: "Home & Kitchen", subcategories: ["Furniture", "Appliances", "Decor", "Cookware"] },
  { name: "Beauty", subcategories: ["Skincare", "Makeup", "Fragrances", "Hair Care"] },
  { name: "Sports", subcategories: ["Fitness", "Outdoor", "Footwear", "Apparel"] },
];

const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "Dell"];

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
  />
);

const compressImage = (file: File, maxSizeKB: number = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const maxDimension = 800;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.7;
        let base64 = canvas.toDataURL("image/jpeg", quality);

        while (base64.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(base64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function AddProductModal({
  onClose,
  onSave,
}: AddProductModalProps) {
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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadType, setUploadType] = useState<"url" | "file">("url");
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
  }, [uploadType]);

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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(file, 100);
        setImagePreview(compressedBase64);
        setFormData((prev) => ({ ...prev, image: compressedBase64 }));
        toast.success("Image compressed successfully!");
      } catch (error) {
        toast.error("Failed to compress image");
        console.error(error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please add an image");
      return;
    }

    const formattedData = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      image: formData.image,
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      inStock: formData.inStock,
      stockQuantity: parseInt(formData.stockQuantity),
      rating: 0,
      reviewCount: 0,
      features: [],
      colors: formData.colors.split(",").map((c) => c.trim()).filter(c => c),
      sizes: formData.sizes.split(",").map((s) => s.trim()).filter(s => s),
    };

    try {
      const res = await fetch("https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
        }

        toast.success("✅ Product added successfully!", { duration: 3000 });
        onSave();
        setTimeout(() => onClose(), 1000);
      } else {
        const errorText = await res.text();
        if (errorText.includes("Payload Too Large")) {
          toast.error("❌ Image is too large. Please use a smaller image or URL.");
        } else {
          toast.error("❌ Failed to add product");
        }
      }
    } catch (error) {
      toast.error("⚠️ Server error occurred");
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <Toaster position="top-right" />

      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">➕ Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-red-100 rounded-full transition-all"
          >
            <X
              size={22}
              className="text-gray-500 hover:text-red-600 transition-transform hover:rotate-90"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
          <div className="flex flex-col">
            <InputField name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" />
            <small className="text-gray-600 mt-1">Example: iPhone 14 Pro</small>
          </div>

          <div className="flex flex-col">
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <small className="text-gray-600 mt-1">Example: Apple, Samsung, Nike</small>
          </div>

          <div className="flex flex-col">
            <InputField name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" />
            <small className="text-gray-600 mt-1">Example: 899.99</small>
          </div>

          <div className="flex flex-col">
            <InputField name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} placeholder="Original Price" />
            <small className="text-gray-600 mt-1">Example: 999.99</small>
          </div>

          <div className="flex flex-col">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <small className="text-gray-600 mt-1">Choose main category</small>
          </div>

          <div className="flex flex-col">
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
            </select>
            <small className="text-gray-600 mt-1">Choose related subcategory</small>
          </div>

          <div className="flex flex-col">
            <InputField
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="Stock Quantity"
            />
            <small className="text-gray-600 mt-1">How many items in stock?</small>
          </div>

          <div className="flex flex-col">
            <InputField
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              placeholder="Colors (comma separated)"
            />
            <small className="text-gray-600 mt-1">Example: Red, Blue, Black</small>
          </div>

          <div className="flex flex-col">
            <InputField
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              placeholder="Sizes (comma separated)"
            />
            <small className="text-gray-600 mt-1">Example: S, M, L, XL</small>
          </div>

          <div className="sm:col-span-2 flex flex-col">
            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none bg-white text-gray-800"
            />
            <small className="text-gray-600 mt-1">Describe the product clearly</small>
          </div>

          <div className="sm:col-span-2 flex gap-4 justify-center my-2">
            <button
              type="button"
              onClick={() => setUploadType("url")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                uploadType === "url"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
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
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
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
              value={formData.image}
              onChange={(e) => {
                const url = e.target.value;
                setFormData((prev) => ({ ...prev, image: url }));
                setImagePreview(url);
              }}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 sm:col-span-2"
            />
          ) : (
            <div className="sm:col-span-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isCompressing}
                className="border p-2 rounded-lg bg-white text-gray-800 w-full"
              />
              {isCompressing && (
                <small className="text-blue-600 mt-1 block">Compressing image...</small>
              )}
            </div>
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
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={isCompressing}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg sm:col-span-2 mt-2 font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💾 Save Product
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
