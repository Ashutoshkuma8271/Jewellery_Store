export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  badge?: 'NEW' | 'SALE' | 'EXCLUSIVE' | 'LIMITED';
  description: string;
  isFeatured?: boolean;
  isEditorialPick?: boolean;
  inStock: boolean;
  specs?: Record<string, string>;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  image: string;
  itemCount: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  date: string;
}

export interface FlashSale {
  title: string;
  subtitle: string;
  discount: string;
  endTime: string;
  items: Product[];
}

export interface ValueProp {
  icon: string;
  title: string;
  description: string;
}
