"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin, Play, Navigation, X, AlertCircle,
  Footprints, Bike, Car, Trophy, Star, Timer, Infinity as InfinityIcon,
  Clock, Eye, Ruler, Flag, ChevronRight, Zap, Moon, Flame
} from 'lucide-react';
import {
  solveTsp, filterTopN, solveBudget, calcItinerary,
  formatDuration, TRANSPORT_MODES
} from '../utils/tspSolver';
import { generateGoogleMapsUrl } from '../utils/navigationUrl';
import { useLiveNavigator } from '../hooks/useLiveNavigator';
import LiveNavigationHUD from './LiveNavigationHUD';
import { useLanguage } from '@/context/LanguageContext';

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-100 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <MapPin className="w-8 h-8 text-amber-400 animate-bounce" />
        <span className="text-amber-700 font-medium">ম্যাপ লোড হচ্ছে...</span>
      </div>
    </div>
  )
});

// Origin (Dummy / Live GPS fallback)
const liveCenter = { lat: 23.6183691, lng: 88.1185789 };

// --- Transport Mode pills ---
const TRANSPORT_PILLS = [
  { key: 'walking', Icon: Footprints, label: 'হাঁটা',  labelEn: 'Walk'  },
  { key: 'cycling', Icon: Bike,       label: 'বাইক',   labelEn: 'Bike'  },
  { key: 'driving', Icon: Car,        label: 'গাড়ি',   labelEn: 'Car'   },
];

const TOP_N_OPTIONS = [
  { n: 5,    Icon: Trophy, label: 'Top 5'  },
  { n: 10,   Icon: Star,   label: 'Top 10' },
  { n: null, Icon: Flag,   label: lang => lang === 'en' ? 'All' : 'সব' },
];

const BUDGET_OPTIONS = [
  { minutes: 120,  Icon: Zap,          label: '২ ঘণ্টা', labelEn: '2 hr'     },
  { minutes: 240,  Icon: Timer,        label: '৪ ঘণ্টা', labelEn: '4 hr'     },
  { minutes: 360,  Icon: Moon,         label: '৬ ঘণ্টা', labelEn: '6 hr'     },
  { minutes: null, Icon: InfinityIcon, label: 'যতখুশি', labelEn: 'Flexible' },
];

// Arrival time helper
function getArrivalTime(addMin, lang) {
  const d = new Date(Date.now() + addMin * 60000);
  return d.toLocaleTimeString(lang === 'en' ? 'en-IN' : 'bn-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

export default function PlannerSection() {
  const { lang, t } = useLanguage();
  const [pandalsData, setPandalsData] = useState([]);

  // UI State
  const [plannerTab,    setPlannerTab]    = useState('top');
  const [topN,          setTopN]          = useState(5);
  const [budgetMin,     setBudgetMin]     = useState(240);
  const [transportMode, setTransportMode] = useState('walking');
  const [manualPandals, setManualPandals] = useState([]);

  // Fetch data
  useEffect(() => {
    fetch('/data/pandals.json')
      .then(r => r.json())
      .then(d => setPandalsData(d))
      .catch(err => console.error('Error loading pandals:', err));
  }, []);

  // Compute route based on selected mode
  const { optimizedRoute, stats, trimMessage } = useMemo(() => {
    if (pandalsData.length === 0) return { optimizedRoute: [], stats: null, trimMessage: null };

    const END_NODE = { id: 'END', name: 'Return to Start', name_bn: 'শুরুর স্থান', name_en: 'Return to Start', zone: 'Destination', lat: liveCenter.lat, lng: liveCenter.lng };

    const buildRoute = (pandals) => {
      if (pandals.length === 0) return { optimizedRoute: [], stats: null, trimMessage: null };
      const nodes  = [{ id: '__START__', ...liveCenter }, ...pandals];
      const solved = solveTsp(nodes, transportMode).filter(p => p.id !== '__START__');
      const itin   = calcItinerary(liveCenter, solved, transportMode);
      return { optimizedRoute: [...solved, END_NODE], stats: itin, trimMessage: null };
    };

    if (plannerTab === 'top') {
      return buildRoute(filterTopN(pandalsData, topN));
    }

    if (plannerTab === 'budget') {
      if (!budgetMin) return buildRoute([...pandalsData].sort((a, b) => (a.popularity ?? 99) - (b.popularity ?? 99)));
      const { selected, stats: itin, trimmedCount } = solveBudget(liveCenter, pandalsData, budgetMin, transportMode);
      const bLabel = BUDGET_OPTIONS.find(b => b.minutes === budgetMin);
      const trimMsg = trimmedCount > 0 ? `আপনার ${bLabel?.label ?? ''} বাজেটে সেরা ${selected.length}টি মণ্ডপ নির্বাচিত` : null;
      return { optimizedRoute: selected.length > 0 ? [...selected, END_NODE] : [], stats: itin, trimMessage: trimMsg };
    }

    // manual
    return buildRoute(manualPandals);
  }, [pandalsData, plannerTab, topN, budgetMin, transportMode, manualPandals]);

  // Live Navigator
  const liveNavState = useLiveNavigator(optimizedRoute, lang, t);

  // Handlers
  const handleAddPandal = (pandal) => {
    setPlannerTab('manual');
    if (!manualPandals.some(p => p.id === pandal.id))
      setManualPandals(prev => [...prev, pandal]);
  };

  const handleRemovePandal = (id) => setManualPandals(prev => prev.filter(p => p.id !== id));

  const handleSingleDirection = (pandal) => {
    const mode = transportMode === 'driving' ? 'driving' : transportMode === 'cycling' ? 'bicycling' : 'walking';
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${liveCenter.lat},${liveCenter.lng}&destination=${pandal.lat},${pandal.lng}&travelmode=${mode}`, '_blank');
  };

  const pName = (p) => lang === 'en' ? (p.name_en || p.name) : (p.name_bn || p.name);

  return (
    <section className="relative h-full w-full bg-stone-100 overflow-hidden">

      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <MapView
          pandalsData={pandalsData}
          selectedRoute={optimizedRoute}
          onAddPandal={handleAddPandal}
          isRouteMode={plannerTab === 'manual'}
          isNavigating={liveNavState.isNavigating}
          userLocation={liveNavState.userLocation}
          routeData={liveNavState.routeData}
          activePandal={liveNavState.activePandal}
        />
        {liveNavState.isNavigating && (
          <LiveNavigationHUD navState={liveNavState} totalStops={optimizedRoute.length} />
        )}
      </div>

      {/* PLANNER DRAWER */}
      {!liveNavState.isNavigating && (
        <div className="absolute bottom-0 left-0 right-0 md:relative md:w-[420px] h-[68vh] md:h-full bg-white/97 backdrop-blur-2xl shadow-[0_-12px_48px_rgba(0,0,0,0.12)] z-10 flex flex-col rounded-t-[2rem] md:rounded-none">

          {/* Mobile drag handle */}
          <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2 space-y-4">

            {/* Header */}
            <div>
              <h2 className="text-2xl font-extrabold text-red-900 leading-tight">{t('route_builder')}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{t('select_pandals')}</p>
            </div>

            {/* Transport Mode Selector */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('transport_mode')}</p>
              <div className="flex gap-2">
                {TRANSPORT_PILLS.map(({ key, Icon, label, labelEn }) => (
                  <button
                    key={key}
                    onClick={() => setTransportMode(key)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      transportMode === key
                        ? 'bg-red-700 text-white shadow-md shadow-red-200'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-red-200 hover:text-red-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    {lang === 'en' ? labelEn : label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Mode Tabs */}
            <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
              {[
                { id: 'top',    label: lang === 'en' ? 'Top Picks' : 'সেরা মণ্ডপ' },
                { id: 'budget', label: lang === 'en' ? 'Time Budget' : 'সময় অনুযায়ী' },
                { id: 'manual', label: lang === 'en' ? 'Custom' : 'নিজে বাছুন' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPlannerTab(tab.id)}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                    plannerTab === tab.id
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TOP-N Controls */}
            {plannerTab === 'top' && (
              <div className="flex gap-2">
                {TOP_N_OPTIONS.map(({ n, Icon, label }) => (
                  <button
                    key={String(n)}
                    onClick={() => setTopN(n)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      topN === n
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {typeof label === 'function' ? label(lang) : label}
                  </button>
                ))}
              </div>
            )}

            {/* BUDGET Controls */}
            {plannerTab === 'budget' && (
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map(({ minutes, Icon, label, labelEn }) => (
                  <button
                    key={String(minutes)}
                    onClick={() => setBudgetMin(minutes)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                      budgetMin === minutes
                        ? 'bg-red-700 text-white shadow-md shadow-red-200'
                        : 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {lang === 'en' ? labelEn : label}
                  </button>
                ))}
              </div>
            )}

            {/* Trim Badge */}
            {trimMessage && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                {trimMessage}
              </div>
            )}

            {/* ETA Glassmorphic Card */}
            {stats && (
              <div className="bg-white/90 backdrop-blur-md shadow-lg border border-amber-200/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">মোট সময়</span>
                  <span className="text-2xl font-extrabold text-red-800">{formatDuration(stats.totalMin, lang)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-blue-50 rounded-xl p-2 text-center">
                    <Clock className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                    <p className="text-[10px] text-blue-400 font-semibold">রাস্তার সময়</p>
                    <p className="text-sm font-bold text-blue-700">{formatDuration(stats.totalTravelMin, lang)}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2 text-center">
                    <Eye className="w-3.5 h-3.5 text-green-400 mx-auto mb-1" />
                    <p className="text-[10px] text-green-400 font-semibold">ঠাকুর দেখা</p>
                    <p className="text-sm font-bold text-green-700">{formatDuration(stats.totalDwellMin, lang)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-2 text-center">
                    <Ruler className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                    <p className="text-[10px] text-purple-400 font-semibold">মোট দূরত্ব</p>
                    <p className="text-sm font-bold text-purple-700">{stats.totalDistKm} কিমি</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Itinerary */}
            {stats?.legs?.length > 0 && (
              <div className="space-y-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">পরিক্রমার তালিকা</p>
                {stats.legs.map((leg, idx) => (
                  <div key={leg.pandal.id ?? idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow">{idx + 1}</div>
                      {idx < stats.legs.length - 1 && <div className="w-0.5 flex-1 bg-red-100 my-1 min-h-[12px]" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-tight">{pName(leg.pandal)}</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">{leg.pandal.zone}</p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-[11px] font-bold text-red-700">{getArrivalTime(leg.cumMinutes - leg.dwellMin, lang)}</p>
                          <p className="text-[10px] text-gray-400">{leg.travelMin} মিনিট</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-lg px-2 py-0.5 font-semibold flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" />{leg.dwellMin} মিনিট
                        </span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2 py-0.5 font-semibold flex items-center gap-1">
                          <Ruler className="w-2.5 h-2.5" />{leg.distKm} কিমি
                        </span>
                        <button onClick={() => handleSingleDirection(leg.pandal)} className="ml-auto p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Navigation className="w-3 h-3" />
                        </button>
                        {plannerTab === 'manual' && (
                          <button onClick={() => handleRemovePandal(leg.pandal.id)} className="p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* End node */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center shrink-0">
                    <Flag className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 flex items-center">
                    <span className="text-sm font-bold text-gray-400">শুরুর স্থানে ফিরুন</span>
                  </div>
                </div>
              </div>
            )}

            {/* Manual mode empty state */}
            {plannerTab === 'manual' && manualPandals.length === 0 && (
              <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3 opacity-50" />
                <p className="text-gray-500 font-medium text-sm">ম্যাপ থেকে মণ্ডপে ট্যাপ করুন</p>
              </div>
            )}

            {/* Start Button */}
            {optimizedRoute.length > 0 && (
              <button
                onClick={liveNavState.startTour}
                className="w-full py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-5 h-5 fill-white" />
                {t('start_tour')} &middot; {optimizedRoute.length - 1} {lang === 'en' ? 'stops' : 'মণ্ডপ'}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
