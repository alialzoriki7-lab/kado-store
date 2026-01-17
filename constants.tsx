
import { Product } from './types';

export const PAYMENT_NUMBER = "774757968";

export const DELIVERY_AREAS = [
  { id: 'madhbah', name_ar: 'مذبح و شملان', name_en: 'Madhbah & Shamlan', price: 500 },
  { id: 'sabeen', name_ar: 'السبعين', name_en: 'Al Sab’een', price: 700 },
  { id: 'hadda', name_ar: 'حدة', name_en: 'Hadda', price: 700 },
  { id: 'tahrir', name_ar: 'التحرير', name_en: 'Al Tahrir', price: 500 },
  { id: 'sawan', name_ar: 'سعوان', name_en: 'Sa’wan', price: 1000 },
  { id: 'hasbah', name_ar: 'الحصبة', name_en: 'Al Hasbah', price: 800 },
  { id: 'hael', name_ar: 'هايل', name_en: 'Hael', price: 500 },
  { id: 'airport', name_ar: 'المطار', name_en: 'Airport', price: 1200 },
  { id: 'beitbous', name_ar: 'بيت بوس', name_en: 'Beit Bous', price: 1000 },
  { id: 'asbahi', name_ar: 'الأصبحي', name_en: 'Al Asbahi', price: 1000 },
  { id: 'hazeez', name_ar: 'حزيز', name_en: 'Hazeez', price: 1500 },
];

export const WALLETS = [
  "Jeeb Wallet", "Jawwy Wallet", "Cash Wallet", "Al-Kuraimi Bank", "Mobile Money Wallet"
];

const generateProducts = () => {
  const products: Product[] = [];

  // 1. Mixed Flowers by Color (5 products each)
  const colors = [
    { key: 'pink', ar: 'وردي', en: 'Pink', img: 'https://images.unsplash.com/photo-1525310238294-7341e9923225?auto=format&fit=crop&q=80&w=400' },
    { key: 'orange', ar: 'برتقالي', en: 'Orange', img: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=400' },
    { key: 'purple', ar: 'بنفسجي', en: 'Purple', img: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=400' },
    { key: 'white', ar: 'أبيض', en: 'White', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400' },
    { key: 'blue', ar: 'أزرق', en: 'Blue', img: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&q=80&w=400' }
  ];

  colors.forEach(color => {
    for (let i = 1; i <= 5; i++) {
      products.push({
        id: `mixed-${color.key}-${i}`,
        name_ar: `زهور مشكلة ${color.ar} ${i}`,
        name_en: `Mixed ${color.en} ${i}`,
        category: 'mixed',
        sub_category: color.key,
        price: 2500,
        stock: 20,
        image_url: color.img
      });
    }
  });

  // 2. Bouquets (Engagement & Wedding - 10 each)
  for (let i = 1; i <= 10; i++) {
    products.push({
      id: `eng-${i}`,
      name_ar: `مسكة خطوبة راقية ${i}`,
      name_en: `Engagement Bouquet ${i}`,
      category: 'bouquets',
      sub_category: 'engagement',
      price: 4500,
      stock: 15,
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400'
    });
  }
  for (let i = 1; i <= 10; i++) {
    products.push({
      id: `wed-${i}`,
      name_ar: `مسكة زفاف فاخرة ${i}`,
      name_en: `Wedding Bouquet ${i}`,
      category: 'bouquets',
      sub_category: 'wedding',
      price: 5000,
      stock: 12,
      image_url: 'https://images.unsplash.com/photo-1511105612320-2e62a04dd044?auto=format&fit=crop&q=80&w=400'
    });
  }

  // 3. Rose Bouquets (8 products)
  for (let i = 1; i <= 8; i++) {
    products.push({
      id: `rose-bq-${i}`,
      name_ar: `باقة ورد طبيعي ${i}`,
      name_en: `Natural Rose Bouquet ${i}`,
      category: 'rose_bouquets',
      price: 6000,
      stock: 10,
      image_url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=400'
    });
  }

  // 4. Gift Boxes (10 products)
  for (let i = 1; i <= 10; i++) {
    products.push({
      id: `box-${i}`,
      name_ar: `صندوق هدايا ${i}`,
      name_en: `Gift Box ${i}`,
      category: 'boxes',
      price: 5000,
      stock: 10,
      image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'
    });
  }

  return products;
};

export const INITIAL_PRODUCTS: Product[] = generateProducts();

export const TRANSLATIONS = {
  en: {
    app_name: 'KADO',
    home: 'Home', shop: 'Shop', categories: 'Categories', cart: 'Cart', login: 'Login', signup: 'Sign Up', logout: 'Logout', admin: 'Admin Panel',
    hero_title: 'Exquisite Flowers & Gifts', hero_subtitle: 'Discover the perfect gift for every occasion with luxury and elegance.',
    explore_now: 'Explore Now', add_to_cart: 'Add to Cart', total: 'Total', discount: 'Discount', final_price: 'Final Price', checkout: 'Checkout',
    payment_method: 'Payment Method', ref_number: 'Reference Number', payment_info: 'Payment to Wallet:',
    orders: 'Orders', quantity: 'Quantity', empty_cart: 'Cart is empty', mixed: 'Mixed Flowers',
    bouquets: 'Masakat (Bouquets)', engagement: 'Engagement', wedding: 'Wedding', boxes: 'Gift Boxes',
    rose_bouquets: 'Rose Bouquets', all_products: 'All Products', price_unit: 'YER', search_placeholder: 'Search...',
    success_order: 'Order Successful!', in_stock: 'In Stock', out_of_stock: 'Out of Stock',
    manage_products: 'Products Management', manage_orders: 'Orders Management',
    full_name: 'Full Name', email: 'Email', password: 'Password', signup_btn: 'Sign Up', select_area: 'Select Delivery Area', delivery_fee: 'Delivery Fee',
    cod: 'Cash on Delivery', electronic: 'Electronic Wallets', select_wallet: 'Select Wallet', payment_status: 'Payment Status',
    pink: 'Pink', orange: 'Orange', purple: 'Purple', white: 'White', blue: 'Blue',
    filter_by_color: 'Filter by Color', filter_by_type: 'Filter by Type'
  },
  ar: {
    app_name: 'كادو',
    home: 'الرئيسية', shop: 'المتجر', categories: 'التصنيفات', cart: 'السلة', login: 'تسجيل الدخول', signup: 'حساب جديد', logout: 'خروج', admin: 'لوحة التحكم',
    hero_title: 'أرقى الزهور والهدايا', hero_subtitle: 'اكتشف الهدية المثالية لكل مناسبة بفخامة وأناقة.',
    explore_now: 'تسوق الآن', add_to_cart: 'أضف للسلة', total: 'الإجمالي', discount: 'الخصم', final_price: 'السعر النهائي', checkout: 'إتمام الطلب',
    payment_method: 'طريقة الدفع', ref_number: 'رقم المرجع', payment_info: 'الدفع إلى محفظة:',
    orders: 'الطلبات', quantity: 'الكمية', empty_cart: 'السلة فارغة', mixed: 'الزهور المشكلة',
    bouquets: 'المسكات (البوكيهات)', engagement: 'مسكات خطوبة', wedding: 'مسكات زفاف', boxes: 'صناديق هدايا',
    rose_bouquets: 'باقات الورود', all_products: 'جميع المنتجات', price_unit: 'ريال يمني', search_placeholder: 'بحث...',
    success_order: 'تم الطلب بنجاح!', in_stock: 'متوفر', out_of_stock: 'غير متوفر',
    manage_products: 'إدارة المنتجات', manage_orders: 'إدارة الطلبات',
    full_name: 'الاسم الكامل', email: 'البريد الإلكتروني', password: 'كلمة المرور', signup_btn: 'إنشاء حساب', select_area: 'اختر منطقة التوصيل', delivery_fee: 'رسوم التوصيل',
    cod: 'الدفع عند الاستلام', electronic: 'المحافظ الإلكترونية', select_wallet: 'اختر المحفظة', payment_status: 'حالة الدفع',
    pink: 'وردي', orange: 'برتقالي', purple: 'بنفسجي', white: 'أبيض', blue: 'أزرق',
    filter_by_color: 'تصفية حسب اللون', filter_by_type: 'تصفية حسب النوع'
  }
};
