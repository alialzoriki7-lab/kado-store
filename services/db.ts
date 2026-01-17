
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Product, Order, User, CategoryItem } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const firebaseConfig = {
  apiKey: "AIzaSyBvOZWD7PfDvqPxhsGHk-bHluqk3Qt22Us",
  authDomain: "kado-cb8f8.firebaseapp.com",
  projectId: "kado-cb8f8",
  storageBucket: "kado-cb8f8.firebasestorage.app",
  messagingSenderId: "981321085031",
  appId: "1:981321085031:web:69d403be3b3fddb0ef64c2",
  measurementId: "G-5R1R6H9F3V"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export const DB = {
  // Categories
  getCategories: async (): Promise<CategoryItem[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      const cats: CategoryItem[] = [];
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as CategoryItem);
      });
      
      if (cats.length === 0) {
        const defaultCats = [
          { 
            id: 'mixed', 
            name_ar: 'زهور مشكلة', 
            name_en: 'Mixed Flowers', 
            description_ar: 'تشكيلة رائعة من الزهور الملونة تناسب جميع الأذواق',
            description_en: 'A wonderful selection of colorful flowers for all tastes',
            icon: 'Palette', 
            color: 'bg-orange-500' 
          },
          { 
            id: 'bouquets', 
            name_ar: 'المسكات', 
            name_en: 'Bouquets', 
            description_ar: 'مسكات عرائس وخطوبة مصممة بعناية لليلتك المميزة',
            description_en: 'Wedding and engagement bouquets carefully designed for your special night',
            icon: 'Heart', 
            color: 'bg-pink-500' 
          },
          { 
            id: 'rose_bouquets', 
            name_ar: 'باقات الورد', 
            name_en: 'Rose Bouquets', 
            description_ar: 'باقات من الورد الطبيعي الفاخر للتعبير عن أصدق المشاعر',
            description_en: 'Natural luxury rose bouquets to express your sincerest feelings',
            icon: 'Flower', 
            color: 'bg-purple-600' 
          },
          { 
            id: 'boxes', 
            name_ar: 'صناديق هدايا', 
            name_en: 'Gift Boxes', 
            description_ar: 'صناديق هدايا أنيقة تجمع بين الورد والجمال',
            description_en: 'Elegant gift boxes combining roses and beauty',
            icon: 'Gift', 
            color: 'bg-blue-500' 
          }
        ];
        for (const c of defaultCats) {
          const { id, ...data } = c;
          await setDoc(doc(firestore, 'categories', id), data);
          cats.push(c);
        }
      }
      return cats;
    } catch (error) {
      return [];
    }
  },

  addCategory: async (cat: Omit<CategoryItem, 'id'>) => {
    return await addDoc(collection(firestore, 'categories'), cat);
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      if (products.length === 0) {
        for (const p of INITIAL_PRODUCTS) {
          const { id, ...data } = p;
          await setDoc(doc(firestore, 'products', id), data);
          products.push(p);
        }
      }
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return INITIAL_PRODUCTS;
    }
  },

  addProduct: async (product: Omit<Product, 'id'>) => {
    return await addDoc(collection(firestore, 'products'), product);
  },

  updateProduct: async (id: string, updated: Partial<Product>) => {
    const productRef = doc(firestore, 'products', id);
    return await updateDoc(productRef, updated);
  },

  deleteProduct: async (id: string) => {
    const productRef = doc(firestore, 'products', id);
    return await deleteDoc(productRef);
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const q = query(collection(firestore, 'orders'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      return orders;
    } catch (error) {
      return [];
    }
  },

  addOrder: async (order: Omit<Order, 'id'>) => {
    return await addDoc(collection(firestore, 'orders'), order);
  },

  updateOrderStatus: async (id: string, status: Order['payment_status']) => {
    const orderRef = doc(firestore, 'orders', id);
    return await updateDoc(orderRef, { payment_status: status });
  },

  onAuthChange: (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  logout: async () => {
    return await signOut(auth);
  }
};
