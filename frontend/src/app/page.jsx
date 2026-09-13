import Link from 'next/link';
import pandalsData from '../../public/data/pandals.json';

export default function Home() {
  const top10 = pandalsData
    .filter(p => typeof p.rank === 'number')
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-8 md:p-16 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Bardhaman Durga Puja 2026 Pandal Guide
        </h1>
        
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          Welcome to the ultimate digital guide for Durga Puja Parikrama. 
          Find and plan the best Durga Puja pandal route in Bardhaman. 
          Free to use, requires no login, and provides optimized offline-capable route planning to make your festival experience seamless.
        </p>
        
        <div className="pt-4 pb-8">
          <Link 
            href="/planner" 
            className="inline-block bg-[#dc2626] hover:bg-red-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg transition-colors"
          >
            Open Planner
          </Link>
        </div>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Top 10 Must-Visit Pandals
          </h2>
          <ul className="space-y-4">
            {top10.map((p, index) => (
              <li key={p.id} className="flex items-start">
                <span className="font-bold text-red-600 mr-4 w-6">{index + 1}.</span>
                <div>
                  <span className="font-bold text-lg">{p.name_bn}</span>
                  <span className="text-gray-600 ml-2">({p.name_en})</span>
                  {p.zone && (
                    <span className="block text-sm text-gray-500 mt-1">{p.zone} Zone</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
