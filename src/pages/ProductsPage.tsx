import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { ChevronDown, Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  }, [categoryId]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data || data || []);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchProducts = async (catId?: string | null) => {
    setIsLoading(true);
    try {
      const url = catId ? `/categories/${catId}/products` : '/products';
      const { data } = await api.get(url);
      // Handle nested structure: { data: { products: [...] } }
      const products = data?.data?.products || data?.products || data?.data || data || [];
      setProducts(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (catId: string | null) => {
    setSelectedCategory(catId);
    fetchProducts(catId);
  };

  return (
    <div className="daraz-container py-4">
      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <div className="w-1/5 hidden md:block space-y-4">
          {/* Categories */}
          <div className="bg-white p-3 shadow-card rounded-sm">
            <h3 className="font-bold text-sm mb-2 text-gray-700 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left p-2 rounded-sm transition-colors ${
                    !selectedCategory ? 'bg-orange-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full text-left p-2 rounded-sm transition-colors ${
                      selectedCategory === cat.id ? 'bg-orange-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="bg-white p-3 shadow-card rounded-sm">
            <h3 className="font-bold text-sm mb-2 text-gray-700">Price Range</h3>
            <div className="flex items-center gap-2 mb-2">
              <input type="number" placeholder="Min" className="w-full border border-gray-300 px-2 py-1 text-xs rounded-sm outline-none focus:border-primary" />
              <span className="text-gray-400">-</span>
              <input type="number" placeholder="Max" className="w-full border border-gray-300 px-2 py-1 text-xs rounded-sm outline-none focus:border-primary" />
            </div>
            <button className="w-full bg-primary text-white text-xs py-1 rounded-sm shadow-sm hover:bg-primary-hover transition">Apply</button>
          </div>

          {/* Rating */}
          <div className="bg-white p-3 shadow-card rounded-sm">
            <h3 className="font-bold text-sm mb-2 text-gray-700">Rating</h3>
            <ul className="space-y-1">
              {[5, 4, 3, 2, 1].map(stars => (
                <li key={stars} className="flex gap-1 items-center cursor-pointer hover:bg-gray-50 p-1 rounded-sm text-xs">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < stars ? "fill-current" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <span className="text-gray-500">& Up</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5">
          {/* Toolbar */}
          <div className="bg-white p-3 shadow-card rounded-sm mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">{products.length}</span> items found
              {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                <span> in "{categories.find(c => c.id === selectedCategory)?.name}"</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sort By:</span>
              <div className="relative border border-gray-300 px-3 py-1 rounded-sm flex items-center gap-4 cursor-pointer bg-white">
                Best Match <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-sm"></div>)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-sm shadow-card p-10 text-center">
              <p className="text-gray-500 mb-4">No products found</p>
              <Link to="/products" className="text-primary hover:underline">
                View all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
