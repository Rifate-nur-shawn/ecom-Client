import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { api } from '../../lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = '' }: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Popular searches (could be fetched from analytics)
  const popularSearches = ['Smartphone', 'Laptop', 'Headphones', 'Watch', 'Camera'];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query)}&limit=5`);
        const products = data?.data?.products || data?.products || data?.data || data || [];
        setSuggestions(Array.isArray(products) ? products.slice(0, 5) : []);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm.trim());
    setIsOpen(false);
    setQuery('');
    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/products/${productId}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="flex w-full bg-[#eff0f5] rounded-lg overflow-hidden shadow-sm">
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search in Atom Drops" 
            className="w-full px-4 py-3 bg-transparent text-sm text-gray-700 focus:outline-none placeholder-gray-500"
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="px-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            type="submit"
            className="bg-[#f85606] text-white px-6 hover:bg-[#d04205] transition-colors flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Loading */}
          {loading && (
            <div className="p-4 text-center text-gray-500 text-sm">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {/* Product Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-500 px-3 py-1">Products</p>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{product.name}</p>
                    <p className="text-sm font-medium text-orange-500">৳ {product.price?.toLocaleString()}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSearch(query)}
                className="w-full text-center text-sm text-orange-500 py-2 hover:bg-orange-50 rounded-lg mt-1"
              >
                See all results for "{query}"
              </button>
            </div>
          )}

          {/* No query - show recent & popular */}
          {!loading && !query && (
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between px-3 py-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent Searches
                    </p>
                    <button onClick={clearRecentSearches} className="text-xs text-gray-400 hover:text-red-500">
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(term)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <p className="text-xs text-gray-500 px-3 py-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Popular Searches
                </p>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Query but no results */}
          {!loading && query && suggestions.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No products found for "{query}"</p>
              <button
                onClick={() => handleSearch(query)}
                className="text-sm text-orange-500 hover:underline mt-1"
              >
                Search anyway
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
