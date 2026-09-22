import React from 'react';
import { Navigation, X } from 'lucide-react';

export default function PandalListModal({
  isOpen,
  onClose,
  pandals,
  lang,
  onRemove,
  onClearAll,
  onNavigate
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[85vh] rounded-2xl bg-white flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {lang === 'en' ? 'Tour Itinerary' : 'পরিক্রমার তালিকা'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pandals.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {lang === 'en' ? 'No pandals added yet.' : 'কোন মণ্ডপ যোগ করা হয়নি।'}
            </div>
          ) : (
            pandals.map((pandal, idx) => {
              const name = lang === 'en' ? (pandal.name_en || pandal.name) : (pandal.name_bn || pandal.name || pandal.name_en);
              return (
                <div key={pandal.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate text-sm">{name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onNavigate(pandal)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
                      aria-label="Navigate"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onRemove(pandal.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-700 text-gray-600"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <button 
            onClick={onClearAll}
            className="px-4 py-2 rounded-xl text-sm font-bold border border-red-200 text-red-700 hover:bg-red-50"
          >
            {lang === 'en' ? 'Clear all' : 'সব মুছুন'}
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold bg-red-700 text-white hover:bg-red-800"
          >
            {lang === 'en' ? 'Done' : 'সম্পূর্ণ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
