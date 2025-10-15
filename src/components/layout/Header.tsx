"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Heart,
    User,
    Search,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Settings,
    Package,
    Phone,
    Mail,
    Home,
    Info,
    PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const categories = [
    { name: "Electronics", href: "/shop?category=electronics" },
    { name: "Fashion", href: "/shop?category=fashion" },
    { name: "Home & Garden", href: "/shop?category=home" },
    { name: "Sports", href: "/shop?category=sports" },
    { name: "Books", href: "/shop?category=books" },
];

const mainLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: ShoppingCart },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: PhoneCall },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: session, status } = useSession();
    const user = session?.user;

    // FIX: Use a selector function to compute the total number of items from the cart state.
    const cartItemsCount = useCartStore(state => 
        state.items.reduce((total, item) => total + item.quantity, 0)
    );
    
    // Use selector for wishlist items
    const wishlistItems = useWishlistStore(state => state.items);
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const isActive = (path: string) => pathname === path;

    const navIconStyle = "w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors";
    const activeLinkClass = "text-red-500 font-bold border-b-2 border-red-500 pb-1";
    const defaultLinkClass = "text-gray-700 hover:text-red-500 transition-colors relative";

    return (
        <>
            {/* Top Bar - Black */}
            <div className="bg-black text-white py-2 text-sm">
                <div className="container mx-auto px-4 overflow-hidden"> {/* Added overflow-hidden to help contain content */}
                    <div className="flex items-center justify-between">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden md:block"
                        >
                            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
                            <Link href="/shop" className="font-semibold underline ml-2 hover:text-red-400">
                                Shop Now
                            </Link>
                        </motion.p>
                        <p className="md:hidden">🔥 50% OFF Summer Sale!</p>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span className="hidden sm:inline">+20 1065307167</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="hidden lg:inline">support@exclusive.com.eg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`sticky top-0 z-50 bg-white transition-all duration-300 border-b border-gray-200 ${
                    isScrolled ? "shadow-lg py-3" : "py-4"
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4 sm:gap-8">
                        {/* Logo */}
                        <Link href="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 flex-shrink-0"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                    Exclusive
                                </span>
                            </motion.div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {mainLinks.map((link, index) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.path}
                                        className={`font-medium ${
                                            isActive(link.path) ? activeLinkClass : defaultLinkClass
                                        }`}
                                    >
                                        {link.name}
                                        {isActive(link.path) && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 "
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="font-medium hover:text-red-500 transition-colors">
                                        Categories
                                        <ChevronDown className="ml-1 w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {categories.map((category) => (
                                        <DropdownMenuItem key={category.name} asChild>
                                            <Link href={category.href} className="cursor-pointer hover:bg-red-50 transition-colors">
                                                {category.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Search Bar (Desktop/Tablet) */}
                        <div className="hidden md:flex flex-1 max-w-sm">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-2 rounded-full border-2 border-gray-200 focus:border-red-500 transition-colors"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 hover:bg-red-600"
                                >
                                    <Search className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Icons (Wishlist, Cart, User) - Visible on md and up - MODIFIED */}
                        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                            {/* Wishlist */}
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link href="/wishlist">
                                    <Button variant="ghost" size="icon" className="relative group">
                                        <Heart
                                            className={`w-5 h-5 ${navIconStyle} ${
                                                wishlistCount > 0 ? "fill-red-500 text-red-500" : ""
                                            }`}
                                        />
                                        {mounted && wishlistCount > 0 && (
                                            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                                                {wishlistCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Cart */}
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link href="/cart">
                                    <Button variant="ghost" size="icon" className="relative group">
                                        <ShoppingCart className={navIconStyle} />
                                        {mounted && cartItemsCount > 0 && (
                                            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                                                {cartItemsCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* User Account/Login */}
                            {status === "loading" ? (
                                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                            ) : user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Button variant="ghost" size="icon" className="relative">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                            </Button>
                                        </motion.div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-3 py-2">
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="hover:bg-red-50 transition-colors">
                                            <Link href="/account" className="cursor-pointer">
                                                <User className="mr-2 w-4 h-4" />
                                                My Account
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="hover:bg-red-50 transition-colors">
                                            <Link href="/account/orders" className="cursor-pointer">
                                                <Package className="mr-2 w-4 h-4" />
                                                Orders
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="hover:bg-red-50 transition-colors">
                                            <Link href="/account/settings" className="cursor-pointer">
                                                <Settings className="mr-2 w-4 h-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer hover:bg-red-50 transition-colors">
                                            <LogOut className="mr-2 w-4 h-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login" className="hidden lg:block"> {/* Hide login button on small screens to save space */}
                                    <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full">
                                        <User className="w-4 h-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Search, Cart, Menu Icons for Mobile (visible on small screens) */}
                        <div className="flex items-center gap-2 md:hidden">
                            {/* Mobile Search Icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(true)}
                                className="flex-shrink-0"
                            >
                                <Search className="w-5 h-5 text-gray-700" />
                            </Button>
                            {/* Mobile Menu Toggle */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                                        <Menu className="w-6 h-6 text-gray-700" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80 sm:w-96 flex flex-col">
                                    <SheetHeader>
                                        <SheetTitle className="text-2xl font-bold text-red-500">Navigation</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto space-y-6 pt-4">
                                        
                                        {/* Mobile Main Links (Home, Shop, About, Contact) */}
                                        <div className="space-y-2 border-b pb-4">
                                            {mainLinks.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    href={link.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-all ${
                                                        isActive(link.path)
                                                            ? "bg-red-500 text-white shadow-lg"
                                                            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                                                    }`}
                                                >
                                                    <link.icon className="w-5 h-5" />
                                                    <span>{link.name}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Mobile Categories - DIFFERENT COLOR/STYLE APPLIED HERE */}
                                        <div className="space-y-2 border-b pb-4">
                                            <p className="text-base font-bold mb-2 px-4 text-red-500">Product Categories</p>
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.name}
                                                    href={category.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center py-2 px-4 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                        
                                        {/* Mobile Icons (Wishlist, Cart, Account) - MOVED HERE */}
                                        <div className="space-y-2 border-b pb-4">
                                            <p className="text-base font-bold mb-2 px-4 text-gray-700">User</p>
                                            <div className="grid grid-cols-2 gap-2 px-4">
                                                {/* Wishlist in Mobile */}
                                                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-start p-3 rounded-lg border hover:bg-red-50 transition-colors">
                                                    <Heart className={`w-5 h-5 mr-2 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                                                    Wishlist ({wishlistCount})
                                                </Link>
                                                {/* Cart in Mobile */}
                                                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-start p-3 rounded-lg border hover:bg-red-50 transition-colors">
                                                    <ShoppingCart className="w-5 h-5 mr-2 text-gray-600" />
                                                    Cart ({cartItemsCount})
                                                </Link>
                                            </div>
                                            {/* Account/Login in Mobile */}
                                            {user ? (
                                                <>
                                                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center py-3 px-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                        <User className="w-5 h-5 mr-3" />
                                                        My Account
                                                    </Link>
                                                    <button onClick={handleLogout} className="w-full text-left flex items-center py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                                                        <LogOut className="w-5 h-5 mr-3" />
                                                        Logout
                                                    </button>
                                                </>
                                            ) : (
                                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-left flex items-center py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                                                    <User className="w-5 h-5 mr-3" />
                                                    Login
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -100 }}
                            animate={{ y: 0 }}
                            exit={{ y: -100 }}
                            className="bg-white p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSearch} className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 rounded-full"
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 hover:bg-red-600"
                                >
                                    <Search className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -right-12 top-1/2 -translate-y-1/2"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    <X className="w-6 h-6 text-white" />
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}