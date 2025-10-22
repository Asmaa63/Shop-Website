
import type { Metadata } from "next";
import Link from 'next/link';
import HeroSlider from '@/components/customer/HeroSlider';
import CategoriesGrid from '@/components/customer/CategoriesGrid';
import FlashDeals from '@/components/customer/FlashDeals';
import ProductCard from '@/components/customer/ProductCard';
import productsData from '@/data/products.json';
import { Product, RawProductData } from "@/lib/types"; 


// ✅ SEO METADATA FOR HOME PAGE
// ----------------------------------------------------
export const metadata: Metadata = {
  title: "Exclusive Store | Shop the Best Deals on Tech, Fashion & Home Essentials",
  description: "Welcome to Exclusive! Discover amazing flash deals, featured top-rated products, and explore essential categories. Enjoy free shipping, secure payment, and premium quality on all orders.",
  keywords: ["exclusive store", "online shopping deals", "featured products", "flash sales", "e-commerce home"],
  openGraph: {
    images: ['/images/homepage-banner.jpg'], // Make sure to use an eye-catching banner image
  }
};

export default function Home() {
  // Show only first 8 products on homepage
  // Map the source data to the required Product interface
 const featuredProducts: Product[] = (productsData.products as RawProductData[])
  .slice(0, 8)
  .map(product => ({
    ...product,
    id: String(product.id),
    _id: String(product.id),
    imageUrl: product.image,
    stock: product.stockQuantity,
    rating: product.rating || 4.0,
    discount: product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0,

    // ✅ إضافة الخصائص المطلوبة اللي الـ ProductCard محتاجها
    productId: Number(product.id),
    quantity: 1,
    selectedColor: product.colors?.[0] || '',
    selectedSize: product.sizes?.[0] || '',
    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return (
    <> 
      <main className="min-h-screen bg-gray-50">
        {/* Hero Slider */}
        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <HeroSlider />
          </div>
        </div>

        {/* Categories Grid */}
        <CategoriesGrid />

        {/* Flash Deals */}
        <FlashDeals />

        {/* Featured Products */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🔥 Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Check out our most popular items
            </p>
          </div>
          
          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Link
              href="/site/shop"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-smooth text-lg"
            >
              View All Products →
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ✨ Why Choose ShopEase?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the best online shopping
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-lg hover-lift transition-smooth text-center border border-green-100">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over EGP 500</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg hover-lift transition-smooth text-center border border-blue-100">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Products</h3>
              <p className="text-gray-600">High-quality products from trusted brands</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg hover-lift transition-smooth text-center border border-purple-100">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment with SSL encryption</p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              📧 Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-white opacity-90 mb-8">
              Get the latest updates on new products and exclusive offers!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-smooth shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
