import { notFound } from "next/navigation";
import ProductDetails from "@/components/customer/ProductDetails";
import RelatedProducts from "@/components/customer/RelatedProducts";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";

const products: Product[] = (productsData as { products: Product[] }).products;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      <ProductDetails product={product} />
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
