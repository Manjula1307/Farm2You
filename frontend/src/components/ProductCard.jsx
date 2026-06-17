import { Package, Leaf, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, farmer, onContact }) {
  // Support both old field names and new backend field names
  const price = product.price_per_unit || product.price;
  const quantity = product.quantity_available || product.quantityAvailable;
  const imageUrl = product.image_url || product.imageUrl;
  const farmerName = product.farmer_name || farmer?.farmName || farmer?.farmer_name;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">🥬</span>
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 left-3 bg-white bg-opacity-95 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {product.category}
          </div>
        )}
        {product.isOrganic && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Leaf size={12} /> Organic
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Package size={15} className="text-green-600 flex-shrink-0" />
          <span>{quantity} {product.unit} available</span>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-green-700">₹{Number(price).toFixed(2)}</span>
            <span className="text-gray-500 text-sm">per {product.unit}</span>
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{farmerName}</span>
            {farmer?.location && <span> · {farmer.location}</span>}
          </p>
        </div>

        <button onClick={() => onContact(product, farmer)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <ShoppingCart size={17} />
          Order Now
        </button>
      </div>
    </div>
  );
}
