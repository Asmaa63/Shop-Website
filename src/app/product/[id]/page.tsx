import { notFound } from "next/navigation";
import ProductDetails from "@/components/customer/ProductDetails";
import RelatedProducts from "@/components/customer/RelatedProducts";
import productsData from "@/data/products.json";
import { Product, RawProductData, ProductsDataFile } from "@/lib/types";

// 1️⃣ Cast JSON data safely
const data = productsData as unknown as ProductsDataFile;

// 2️⃣ Extract raw products
const rawProducts: RawProductData[] = data.products;

// 3️⃣ Map raw data to Product interface, adding defaults for required fields
const products: Product[] = rawProducts.map((p) => ({
  ...p,

  productId: p.productId || (typeof p.id === "number" ? p.id : Math.floor(Math.random() * 100000)),
  quantity: 1,
  selectedColor: p.colors?.[0] || "",
  selectedSize: p.sizes?.[0] || "",

  id: String(p.id),
  _id: String(p.id),
  imageUrl: p.image || "",
  stock: p.stockQuantity || 0,

  // ✅ Add missing fields required by Product type
  slug: p.name?.toLowerCase().replace(/\s+/g, "-") || `product-${p.id}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

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
