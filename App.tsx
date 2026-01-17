
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  ShoppingBag, Menu, X, Sun, Moon, Globe, User as UserIcon, LogOut, 
  Trash2, Plus, Minus, CheckCircle, ChevronRight, AlertTriangle, 
  PackagePlus, ShieldCheck, Phone, Mail, MapPin, Check, Edit3, Search, Save,
  Flower, Gift, Heart, Star, Palette, Layers, Box, CreditCard, Hash
} from 'lucide-react';
import { Product, CartItem, User, Order, Language, Theme, CategoryItem } from './types';
import { DB } from './services/db';
import { TRANSLATIONS, PAYMENT_NUMBER, DELIVERY_AREAS, WALLETS } from './constants';

// --- Icons Helper ---
const IconMap: Record<string, React.ReactNode> = {
  Flower: <Flower />,
  Gift: <Gift />,
  Heart: <Heart />,
  Star: <Star />,
  Palette: <Palette />,
  Layers: <Layers />,
  Box: <Box />
};

// --- Contexts ---
interface AppContextType {
  lang: Language;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
  user: User | null;
  login: (u: string, p: string) => void;
  signup: () => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (p: Product, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Navbar ---
const Navbar: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { lang, theme, toggleLang, toggleTheme, user, logout, cart, t } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors ${theme === 'dark' ? 'bg-zinc-950/80 text-white border-zinc-900' : 'bg-white/80 text-zinc-950 border-gray-100'} backdrop-blur-md border-b`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 md:hidden">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <div className="text-2xl font-black text-pink-500 cursor-pointer tracking-tighter" onClick={() => onNavigate('home')}>
            {t('app_name')}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold">
          <button onClick={() => onNavigate('home')} className="hover:text-pink-500 transition-colors">{t('home')}</button>
          <button onClick={() => onNavigate('shop')} className="hover:text-pink-500 transition-colors">{t('shop')}</button>
          {user?.isAdmin && (
            <button 
              onClick={() => onNavigate('admin')} 
              className="flex items-center gap-1 font-bold px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
            >
              <ShieldCheck size={18} /> {t('admin')}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={toggleLang} className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-500/10 transition-colors">
            <Globe size={18} />
            <span className="text-xs font-bold uppercase">{lang}</span>
          </button>
          <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-full hover:bg-zinc-500/10 transition-colors">
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg">
                {cart.reduce((acc, item) => acc + item.cartQuantity, 0)}
              </span>
            )}
          </button>
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-500/20 ml-2">
              <span className="hidden lg:inline text-xs font-bold text-pink-500">{user.name}</span>
              <button onClick={logout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors">
              <UserIcon size={20} />
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden absolute top-16 left-0 w-full p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300 ${theme === 'dark' ? 'bg-zinc-950 border-t border-zinc-900' : 'bg-white border-t border-gray-100'}`}>
          <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-bold">{t('home')}</button>
          <button onClick={() => { onNavigate('shop'); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-bold">{t('shop')}</button>
          {user?.isAdmin && (
            <button onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-bold text-purple-500">{t('admin')}</button>
          )}
        </div>
      )}
    </nav>
  );
};

// --- Product Card ---
const ProductCard: React.FC<{ product: Product, categoryName?: string }> = ({ product, categoryName }) => {
  const { lang, t, theme } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div onClick={() => setShowModal(true)} className="group relative bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-800 cursor-pointer">
        <div className="aspect-[4/5] overflow-hidden relative">
          <img src={product.image_url} alt={product.name_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
             <span className={`px-3 py-1 text-[10px] font-black rounded-full shadow-lg ${product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {product.stock > 0 ? `${lang === 'ar' ? 'متوفر:' : 'Stock:'} ${product.stock}` : t('out_of_stock')}
             </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{categoryName || product.category}</span>
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 text-shadow-sm">{lang === 'ar' ? product.name_ar : product.name_en}</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-pink-500">{product.price.toLocaleString()} YER</span>
              <div className="p-2 transition-colors rounded-2xl bg-white/10 text-white group-hover:bg-pink-500">
                <Plus size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} />}
    </>
  );
};

const ProductModal: React.FC<{ product: Product, onClose: () => void }> = ({ product, onClose }) => {
  const { addToCart, lang, t } = useAppContext();
  const [qty, setQty] = useState(1);
  const totalPrice = product.price * qty;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row bg-zinc-950 text-white border border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/20 rounded-full text-white backdrop-blur-md hover:bg-white/40"><X size={24} /></button>
        <div className="md:w-1/2 aspect-square md:aspect-auto">
          <img src={product.image_url} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="p-10 md:w-1/2 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-black uppercase text-pink-500 tracking-widest">{product.category}</p>
            <span className="text-xs font-bold text-white/50">{lang === 'ar' ? 'المتاح:' : 'Available:'} {product.stock}</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter leading-none">{lang === 'ar' ? product.name_ar : product.name_en}</h2>
          <p className="text-white text-sm mb-6 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
            {lang === 'ar' ? (product.description_ar || 'هدية رائعة تعبر عن مشاعرك بأرقى الزهور الفريدة.') : (product.description_en || 'A wonderful gift that expresses your feelings with unique, premium flowers.')}
          </p>
          <div className="flex items-baseline gap-2 mb-8">
            <p className="text-4xl font-black text-pink-500">{totalPrice.toLocaleString()} YER</p>
            {qty > 1 && <p className="text-sm font-bold opacity-40 text-white">({product.price.toLocaleString()} {t('price_unit')} / {t('quantity')} 1)</p>}
          </div>
          {product.stock > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="font-black text-sm uppercase text-white/50">{t('quantity')}</span>
                <div className="flex items-center gap-6">
                  <button onClick={() => setQty(Math.max(1, qty-1))} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><Minus size={20} /></button>
                  <span className="w-6 text-2xl font-black text-center text-white">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty+1))} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><Plus size={20} /></button>
                </div>
              </div>
              <button onClick={() => { addToCart(product, qty); onClose(); }} className="w-full py-5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-pink-500/20 transition-all active:scale-95">
                {t('add_to_cart')}
              </button>
            </div>
          ) : (
            <div className="p-6 bg-red-500/20 text-red-500 rounded-3xl font-black text-center border border-red-500/20">
               <AlertTriangle className="inline mr-2" /> {t('out_of_stock')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Home Page ---
const HomePage: React.FC<{ onNavigate: (p: string, params?: any) => void }> = ({ onNavigate }) => {
  const { t, theme, lang } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    DB.getProducts().then(data => setProducts(data.slice(0, 8)));
    DB.getCategories().then(setCategories);
  }, []);

  const mainCategories = categories.filter(c => !c.parentId);

  return (
    <div className="pb-20 space-y-12">
      <section className="relative h-[65vh] flex items-center justify-center px-4 overflow-hidden rounded-b-[4rem]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1920" className="object-cover w-full h-full scale-105" alt="Banner" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative text-center text-white max-w-4xl px-4 animate-in fade-in slide-in-from-bottom duration-1000">
          <h1 className="mb-6 text-5xl md:text-7xl font-black tracking-tighter leading-none">{t('hero_title')}</h1>
          <p className="mb-10 text-lg md:text-2xl font-medium text-white/95 max-w-2xl mx-auto">{t('hero_subtitle')}</p>
          <button onClick={() => onNavigate('shop')} className="px-14 py-5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-black text-xl shadow-2xl shadow-pink-500/40 hover:scale-105 transition-all active:scale-95">
            {t('explore_now')}
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border-2 transition-all hover:scale-[1.02] hover:shadow-2xl group ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl'}`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-white ${cat.color || 'bg-pink-500'} group-hover:rotate-12 transition-transform shadow-lg`}>
                {IconMap[cat.icon || 'Layers'] || <Layers size={32} />}
              </div>
              <span className="font-black text-2xl tracking-tighter dark:text-white mb-3">{lang === 'ar' ? cat.name_ar : cat.name_en}</span>
              <p className="text-sm font-medium opacity-60 dark:text-white leading-relaxed text-center px-4">
                {lang === 'ar' ? cat.description_ar : cat.description_en}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black tracking-tighter dark:text-white">{t('all_products')}</h2>
          <button onClick={() => onNavigate('shop')} className="text-pink-500 font-black flex items-center gap-1 group">
             {t('shop')} <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(p => {
             const catName = categories.find(c => c.id === p.category);
             return <ProductCard key={p.id} product={p} categoryName={lang === 'ar' ? catName?.name_ar : catName?.name_en} />;
          })}
        </div>
      </section>
    </div>
  );
};

// --- Shop Page ---
const ShopPage: React.FC<{ params?: any }> = ({ params }) => {
  const { t, lang, theme } = useAppContext();
  const [cat, setCat] = useState<string>(params?.category || 'all');
  const [subCat, setSubCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    DB.getProducts().then(setProducts);
    DB.getCategories().then(setCategories);
  }, []);

  const filtered = products.filter(p => {
    const isMainCatMatch = cat === 'all' || p.category === cat;
    const subCategoriesOfMain = categories.filter(c => c.parentId === cat).map(c => c.id);
    const isChildCatMatch = subCategoriesOfMain.includes(p.category);
    
    const matchCat = isMainCatMatch || isChildCatMatch;
    const matchSearch = p.name_ar.includes(search) || p.name_en.toLowerCase().includes(search.toLowerCase());
    
    return matchCat && (subCat === 'all' ? true : p.category === subCat) && matchSearch;
  });

  const mainCategories = categories.filter(c => !c.parentId);
  const currentChildren = categories.filter(c => c.parentId === cat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-72 space-y-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-pink-500 transition-all ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100'}`}
            />
          </div>

          <div>
            <h3 className="text-sm font-black text-pink-500 uppercase tracking-widest mb-6">{t('categories')}</h3>
            <div className="space-y-3">
              <button 
                onClick={() => { setCat('all'); setSubCat('all'); }}
                className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all border-2 ${cat === 'all' ? 'bg-pink-500 text-white border-pink-500 shadow-lg' : 'hover:bg-zinc-500/10 border-transparent dark:text-white'}`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              {mainCategories.map(c => (
                <button 
                  key={c.id}
                  onClick={() => { setCat(c.id); setSubCat('all'); }}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all border-2 ${cat === c.id ? 'bg-pink-500 text-white border-pink-500 shadow-lg' : 'hover:bg-zinc-500/10 border-transparent dark:text-white'}`}
                >
                  {lang === 'ar' ? c.name_ar : c.name_en}
                </button>
              ))}
            </div>
          </div>

          {currentChildren.length > 0 && (
            <div className="animate-in slide-in-from-top duration-500">
              <h3 className="text-sm font-black text-purple-500 uppercase tracking-widest mb-6">
                {lang === 'ar' ? 'تصنيفات فرعية' : 'Sub-categories'}
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setSubCat('all')}
                  className={`w-full text-left px-5 py-3 rounded-2xl font-bold transition-all border-2 ${subCat === 'all' ? 'bg-purple-500 text-white border-purple-500 shadow-md' : 'hover:bg-zinc-500/10 border-transparent dark:text-white'}`}
                >
                  {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {currentChildren.map(sc => (
                  <button 
                    key={sc.id}
                    onClick={() => setSubCat(sc.id)}
                    className={`w-full text-left px-5 py-3 rounded-2xl font-bold transition-all border-2 ${subCat === sc.id ? 'bg-purple-500 text-white border-purple-500 shadow-md' : 'hover:bg-zinc-500/10 border-transparent dark:text-white'}`}
                  >
                    {lang === 'ar' ? sc.name_ar : sc.name_en}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map(p => {
               const catName = categories.find(c => c.id === p.category);
               return <ProductCard key={p.id} product={p} categoryName={lang === 'ar' ? catName?.name_ar : catName?.name_en} />;
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-40 opacity-50 italic dark:text-white">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Admin Panel ---
const AdminPanel: React.FC = () => {
  const { t, lang, theme } = useAppContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [newCat, setNewCat] = useState<Partial<CategoryItem> | null>(null);

  const refreshData = () => {
    DB.getOrders().then(setOrders);
    DB.getProducts().then(setProducts);
    DB.getCategories().then(setCategories);
  };

  useEffect(() => { refreshData(); }, []);

  const handleApprove = async (id: string) => { await DB.updateOrderStatus(id, 'completed'); refreshData(); };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    if (editProduct.id) await DB.updateProduct(editProduct.id, editProduct);
    else await DB.addProduct(editProduct as Omit<Product, 'id'>);
    setEditProduct(null); refreshData();
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat) return;
    await DB.addCategory(newCat as Omit<CategoryItem, 'id'>);
    setNewCat(null); refreshData();
  };

  const handleDeleteProduct = async (id: string) => { if (confirm('Delete Product?')) { await DB.deleteProduct(id); refreshData(); } };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3 dark:text-white">
          <ShieldCheck size={40} className="text-purple-500" /> {t('admin')}
        </h2>
        <div className="flex items-center gap-4">
          <div className={`flex p-1 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}>
            {['orders', 'products', 'categories'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === tab ? 'bg-white text-purple-600 shadow-sm' : 'opacity-50 dark:text-white'}`}>
                {tab === 'orders' ? t('manage_orders') : tab === 'products' ? t('manage_products') : (lang === 'ar' ? 'الأقسام' : 'Categories')}
              </button>
            ))}
          </div>
          {activeTab === 'products' && (
            <button onClick={() => setEditProduct({ name_ar: '', name_en: '', price: 0, category: categories[0]?.id || '', stock: 10, image_url: '' })} className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2">
              <PackagePlus size={20} /> {lang === 'ar' ? 'إضافة منتج' : 'New Product'}
            </button>
          )}
          {activeTab === 'categories' && (
            <button onClick={() => setNewCat({ name_ar: '', name_en: '', description_ar: '', description_en: '', icon: 'Layers', color: 'bg-pink-500' })} className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2">
              <Plus size={20} /> {lang === 'ar' ? 'قسم جديد' : 'New Category'}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="grid gap-8">
          {orders.map(order => (
            <div key={order.id} className={`p-8 rounded-[3rem] border overflow-hidden relative ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-xl'}`}>
              <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
                     <ShoppingBag />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black dark:text-white tracking-tighter">Order #{order.id.slice(-6).toUpperCase()}</h4>
                      <p className="text-xs opacity-50 dark:text-white font-bold">{new Date(order.created_at).toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${order.payment_status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    {order.payment_status}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-black opacity-50 dark:text-white uppercase">
                    <CreditCard size={14} /> {order.payment_method}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                {/* Customer Information Section */}
                <div className="space-y-6">
                  <h5 className="text-xs font-black uppercase text-pink-500 tracking-[0.2em]">{lang === 'ar' ? 'بيانات العميل' : 'Customer Info'}</h5>
                  <div className={`p-6 rounded-[2rem] space-y-4 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
                    <div className="flex items-center gap-3">
                       <UserIcon size={18} className="text-pink-500" />
                       <span className="font-black dark:text-white">{order.userName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone size={18} className="text-pink-500" />
                       <span className="font-bold dark:text-white">{order.userPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Mail size={18} className="text-pink-500" />
                       <span className="font-bold dark:text-white text-xs break-all">{order.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <MapPin size={18} className="text-pink-500" />
                       <span className="font-bold dark:text-white">{order.delivery_area}</span>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-6">
                  <h5 className="text-xs font-black uppercase text-pink-500 tracking-[0.2em]">{lang === 'ar' ? 'المنتجات المطلوبة' : 'Order Items'}</h5>
                  <div className="space-y-3">
                    {order.items.map(i => (
                      <div key={i.id} className={`flex items-center justify-between p-4 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'}`}>
                        <div className="flex items-center gap-3">
                          <img src={i.image_url} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-black dark:text-white">{lang === 'ar' ? i.name_ar : i.name_en}</p>
                            <p className="text-[10px] opacity-50 font-bold dark:text-white">{i.price.toLocaleString()} x {i.cartQuantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-pink-500">{(i.price * i.cartQuantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Section */}
                <div className="space-y-6">
                  <h5 className="text-xs font-black uppercase text-pink-500 tracking-[0.2em]">{lang === 'ar' ? 'تفاصيل الدفع' : 'Payment Summary'}</h5>
                  <div className={`p-6 rounded-[2rem] border-2 space-y-4 border-dashed ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-100'}`}>
                     {order.payment_method === 'Electronic' && (
                       <div className="p-4 bg-purple-500/5 rounded-2xl mb-4 border border-purple-500/10">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase text-purple-500 mb-1">
                           <Hash size={12}/> {lang === 'ar' ? 'رقم المرجع' : 'Reference Number'}
                         </div>
                         <p className="font-black text-lg dark:text-white">{order.payment_reference || 'N/A'}</p>
                         <p className="text-[10px] opacity-50 font-bold dark:text-white">{order.electronic_wallet}</p>
                       </div>
                     )}
                     <div className="flex justify-between text-xs font-bold opacity-60 dark:text-white">
                        <span>{t('total')}</span>
                        <span>{order.total_price.toLocaleString()} YER</span>
                     </div>
                     <div className="flex justify-between text-xs font-bold opacity-60 dark:text-white">
                        <span>{t('delivery_fee')}</span>
                        <span>{order.delivery_fee.toLocaleString()} YER</span>
                     </div>
                     <div className="pt-4 border-t border-zinc-500/10 flex justify-between items-baseline">
                        <span className="text-sm font-black dark:text-white">{t('final_price')}</span>
                        <span className="text-3xl font-black text-pink-500 tracking-tighter">{order.final_price.toLocaleString()}</span>
                     </div>
                     {order.payment_status === 'pending' && (
                       <button onClick={() => handleApprove(order.id)} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                         <CheckCircle size={18} /> APPROVE ORDER
                       </button>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-center py-40 opacity-30 italic font-black text-xl">No orders found yet.</div>}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className={`p-4 rounded-[2rem] border flex flex-col ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <img src={p.image_url} className="h-48 w-full object-cover rounded-2xl mb-4" />
              <h5 className="font-black dark:text-white line-clamp-1">{lang === 'ar' ? p.name_ar : p.name_en}</h5>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-black text-pink-500">{p.price.toLocaleString()} YER</p>
                <span className={`px-3 py-1 text-[10px] font-black rounded-full ${p.stock > 5 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                   {lang === 'ar' ? 'المخزون:' : 'Stock:'} {p.stock}
                </span>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setEditProduct(p)} className="flex-1 p-3 bg-zinc-500/10 rounded-xl hover:bg-purple-500 hover:text-white transition-all"><Edit3 size={18} className="mx-auto"/></button>
                <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 p-3 bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} className="mx-auto" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(c => (
            <div key={c.id} className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
               <div className="flex items-center gap-4 mb-4">
                 <div className={`p-4 rounded-2xl text-white ${c.color || 'bg-pink-500'} shadow-lg`}>
                    {IconMap[c.icon || 'Layers']}
                 </div>
                 <div>
                    <div className="dark:text-white font-black text-lg tracking-tighter">{lang === 'ar' ? c.name_ar : c.name_en}</div>
                    {c.parentId && (
                      <div className="text-[10px] font-black uppercase text-pink-500 opacity-60">
                          Child of: {categories.find(pc => pc.id === c.parentId)?.name_en || 'Unknown'}
                      </div>
                    )}
                 </div>
               </div>
               <p className="text-xs font-medium opacity-50 dark:text-white leading-relaxed">
                 {lang === 'ar' ? c.description_ar : c.description_en}
               </p>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveProduct} className={`w-full max-w-xl p-10 rounded-[3rem] shadow-2xl space-y-4 ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white'}`}>
            <h3 className="text-3xl font-black tracking-tighter">{editProduct.id ? 'Edit' : 'New'} Product</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Name AR" value={editProduct.name_ar} onChange={e => setEditProduct({...editProduct, name_ar: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-pink-500" required />
              <input placeholder="Name EN" value={editProduct.name_en} onChange={e => setEditProduct({...editProduct, name_en: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-pink-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Price" value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-pink-500" required />
              <input type="number" placeholder="Stock" value={editProduct.stock} onChange={e => setEditProduct({...editProduct, stock: Number(e.target.value)})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-pink-500" required />
            </div>
            <select value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value})} className="w-full p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-pink-500">
               <option value="">-- Select Category --</option>
               {categories.map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
            <input placeholder="Image URL" value={editProduct.image_url} onChange={e => setEditProduct({...editProduct, image_url: e.target.value})} className="w-full p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-pink-500" required />
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg">SAVE PRODUCT</button>
              <button type="button" onClick={() => setEditProduct(null)} className="flex-1 py-4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl font-black">CANCEL</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Modal */}
      {newCat && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveCategory} className={`w-full max-w-xl p-10 rounded-[3rem] shadow-2xl space-y-4 ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white'}`}>
            <h3 className="text-3xl font-black tracking-tighter">New Category</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Name AR" value={newCat.name_ar} onChange={e => setNewCat({...newCat, name_ar: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500" required />
              <input placeholder="Name EN" value={newCat.name_en} onChange={e => setNewCat({...newCat, name_en: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <textarea placeholder="Description AR" value={newCat.description_ar} onChange={e => setNewCat({...newCat, description_ar: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20" />
              <textarea placeholder="Description EN" value={newCat.description_en} onChange={e => setNewCat({...newCat, description_en: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20" />
            </div>
            
            <div>
              <label className="block text-xs font-black uppercase mb-2 opacity-50">Parent Category (Optional)</label>
              <select value={newCat.parentId || ''} onChange={e => setNewCat({...newCat, parentId: e.target.value || undefined})} className="w-full p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">None (Top-Level)</option>
                {categories.filter(c => !c.parentId).map(c => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select value={newCat.icon} onChange={e => setNewCat({...newCat, icon: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500">
                 {Object.keys(IconMap).map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
              <select value={newCat.color} onChange={e => setNewCat({...newCat, color: e.target.value})} className="p-4 rounded-xl border dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-purple-500">
                 {['bg-pink-500', 'bg-purple-600', 'bg-orange-500', 'bg-blue-500', 'bg-red-500', 'bg-green-600'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg">ADD CATEGORY</button>
              <button type="button" onClick={() => setNewCat(null)} className="flex-1 py-4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl font-black">CANCEL</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- LoginPage ---
const LoginPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { login, t, theme } = useAppContext();
  const [u, setU] = useState('');
  const [p, setP] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(u, p);
    onNavigate('home');
  };

  return (
    <div className="max-w-md mx-auto py-32 px-4">
      <div className={`p-10 rounded-[3rem] border shadow-2xl ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
        <h2 className="text-4xl font-black mb-8 tracking-tighter text-center">{t('login')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder={t('full_name')} 
            className={`w-full p-5 rounded-2xl border outline-none focus:ring-2 focus:ring-pink-500 ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50'}`} 
            value={u} 
            onChange={e => setU(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder={t('password')} 
            className={`w-full p-5 rounded-2xl border outline-none focus:ring-2 focus:ring-pink-500 ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-gray-50'}`} 
            value={p} 
            onChange={e => setP(e.target.value)} 
          />
          <button type="submit" className="w-full py-5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-pink-500/20">
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Cart Page ---
const CartPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartQty, t, theme, lang, clearCart, user } = useAppContext();
  const [area, setArea] = useState(DELIVERY_AREAS[0].id);
  const [payment, setPayment] = useState<'Cash' | 'Electronic'>('Cash');
  const [wallet, setWallet] = useState(WALLETS[0]);
  const [ref, setRef] = useState('');
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);
  const deliveryFee = DELIVERY_AREAS.find(a => a.id === area)?.price || 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!user) { onNavigate('login'); return; }
    if (payment === 'Electronic' && !ref) { alert(t('ref_number')); return; }

    setIsProcessing(true);
    try {
      await DB.addOrder({
        user_id: user.id,
        userName: user.name,
        userPhone: user.phone,
        userEmail: user.email,
        items: cart,
        total_price: subtotal,
        discount: 0,
        delivery_area: DELIVERY_AREAS.find(a => a.id === area)?.name_en || area,
        delivery_fee: deliveryFee,
        final_price: total,
        payment_method: payment,
        electronic_wallet: payment === 'Electronic' ? wallet : undefined,
        payment_reference: ref,
        payment_status: 'pending',
        created_at: Date.now()
      });

      for (const item of cart) {
        await DB.updateProduct(item.id, {
          stock: item.stock - item.cartQuantity
        });
      }

      setStep('success');
      clearCart();
    } catch (e) {
      alert("Error processing order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-40 px-4 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/40">
           <Check size={60} className="text-white" />
        </div>
        <h2 className="text-5xl font-black mb-4 tracking-tighter">{t('success_order')}</h2>
        <p className="text-lg opacity-60 mb-10 font-bold">{lang === 'ar' ? 'تم استلام طلبك وبانتظار مراجعة الدفع.' : 'Your order has been received and is awaiting payment review.'}</p>
        <button onClick={() => onNavigate('home')} className="px-14 py-5 bg-pink-500 text-white rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all">
           {t('home')}
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-40 px-4 text-center opacity-40">
        <ShoppingBag size={80} className="mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-4">{t('empty_cart')}</h2>
        <button onClick={() => onNavigate('shop')} className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold">{t('shop')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-5xl font-black mb-12 tracking-tighter">{t('cart')}</h2>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-6">
          {cart.map(item => (
            <div key={item.id} className={`flex items-center gap-6 p-6 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <img src={item.image_url} className="w-24 h-24 object-cover rounded-2xl" />
              <div className="flex-1">
                <h4 className="text-xl font-black dark:text-white">{lang === 'ar' ? item.name_ar : item.name_en}</h4>
                <p className="text-pink-500 font-bold">{item.price.toLocaleString()} YER</p>
                <p className="text-[10px] font-black opacity-40 uppercase">{lang === 'ar' ? 'المتبقي:' : 'Stock:'} {item.stock}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => updateCartQty(item.id, -1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"><Minus size={16} /></button>
                <span className="font-black text-lg w-4 text-center">{item.cartQuantity}</span>
                <button onClick={() => updateCartQty(item.id, 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"><Plus size={16} /></button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg ml-4"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>

        <aside className="lg:w-96">
          <div className={`p-10 rounded-[3rem] border sticky top-24 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-2xl'}`}>
            {step === 'cart' ? (
              <>
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between font-bold opacity-60"><span>{t('total')}</span><span>{subtotal.toLocaleString()} YER</span></div>
                   <div className="flex justify-between font-bold text-pink-500"><span>{t('final_price')}</span><span className="text-2xl font-black">{subtotal.toLocaleString()} YER</span></div>
                </div>
                <button onClick={() => setStep('checkout')} className="w-full py-5 bg-pink-500 text-white rounded-2xl font-black text-xl shadow-lg">
                  {t('checkout')}
                </button>
              </>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black uppercase mb-3 opacity-50">{t('select_area')}</label>
                  <select value={area} onChange={e => setArea(e.target.value)} className="w-full p-4 rounded-xl border dark:bg-zinc-950 font-bold">
                    {DELIVERY_AREAS.map(a => <option key={a.id} value={a.id}>{lang === 'ar' ? a.name_ar : a.name_en} (+{a.price} YER)</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-3 opacity-50">{t('payment_method')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPayment('Cash')} className={`p-3 rounded-xl border font-bold text-sm ${payment === 'Cash' ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'dark:bg-zinc-950'}`}>{t('cod')}</button>
                    <button onClick={() => setPayment('Electronic')} className={`p-3 rounded-xl border font-bold text-sm ${payment === 'Electronic' ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'dark:bg-zinc-950'}`}>{t('electronic')}</button>
                  </div>
                </div>

                {payment === 'Electronic' && (
                  <div className="animate-in slide-in-from-top space-y-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                       <p className="text-xs font-bold text-purple-500 uppercase mb-1">{t('payment_info')}</p>
                       <p className="text-lg font-black">{PAYMENT_NUMBER}</p>
                    </div>
                    <select value={wallet} onChange={e => setWallet(e.target.value)} className="w-full p-4 rounded-xl border dark:bg-zinc-950">
                      {WALLETS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    <input placeholder={t('ref_number')} value={ref} onChange={e => setRef(e.target.value)} className="w-full p-4 rounded-xl border dark:bg-zinc-950" />
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-500/10 space-y-2">
                   <div className="flex justify-between text-sm opacity-60"><span>{t('delivery_fee')}</span><span>{deliveryFee.toLocaleString()} YER</span></div>
                   <div className="flex justify-between text-xl font-black text-pink-500"><span>{t('final_price')}</span><span>{total.toLocaleString()} YER</span></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep('cart')} className="flex-1 py-4 bg-zinc-200 dark:bg-zinc-800 rounded-xl font-black">{lang === 'ar' ? 'رجوع' : 'Back'}</button>
                  <button 
                    disabled={isProcessing}
                    onClick={handleCheckout} 
                    className={`flex-[2] py-4 bg-pink-500 text-white rounded-xl font-black shadow-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isProcessing ? '...' : t('checkout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- App Root ---
export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [navParams, setNavParams] = useState<any>(null);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.className = theme;
    DB.onAuthChange((fbUser) => {
      if (fbUser) {
        if (fbUser.email === 'ali777@kado.ye') setUser({ id: fbUser.uid, name: 'Ali Admin', phone: '774757968', email: fbUser.email, isAdmin: true });
        else setUser({ id: fbUser.uid, name: fbUser.displayName || fbUser.email, phone: '', email: fbUser.email, isAdmin: false });
      } else setUser(null);
    });
  }, [lang, theme]);

  const navigateTo = (page: string, params?: any) => { setCurrentPage(page); setNavParams(params); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const login = (u: string, p: string) => {
    if (u === 'ali777' && p === '123ali') setUser({ id: 'admin', name: 'Ali Admin', phone: '774757968', email: 'ali777@kado.ye', isAdmin: true });
    else setUser({ id: 'user', name: u, phone: '000', email: u + '@user.com', isAdmin: false });
  };
  const logout = () => { setUser(null); DB.logout(); setCurrentPage('home'); };

  const addToCart = (p: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, cartQuantity: item.cartQuantity + qty } : item);
      return [...prev, { ...p, cartQuantity: qty }];
    });
  };

  const t = (key: string) => (TRANSLATIONS[lang] as any)[key] || key;

  return (
    <AppContext.Provider value={{
      lang, theme, toggleLang, toggleTheme, user, login, signup: () => {}, logout,
      cart, addToCart, removeFromCart: (id) => setCart(cart.filter(i => i.id !== id)), 
      updateCartQty: (id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) } : item)),
      clearCart: () => setCart([]), t
    }}>
      <div className={`min-h-screen font-${lang} ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-950'} pt-16 transition-colors duration-500`}>
        <Navbar onNavigate={navigateTo} />
        <main>
          {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
          {currentPage === 'shop' && <ShopPage params={navParams} />}
          {currentPage === 'cart' && <CartPage onNavigate={navigateTo} />}
          {currentPage === 'login' && <LoginPage onNavigate={navigateTo} />}
          {currentPage === 'admin' && user?.isAdmin && <AdminPanel />}
        </main>
        
        <footer className={`py-20 px-4 border-t mt-20 ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className={lang === 'ar' ? 'md:text-right' : 'md:text-left'}>
              <h4 className="text-4xl font-black text-pink-500 mb-6 tracking-tighter">{t('app_name')}</h4>
              <p className="text-sm font-bold opacity-60 leading-relaxed">Luxury flowers delivered across Sana'a, Yemen with care and elegance.</p>
            </div>
            <div>
              <h5 className="font-black mb-6 uppercase text-xs opacity-50 tracking-widest">Support</h5>
              <div className="space-y-2">
                 <p className="text-xl font-black dark:text-white flex items-center justify-center md:justify-start gap-2"><Phone size={18}/> {PAYMENT_NUMBER}</p>
                 <p className="text-sm opacity-50 dark:text-white font-bold">Sana'a - Yemen</p>
              </div>
            </div>
            <div>
               <h5 className="font-black mb-6 uppercase text-xs opacity-50 tracking-widest">Admin</h5>
               <button onClick={() => navigateTo(user?.isAdmin ? 'admin' : 'login')} className="text-purple-500 font-black hover:underline px-6 py-2 bg-purple-500/10 rounded-full transition-all">Dashboard Login</button>
            </div>
            <div>
               <h5 className="font-black mb-6 uppercase text-xs opacity-50 tracking-widest">Payment</h5>
               <div className="flex flex-wrap justify-center md:justify-start gap-2">
                 {['Jawwy', 'Jeeb', 'Cash', 'Al-Kuraimi'].map(p => (
                   <span key={p} className="px-3 py-1 bg-white dark:bg-zinc-800 border rounded-lg text-[10px] font-black">{p}</span>
                 ))}
               </div>
            </div>
          </div>
          <div className="mt-12 text-center text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Kado Luxury Gifts &copy; 2024 - All Rights Reserved</div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}
