import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useProduce({ search = '', category = 'all', farmerId = null }) {
  const [produce, setProduce] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'all') params.append('category', category);

        const res = await api.get(`/produce?${params.toString()}`);
        const allProduce = res.data.produce;

        // Filter by farmer if selected
        const filtered = farmerId
          ? allProduce.filter((p) => p.farmer_id === farmerId)
          : allProduce;

        setProduce(filtered);

        // Derive unique farmers from produce data
        const farmerMap = {};
        allProduce.forEach((p) => {
          if (!farmerMap[p.farmer_id]) {
            farmerMap[p.farmer_id] = {
              farmer_id: p.farmer_id,
              farmer_name: p.farmer_name,
              farmer_phone: p.farmer_phone,
              product_count: 0,
            };
          }
          farmerMap[p.farmer_id].product_count++;
        });
        setFarmers(Object.values(farmerMap));
      } catch (err) {
        console.error('Failed to fetch produce:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, category, farmerId]);

  return { produce, farmers, loading };
}
