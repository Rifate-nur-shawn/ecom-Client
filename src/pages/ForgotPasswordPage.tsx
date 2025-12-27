import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/password-reset/request', { email });
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#eff0f5] min-h-[600px] py-10">
        <div className="daraz-container">
          <div className="max-w-md mx-auto bg-white rounded-sm shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-500 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <Link to="/login" className="text-primary hover:underline">
              Back to Login
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
          <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <h2 className="text-xl font-medium text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-500 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
