import { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data.data || data || []);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/addresses/${editingId}`, formData);
        toast.success('Address updated');
      } else {
        await api.post('/addresses', formData);
        toast.success('Address added');
      }
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      console.error('Address save error:', error?.response?.data);
      toast.error(error?.response?.data?.error || 'Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      city: address.city,
      state: address.state || '',
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const resetForm = () => {
    setFormData({ full_name: '', phone: '', address_line1: '', city: '', state: '', postal_code: '', is_default: false });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="daraz-container py-10">
        <div className="bg-white rounded-sm shadow-card p-10 text-center">
          <p className="text-gray-500">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="daraz-container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-800">My Addresses</h1>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="daraz-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="bg-white rounded-sm shadow-card p-6 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number * (01XXXXXXXXX)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Address *</label>
              <textarea
                value={formData.address_line1}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary outline-none"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">State/Division *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g., Dhaka"
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-sm text-sm focus:border-primary outline-none"
                  required
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="accent-primary"
              />
              <span className="text-sm text-gray-600">Set as default address</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" className="daraz-btn-primary">
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button type="button" onClick={resetForm} className="daraz-btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-sm shadow-card p-10 flex flex-col items-center">
          <MapPin className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Addresses Yet</h2>
          <p className="text-gray-500 mb-6">Add an address for faster checkout</p>
          <button onClick={() => setShowForm(true)} className="daraz-btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-white rounded-sm shadow-card p-4 relative ${
                address.is_default ? 'border-2 border-primary' : ''
              }`}
            >
              {address.is_default && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-sm flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Default
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{address.full_name}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.address_line1}</p>
                  <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
