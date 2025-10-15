import { notFound } from "next/navigation";
import ProductDetails from "@/components/customer/ProductDetails";
import RelatedProducts from "@/components/customer/RelatedProducts";
import productsData from "@/data/products.json";
import { Product, RawProductData, ProductsDataFile } from "@/lib/types";
import { Metadata } from "next"; 

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
  slug: p.name?.toLowerCase().replace(/\s+/g, "-") || `product-EGP{p.id}`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

interface ProductPageProps {
  params: {
    id: string; // The dynamic segment from the URL
  };
}

// --- Dynamic Metadata Generation (SEO) ---
/**
 * Generates dynamic SEO metadata (title, description) based on the product ID.
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const id = params.id;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found | Exclusive Store",
      description: "The product you are looking for does not exist or has been discontinued.",
    };
  }

  // Create dynamic title and use a truncated description for brevity
  const description = product.description.substring(0, 150).trim() + (product.description.length > 150 ? '...' : '');

  return {
    title: `${product.name} - ${product.brand} | Exclusive Store`,
    description: description,
    keywords: [
      product.name.toLowerCase(),  
      product.category.toLowerCase(), 
      "product details", 
      "buy online"
    ],
  };
}
// ------------------------------------------

export default async function ProductPage({ params }: ProductPageProps) {
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
