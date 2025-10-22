"use client"; 

import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Header";
import Providers from "@/components/Providers";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export default function SiteLayout({
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
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
