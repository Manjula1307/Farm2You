import { useState } from 'react';
import { Search, Filter, Users, CheckCircle, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FarmerCard from '../components/FarmerCard';
import ContactModal from '../components/ContactModal';
import { useProduce } from '../hooks/useProduce';
import { useAuth } from '../context/AuthContext';

export default function ConsumerHome() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedFarmerName, setSelectedFarmerName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState('');

  const { produce, farmers, loading } = useProduce({
    search: searchQuery,
    category: selectedCategory,
    farmerId: selectedFarmer,
  });

  const categories = ['all', ...Array.from(new Set(produce.map((p) => p.category).filter(Boolean)))];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const handleOrder = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleOrderPlaced = () => {
    setShowModal(false);
    showToast('Order placed! Check My Orders to track it.');
  };

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer.farmer_id);
    setSelectedFarmerName(farmer.farmer_name);
    setViewMode('products');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {toast && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-green-100 text-sm">Browse fresh produce directly from local farmers.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
            {[['products', '🥬 Products'], ['farmers', '🌾 Farmers']].map(([m, label]) => (
              <button key={m} onClick={() => { setViewMode(m); setSelectedFarmer(null); setSelectedFarmerName(''); }}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder={viewMode === 'products' ? 'Search produce...' : 'Search farmers...'}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
          </div>

          {/* Category filter */}
          {viewMode === 'products' && (
            <div className="relative flex-shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white text-sm cursor-pointer">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Active farmer filter banner */}
      {selectedFarmer && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-green-600" size={18} />
            <p className="font-semibold text-gray-800 text-sm">
              Showing produce from <span className="text-green-700">{selectedFarmerName}</span>
            </p>
          </div>
          <button onClick={() => { setSelectedFarmer(null); setSelectedFarmerName(''); }}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={15} /> Clear
          </button>
        </div>
      )}

      {/* Section heading */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {viewMode === 'products' ? '🥬 Fresh Produce' : '🌾 Our Farmers'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {viewMode === 'products'
              ? `${produce.length} item${produce.length !== 1 ? 's' : ''} available`
              : `${farmers.length} farmer${farmers.length !== 1 ? 's' : ''} on platform`}
          </p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-sm h-80 animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'products' ? (
        produce.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="font-semibold text-gray-800 mb-1">No produce found</h3>
            <p className="text-gray-500 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {produce.map((product) => (
              <ProductCard key={product.id} product={product}
                farmer={{ farmName: product.farmer_name, phone: product.farmer_phone }}
                onContact={handleOrder} />
            ))}
          </div>
        )
      ) : (
        farmers.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-4xl mb-3">🌾</p>
            <h3 className="font-semibold text-gray-800 mb-1">No farmers found</h3>
            <p className="text-gray-500 text-sm">Check back soon as more farmers join</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {farmers.map((farmer) => (
              <FarmerCard key={farmer.farmer_id} farmer={farmer}
                productCount={farmer.product_count || 0}
                onClick={() => handleFarmerClick(farmer)} />
            ))}
          </div>
        )
      )}

      {showModal && selectedProduct && (
        <ContactModal
          product={selectedProduct}
          farmer={{ farmName: selectedProduct.farmer_name, phone: selectedProduct.farmer_phone }}
          onClose={() => setShowModal(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}
    </div>
  );
}
