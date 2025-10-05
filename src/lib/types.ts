export interface CategoryData {
    id: string | number; 
    name: string;
    slug?: string;
}

export interface RawProductData {
    id: string; 
    name: string;
    price: number;
    originalPrice?: number; 
    image: string;
    category: string;
    productId?: number; // Made optional to prevent initial loading errors from JSON
    subcategory?: string;      
    stockQuantity?: number;    
    reviewCount?: number;      
    features?: string[];       
    colors?: string[];         
    sizes?: string[];          
    description: string;
    inStock?: boolean;
    rating?: number;
    _id?: string; 
    imageUrl?: string;
    stock?: number;  
    brand?: string;
    discount?: number;
}


export interface Product {
    id: string; 
    name: string;
    price: number;
    originalPrice?: number; 
    image: string;
    category: string;
    productId: number;
    subcategory?: string;      
    stockQuantity?: number;    
    reviewCount?: number;      
    features?: string[];       
    colors?: string[];         
    sizes?: string[];          
    quantity: number; 
    selectedColor: string;
    selectedSize: string;
    description: string;
    inStock?: boolean;
    rating?: number;
    _id?: string; 
    imageUrl?: string;
    stock?: number;  
    brand?: string;
    discount?: number;
  slug: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsDataFile {
    products: RawProductData[];
    categories: CategoryData[]; // ✅ Replaced any[] with CategoryData[]
}

export interface CartItem {
    id: string; 
    name: string;
    price: number;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
}

export interface CartContextType {
    cartItems: CartItem[];
    addItemToCart: (item: CartItem) => void;
    cartCount: number; 
}


export interface FilterOptions {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
}

export interface SortOptions {
    field: 'name' | 'price' | 'rating' | 'newest';
    direction: 'asc' | 'desc';
}