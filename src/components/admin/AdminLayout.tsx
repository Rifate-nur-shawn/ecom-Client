import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  ChevronRight,
  LogOut,
  Home,
  Bell,
  Settings,
  Menu,
  X,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../../store/useAuth';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

const breadcrumbLabels: Record<string, string> = {
  admin: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  users: 'Users',
};

// Mock notifications (in production, fetch from API)
const getNotifications = () => [
  { id: 1, type: 'order', title: 'New Order', message: 'Order #A1B2C3 received', time: '5 min ago', read: false },
  { id: 2, type: 'shipped', title: 'Order Shipped', message: 'Order #D4E5F6 has been shipped', time: '1 hour ago', read: false },
  { id: 3, type: 'alert', title: 'Low Stock Alert', message: '3 products are running low', time: '2 hours ago', read: true },
  { id: 4, type: 'success', title: 'Payment Received', message: 'Payment confirmed for #G7H8I9', time: '3 hours ago', read: true },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());

  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const unreadCount = notifications.filter(n => !n.read).length;

  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      try {
        await checkAuth();
        setSessionVerified(true);
      } catch {
        setSessionVerified(true);
      }
    };
    verifySession();
  }, [checkAuth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        toast.error('Session timed out due to inactivity');
        logout();
        navigate('/login?session=timeout');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastActivity, logout, navigate, SESSION_TIMEOUT]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateActivity));
    return () => events.forEach(event => window.removeEventListener(event, updateActivity));
  }, [updateActivity]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          if (location.pathname.startsWith('/admin')) {
            toast.error('Access denied. Please login again.');
            logout();
            navigate('/login?redirect=' + encodeURIComponent(location.pathname));
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [logout, navigate, location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClose = () => {
      setShowNotifications(false);
      setShowSettings(false);
    };
    if (showNotifications || showSettings) {
      document.addEventListener('click', handleClose);
      return () => document.removeEventListener('click', handleClose);
    }
  }, [showNotifications, showSettings]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading || !sessionVerified) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying admin credentials...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait while we secure your session</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-500 mb-6">You must be logged in to access the admin panel.</p>
          <Link 
            to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
            className="inline-block w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-2">Your account does not have administrator privileges.</p>
          <p className="text-gray-400 text-sm mb-6">Current role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user.role}</span></p>
          <Link 
            to="/"
            className="inline-block w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: breadcrumbLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
    isLast: index === pathSegments.length - 1,
  }));

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold">Atom Drops</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2 bg-green-500/10 border-b border-slate-700">
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <Shield className="w-4 h-4" />
            <span>Secure Session Active</span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-4">Navigation</p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive(item.path, item.exact) 
                  ? 'bg-orange-500 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive(item.path, item.exact) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400">Online</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" className="flex items-center justify-center gap-1 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-colors">
              <Home className="w-4 h-4" /> Store
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center gap-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
              <nav className="hidden sm:flex items-center text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <div key={crumb.path} className="flex items-center">
                    {i > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                    {crumb.isLast ? (
                      <span className="font-medium text-gray-800">{crumb.label}</span>
                    ) : (
                      <Link to={crumb.path} className="text-gray-500 hover:text-orange-500">{crumb.label}</Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowSettings(false); }}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      <button onClick={markAllAsRead} className="text-xs text-orange-500 hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 flex gap-3 ${!notif.read ? 'bg-orange-50/50' : ''}`}>
                          <div className="p-2 bg-gray-100 rounded-lg h-fit">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-100">
                      <Link to="/admin/orders" onClick={() => setShowNotifications(false)} className="text-sm text-orange-500 hover:underline">View all orders</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowNotifications(false); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-800">Quick Settings</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Dark Mode</span>
                        <button className="w-10 h-6 bg-gray-200 rounded-full relative" onClick={() => toast('Dark mode coming soon!')}>
                          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notifications</span>
                        <button className="w-10 h-6 bg-orange-500 rounded-full relative">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Auto-refresh</span>
                        <button className="w-10 h-6 bg-orange-500 rounded-full relative">
                          <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <Link to="/profile" onClick={() => setShowSettings(false)} className="block w-full py-2 text-center bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                        Go to Profile Settings
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>

        <footer className="bg-white border-t border-gray-200 px-6 py-3 text-center text-xs text-gray-500">
          Atom Drops Admin Panel • Secure Session
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
