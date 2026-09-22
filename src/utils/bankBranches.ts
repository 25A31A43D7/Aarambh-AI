import { GPSLocation } from '../types';

export interface BankBranch {
  id: string;
  name: string;
  bankName: string;
  type: 'RRB' | 'PSB' | 'Cooperative' | 'Private';
  typeLabel: string;
  distanceKm: number;
  address: string;
  ifsc: string;
  phone: string;
  email: string;
  nodalOfficer: string;
  isLeadBank: boolean;
  isPmegpNodal: boolean;
  isCgtmseEnrolled: boolean;
  dprDeskLocation: string;
  operatingHours: string;
  specializations: string[];
}

export function getNearbyBankBranches(location: GPSLocation): BankBranch[] {
  const district = location.district || 'Warangal';
  const state = location.state || 'Telangana';
  const village = location.village || 'Gramin Block';

  // Determine state-specific Regional Rural Bank (RRB)
  let rrbName = 'Regional Rural Bank';
  let rrbBankName = 'Telangana Grameena Bank';
  let rrbIfscPrefix = 'TGBR';

  if (state.toLowerCase().includes('andhra')) {
    rrbBankName = 'Andhra Pradesh Grameena Vikas Bank (APGVB)';
    rrbIfscPrefix = 'APGV';
  } else if (state.toLowerCase().includes('uttar') || state.toLowerCase().includes('up')) {
    rrbBankName = 'Aryavart Bank / Baroda UP Bank (RRB)';
    rrbIfscPrefix = 'BARB';
  } else if (state.toLowerCase().includes('bihar')) {
    rrbBankName = 'Dakshin Bihar Gramin Bank';
    rrbIfscPrefix = 'BKDN';
  } else if (state.toLowerCase().includes('maharashtra')) {
    rrbBankName = 'Maharashtra Gramin Bank';
    rrbIfscPrefix = 'MAHG';
  } else if (state.toLowerCase().includes('punjab')) {
    rrbBankName = 'Punjab Gramin Bank';
    rrbIfscPrefix = 'PUNB';
  } else if (state.toLowerCase().includes('gujarat')) {
    rrbBankName = 'Saurashtra Gramin Bank';
    rrbIfscPrefix = 'SGBA';
  } else if (state.toLowerCase().includes('karnataka')) {
    rrbBankName = 'Karnataka Gramin Bank';
    rrbIfscPrefix = 'PKGB';
  } else if (state.toLowerCase().includes('tamil')) {
    rrbBankName = 'Tamil Nadu Grama Bank';
    rrbIfscPrefix = 'IDIB';
  }

  return [
    {
      id: 'branch-1',
      name: `State Bank of India — ${village} Agricultural Development Branch`,
      bankName: 'State Bank of India',
      type: 'PSB',
      typeLabel: 'Public Sector Bank (Lead Bank)',
      distanceKm: 1.8,
      address: `Station Road, Near APMC Krishi Mandi, ${village}, ${district}, ${state} - 506001`,
      ifsc: 'SBIN0002148',
      phone: '+91 870 245 8891',
      email: `sbi.${district.toLowerCase().replace(/\s+/g, '')}.agri@sbi.co.in`,
      nodalOfficer: 'Shri R. K. Sharma (Chief Manager - Agri & MSME)',
      isLeadBank: true,
      isPmegpNodal: true,
      isCgtmseEnrolled: true,
      dprDeskLocation: 'Counter 4 — Dedicated PMEGP & MSME Sanchalak Desk',
      operatingHours: '10:00 AM – 4:00 PM (Mon–Sat, 2nd & 4th Sat closed)',
      specializations: ['PMEGP Subsidy Disbursement', 'KVIC Margin Money Portal', 'MUDRA Tarun', 'CGTMSE Coverage'],
    },
    {
      id: 'branch-2',
      name: `${rrbBankName} — ${village} Rural Branch`,
      bankName: rrbBankName,
      type: 'RRB',
      typeLabel: 'Regional Rural Bank (Fastest Rural Approval)',
      distanceKm: 2.6,
      address: `Panchayat Bhavan Road, Near Rythu Bharosa Kendra, ${village}, ${district}`,
      ifsc: `${rrbIfscPrefix}0008432`,
      phone: '+91 870 252 1190',
      email: `branch.${village.toLowerCase().replace(/\s+/g, '')}@${rrbIfscPrefix.toLowerCase()}bank.co.in`,
      nodalOfficer: 'Smt. Ananya Reddy (Branch Manager & Priority Lending Desk)',
      isLeadBank: false,
      isPmegpNodal: true,
      isCgtmseEnrolled: true,
      dprDeskLocation: 'Room 2 — Rural Self-Employment & Enterprise Desk',
      operatingHours: '10:00 AM – 4:30 PM (Mon–Sat)',
      specializations: ['PMEGP Rural 35% Subsidies', 'SHG Enterprise Linkage', 'Agri-Infra Fund (AIF)', 'Zero-Collateral MUDRA'],
    },
    {
      id: 'branch-3',
      name: `Union Bank of India — ${district} Central MSME Hub`,
      bankName: 'Union Bank of India',
      type: 'PSB',
      typeLabel: 'Public Sector Bank',
      distanceKm: 4.2,
      address: `Commercial Complex, Sub-District Road, ${district}, ${state}`,
      ifsc: 'UBIN0542319',
      phone: '+91 870 244 3302',
      email: `warangal.msme@unionbankofindia.bank`,
      nodalOfficer: 'Shri Manoj Varma (Senior Manager - Credit Processing)',
      isLeadBank: false,
      isPmegpNodal: true,
      isCgtmseEnrolled: true,
      dprDeskLocation: 'First Floor — MSME Credit Processing Cell (CPC)',
      operatingHours: '10:00 AM – 4:00 PM (Mon–Sat)',
      specializations: ['Fast-track JanSamarth DPR Approval', 'Food Processing Units', 'Stand-Up India'],
    },
    {
      id: 'branch-4',
      name: `Canara Bank — ${district} Rural Micro-Credit Cell`,
      bankName: 'Canara Bank',
      type: 'PSB',
      typeLabel: 'Public Sector Bank',
      distanceKm: 5.9,
      address: `Opposite Bus Terminal, Highway Road, ${district}, ${state}`,
      ifsc: 'CNRB0001890',
      phone: '+91 870 256 7741',
      email: `cb.${district.toLowerCase().replace(/\s+/g, '')}@canarabank.com`,
      nodalOfficer: 'Mr. P. Venkatesh (Credit Officer)',
      isLeadBank: false,
      isPmegpNodal: true,
      isCgtmseEnrolled: true,
      dprDeskLocation: 'Helpdesk 2 — Lead District Credit Counter',
      operatingHours: '10:00 AM – 3:30 PM (Mon–Sat)',
      specializations: ['Solar Kiosk Sizing', 'Dal Mill & Agro Units', 'CGTMSE Guarantees'],
    },
    {
      id: 'branch-5',
      name: `District Central Co-operative Bank (DCCB) — ${district} Branch`,
      bankName: 'District Central Co-operative Bank',
      type: 'Cooperative',
      typeLabel: 'Co-operative Bank',
      distanceKm: 7.4,
      address: `Sahakara Bhavan, Collectorate Chowk, ${district}, ${state}`,
      ifsc: 'TSAB0010022',
      phone: '+91 870 250 4910',
      email: `dccb.${district.toLowerCase().replace(/\s+/g, '')}@coopbank.in`,
      nodalOfficer: 'Shri B. Satyanarayana (Development Officer)',
      isLeadBank: false,
      isPmegpNodal: false,
      isCgtmseEnrolled: true,
      dprDeskLocation: 'Agri-Business & Allied Services Section',
      operatingHours: '10:00 AM – 3:00 PM (Mon–Fri, Sat 10:00 AM – 1:00 PM)',
      specializations: ['PACS Member Financing', 'Dairy & Animal Husbandry Units', 'Farm Equipment Loans'],
    },
    {
      id: 'branch-6',
      name: `HDFC Bank — ${district} Rural & Micro-Enterprises Center`,
      bankName: 'HDFC Bank',
      type: 'Private',
      typeLabel: 'Scheduled Commercial Bank',
      distanceKm: 9.1,
      address: `Plot 14, Main Commercial Boulevard, ${district}, ${state}`,
      ifsc: 'HDFC0003810',
      phone: '+91 1800 202 6161',
      email: `rural.msme@hdfcbank.com`,
      nodalOfficer: 'Ms. Sneha Kulkarni (Cluster Credit Manager)',
      isLeadBank: false,
      isPmegpNodal: true,
      isCgtmseEnrolled: true,
      dprDeskLocation: 'Priority Sector Lending Corner',
      operatingHours: '9:30 AM – 4:30 PM (Mon–Sat, 2nd & 4th Sat closed)',
      specializations: ['Working Capital Term Loans', 'Green Energy Solar Micro-Finance', 'MUDRA Pradhan Mantri'],
    },
  ];
}
