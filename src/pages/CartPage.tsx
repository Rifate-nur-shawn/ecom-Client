import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../store/useCart';

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-white mt-4 rounded-sm shadow-card p-10 daraz-container flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-medium text-gray-700 mb-2">There are no items in this cart</h2>
        <Link to="/">
          <button className="daraz-btn-outline uppercase mt-4">Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="daraz-container py-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
           {/* Header Row */}
           <div className="bg-white p-3 rounded-sm shadow-card mb-2 flex text-gray-500 text-xs uppercase font-medium">
             <div className="w-1/2">Product</div>
             <div className="w-1/4 text-center">Quantity</div>
             <div className="w-1/4 text-right">Price</div>
           </div>

           {/* Items */}
           <div className="bg-white rounded-sm shadow-card p-4 space-y-4">
             {items.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="w-1/2 flex gap-3">
                     <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
                     <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-16 h-16 object-cover rounded-sm border border-gray-200" />
                     <div className="flex flex-col justify-between">
                        <Link to={`/products/${item.productId || ''}`} className="text-sm font-medium hover:text-primary line-clamp-2">
                          {item.name}
                        </Link>
                        <span className="text-xs text-gray-400">Brand: No Brand, Color: Black</span>
                        <div className="flex items-center gap-2 mt-1">
                           <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="w-1/4 flex justify-center">
                     <div className="flex items-center border border-gray-200 rounded-sm">
                        <button 
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                     </div>
                  </div>
                  <div className="w-1/4 text-right">
                     <span className="text-primary font-bold text-lg">৳ {(item.price * item.quantity).toLocaleString()}</span>
                     <div className="text-xs text-gray-400 line-through">৳ {(item.price * item.quantity * 1.2).toLocaleString()}</div>
                  </div>
                </div>
             ))}
           </div>
        </div>

        {/* Summary */}
        <div className="lg:w-1/3">
           <div className="bg-white p-4 rounded-sm shadow-card sticky top-20">
              <h3 className="font-medium text-lg mb-4 text-gray-800">Order Summary</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                 <span>Subtotal ({items.length} items)</span>
                 <span>৳ {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                 <span>Shipping Fee</span>
                 <span>৳ 60</span>
              </div>
              <div className="flex gap-2 mb-4">
                 <input type="text" placeholder="Enter Voucher Code" className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded-sm outline-none focus:border-primary" />
                 <button className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase rounded-sm hover:bg-primary-hover">Apply</button>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 mb-4 border-t pt-4">
                 <span>Total</span>
                 <span className="text-primary">৳ {(totalAmount + 60).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-3 uppercase font-bold text-sm rounded-sm hover:bg-primary-hover shadow-lg transition-all"
              >
                Proceed to Checkout ({items.length})
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
