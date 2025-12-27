import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const location = useLocation();
  const isRegisterRoute = location.pathname === '/register';
  const [isLogin, setIsLogin] = useState(!isRegisterRoute);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Login successful!");
        navigate('/');
      } else {
        await register(name, email, password);
        toast.success("Account created! Please login.");
        setIsLogin(true);
        setPassword('');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    }
  };

  return (
    <div className="bg-[#eff0f5] min-h-[600px] py-10">
      <div className="daraz-container">
        <div className="max-w-md mx-auto bg-white rounded-sm shadow-lg overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-center font-bold text-sm uppercase transition-colors ${
                isLogin 
                  ? 'text-primary border-b-2 border-primary bg-orange-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-center font-bold text-sm uppercase transition-colors ${
                !isLogin 
                  ? 'text-primary border-b-2 border-primary bg-orange-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name" 
                    className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Password *</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Minimum 6 characters"} 
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 uppercase font-bold text-sm rounded-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{ backgroundColor: isLoading ? '#ccc' : '#f85606' }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#d04205')}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#f85606')}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            {isLogin && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? (
                <p>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-primary font-medium hover:underline">Sign Up</button></p>
              ) : (
                <p>Already have an account? <button onClick={() => setIsLogin(true)} className="text-primary font-medium hover:underline">Login</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;