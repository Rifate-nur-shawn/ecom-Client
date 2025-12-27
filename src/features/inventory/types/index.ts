export interface Product {
  id: string;
  name: string;
  sku: string; // Stock Keeping Unit (e.g., "NIKE-AIR-001")
  category: string;
  quantity: number;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}