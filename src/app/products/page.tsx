import ProductsGrid from '@/components/customer/ProductsGrid';
import productsData from '@/data/products.json';
import { Product } from '@/lib/types';

// Define the shape of the source data item from products.json for safe access.
interface SourceProduct {
    id: number | string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    subcategory: string;
    description: string;
    inStock: boolean;
    stockQuantity: number;
    colors?: string[];
    tags?: string[];
    features?: string[];
    sizes?: string[];
    rating?: number;
}

// Map and transform the source data to the required Product interface
const products: Product[] = (productsData.products as SourceProduct[])
    .map(product => ({
        ...product,
        // Ensure id is a string
        id: String(product.id),
        // Add required properties that were missing or had different names
        _id: String(product.id), // Use id as _id
        imageUrl: product.image, // Use image as imageUrl
        stock: product.stockQuantity, // Map stockQuantity to stock
        // Ensure rating is present, defaulting to 4.0 if undefined
        rating: product.rating || 4.0, 
        discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
    } as Product));


export default function ProductsPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <ProductsGrid 
          // Pass the fully typed and mapped 'products' array
          products={products} 
          title="All Products" 
          showFilters={true} 
        />
      </main>
    </>
  );
}
