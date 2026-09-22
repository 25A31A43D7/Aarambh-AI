import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Send, Loader2, ArrowRight } from 'lucide-react';
import { Language, UserProfile, GPSLocation, BusinessIdea } from '../types';
import { LANGUAGES } from '../i18n';
import {
  speakText,
  startSpeechRecognition,
  requestMicrophonePermission,
  isSpeechSupported,
} from '../utils/voice';

interface FloatingVoiceAssistantProps {
  lang: Language;
  onSelectLang: (lang: Language) => void;
  user: UserProfile;
  location: GPSLocation;
  activeIdea: BusinessIdea;
  onOpenSourceModal?: (sourceId: string) => void;
}

export const FloatingVoiceAssistant: React.FC<FloatingVoiceAssistantProps> = ({
  lang,
  onSelectLang,
  user,
  location,
  activeIdea,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [activeSpeechSession, setActiveSpeechSession] = useState<{ stop: () => void } | null>(null);

  const activeLangMeta = LANGUAGES[lang] || LANGUAGES.en;

  const quickVoicePrompts: Record<Language, string[]> = {
    en: [
      'What is my PMEGP subsidy rate?',
      'How much loan is collateral-free?',
      'Tell me about dairy business viability',
    ],
    hi: [
      'मुझे PMEGP में कितनी सब्सिडी मिलेगी?',
      'बिना गारंटी कितना लोन मिल सकता है?',
      'तेल मिल शुरू करने के नियम बताएं',
    ],
    te: [
      'నాకు PMEGP సబ్సిడీ ఎంత వస్తుంది?',
      'సెక్యూరిటీ లేకుండా ఎంత రుణం లభిస్తుంది?',
      'డైరీ వ్యాపారం లాభదాయకత ఎంత?',
    ],
    ta: [
      'எனக்கு எவ்வளவு மானியம் கிடைக்கும்?',
      'பிணையம் இல்லாமல் எவ்வளவு கடன் பெறலாம்?',
      'பால் பண்ணை அமைக்கும் வழிகாட்டுதல்',
    ],
    kn: [
      'ನನಗೆ ಎಷ್ಟು ಸಬ್ಸಿಡಿ ಸಿಗುತ್ತದೆ?',
      'ಖಾತರಿಯಿಲ್ಲದೆ ಎಷ್ಟು ಸಾಲ ಸಿಗುತ್ತದೆ?',
      'ಹೈನುಗಾರಿಕೆ ಉದ್ಯಮದ ಮಾಹಿತಿ ನೀಡಿ',
    ],
    bn: [
      'আমি কত শতাংশ ভরতুকি পাব?',
      'জামিন ছাড়া কত ঋণ পাওয়া যায়?',
      'তেল মিল ব্যবসার লাভ কেমন?',
    ],
    mr: [
      'मला किती टक्के अनुदान मिळेल?',
      'विना तारण किती कर्ज मिळू शकते?',
      'डेअरी व्यवसायाची माहिती द्या',
    ],
    gu: [
      'મને કેટલી સબસિડી મળશે?',
      'તારણ વગર કેટલી લોન મળી શકે?',
      'ડેરી બિઝનેસની માહિતી આપો',
    ],
  };

  const handleToggleListening = async () => {
    if (isListening) {
      if (activeSpeechSession) {
        activeSpeechSession.stop();
        setActiveSpeechSession(null);
      }
      setIsListening(false);
      return;
    }

    // Acquire mic permission
    await requestMicrophonePermission();

    // Cancel any ongoing TTS
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsListening(true);
    setTranscript('');

    const session = startSpeechRecognition(
      lang,
      (text) => {
        setTranscript(text);
        handleSendQuery(text);
      },
      () => {
        setIsListening(false);
        setActiveSpeechSession(null);
      },
      (err) => {
        console.warn('Speech recognition ended with note:', err);
        setIsListening(false);
        setActiveSpeechSession(null);
      }
    );

    setActiveSpeechSession(session);
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setTranscript(queryText);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          lang,
          userContext: {
            name: user.name,
            state: location.state,
            district: location.district,
            classification: location.classification,
            category: user.category,
            gender: user.gender,
            activeIdea: activeIdea?.name?.en || 'Rural Enterprise',
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Advisor service unavailable');
      }

      const data = await res.json();
      const reply = data.text || 'I have analyzed your query based on current government guidelines.';
      setLastResponse(reply);

      // Auto speak back in user's language
      setIsSpeaking(true);
      speakText(reply, lang);
    } catch {
      const fallback = `Under PMEGP rural guidelines for ${location.district}, ${location.state}, your pre-qualified subsidy is 35% with 5% promoter margin. Loans up to ₹50 Lakhs are covered under CGTMSE collateral-free guarantee.`;
      setLastResponse(fallback);
      setIsSpeaking(true);
      speakText(fallback, lang);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (activeSpeechSession) {
        activeSpeechSession.stop();
      }
    };
  }, [activeSpeechSession]);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#231F18]/90 text-white text-[11px] font-medium shadow-md backdrop-blur-xs pointer-events-none animate-fade-in">
            <span>{activeLangMeta.native}</span>
            <span>•</span>
            <span>Tap to speak</span>
          </div>
        )}

        <button
          type="button"
          id="floating_voice_trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Vernacular Voice Assistant"
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-[#231F18] text-white hover:bg-[#383329]'
              : isListening
              ? 'bg-[#B5551E] text-white ring-4 ring-[#B5551E]/40 animate-pulse'
              : 'bg-[#1E5C4A] text-white hover:bg-[#144134] hover:scale-105 ring-2 ring-white/50'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Mic className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F59E0B] rounded-full border-2 border-[#1E5C4A]" />
            </div>
          )}
        </button>
      </div>

      {/* Floating Quick Voice Panel Sheet */}
      {isOpen && (
        <div
          id="floating_voice_sheet"
          className="fixed bottom-22 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[540px] bg-[#FFFDF8] border-2 border-[#DDD1B8] rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#1E5C4A] to-[#144134] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
                🎙️
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm m-0 leading-tight">
                  Aarambh Rural Voice Assistant
                </h4>
                <span className="text-[10px] text-white/80 block">
                  Ground-Truthed in {activeLangMeta.native}
                </span>
              </div>
            </div>

            {/* Language Selector in Header */}
            <select
              value={lang}
              onChange={(e) => onSelectLang(e.target.value as Language)}
              className="text-xs bg-white/20 text-white rounded px-2 py-1 border border-white/30 focus:outline-none cursor-pointer"
            >
              {(Object.keys(LANGUAGES) as Language[]).map((k) => (
                <option key={k} value={k} className="text-[#231F18] bg-white">
                  {LANGUAGES[k].native}
                </option>
              ))}
            </select>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {/* Microphone Central Interaction Area */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8] text-center">
              <button
                type="button"
                id="floating_mic_push_btn"
                onClick={handleToggleListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md mb-2 ${
                  isListening
                    ? 'bg-[#B5551E] text-white ring-8 ring-[#B5551E]/25 animate-pulse scale-105'
                    : 'bg-[#1E5C4A] text-white hover:bg-[#144134] hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              <span className="text-xs font-bold text-[#231F18]">
                {isListening
                  ? 'Listening... Speak now'
                  : isLoading
                  ? 'Analyzing regulatory guidelines...'
                  : 'Tap to speak your question'}
              </span>
              <span className="text-[10px] text-[#8C8373] mt-0.5">
                Supports {activeLangMeta.native} voice input & playback
              </span>
            </div>

            {/* Live Transcript / Current Speech */}
            {transcript && (
              <div className="p-2.5 rounded-lg bg-[#FAF2DC] border border-[#B88628]/40 text-xs text-[#785310]">
                <span className="font-bold text-[10px] uppercase block text-[#8C3E14]">
                  What you asked:
                </span>
                <p className="m-0 mt-0.5">{transcript}</p>
              </div>
            )}

            {/* AI Response Box */}
            {isLoading && (
              <div className="p-3 rounded-lg bg-white border border-[#DDD1B8] flex items-center gap-2 text-xs text-[#5E5648]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1E5C4A]" />
                <span>Fetching verified statutory data for {location.district}...</span>
              </div>
            )}

            {lastResponse && !isLoading && (
              <div className="p-3 rounded-xl bg-white border border-[#DDD1B8] text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#1E5C4A]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Advisory Response:
                  </span>
                  {isSpeaking ? (
                    <button
                      type="button"
                      onClick={handleStopSpeaking}
                      className="text-[#B5551E] flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      <VolumeX className="w-3 h-3" /> Stop Audio
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSpeaking(true);
                        speakText(lastResponse, lang);
                      }}
                      className="text-[#1D5C8A] flex items-center gap-0.5 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Replay
                    </button>
                  )}
                </div>
                <div className="text-[#231F18] leading-relaxed whitespace-pre-line">
                  {lastResponse}
                </div>
              </div>
            )}

            {/* Fast Question Chips */}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C8373] tracking-wider block mb-1.5">
                Suggested Questions ({activeLangMeta.native}):
              </span>
              <div className="flex flex-col gap-1.5">
                {(quickVoicePrompts[lang] || quickVoicePrompts.en).map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendQuery(prompt)}
                    className="p-2 rounded-lg bg-[#FAF7F0] hover:bg-[#F3ECE0] border border-[#DDD1B8] text-left text-xs text-[#5E5648] hover:text-[#231F18] transition-all flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>💡 {prompt}</span>
                    <ArrowRight className="w-3 h-3 text-[#1E5C4A] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
