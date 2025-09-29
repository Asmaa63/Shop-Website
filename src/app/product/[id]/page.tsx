import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProductDetails from '@/components/customer/ProductDetails';
import RelatedProducts from '@/components/customer/RelatedProducts';
import productsData from '@/data/products.json';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id);
  const product = productsData.products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const relatedProducts = productsData.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <ProductDetails product={product} />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
    </>
  );
}
