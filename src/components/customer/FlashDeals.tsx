'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import productsData from '@/data/products.json';

export default function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get first 4 products with discount
  const flashDeals = productsData.products
    .filter(p => p.originalPrice)
    .slice(0, 4);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Timer */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">⚡</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Flash Deals
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              Limited time offers - grab them before they&apos;re gone!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <div className="bg-red-500 text-white rounded-xl p-4 text-center min-w-[80px]">
              <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm opacity-90">Hours</div>
            </div>
            <div className="bg-red-500 text-white rounded-xl p-4 text-center min-w-[80px]">
              <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm opacity-90">Minutes</div>
            </div>
            <div className="bg-red-500 text-white rounded-xl p-4 text-center min-w-[80px]">
              <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-sm opacity-90">Seconds</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.map(product => (
  <ProductCard key={String(product.id)} product={{ ...product, id: String(product.id) }} />
))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop?filter=deals"
            className="inline-block bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-smooth shadow-lg hover:shadow-xl"
          >
            View All Deals 🔥
          </Link>
        </div>
      </div>
    </div>
  );
}