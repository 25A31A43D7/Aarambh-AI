import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { ChatMessage, Language, UserProfile, GPSLocation } from '../../types';
import { queryRAGAdvisor } from '../../data/knowledge';
import { speakText, startSpeechRecognition, requestMicrophonePermission } from '../../utils/voice';
import { getTranslation } from '../../i18n';

interface AdvisorViewProps {
  lang: Language;
  user: UserProfile;
  location: GPSLocation;
  onOpenSourceModal: (chunkId: string) => void;
}

const WELCOME_MESSAGES: Record<Language, (name: string) => string> = {
  en: (name) => `Namaste ${name}! I am Aarambh Sathi (आरंभ साथी), your AI rural enterprise and credit advisor. Grounded in official RBI, KVIC, NABARD, and MSME circulars. Ask me anything about subsidies, loans, moratoriums, or permits in your language.`,
  hi: (name) => `नमस्ते ${name}! मैं आरंभ साथी हूँ — आपका ग्रामीण व्यापार और ऋण सलाहकार। आरबीआई, केवीआईसी और नाबार्ड के आधिकारिक नियमों के आधार पर सटीक जानकारी प्राप्त करें। सब्सिडी, बैंक लोन, मोराटोरियम या किसी भी योजना के बारे में पूछें।`,
  te: (name) => `నమస్కారం ${name}! నేను ఆరంభ్ సాథి — మీ గ్రామీణ వ్యాపార మరియు బ్యాంక్ రుణ సలహాదారుని. RBI, KVIC మరియు నాబార్డ్ నిబంధనల ప్రకారం సబ్సిడీలు, లోన్లు, మారటోరియం గురించి మీ భాషలోనే నేరుగా అడగండి.`,
  ta: (name) => `வணக்கம் ${name}! நான் ஆரம்ப சாதி — உங்கள் கிராமப்புற வணிக மற்றும் கடன் ஆலோசகர். RBI, KVIC மற்றும் நபார்டு அதிகாரப்பூர்வ விதிமுறைகளின்படி அரசு மானியங்கள், கடன்கள் மற்றும் அனுமதி பற்றி கேளுங்கள்.`,
  kn: (name) => `ನಮಸ್ಕಾರ ${name}! ನಾನು ಆರಂಭ ಸಾಥಿ — ನಿಮ್ಮ ಗ್ರಾಮೀಣ ವ್ಯಾಪಾರ ಮತ್ತು ಸಾಲ ಸಲಹೆಗಾರ. RBI, KVIC ಮತ್ತು ನಬಾರ್ಡ್ ನಿಯಮಗಳ ಆಧಾರದಲ್ಲಿ ಸಬ್ಸಿಡಿ, ಸಾಲ, ಮೊರಟೋರಿಯಂ ಬಗ್ಗೆ ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ.`,
  bn: (name) => `নমস্কার ${name}! আমি আরম্ভ সাথী — আপনার গ্রামীণ ব্যবসা ও ঋণ উপদেষ্টা। আরবিআই, কেভিআইসি ও নাবার্ডের নিয়মানুযায়ী সরকারি ভর্তুকি, ঋণ ও সুযোগ-সুবিধা সম্পর্কে প্রশ্ন করুন।`,
  mr: (name) => `नमस्ते ${name}! मी आरंभ साथी — आपला ग्रामीण उद्योग व बँक कर्ज सल्लागार. आरबीआय, केव्हीआयसी आणि नाबार्डच्या शासकीय नियमांनुसार सबसिडी, कर्ज व मोरेटोरियमबद्दल थेट विचारा.`,
  gu: (name) => `નમસ્તે ${name}! હું આરંભ સાથી છું — આપનો ગ્રામીણ વ્યવસાય અને લોન સલાહકાર. RBI, KVIC અને નાબાર્ડના નિયમો અનુસાર સબસિડી, લોન અને મોરેટોરિયમ વિશે આપની ભાષામાં પ્રશ્ન પૂછો.`,
};

const PROMPTS_BY_LANG: Record<Language, string[]> = {
  en: [
    'How do I get 35% PMEGP subsidy in my village?',
    'What is the loan moratorium grace period for machinery?',
    'Can banks ask for land collateral for ₹10 Lakh loan?',
    'What are NABARD model costs for a 2-cow dairy farm?',
    'What are the basic FSSAI rules for a spice mill?',
  ],
  hi: [
    'गाँव में 35% PMEGP सब्सिडी कैसे मिलेगी?',
    'मशीनरी के लिए बैंक मोराटोरियम (छूट) कितने महीने मिलती है?',
    'क्या ₹10 लाख के लोन पर बैंक ज़मीन गिरवी मांग सकता है?',
    '2 गाय की डेयरी फार्म में नाबार्ड के अनुसार कितनी लागत आती है?',
    'मसाला चक्की के लिए FSSAI और बिजली के क्या नियम हैं?',
  ],
  te: [
    'గ్రామంలో 35% PMEGP సబ్సిడీ ఎలా పొందాలి?',
    'యంత్రాల కొనుగోలుకు బ్యాంకు మొరటోరియం గడువు ఎంత?',
    '₹10 లక్షల లోన్ కోసం బ్యాంకులు భూమి తాకట్టు అడగవచ్చా?',
    '2 ఆవుల డెయిరీ ఫామ్‌కు నాబార్డ్ ప్రకారం ఎంత ఖర్చవుతుంది?',
    'మసాలా మిల్లుకు అవసరమైన FSSAI నిబంధనలు ఏమిటి?',
  ],
  ta: [
    'கிராமத்தில் 35% PMEGP மானியம் பெறுவது எப்படி?',
    'இயந்திர கடனுக்கு அவகாச காலம் (Moratorium) எவ்வளவு?',
    '₹10 லட்சம் கடனுக்கு நில அடமானம் தேவையா?',
    '2 கறவை மாடுகள் பால் பண்ணைக்கு நபார்டு மதிப்பீடு என்ன?',
    'மசாலா ஆலைக்கு FSSAI உரிம விதிமுறைகள் என்ன?',
  ],
  kn: [
    'ಗ್ರಾಮದಲ್ಲಿ 35% PMEGP ಸಬ್ಸಿಡಿ ಪಡೆಯುವುದು ಹೇಗೆ?',
    'ಯಂತ್ರೋಪಕರಣಗಳ ಸಾಲಕ್ಕೆ ಎಷ್ಟು ತಿಂಗಳ ಮೊರಟೋರಿಯಂ ಸಿಗುತ್ತದೆ?',
    '₹10 ಲಕ್ಷದ ಸಾಲಕ್ಕೆ ಬ್ಯಾಂಕ್ ಜಮೀನು ಅಡಮಾನ ಕೇಳಬಹುದೇ?',
    '2 ಹಸುಗಳ ಹೈನುಗಾರಿಕೆಗೆ ನಬಾರ್ಡ್ ಅಂದಾಜು ವೆಚ್ಚ ಎಷ್ಟು?',
    'ಮಸಾಲೆ ಗಿರಣಿಗೆ FSSAI ಪರವಾನಗಿ ನಿಯಮಗಳೇನು?',
  ],
  bn: [
    'গ্রামে ৩৫% PMEGP ভর্তুকি কীভাবে পাওয়া যাবে?',
    'মেশিনারির ঋণে কত মাসের মোরেটোরিয়াম পাওয়া যায়?',
    '১০ লাখ টাকার ঋণে ব্যাংক কি জমি বন্ধক চাইতে পারে?',
    '২টি গরুর ডেইরি খামারে নাবার্ডের হিসাব কী?',
    'মশলা মিলের জন্য FSSAI নিয়ম কী?',
  ],
  mr: [
    'गावात 35% PMEGP सबसिडी कशी मिळवायची?',
    'मशिनरी कर्जासाठी किती महिने मोरेटोरियम मिळतो?',
    '₹10 लाखांच्या कर्जासाठी बँक जमीन गहाण मागू शकते का?',
    '2 गायींच्या डेअरीसाठी नाबार्डचा खर्च किती आहे?',
    'मसाला गिरणीसाठी FSSAI चे काय नियम आहेत?',
  ],
  gu: [
    'ગામડામાં 35% PMEGP સબસિડી કેવી રીતે મેળવવી?',
    'મશીનરી લોન માટે કેટલા મહિના મોરેટોરિયમ મળે છે?',
    'શું ₹10 લાખની લોન માટે બેંક જમીન ગીરો માંગી શકે?',
    '2 ગાયોની ડેરી ફાર્મ માટે નાબાર્ડ મુજબ કેટલો ખર્ચ થાય?',
    'મસાલા મિલ માટે FSSAI ના નિયમો શું છે?',
  ],
};

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  lang,
  user,
  location,
  onOpenSourceModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: (WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en)(user.name),
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Update initial welcome message if user changes language and hasn't started chatting
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'ai',
            text: (WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en)(user.name),
            timestamp: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [lang, user.name]);

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputVal).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      // Call backend Gemini server endpoint
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          lang,
          userProfile: user,
          location,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: data.answer,
          chunks: data.retrievedChunks || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fall through to statutory RAG engine
    }

    // Comprehensive RAG knowledge engine fallback with exact language support
    setTimeout(() => {
      const ragResult = queryRAGAdvisor(q, lang);
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: ragResult.answer,
        chunks: ragResult.retrievedChunks,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 400);
  };

  const handleVoiceInput = async () => {
    if (isListening) return;
    setMicNotice(null);
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setMicNotice('Please click "Allow" in your browser microphone permission prompt to enable voice input.');
      return;
    }

    setIsListening(true);
    startSpeechRecognition(
      lang,
      (transcript) => {
        setInputVal(transcript);
        handleSend(transcript);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const quickPrompts = PROMPTS_BY_LANG[lang] || PROMPTS_BY_LANG.en;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2 mb-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A]">
              Statutory Knowledge Retrieval Engine
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#231F18] m-0">
              Aarambh Sathi — AI Rural Business Advisor
            </h2>
            <p className="text-xs text-[#5E5648] mt-0.5">
              Grounded in RBI Master Circulars, KVIC 2024-25 directives, and NABARD farm models. Every recommendation cites official regulatory sources.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#DEEAE3] text-[#144134] self-start sm:self-auto shrink-0">
            ✓ Regulatory Grounded
          </span>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(quickPrompts || []).map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#DDD1B8] bg-white text-[#5E5648] hover:border-[#1E5C4A] hover:bg-[#FAF7F0] transition-all cursor-pointer"
            >
              💡 {qp}
            </button>
          ))}
        </div>

        {/* Microphone Notice Alert */}
        {micNotice && (
          <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706]" />
            <span>{micNotice}</span>
          </div>
        )}

        {/* Chat History Box */}
        <div className="min-h-[340px] max-h-[480px] overflow-y-auto p-3 sm:p-4 rounded-xl border border-[#DDD1B8] bg-[#FAF7F0] space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 sm:gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-[#1E5C4A] text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">
                  🌱
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs md:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#B5551E] text-white rounded-tr-xs'
                    : 'bg-white text-[#231F18] border border-[#DDD1B8] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Retrieved Regulatory Citations */}
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#DDD1B8] space-y-2">
                    <div className="text-[10px] uppercase font-bold text-[#8C8373] tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#1D5C8A]" />
                      <span>Retrieved Regulatory Citations:</span>
                    </div>

                    {(m.chunks || []).map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#DDD1B8] text-[11px] text-[#231F18]"
                      >
                        <div className="flex items-center justify-between font-bold text-[#1D5C8A]">
                          <span>{ch.title}</span>
                          <button
                            type="button"
                            onClick={() => onOpenSourceModal(ch.id)}
                            className="text-[10px] text-[#8C3E14] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="text-[10px] text-[#5E5648] mt-0.5">
                          Authority: <strong>{ch.authority}</strong> • Date: {ch.date}
                        </div>
                        <p className="text-[#5E5648] mt-1 italic line-clamp-2">
                          "{ch.chunk}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer timestamp & voice playback */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    m.sender === 'user' ? 'text-white/80' : 'text-[#8C8373]'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => speakText(m.text, lang)}
                      className="flex items-center gap-1 text-[#5E5648] hover:text-[#231F18] font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-[#B5551E]" />
                      <span>{getTranslation('read_aloud', lang)}</span>
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#B5551E] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#1E5C4A] text-white flex items-center justify-center shrink-0 text-sm">
                🌱
              </div>
              <div className="bg-white border border-[#DDD1B8] rounded-2xl px-4 py-2.5 text-xs text-[#5E5648] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E5C4A] animate-ping" />
                <span>Retrieving statutory policy circulars & analyzing...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 mt-4"
        >
          <div className="relative flex-1">
            <input
              id="advisor_query_input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Aarambh Sathi about loans, subsidies, or permits..."
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#1E5C4A] focus:outline-none text-[#231F18]"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              title={isListening ? 'Listening...' : 'Click to speak using microphone'}
              className={`absolute right-2.5 top-2 p-1 rounded-full transition-all cursor-pointer ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-[#B5551E] hover:bg-[#F3ECE0]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="px-4 py-2.5 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
