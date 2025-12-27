import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface OrderDetails {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
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

const statusConfig: Record<string, { icon: any; color: string; bgColor: string; text: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', text: 'Pending Payment' },
  PAID: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', text: 'Payment Confirmed' },
  SHIPPED: { icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-50', text: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', text: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', text: 'Cancelled' },
};

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data || data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="daraz-container py-10">
        <div className="bg-white rounded-sm shadow-card p-10 text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="daraz-container py-10">
        <div className="bg-white rounded-sm shadow-card p-10 text-center">
          <p className="text-gray-500">Order not found</p>
          <Link to="/orders" className="text-primary hover:underline mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <div className="daraz-container py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/orders" className="text-gray-500 hover:text-primary">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-medium text-gray-800">Order Details</h1>
          <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status */}
          <div className={`${status.bgColor} rounded-sm p-4`}>
            <div className={`flex items-center gap-3 ${status.color}`}>
              <StatusIcon className="w-6 h-6" />
              <div>
                <p className="font-bold">{status.text}</p>
                <p className="text-sm opacity-80">
                  Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-sm shadow-card">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <img 
                    src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-sm border border-gray-100"
                  />
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.product?.id}`}
                      className="text-sm text-gray-800 hover:text-primary line-clamp-2"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-primary">৳ {item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-sm shadow-card p-4">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address provided</p>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-sm shadow-card p-4">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              Payment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳ {(order.totalAmount - 60).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>৳ 60</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">৳ {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="bg-[#e2136e] text-white px-2 py-1 rounded text-xs font-bold">bKash</div>
                <span className="text-xs text-gray-500">Payment via bKash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
