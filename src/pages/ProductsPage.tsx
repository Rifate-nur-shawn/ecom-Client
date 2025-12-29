import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { ChevronDown, Filter, Search, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('best');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryId);
    setLocalSearch(searchQuery);
    fetchProducts(categoryId, searchQuery);
  }, [categoryId, searchQuery]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data || data || []);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchProducts = async (catId?: string | null, search?: string) => {
    setIsLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      
      if (catId) {
        url = `/categories/${catId}/products`;
      }
      if (search) {
        params.append('search', search);
      }
      
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      const { data } = await api.get(fullUrl);
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
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set('category', catId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  const handleApplyPriceFilter = () => {
    // Filter products locally by price
    // In production, you'd send this to the API
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="daraz-container py-4">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-white p-4 shadow-card rounded-sm mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Search results for:</span>
            <span className="font-bold text-gray-800">"{searchQuery}"</span>
          </div>
          <button onClick={clearSearch} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500">
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      )}

      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <div className="w-1/5 hidden md:block space-y-4">
          {/* Search in results */}
          <div className="bg-white p-3 shadow-card rounded-sm">
            <h3 className="font-bold text-sm mb-2 text-gray-700 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </h3>
            <form onSubmit={handleLocalSearch} className="flex gap-1">
              <input 
                type="text" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..." 
                className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded-sm outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white px-3 py-2 rounded-sm hover:bg-primary-hover">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

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
              <input 
                type="number" 
                placeholder="Min" 
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full border border-gray-300 px-2 py-1.5 text-sm rounded-sm outline-none focus:border-primary" 
              />
              <span className="text-gray-400">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full border border-gray-300 px-2 py-1.5 text-sm rounded-sm outline-none focus:border-primary" 
              />
            </div>
            <button 
              onClick={handleApplyPriceFilter}
              className="w-full bg-primary text-white text-sm py-1.5 rounded-sm shadow-sm hover:bg-primary-hover transition"
            >
              Apply
            </button>
          </div>

          {/* Rating */}
          <div className="bg-white p-3 shadow-card rounded-sm">
            <h3 className="font-bold text-sm mb-2 text-gray-700">Rating</h3>
            <ul className="space-y-1">
              {[5, 4, 3, 2, 1].map(stars => (
                <li key={stars} className="flex gap-1 items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-sm text-xs">
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
              <span className="font-bold text-gray-800">{sortedProducts.length}</span> items found
              {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                <span> in "{categories.find(c => c.id === selectedCategory)?.name}"</span>
              )}
              {searchQuery && <span> for "{searchQuery}"</span>}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sort By:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 px-4 py-1.5 pr-8 rounded-sm cursor-pointer bg-white outline-none focus:border-primary"
                >
                  <option value="best">Best Match</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-sm"></div>)}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-sm shadow-card p-10 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try a different category or filter'}
              </p>
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
