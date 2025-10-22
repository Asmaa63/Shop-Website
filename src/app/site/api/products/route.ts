import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 
import { Product } from '@/types';
import { Filter, Document } from 'mongodb'; // Removed BSON import

// GET /api/products?category=electronics&sort=price_desc

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('ecommerceDB');
    const collection = db.collection<Product>('products');

    const searchParams = request.nextUrl.searchParams;
    
    // --- 1. Filtering Logic ---
    const filter: Filter<Product> = {}; 
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    if (category && category !== 'all') {
      filter.category = category; 
    }
    
    if (minPrice || maxPrice) {
        filter.price = filter.price || {};
        const priceFilter = filter.price as { EGPgte?: number, EGPlte?: number };
        
        if (minPrice) priceFilter.EGPgte = parseFloat(minPrice);
        if (maxPrice) priceFilter.EGPlte = parseFloat(maxPrice);
    }

    if (search) {
        // FIX 1: Using built-in RegExp and dynamic key assignment to avoid 'as any'
        const regexFilter = new RegExp(search, 'i');
        
        const orConditions: Document[] = [
            { name: { EGPregex: regexFilter } },
            { description: { EGPregex: regexFilter } }
        ];

        // FIX 2: Using bracket notation to set EGPor dynamically, bypassing the complex type checking
        // This is a common pattern to avoid 'as any' on the filter object itself.
        filter['EGPor'] = orConditions; 
    }
    
    // --- 2. Sorting Logic ---
    let sort: { [key: string]: 1 | -1 } = { createdAt: -1 }; 
    const sortBy = searchParams.get('sort');

    if (sortBy) {
        if (sortBy === 'price_asc') {
            sort = { price: 1 };
        } else if (sortBy === 'price_desc') {
            sort = { price: -1 };
        } else if (sortBy === 'name_asc') {
            sort = { name: 1 };
        }
    }

    const products = await collection.find(filter).sort(sort).toArray();
    
    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}