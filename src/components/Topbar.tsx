import React, { useState } from 'react';
import { Menu, Volume2, MapPin, RefreshCw, Mic, Check } from 'lucide-react';
import { GPSLocation, Language } from '../types';
import { getTranslation } from '../i18n';
import { NAV_ITEMS } from './Sidebar';
import { requestMicrophonePermission } from '../utils/voice';

interface TopbarProps {
  currentView: string;
  lang: Language;
  location: GPSLocation;
  isTracking: boolean;
  onToggleTracking: () => void;
  onOpenSidebar: () => void;
  onReadAloud: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentView,
  lang,
  location,
  isTracking,
  onToggleTracking,
  onOpenSidebar,
  onReadAloud,
}) => {
  const [micGranted, setMicGranted] = useState<boolean>(false);
  const activeNav = NAV_ITEMS.find((n) => n.id === currentView);
  const title = activeNav ? getTranslation(activeNav.labelKey, lang) : 'Aarambh AI';

  const handleGrantMic = async () => {
    const granted = await requestMicrophonePermission();
    setMicGranted(granted);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 md:px-8 py-2.5 bg-[#FFFDF8] border-b border-[#DDD1B8] shadow-xs">
      <div className="flex items-center gap-2.5">
        <button
          id="mobile_menu_btn"
          className="md:hidden p-2 text-[#5E5648] hover:text-[#231F18] rounded-lg hover:bg-[#F3ECE0]"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-display text-base md:text-xl font-bold text-[#231F18] m-0">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Microphone Permission Button */}
        <button
          id="topbar_mic_permission_btn"
          onClick={handleGrantMic}
          title={micGranted ? 'Microphone active' : 'Click to grant microphone access for voice queries'}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
            micGranted
              ? 'bg-[#EBF7F2] border-[#22C55E] text-[#1E5C4A]'
              : 'bg-[#FFFDF8] border-[#DDD1B8] text-[#5E5648] hover:border-[#B5551E] hover:text-[#B5551E]'
          }`}
        >
          {micGranted ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="hidden sm:inline">Mic Active</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-[#B5551E]" />
              <span className="hidden sm:inline">Allow Mic</span>
            </>
          )}
        </button>

        {/* Live GPS Location Pill */}
        <button
          id="gps_location_pill"
          onClick={onToggleTracking}
          title="Click to detect or refresh live GPS location"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F3ECE0] border border-[#DDD1B8] text-xs font-medium text-[#5E5648] hover:border-[#B88628] hover:bg-[#FAF2DC] transition-all cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isTracking ? 'bg-[#10B981] pulse-dot' : 'bg-[#B88628]'
            }`}
          />
          <MapPin className="w-3.5 h-3.5 text-[#B5551E]" />
          <span className="max-w-[110px] sm:max-w-[180px] md:max-w-[220px] truncate">
            <strong className="text-[#231F18]">{location.village || location.district}</strong>{' '}
            <span className="text-[10px] uppercase font-bold text-[#1E5C4A]">
              ({getTranslation(location.classification, lang)})
            </span>
          </span>
          <RefreshCw className={`w-3 h-3 text-[#8C8373] hover:text-[#231F18] ${isTracking ? 'animate-spin' : ''}`} />
        </button>

        {/* Read Aloud Accessible Voice Button */}
        <button
          id="read_aloud_btn"
          onClick={onReadAloud}
          title="Listen to this page in your language"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#DDD1B8] bg-[#FFFDF8] hover:bg-[#F3ECE0] text-xs font-semibold text-[#5E5648] transition-all"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#B5551E]" />
          <span className="hidden md:inline">{getTranslation('read_aloud', lang)}</span>
        </button>
      </div>
    </header>
  );
};
