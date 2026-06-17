import { MapPin, Package } from 'lucide-react';

export default function FarmerCard({ farmer, productCount, onClick }) {
  return (
    <div onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group">
      <div className="h-40 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
        <div className="bg-white rounded-full p-5 shadow-sm group-hover:scale-105 transition-transform">
          <span className="text-4xl">🌾</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {farmer.farmer_name || farmer.farmName}
        </h3>
        {farmer.location && (
          <div className="flex items-center gap-1.5 mb-3 text-sm text-gray-500">
            <MapPin size={14} className="text-green-600 flex-shrink-0" />
            <span>{farmer.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm">
          <Package size={14} className="text-green-600" />
          <span className="text-green-700 font-semibold">{productCount} products available</span>
        </div>
        <div className="mt-4 pt-3 border-t text-xs text-gray-400 font-medium uppercase tracking-wide">
          Click to browse produce →
        </div>
      </div>
    </div>
  );
}
