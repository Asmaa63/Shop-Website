import { notFound } from "next/navigation";
import ProductDetails from "@/components/customer/ProductDetails";
import RelatedProducts from "@/components/customer/RelatedProducts";
import productsData from "@/data/products.json";
import { Product, RawProductData, ProductsDataFile } from "@/lib/types";

const data = productsData as unknown as ProductsDataFile;
const rawProducts: RawProductData[] = data.products;

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
  slug: p.name?.toLowerCase().replace(/\s+/g, "-") || `product-${p.id}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FixedPageProps = Record<string, any>;

export default async function ProductPage({ params }: FixedPageProps) {
  const id = params?.id?.toString?.() ?? "";

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
