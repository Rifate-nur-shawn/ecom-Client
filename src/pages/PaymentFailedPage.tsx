import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="daraz-container py-20 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-6">{message || "Something went wrong with your payment."}</p>
      
      <div className="flex gap-4">
        <Link to="/checkout">
          <button className="daraz-btn-primary">Try Again</button>
        </Link>
        <Link to="/">
           <button className="daraz-btn-outline">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
