import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';

interface OfflineIndicatorProps {
  lang?: Language;
}

const OFFLINE_TEXTS: Record<string, { offlineTitle: string; offlineDesc: string; onlineRestored: string }> = {
  en: {
    offlineTitle: 'Offline Mode Active',
    offlineDesc: 'Dashboard, DPR tools & subsidy calculators are fully functional offline.',
    onlineRestored: 'Internet connection restored. Live cloud sync enabled.',
  },
  hi: {
    offlineTitle: 'ऑफ़लाइन मोड सक्रिय',
    offlineDesc: 'डैशबोर्ड, डीपीआर और सब्सिडी कैलकुलेटर बिना इंटरनेट के भी पूरी तरह चालू हैं।',
    onlineRestored: 'इंटरनेट कनेक्शन पुनः स्थापित हो गया है।',
  },
  te: {
    offlineTitle: 'ఆఫ్‌లైన్ మోడ్ యాక్టివ్',
    offlineDesc: 'ఇంటర్నెట్ లేకుండా డ్యాష్‌బోర్డ్ మరియు లోన్ కాలిక్యులేటర్లు పూర్తిగా పనిచేస్తాయి.',
    onlineRestored: 'ఇంటర్నెట్ కనెక్షన్ పునరుద్ధరించబడింది.',
  },
  ta: {
    offlineTitle: 'ஆஃப்லைன் முறை செயலில் உள்ளது',
    offlineDesc: 'இணையம் இன்றி முதன்மை டாஷ்போர்டு மற்றும் கால்குலேட்டர் இயங்குகிறது.',
    onlineRestored: 'இணைய இணைப்பு மீண்டும் கிடைத்தது.',
  },
  kn: {
    offlineTitle: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
    offlineDesc: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.',
    onlineRestored: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ.',
  },
  bn: {
    offlineTitle: 'অফলাইন মোড সক্রিয়',
    offlineDesc: 'ইন্টারনেট ছাড়াই ড্যাশবোর্ড ও ক্যালকুলেটর সম্পূর্ণ সচল রয়েছে।',
    onlineRestored: 'ইন্টারনেট সংযোগ পুনরুদ্ধার করা হয়েছে।',
  },
  mr: {
    offlineTitle: 'ऑफलाइन मोड सुरू आहे',
    offlineDesc: 'डॅशबोर्ड आणि कॅल्क्युलेटर इंटरनेटशिवाय सुरळीत चालू आहेत.',
    onlineRestored: 'इंटरनेट कनेक्टिव्हिटी पूर्ववत झाली आहे.',
  },
  gu: {
    offlineTitle: 'ઑફલાઇન મોડ સક્રિય',
    offlineDesc: 'ઇન્ટરનેટ વિના ડેશબોર્ડ અને કેલ્ક્યુલેટર સંપૂર્ણ રીતે કાર્યરત છે.',
    onlineRestored: 'ઇન્ટરનેટ કનેક્શન પુનઃસ્થાપિત થયું છે.',
  },
};

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang = 'en' }) => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const texts = OFFLINE_TEXTS[lang] || OFFLINE_TEXTS.en;

  if (showRestoredNotice && isOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1E5C4A] text-white text-xs font-semibold shadow-xl border border-[#22C55E]/40 animate-in fade-in slide-in-from-bottom-2">
        <Wifi className="w-4 h-4 text-[#34D399]" />
        <span>{texts.onlineRestored}</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#92400E] text-white text-xs shadow-2xl border border-[#F59E0B]/50 animate-in fade-in slide-in-from-bottom-2 max-w-md">
      <div className="w-8 h-8 rounded-xl bg-[#B45309] flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4 text-[#FDE68A] animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#FDE68A] flex items-center gap-1.5">
          <span>{texts.offlineTitle}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
        </div>
        <p className="text-white/90 text-[11px] leading-tight mt-0.5">
          {texts.offlineDesc}
        </p>
      </div>
    </div>
  );
};
