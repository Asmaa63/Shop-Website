// --- Core Data Structures ---

// Base Product Interface
export interface Product {
  _id: string; // MongoDB ID
  name: string;
  price: number;
  stock: number; // Available quantity
  category: string;
  description: string;
  imageUrl: string;
  slug: string; 
  createdAt: Date;
  updatedAt: Date;
}

// User Interface (used with NextAuth.js)
export interface User {
  _id: string; // MongoDB ID
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin'; // Role-based access control
  createdAt: Date;
}

// Interface for items inside an order
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// **NEW ADDITION: CartItem** (Used by cart store and payment API)
export interface CartItem extends Product {
  quantity: number;
}

// **NEW ADDITION: ShippingAddress** (Used by checkout form and payment API)
export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
}

// Order Interface
export interface Order {
  _id: string; // MongoDB ID
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress; // Use the new interface
  totalAmount: number;
  paymentMethod: 'Stripe' | 'PayPal' | 'CashOnDelivery';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}