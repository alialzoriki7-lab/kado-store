
export interface CategoryItem {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  parentId?: string; // لربط القسم الفرعي بالقسم الرئيسي
  icon?: string;
  color?: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  category: string; // معرف القسم (الرئيسي أو الفرعي)
  sub_category?: string; // اختياري لتقسيمات إضافية
  price: number;
  stock: number;
  image_url: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  isAdmin?: boolean;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  items: CartItem[];
  total_price: number;
  discount: number;
  delivery_area: string;
  delivery_fee: number;
  final_price: number;
  payment_method: 'Cash' | 'Electronic';
  electronic_wallet?: string;
  payment_reference: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: number;
}

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
