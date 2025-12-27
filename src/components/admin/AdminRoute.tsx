import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - Industry-grade protected route for admin pages
 * 
 * Security features:
 * 1. Checks authentication status
 * 2. Verifies ADMIN role
 * 3. Shows loading state during verification
 * 4. Redirects unauthorized users with return URL
 * 5. Prevents flash of protected content
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Not an admin - redirect to home with error
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#eff0f5] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">
            You don't have permission to access the admin area. 
            This incident will be logged.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            style={{ backgroundColor: '#f85606' }}
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Authorized admin - render children
  return <>{children}</>;
};

export default AdminRoute;
