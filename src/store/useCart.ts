import { create } from 'zustand';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCartLocally: () => void;
}

// Transform backend cart item to frontend format
const transformCartItem = (item: any): CartItem => ({
  id: item.id,
  productId: item.product_id || item.productId,
  name: item.product?.name || item.name || 'Unknown Product',
  price: item.product?.price || item.price || 0,
  image: item.product?.image_url || item.product?.imageUrl || item.image || '',
  quantity: item.quantity || 1,
});

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      // Backend returns { data: { items: [...] } } or { data: { cartItems: [...] } }
      const cartData = data?.data || data;
      const items = cartData?.items || cartData?.cartItems || [];
      set({ items: Array.isArray(items) ? items.map(transformCartItem) : [] });
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      // 401 means not logged in - just set empty cart
      if (error?.response?.status !== 401) {
        // Only log non-auth errors
      }
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product, quantity = 1) => {
    set({ isLoading: true });
    try {
      // Backend expects product_id (snake_case), not productId
      await api.post('/cart/items', { 
        product_id: product.id, 
        quantity 
      });
      toast.success('Added to cart');
      await get().fetchCart();
    } catch (error: any) {
      console.error("Add to cart error:", error?.response?.data || error);
      toast.error(error?.response?.data?.error || 'Failed to add to cart');
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/cart/items/${itemId}`);
      toast.success('Removed from cart');
      await get().fetchCart();
    } catch (error: any) {
      console.error("Remove item error:", error);
      toast.error(error?.response?.data?.error || 'Failed to remove item');
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error: any) {
      console.error("Update quantity error:", error);
      toast.error(error?.response?.data?.error || 'Failed to update quantity');
    }
  },

  clearCartLocally: () => set({ items: [] }),
}));
