import { useState, useEffect } from 'react';
import { Plus, Package, ShoppingBag, Pencil, Trash2, X, CheckCircle } from 'lucide-react';
import api from '../api/axios';

export default function FarmerDashboard() {
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');

  const emptyForm = { name: '', description: '', category: '', price_per_unit: '', unit: 'kg', quantity_available: '', image_url: '' };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchListings = async () => {
    const res = await api.get('/produce/farmer/my-listings');
    setListings(res.data.listings);
  };

  const fetchOrders = async () => {
    const res = await api.get('/orders/farmer/incoming');
    setOrders(res.data.orders);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchListings(), fetchOrders()]);
      setLoading(false);
    })();
  }, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name, description: item.description || '',
      category: item.category || '', price_per_unit: item.price_per_unit,
      unit: item.unit, quantity_available: item.quantity_available,
      image_url: item.image_url || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await api.put(`/produce/${editItem.id}`, form);
        showToast('Listing updated!');
      } else {
        await api.post('/produce', form);
        showToast('Produce listed successfully!');
      }
      setShowForm(false);
      fetchListings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving listing.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/produce/${id}`);
    showToast('Listing deleted.');
    fetchListings();
  };

  const handleStatusUpdate = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    showToast(`Order marked as ${status}`);
    fetchOrders();
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading your dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button onClick={() => setTab('listings')} className={`pb-3 px-1 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === 'listings' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          <Package size={16} /> My Listings ({listings.length})
        </button>
        <button onClick={() => setTab('orders')} className={`pb-3 px-1 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === 'orders' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          <ShoppingBag size={16} /> Incoming Orders ({orders.length})
        </button>
      </div>

      {tab === 'listings' && (
        <>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-900">Your Produce Listings</h2>
            <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
              <Plus size={16} /> Add Produce
            </button>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No listings yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first produce to start selling</p>
              <button onClick={openAdd} className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold">Add Produce</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {listings.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-5">
                  {item.image_url && <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      {item.category && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{item.category}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{item.is_available ? 'Active' : 'Hidden'}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mb-2">{item.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="font-bold text-green-700">₹{item.price_per_unit}/{item.unit}</span>
                      <span className="text-gray-500">{item.quantity_available} {item.unit} available</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'orders' && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Incoming Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No orders yet</p>
              <p className="text-gray-400 text-sm mt-1">Orders from consumers will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{order.produce_name} × {order.quantity} {order.unit}</p>
                      <p className="text-sm text-gray-500">Consumer: {order.consumer_name} · {order.consumer_phone}</p>
                      <p className="text-sm text-gray-500 mt-1">Deliver to: {order.delivery_address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">₹{order.subtotal}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[order.status]}`}>{order.status}</span>
                    </div>
                  </div>
                  {order.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <button onClick={() => handleStatusUpdate(order.order_id, 'confirmed')} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Confirm</button>
                      <button onClick={() => handleStatusUpdate(order.order_id, 'cancelled')} className="px-4 py-2 border border-red-300 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">Cancel</button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <div className="pt-3 border-t">
                      <button onClick={() => handleStatusUpdate(order.order_id, 'delivered')} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">Mark Delivered</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editItem ? 'Edit Listing' : 'Add New Produce'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['name', 'Produce Name *', 'text', 'e.g. Fresh Tomatoes'],
                ['category', 'Category', 'text', 'e.g. Vegetables, Fruits, Dairy'],
                ['price_per_unit', 'Price per Unit (₹) *', 'number', '0'],
                ['unit', 'Unit *', 'text', 'kg, liter, dozen, piece'],
                ['quantity_available', 'Quantity Available *', 'number', '0'],
                ['image_url', 'Image URL (optional)', 'url', 'https://...'],
              ].map(([field, label, type, placeholder]) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[field]} onChange={set(field)} placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Describe your produce..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 text-sm">{editItem ? 'Save Changes' : 'Add Listing'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
