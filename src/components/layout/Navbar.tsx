import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, LogOut, Package, MapPin } from 'lucide-react';
import { useAuth } from '../../store/useAuth';
import { useCart } from '../../store/useCart';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Bar */}
      <div className="bg-[#f5f5f5] text-[#212121] text-xs py-1 border-b border-gray-200">
        <div className="daraz-container flex justify-between items-center h-6">
          <div className="flex space-x-4 items-center">
            <span className="text-primary font-bold">Welcome to Atom Drops</span>
          </div>
          <div className="flex space-x-4 items-center text-gray-600">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:text-primary transition-colors font-medium">Login</Link>
                <span className="text-gray-300">|</span>
                <Link to="/register" className="hover:text-primary transition-colors font-medium">Sign Up</Link>
              </>
            ) : (
              <span className="font-medium">Hello, {user?.name?.split(' ')[0] || 'User'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white pt-4 pb-4 sticky top-0 z-50 shadow-sm border-b border-gray-100/50">
        <div className="daraz-container flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-end">
              <span className="text-3xl font-bold text-[#f85606] tracking-tighter">Atom</span>
              <span className="text-3xl font-bold text-[#f85606]">Drops</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl relative">
            <div className="flex w-full bg-[#f5f5f5] rounded-l-md rounded-r-md overflow-hidden">
              <input 
                type="text" 
                placeholder="Search in Atom Drops" 
                className="w-full px-4 py-3 bg-[#eff0f5] text-sm text-gray-700 focus:outline-none placeholder-gray-500"
              />
              <button className="bg-[#f85606] text-white px-6 hover:bg-[#d04205] transition-colors flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingCart className="w-8 h-8 text-gray-700 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown (when logged in) */}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                >
                  <User className="w-6 h-6" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link 
                      to="/addresses" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <MapPin className="w-4 h-4" />
                      My Addresses
                    </Link>
                    <Link 
                      to="/my-reviews" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Package className="w-4 h-4" />
                      My Reviews
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 border-t border-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Package className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
