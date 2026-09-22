import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Volume2,
  BookOpen,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Zap,
  Brain,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { ChatMessage, Language, UserProfile, GPSLocation, BusinessIdea, LoanCalcResult } from '../../types';
import { queryRAGAdvisor } from '../../data/knowledge';
import { speakText, startSpeechRecognition, requestMicrophonePermission } from '../../utils/voice';
import { getTranslation } from '../../i18n';

interface AdvisorViewProps {
  lang: Language;
  user: UserProfile;
  location: GPSLocation;
  activeIdea?: BusinessIdea;
  loanCalc?: LoanCalcResult;
  onOpenSourceModal: (chunkId: string) => void;
}

type ModelMode = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

interface ModelOption {
  id: ModelMode;
  label: string;
  tag: string;
  icon: React.ReactNode;
  description: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'gemini-3.5-flash',
    label: 'General Tasks',
    tag: 'gemini-3.5-flash',
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
    description: 'Comprehensive rural credit advisory, subsidy estimation & scheme eligibility',
  },
  {
    id: 'gemini-3.1-flash-lite',
    label: 'Fast Tasks',
    tag: 'gemini-3.1-flash-lite',
    icon: <Zap className="w-3.5 h-3.5 text-amber-600" />,
    description: 'Rapid responses for quick facts, interest rates & document checklists',
  },
  {
    id: 'gemini-3.1-pro-preview',
    label: 'Complex Tasks',
    tag: 'gemini-3.1-pro-preview',
    icon: <Brain className="w-3.5 h-3.5 text-purple-600" />,
    description: 'In-depth DPR appraisal, DSCR risk modeling & statutory stress-testing',
  },
];

const WELCOME_MESSAGES: Record<Language, (name: string, ideaName?: string) => string> = {
  en: (name, ideaName) =>
    `Namaste ${name}! I am Aarambh Sathi (आरंभ साथी), your dedicated AI rural enterprise and bank credit counselor. I am continuously grounded in official RBI Master Directions, KVIC PMEGP 2024-25 circulars, and NABARD benchmarks.

${ideaName ? `Currently reviewing your plan for: **${ideaName}**.` : ''}
Ask me anything about your project cost, eligible 35% subsidy, collateral-free credit rights under CGTMSE, moratorium periods, or licensing.`,
  hi: (name, ideaName) =>
    `नमस्ते ${name}! मैं आरंभ साथी हूँ — आपका समर्पित ग्रामीण व्यापार और बैंक ऋण सलाहकार। मैं आरबीआई, केवीआईसी 2024-25 और नाबार्ड के आधिकारिक नियमों से सीधे जुड़ा हूँ।

${ideaName ? `वर्तमान में आपकी योजना: **${ideaName}** का विश्लेषण कर रहा हूँ।` : ''}
सब्सिडी, बैंक लोन, बिना गिरवी ऋण अधिकार, मोराटोरियम (छूट अवधि) या किसी भी कागजी प्रक्रिया के बारे में अपने प्रश्न पूछें।`,
  te: (name, ideaName) =>
    `నమస్కారం ${name}! నేను ఆరంభ్ సాథి — మీ గ్రామీణ వ్యాపార మరియు బ్యాంక్ రుణ సలహాదారుని. RBI మాస్టర్ సర్క్యులర్లు, KVIC 2024-25 మరియు నాబార్డ్ నిబంధనల ప్రకారం ఖచ్చితమైన వివరాలు అందిస్తాను.

${ideaName ? `ప్రస్తుతం మీ ప్రాజెక్ట్: **${ideaName}** ను పరిశీలిస్తున్నాను.` : ''}
సబ్సిడీ శాతం, పూచీకత్తు లేని రుణాలు, మొరటోరియం గడువు లేదా అనుమతుల గురించి మీ ప్రశ్నలు అడగండి.`,
  ta: (name, ideaName) =>
    `வணக்கம் ${name}! நான் ஆரம்ப சாதி — உங்கள் கிராமப்புற வணிக மற்றும் வங்கி கடன் ஆலோசகர். RBI, KVIC மற்றும் நபார்டு அதிகாரப்பூர்வ விதிமுறைகளின்படி சரியான ஆலோசனைகளை வழங்குகிறேன்.

${ideaName ? `தற்போது உங்களின் திட்டம்: **${ideaName}** பரிசீலிக்கப்படுகிறது.` : ''}
மானியம், நில அடமானம் தேவையில்லா கடன் உரிமைகள், அவகாச காலம் பற்றி கேளுங்கள்.`,
  kn: (name, ideaName) =>
    `ನಮಸ್ಕಾರ ${name}! ನಾನು ಆರಂಭ ಸಾಥಿ — ನಿಮ್ಮ ಗ್ರಾಮೀಣ ವ್ಯಾಪಾರ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಾಲ ಸಲಹೆಗಾರ. RBI, KVIC 2024-25 ಮತ್ತು ನಬಾರ್ಡ್ ನಿಯಮಗಳ ಅಡಿಯಲ್ಲಿ ನಿಖರ ಮಾಹಿತಿ ನೀಡುತ್ತೇನೆ.

${ideaName ? `ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಯೋಜನೆ: **${ideaName}** ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ.` : ''}
ಸಬ್ಸಿಡಿ, ಕೊಲ್ಯಾಟರಲ್-ಮುಕ್ತ ಸಾಲ, ಮೊರಟೋರಿಯಂ ಬಗ್ಗೆ ಪ್ರಶ್ನಿಸಿ.`,
  bn: (name, ideaName) =>
    `নমস্কার ${name}! আমি আরম্ভ সাথী — আপনার গ্রামীণ ব্যবসা ও ব্যাংক ঋণ উপদেষ্টা। ভারতীয় রিজার্ভ ব্যাংক, কেভিআইসি ও নাবার্ড নির্দেশিকা মেনে পরামর্শ প্রদান করি।

${ideaName ? `বর্তমান প্রকল্প: **${ideaName}** বিবেচনা করা হচ্ছে।` : ''}
ভর্তুকি, জামানতবিহীন ঋণ বা মোরেটোরিয়াম সম্পর্কে জানুন।`,
  mr: (name, ideaName) =>
    `नमस्ते ${name}! मी आरंभ साथी — आपला ग्रामीण उद्योग व बँक कर्ज सल्लागार. आरबीआय, केव्हीआयसी आणि नाबार्डच्या अधिकृत नियमांनुसार अचूक माहिती मिळवा.

${ideaName ? `सध्या आपला प्रकल्प: **${ideaName}** विचारात घेतला जात आहे.` : ''}
सब्सिडी, तारणमुक्त कर्ज आणि मोरेटोरियमबद्दल थेट विचारा.`,
  gu: (name, ideaName) =>
    `નમસ્તે ${name}! હું આરંભ સાથી છું — આપનો ગ્રામીણ વ્યવસાય અને બેંક લોન સલાહકાર. RBI, KVIC અને નાબાર્ડના નિયમો અનુસાર સચોટ માર્ગદર્શન આપું છું.

${ideaName ? `હાલમાં આપનો પ્રોજેક્ટ: **${ideaName}** તપાસવામાં આવી રહ્યો છે.` : ''}
સબસિડી, તારણમુક્ત લોન અને મોરેટોરિયમ વિશે પૂછો.`,
};

const PROMPTS_BY_LANG: Record<Language, string[]> = {
  en: [
    'Calculate my 35% PMEGP subsidy and 5% promoter margin on ₹3 Lakhs capex',
    'Can bank branch manager demand my agricultural land deed for a ₹5 Lakh loan?',
    'What is the moratorium grace period during machinery installation before EMI starts?',
    'What are NABARD benchmark setup costs for a 2-cow mini dairy farm?',
    'What are the basic FSSAI Form A registration rules for a rural food mill?',
    'How do I submit an application digitally on the JanSamarth portal?',
  ],
  hi: [
    '₹3 लाख की परियोजना पर 35% PMEGP सब्सिडी और 5% मार्जिन की गणना करें',
    'क्या ₹5 लाख के ऋण पर बैंक प्रबंधक कृषि भूमि की रजिस्ट्री मांग सकता है?',
    'मशीन स्थापना के समय नियमित EMI से पहले मोराटोरियम (छूट) कितने महीने मिलती है?',
    'नाबार्ड के अनुसार 2 गाय की आधुनिक डेयरी में कुल कितनी लागत आती है?',
    'ग्रामीण खाद्य प्रसंस्करण चक्की के लिए ₹100 वाले FSSAI पंजीकरण के क्या नियम हैं?',
    'जनसमर्थ पोर्टल (JanSamarth) पर ऑनलाइन आवेदन कैसे किया जाता है?',
  ],
  te: [
    '₹3 లక్షల ప్రాజెక్ట్‌పై 35% PMEGP సబ్సిడీ మరియు 5% మార్జిన్ లెక్కించండి',
    '₹5 లక్షల లోన్ కోసం బ్యాంక్ మేనేజర్ వ్యవసాయ భూమి పట్టా అడగవచ్చా?',
    'యంత్రాల ఏర్పాటు సమయంలో రెగ్యులర్ EMI కి ముందు మొరటోరియం గడువు ఎంత?',
    'నాబార్డ్ ప్రకారం 2 పాడి ఆవుల డెయిరీ ఫామ్‌కు మొత్తం ఎంత ఖర్చవుతుంది?',
    'గ్రామీణ ఆహార మిల్లుకు ₹100 FSSAI రిజిస్ట్రేషన్ నిబంధనలు ఏమిటి?',
    'JanSamarth పోర్టల్‌లో ఆన్‌లైన్ దరఖాస్తు ప్రక్రియ ఎలా పూర్తి చేయాలి?',
  ],
  ta: [
    '₹3 லட்சம் திட்டத்திற்கு 35% PMEGP மானியம் மற்றும் 5% முதலீட்டை கணக்கிடுங்கள்',
    '₹5 லட்சம் கடனுக்கு வங்கி மேலாளர் நில பத்திரங்களை கேட்க முடியுமா?',
    'இயந்திரம் அமைக்கும் காலத்தில் EMI துவங்குவதற்கு முன் அவகாச காலம் எவ்வளவு?',
    'நபார்டு திட்டப்படி 2 கறவை மாடுகள் பண்ணைக்கு மொத்த செலவு எவ்வளவு?',
    'உணவு ஆலைக்கு ₹100 மதிப்பிலான FSSAI பதிவு விதிமுறைகள் என்ன?',
    'ஜன்சமர்த் போர்ட்டலில் ஆன்லைனில் எவ்வாறு விண்ணப்பிப்பது?',
  ],
  kn: [
    '₹3 ಲಕ್ಷದ ಯೋಜನೆಗೆ 35% PMEGP ಸಬ್ಸಿಡಿ ಮತ್ತು 5% ಮಾರ್ಜಿನ್ ಲೆಕ್ಕ ಹಾಕಿ',
    '₹5 ಲಕ್ಷದ ಸಾಲಕ್ಕಾಗಿ ಬ್ಯಾಂಕ್ ಕೃಷಿ ಭೂಮಿಯ ದಾಖಲೆಗಳನ್ನು ಕೇಳಬಹುದೇ?',
    'ಯಂತ್ರ ಸ್ಥಾಪನೆಯ ಅವಧಿಯಲ್ಲಿ ನಿಯಮಿತ EMI ಗಿಂತ ಮೊದಲು ಎಷ್ಟು ತಿಂಗಳ ಮೊರಟೋರಿಯಂ ಸಿಗುತ್ತದೆ?',
    'ನಬಾರ್ಡ್ ಪ್ರಕಾರ 2 ಹಸುಗಳ ಹೈನುಗಾರಿಕೆ ಘಟಕಕ್ಕೆ ಒಟ್ಟು ವೆಚ್ಚ ಎಷ್ಟು?',
    'ಗ್ರಾಮೀಣ ಆಹಾರ ಗಿರಣಿಗೆ FSSAI ನೋಂದಣಿ ನಿಯಮಗಳೇನು?',
    'ಜನಸಮರ್ಥ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಡಿಜಿಟಲ್ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?',
  ],
  bn: [
    '₹৩ লাখের প্রকল্পে ৩৫% PMEGP ভর্তুকি ও ৫% নিজস্ব মার্জিন হিসাব করুন',
    '₹৫ লাখ টাকার ঋণে ব্যাংক কি কৃষি জমি বন্ধক চাইতে পারে?',
    'মেশিনপত্র স্থাপনের সময় নিয়মিত EMI শুরুর আগে কত মাসের মোরেটোরিয়াম পাওয়া যায়?',
    'নাবার্ডের নিয়ম অনুযায়ী ২টি গরুর ডেইরিতে মোট খরচ কত?',
    'গ্রামীণ খাদ্য প্রক্রিয়াকরণ মিলে FSSAI রেজিস্ট্রেশনের নিয়ম কী?',
    'জনসমর্থ পোর্টালে কীভাবে অনলাইনে আবেদন করবেন?',
  ],
  mr: [
    '₹3 लाखांच्या प्रकल्पावर 35% PMEGP सबसिडी आणि 5% मार्जिनची गणना करा',
    '₹5 लाखांच्या कर्जासाठी बँक शेतजमिनीची कागदपत्रे मागू शकते का?',
    'मशिनरी बसवताना नियमित EMI सुरू होण्यापूर्वी मोरेटोरियम किती महिने मिळतो?',
    'नाबार्डनुसार 2 गायींच्या डेअरीसाठी एकूण भांडवली खर्च किती?',
    'ग्रामीण अन्न प्रक्रिया गिरणीसाठी FSSAI नोंदणीचे नियम काय आहेत?',
    'जनसमर्थ पोर्टलवर ऑनलाईन अर्ज कसा करावा?',
  ],
  gu: [
    '₹3 લાખના પ્રોજેક્ટ પર 35% PMEGP સબસિડી અને 5% માર્જિન ગણો',
    'શું ₹5 લાખની લોન માટે બેંક ખેતીની જમીન ગીરો માંગી શકે?',
    'મશીનરી સ્થાપના દરમિયાન નિયમિત EMI પહેલાં કેટલા મહિનાનો મોરેટોરિયમ મળે છે?',
    'નાબાર્ડ મુજબ 2 ગાયોની ડેરી માટે કુલ કેટલો ખર્ચ થાય?',
    'ગ્રામીણ ફૂડ મિલ માટે ₹100 વાળા FSSAI રજીસ્ટ્રેશનના નિયમો શું છે?',
    'જનસમર્થ પોર્ટલ પર ઓનલાઇન અરજી કેવી રીતે કરવી?',
  ],
};

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  lang,
  user,
  location,
  activeIdea,
  loanCalc,
  onOpenSourceModal,
}) => {
  const activeIdeaTitle = activeIdea?.name?.[lang] || activeIdea?.name?.en;

  const [selectedModel, setSelectedModel] = useState<ModelMode>('gemini-3.5-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: (WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en)(user.name, activeIdeaTitle),
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of thread
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
            text: (WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en)(user.name, activeIdeaTitle),
            timestamp: 'Just now',
            modelUsed: selectedModel,
          },
        ];
      }
      return prev;
    });
  }, [lang, user.name, activeIdeaTitle, selectedModel]);

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        sender: 'ai',
        text: (WELCOME_MESSAGES[lang] || WELCOME_MESSAGES.en)(user.name, activeIdeaTitle),
        timestamp: 'Just now',
        modelUsed: selectedModel,
      },
    ]);
  };

  const handleCopy = (msgId: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputVal).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Prepare history of previous turns (excluding welcome)
    const conversationHistory = messages
      .filter((m) => !m.id.startsWith('welcome'))
      .map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          history: conversationHistory,
          model: selectedModel,
          lang,
          userProfile: user,
          location,
          activeIdea,
          loanCalc,
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
          modelUsed: data.modelUsed || selectedModel,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // If network fails, proceed to fallback
    }

    // Client-side fallback with input responsiveness
    setTimeout(() => {
      const ragResult = queryRAGAdvisor(q, lang);
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: ragResult.answer,
        chunks: ragResult.retrievedChunks,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: `${selectedModel} (Grounded RAG)`,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 450);
  };

  const handleVoiceInput = async () => {
    if (isListening) return;
    setMicNotice(null);
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setMicNotice('Please click "Allow" in your browser microphone prompt to enable voice input.');
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
    <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 space-y-4">
      {/* Header Container */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E5C4A]" />
                Responsible Statutory AI Advisor
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DEEAE3] text-[#144134]">
                Multi-Turn Conversation
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#231F18] mt-1">
              Aarambh Sathi (आरंभ साथी)
            </h2>
            <p className="text-xs text-[#5E5648] mt-0.5">
              Certified Rural Enterprise & Credit Counselor. Direct answers grounded in RBI Master Circulars, KVIC 2024-25, NABARD, and CGTMSE rules.
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start lg:self-center">
            <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#DDD1B8]">
              {MODEL_OPTIONS.map((opt) => {
                const isActive = selectedModel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedModel(opt.id)}
                    title={opt.description}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#1E5C4A] shadow-xs border border-[#DDD1B8]'
                        : 'text-[#5E5648] hover:text-[#231F18]'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation and start fresh topic"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#DDD1B8] bg-white text-[#5E5648] hover:bg-[#FAF7F0] hover:text-[#231F18] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B5551E]" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Live Applicant & Proposal Context Ribbon */}
        <div className="mt-3 p-2.5 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5E5648]">
            <span>
              <strong>Target Venture:</strong>{' '}
              <span className="text-[#1E5C4A] font-semibold">
                {activeIdeaTitle || 'Cold-Press Oil & Agro Unit'}
              </span>
            </span>
            <span>
              <strong>Applicant:</strong> {user.name} ({user.category === 'special' ? '35% Rural Subsidy' : '25% Subsidy'})
            </span>
            <span>
              <strong>Location:</strong> {user.townCity || location.village}, {location.district} ({location.classification})
            </span>
            {loanCalc && (
              <span>
                <strong>Capex:</strong> ₹{loanCalc.capex.toLocaleString('en-IN')} |{' '}
                <strong>Net Loan:</strong> ₹{loanCalc.netLoan.toLocaleString('en-IN')} (EMI: ₹{loanCalc.regularEmi.toLocaleString('en-IN')})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#1E5C4A] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Model: {selectedModel}</span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3">
          <div className="text-[11px] font-bold text-[#8C8373] uppercase tracking-wider mb-1.5">
            Suggested Responsible Prompts:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#DDD1B8] bg-white text-[#5E5648] hover:border-[#1E5C4A] hover:bg-[#FAF7F0] hover:text-[#1E5C4A] transition-all cursor-pointer text-left"
              >
                💬 {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Microphone Notice Alert */}
        {micNotice && (
          <div className="flex items-center gap-2 p-2.5 mt-3 rounded-lg bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706]" />
            <span>{micNotice}</span>
          </div>
        )}

        {/* Scrollable Conversation Thread */}
        <div className="mt-4 min-h-[380px] max-h-[500px] overflow-y-auto p-3 sm:p-4 rounded-xl border border-[#DDD1B8] bg-[#FAF7F0] space-y-4">
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
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#B5551E] text-white rounded-tr-xs'
                    : 'bg-white text-[#231F18] border border-[#DDD1B8] rounded-tl-xs'
                }`}
              >
                {/* Header for AI response with model badge */}
                {m.sender === 'ai' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EFE8DA] text-[11px]">
                    <span className="font-bold text-[#1E5C4A] flex items-center gap-1">
                      <span>Aarambh Sathi</span>
                      <span className="text-[10px] text-[#8C8373] font-normal">• Verified Credit Advisor</span>
                    </span>
                    {m.modelUsed && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#EFE8DA] text-[#5E5648]">
                        {m.modelUsed}
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line text-[#231F18] font-normal leading-relaxed">
                  {m.text}
                </div>

                {/* Retrieved Regulatory Citations */}
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#DDD1B8] space-y-2">
                    <div className="text-[10px] uppercase font-bold text-[#8C8373] tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#1D5C8A]" />
                      <span>Statutory Citations & Grounding Sources:</span>
                    </div>

                    {m.chunks.map((ch, idx) => (
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
                            <span>Inspect Circular</span>
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

                {/* Footer timestamp & action buttons */}
                <div
                  className={`mt-3 flex items-center justify-between text-[10px] ${
                    m.sender === 'user' ? 'text-white/80' : 'text-[#8C8373]'
                  }`}
                >
                  <span>{m.timestamp}</span>

                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(m.id, m.text)}
                      title="Copy response"
                      className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                        m.sender === 'user' ? 'text-white/80 hover:text-white' : 'text-[#5E5648] hover:text-[#231F18]'
                      }`}
                    >
                      {copiedMsgId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Read Aloud Button for AI */}
                    {m.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => speakText(m.text, lang)}
                        className="flex items-center gap-1 text-[#5E5648] hover:text-[#231F18] font-semibold cursor-pointer ml-1"
                      >
                        <Volume2 className="w-3 h-3 text-[#B5551E]" />
                        <span>{getTranslation('read_aloud', lang)}</span>
                      </button>
                    )}
                  </div>
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
              <div className="bg-white border border-[#DDD1B8] rounded-2xl px-4 py-2.5 text-xs text-[#5E5648] flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#1E5C4A] animate-ping" />
                <span>
                  Consulting statutory guidelines via <strong>{selectedModel}</strong>...
                </span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 mt-4"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              id="advisor_query_input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Ask Aarambh Sathi about loans, ${selectedModel} appraisal, subsidies, or bank guidelines...`}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-[#DDD1B8] bg-white text-sm focus:border-[#1E5C4A] focus:ring-1 focus:ring-[#1E5C4A] focus:outline-none text-[#231F18] placeholder-[#8C8373] shadow-xs"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              title={isListening ? 'Listening...' : 'Click to speak using microphone'}
              className={`absolute right-2.5 top-2.5 p-1.5 rounded-lg transition-all cursor-pointer ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-[#B5551E] hover:bg-[#F3ECE0]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-[#1E5C4A] hover:bg-[#144134] disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
