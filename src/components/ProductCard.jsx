import { Package, Calendar, Leaf } from 'lucide-react';

export default function ProductCard({ product, farmer, onContact }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.isOrganic && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Leaf size={14} />
            Organic
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white bg-opacity-95 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
          {product.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Package size={16} />
          <span>
            Available: {product.quantityAvailable} {product.unit}
          </span>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold text-green-700">₹{product.price}</span>
            <span className="text-gray-600">per {product.unit}</span>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{farmer.farmName}</span>
            <span className="mx-1">•</span>
            <span>{farmer.location}</span>
          </div>
        </div>

        <button
          onClick={() => onContact(product, farmer)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Contact Farmer Directly
        </button>
      </div>
    </div>
  );
}
