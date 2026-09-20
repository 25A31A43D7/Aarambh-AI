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
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

// Built-in RAG knowledge chunks for server-side grounding
const REGULATORY_CHUNKS = [
  {
    id: 'rag_pmegp_subsidy',
    title: 'PMEGP Subsidy Rates & Margin Money Norms (KVIC)',
    authority: 'Ministry of MSME & KVIC',
    date: '2024-25',
    chunk: 'For Rural areas, special category beneficiaries (SC, ST, OBC, Minorities, Women, Ex-servicemen, Differently-abled) receive 35% margin money capital subsidy with only 5% own contribution. General category in rural receives 25% subsidy with 10% own contribution. Max project cost is Rs 50 Lakhs for manufacturing and Rs 20 Lakhs for services.',
  },
  {
    id: 'rag_cgtmse_collateral',
    title: 'RBI Collateral Exemption & CGTMSE Guarantee up to Rs 10 Lakhs',
    authority: 'Reserve Bank of India (RBI)',
    date: 'July 2024',
    chunk: 'RBI Master Directions - Priority Sector Lending FIDD.MSME.BC.No.12/06.02.31/2024-25: Banks are mandated not to accept collateral security in the case of loans up to Rs 10 Lakhs extended to units in the Micro Enterprises sector under PMEGP or MUDRA. Credit guarantee is provided through CGTMSE without imposing any mortgage on rural agricultural land or residential house.',
  },
  {
    id: 'rag_moratorium_guidelines',
    title: 'Moratorium & Grace Period Standards for Agricultural and MSME Term Loans',
    authority: 'RBI & Indian Banks Association (IBA)',
    date: 'Master Directions 2024',
    chunk: 'Term loans for manufacturing micro-enterprises are entitled to an initial moratorium (grace period) ranging from 3 to 12 months depending on project gestation. During this moratorium period, repayment of principal is suspended. The borrower is required only to service simple monthly interest on disbursed amounts. Capitalization of interest during moratorium is allowed upon mutual agreement.',
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
    chunk: 'Two Crossbred Cows (Jersey / HF Cross) yield 10-12 litres/day. Average capital expenditure is Rs 1,40,000 for cows, Rs 30,000 for shed, and Rs 15,000 for milking buckets and chaff cutter. Net monthly profit after feed cost, green fodder cultivation, and veterinary care is Rs 18,000 to Rs 24,000. DSCR averages 1.95x over a 5-year repayment tenure.',
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

  // API RAG Advisor Endpoint
  app.post('/api/advisor', async (req, res) => {
    try {
      const { question, lang = 'en', userProfile, location } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      // Accurate scoring against RAG regulatory chunks
      const qLower = (question as string).toLowerCase();
      const scoredChunks = REGULATORY_CHUNKS.map((chunk) => {
        let score = 0;
        const text = (chunk.title + ' ' + chunk.chunk + ' ' + chunk.authority).toLowerCase();
        const keywords = qLower.split(/\s+/).filter((w) => w.length > 2);
        keywords.forEach((kw) => {
          if (text.includes(kw)) score += 10;
        });
        if ((qLower.includes('subsidy') || qLower.includes('सब्सिडी') || qLower.includes('సబ్సిడీ')) && text.includes('subsidy')) score += 25;
        if (qLower.includes('pmegp') && text.includes('pmegp')) score += 30;
        if ((qLower.includes('moratorium') || qLower.includes('emi') || qLower.includes('grace')) && text.includes('moratorium')) score += 30;
        if ((qLower.includes('dairy') || qLower.includes('cow') || qLower.includes('milk')) && text.includes('dairy')) score += 30;
        if ((qLower.includes('collateral') || qLower.includes('security') || qLower.includes('mortgage')) && text.includes('collateral')) score += 30;
        if ((qLower.includes('mudra') || qLower.includes('shishu')) && text.includes('mudra')) score += 30;
        if ((qLower.includes('food') || qLower.includes('oil') || qLower.includes('spice')) && text.includes('food')) score += 25;

        return { chunk, score };
      }).sort((a, b) => b.score - a.score);

      const topMatched = scoredChunks.filter((s) => s.score > 0).map((s) => s.chunk);
      const selectedChunks = topMatched.length > 0 ? topMatched.slice(0, 3) : REGULATORY_CHUNKS.slice(0, 2);

      const gemini = getGemini();

      if (gemini) {
        const ragContextText = selectedChunks
          .map((c) => `[Statutory Reference: ${c.title} | Authority: ${c.authority} (${c.date})]\n"${c.chunk}"`)
          .join('\n\n');

        const systemPrompt = `You are "Aarambh Sathi" (आरंभ साथी), an expert AI rural enterprise and bank credit advisor in India.
Your mission is to directly, accurately, and specifically answer the user's question with grounded financial and regulatory facts.

CRITICAL INSTRUCTIONS FOR ACCURACY:
1. DIRECT ANSWER MANDATE: In your very first sentence, give a direct, specific answer to the user's exact question: "${question}". Do NOT begin with generic pleasantries or boilerplate text. Answer the exact question asked.
2. LANGUAGE REQUIREMENT: You MUST formulate your entire response in language code "${lang}". 
   - If lang="te", reply in fluent Telugu (తెలుగు).
   - If lang="hi", reply in fluent Hindi (हिन्दी).
   - If lang="ta", reply in fluent Tamil (தமிழ்).
   - If lang="kn", reply in fluent Kannada (ಕನ್ನಡ).
   - If lang="bn", reply in fluent Bengali (বাংলা).
   - If lang="mr", reply in fluent Marathi (मराठी).
   - If lang="gu", reply in fluent Gujarati (ગુજરાતી).
   - If lang="en", reply in English.
3. EXACT NUMBERS & SCHEMES: State exact subsidy percentages, loan thresholds, and statutory guidelines from the regulatory context below:
   - PMEGP: 35% subsidy for Rural Special Category (Women, SC/ST/OBC), 25% for Rural General. Max ₹50L manufacturing, ₹20L services. Margin: 5% (special) or 10% (general).
   - Collateral: Per RBI Master Circular, NO collateral or third-party guarantee can be demanded for loans up to ₹10 Lakhs (covered under CGTMSE/CGFMU).
   - Moratorium: 3 to 12 months grace period with only simple interest during installation before regular EMI starts.
   - Dairy/Agro: NABARD 2-cow unit (~₹1.8-2.2L capex, 24-28 L/day milk, bi-weekly cooperative payouts).
4. APPLICANT CONTEXT:
   - Name: ${userProfile?.name || 'Entrepreneur'}
   - Social Category: ${userProfile?.category || 'Special'}
   - Location: ${location?.village || 'Village'}, ${location?.district || 'District'}, ${location?.state || 'State'} (${location?.classification || 'Rural'})

STATUTORY REGULATORY CONTEXT:
${ragContextText}`;

        let answerText = '';
        try {
          const response = await gemini.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}` }],
              },
            ],
          });
          answerText = response.text || '';
        } catch (apiErr) {
          console.warn('Gemini generation error, falling back to statutory RAG response:', apiErr);
        }

        if (answerText) {
          return res.json({
            answer: answerText,
            retrievedChunks: selectedChunks,
          });
        }
      }

      // Multilingual question-tailored fallback
      const qText = (question as string).toLowerCase();
      let fallbackText = '';
      if (qText.includes('subsidy') || qText.includes('pmegp') || qText.includes('सब्सिडी')) {
        fallbackText = lang === 'hi'
          ? 'PMEGP योजना (KVIC 2024-25) के तहत ग्रामीण क्षेत्र में विशेष वर्ग (महिलाएं, SC/ST, OBC) को 35% पूंजीगत सब्सिडी मिलती है। सामान्य वर्ग को ग्रामीण क्षेत्र में 25% सब्सिडी मिलती है। विनिर्माण के लिए अधिकतम ₹50 लाख और सेवा क्षेत्र के लिए ₹20 लाख तक का ऋण मिलता है।'
          : lang === 'te'
          ? 'PMEGP పథకం (KVIC 2024-25) ప్రకారం, గ్రామీణ ప్రాంతాల్లో ప్రత్యేక వర్గాలకు (మహిళలు, SC/ST, OBCలు) 35% మూలధన సబ్సిడీ లభిస్తుంది. సాధారణ వర్గానికి 25% సబ్సిడీ అందుతుంది. తయారీ రంగానికి గరిష్టంగా ₹50 లక్షల వరకు ప్రాజెక్ట్ ఖర్చు అనుమతించబడుతుంది.'
          : 'Under the PMEGP Scheme (KVIC Policy 2024-25), you qualify for up to 35% margin money capital subsidy in rural areas as a special category beneficiary (Women, SC/ST, OBC, Minorities). General category applicants receive 25% in rural areas. Max project cost is ₹50 Lakhs for manufacturing and ₹20 Lakhs for services.';
      } else if (qText.includes('moratorium') || qText.includes('emi') || qText.includes('grace')) {
        fallbackText = lang === 'hi'
          ? 'आरबीआई और IBA दिशानिर्देशों के अनुसार, प्लांट व मशीनरी स्थापना के लिए 3 से 12 महीने का मोराटोरियम (छूट अवधि) दिया जाता है। इस दौरान मूलधन की किस्त नहीं देनी होती, केवल साधारण ब्याज देय होता है।'
          : lang === 'te'
          ? 'RBI & IBA మార్గదర్శకాల ప్రకారం, పరిశ్రమ స్థాపనకు 3 నుండి 12 నెలల మొరటోరియం (గడువు) లభిస్తుంది. ఈ కాలంలో అసలు వాయిదా చెల్లించాల్సిన పనిలేదు, కేవలం సాధారణ వడ్డీ మాత్రమే వర్తిస్తుంది.'
          : 'As per Reserve Bank of India & Indian Banks Association (IBA) credit guidelines, bank term loans provide a 3 to 12 month moratorium (grace period). During this grace period, principal repayment is paused and you only service simple interest.';
      } else if (qText.includes('collateral') || qText.includes('security') || qText.includes('mortgage')) {
        fallbackText = lang === 'hi'
          ? 'आरबीआई के मास्टर सर्कुलर (FIDD.MSME.2024) के अनुसार, ₹10 लाख तक के सूक्ष्म व्यवसाय लोन के लिए बैंक आपसे जमीन या संपत्ति गिरवी (Collateral) नहीं मांग सकते। इस ऋण की शत-प्रतिशत गारंटी CGTMSE द्वारा दी जाती है।'
          : lang === 'te'
          ? 'RBI మాస్టర్ సర్క్యులర్ ప్రకారం, ₹10 లక్షల వరకు ఇచ్చే మైక్రో లోన్ల కోసం బ్యాంకులు భూమి తాకట్టు లేదా పూచీకత్తు (Collateral) అడగడం నిషిద్ధం. దీనికి CGTMSE ద్వారా పూర్తి గ్యారంటీ లభిస్తుంది.'
          : 'Under RBI Master Circular FIDD.MSME.BC.No.12/06.02.31/2024-25, banks are strictly prohibited from demanding third-party collateral or agricultural land mortgage for micro loans up to ₹10 Lakhs. The entire risk is covered by CGTMSE.';
      } else {
        const topChunk = selectedChunks[0];
        fallbackText = `Based on official ${topChunk.authority} directives (${topChunk.title}):\n\n${topChunk.chunk}\n\nYour venture qualifies for high subsidy and priority clearance on the JanSamarth portal.`;
      }

      return res.json({
        answer: fallbackText,
        retrievedChunks: selectedChunks,
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
