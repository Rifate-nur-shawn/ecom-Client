import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/password-reset/confirm', { token, password });
      setIsReset(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-[#eff0f5] min-h-[600px] py-10">
        <div className="daraz-container">
          <div className="max-w-md mx-auto bg-white rounded-sm shadow-lg p-8 text-center">
            <h2 className="text-xl font-medium text-red-600 mb-4">Invalid Reset Link</h2>
            <p className="text-gray-500 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isReset) {
    return (
      <div className="bg-[#eff0f5] min-h-[600px] py-10">
        <div className="daraz-container">
          <div className="max-w-md mx-auto bg-white rounded-sm shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-500 mb-4">
              Your password has been changed. Redirecting to login...
            </p>
            <Link to="/login" className="text-primary hover:underline">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eff0f5] min-h-[600px] py-10">
      <div className="daraz-container">
        <div className="max-w-md mx-auto bg-white rounded-sm shadow-lg p-8">
          <h2 className="text-xl font-medium text-gray-800 mb-2">Reset Your Password</h2>
          <p className="text-gray-500 mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">New Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:border-primary outline-none"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:border-primary outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-bold uppercase text-sm rounded-sm hover:bg-primary-hover disabled:opacity-50"
              style={{ backgroundColor: '#f85606' }}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
