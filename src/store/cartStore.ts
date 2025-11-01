import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId?: string; // Store the actual product MongoDB _id
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
  category: string;
  inStock: boolean;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.id === item.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          const updatedItems = items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
          
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          });
        } else {
          // Add new item
          const newItem = { ...item, quantity: 1 };
          const updatedItems = [...items, newItem];
          
          set({
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== id);
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        const updatedItems = items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        
        set({
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: (id) => {
        const { items } = get();
        const item = items.find(i => i.id === id);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
    }
  )
);
