"use client";

import { ChangeEvent } from "react";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  brand: string;
  onBrand: (v: string) => void;
  availableCategories: string[];
  availableBrands: string[];
}

export default function ProductFilters({
  search,
  onSearch,
  category,
  onCategory,
  brand,
  onBrand,
  availableCategories,
  availableBrands,
}: Props) {
  return (
    <div className="bg-white backdrop-blur-sm p-4 rounded-2xl border border-white flex flex-col sm:flex-row gap-3 items-center">
      <input
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
        placeholder="Search products, brands or categories..."
        className="flex-1 bg-transparent border border-white/10 px-4 py-2 rounded-lg outline-none placeholder-black"
      />

      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        className="bg-transparent border border-white/10 px-3 py-2 rounded-lg outline-none text-black"
      >
        <option value="">All Categories</option>
        {availableCategories.map((c) => (
          <option key={c} value={c} className="bg-gray-300">
            {c}
          </option>
        ))}
      </select>

      <select
        value={brand}
        onChange={(e) => onBrand(e.target.value)}
        className="bg-transparent border border-white/10 px-3 py-2 rounded-lg outline-none text-black "
      >
        <option value="" >All Brands</option>
        {availableBrands.map((b) => (
          <option key={b} value={b} className="bg-gray-300" >
            {b}
          </option>
        ))}
      </select>

      <button
        onClick={() => {
          onSearch("");
          onCategory("");
          onBrand("");
        }}
        className="px-4 py-2 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg hover:opacity-90"
      >
        Reset
      </button>
    </div>
  );
}
