export interface Product {
  id: string | number;
  name: string;
  brand: 'Nike' | 'Jordan' | 'Adidas' | 'New Balance' | 'Puma' | 'Asics' | string;
  category: 'casual' | 'corrida' | 'basquete' | 'edicao_especial' | string;
  price: number;
  original_price?: number;
  image_url: string;
  gallery?: string[];
  description: string;
  rating: number;
  reviews_count: number;
  sizes: number[];
  in_stock: boolean;
  badge?: 'Novo' | 'Destaque' | 'Promoção' | 'Limitado' | 'Hyped';
  colors?: string[];
  created_at?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  quantity: number;
}

export interface OrderItem {
  product_id: string | number;
  product_name: string;
  size: number;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment_method: 'pix' | 'credit_card';
  status?: 'pending' | 'paid';
  created_at?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  error?: string;
}
