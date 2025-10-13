import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Header";
import Providers from "@/components/Providers";
// import Footer from "@/components/layout/Footer";
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exclusive - Your Premium E-Commerce Store",
  description: "Shop the best products at amazing prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
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