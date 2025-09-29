'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`bg-white shadow-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-white/95' : ''
      }`}
    >
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 gradient-animate text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <p className="animate-slide-in-right">🚚 Free shipping on orders over $50</p>
          <div className="hidden md:flex items-center space-x-4 animate-fade-in-up">
            <Link href="/contact" className="hover:text-yellow-300 transition-smooth">Contact</Link>
            <Link href="/help" className="hover:text-yellow-300 transition-smooth">Help</Link>
            <Link href="/admin" className="hover:text-yellow-300 transition-smooth">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover-scale transition-smooth">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-smooth">
                ShopEase
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Your Shopping Destination</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth font-inter group-hover:shadow-md"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-smooth" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            {/* Search Button for Mobile */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl hover-scale transition-smooth">
              <Search className="w-6 h-6 text-gray-600" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:flex items-center space-x-1 hover:text-pink-600 transition-smooth hover-lift p-2 rounded-xl group">
              <Heart className="w-6 h-6 group-hover:fill-pink-600 transition-smooth" />
              <span className="hidden lg:block text-sm font-medium">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center space-x-1 hover:text-blue-600 transition-smooth relative hover-lift p-2 rounded-xl group">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-smooth" />
              <span className="hidden lg:block text-sm font-medium">Cart</span>
              {/* Cart Count Badge */}
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-subtle font-semibold">
                3
              </span>
            </Link>

            {/* User Account */}
            <Link href="/account" className="hidden sm:flex items-center space-x-1 hover:text-green-600 transition-smooth hover-lift p-2 rounded-xl group">
              <User className="w-6 h-6 group-hover:scale-110 transition-smooth" />
              <span className="hidden lg:block text-sm font-medium">Account</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center justify-center mt-4 space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Shop
          </Link>
          <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Categories
          </Link>
          <Link href="/deals" className="text-red-600 font-medium hover:text-red-700 transition-colors">
            🔥 Deals
          </Link>
          <Link href="/new-arrivals" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            New Arrivals
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 font-medium py-2">Home</Link>
              <Link href="/shop" className="text-gray-700 font-medium py-2">Shop</Link>
              <Link href="/categories" className="text-gray-700 font-medium py-2">Categories</Link>
              <Link href="/deals" className="text-red-600 font-medium py-2">🔥 Deals</Link>
              <Link href="/wishlist" className="text-gray-700 font-medium py-2">Wishlist</Link>
              <Link href="/account" className="text-gray-700 font-medium py-2">Account</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}