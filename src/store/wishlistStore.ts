import { create } from "zustand";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  discount?: number;
  inStock?: boolean;
  stock?: number;
};

interface WishlistStore {
  items: Product[];
  fetchWishlist: (userId: string) => Promise<void>;
  addItem: (userId: string, product: Product) => Promise<void>;
  removeItem: (userId: string, productId: string) => Promise<void>;
  clearWishlist: (userId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void; // 👈 أضفناها هنا
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  fetchWishlist: async (userId) => {
    const res = await fetch(`/api/wishlist?userId=${userId}`);
    const data = await res.json();
    set({ items: data.items || [] });
  },

  addItem: async (userId, product) => {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, product }),
    });
    set((state) => ({ items: [...state.items, product] }));
  },

  removeItem: async (userId, productId) => {
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });
    set((state) => ({
      items: state.items.filter((p) => p.id !== productId),
    }));
  },

  clearWishlist: async (userId) => {
    await fetch("/api/wishlist/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    set({ items: [] });
  },

  isInWishlist: (productId) => {
    const { items } = get();
    return items.some((p) => p.id === productId);
  },

  // ✅ الدالة اللي كانت ناقصة
  toggleItem: (product) => {
    const { items, isInWishlist } = get();
    if (isInWishlist(product.id)) {
      set({ items: items.filter((p) => p.id !== product.id) });
    } else {
      set({ items: [...items, product] });
    }
  },
}));
