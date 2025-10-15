import { useState } from 'react';
import { X, Phone, Mail, MapPin, User } from 'lucide-react';

export default function ContactModal({ product, farmer, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
    quantityNeeded: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Contact Farmer Directly</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-green-50 rounded-xl p-5 mb-6">
            <div className="flex gap-4 mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-green-700 font-semibold text-lg mb-2">
                  ₹{product.price} per {product.unit}
                </p>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>

            <div className="border-t border-green-200 pt-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} className="text-green-600" />
                Farmer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">{farmer.farmName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-green-600 flex-shrink-0" />
                  {farmer.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} className="text-green-600 flex-shrink-0" />
                  {farmer.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-green-600 flex-shrink-0" />
                  {farmer.email}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity Needed ({product.unit}) *
              </label>
              <input
                type="number"
                required
                min="1"
                max={product.quantityAvailable}
                value={formData.quantityNeeded}
                onChange={(e) => setFormData({ ...formData, quantityNeeded: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {product.quantityAvailable} {product.unit}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Any specific requirements or questions for the farmer..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <p className="font-semibold mb-1">Direct Connection - No Middlemen!</p>
              <p>
                Your information will be shared directly with the farmer. They will contact you to
                finalize the purchase details and delivery.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
