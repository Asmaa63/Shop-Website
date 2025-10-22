"use client";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/site/shop/new" },
    { name: "Best Sellers", href: "/site/shop/popular" },
    { name: "Sale Items", href: "/site/shop/sale" },
    { name: "All Categories", href: "/site/shop" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Shipping & Returns", href: "/site/shipping" },
    { name: "Order Tracking", href: "/site/tracking" },
    { name: "Help Center", href: "/site/contact" },
  ],
  company: [
    { name: "About Us", href: "/site/about" },
    { name: "Our Blog", href: "/site/blog" },
    { name: "Careers", href: "/site/careers" },
    { name: "Terms & Conditions", href: "/site/terms" },
  ],
};

const socialMedia = [
  { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600" },
  { icon: Instagram, href: "https://instagram.com", color: "hover:text-pink-600" },
  { icon: Twitter, href: "https://twitter.com", color: "hover:text-blue-400" },
  { icon: Youtube, href: "https://youtube.com", color: "hover:text-red-600" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section: Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 border-b border-gray-800 pb-12">
          
          {/* Brand Info & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center text-3xl font-extrabold text-white mb-4 transition-colors hover:text-blue-400">
              <span className="text-blue-400 text-4xl mr-2">🛒</span> ShopEase
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your ultimate destination for quality products and unbeatable prices.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                123 Commerce St, Tech City, USA 10001
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                support@shopease.com
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b-2 border-blue-400 inline-block pb-1">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 flex items-center hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-70" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b-2 border-blue-400 inline-block pb-1">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 flex items-center hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-70" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b-2 border-blue-400 inline-block pb-1">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 flex items-center hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-70" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Social & Payment */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ShopEase. All Rights Reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-6">
            {socialMedia.map((social) => (
              <a 
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 transition-colors duration-300 transform hover:scale-125 EGP{social.color}`}
                aria-label={social.href.split('.').at(-2)}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          {/* Payment Icons (Using Emojis for simplicity) */}
          <div className="text-2xl text-gray-400 space-x-3">
            <span>💳</span>
            <span>🅿️</span>
            <span>🍎</span>
            <span>🔒</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
