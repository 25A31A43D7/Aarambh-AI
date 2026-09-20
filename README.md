# Aarambh AI (आरंभ साथी)
**Rural Enterprise Advisory & Bank-Ready DPR Enablement Platform**

Aarambh AI empowers first-generation rural and semi-urban entrepreneurs across India to turn enterprise ideas into viable, statutory-compliant businesses and secure bank financing. Built with full multilingual accessibility in **8 Indian languages**, voice input/output, real-time GPS location intelligence, and a regulatory-grounded Retrieval-Augmented Generation (RAG) advisory engine backed by Google Gemini.

---

## 🌟 Key Capabilities

### 1. Multilingual & Voice-First Accessibility
- **8 Indian Languages**: Fully localized in English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Bengali (বাংলা), Marathi (मराठी), and Gujarati (ગુજરાતી).
- **Text-to-Speech (Read Aloud)**: High-clarity native speech synthesis for low-literacy users across all views and AI recommendations.
- **Voice Recognition (Allow Mic)**: Hands-free voice querying for advisory queries and business discovery.

### 2. Live GPS & Micro-Market Intelligence
- **Automatic Geolocation Detection**: Determines village, taluk/block, district, state, and census classification (`Rural` vs. `Semi-Urban`).
- **Hyper-Local Viability Metrics**: Evaluates local consumer demand index, 10 km competition density, 3-phase grid power supply availability, and commercial shed rental estimates.

### 3. Statutory RAG & Gemini Enterprise Advisor ("Aarambh Sathi")
- **Regulatory Grounding**: Grounded strictly in official circulars from:
  - **RBI Master Circulars** (Priority Sector Lending & MSME collateral exemption up to ₹10 Lakhs under CGTMSE).
  - **KVIC PMEGP 2024-25** (25%–35% margin money capital subsidies for rural beneficiaries).
  - **NABARD Farm Project Models** (Dairy, poultry, agro-processing unit economics).
  - **PMFME & PM MUDRA** (Micro food processing and Shishu/Kishor credit).
- **Direct & Grounded Advice**: Accurately addresses moratorium grace periods, machinery quotations, and subsidy entitlements in the entrepreneur's native tongue with verifiable statutory source citations.

### 4. Financial Modeling & Bank-Ready DPR Generation
- **Capex & Opex Structuring**: Transparent breakdowns of plant machinery, civil works, electrification, and initial working capital.
- **Moratorium Grace Period**: Configurable 3 to 12 months moratorium where principal repayment is paused and only simple interest is serviced during unit installation.
- **Credit Readiness Score**: Evaluates promoter contribution (5%–10%), credit history, collateral-free scheme fit, and KYC readiness.
- **Printable Detailed Project Report (DPR)**: Formatted for direct submission to bank branch managers and upload on the national [JanSamarth Portal](https://www.jansamarth.in).

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Web Speech API (Synthesis & SpeechRecognition).
- **Backend**: Node.js, Express, tsx, esbuild.
- **AI Engine**: Google Gemini API (`@google/genai` SDK) running server-side with structured prompt injection and RAG regulatory grounding.
- **Offline / Transient Fallback**: Local RAG vector-scored knowledge base ensuring 100% operational uptime even without external network credentials.

---

## 📋 Platform Views

1. **Enterprise Discovery**: Browse curated rural business profiles (Dairy, Cold-Press Oil, Solar Flour Mill, Poultry, Bio-Fertilizer, etc.) with real-time location suitability.
2. **Financials & Loan Calculator**: Calculate project capital costs, 35% PMEGP subsidy deductions, net bank loans, moratorium schedules, and monthly EMI.
3. **Statutory Advisor (Aarambh Sathi)**: Natural language voice & text chat citing RBI, KVIC, and NABARD circulars.
4. **Bank Readiness**: Interactive checklist assessing documentation, CIBIL eligibility, and government scheme alignment.
5. **Permits & Compliance**: Step-by-step guidance on Udyam Registration, FSSAI, PCB consent, and 3-phase power sanctioning.
6. **Detailed Project Report (DPR)**: Comprehensive bankable report ready for print or PDF download.

---

## 📄 License
MIT License. Built for inclusive rural entrepreneurship.
