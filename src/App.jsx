import { useState } from 'react';
import { sampleFarmers, sampleProducts } from './data/sampleData';
import ProductCard from './components/ProductCard';
import FarmerCard from './components/FarmerCard';
import ContactModal from './components/ContactModal';
import { Sprout, Users, Search, Filter, CheckCircle } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState('products');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFarmerForContact, setSelectedFarmerForContact] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const categories = ['all', ...Array.from(new Set(sampleProducts.map(p => p.category)))];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesFarmer = !selectedFarmer || product.farmerId === selectedFarmer;
    return matchesSearch && matchesCategory && matchesFarmer;
  });

  const filteredFarmers = sampleFarmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactClick = (product, farmer) => {
    setSelectedProduct(product);
    setSelectedFarmerForContact(farmer);
    setShowContactModal(true);
  };

  const handleContactSubmit = (data) => {
    console.log('Contact inquiry submitted:', {
      product: selectedProduct,
      farmer: selectedFarmerForContact,
      ...data,
    });
    setShowContactModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const getProductCountForFarmer = (farmerId) => {
    return sampleProducts.filter(p => p.farmerId === farmerId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-3 rounded-xl">
                <Sprout className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Farm2You</h1>
                <p className="text-sm text-gray-600">From Farm to Your Table - No Middlemen</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewMode('products');
                  setSelectedFarmer(null);
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'products'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => {
                  setViewMode('farmers');
                  setSelectedFarmer(null);
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'farmers'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Farmers
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={viewMode === 'products' ? 'Search products...' : 'Search farmers...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {viewMode === 'products' && (
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showSuccessMessage && (
        <div className="fixed top-24 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in">
          <CheckCircle size={24} />
          <div>
            <p className="font-semibold">Inquiry Sent Successfully!</p>
            <p className="text-sm text-green-100">The farmer will contact you soon.</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedFarmer && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold text-gray-900">
                  Showing products from: {sampleFarmers.find(f => f.id === selectedFarmer)?.farmName}
                </p>
                <p className="text-sm text-gray-600">
                  {sampleFarmers.find(f => f.id === selectedFarmer)?.location}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFarmer(null)}
              className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              View All Products
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {viewMode === 'products' ? 'Fresh Products' : 'Our Farmers'}
          </h2>
          <p className="text-gray-600">
            {viewMode === 'products'
              ? 'Buy directly from farmers and support local agriculture'
              : 'Meet the farmers behind your food'}
          </p>
        </div>

        {viewMode === 'products' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const farmer = sampleFarmers.find(f => f.id === product.farmerId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  farmer={farmer}
                  onContact={handleContactClick}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map(farmer => (
              <FarmerCard
                key={farmer.id}
                farmer={farmer}
                productCount={getProductCountForFarmer(farmer.id)}
                onClick={() => {
                  setSelectedFarmer(farmer.id);
                  setViewMode('products');
                }}
              />
            ))}
          </div>
        )}

        {((viewMode === 'products' && filteredProducts.length === 0) ||
          (viewMode === 'farmers' && filteredFarmers.length === 0)) && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout size={24} />
                <span className="text-xl font-bold">FarmDirect</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting farmers directly with customers. Eliminating middlemen for better prices and fresher produce.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Why Choose Us?</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ No middlemen commission</li>
                <li>✓ Better prices for farmers</li>
                <li>✓ Fresher produce for customers</li>
                <li>✓ Direct communication</li>
                <li>✓ Support local agriculture</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Higher profits for farmers</li>
                <li>• Lower prices for customers</li>
                <li>• Quality assurance</li>
                <li>• Transparent pricing</li>
                <li>• Community support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 FarmDirect. Empowering farmers, serving customers directly.</p>
          </div>
        </div>
      </footer>

      {showContactModal && selectedProduct && selectedFarmerForContact && (
        <ContactModal
          product={selectedProduct}
          farmer={selectedFarmerForContact}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
}

export default App;
