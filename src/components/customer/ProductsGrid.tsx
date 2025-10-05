"use client";

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter, Grid, List } from 'lucide-react';

// Local definition of Product and related types to ensure type compatibility 
// with ProductCard and resolve the Type 'Product' is missing properties error.
interface Product {
    id: string;
    _id: string; 
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    brand?: string;
    image: string;
    imageUrl: string;
    rating?: number;
    discount?: number;
    inStock?: boolean;
    stock: number;
    description: string;
}

type SortField = 'name' | 'price' | 'rating' | 'newest';

interface SortOptions {
    field: SortField;
    direction: 'asc' | 'desc';
}
// FilterOptions is not explicitly needed here as types are defined inline.


interface ProductsGridProps {
  products: Product[];
  title?: string;
  showFilters?: boolean;
}

export default function ProductsGrid({ 
  products, 
  title = "All Products",
  showFilters = true 
}: ProductsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOptions>({ field: 'name', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const isSortField = (field: string): field is SortField => {
    return ['name', 'price', 'rating', 'newest'].includes(field);
  };

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy.field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'newest':
          // Convert string IDs to numbers for comparison (assuming higher ID means newer product).
          aValue = parseInt(a.id, 10); 
          bValue = parseInt(b.id, 10);
          if (isNaN(aValue) || isNaN(bValue)) {
            aValue = a.id;
            bValue = b.id;
          }
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      // Standard comparison logic
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortBy.direction === 'desc' ? -comparison : comparison;
      }

      // Numeric comparison
      const numericComparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortBy.direction === 'desc' ? -numericComparison : numericComparison;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Filters and Search */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${sortBy.field}-${sortBy.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  if (isSortField(field)) {
                    setSortBy({ 
                      field, 
                      direction: direction as 'asc' | 'desc' 
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="newest-desc">Newest First</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-smooth ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-smooth ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Load More Button (for future pagination) */}
      {filteredProducts.length >= 8 && (
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-smooth">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}
