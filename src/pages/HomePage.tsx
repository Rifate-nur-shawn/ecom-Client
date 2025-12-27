import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      // Handle nested structure: { data: { products: [...] } }
      const productsData = productsRes.data?.data?.products || productsRes.data?.products || productsRes.data?.data || productsRes.data || [];
      const categoriesData = categoriesRes.data?.data?.categories || categoriesRes.data?.categories || categoriesRes.data?.data || categoriesRes.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="daraz-container pt-4 pb-12">
      {/* 1. Hero Section: Slider + Categories */}
      <div className="grid grid-cols-12 gap-4 h-[344px] mb-8">
        {/* Categories Sidebar */}
        <div className="col-span-2 bg-white rounded-sm shadow-card p-3 hidden md:block overflow-hidden">
          <ul className="space-y-2 text-xs text-gray-600">
            {categories.length > 0 ? (
              categories.slice(0, 12).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    to={`/products?category=${cat.id}`}
                    className="hover:text-primary hover:bg-gray-50 p-1 cursor-pointer flex justify-between group transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))
            ) : (
              ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Toys', 'Groceries', 'Automotive'].map((cat, idx) => (
                <li key={idx} className="hover:text-primary hover:bg-gray-50 p-1 cursor-pointer flex justify-between group transition-colors">
                  <span>{cat}</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </li>
              ))
            )}
          </ul>
        </div>
        
        {/* Main Slider */}
        <div className="col-span-12 md:col-span-10 bg-gray-200 rounded-sm relative overflow-hidden group">
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white flex-col">
            <h1 className="text-4xl font-bold mb-4">Welcome to Atom Drops</h1>
            <p className="text-lg mb-6">Best deals on Electronics, Fashion & more!</p>
            <Link to="/products" className="px-6 py-2 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 transition">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Category Pills */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {(categories.length > 0 ? categories.slice(0, 5) : [
          { id: '1', name: 'Electronics', slug: 'electronics' },
          { id: '2', name: 'Fashion', slug: 'fashion' },
          { id: '3', name: 'Beauty', slug: 'beauty' },
          { id: '4', name: 'Home', slug: 'home' },
          { id: '5', name: 'Sports', slug: 'sports' },
        ]).map((item) => (
          <Link 
            key={item.id}
            to={`/products?category=${item.id}`}
            className="bg-white rounded-full py-2 px-4 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:shadow-md transition"
          >
            <div className="w-6 h-6 rounded-full bg-orange-100"></div>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* 3. Flash Sale */}
      <div className="mb-8">
        <h2 className="text-2xl text-gray-700 mb-4 font-light">Flash Sale</h2>
        <div className="bg-white p-4 rounded-sm border-b-4 border-primary">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <div className="flex gap-4 items-center">
              <span className="text-primary font-bold">On Sale Now</span>
              <div className="flex gap-2">
                <span className="bg-black text-white px-1 text-xs rounded">02</span>:
                <span className="bg-black text-white px-1 text-xs rounded">45</span>:
                <span className="bg-black text-white px-1 text-xs rounded">18</span>
              </div>
            </div>
            <Link to="/products" className="text-primary border border-primary px-4 py-1 text-sm uppercase hover:bg-orange-50 font-medium">
              Shop All
            </Link>
          </div>
          
          {/* Flash Items */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {loading ? (
              [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded"></div>)
            ) : products.length > 0 ? (
              products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-6 text-center py-10 text-gray-500">
                No products available yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Just For You */}
      <div>
        <h2 className="text-2xl text-gray-700 mb-4 font-light">Just For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            [...Array(12)].map((_, i) => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded"></div>)
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-6 text-center py-10 text-gray-500">
              No products available yet
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link to="/products" className="border-2 border-primary text-primary px-10 py-2 font-bold hover:bg-primary hover:text-white transition uppercase text-sm">
              Load More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
