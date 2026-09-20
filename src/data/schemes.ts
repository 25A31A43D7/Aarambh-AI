import { SchemeItem, SchemeEvaluation, UserProfile, GPSLocation } from '../types';

export const SCHEMES: SchemeItem[] = [
  {
    id: 'pmegp',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    ministry: 'Ministry of MSME / KVIC',
    description: 'Credit-linked capital subsidy for establishing new micro-enterprises in rural & urban India.',
    maxLoan: 5000000,
    collateral: 'Collateral-Free under CGTMSE guarantee up to ₹10 Lakhs (No third-party mortgage)',
    officialPortal: 'https://www.kviconline.gov.in/pmegpeportal/',
    applicationPortal: 'JanSamarth Portal (jansamarth.in) & KVIC Online',
    ragSourceId: 'rag_pmegp_subsidy',
    cat: ['manufacturing', 'service'],
    loan: 'Up to ₹50 Lakh (Manufacturing) / ₹20 Lakh (Service)',
    subsidy: 'Rural Special Category (SC/ST/OBC/Women): 35% | Rural General: 25% | Urban: 15%',
    margin: 'Promoter equity margin only 5% (Special) or 10% (General)',
    eligibility: 'Age 18+, min 8th pass for projects above ₹10L (Mfg) / ₹5L (Service). New units only.',
    authority: 'KVIC / KVIB / District Industries Centre (DIC)',
    sourceTag: 'KVIC Notification No. PMEGP/Policy/2024-25',
    checklist: [
      'Aadhaar & PAN Card',
      'Rural Area Certificate from Tehsildar / Gram Panchayat',
      'Machinery Quotation from Registered Vendor',
      'Caste / Category Certificate (for 35% special subsidy)',
      '8th or 10th Pass Marksheet / Certificate',
      'Bank Passbook with IFSC Code',
      'Detailed Project Report (DPR)',
    ],
    documentsRequired: [
      'Aadhaar & PAN Card',
      'Rural Area Certificate from Tehsildar / Gram Panchayat',
      'Machinery Quotation from Registered Vendor',
      'Caste / Category Certificate (for 35% special subsidy)',
      '8th or 10th Pass Marksheet / Certificate',
      'Bank Passbook with IFSC Code',
      'Detailed Project Report (DPR)',
    ],
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    ministry: 'Department of Financial Services, Ministry of Finance',
    description: 'Collateral-free micro loans for non-farm income generating micro enterprises and traders.',
    maxLoan: 2000000,
    collateral: '100% Collateral-Free (Covered by CGFMU / NCGTC)',
    officialPortal: 'https://www.mudra.org.in/',
    applicationPortal: 'Udyamimitra & JanSamarth Portal',
    ragSourceId: 'rag_rbi_collateral',
    cat: ['manufacturing', 'service', 'trade', 'agri'],
    loan: 'Shishu (≤₹50k) · Kishor (₹50k–5L) · Tarun (₹5L–10L) · Tarun Plus (up to ₹20L)',
    subsidy: 'Collateral-Free Institutional Credit (Guaranteed by NCGTC / CGFMU)',
    margin: 'Borrower margin 10% to 15% (Nil for Shishu up to ₹50k)',
    eligibility: 'All non-farm micro enterprises, traders, artisans, small dairies. No minimum education.',
    authority: 'All Commercial Banks, Regional Rural Banks (RRBs), Cooperative Banks',
    sourceTag: 'Ministry of Finance DFS PMMY Circular 2024',
    checklist: [
      'Identity & Address Proof (Aadhaar / Voter ID)',
      'Business Premise Document / Lease or Land Ownership',
      'Proforma Machinery Invoice / Price Quotation',
      'Bank Statement (Last 6 Months)',
      '2 Passport Sized Photographs',
    ],
    documentsRequired: [
      'Identity & Address Proof (Aadhaar / Voter ID)',
      'Business Premise Document / Lease or Land Ownership',
      'Proforma Machinery Invoice / Price Quotation',
      'Bank Statement (Last 6 Months)',
      '2 Passport Sized Photographs',
    ],
  },
  {
    id: 'standup',
    name: 'Stand-Up India Scheme',
    ministry: 'Department of Financial Services / SIDBI',
    description: 'Promoting entrepreneurship among SC, ST, and Women for greenfield manufacturing and services.',
    maxLoan: 10000000,
    collateral: 'Covered under Credit Guarantee Scheme for Stand-Up India (CGSUI)',
    officialPortal: 'https://www.standupmitra.in/',
    applicationPortal: 'StandUpMitra Portal & Scheduled Commercial Banks',
    ragSourceId: 'rag_standup_guidelines',
    cat: ['manufacturing', 'service', 'trade'],
    loan: '₹10 Lakh to ₹100 Lakh (Composite Term Loan + Working Capital)',
    subsidy: 'Soft margin support & National Credit Guarantee Trustee Company (NCGTC) cover',
    margin: '15% of project cost (converged with state schemes)',
    eligibility: 'SC, ST, or Women entrepreneurs exclusively. Greenfield ventures only.',
    authority: 'Scheduled Commercial Banks / SIDBI',
    sourceTag: 'SIDBI Stand-Up India Guidelines Ref: SU-2024',
    checklist: [
      'SC/ST Certificate or Proof of Woman Promoter',
      'Detailed Project Report (DPR)',
      'Pollution / Gram Panchayat NOC',
      'Land / Lease Agreement (min 5 years)',
      'Promoter Contribution Proof (15%)',
    ],
    documentsRequired: [
      'SC/ST Certificate or Proof of Woman Promoter',
      'Detailed Project Report (DPR)',
      'Pollution / Gram Panchayat NOC',
      'Land / Lease Agreement (min 5 years)',
      'Promoter Contribution Proof (15%)',
    ],
  },
  {
    id: 'pmfme',
    name: 'PM Formalisation of Micro Food Processing (PMFME)',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    description: 'Financial, technical, and business support for upgrading existing and new micro food processing enterprises.',
    maxLoan: 1000000,
    collateral: 'Bank Credit Linked with CGTMSE guarantee cover',
    officialPortal: 'https://pmfme.mofpi.gov.in/',
    applicationPortal: 'PMFME MoFPI Portal / JanSamarth',
    ragSourceId: 'rag_pmfme_rules',
    cat: ['manufacturing', 'agri'],
    loan: 'Credit-linked project finance with 35% capital subsidy',
    subsidy: '35% Capital Subsidy of eligible project cost (Maximum ₹10,00,000)',
    margin: 'Minimum 10% promoter contribution',
    eligibility: 'Micro food units (flour, spice, oil expeller, jaggery, bakery, pulses) & SHG/FPO.',
    authority: 'Ministry of Food Processing Industries (MoFPI) / District Nodal Agency',
    sourceTag: 'MoFPI Operational Guidelines PMFME/2024',
    checklist: [
      'Basic FSSAI Registration / Application Acknowledgement',
      'Machinery Quotation from Manufacturer',
      'Electricity Sanction Letter / Agricultural Feeder Proof',
      'Aadhaar & PAN Card',
      'Bank Account Passbook',
    ],
    documentsRequired: [
      'Basic FSSAI Registration / Application Acknowledgement',
      'Machinery Quotation from Manufacturer',
      'Electricity Sanction Letter / Agricultural Feeder Proof',
      'Aadhaar & PAN Card',
      'Bank Account Passbook',
    ],
  },
  {
    id: 'vishwakarma',
    name: 'PM Vishwakarma Scheme',
    ministry: 'Ministry of MSME & Ministry of Skill Development',
    description: 'End-to-end holistic support for traditional artisans and craftspeople including tool vouchers and concessional credit.',
    maxLoan: 300000,
    collateral: 'Collateral-Free at 5% Concessional Interest Rate',
    officialPortal: 'https://pmvishwakarma.gov.in/',
    applicationPortal: 'Common Service Centres (CSC) / PM Vishwakarma Portal',
    ragSourceId: 'rag_vishwakarma_guidelines',
    cat: ['manufacturing', 'service'],
    loan: '1st Tranche: ₹1 Lakh @ 5% interest | 2nd Tranche: ₹2 Lakh @ 5%',
    subsidy: 'Free 5-day skill training + ₹15,000 Free Modern Toolkit Voucher + Collateral-Free',
    margin: 'Zero promoter margin required for toolkits & training',
    eligibility: '18 traditional artisan trades (Carpenters, Tailors, Blacksmiths, Potters, Masons, Cobblers, Weavers).',
    authority: 'Common Service Centres (CSC) / Ministry of MSME',
    sourceTag: 'Ministry of MSME Gazette Notification 2023-24',
    checklist: [
      'Aadhaar-linked Mobile Number',
      'Ration Card Proof',
      'Trade Verification by Gram Panchayat Head / Ward Member',
      'Bank Account Details',
    ],
    documentsRequired: [
      'Aadhaar-linked Mobile Number',
      'Ration Card Proof',
      'Trade Verification by Gram Panchayat Head / Ward Member',
      'Bank Account Details',
    ],
  },
  {
    id: 'pmsvanidhi',
    name: 'PM SVANidhi (Street Vendor AtmaNirbhar Nidhi)',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    description: 'Special micro-credit facility providing affordable working capital to urban and peri-urban street vendors.',
    maxLoan: 50000,
    collateral: 'Collateral-Free Micro Credit with 7% Interest Subsidy',
    officialPortal: 'https://pmsvanidhi.mohua.gov.in/',
    applicationPortal: 'PMSVANidhi Portal & Scheduled Commercial Banks',
    ragSourceId: 'rag_svanidhi_circular',
    cat: ['trade', 'service'],
    loan: '1st Tranche: ₹10,000 · 2nd: ₹20,000 · 3rd: ₹50,000',
    subsidy: '7% Interest Subsidy per annum credited directly to bank account + Cashback on digital QR payments',
    margin: 'Zero Margin / Collateral-Free',
    eligibility: 'Urban and Peri-Urban micro vendors, food cart operators, weekly haat stallholders.',
    authority: 'Urban Local Bodies (ULB) / Town Vending Committees',
    sourceTag: 'MoHUA PMSVANidhi Scheme Manual 2024',
    checklist: [
      'Vending Certificate / Letter of Recommendation (LoR) from Town Committee / Panchayat',
      'Aadhaar Card',
      'Bank Account Passbook',
      'UPI QR Code for Cashback',
    ],
    documentsRequired: [
      'Vending Certificate / Letter of Recommendation (LoR) from Town Committee / Panchayat',
      'Aadhaar Card',
      'Bank Account Passbook',
      'UPI QR Code for Cashback',
    ],
  },
  {
    id: 'nrlm',
    name: 'Deendayal Antyodaya Yojana - DAY-NRLM (SHG Bank Linkage)',
    ministry: 'Ministry of Rural Development (MoRD)',
    description: 'Poverty alleviation through building sustainable community institutions and credit linkage for women SHGs.',
    maxLoan: 2000000,
    collateral: 'Mutual Guarantee of Self-Help Group (No Collateral / No Margin up to ₹10L)',
    officialPortal: 'https://aajeevika.gov.in/',
    applicationPortal: 'State Rural Livelihood Mission (SRLM) & Rural Banks',
    ragSourceId: 'rag_nrlm_circular',
    cat: ['agri', 'manufacturing', 'service'],
    loan: 'SHG Revolving Fund ₹20k–30k + Bank Credit Linkage up to ₹10–20 Lakh',
    subsidy: 'Interest Subvention bringing effective interest down to 4%–7% for prompt repayment',
    margin: 'Pooled SHG internal savings',
    eligibility: 'Rural women organized into active Self-Help Groups (SHGs) under village VO.',
    authority: 'State Rural Livelihood Mission (SRLM) / Village Organization',
    sourceTag: 'Ministry of Rural Development DAY-NRLM Circular 2024',
    checklist: [
      'SHG Resolution Book Copy',
      '12-Column Grading Register',
      'Group Bank Passbook with Signatories',
      'Individual KYC of Promoters',
    ],
    documentsRequired: [
      'SHG Resolution Book Copy',
      '12-Column Grading Register',
      'Group Bank Passbook with Signatories',
      'Individual KYC of Promoters',
    ],
  },
  {
    id: 'cgtmse',
    name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
    ministry: 'Ministry of MSME & SIDBI',
    description: 'Government credit guarantee enabling flow of institutional credit to micro enterprises without collateral or third-party guarantee.',
    maxLoan: 50000000,
    collateral: '100% Collateral-Free (Default risk covered up to 85% by Trust)',
    officialPortal: 'https://www.cgtmse.in/',
    applicationPortal: 'Member Lending Institutions (MLIs) / All Scheduled Banks',
    ragSourceId: 'rag_rbi_collateral',
    cat: ['manufacturing', 'service'],
    loan: 'Collateral-free credit facility up to ₹5 Crore',
    subsidy: 'Up to 85% credit guarantee coverage for default risk (zero third-party collateral)',
    margin: '10% to 15% as per lending bank policy',
    eligibility: 'New and existing Micro & Small Enterprises across manufacturing and service sectors.',
    authority: 'Member Lending Institutions (MLIs) / CGTMSE Trust',
    sourceTag: 'CGTMSE Circular No. 224/2024-25',
    checklist: [
      'Audited / Projected Financial Statements',
      'Detailed Bank DPR Report',
      'UDYAM Registration Certificate',
      'KYC Documents of Applicant',
    ],
    documentsRequired: [
      'Audited / Projected Financial Statements',
      'Detailed Bank DPR Report',
      'UDYAM Registration Certificate',
      'KYC Documents of Applicant',
    ],
  },
];

export const SCHEMES_DB: SchemeItem[] = SCHEMES;

export function evaluateSchemeEligibility(
  schemeOrId: string | SchemeItem,
  profile: UserProfile,
  location: GPSLocation,
  capex: number,
  sector: string = 'manufacturing'
): SchemeEvaluation {
  const schemeId = typeof schemeOrId === 'string' ? schemeOrId : schemeOrId.id;
  const isSpecialCategory = profile.category === 'special' || profile.gender === 'female';
  const isRural = location.classification === 'rural';
  const hasMin8th = profile.education !== 'below8';

  const rawEval = (): Omit<SchemeEvaluation, 'eligible'> => {
    switch (schemeId) {
    case 'pmegp': {
      if (profile.age < 18) {
        return {
          status: 'not-eligible',
          reason: 'Applicant must be at least 18 years old to apply for PMEGP.',
          subsidyPct: 0,
          calculatedSubsidy: 0,
          maxFinancing: '₹50 Lakh',
          promoterMarginPct: 10,
        };
      }
      if (capex > 1000000 && !hasMin8th) {
        return {
          status: 'partial',
          reason: 'PMEGP mandates 8th standard pass for project costs above ₹10 Lakhs in manufacturing. You can qualify by keeping project cost ≤ ₹10 Lakhs.',
          subsidyPct: isSpecialCategory && isRural ? 35 : isRural ? 25 : 15,
          calculatedSubsidy: Math.round(1000000 * (isSpecialCategory && isRural ? 0.35 : 0.25)),
          maxFinancing: '₹10 Lakh (Without 8th Pass)',
          promoterMarginPct: isSpecialCategory ? 5 : 10,
        };
      }

      let subPct = 25;
      let marginPct = 10;
      let reasonText = '';

      if (isSpecialCategory && isRural) {
        subPct = 35;
        marginPct = 5;
        reasonText = `Eligible for maximum 35% Margin Money Subsidy! As a ${profile.gender === 'female' ? 'Woman' : profile.subCategory || 'Special Category'} applicant setting up in rural ${location.district}, your own promoter equity contribution is only 5%.`;
      } else if (isSpecialCategory && !isRural) {
        subPct = 25;
        marginPct = 5;
        reasonText = `Eligible for 25% Subsidy in semi-urban/urban zone as special category applicant with 5% promoter equity requirement.`;
      } else if (!isSpecialCategory && isRural) {
        subPct = 25;
        marginPct = 10;
        reasonText = `Eligible for 25% Subsidy in rural area as general category applicant with 10% promoter equity requirement.`;
      } else {
        subPct = 15;
        marginPct = 10;
        reasonText = `Eligible for 15% Subsidy in urban zone with 10% promoter equity requirement.`;
      }

      return {
        status: 'eligible',
        reason: reasonText,
        subsidyPct: subPct,
        calculatedSubsidy: Math.round(capex * (subPct / 100)),
        maxFinancing: capex > 2000000 && sector === 'service' ? '₹20 Lakh (Service Cap)' : 'Up to ₹50 Lakh',
        promoterMarginPct: marginPct,
      };
    }

    case 'mudra': {
      let bracket = 'Shishu';
      let marginPct = 0;
      if (capex <= 50000) {
        bracket = 'Shishu (Zero Margin, Collateral-Free)';
        marginPct = 0;
      } else if (capex <= 500000) {
        bracket = 'Kishor (₹50k–₹5L)';
        marginPct = 10;
      } else if (capex <= 1000000) {
        bracket = 'Tarun (₹5L–₹10L)';
        marginPct = 15;
      } else {
        bracket = 'Tarun Plus (Up to ₹20L)';
        marginPct = 15;
      }

      return {
        status: 'eligible',
        reason: `Eligible for PM MUDRA ${bracket}. No collateral security needed. Loan is covered under National Credit Guarantee Trust (NCGTC).`,
        subsidyPct: 0,
        calculatedSubsidy: 0,
        maxFinancing: capex <= 500000 ? '₹5,00,000' : '₹10,00,000 (Extendable to ₹20L)',
        promoterMarginPct: marginPct,
      };
    }

    case 'standup': {
      const isEligibleBeneficiary = profile.gender === 'female' || profile.category === 'special';
      if (!isEligibleBeneficiary) {
        return {
          status: 'not-eligible',
          reason: 'Stand-Up India is statutorily reserved for SC, ST, or Women entrepreneurs setting up greenfield units.',
          subsidyPct: 0,
          calculatedSubsidy: 0,
          maxFinancing: '₹10 Lakh to ₹1 Crore',
          promoterMarginPct: 15,
        };
      }
      if (capex < 1000000) {
        return {
          status: 'partial',
          reason: `Stand-Up India funds projects between ₹10 Lakh and ₹100 Lakh. For projects under ₹10 Lakh, PMEGP or MUDRA is better suited.`,
          subsidyPct: 15,
          calculatedSubsidy: Math.round(capex * 0.15),
          maxFinancing: 'Min ₹10 Lakhs project cost required',
          promoterMarginPct: 15,
        };
      }
      return {
        status: 'eligible',
        reason: `Eligible as ${profile.gender === 'female' ? 'Woman' : 'SC/ST'} entrepreneur for composite term loan up to ₹1 Crore with soft margin assistance.`,
        subsidyPct: 15,
        calculatedSubsidy: Math.round(capex * 0.15),
        maxFinancing: 'Up to ₹1 Crore',
        promoterMarginPct: 15,
      };
    }

    case 'pmfme': {
      const isAgroFood = sector === 'agro' || sector === 'dairy' || sector === 'all';
      if (!isAgroFood) {
        return {
          status: 'partial',
          reason: 'PMFME requires your enterprise to be in food processing (e.g. spice mill, flour unit, edible oil expeller, pulses, jaggery, bakery).',
          subsidyPct: 35,
          calculatedSubsidy: Math.min(1000000, Math.round(capex * 0.35)),
          maxFinancing: '₹10 Lakh Subsidy Cap',
          promoterMarginPct: 10,
        };
      }
      return {
        status: 'eligible',
        reason: 'Qualifies for 35% Credit-Linked Capital Subsidy (up to ₹10 Lakhs) under MoFPI One District One Product (ODOP) / Micro Food Processing guidelines.',
        subsidyPct: 35,
        calculatedSubsidy: Math.min(1000000, Math.round(capex * 0.35)),
        maxFinancing: 'Up to ₹10 Lakh Subsidy + Bank Term Loan',
        promoterMarginPct: 10,
      };
    }

    case 'vishwakarma': {
      const isCraftOrSkill = ['crafts', 'services', 'all'].includes(sector);
      return {
        status: isCraftOrSkill ? 'eligible' : 'partial',
        reason: 'Eligible for 18 traditional artisan trades. Entitled to ₹15,000 free modern tool voucher + ₹1L collateral-free loan at concessional 5% interest.',
        subsidyPct: 15,
        calculatedSubsidy: 15000,
        maxFinancing: '₹1 Lakh (1st Tranche) + ₹2 Lakh (2nd Tranche) @ 5% interest',
        promoterMarginPct: 0,
      };
    }

    case 'pmsvanidhi': {
      return {
        status: capex <= 50000 ? 'eligible' : 'partial',
        reason: 'Ideal for micro street trade and vendors. ₹10,000 to ₹50,000 collateral-free working capital loan with 7% annual interest subvention.',
        subsidyPct: 7,
        calculatedSubsidy: Math.round(Math.min(capex, 50000) * 0.07),
        maxFinancing: 'Up to ₹50,000 in tranches',
        promoterMarginPct: 0,
      };
    }

    case 'nrlm': {
      const isFemale = profile.gender === 'female';
      return {
        status: isFemale ? 'eligible' : 'partial',
        reason: isFemale
          ? 'Eligible for DAY-NRLM Women SHG Bank Credit Linkage with interest subvention down to 4% p.a.'
          : 'DAY-NRLM requires participation via an active women Self-Help Group (SHG). Female family members can be co-promoters.',
        subsidyPct: 5,
        calculatedSubsidy: Math.round(capex * 0.05),
        maxFinancing: 'Up to ₹10–20 Lakhs per group',
        promoterMarginPct: 5,
      };
    }

    case 'cgtmse':
    default: {
      return {
        status: 'eligible',
        reason: 'All micro and small enterprises qualify for CGTMSE collateral-free guarantee cover up to ₹5 Crore, removing need for third-party land mortgaging.',
        subsidyPct: 0,
        calculatedSubsidy: 0,
        maxFinancing: 'Up to ₹5 Crore',
        promoterMarginPct: 10,
      };
    }
  }
  };

  const raw = rawEval();
  return {
    ...raw,
    eligible: raw.status === 'eligible' || raw.status === 'partial',
  };
}
