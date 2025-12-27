export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; 
  productId: string;
  product?: Product;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  items: CartItem[];
  createdAt: string;
}
