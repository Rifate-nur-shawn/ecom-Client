import type { Product } from '../types';

// 1. Fake Data (Hardcoded for now)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Gaming Mouse',
    sku: 'GM-LOGI-001',
    category: 'Electronics',
    quantity: 45,
    price: 59.99,
    status: 'in_stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mechanical Keyboard (Red Switches)',
    sku: 'KB-COR-002',
    category: 'Electronics',
    quantity: 5,
    price: 129.99,
    status: 'low_stock',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    sku: 'FUR-HERM-003',
    category: 'Furniture',
    quantity: 0,
    price: 499.00,
    status: 'out_of_stock',
    lastUpdated: new Date().toISOString(),
  },
];

// 2. Helper to simulate network delay (Wait 1 second)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productApi = {
  // This function mimics an axios.get('/products') call
  getProducts: async (): Promise<Product[]> => {
    await delay(1000); // Fake lag so we can see the loading spinner!
    
    // randomly throw error to test error handling (comment out to stop error)
    // if (Math.random() < 0.1) throw new Error("Network Error"); 
    
    return MOCK_PRODUCTS;
  },
};