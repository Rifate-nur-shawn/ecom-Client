import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      imageUrl: string;
    };
  }>;
}

const statusConfig: Record<string, { icon: any; color: string; text: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-500', text: 'Pending Payment' },
  PAID: { icon: CheckCircle, color: 'text-blue-500', text: 'Paid' },
  SHIPPED: { icon: Truck, color: 'text-purple-500', text: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-500', text: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'text-red-500', text: 'Cancelled' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data.data || data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="daraz-container py-10">
        <div className="bg-white rounded-sm shadow-card p-10 text-center">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="daraz-container py-10">
        <div className="bg-white rounded-sm shadow-card p-10 flex flex-col items-center">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link to="/" className="daraz-btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="daraz-container py-6">
      <h1 className="text-2xl font-medium text-gray-800 mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.PENDING;
          const StatusIcon = status.icon;
          
          return (
            <div key={order.id} className="bg-white rounded-sm shadow-card overflow-hidden">
              {/* Order Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${status.color}`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">{status.text}</span>
                  </div>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    <img 
                      src={item.product?.imageUrl || 'https://via.placeholder.com/60'} 
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-sm border border-gray-100"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-primary">৳ {item.price.toLocaleString()}</p>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-xs text-gray-500 mt-2">+{order.items.length - 2} more items</p>
                )}
              </div>

              {/* Order Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
                <div>
                  <span className="text-sm text-gray-500">Total: </span>
                  <span className="text-lg font-bold text-primary">৳ {order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-sm hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                  <Link 
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 text-sm text-primary border border-primary rounded-sm hover:bg-orange-50 flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
