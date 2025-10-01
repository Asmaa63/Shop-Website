import { notFound } from 'next/navigation';
import ProductDetails from '@/components/customer/ProductDetails';
import RelatedProducts from '@/components/customer/RelatedProducts';
import productsData from '@/data/products.json';
// Import the correct Product type from your types file
import { Product } from '@/lib/types'; 

interface ProductPageProps {
  params: {
    id: string; // The ID from the URL is a string
  };
}

// Assert the type of the products array from the imported JSON data
// We assume the type definition in '@/lib/types' is correct (id: string)
const products: Product[] = (productsData as { products: Product[] }).products;

export default function ProductPage({ params }: ProductPageProps) {
  const productId = params.id; 
  
  // Find the current product (id is string)
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  // Calculate related products, filter() always returns an array (or slice())
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <ProductDetails product={product} />
        {/* CRITICAL FIX: We rely on the internal safety check inside RelatedProducts.
          Since relatedProducts is guaranteed to be an array (even if empty) due to .filter() and .slice(), 
          we don't strictly need a check here, but we pass the array directly. 
        */}
        <RelatedProducts products={relatedProducts} />
      </main>
    </>
  );
}
