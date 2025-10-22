'use client';

import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "📱",
    itemCount: 234,
    bgColor: "from-blue-500 to-blue-600",
    link: "/site/shop?category=electronics"
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👔",
    itemCount: 456,
    bgColor: "from-pink-500 to-rose-600",
    link: "/site/shop?category=fashion"
  },
  {
    id: 3,
    name: "Home & Garden",
    icon: "🏠",
    itemCount: 189,
    bgColor: "from-green-500 to-emerald-600",
    link: "/site/shop?category=home"
  },
  {
    id: 4,
    name: "Sports",
    icon: "⚽",
    itemCount: 298,
    bgColor: "from-orange-500 to-red-600",
    link: "/site/shop?category=sports"
  },
  {
    id: 5,
    name: "Books",
    icon: "📚",
    itemCount: 567,
    bgColor: "from-purple-500 to-indigo-600",
    link: "/site/shop?category=books"
  },
  {
    id: 6,
    name: "Beauty",
    icon: "💄",
    itemCount: 342,
    bgColor: "from-yellow-500 to-amber-600",
    link: "/site/shop?category=beauty"
  }
];

export default function CategoriesGrid() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Browse our wide range of product categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group"
            >
              <div className={`bg-gradient-to-br ${category.bgColor} rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-white hover-lift transition-smooth relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    {category.itemCount} items
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/site/shop"
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-smooth"
          >
            View All Categories 
          </Link>
        </div>
      </div>
    </div>
  );
}