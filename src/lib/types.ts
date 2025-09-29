// أنواع البيانات الأساسية
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  subcategory: string
  description: string
  inStock: boolean
  stockQuantity: number
  rating: number
  reviewCount: number
  features: string[]
  colors: string[]
  sizes: string[]
}

export interface Category {
  id: string
  name: string
  subcategories: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  orderDate: string
  estimatedDelivery?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  orders: Order[]
  joinDate: string
}

// أنواع للفلاتر
export interface FilterOptions {
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  rating?: number
}

export interface SortOptions {
  field: 'name' | 'price' | 'rating' | 'newest'
  direction: 'asc' | 'desc'
}