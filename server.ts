import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

// Built-in statutory RAG knowledge chunks for server-side grounding
const REGULATORY_CHUNKS = [
  {
    id: 'rag_pmegp_subsidy',
    title: 'PMEGP Subsidy Rates & Margin Money Norms (KVIC)',
    authority: 'Ministry of MSME & KVIC',
    date: '2024-25 Guidelines',
    chunk: 'For Rural areas, special category beneficiaries (SC, ST, OBC, Minorities, Women, Ex-servicemen, Differently-abled) receive 35% margin money capital subsidy with only 5% own contribution. General category in rural receives 25% subsidy with 10% own contribution. Max project cost is Rs 50 Lakhs for manufacturing and Rs 20 Lakhs for services.',
  },
  {
    id: 'rag_cgtmse_collateral',
    title: 'RBI Collateral Exemption & CGTMSE Guarantee up to Rs 10 Lakhs',
    authority: 'Reserve Bank of India (RBI)',
    date: 'FIDD.MSME.BC.No.12/06.02.31/2024-25',
    chunk: 'RBI Master Directions - Priority Sector Lending: Banks are mandated not to accept collateral security in the case of loans up to Rs 10 Lakhs extended to units in the Micro Enterprises sector under PMEGP or MUDRA. Credit guarantee is provided through CGTMSE without imposing any mortgage on rural agricultural land or residential house.',
  },
  {
    id: 'rag_moratorium_guidelines',
    title: 'Moratorium & Grace Period Standards for Agricultural and MSME Term Loans',
    authority: 'RBI & Indian Banks Association (IBA)',
    date: 'Master Directions 2024',
    chunk: 'Term loans for manufacturing micro-enterprises are entitled to an initial moratorium (grace period) ranging from 3 to 12 months depending on project gestation. During this moratorium period, repayment of principal is suspended. The borrower is required only to service simple monthly interest on disbursed amounts. Regular EMI commences once commercial production begins.',
  },
  {
    id: 'rag_fssai_licensing',
    title: 'Food Safety and Standards (Licensing and Registration) for Rural Food Units',
    authority: 'FSSAI, Ministry of Health and Family Welfare',
    date: 'Notification 2024',
    chunk: 'Petty food business operators with annual turnover not exceeding Rs 12 Lakhs or manufacturing capacity up to 100 kg/ltr per day only require basic FSSAI Registration Certificate (Form A, Fee Rs 100/yr), not a full State License. Mandatory hygiene requirements include potable water testing, clean stainless steel contact surfaces, and food handler medical fitness.',
  },
  {
    id: 'rag_nabard_dairy',
    title: 'NABARD Model Bankable Project on 2-Cow Mini Dairy Unit',
    authority: 'National Bank for Agriculture and Rural Development (NABARD)',
    date: 'Farm Sector Division 2024',
    chunk: 'Two Crossbred Cows (Jersey / HF Cross) yield 24-28 litres/day. Average capital expenditure is Rs 1,40,000 for cows, Rs 30,000 for shed, and Rs 15,000 for milking buckets and chaff cutter. Net monthly profit after feed cost, green fodder cultivation, and veterinary care is Rs 18,000 to Rs 24,000. DSCR averages 1.95x over a 5-year repayment tenure.',
  },
  {
    id: 'rag_pmfme_scheme',
    title: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    authority: 'Ministry of Food Processing Industries (MoFPI)',
    date: '2024 Guidelines',
    chunk: 'Under PMFME, existing or new micro food processing units (flour mills, spice processing, cold-pressed oil, fruit pulping) receive 35% credit-linked capital subsidy with a maximum ceiling of Rs 10 Lakhs per enterprise. Handholding support is provided for DPR preparation and FSSAI/Udyam compliance.',
  },
  {
    id: 'rag_mudra_categories',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY) Loan Tiers & Refinance',
    authority: 'MUDRA & Department of Financial Services (DFS)',
    date: '2024-25',
    chunk: 'MUDRA provides collateral-free loans across three categories: Shishu (loans up to Rs 50,000), Kishor (loans from Rs 50,001 to Rs 5,00,000), and Tarun (loans from Rs 5,00,001 to Rs 10,00,000). Covered under Credit Guarantee Fund for Micro Units (CGFMU). No processing fees for Shishu and Kishor loans.',
  },
  {
    id: 'rag_jansamarth_workflow',
    title: 'JanSamarth Portal Digital Single-Window Lending Mechanism',
    authority: 'Ministry of Finance & IBA',
    date: 'JanSamarth Platform Norms 2024',
    chunk: 'JanSamarth is the official government platform for 13 credit-linked subsidy schemes including PMEGP and Mudra. Digital verification of Aadhaar, PAN, and Udyam ensures in-principle digital sanction letters before visiting local bank branches, preventing arbitrary rejections.',
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API Multi-Turn RAG Advisor Endpoint
  app.post('/api/advisor', async (req, res) => {
    try {
      const {
        question,
        history = [],
        model = 'gemini-3.5-flash',
        lang = 'en',
        userProfile,
        location,
        activeIdea,
        loanCalc,
      } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      // Model resolution based on task guidelines:
      // gemini-3.5-flash for general tasks
      // gemini-3.1-flash-lite for tasks that should happen fast
      // gemini-3.1-pro-preview for particularly complex tasks
      let targetModel = 'gemini-3.5-flash';
      if (model === 'gemini-3.1-flash-lite') {
        targetModel = 'gemini-3.1-flash-lite';
      } else if (model === 'gemini-3.1-pro-preview') {
        targetModel = 'gemini-3.1-pro-preview';
      }

      // Keyword & Semantic Scoring against RAG Regulatory Chunks
      const fullQueryContext = `${question} ${history.slice(-2).map((h: any) => h.text).join(' ')}`.toLowerCase();
      const scoredChunks = REGULATORY_CHUNKS.map((chunk) => {
        let score = 0;
        const text = (chunk.title + ' ' + chunk.chunk + ' ' + chunk.authority).toLowerCase();
        const keywords = fullQueryContext.split(/\s+/).filter((w) => w.length > 2);
        keywords.forEach((kw) => {
          if (text.includes(kw)) score += 10;
        });
        if (fullQueryContext.includes('subsidy') && text.includes('subsidy')) score += 25;
        if (fullQueryContext.includes('pmegp') && text.includes('pmegp')) score += 30;
        if ((fullQueryContext.includes('moratorium') || fullQueryContext.includes('grace') || fullQueryContext.includes('emi')) && text.includes('moratorium')) score += 30;
        if ((fullQueryContext.includes('dairy') || fullQueryContext.includes('cow') || fullQueryContext.includes('cattle') || fullQueryContext.includes('milk')) && text.includes('dairy')) score += 30;
        if ((fullQueryContext.includes('collateral') || fullQueryContext.includes('security') || fullQueryContext.includes('mortgage') || fullQueryContext.includes('guarantee')) && text.includes('collateral')) score += 30;
        if ((fullQueryContext.includes('mudra') || fullQueryContext.includes('shishu') || fullQueryContext.includes('kishor') || fullQueryContext.includes('tarun')) && text.includes('mudra')) score += 30;
        if ((fullQueryContext.includes('food') || fullQueryContext.includes('oil') || fullQueryContext.includes('spice') || fullQueryContext.includes('flour')) && text.includes('food')) score += 25;
        if ((fullQueryContext.includes('jansamarth') || fullQueryContext.includes('portal') || fullQueryContext.includes('apply')) && text.includes('jansamarth')) score += 30;

        return { chunk, score };
      }).sort((a, b) => b.score - a.score);

      const topMatched = scoredChunks.filter((s) => s.score > 0).map((s) => s.chunk);
      const selectedChunks = topMatched.length > 0 ? topMatched.slice(0, 3) : REGULATORY_CHUNKS.slice(0, 2);

      const ragContextText = selectedChunks
        .map((c) => `[Statutory Policy Reference: ${c.title} | Authority: ${c.authority} (${c.date})]\n"${c.chunk}"`)
        .join('\n\n');

      const systemInstruction = `You are "Aarambh Sathi" (आरंभ साथी), an expert, responsible, and empathetic AI rural enterprise and bank credit counselor in India.
Your mission is to provide responsible, financially prudent, and legally grounded guidance tailored directly to the entrepreneur's exact inputs, background, and business proposal.

CORE PRINCIPLES OF RESPONSIBLE ADVICE:
1. RESPONSIBLE & RESPONSIVE TO USER INPUT:
   - Carefully analyze whatever specific information the user inputs: their exact budget/capex figures, personal savings, proposed venture, location, social category, credit standing, equipment needs, or doubts.
   - If the user asks about specific capex (e.g., ₹3 Lakhs) or savings (e.g., ₹40,000), compute and verify the exact figures: Promoter Margin required (5% for Special Category/Women, 10% for General Category in rural PMEGP), eligible Capital Subsidy (up to 35% in Rural Special, 25% in Rural General), Net Bank Term Loan, and estimated monthly EMI.
   - If the user asks about loans, remind them responsibly about credit discipline: never take informal village moneylender loans at 36-60% interest, explain that timely repayment of bank loans builds CIBIL credit history and qualifies them for 2nd stage PMEGP expansion loans up to ₹1 Crore.
   - If their proposed debt service or operational plan is risky (e.g., insufficient working capital or overleveraged capex), responsibly flag the risk and suggest practical ways to right-size the project or add a working capital cash credit (CC) facility.

2. MULTI-TURN CONVERSATION CONTINUITY:
   - You are part of an ongoing multi-turn conversation.
   - Maintain context across turns. When the user asks follow-up questions (e.g., "What about electricity?", "How do I apply on JanSamarth?", "Can the bank reject my loan without collateral?"), refer back to their earlier inputs.

3. STATUTORY ACCURACY & MANDATORY CITATIONS:
   - Base your advice strictly on official statutory guidelines:
     * PMEGP (KVIC/Ministry of MSME 2024-25): Rural special category gets 35% margin money subsidy; general category gets 25%. Own contribution 5% (special) or 10% (general).
     * RBI Collateral Directive (Master Direction FIDD.MSME.BC.No.12/06.02.31/2024-25): Banks are strictly mandated NOT to demand collateral security or mortgage of agricultural land for micro loans up to ₹10 Lakhs. Covered by CGTMSE.
     * RBI/IBA Moratorium Norms: 3 to 12 months grace period on principal repayment during plant installation/machinery setup. Only simple interest during grace period.
     * FSSAI Petty Operator Norms: Annual turnover < ₹12 Lakhs only requires ₹100 basic registration (Form A), not state license.
     * NABARD Models: Farm sector models (dairy, poultry, fisheries) with benchmark capital costs and bankable DSCR.
     * JanSamarth Portal: Single-window digital platform for transparent digital loan tracking directly to nominated public sector or regional rural banks (RRBs).

4. MULTILINGUAL RESPONSIVENESS:
   - The user has selected language code: "${lang}".
   - You MUST formulate your entire reply in the requested language:
     * "hi": Pure, natural Hindi (हिन्दी)
     * "te": Natural, encouraging Telugu (తెలుగు)
     * "ta": Tamil (தமிழ்)
     * "kn": Kannada (ಕನ್ನಡ)
     * "bn": Bengali (বাংলা)
     * "mr": Marathi (मराठी)
     * "gu": Gujarati (ગુજરાતી)
     * "en": Clear, simple English
   - Use clear formatting with bullet points, bold highlights for key financial figures and statutory sections, and an encouraging, respectful tone.

APPLICANT'S PROFILE CONTEXT:
- Name: ${userProfile?.name || 'Entrepreneur'}
- Social Category: ${userProfile?.category || 'Special (SC/ST/OBC/Women)'} (Qualifies for 35% Rural Subsidy, 5% margin)
- Gender: ${userProfile?.gender || 'Not specified'}
- Education: ${userProfile?.education || '10th'}
- Location: ${userProfile?.townCity || location?.village || 'Village'}, ${location?.district || 'Warangal'}, ${location?.state || 'Telangana'} (${location?.classification || 'Rural'})
- Existing Savings: ₹${userProfile?.ownSavings || '65,000'} | Existing Debt: ₹${userProfile?.existingDebt || '0'}
- Credit Band: ${userProfile?.creditBand || 'Good'}
- Active Proposal: ${activeIdea?.name?.[lang] || activeIdea?.name?.en || 'Agro / Micro-Manufacturing'}
- Estimated Capex: ₹${loanCalc?.capex || activeIdea?.fixedCapex || '2,20,000'}
- Expected Subsidy: ₹${loanCalc?.subsidyAmount || '77,000'} (35%)
- Net Bank Loan: ₹${loanCalc?.netLoan || '1,32,000'} | Regular EMI: ₹${loanCalc?.regularEmi || '3,506'}/mo
- DSCR Safety Ratio: ${loanCalc?.dscr || '2.10'}x

STATUTORY REFERENCE KNOWLEDGE BASE:
${ragContextText}`;

      const gemini = getGemini();

      if (gemini) {
        // Build multi-turn contents array
        const contentsPayload: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history) && history.length > 0) {
          for (const item of history) {
            const r = item.role === 'model' || item.sender === 'ai' ? 'model' : 'user';
            const textContent = String(item.text || item.content || '').trim();
            if (textContent) {
              contentsPayload.push({
                role: r,
                parts: [{ text: textContent }],
              });
            }
          }
        }

        // Gemini contents must start with a 'user' turn
        while (contentsPayload.length > 0 && contentsPayload[0].role !== 'user') {
          contentsPayload.shift();
        }

        // Append the current turn
        contentsPayload.push({
          role: 'user',
          parts: [{ text: question }],
        });

        try {
          const response = await gemini.models.generateContent({
            model: targetModel,
            contents: contentsPayload,
            config: {
              systemInstruction,
              temperature: 0.65,
            },
          });

          const answerText = response.text?.trim();
          if (answerText) {
            return res.json({
              answer: answerText,
              retrievedChunks: selectedChunks,
              modelUsed: targetModel,
            });
          }
        } catch (apiErr: any) {
          console.warn(`Gemini generation with ${targetModel} error:`, apiErr?.message || apiErr);
          // If gemini-3.1-pro-preview failed (e.g. requires paid key), retry with gemini-3.5-flash
          if (targetModel === 'gemini-3.1-pro-preview') {
            try {
              const fallbackResponse = await gemini.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: contentsPayload,
                config: {
                  systemInstruction,
                  temperature: 0.65,
                },
              });
              const fallbackText = fallbackResponse.text?.trim();
              if (fallbackText) {
                return res.json({
                  answer: fallbackText,
                  retrievedChunks: selectedChunks,
                  modelUsed: 'gemini-3.5-flash (Auto-Switched from Pro)',
                });
              }
            } catch (retryErr) {
              console.warn('Gemini 3.5 Flash retry also failed:', retryErr);
            }
          }
        }
      }

      // Context-aware responsible fallback engine tailored to the exact input
      const qLower = question.toLowerCase();
      const extractedNumberMatch = question.match(/(?:rs\.?|₹|\binr\b)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)\s*(lakh|lakhs|k|thousand|cr)?/i);
      let mentionedAmount: number | null = null;
      if (extractedNumberMatch) {
        const rawNum = parseFloat(extractedNumberMatch[1].replace(/,/g, ''));
        const unit = (extractedNumberMatch[2] || '').toLowerCase();
        if (unit.startsWith('lakh')) mentionedAmount = rawNum * 100000;
        else if (unit === 'k' || unit.startsWith('thous')) mentionedAmount = rawNum * 1000;
        else if (unit.startsWith('cr')) mentionedAmount = rawNum * 10000000;
        else mentionedAmount = rawNum;
      }

      const isSpecialCat = userProfile?.category === 'special' || userProfile?.gender === 'female';
      const subsidyPct = isSpecialCat ? 35 : 25;
      const marginPct = isSpecialCat ? 5 : 10;
      const baseCapex = mentionedAmount || loanCalc?.capex || activeIdea?.fixedCapex || 220000;
      const calcSubsidy = Math.round(baseCapex * (subsidyPct / 100));
      const calcMargin = Math.round(baseCapex * (marginPct / 100));
      const calcNetLoan = baseCapex - calcMargin;
      const estEmi = Math.round((calcNetLoan * 0.095) / 12 + (calcNetLoan / 60));

      let fallbackText = '';

      if (qLower.includes('subsidy') || qLower.includes('pmegp') || qLower.includes('सब्सिडी') || qLower.includes('సబ్సిడీ') || qLower.includes('மானியம்')) {
        if (lang === 'hi') {
          fallbackText = `आपके इनपुट और प्रोफाइल के अनुसार सटीक सब्सिडी विश्लेषण:\n\n• **PMEGP योजना (KVIC 2024-25)**: ग्रामीण क्षेत्र में ${isSpecialCat ? 'विशेष वर्ग (महिला/SC/ST/OBC)' : 'सामान्य वर्ग'} होने के नाते आपको **${subsidyPct}% पूंजीगत सब्सिडी** मिलेगी।\n• **परियोजना लागत (Capex)**: ₹${baseCapex.toLocaleString('en-IN')}\n• **सब्सिडी राशि**: **₹${calcSubsidy.toLocaleString('en-IN')}** (यह सीधे बैंक में मार्जिन मनी के रूप में जमा होती है)\n• **आपकी स्वयं की पूंजी (मार्जिन)**: सिर्फ **${marginPct}% (₹${calcMargin.toLocaleString('en-IN')})**\n• **नेट बैंक टर्म लोन**: ₹${calcNetLoan.toLocaleString('en-IN')} (मासिक EMI लगभग ₹${estEmi.toLocaleString('en-IN')})\n\n💡 **आवेदन प्रक्रिया**: आप जनसमर्थ पोर्टल (JanSamarth.in) पर आधार, पैन, और मशीनरी कोटेशन के साथ ऑनलाइन आवेदन कर सकते हैं।`;
        } else if (lang === 'te') {
          fallbackText = `మీరు ఇచ్చిన వివరాల ప్రకారం బాధ్యతాయుతమైన సబ్సిడీ మరియు ఆర్థిక విశ్లేషణ:\n\n• **PMEGP పథకం (KVIC 2024-25)**: గ్రామీణ ప్రాంతంలో ${isSpecialCat ? 'ప్రత్యేక వర్గం (మహిళలు/SC/ST/OBC)' : 'సాధారణ వర్గం'} కింద మీకు **${subsidyPct}% మూలధన సబ్సిడీ** లభిస్తుంది.\n• **ప్రాజెక్ట్ ఖర్చు (Capex)**: ₹${baseCapex.toLocaleString('en-IN')}\n• **ప్రభుత్వ సబ్సిడీ**: **₹${calcSubsidy.toLocaleString('en-IN')}**\n• **మీ స్వంత వాటా (Margin)**: కేవలం **${marginPct}% (₹${calcMargin.toLocaleString('en-IN')})**\n• **బ్యాంకు రుణం**: ₹${calcNetLoan.toLocaleString('en-IN')} (అంచనా నెలవారీ EMI: సుమారు ₹${estEmi.toLocaleString('en-IN')})\n\n💡 **ముఖ్యమైన సూచన**: బ్యాంకులు పూచీకత్తు లేకుండా ఈ రుణాన్ని CGTMSE ద్వారా మంజూరు చేయాలి. JanSamarth పోర్టల్‌లో నేరుగా దరఖాస్తు చేసుకోవచ్చు.`;
        } else {
          fallbackText = `Responsible financial advisory tailored to your exact input:\n\n• **PMEGP Scheme (KVIC 2024-25)**: In rural ${location?.village || 'jurisdictions'}, as a ${isSpecialCat ? 'Special Category / Woman beneficiary' : 'General Category applicant'}, you qualify for **${subsidyPct}% capital subsidy**.\n• **Project Capex**: ₹${baseCapex.toLocaleString('en-IN')}\n• **Eligible Subsidy**: **₹${calcSubsidy.toLocaleString('en-IN')}** (credited as margin money subsidy)\n• **Promoter Own Contribution**: Only **${marginPct}% (₹${calcMargin.toLocaleString('en-IN')})**\n• **Net Bank Term Loan**: ₹${calcNetLoan.toLocaleString('en-IN')} (approx monthly EMI: ₹${estEmi.toLocaleString('en-IN')}/mo)\n• **Statutory Protection**: Loans up to ₹10 Lakhs are 100% collateral-free under RBI circular FIDD.MSME and backed by CGTMSE.`;
        }
      } else if (qLower.includes('collateral') || qLower.includes('security') || qLower.includes('mortgage') || qLower.includes('गिरवी') || qLower.includes('తాకట్టు') || qLower.includes('அடமானம்')) {
        if (lang === 'hi') {
          fallbackText = `आरबीआई के मास्टर सर्कुलर (FIDD.MSME.BC.No.12/2024-25) के तहत आधिकारिक नियम:\n\n1. **₹10 लाख तक कोई ज़मीन गिरवी नहीं**: बैंक ₹10 लाख तक के सूक्ष्म व्यवसाय लोन के लिए कृषि भूमि, मकान या तीसरे पक्ष की गारंटी नहीं मांग सकते।\n2. **CGTMSE क्रेडिट गारंटी**: इस ऋण की संपूर्ण जोखिम गारंटी केंद्र सरकार की CGTMSE ट्रस्ट द्वारा बैंक को दी जाती है।\n3. **यदि बैंक प्रबंधक गिरवी मांगता है**: आप उन्हें आरबीआई सर्कुलर का हवाला दे सकते हैं और जनसमर्थ पोर्टल पर शिकायत दर्ज कर सकते हैं।`;
        } else if (lang === 'te') {
          fallbackText = `RBI మాస్టర్ సర్క్యులర్ (FIDD.MSME.BC.No.12/2024-25) ప్రకారం స్పష్టమైన నిబంధనలు:\n\n1. **₹10 లక్షల వరకు పూచీకత్తు నిషిద్ధం**: మైక్రో ఎంటర్‌ప్రైజ్ లోన్లకు బ్యాంకులు భూమి పత్రాలు లేదా ఇల్లు తాకట్టు పెట్టమని అడగడం చట్టవిరుద్ధం.\n2. **CGTMSE పూర్తి భద్రత**: ఈ రుణానికి కేంద్ర ప్రభుత్వం CGTMSE ద్వారా 100% క్రెడిట్ గ్యారెంటీ ఇస్తుంది.\n3. **బ్యాంకు మేనేజర్ తిరస్కరిస్తే**: లీడ్ డిస్ట్రిక్ట్ మేనేజర్ (LDM) లేదా JanSamarth పోర్టల్ గ్రీవెన్స్ సెల్ ద్వారా నిబంధనల ప్రకారం ఫిర్యాదు చేయవచ్చు.`;
        } else {
          fallbackText = `Statutory Position on Collateral (RBI Master Direction FIDD.MSME.BC.No.12/06.02.31/2024-25):\n\n1. **Strict Collateral Exemption up to ₹10 Lakhs**: Commercial banks and Regional Rural Banks (RRBs) are statutorily prohibited from demanding mortgage on agricultural land or residential property for micro-enterprise loans up to ₹10 Lakhs.\n2. **CGTMSE Coverage**: The entire default risk is underwritten by the Credit Guarantee Trust for Micro and Small Enterprises.\n3. **Remedy**: If a branch insists on title deeds, submit an application referencing the Master Direction on JanSamarth.in or notify the Lead District Manager (LDM).`;
        }
      } else if (qLower.includes('moratorium') || qLower.includes('emi') || qLower.includes('grace') || qLower.includes('किस्त') || qLower.includes('వాయిదా')) {
        if (lang === 'hi') {
          fallbackText = `मशीनरी स्थापना और मोराटोरियम (छूट अवधि) के नियम:\n\n• **3 से 12 महीने की छूट**: आरबीआई और IBA नियमों के अनुसार, विनिर्माण इकाइयों को 3 से 12 महीने का मोराटोरियम मिलता है।\n• **इस दौरान क्या देना होगा?**: मूलधन (Principal) नहीं देना होता, केवल साधारण ब्याज देय होता है।\n• **नियमित EMI**: जब आपकी मशीनरी चालू हो जाए और कमाई शुरू हो जाए, तभी से नियमित EMI शुरू होती है।`;
        } else if (lang === 'te') {
          fallbackText = `యంత్రాల కొనుగోలు మరియు మొరటోరియం (గడువు) నిబంధనలు:\n\n• **3 నుండి 12 నెలల గడువు**: పరిశ్రమ స్థాపన కాలంలో RBI & IBA నిబంధనల ప్రకారం 3 నుండి 12 నెలల మొరటోరియం లభిస్తుంది.\n• **చెల్లించాల్సిన మొత్తం**: ఈ కాలంలో అసలు వాయిదా ఉండదు, కేవలం నామమాత్రపు సాధారణ వడ్డీ మాత్రమే చెల్లించాలి.\n• **రెగ్యులర్ EMI**: వ్యాపార ఉత్పత్తి ప్రారంభమై నగదు ప్రవాహం మొదలయ్యాకే పూర్తి EMI ప్రారంభమవుతుంది.`;
        } else {
          fallbackText = `Moratorium (Repayment Grace Period) Guidelines (RBI & IBA Standards):\n\n• **3 to 12 Months Grace Period**: For manufacturing and agro-processing micro-enterprises, lenders provide an installation moratorium of 3 to 12 months based on project gestation.\n• **Cash Flow Protection**: Principal repayment is frozen during this period. Borrowers only service simple interest, shielding working capital until commercial operations ramp up.\n• **Regular Amortization**: Full principal and interest EMI commences after commercial production begins.`;
        }
      } else {
        const topChunk = selectedChunks[0];
        fallbackText = `Aarambh Sathi Advisory for "${question}":\n\nBased on official ${topChunk.authority} directives (${topChunk.title}):\n"${topChunk.chunk}"\n\n• **Applicant Context**: ${userProfile?.name || 'Entrepreneur'}, ${location?.village || 'Rural Unit'}, ${location?.district || 'District'}.\n• **Recommended Step**: Ensure your Aadhaar is linked to your bank account, obtain a formal equipment quotation from an authorized vendor, and submit your proposal digitally on JanSamarth.in.`;
      }

      return res.json({
        answer: fallbackText,
        retrievedChunks: selectedChunks,
        modelUsed: 'Aarambh Statutory Advisory Engine (Input-Responsive)',
      });
    } catch (err: any) {
      console.error('Advisor API Error:', err);
      return res.status(500).json({
        error: 'Failed to process advisory query',
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware in dev; static in production
  if (process.env.NODE_ENV !== 'production') {
    // Serve generated PWA service worker and workbox chunks from dev-dist during development
    const devDistPath = path.join(process.cwd(), 'dev-dist');
    app.use('/dev-dist', express.static(devDistPath));

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Aarambh AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
