import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axios';

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my-orders').then((res) => {
      setOrders(res.data.orders);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading your orders...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm mt-1">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div>
                    <p className="font-bold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-700">₹{order.total_amount}</span>
                  {expanded === order.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {expanded === order.id && order.items && (
                <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-3">Delivery: {order.delivery_address}</p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-semibold text-gray-800">{item.produce_name}</p>
                          <p className="text-gray-500">from {item.farmer_name} · {item.quantity} {item.unit}</p>
                        </div>
                        <span className="font-semibold text-gray-800">₹{item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-green-700">₹{order.total_amount}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
