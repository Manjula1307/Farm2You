import { useState } from 'react';
import { X, MapPin, User } from 'lucide-react';
import api from '../api/axios';

export default function ContactModal({ product, farmer, onClose, onOrderPlaced }) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = (product.price_per_unit * quantity).toFixed(2);

  const handleOrder = async () => {
    if (!deliveryAddress.trim()) { setError('Please enter a delivery address.'); return; }
    setError('');
    setLoading(true);
    try {
      await api.post('/orders', {
        items: [{ produce_id: product.id, quantity }],
        delivery_address: deliveryAddress,
      });
      onOrderPlaced();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Place Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={22} /></button>
        </div>

        <div className="p-6">
          {/* Product summary */}
          <div className="bg-green-50 rounded-xl p-4 mb-5">
            <div className="flex gap-4">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-green-700 font-semibold">₹{product.price_per_unit} per {product.unit}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <User size={14} className="text-green-600" />
                  <span>{farmer.farmName || farmer.farmer_name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity ({product.unit}) *
              </label>
              <input type="number" min={1} max={product.quantity_available || product.quantityAvailable}
                value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
              <p className="text-xs text-gray-400 mt-1">
                Available: {product.quantity_available || product.quantityAvailable} {product.unit}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                <MapPin size={14} className="inline mr-1 text-green-600" />
                Delivery Address *
              </label>
              <textarea rows={3} value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm resize-none" />
            </div>

            {/* Order total */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">{quantity} {product.unit} × ₹{product.price_per_unit}</span>
              <span className="font-bold text-green-700 text-lg">₹{total}</span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-sm">
                Cancel
              </button>
              <button onClick={handleOrder} disabled={loading}
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 text-sm transition-colors">
                {loading ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
