import { notFound } from "next/navigation";
import ProductDetails from "@/components/customer/ProductDetails";
import RelatedProducts from "@/components/customer/RelatedProducts";
import { Product } from "@/lib/types";
import { Metadata } from "next";

// 🧠 جلب منتج واحد من MockAPI
async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products/${id}`, {
      cache: "no-store", // 👈 عشان يجيب آخر تحديث
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

// 🧠 جلب منتجات مشابهة (للعرض أسفل التفاصيل)
async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  try {
    const res = await fetch(`https://68f0b6520b966ad50033e04c.mockapi.io/ecommerce/products`);
    if (!res.ok) return [];
    const data: Product[] = await res.json();
    return data.filter((p) => p.category === category && p.id !== currentId).slice(0, 4);
  } catch {
    return [];
  }
}

// 🧭 Dynamic Metadata (SEO)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: "Product Not Found | Exclusive Store",
      description: "The product you are looking for does not exist.",
    };
  }

  return {
    title: `${product.name} | Exclusive Store`,
    description: product.description?.slice(0, 150) || "",
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <ProductDetails product={product} />
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}

