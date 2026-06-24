export type BookType = 'Textbook' | 'Notes' | 'Past Papers' | 'Stationery';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string; // 'o-level' | 'a-level' | 'fsc' | 'matric' | 'stationery'
  subcategory: string; // 'textbooks' | 'solved-notes' | 'past-papers' | 'part-1' | 'part-2' | 'class-9' | 'class-10' | 'notebooks' | 'pens' | 'calculators'
  type: BookType;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  isBestSeller: boolean;
  stock: number;
  publisher?: string;
  year?: string;
  pages?: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area: string; // Lahore area (e.g., Gulberg, DHA, Johar Town, etc.)
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export interface FilterState {
  search: string;
  category: string;
  subcategory: string;
  type: string;
  priceRange: [number, number];
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating';
}
