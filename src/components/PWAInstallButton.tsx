import React, { useState } from 'react';
import { Download, Smartphone, Share2, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallButtonProps {
  lang?: Language;
  compact?: boolean;
}

const INSTALL_LABELS: Record<string, string> = {
  en: 'Install App',
  hi: 'ऐप इंस्टॉल करें',
  te: 'యాప్ ఇన్‌స్టాల్',
  ta: 'ஆப் நிறுவவும்',
  kn: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್',
  bn: 'অ্যাপ ইনস্টল',
  mr: 'अॅप स्थापित करा',
  gu: 'એપ ઇન્સ્ટોલ',
};

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang = 'en',
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as an installed PWA standalone app, hide or show installed badge
  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF7F2] border border-[#22C55E]/40 text-[11px] font-semibold text-[#1E5C4A]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
        <span>PWA Installed</span>
      </div>
    );
  }

  const label = INSTALL_LABELS[lang] || INSTALL_LABELS.en;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  // Chromium / Android / Desktop flow with deferred beforeinstallprompt
  if (isInstallable) {
    return (
      <>
        <button
          id="pwa_install_btn"
          type="button"
          onClick={handleInstallClick}
          title="Install Aarambh AI onto your home screen for offline rural access"
          className={`flex items-center gap-1.5 rounded-full font-semibold transition-all cursor-pointer shadow-xs ${
            compact
              ? 'px-2.5 py-1.5 text-xs bg-[#1E5C4A] hover:bg-[#144134] text-white'
              : 'px-3.5 py-2 text-xs bg-[#1E5C4A] hover:bg-[#144134] text-white border border-[#144134]'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-[#FDE68A]" />
          <span>{label}</span>
        </button>

        {justInstalled && (
          <div className="fixed bottom-16 right-4 z-50 bg-[#1E5C4A] text-white px-4 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>Aarambh AI is now installed on your device!</span>
          </div>
        )}
      </>
    );
  }

  // iOS Safari flow (WebKit doesn't trigger beforeinstallprompt)
  if (isIOS) {
    return (
      <>
        <button
          id="pwa_ios_install_btn"
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="Install on iPhone / iPad"
          className={`flex items-center gap-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
            compact
              ? 'px-2.5 py-1.5 text-xs bg-[#FFFDF8] border-[#DDD1B8] text-[#5E5648] hover:border-[#1E5C4A] hover:text-[#1E5C4A]'
              : 'px-3.5 py-2 text-xs bg-[#FFFDF8] border-[#DDD1B8] text-[#5E5648] hover:border-[#1E5C4A] hover:text-[#1E5C4A]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#B5551E]" />
          <span>{label}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#FFFDF8] border border-[#DDD1B8] p-5 shadow-2xl text-[#231F18]">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD1B8]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1E5C4A] text-white flex items-center justify-center text-sm font-bold">
                    🌱
                  </div>
                  <h3 className="font-display text-base font-bold text-[#231F18]">
                    Install on iPhone / iPad
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#8C8373] hover:text-[#231F18] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 space-y-3 text-xs text-[#5E5648] leading-relaxed">
                <p className="font-medium text-[#231F18]">
                  Install <strong>Aarambh AI</strong> on your home screen for quick offline access in rural areas:
                </p>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8]">
                  <Share2 className="w-4 h-4 text-[#1E5C4A] shrink-0 mt-0.5" />
                  <span>
                    1. Tap the <strong>Share</strong> icon in the bottom Safari toolbar.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8]">
                  <Download className="w-4 h-4 text-[#B5551E] shrink-0 mt-0.5" />
                  <span>
                    2. Scroll down and tap <strong>Add to Home Screen</strong> (+).
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8]">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>
                    3. Tap <strong>Add</strong> in the top right corner.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#1E5C4A] hover:bg-[#144134] py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic desktop / browser fallback when beforeinstallprompt has not fired yet or was already dismissed
  return (
    <button
      id="pwa_install_shortcut"
      type="button"
      onClick={() => {
        // Provide friendly instruction if browser hasn't triggered event yet
        alert(
          'To install Aarambh AI on your device:\n\n• On Chrome / Edge: Click the Install icon (⊕) on the right side of the address bar.\n• On Android: Tap Chrome menu (⋮) → "Install app" or "Add to Home Screen".'
        );
      }}
      title="Install Aarambh AI as a Progressive Web App"
      className={`flex items-center gap-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
        compact
          ? 'px-2.5 py-1.5 text-xs bg-[#FFFDF8] border-[#DDD1B8] text-[#5E5648] hover:border-[#1E5C4A] hover:text-[#1E5C4A]'
          : 'px-3 py-1.5 text-xs bg-[#FAF7F0] border-[#DDD1B8] text-[#5E5648] hover:border-[#1E5C4A] hover:text-[#1E5C4A]'
      }`}
    >
      <Download className="w-3.5 h-3.5 text-[#1E5C4A]" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
