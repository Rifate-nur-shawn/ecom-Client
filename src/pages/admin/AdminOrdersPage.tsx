import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, Eye, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  status: string;
  total_amount?: number;
  totalAmount?: number;
  created_at?: string;
  createdAt?: string;
  user: { id: string; name: string; email: string };
  items: Array<{ id: string; quantity: number; price: number; product: { name: string; image_url?: string } }>;
  shipping_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    state: string;
  };
}

const statusOptions = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const AdminOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      const ordersData = data?.data?.orders || data?.data || data?.orders || data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update status');
    }
  };

  const getOrderAmount = (order: Order) => order.total_amount || order.totalAmount || 0;
  const getOrderDate = (order: Order) => order.created_at || order.createdAt || '';

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-500">Manage and track all customer orders</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 outline-none bg-white"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-orange-50' : ''}`} onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{getOrderDate(order) ? new Date(getOrderDate(order)).toLocaleDateString() : 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => { e.stopPropagation(); updateOrderStatus(order.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 font-medium">৳ {getOrderAmount(order).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit sticky top-24">
          {selectedOrder ? (
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Order Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono font-medium">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.user?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email || ''}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shipping Address</p>
                  {selectedOrder.shipping_address ? (
                    <div className="text-sm text-gray-700">
                      <p>{selectedOrder.shipping_address.full_name}</p>
                      <p>{selectedOrder.shipping_address.phone}</p>
                      <p>{selectedOrder.shipping_address.address_line1}</p>
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No address provided</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Items ({selectedOrder.items?.length || 0})</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span className="truncate flex-1">{item.product?.name || 'Unknown'}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">৳ {getOrderAmount(selectedOrder).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
