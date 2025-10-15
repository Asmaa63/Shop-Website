// File: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Header";
import Providers from "@/components/Providers";
// import Footer from "@/components/layout/Footer";
import { CartProvider } from '@/context/CartContext';


const inter = Inter({ subsets: ["latin"] });

// ----------------------------------------------------
// ✅ METADATA IMPROVEMENT (All English)
// ----------------------------------------------------
export const metadata: Metadata = {
  // 1. Title: Clear, professional title with main keywords
  title: {
    default: "Exclusive | Premium E-Commerce Store for Fashion and Tech",
    template: "%s | Exclusive Store" // Template for inner pages (e.g., "New Product | Exclusive Store")
  },
  
  // 2. Description: Detailed description covering main store categories
  description: "Discover Exclusive's curated collection of modern fashion, smart electronics, and home essentials. Shop the best quality products with exclusive offers.",
  
  // 3. Keywords: General keywords for the store
  keywords: ["e-commerce store", "online shopping", "fashion", "electronics", "best deals", "Exclusive"],

  // 4. OpenGraph: For social media sharing optimization
  openGraph: {
    title: "Exclusive Store | Your Luxury Shopping Destination",
    description: "Explore the latest deals and exclusive products from Exclusive.",
    url: 'https://your-domain.com', // ⚠️ Please update with your actual domain
    siteName: 'Exclusive',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg', // High-quality image for social share (1200x630)
        alt: 'Exclusive E-Commerce Store Banner',
      },
    ],
    locale: 'en_US', // Setting locale to English
    type: 'website',
  },
};

// ----------------------------------------------------
// LAYOUT IMPLEMENTATION
// ----------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ Setting HTML language to English and direction to LTR
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://picsum.photos" />
      </head>
      <body className={inter.className}>
        <CartProvider>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-1">{children}</main>
            {/* <Footer/> */}
          </div>
        </Providers>
        </CartProvider>
      </body>
    </html>
  );
}