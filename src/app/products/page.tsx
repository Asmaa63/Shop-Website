import Header from '@/components/layout/Header';
import ProductsGrid from '@/components/customer/ProductsGrid';
import productsData from '@/data/products.json';

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <ProductsGrid 
          products={productsData.products} 
          title="All Products" 
          showFilters={true} 
        />
      </main>
    </>
  );
}
