import { MapPin, Phone, Mail } from 'lucide-react';

export default function FarmerCard({ farmer, productCount, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={farmer.imageUrl}
          alt={farmer.farmName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{farmer.farmName}</h3>
        <p className="text-gray-600 font-medium mb-3">{farmer.name}</p>

        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <MapPin size={16} className="text-green-600 flex-shrink-0" />
          <span>{farmer.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <Phone size={16} className="text-green-600 flex-shrink-0" />
          <span>{farmer.phone}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Mail size={16} className="text-green-600 flex-shrink-0" />
          <span className="truncate">{farmer.email}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{farmer.description}</p>

        <div className="pt-3 border-t">
          <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            {productCount} Products Available
          </div>
        </div>
      </div>
    </div>
  );
}
