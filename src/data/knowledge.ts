import { BusinessIdea, RAGChunk, Language } from '../types';

export const BUSINESS_KB: BusinessIdea[] = [
  {
    id: 'spice_flour_mill',
    sector: 'agro',
    name: {
      en: 'Commercial Spice & Flour Mill',
      hi: 'मसाला पिसाई व आटा चक्की इकाई',
      te: 'మిరప, పసుపు & పిండి మిల్లు',
      ta: 'மசாலா மற்றும் மாவு அரைக்கும் ஆலை',
      kn: 'ಮಸಾಲೆ ಮತ್ತು ಹಿಟ್ಟಿನ ಗಿರಣಿ ಘಟಕ',
      bn: 'মশলা ও আটা কল কারখানা',
      mr: 'मसाला दळण आणि पीठ गिरणी',
      gu: 'મસાલા અને લોટ દળવાની ઘંટી',
    },
    skills: ['farming', 'cooking', 'retail'],
    minCapital: 100000,
    fixedCapex: 220000,
    monthlyRev: 54000,
    monthlyOpex: 21000,
    risk: 'low',
    labour: 2,
    area: '200 sq ft',
    power: '5 HP 3-Phase',
    why: {
      en: 'Year-round staple consumption in rural belts. Processing raw local harvest rather than farm-gate selling gives 40% higher margin.',
      hi: 'गाँव व कस्बों में सालभर निरंतर मांग। कच्ची फसल सीधे बेचने के बजाय पिसाई कर बेचने से 40% अधिक आय।',
      te: 'గ్రామాల్లో నిరంతర డిమాండ్ ఉంటుంది. ముడి సరుకును ప్రాసెస్ చేసి అమ్మడం ద్వారా 40% అదనపు ఆదాయం లభిస్తుంది.',
      ta: 'கிராமப்புறங்களில் ஆண்டு முழுவதும் அத்தியாவசிய தேவை. விவசாய விளைபொருளை நேரடியாக விற்பதை விட அரைத்து விற்பது 40% கூடுதல் லாபம் தரும்.',
      kn: 'ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ವರ್ಷಪೂರ್ತಿ ಬೇಡಿಕೆ ಇರುತ್ತದೆ. ಕಚ್ಚಾ ಧಾನ್ಯ ಮಾರಾಟಕ್ಕಿಂತ ಸಂಸ್ಕರಿಸಿ ಮಾರಾಟ ಮಾಡುವುದರಿಂದ 40% ಅಧಿಕ ಲಾಭ ಸಿಗುತ್ತದೆ.',
      bn: 'গ্রামে সারা বছর চাহিদা থাকে। ফসল সরাসরি বিক্রি না করে গুঁড়ো করে বিক্রি করলে ৪০% বেশি লাভ হয়।',
      mr: 'गावात वर्षभर सतत मागणी. कच्चा माल थेट विकण्यापेक्षा प्रक्रिया करून विकल्यास ४०% जास्त नफा मिळतो.',
      gu: 'ગામડાંમાં આખું વર્ષ અનાજ દળવાની માંગ રહે છે. ખેત પેદાશ સીધી વેચવાને બદલે પ્રોસેસ કરીને વેચવાથી ૪૦% વધુ નફો મળે છે.',
    },
    schemes: ['pmegp', 'pmfme', 'mudra'],
  },
  {
    id: 'dairy_micro_farm',
    sector: 'dairy',
    name: {
      en: '2-Cattle Crossbred Dairy Unit',
      hi: '2 दुधारू पशु आधुनिक डेयरी इकाई',
      te: '2 పాడి పశువుల మైక్రో డైరీ',
      ta: '2 மாடுகள் கொண்ட நவீன பால் பண்ணை',
      kn: '2 ಹಸುಗಳ ಆಧುನಿಕ ಹೈನುಗಾರಿಕೆ ಘಟಕ',
      bn: '২টি গাভীর আধুনিক ডেইরি খামার',
      mr: '२ दुभत्या जनावरांची आधुनिक डेअरी',
      gu: '૨ દુધાળા પશુઓનું ડેરી યુનિટ',
    },
    skills: ['dairy', 'farming'],
    minCapital: 80000,
    fixedCapex: 190000,
    monthlyRev: 46000,
    monthlyOpex: 18000,
    risk: 'low',
    labour: 2,
    area: '300 sq ft shed',
    power: 'Domestic',
    why: {
      en: 'Instant daily liquidity through dairy cooperative societies. Cattle dung converted to organic compost generates secondary revenue.',
      hi: 'सहकारी दुग्ध संघों द्वारा प्रतिदिन या साप्ताहिक भुगतान। गोबर से जैविक खाद बनाकर अतिरिक्त कमाई।',
      te: 'పాల సంఘాల ద్వారా రోజువారీ నగదు లభిస్తుంది. పేడను వర్మీకంపోస్ట్‌గా మార్చి అదనపు ఆదాయం పొందవచ్చు.',
      ta: 'பால் கூட்டுறவு சங்கங்கள் மூலம் தினசரி அல்லது வாராந்திர வருமானம். சாணத்தில் இருந்து இயற்கை உரம் தயாரித்து கூடுதல் லாபம்.',
      kn: 'ಹಾಲು ಒಕ್ಕೂಟಗಳಿಂದ ನಿಯಮಿತ ಪಾವತಿ. ಸಗಣಿಯಿಂದ ಎರೆಹುಳು ಗೊಬ್ಬರ ತಯಾರಿಸಿ ಹೆಚ್ಚುವರಿ ಆದಾಯ ಗಳಿಸಬಹುದು.',
      bn: 'দুধ সমবায় সমিতির মাধ্যমে প্রতিদিনের নিশ্চিত আয়। গোবর থেকে সার তৈরি করে বাড়তি লাভ।',
      mr: 'दुग्ध सहकारी संस्थांकडून नियमित पेमेंट. शेणापासून गांडूळ खत बनवून दुहेरी उत्पन्न.',
      gu: 'દૂધ મંડળીઓ દ્વારા નિયમિત આવક. છાણમાંથી જૈવિક ખાતર બનાવીને વધારાની કમાણી.',
    },
    schemes: ['mudra', 'pmegp', 'nrlm'],
  },
  {
    id: 'solar_pump_service',
    sector: 'green',
    name: {
      en: 'Solar Agri-Pump & Motor Workshop',
      hi: 'सोलर पंप व कृषि मोटर रिपेयर वर्कशॉप',
      te: 'సోలార్ పంప్ & మోటార్ రిపేర్ కేంద్రం',
      ta: 'சூரிய சக்தி பம்ப் மற்றும் மோட்டார் பணிமனை',
      kn: 'ಸೋಲಾರ್ ಕೃಷಿ ಪಂಪ್ ಮತ್ತು ಮೋಟಾರ್ ವರ್ಕ್‌ಶಾಪ್',
      bn: 'সৌর পাম্প ও মোটর মেরামতের ওয়ার্কশপ',
      mr: 'सोलर पंप व कृषी मोटर दुरुस्ती केंद्र',
      gu: 'સોલાર પંપ અને કૃષિ મોટર રિપેરિંગ વર્કશોપ',
    },
    skills: ['electrical', 'farming'],
    minCapital: 60000,
    fixedCapex: 130000,
    monthlyRev: 42000,
    monthlyOpex: 12000,
    risk: 'low',
    labour: 1,
    area: '120 sq ft shop',
    power: 'Single Phase',
    why: {
      en: 'Huge surge in solar agriculture pumps under PM KUSUM. Lack of village-level technicians ensures rapid local monopoly and steady service retainers.',
      hi: 'पीएम कुसुम योजना से गाँवों में सोलर पंपों की भरमार। स्थानीय स्तर पर कुशल कारीगरों की कमी से पक्का काम।',
      te: 'వ్యవసాయంలో సోలార్ పంపులు వేగంగా పెరుగుతున్నాయి. గ్రామాల్లో సాంకేతిక నిపుణులు లేనందున స్థిరమైన గిరాకీ ఉంటుంది.',
      ta: 'கிராமங்களில் சோலார் பம்புகள் அதிகரிப்பு. கிராம அளவில் பழுதுபார்க்க ஆட்கள் இல்லாததால் சிறந்த வருமானம்.',
      kn: 'ಗ್ರಾಮಗಳಲ್ಲಿ ಸೋಲಾರ್ ಪಂಪ್‌ಗಳು ಹೆಚ್ಚಾಗುತ್ತಿವೆ. ಸ್ಥಳೀಯ ರಿಪೇರಿಗಾರರ ಕೊರತೆಯಿಂದ ಉತ್ತಮ ಸಂಪಾದನೆ.',
      bn: 'গ্রামে সোলার পাম্পের ব্যাপক বিস্তার। স্থানীয় মিস্ত্রির অভাবে দ্রুত গ্রাহক পাওয়া যায়।',
      mr: 'गावोगावी सौर पंपांची संख्या वाढली आहे. स्थानिक तंत्रज्ञांची कमतरता असल्याने नियमित काम मिळते.',
      gu: 'પીએમ કુસુમ યોજના હેઠળ સોલાર પંપોનો ભારે વધારો. ગામમાં કારીગરોની અછત હોવાથી કાયમી કમાણી.',
    },
    schemes: ['pmegp', 'vishwakarma', 'mudra'],
  },
  {
    id: 'garment_stitching_unit',
    sector: 'crafts',
    name: {
      en: 'Custom Apparel & School Uniform Unit',
      hi: 'स्कूल यूनिफॉर्म व रेडीमेड सिलाई केंद्र',
      te: 'స్కూల్ యూనిఫాం & టైలరింగ్ యూనిట్',
      ta: 'பள்ளி சீருடை மற்றும் ஆடை தயாரிப்பு மையம்',
      kn: 'ಶಾಲಾ ಸಮವಸ್ತ್ರ ಮತ್ತು ಟೈಲರಿಂಗ್ ಘಟಕ',
      bn: 'স্কুল ইউনিফর্ম ও পোশাক তৈরির কারখানা',
      mr: 'शालेय गणवेश व कपडे शिलाई केंद्र',
      gu: 'સ્કૂલ યુનિફોર્મ અને રેડીમેડ સિલાઈ કેન્દ્ર',
    },
    skills: ['tailoring', 'crafts'],
    minCapital: 45000,
    fixedCapex: 95000,
    monthlyRev: 34000,
    monthlyOpex: 11000,
    risk: 'low',
    labour: 2,
    area: '150 sq ft',
    power: 'Single Phase',
    why: {
      en: 'Institutional bulk orders from local village schools and bridal season demand provide high profitability with minimal working capital.',
      hi: 'गाँव के स्कूलों की यूनिफॉर्म के थोक ऑर्डर और शादियों के सीज़न में भारी मांग। कम लागत में अच्छा मुनाफ़ा।',
      te: 'స్థానిక పాఠశాలల యూనిఫాంలు, పెళ్లిళ్ల ఆర్డర్లతో తక్కువ పెట్టుబడితో ఎక్కువ రాబడి వస్తుంది.',
      ta: 'உள்ளூர் பள்ளி சீருடைகள் மற்றும் திருமண விசேஷ ஆர்டர்கள் மூலம் நிலையான வருமானம்.',
      kn: 'ಸ್ಥಳೀಯ ಶಾಲೆಗಳ ಸಮವಸ್ತ್ರ ಮತ್ತು ಮದುವೆ ಸೀಸನ್ ಆರ್ಡರ್‌ಗಳಿಂದ ಸ್ಥಿರವಾದ ಲಾಭ.',
      bn: 'গ্রামের স্কুলের পোশাক ও উৎসবের অর্ডারে কম পুঁজিতে ভালো আয়।',
      mr: 'स्थानिक शाळांचे गणवेश व लग्नकार्यांच्या ऑर्डर्समधून निरंतर नफा.',
      gu: 'સ્થાનિક શાળાઓના ગણવેશ અને લગ્નની સીઝનમાં બલ્ક ઓર્ડરથી મોટો નફો.',
    },
    schemes: ['pmegp', 'vishwakarma', 'nrlm'],
  },
  {
    id: 'cold_press_oil_expeller',
    sector: 'agro',
    name: {
      en: 'Cold-Press Mustard / Groundnut Oil Expeller',
      hi: 'कोल्ड-प्रेस कच्ची घानी तेल मिल',
      te: 'గానుగ నూనె తయారీ యూనిట్',
      ta: 'மரச்செக்கு நல்லெண்ணெய்/கடலை எண்ணெய் ஆலை',
      kn: 'ಮರದ ಗಾಣದ ಎಣ್ಣೆ ಉತ್ಪಾದನಾ ಘಟಕ',
      bn: 'ঘানি ভাঙা খাঁটি সরিষার তেল কারখানা',
      mr: 'कच्ची घाणी लाकडी तेल घाणा',
      gu: 'કોલ્ડ-પ્રેસ ઘાણી તેલ મિલ',
    },
    skills: ['farming', 'cooking'],
    minCapital: 120000,
    fixedCapex: 280000,
    monthlyRev: 62000,
    monthlyOpex: 23000,
    risk: 'low',
    labour: 2,
    area: '250 sq ft',
    power: '7.5 HP 3-Phase',
    why: {
      en: 'High consumer shift toward unrefined wood-pressed edible oils. Oil-cake (khali) byproduct is sold back to dairy farmers with 100% margin.',
      hi: 'शुद्ध कच्ची घानी तेल की भारी शहरी व ग्रामीण मांग। तेल खली स्थानीय डेयरी किसानों को हाथों-हाथ बिकती है।',
      te: 'స్వచ్ఛమైన గానుగ నూనెకు డిమాండ్ పెరిగింది. పిండి చెక్కలను పాడి రైతులకు సులభంగా అమ్ముకోవచ్చు.',
      ta: 'மரச்செக்கு எண்ணெய்க்கு நல்ல சந்தை உள்ளது. புண்ணாக்கு கால்நடை வளர்ப்போருக்கு உடனடியாக விற்பனையாகும்.',
      kn: 'ಶುದ್ಧ ಎಣ್ಣೆಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ. ಹಿಂಡಿ (ಖೋಡು) ಸ್ಥಳೀಯ ಹೈನುಗಾರರಿಗೆ ಸುಲಭವಾಗಿ ಮಾರಾಟವಾಗುತ್ತದೆ.',
      bn: 'খাঁটি ঘানি তেলের ব্যাপক চাহিদা। খৈল সহজেই স্থানীয় গো-খামারিদের কাছে বিক্রি হয়।',
      mr: 'शुद्ध लाकडी घाण्याच्या तेलाला मोठी मागणी. तेल पेंड स्थानिक डेअरी शेतकऱ्यांना सहज विकली जाते.',
      gu: 'શુદ્ધ ઘાણીના તેલની ભારે માંગ. તેલની ખોળ ડેરી પશુપાલકોને રોકડેથી વેચાય છે.',
    },
    schemes: ['pmegp', 'pmfme'],
  },
  {
    id: 'electric_cargo_auto',
    sector: 'green',
    name: {
      en: 'Electric Cargo 3-Wheeler Transport',
      hi: 'इलेक्ट्रिक लोडर व ग्रामीण माल ढुलाई',
      te: 'ఎలక్ట్రిక్ కార్గో ఆటో రవాణా సేవ',
      ta: 'மின்சார சரக்கு ஆட்டோ போக்குவரத்து',
      kn: 'ಎಲೆಕ್ಟ್ರಿಕ್ ಸರಕು ವಾಹನ ಸಾರಿಗೆ ಸೇವೆ',
      bn: 'ইলেকট্রিক লোডার পণ্য পরিবহন পরিষেবা',
      mr: 'इलेक्ट्रिक लोडर मालवाहतूक सेवा',
      gu: 'ઇલેક્ટ્રિક કાર્ગો લોડર પરિવહન સેવા',
    },
    skills: ['driving', 'retail'],
    minCapital: 70000,
    fixedCapex: 260000,
    monthlyRev: 48000,
    monthlyOpex: 13000,
    risk: 'medium',
    labour: 1,
    area: 'Parking space',
    power: '15A Socket',
    why: {
      en: 'Operating cost of ₹0.80/km compared to ₹4.50/km for diesel. Daily vegetable mandi freight guarantees immediate cashflow.',
      hi: 'डीजल से 75% कम संचालन खर्च। सब्जी मंडी व गल्ला व्यापारियों से दैनिक भाड़े की पक्की कमाई।',
      te: 'డీజిల్ ఖర్చు లేకుండా తక్కువ వ్యయంతో నడుస్తుంది. రోజూ మార్కెట్‌కు సరుకు రవాణాకు అనుకూలం.',
      ta: 'டீசலை விட 75% குறைவான செலவு. காய்கறி மார்க்கெட் மற்றும் வணிகர்களிடமிருந்து தினசரி வருமானம்.',
      kn: 'ಡೀಸೆಲ್‌ಗಿಂತ ತೀರಾ ಕಡಿಮೆ ವೆಚ್ಚ. ತರಕಾರಿ ಮಾರುಕಟ್ಟೆಯಿಂದ ದಿನನಿತ್ಯದ ಬಾಡಿಗೆ ಆದಾಯ.',
      bn: 'ডিজেলের চেয়ে অনেক কম খরচ। সবজি বাজার ও পাইকারদের থেকে দৈনিক নিশ্চিত ভাড়া।',
      mr: 'डिझेलपेक्षा ७५% कमी खर्च. भाजीपाला मंडीतून रोजचे भाडे रोख स्वरूपात मिळते.',
      gu: 'ડીઝલ કરતાં ૭૫% ઓછો ખર્ચ. શાકભાજી માર્કેટ અને વેપારીઓ પાસેથી રોકડ આવક.',
    },
    schemes: ['standup', 'mudra'],
  },
  {
    id: 'rural_csc_digital',
    sector: 'services',
    name: {
      en: 'Digital Seva Kendra & Micro-ATM Hub',
      hi: 'डिजिटल सेवा केंद्र व आधार बैंकिंग कियोस्क',
      te: 'డిజిటల్ సేవ కేంద్రం & మైక్రో ఏటీఎం',
      ta: 'டிஜிட்டல் இ-சேவை மையம் & வங்கி கியோஸ்க்',
      kn: 'ಡಿಜಿಟಲ್ ಸೇವಾ ಕೇಂದ್ರ ಮತ್ತು ಮೈಕ್ರೋ ಎಟಿಎಂ',
      bn: 'ডিজিটাল সেবা কেন্দ্র ও আধার ব্যাংকিং কিয়স্ক',
      mr: 'आपले सरकार डिजिटल सेवा केंद्र व मायक्रो एटीएम',
      gu: 'ડિજિટલ સેવા કેન્દ્ર અને આધાર માઇક્રો એટીએમ',
    },
    skills: ['retail', 'electrical'],
    minCapital: 50000,
    fixedCapex: 110000,
    monthlyRev: 36000,
    monthlyOpex: 9000,
    risk: 'low',
    labour: 1,
    area: '100 sq ft',
    power: 'Domestic + Inverter',
    why: {
      en: 'Aadhaar cash withdrawal (AePS), utility bills, PM Kisan KYC, and rail booking provide high footfall with zero inventory wastage risk.',
      hi: 'आधार से नकद निकासी, पीएम किसान केवाईसी और बिल भुगतान से निरंतर कमीशन। कोई माल खराब होने का खतरा नहीं।',
      te: 'ఆధార్ నగదు ఉపసంహరణ, ప్రభుత్వ పథకాల దరఖాస్తులతో రోజువారీ కమీషన్ వస్తుంది.',
      ta: 'ஆதார் பணம் எடுத்தல், மின் கட்டணம் செலுத்துதல், சான்றிதழ் விண்ணப்பங்கள் மூலம் நிலையான கமிஷன்.',
      kn: 'ಆಧಾರ್ ಹಣ ವಿತ್‌ಡ್ರಾ, ಬಿಲ್ ಪಾವತಿ, ಬೆಳೆ ವಿಮೆ ಅರ್ಜಿಗಳಿಂದ ನಿರಂತರ ಕಮಿಷನ್.',
      bn: 'আধার টাকা তোলা, সরকারি প্রকল্পের ফর্ম পূরণ ও টিকিট বুকিং থেকে স্থায়ী কমিশন।',
      mr: 'आधार रोख पैसे काढणे, बिल भरणे, शेतकरी योजनांच्या नोंदणीतून हमखास कमिशन.',
      gu: 'આધારથી રોકડા ઉપાડવા, બિલ ભરવા અને સરકારી યોજનાઓની અરજીઓથી કમિશનની આવક.',
    },
    schemes: ['mudra', 'standup'],
  },
  {
    id: 'flyash_brick_unit',
    sector: 'crafts',
    name: {
      en: 'Eco Fly-Ash Brick & Paver Block Unit',
      hi: 'फ्लाई-ऐश ईंट व पेवर ब्लॉक निर्माण इकाई',
      te: 'ఫ్లై-యాష్ ఇటుకల తయారీ యూనిట్',
      ta: 'ஃப்ளை-ஆஷ் செங்கல் மற்றும் பேவர் பிளாக் உற்பத்தி',
      kn: 'ಫ್ಲೈ-ಆಷ್ ಇಟ್ಟಿಗೆ ಮತ್ತು ಪೇವರ್ ಬ್ಲಾಕ್ ಘಟಕ',
      bn: 'ফ্লাই-অ্যাশ ইট ও পেভার ব্লক কারখানা',
      mr: 'फ्लाय-ॲश वीट व पेव्हर ब्लॉक निर्मिती उद्योग',
      gu: 'ફ્લાય-એશ ઈંટ અને પેવર બ્લોક ઉત્પાદન',
    },
    skills: ['carpentry', 'farming'],
    minCapital: 200000,
    fixedCapex: 520000,
    monthlyRev: 95000,
    monthlyOpex: 42000,
    risk: 'medium',
    labour: 4,
    area: '2000 sq ft open plot',
    power: '10 HP 3-Phase',
    why: {
      en: 'Booming rural construction under PM Awas Yojana (PMAY). Traditional red clay bricks face environmental bans, driving high demand for cement fly-ash blocks.',
      hi: 'प्रधानमंत्री आवास योजना के तहत ग्रामीण मकानों में सीमेंट ईंटों की भारी मांग। लाल ईंटों पर पाबंदी से पक्का बाज़ार।',
      te: 'గ్రామీణ గృహ నిర్మాణాల్లో సిమెంట్ ఇటుకలకు విపరీతమైన డిమాండ్ ఉంది. తక్కువ ఖర్చుతో మంచి లాభాలు.',
      ta: 'பிரதம மந்திரி ஆவாஸ் யோஜனா திட்டத்தின் கீழ் வீடுகள் கட்டப்படுவதால் செங்கற்களுக்கு அதிக தேவை.',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ ಮನೆಗಳ ನಿರ್ಮಾಣದಿಂದ ಸಿಮೆಂಟ್ ಇಟ್ಟಿಗೆಗಳಿಗೆ ಭಾರೀ ಬೇಡಿಕೆ.',
      bn: 'প্রধানমন্ত্রী আবাস যোজনায় গ্রামীণ বাড়ি নির্মাণে সিমেন্ট ইটের বিশাল চাহিদা।',
      mr: 'पंतप्रधान आवास योजनेअंतर्गत ग्रामीण घरांच्या बांधकामासाठी सिमेंट विटांची मोठी मागणी.',
      gu: 'પ્રધાનમંત્રી આવાસ યોજના હેઠળ ગ્રામીણ મકાનોના બાંધકામ માટે સિમેન્ટ બ્લોકની ભારે માંગ.',
    },
    schemes: ['pmegp', 'standup'],
  },
];

export const RAG_SOURCES_DB = [
  {
    id: 'rag_pmegp_subsidy',
    title: 'PMEGP Subsidy Entitlement Norms 2024-25',
    authority: 'Khadi and Village Industries Commission (KVIC)',
    circularRef: 'KVIC/PMEGP/Policy/Circular-2024/09',
    date: 'April 2024',
    category: 'subsidy',
    url: 'https://www.kviconline.gov.in/pmegp',
    excerpt: `Under PMEGP, rural units set up by special category beneficiaries (SC, ST, OBC, Women, Minorities, Ex-Servicemen, and Differently-Abled) are entitled to 35% Margin Money Subsidy of the total project cost. General category beneficiaries in rural areas receive 25%. Maximum project cost is ₹50 Lakhs for manufacturing and ₹20 Lakhs for service enterprises. Promoter contribution is 5% for special categories and 10% for general categories.`,
    chunk: `Under PMEGP, rural units set up by special category beneficiaries (SC, ST, OBC, Women, Minorities, Ex-Servicemen, and Differently-Abled) are entitled to 35% Margin Money Subsidy of the total project cost. General category beneficiaries in rural areas receive 25%. Maximum project cost is ₹50 Lakhs for manufacturing and ₹20 Lakhs for service enterprises. Promoter contribution is 5% for special categories and 10% for general categories.`,
  },
  {
    id: 'rag_rbi_psl',
    title: 'RBI Master Circular on Priority Sector Lending (PSL)',
    authority: 'Reserve Bank of India (FIDD.CO.Plan.BC.5/2024)',
    circularRef: 'RBI/FIDD/2024-25/12',
    date: 'July 2024',
    category: 'banking',
    url: 'https://rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx',
    excerpt: `Bank loans up to ₹50 Lakhs to micro enterprises in manufacturing and services are classified as Priority Sector Lending. Under RBI guidelines, banks are strictly mandated not to demand collateral security for loans up to ₹10 Lakhs extended to units in the MSE sector. Credit guarantee is provided through CGTMSE or CGFMU.`,
    chunk: `Bank loans up to ₹50 Lakhs to micro enterprises in manufacturing and services are classified as Priority Sector Lending. Under RBI guidelines, banks are strictly mandated not to demand collateral security for loans up to ₹10 Lakhs extended to units in the MSE sector. Credit guarantee is provided through CGTMSE or CGFMU.`,
  },
  {
    id: 'rag_moratorium_rules',
    title: 'Standard MSME Term Loan Moratorium & Debt Servicing',
    authority: 'Indian Banks Association (IBA) Credit Handbook',
    circularRef: 'IBA/MSME/MORA-2024/03',
    date: 'January 2024',
    category: 'banking',
    url: 'https://www.iba.org.in',
    excerpt: `Term loans for machinery and project setup are eligible for a moratorium (grace period) ranging from 3 to 12 months, during which the principal repayment is suspended to allow commercial stabilization. Borrowers typically service only simple interest during the moratorium. Ideal Debt Service Coverage Ratio (DSCR) for project clearance should exceed 1.5x.`,
    chunk: `Term loans for machinery and project setup are eligible for a moratorium (grace period) ranging from 3 to 12 months, during which the principal repayment is suspended to allow commercial stabilization. Borrowers typically service only simple interest during the moratorium. Ideal Debt Service Coverage Ratio (DSCR) for project clearance should exceed 1.5x.`,
  },
  {
    id: 'rag_pmfme_food',
    title: 'PMFME Food Processing Capital Grant & Convergence',
    authority: 'Ministry of Food Processing Industries (MoFPI)',
    circularRef: 'MoFPI/PMFME/Grant-Circular/2024/11',
    date: 'June 2024',
    category: 'subsidy',
    url: 'https://pmfme.mofpi.gov.in',
    excerpt: `Micro food processing enterprises (spice grinding, flour mills, oil expellers, fruit preservation) qualify for 35% capital subsidy with a ceiling of ₹10 Lakh per unit. Units must adhere to basic FSSAI hygiene standards. PMFME subsidy can be integrated with term loans from any scheduled commercial bank.`,
    chunk: `Micro food processing enterprises (spice grinding, flour mills, oil expellers, fruit preservation) qualify for 35% capital subsidy with a ceiling of ₹10 Lakh per unit. Units must adhere to basic FSSAI hygiene standards. PMFME subsidy can be integrated with term loans from any scheduled commercial bank.`,
  },
  {
    id: 'rag_dairy_nabard',
    title: 'NABARD Bankable Unit Model: 2-Cow Crossbred Dairy',
    authority: 'National Bank for Agriculture and Rural Development (NABARD)',
    circularRef: 'NABARD/FSD/DAIRY-2024/07',
    date: 'March 2024',
    category: 'agriculture',
    url: 'https://www.nabard.org',
    excerpt: `A 2-cow crossbred dairy unit requires approximately 200 sq ft shed space and an initial investment of ₹1.8 to ₹2.2 Lakhs for cattle purchase, shed civil works, and milking equipment. Milk yield is projected at 12–14 litres/day/animal. Revenue averages ₹40–46/litre with dairy cooperatives providing bi-weekly settlements.`,
    chunk: `A 2-cow crossbred dairy unit requires approximately 200 sq ft shed space and an initial investment of ₹1.8 to ₹2.2 Lakhs for cattle purchase, shed civil works, and milking equipment. Milk yield is projected at 12–14 litres/day/animal. Revenue averages ₹40–46/litre with dairy cooperatives providing bi-weekly settlements.`,
  },
  {
    id: 'rag_mudra_brackets',
    title: 'PMMY Credit Classification & Eligibility',
    authority: 'Department of Financial Services, Govt of India',
    circularRef: 'DFS/PMMY/Tier-Notification/2024/05',
    date: 'October 2024',
    category: 'banking',
    url: 'https://www.mudra.org.in',
    excerpt: `Mudra loans require no collateral security or processing fees for the Shishu category (up to ₹50,000). Kishor category covers loans from ₹50,001 to ₹5 Lakhs, ideal for equipment purchase. Tarun category funds up to ₹10 Lakhs, and Tarun Plus extends to ₹20 Lakhs for established units with clean repayment records.`,
    chunk: `Mudra loans require no collateral security or processing fees for the Shishu category (up to ₹50,000). Kishor category covers loans from ₹50,001 to ₹5 Lakhs, ideal for equipment purchase. Tarun category funds up to ₹10 Lakhs, and Tarun Plus extends to ₹20 Lakhs for established units with clean repayment records.`,
  },
];

export const RAG_CHUNKS: RAGChunk[] = RAG_SOURCES_DB;

export function queryRAGAdvisor(question: string, lang: Language = 'en'): { answer: string; retrievedChunks: RAGChunk[] } {
  const q = question.toLowerCase();

  const scoredChunks = RAG_CHUNKS.map((chunk) => {
    let score = 0;
    const text = (chunk.title + ' ' + chunk.chunk + ' ' + chunk.authority).toLowerCase();

    const keywords = q.split(/\s+/).filter((w) => w.length > 2);
    keywords.forEach((kw) => {
      if (text.includes(kw)) score += 10;
    });

    if ((q.includes('subsidy') || q.includes('सब्सिडी') || q.includes('సబ్సిడీ') || q.includes('சப்ஸிடி')) && text.includes('subsidy')) score += 25;
    if (q.includes('pmegp') && text.includes('pmegp')) score += 30;
    if ((q.includes('moratorium') || q.includes('grace') || q.includes('मोराटोरियम') || q.includes('వాయిదా')) && text.includes('moratorium')) score += 30;
    if ((q.includes('dairy') || q.includes('cow') || q.includes('milk') || q.includes('डेयरी') || q.includes('ఆవు') || q.includes('పాలు')) && text.includes('dairy')) score += 30;
    if ((q.includes('mudra') || q.includes('मुद्रा') || q.includes('ముద్ర')) && text.includes('mudra')) score += 30;
    if ((q.includes('collateral') || q.includes('mortgage') || q.includes('जमीन') || q.includes('భూమి') || q.includes('ഗ്യാരന്റി')) && text.includes('collateral')) score += 30;
    if ((q.includes('food') || q.includes('oil') || q.includes('spice') || q.includes('घानी') || q.includes('గానుగ')) && text.includes('food')) score += 25;

    return { chunk, score };
  }).sort((a, b) => b.score - a.score);

  const topChunks = scoredChunks.filter((c) => c.score > 0).slice(0, 2).map((c) => c.chunk);
  if (topChunks.length === 0) {
    topChunks.push(RAG_CHUNKS[0]);
  }

  // Question topic detection
  let topic: 'subsidy' | 'moratorium' | 'dairy' | 'collateral' | 'food' | 'general' = 'general';
  if (q.includes('subsidy') || q.includes('pmegp') || q.includes('सब्सिडी') || q.includes('సబ్సిడీ') || q.includes('சப்ஸிடி') || q.includes('grant') || q.includes('अनुदान')) {
    topic = 'subsidy';
  } else if (q.includes('moratorium') || q.includes('emi') || q.includes('grace') || q.includes('किस्त') || q.includes('వాయిదా') || q.includes('தவணை')) {
    topic = 'moratorium';
  } else if (q.includes('dairy') || q.includes('cow') || q.includes('milk') || q.includes('cattle') || q.includes('गाय') || q.includes('भैंस') || q.includes('ఆవు') || q.includes('గేదె') || q.includes('పాలు') || q.includes('பால்')) {
    topic = 'dairy';
  } else if (q.includes('collateral') || q.includes('guarantee') || q.includes('security') || q.includes('mortgage') || q.includes('गिरवी') || q.includes('భద్రత') || q.includes('తాకట్టు')) {
    topic = 'collateral';
  } else if (q.includes('food') || q.includes('spice') || q.includes('flour') || q.includes('oil') || q.includes('तेल') || q.includes('मसाला') || q.includes('గానుగ') || q.includes('మసాలా')) {
    topic = 'food';
  }

  const ANSWERS: Record<string, Record<Language, string>> = {
    subsidy: {
      en: 'Under the PMEGP Scheme (KVIC Policy 2024-25), you qualify for up to 35% margin money capital subsidy in rural areas as a special category beneficiary (Women, SC/ST, OBC, Minorities). General category applicants receive 25% in rural areas. The maximum project cost covered is ₹50 Lakhs for manufacturing and ₹20 Lakhs for service units. Your own equity contribution is just 5% to 10%.',
      hi: 'PMEGP योजना (KVIC 2024-25) के तहत, ग्रामीण क्षेत्र में विशेष वर्ग (महिलाएं, SC/ST, OBC, अल्पसंख्यक) को 35% पूंजीगत सब्सिडी मिलती है। सामान्य वर्ग को ग्रामीण क्षेत्र में 25% सब्सिडी मिलती है। विनिर्माण के लिए अधिकतम ₹50 लाख और सेवा क्षेत्र के लिए ₹20 लाख तक का ऋण मिलता है। आपको अपनी जेब से सिर्फ 5% से 10% पूंजी लगानी होती है।',
      te: 'PMEGP పథకం (KVIC మార్గదర్శకాలు 2024-25) ప్రకారం, గ్రామీణ ప్రాంతాల్లో ప్రత్యేక వర్గాలకు (మహిళలు, SC/ST, OBCలు) 35% వరకు మూలధన సబ్సిడీ లభిస్తుంది. సాధారణ వర్గానికి 25% సబ్సిడీ అందుతుంది. తయారీ రంగానికి గరిష్టంగా ₹50 లక్షలు, సేవా రంగానికి ₹20 లక్షల వరకు ప్రాజెక్ట్ ఖర్చు అనుమతించబడుతుంది. మీ స్వంత పెట్టుబడి కేవలం 5% నుండి 10% మాత్రమే.',
      ta: 'PMEGP திட்டத்தின் கீழ் (KVIC 2024-25), கிராமப்புறங்களில் பெண்கள், SC/ST, OBC பிரிவினருக்கு 35% மூலதன மானியம் வழங்கப்படுகிறது. பொதுப் பிரிவினருக்கு 25% மானியம் உண்டு. உற்பத்தித் தொழில்களுக்கு ₹50 லட்சம் வரையிலும், சேவை தொழில்களுக்கு ₹20 லட்சம் வரையிலும் கடன் பெறலாம். உங்கள் சொந்த முதலீடு வெறும் 5% முதல் 10% மட்டுமே.',
      kn: 'PMEGP ಯೋಜನೆಯಡಿ (KVIC 2024-25), ಗ್ರಾಮೀಣ ಪ್ರದೇಶದಲ್ಲಿ ಮಹಿಳೆಯರು, SC/ST, OBC ಫಲಾನುಭವಿಗಳಿಗೆ 35% ವರೆಗೆ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ ದೊರೆಯುತ್ತದೆ. ಸಾಮಾನ್ಯ ವರ್ಗದವರಿಗೆ 25% ಸಬ್ಸಿಡಿ ಲಭ್ಯವಿದೆ. ಉತ್ಪಾದನಾ ಯೋಜನೆಗಳಿಗೆ ಗರಿಷ್ಠ ₹50 ಲಕ್ಷ ಮತ್ತು ಸೇವಾ ಕ್ಷೇತ್ರಕ್ಕೆ ₹20 ಲಕ್ಷದವರೆಗೆ ಸಾಲ ಸೌಲಭ್ಯವಿದೆ. ನಿಮ್ಮ ಸ್ವಂತ ಹೂಡಿಕೆ ಕೇವಲ 5% ರಿಂದ 10% ಮಾತ್ರ.',
      bn: 'PMEGP স্কিমে (KVIC 2024-25), গ্রামীণ এলাকায় বিশেষ শ্রেণি (মহিলা, SC/ST, OBC) ৩৫% পর্যন্ত সরকারি ভর্তুকি পেতে পারেন। সাধারণ শ্রেণির ক্ষেত্রে ২৫% ভর্তুকি দেওয়া হয়। ম্যানুফ্যাকচারিংয়ের জন্য সর্বোচ্চ ৫০ লাখ এবং সেবার জন্য ২০ লাখ টাকা পর্যন্ত প্রকল্প গ্রহণযোগ্য। নিজস্ব বিনিয়োগ মাত্র ৫% থেকে ১০%।',
      mr: 'PMEGP योजनेनुसार (KVIC 2024-25), ग्रामीण भागातील विशेष प्रवर्गातील लाभार्थींना (महिला, SC/ST, OBC) 35% भांडवली अनुदान मिळते. सर्वसाधारण प्रवर्गाला 25% अनुदान मिळते. उत्पादनासाठी कमाल ₹50 लाख व सेवा उद्योगांसाठी ₹20 लाखांपर्यंत कर्ज उपलब्ध आहे. स्वतःचे भांडवल केवळ 5% ते 10% आवश्यक असते.',
      gu: 'PMEGP યોજના (KVIC 2024-25) હેઠળ, ગ્રામીણ વિસ્તારમાં વિશેષ વર્ગ (મહિલાઓ, SC/ST, OBC) ને 35% સુધી મૂડી સબસિડી મળે છે. સામાન્ય વર્ગને ગ્રામીણ ક્ષેત્રમાં 25% સબસિડી મળે છે. ઉત્પાદન માટે મહત્તમ ₹50 લાખ અને સેવા માટે ₹20 લાખ સુધીની મર્યાદા છે. તમારું પોતાનું રોકાણ માત્ર 5% થી 10% જ રહે છે.',
    },
    moratorium: {
      en: 'As per Reserve Bank of India & Indian Banks Association (IBA) credit guidelines, bank term loans provide a 3 to 12 month moratorium (repayment holiday). During this grace period, your principal repayment is paused and you only pay nominal simple interest. Regular EMI only starts after your machinery is operational and cash flow begins.',
      hi: 'भारतीय रिज़र्व बैंक (RBI) व IBA दिशानिर्देशों के अनुसार, मशीनरी और प्लांट लगाने के लिए 3 से 12 महीने का मोराटोरियम (छूट अवधि) दिया जाता है। इस दौरान मूलधन की किस्त नहीं देनी होती, केवल साधारण ब्याज लगता है। नियमित EMI उत्पादन और कमाई शुरू होने के बाद ही चालू होती है।',
      te: 'RBI & IBA మార్గదర్శకాల ప్రకారం, పరిశ్రమ స్థాపనకు 3 నుండి 12 నెలల మొరటోరియం (గడువు) లభిస్తుంది. ఈ కాలంలో అసలు వాయిదా చెల్లించాల్సిన పనిలేదు, కేవలం సాధారణ వడ్డీ మాత్రమే వర్తిస్తుంది. వ్యాపార ఉత్పత్తి ప్రారంభమై ఆదాయం వచ్చిన తర్వాతే రెగ్యులర్ EMI మొదలవుతుంది.',
      ta: 'RBI மற்றும் IBA விதிமுறைகளின்படி, இயந்திரங்கள் அமைக்கும் காலத்தில் 3 முதல் 12 மாதங்கள் வரை அவகாச காலம் (Moratorium) வழங்கப்படுகிறது. இக்காலத்தில் அசல் தவணை கட்ட தேவையில்லை, எளிய வட்டி மட்டுமே கணக்கிடப்படும். வணிக உற்பத்தி துவங்கிய பின்னரே முழு EMI தவணை துவங்கும்.',
      kn: 'RBI & IBA ಮಾರ್ಗಸೂಚಿಗಳ ಪ್ರಕಾರ, ಘಟಕ ಸ್ಥಾಪನೆಯ ಸಮಯದಲ್ಲಿ 3 ರಿಂದ 12 ತಿಂಗಳ ಮೊರಟೋರಿಯಂ (ವಿಶ್ರಾಂತಿ ಅವಧಿ) ಸಿಗುತ್ತದೆ. ಈ ಅವಧಿಯಲ್ಲಿ ಅಸಲು ಕಂತು ಕಟ್ಟಬೇಕಿಲ್ಲ, ಕೇವಲ ಸರಳ ಬಡ್ಡಿ ಮಾತ್ರ ಇರುತ್ತದೆ. ನಿಯಮಿತ EMI ಆದಾಯ ಆರಂಭವಾದ ನಂತರವೇ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
      bn: 'RBI এবং IBA নির্দেশিকা অনুসারে, মেশিনপত্র স্থাপনের সময়ে ৩ থেকে ১২ মাসের মোরেটোরিয়াম দেওয়া হয়। এই সময়ে মূল ঋণের কিস্তি দিতে হয় না, শুধু সাধারণ সুদ দিতে হয়। বাণিজ্যিক উৎপাদন শুরু হলে তবেই নিয়মিত EMI চালু হয়।',
      mr: 'RBI व IBA नियमांनुसार, व्यवसाय उभारणीच्या काळात 3 ते 12 महिन्यांचा मोरेटोरियम (सवलत कालावधी) मिळतो. या काळात मुद्दल हप्ता भरावा लागत नाही, केवळ साधे व्याज आकारले जाते. उत्पादन व उत्पन्न सुरू झाल्यावरच नियमित EMI सुरू होतो.',
      gu: 'RBI અને IBA માર્ગદર્શિકા મુજબ, મશીનરી સ્થાપના દરમિયાન 3 થી 12 મહિનાનો મોરેટોરિયમ મળે છે. આ સમય દરમિયાન મૂળ રકમનો હપ્તો ભરવાનો રહેતો નથી, માત્ર સાદું વ્યાજ જ ગણાય છે. વ્યવસાય શરૂ થઈને આવક આવ્યા પછી જ નિયમિત EMI શરૂ થાય છે.',
    },
    dairy: {
      en: 'For a 2-cow modern crossbred dairy unit, NABARD project models estimate total setup cost at ₹1.8 to ₹2.2 Lakhs. You can finance this under PM MUDRA or Kisan Credit Card (Animal Husbandry) without mortgaging land. Expected milk output is 24–28 litres/day, yielding ₹35,000–₹42,000 monthly income with bi-weekly milk cooperative settlements.',
      hi: 'नाबार्ड (NABARD) के मॉडल अनुसार 2 संकर गायों की आधुनिक डेयरी इकाई में ₹1.8 से ₹2.2 लाख की कुल लागत आती है। इसके लिए आप बिना जमीन गिरवी रखे मुद्रा लोन या पशुपालन KCC के तहत वित्तपोषण ले सकते हैं। प्रतिदिन 24-28 लीटर दूध से हर महीने ₹35,000 से ₹42,000 की आमदनी होती है।',
      te: 'నాబార్డ్ (NABARD) మోడల్ ప్రకారం 2 పాడి ఆవుల ఆధునిక యూనిట్‌కు ₹1.8 నుండి ₹2.2 లక్షల ఖర్చు అవుతుంది. భూమి తాకట్టు లేకుండానే ముద్ర లేదా పాడి KCC కింద రుణం పొందవచ్చు. రోజుకు 24–28 లీటర్ల పాలతో నెలకు ₹35,000 నుండి ₹42,000 వరకు నికరాదాయం వస్తుంది.',
      ta: 'நபார்டு (NABARD) திட்டப்படி 2 கலப்பின கறவை மாடுகள் கொண்ட பால் பண்ணைக்கு ₹1.8 முதல் ₹2.2 லட்சம் முதலீடு தேவைப்படும். நில அடமானம் இல்லாமலே முத்ரா அல்லது கிசான் கிரெடிட் கார்டு மூலம் கடன் பெறலாம். நாள் ஒன்றுக்கு 24–28 லிட்டர் பால் மூலம் மாதம் ₹35,000 முதல் ₹42,000 வரை வருமானம் ஈட்டலாம்.',
      kn: 'ನಬಾರ್ಡ್ (NABARD) ಮಾದರಿಯಂತೆ 2 ಹಸುಗಳ ಹೈನುಗಾರಿಕೆ ಘಟಕಕ್ಕೆ ₹1.8 ರಿಂದ ₹2.2 ಲಕ್ಷ ವೆಚ್ಚವಾಗುತ್ತದೆ. ಯಾವುದೇ ಜಮೀನು ಅಡಮಾನವಿಲ್ಲದೆ ಮುದ್ರಾ ಅಥವಾ ಪಶುಪಾಲನಾ KCC ಸಾಲ ಪಡೆಯಬಹುದು. ದಿನಕ್ಕೆ 24-28 ಲೀಟರ್ ಹಾಲಿನಿಂದ ತಿಂಗಳಿಗೆ ₹35,000 ದಿಂದ ₹42,000 ವರೆಗೆ ಆದಾಯ ಗಳಿಸಬಹುದು.',
      bn: 'নাবার্ড (NABARD) মডেল অনুযায়ী ২টি সংকর গাভীর ডেইরি ইউনিটে মোট ১.৮ থেকে ২.২ লাখ টাকা খরচ হয়। কোনো জমি বন্ধক না রেখেই মুদ্রা লোন বা কিষাণ ক্রেডিট কার্ডের মাধ্যমে ঋণ পাওয়া যায়। দৈনিক ২৪-২৮ লিটার দুধে মাসে ৩৫,০০০ থেকে ৪২,০০০ টাকা উপার্জন সম্ভব।',
      mr: 'नाबार्ड (NABARD) मॉडेलनुसार 2 संकरित गायींच्या डेअरीसाठी ₹1.8 ते ₹2.2 लाखांचा खर्च येतो. जमीन गहाण न ठेवता मुद्रा योजना किंवा पशुसंवर्धन KCC अंतर्गत कर्ज मिळते. दररोज 24 ते 28 लिटर दुधातून महिन्याला ₹35,000 ते ₹42,000 उत्पन्न मिळू शकते.',
      gu: 'નાબાર્ડ (NABARD) મોડેલ મુજબ 2 સંકર ગાયોની ડેરી યુનિટ માટે કુલ ₹1.8 થી ₹2.2 લાખનો ખર્ચ થાય છે. જમીન ગીરો મૂક્યા વગર મુદ્રા અથવા પશુપાલન KCC હેઠળ લોન મળે છે. રોજ 24–28 લિટર દૂધથી મહિને ₹35,000 થી ₹42,000 ની ચોખ્ખી કમાણી થાય છે.',
    },
    collateral: {
      en: 'Under RBI Master Circular FIDD.MSME & NFS.BC.No.3/06.02.31/2023-24, banks are strictly prohibited from demanding third-party collateral security or mortgaging agricultural land for micro loans up to ₹10 Lakhs. The entire loan risk is guaranteed by the Govt of India through CGTMSE / CGFMU.',
      hi: 'आरबीआई के मास्टर सर्कुलर (FIDD.MSME.2024) के अनुसार, ₹10 लाख तक के सूक्ष्म व्यवसाय लोन के लिए बैंक आपसे जमीन, मकान या कोई भी संपत्ति गिरवी (Collateral) नहीं मांग सकते। इस ऋण की शत-प्रतिशत गारंटी केंद्र सरकार की CGTMSE योजना द्वारा बैंक को दी जाती है।',
      te: 'RBI మాస్టర్ సర్క్యులర్ ప్రకారం, ₹10 లక్షల వరకు ఇచ్చే మైక్రో లోన్ల కోసం బ్యాంకులు భూమి, ఇల్లు తాకట్టు లేదా పూచీకత్తు (Collateral) అడగడం నిషిద్ధం. దీనికి కేంద్ర ప్రభుత్వ CGTMSE ద్వారా బ్యాంకుకు పూర్తి పూచీకత్తు గ్యారెంటీ లభిస్తుంది.',
      ta: 'ரிசர்வ் வங்கியின் (RBI) வழிகாட்டுதலின்படி, ₹10 லட்சம் வரையிலான தொழில் கடன்களுக்கு வங்கிகள் நில அடமானமோ அல்லது மூன்றாம் நபர் உத்தரவாதமோ (Collateral) கேட்கக் கூடாது. மத்திய அரசின் CGTMSE இக்கடனுக்கு முழு உத்தரவாதம் அளிக்கிறது.',
      kn: 'RBI ಮಾಸ್ಟರ್ ಸುತ್ತೋಲೆಯ ಪ್ರಕಾರ, ₹10 ಲಕ್ಷದವರೆಗಿನ ಕಿರು ಸಾಲಗಳಿಗೆ ಬ್ಯಾಂಕುಗಳು ಯಾವುದೇ ಜಮೀನು, ಮನೆ ಅಡಮಾನ (ಕೊಲ್ಯಾಟರಲ್) ಕೇಳುವಂತಿಲ್ಲ. ಕೇಂದ್ರ ಸರ್ಕಾರದ CGTMSE ಯೋಜನೆಯು ಈ ಸಾಲಕ್ಕೆ ಸಂಪೂರ್ಣ ಭದ್ರತಾ ಗ್ಯಾರಂಟಿ ನೀಡುತ್ತದೆ.',
      bn: 'আরবিআই (RBI) মাস্টার সার্কুলার অনুযায়ী, ১০ লাখ টাকা পর্যন্ত ঋণের জন্য ব্যাংক কোনো জমি বা বাড়ি বন্ধক (Collateral) চাইতে পারে না। এই ঋণের ঝুঁকি সম্পূর্ণভাবে ভারত সরকারের CGTMSE প্রকল্পের মাধ্যমে গ্যারান্টিযুক্ত।',
      mr: 'आरबीआयच्या (RBI) परिपत्रकानुसार, ₹10 लाखांपर्यंतच्या सूक्ष्म व्यवसायाच्या कर्जासाठी बँकांना जमीन किंवा घर गहाण मागण्यास सक्त मनाई आहे. या कर्जाची संपूर्ण हमी केंद्र सरकारच्या CGTMSE द्वारे दिली जाते.',
      gu: 'RBI માસ્ટર પરિપત્ર અનુસાર, ₹10 લાખ સુધીની લોન માટે બેંકો તમારી પાસે જમીન કે મિલકત ગીરો (Collateral) માંગી શકતી નથી. આ લોનનું જોખમ ભારત સરકારની CGTMSE યોજના દ્વારા 100% સુરક્ષિત રહે છે.',
    },
    food: {
      en: 'Micro food processing projects (cold-press oil, spice grinding, flour milling) qualify for a 35% credit-linked capital subsidy up to ₹10 Lakhs under the PMFME scheme. You only need a basic FSSAI registration and an equipment quotation to apply on the JanSamarth portal.',
      hi: 'खाद्य प्रसंस्करण इकाइयों (कच्ची घानी तेल, मसाला पिसाई, आटा चक्की) को PMFME योजना के तहत ₹10 लाख तक 35% की क्रेडिट-लिंक्ड पूंजीगत सब्सिडी मिलती है। आवेदन के लिए केवल बेसिक FSSAI प्रमाण पत्र और मशीनरी कोटेशन की आवश्यकता होती है।',
      te: 'ఆహార శుద్ధి ప్రాజెక్టులకు (గానుగ నూనె, మసాలా పొడులు, పిండి మిల్లు) PMFME పథకం కింద ₹10 లక్షల వరకు 35% సబ్సిడీ లభిస్తుంది. దీని కోసం ప్రాథమిక FSSAI రిజిస్ట్రేషన్ మరియు యంత్రాల కొటేషన్ ఉంటే సరిపోతుంది.',
      ta: 'உணவு பதப்படுத்தும் தொழில்களுக்கு (மரச்செக்கு எண்ணெய், மசாலா பொடி, மாவு மில்) PMFME திட்டத்தின் கீழ் ₹10 லட்சம் வரை 35% மூலதன மானியம் வழங்கப்படுகிறது. அடிப்படை FSSAI பதிவு மற்றும் இயந்திர விலைப்பட்டியல் மட்டும் போதுமானது.',
      kn: 'ಆಹಾರ ಸಂಸ್ಕರಣಾ ಘಟಕಗಳಿಗೆ (ಎಣ್ಣೆ ಗಾಣ, ಮಸಾಲೆ ಪುಡಿ, ಹಿಟ್ಟಿನ ಗಿರಣಿ) PMFME ಯೋಜನೆಯಡಿ ₹10 ಲಕ್ಷದವರೆಗೆ 35% ಸಬ್ಸಿಡಿ ಲಭ್ಯವಿದೆ. ಮೂಲ FSSAI ನೋಂದಣಿ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ಕೊಟೇಶನ್ ಇದ್ದರೆ ಸುಲಭವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
      bn: 'খাদ্য প্রক্রিয়াকরণ উদ্যোগে (ঘানি তেল, মশলা গুঁড়া, আটা কল) PMFME প্রকল্পের অধীনে ১০ লাখ টাকা পর্যন্ত ৩৫% ভর্তুকি পাওয়া যায়। শুধুমাত্র সাধারণ FSSAI লাইসেন্স এবং যন্ত্রপাতির বিল দিয়ে আবেদন করা যায়।',
      mr: 'अन्न प्रक्रिया उद्योगांना (घाणी तेल, मसाला उद्योग, पिठाची गिरणी) PMFME योजनेअंतर्गत ₹10 लाखांपर्यंत 35% सबसिडी मिळते. यासाठी केवळ प्राथमिक FSSAI नोंदणी व मशिनरीचे कोटेशन आवश्यक असते.',
      gu: 'ફૂડ પ્રોસેસિંગ એકમો (ઘાણી તેલ, મસાલા પિલાણ, લોટ મિલ) ને PMFME યોજના હેઠળ ₹10 લાખ સુધી 35% સબસિડી મળે છે. આ માટે માત્ર બેઝિક FSSAI રજીસ્ટ્રેશન અને મશીનરીના ક્વોટેશનની જરૂર પડે છે.',
    },
    general: {
      en: `Under official RBI and Ministry of MSME guidelines, your venture qualifies for up to 35% subsidy under PMEGP or collateral-free loans up to ₹10 Lakhs under Mudra. You can apply directly on the JanSamarth portal with your Aadhaar, bank passbook, and vendor proforma invoice.`,
      hi: `आरबीआई और एमएसएमई मंत्रालय के नियमों के अनुसार, आपके व्यवसाय को PMEGP में 35% तक की सब्सिडी या मुद्रा योजना में ₹10 लाख तक का बिना गारंटी लोन मिल सकता है। आप जनसमर्थ पोर्टल पर आधार, बैंक पासबुक और मशीनरी कोटेशन के साथ आवेदन कर सकते हैं।`,
      te: `RBI మరియు MSME మార్గదర్శకాల ప్రకారం, మీ వ్యాపారానికి PMEGP కింద 35% వరకు సబ్సిడీ లేదా ముద్ర కింద ₹10 లక్షల వరకు పూచీకత్తు లేని రుణం లభిస్తుంది. మీరు జన్ సమర్థ్ (JanSamarth) పోర్టల్‌లో ఆధార్ మరియు బ్యాంక్ వివరాలతో దరఖాస్తు చేసుకోవచ్చు.`,
      ta: `மத்திய அரசின் வழிகாட்டுதலின்படி, உங்கள் தொழிலுக்கு PMEGP திட்டத்தில் 35% மானியம் அல்லது முத்ரா திட்டத்தில் ₹10 லட்சம் வரை பிணையில்லா கடன் பெறலாம். ஜன்சமர்த் (JanSamarth) போர்ட்டலில் உடனடியாக விண்ணப்பிக்கலாம்.`,
      kn: `RBI ಮತ್ತು MSME ನಿಯಮಗಳ ಪ್ರಕಾರ, ನಿಮ್ಮ ಉದ್ಯಮಕ್ಕೆ PMEGP ಅಡಿಯಲ್ಲಿ 35% ವರೆಗೆ ಸಬ್ಸಿಡಿ ಅಥವಾ ಮುದ್ರಾ ಅಡಿಯಲ್ಲಿ ₹10 ಲಕ್ಷದವರೆಗೆ ಜಾಮೀನು ರಹಿತ ಸಾಲ ಸಿಗುತ್ತದೆ. ಜನಸಮರ್ಥ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.`,
      bn: `সরকারি নির্দেশিকা অনুসারে আপনার ব্যবসায় PMEGP-তে ৩৫% পর্যন্ত ভর্তুকি অথবা মুদ্রায় ১০ লাখ টাকা পর্যন্ত বন্ধকমুক্ত ঋণ পাওয়া যাবে। জনসমর্থ পোর্টালে সরাসরি আবেদন করা যায়।`,
      mr: `शासकीय नियमांनुसार आपल्या व्यवसायाला PMEGP मध्ये 35% पर्यंत सबसिडी किंवा मुद्रा योजनेत ₹10 लाखांपर्यंत तारणमुक्त कर्ज मिळते. जनसमर्थ पोर्टलवर थेट अर्ज करता येतो.`,
      gu: `સરકારી નિયમો મુજબ તમારા વ્યવસાયને PMEGP માં 35% સુધી સબસિડી અથવા મુદ્રા યોજનામાં ₹10 લાખ સુધી તારણમુક્ત લોન મળે છે. જનસમર્થ પોર્ટલ પર સીધી અરજી કરી શકો છો.`,
    },
  };

  const selectedTopicAnswers = ANSWERS[topic] || ANSWERS.general;
  const answer = selectedTopicAnswers[lang] || selectedTopicAnswers.en;

  return {
    answer,
    retrievedChunks: topChunks,
  };
}
