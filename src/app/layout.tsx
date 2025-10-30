// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ShopEC | Premium E-Commerce Store for Fashion and Tech",
    template: "%s | ShopEC Store",
  },
  description:
    "Discover ShopEC's curated collection of modern fashion, smart electronics, and home essentials. Shop the best quality products with ShopEC offers.",
  keywords: [
    "e-commerce store",
    "online shopping",
    "fashion",
    "electronics",
    "best deals",
    "ShopEC",
  ],
  openGraph: {
    title: "ShopEC Store | Your Luxury Shopping Destination",
    description: "Explore the latest deals and ShopEC products from ShopEC.",
    url: "https://your-domain.com",
    siteName: "ShopEC",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        alt: "ShopEC E-Commerce Store Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
