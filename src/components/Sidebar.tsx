import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Compass,
  Lightbulb,
  Wallet,
  MapPin,
  BotMessageSquare,
  Calculator,
  SlidersHorizontal,
  Landmark,
  FileSpreadsheet,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';
import { Language, UserProfile, GPSLocation } from '../types';
import { LANGUAGES, getTranslation } from '../i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  user: UserProfile;
  location: GPSLocation;
  readinessScore: number;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export interface NavItemConfig {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Enterprise Journey',
    items: [
      { id: 'dashboard', labelKey: 'nav_dashboard', icon: LayoutDashboard },
      { id: 'profile', labelKey: 'nav_profile', icon: UserCheck },
      { id: 'modeA', labelKey: 'nav_modeA', icon: Compass },
      { id: 'modeB', labelKey: 'nav_modeB', icon: Lightbulb },
    ],
  },
  {
    title: 'Financial & Banking',
    items: [
      { id: 'capital', labelKey: 'nav_capital', icon: Wallet },
      { id: 'calc', labelKey: 'nav_calc', icon: Calculator, badge: 'Eligibility', badgeColor: 'bg-[#E5F0EB] text-[#1E5C4A]' },
      { id: 'sim', labelKey: 'nav_sim', icon: SlidersHorizontal },
      { id: 'schemes', labelKey: 'nav_schemes', icon: Landmark, badge: 'PMEGP', badgeColor: 'bg-[#FAF2DC] text-[#785310]' },
      { id: 'reports', labelKey: 'nav_reports', icon: FileSpreadsheet, badge: 'PDF', badgeColor: 'bg-[#FFF2EB] text-[#8C3E14]' },
    ],
  },
  {
    title: 'Local Grounding & AI',
    items: [
      { id: 'local', labelKey: 'nav_local', icon: MapPin, badge: 'Banks', badgeColor: 'bg-[#E8F2F9] text-[#1D5C8A]' },
      { id: 'advisor', labelKey: 'nav_advisor', icon: BotMessageSquare, badge: 'Voice', badgeColor: 'bg-[#E5F0EB] text-[#1E5C4A]' },
      { id: 'sources', labelKey: 'nav_sources', icon: ShieldCheck },
    ],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  lang,
  onSelectLang,
  user,
  location,
  readinessScore,
  isOpen,
  onClose,
  onLogout,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        id="app_sidebar"
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-[#F3ECE0] border-r border-[#DDD1B8] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#DDD1B8] bg-[#FFFDF8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8] shadow-2xs">🌱</span>
              <div>
                <span className="font-display text-lg font-bold text-[#8C3E14] tracking-tight block">
                  {getTranslation('app_name', lang)}
                </span>
                <span className="block text-[10px] text-[#5E5648] font-medium leading-tight">
                  आरंभ — {getTranslation('tagline', lang)}
                </span>
              </div>
            </div>
            <button
              className="md:hidden text-[#5E5648] hover:text-[#231F18] p-1 cursor-pointer"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Section Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="px-2 text-[10px] uppercase font-bold text-[#8C8373] tracking-wider block">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav_btn_${item.id}`}
                      onClick={() => {
                        onSelectView(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#FFFDF8] text-[#8C3E14] font-semibold shadow-xs border-l-3 border-[#B5551E]'
                          : 'text-[#5E5648] hover:bg-[#B5551E]/10 hover:text-[#231F18]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#B5551E]' : 'text-[#8C8373]'}`} />
                        <span className="truncate">{getTranslation(item.labelKey, lang)}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.badgeColor || 'bg-[#FAF7F0] text-[#5E5648]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Language switch & User Pill */}
        <div className="p-3 border-t border-[#DDD1B8] bg-[#EAE0CE]/50 space-y-2">
          {/* 8 Language Switcher */}
          <div>
            <div className="text-[11px] font-semibold text-[#5E5648] mb-1.5 px-1 uppercase tracking-wider">
              Language / भाषा
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(Object.keys(LANGUAGES) as Language[]).map((l) => (
                <button
                  key={l}
                  id={`lang_btn_${l}`}
                  onClick={() => onSelectLang(l)}
                  className={`py-1 text-xs font-semibold rounded border transition-all ${
                    lang === l
                      ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]'
                      : 'bg-[#FFFDF8] text-[#5E5648] border-[#DDD1B8] hover:border-[#1E5C4A]'
                  }`}
                >
                  {LANGUAGES[l].native}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile Summary */}
          <div
            id="user_profile_chip"
            onClick={() => {
              onSelectView('profile');
              onClose();
            }}
            className="flex items-center gap-2 p-2 rounded-lg bg-[#FFFDF8] border border-[#DDD1B8] cursor-pointer hover:border-[#B5551E] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#B5551E] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#231F18] truncate">{user.name}</div>
              <div className="text-[10px] text-[#5E5648] truncate">
                {user.townCity || location.village}, {location.district}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase block font-semibold text-[#8C8373]">Readiness</span>
              <span className="text-xs font-bold text-[#1E5C4A]">{readinessScore}%</span>
            </div>
          </div>

          {/* In-App Install Button for Mobile Drawer */}
          <div className="flex justify-center">
            <PWAInstallButton lang={lang} />
          </div>

          {/* Logout */}
          <button
            id="logout_btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-[#8C3E14] font-semibold rounded hover:bg-[#B5551E]/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            {getTranslation('nav_logout', lang)}
          </button>
        </div>
      </aside>
    </>
  );
};
