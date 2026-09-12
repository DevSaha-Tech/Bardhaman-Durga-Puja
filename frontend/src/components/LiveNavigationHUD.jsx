import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowUp, ArrowLeft, ArrowRight, CornerUpLeft, CornerUpRight, MapPin, X, FastForward, CheckCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CheckInModal from './CheckInModal';
import { safeStorage } from '@/utils/storage';

// Map icon strings from navigationEngine to actual lucide components
const IconMap = {
  ArrowUp: ArrowUp,
  ArrowLeft: ArrowLeft,
  ArrowRight: ArrowRight,
  CornerUpLeft: CornerUpLeft,
  CornerUpRight: CornerUpRight,
  MapPin: MapPin,
};

export default function LiveNavigationHUD({ navState, totalStops }) {
  const { 
    activePandal, 
    currentManeuver, 
    distanceToTarget, 
    currentStopIndex, 
    isVoiceMuted, 
    setIsVoiceMuted, 
    isSpeaking,
    endTour, 
    skipToNext 
  } = navState;
  
  const { lang, t } = useLanguage();
  const [modalDismissedFor, setModalDismissedFor] = useState(null);

  if (!activePandal) return null;

  const isArrived = distanceToTarget !== null && distanceToTarget <= 75;
  
  // Show modal if arrived, haven't dismissed it for this pandal, and haven't checked in recently
  const hasCheckedIn = safeStorage.get(`last_checkin_${activePandal.id}`) !== null;
  const showModal = isArrived && modalDismissedFor !== activePandal.id && !hasCheckedIn;

  // Resolve icon component
  const ManeuverIcon = currentManeuver && IconMap[currentManeuver.icon] ? IconMap[currentManeuver.icon] : ArrowUp;

  // Auto-mute when checked in to prevent spamming instructions while user is inside pandal
  React.useEffect(() => {
    if (hasCheckedIn && !isVoiceMuted) {
      setIsVoiceMuted(true);
    }
  }, [hasCheckedIn, isVoiceMuted, setIsVoiceMuted]);

  return (
    <>
      {showModal && (
        <CheckInModal 
          pandal={activePandal} 
          onDismiss={() => {
            setModalDismissedFor(activePandal.id);
          }} 
        />
      )}
      {/* Top Banner - Turn Instruction */}
      <div className="absolute top-4 left-4 right-4 z-[999] flex justify-center pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-md shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-4 w-full max-w-md pointer-events-auto border border-gray-700">
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${isArrived ? 'bg-green-500' : 'bg-red-600'}`}>
              {isArrived ? <CheckCircle className="w-8 h-8 text-white" /> : <ManeuverIcon className="w-8 h-8 text-white" />}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold text-xs">
                {currentManeuver?.distance ? `${currentManeuver.distance} ${t('meters_after')}` : ''}
              </span>
              <span className="text-white font-bold text-lg leading-tight">
                {currentManeuver?.text || t('straight')}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isSpeaking && !isVoiceMuted ? 'bg-amber-500 text-white animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-gray-800 text-gray-300 hover:text-white'}`}
          >
            {isVoiceMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bottom Drawer - Tour Status */}
      <div className="absolute bottom-4 left-4 right-4 z-[999] flex justify-center pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl shadow-gray-900/20 rounded-[2rem] p-5 w-full max-w-md pointer-events-auto border border-gray-200">
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <span className="text-red-700 font-bold text-xs uppercase tracking-wider mb-1">
                {t('stop')} {currentStopIndex + 1} / {totalStops}
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {lang === 'en' ? activePandal.name_en || activePandal.name : activePandal.name_bn || activePandal.name}
              </h2>
              {hasCheckedIn && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-fit">
                  <CheckCircle className="w-3 h-3" /> {lang === 'en' ? 'Check-in Complete' : 'দর্শন সম্পন্ন'}
                </span>
              )}
              <span className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {activePandal.zone}
              </span>
            </div>
            <div className="text-right">
               <span className="block text-2xl font-bold text-gray-900">
                 {distanceToTarget !== null ? (distanceToTarget > 1000 ? (distanceToTarget/1000).toFixed(1) + 'km' : distanceToTarget + 'm') : '--'}
               </span>
               <span className="block text-xs font-semibold text-gray-500">{t('distance')}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
             <div 
               className="h-full bg-red-600 rounded-full transition-all duration-500"
               style={{ width: `${((currentStopIndex) / totalStops) * 100}%` }}
             ></div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={endTour}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-5 h-5" /> {t('end')}
            </button>
            {hasCheckedIn ? (
              <button 
                onClick={() => {
                  setIsVoiceMuted(false);
                  skipToNext();
                }}
                className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
              >
                {currentStopIndex === totalStops - 1 ? (lang === 'en' ? 'Tour Complete' : 'সফর শেষ') : (lang === 'en' ? 'Next Pandal ➔' : 'পরবর্তী মণ্ডপে চলুন ➔')}
              </button>
            ) : (
              <button 
                onClick={skipToNext}
                className="flex-[2] py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02]"
              >
                {currentStopIndex === totalStops - 1 ? t('tour_complete') : t('skip')} <FastForward className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${activePandal.lat},${activePandal.lng}`, '_blank')}
            className="w-full mt-3 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Google Maps-এ চলুন <ExternalLink className="w-4 h-4" />
          </button>

        </div>
      </div>
    </>
  );
}
