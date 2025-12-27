import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../store/useCart';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const trxID = searchParams.get('trxID');
  const { items, removeItem } = useCart();

  // Clear cart on successful payment if not already cleared
  useEffect(() => {
     if (items.length > 0) {
        items.forEach(item => removeItem(item.id));
     }
  }, []);

  return (
    <div className="daraz-container py-20 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
      
      {trxID && (
        <div className="bg-gray-100 px-4 py-2 rounded-sm mb-6 text-sm text-gray-600">
           Transaction ID: <span className="font-bold text-gray-800">{trxID}</span>
        </div>
      )}

      <div className="flex gap-4">
        <Link to="/orders">
          <button className="daraz-btn-outline">View Order</button>
        </Link>
        <Link to="/">
           <button className="daraz-btn-primary">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
