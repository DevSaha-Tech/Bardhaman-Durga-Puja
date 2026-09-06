import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import pandalData from '../../public/data/pandals.json';

export default function TrendsPanel() {
  const [trends, setTrends] = useState({ mostVisited: [], leastVisited: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trends');
        const data = await response.json();
        setTrends(data);
      } catch (error) {
        console.error('Failed to fetch trends', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const getPandalName = (id) => {
    const p = pandalData.find(p => p.id === id);
    return p ? p.name_bn : 'Unknown Pandal';
  };

  if (loading) {
    return (
      <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl p-6 border border-stone-800 animate-pulse h-64">
        <div className="h-6 bg-stone-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-stone-800 rounded w-full"></div>
          <div className="h-4 bg-stone-800 rounded w-full"></div>
          <div className="h-4 bg-stone-800 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/50 backdrop-blur-md rounded-2xl p-6 border border-stone-800">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-500" />
        বিগত ২ দিনের ট্রেন্ডিং মণ্ডপ
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Visited */}
        <div className="bg-stone-800/30 rounded-xl p-4 border border-red-900/30">
          <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            সবচেয়ে বেশি ভিড়
          </h4>
          <ul className="space-y-3">
            {trends.mostVisited.length > 0 ? trends.mostVisited.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="text-stone-300 font-medium">{idx + 1}. {getPandalName(item._id)}</span>
                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">{item.count} জন</span>
              </li>
            )) : <li className="text-stone-500 text-sm italic">পর্যাপ্ত ডেটা নেই</li>}
          </ul>
        </div>

        {/* Least Visited */}
        <div className="bg-stone-800/30 rounded-xl p-4 border border-green-900/30">
          <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            তুলনামূলক কম ভিড়
          </h4>
          <ul className="space-y-3">
            {trends.leastVisited.length > 0 ? trends.leastVisited.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="text-stone-300 font-medium">{idx + 1}. {getPandalName(item._id)}</span>
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">{item.count} জন</span>
              </li>
            )) : <li className="text-stone-500 text-sm italic">পর্যাপ্ত ডেটা নেই</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
