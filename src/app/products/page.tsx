import ProductsGrid from '@/components/customer/ProductsGrid';
import productsData from '@/data/products.json';
// NEW: Import the correct Product type (ensure path is correct)
import { Product } from '@/lib/types'; 

// NEW: Use Type Assertion to explicitly define the structure of productsData
// This creates a products array that TypeScript trusts is of type Product[]
const products: Product[] = (productsData as { products: Product[] }).products;

export default function ProductsPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <ProductsGrid 
          // Use the new strongly typed 'products' array
          products={products} 
          title="All Products" 
          showFilters={true} 
        />
      </main>
    </>
  );
}