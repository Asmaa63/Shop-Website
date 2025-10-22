// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Exclusive | Premium E-Commerce Store for Fashion and Tech",
    template: "%s | Exclusive Store",
  },
  description:
    "Discover Exclusive's curated collection of modern fashion, smart electronics, and home essentials. Shop the best quality products with exclusive offers.",
  keywords: [
    "e-commerce store",
    "online shopping",
    "fashion",
    "electronics",
    "best deals",
    "Exclusive",
  ],
  openGraph: {
    title: "Exclusive Store | Your Luxury Shopping Destination",
    description: "Explore the latest deals and exclusive products from Exclusive.",
    url: "https://your-domain.com",
    siteName: "Exclusive",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        alt: "Exclusive E-Commerce Store Banner",
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
