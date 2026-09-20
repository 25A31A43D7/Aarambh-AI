export type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'bn' | 'mr' | 'gu';

export interface UserProfile {
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'transgender';
  category: 'special' | 'general'; // Special: SC/ST/OBC/Women/Minority (35% rural PMEGP)
  subCategory: string;
  education: 'below8' | '8th' | '10th' | '12th' | 'graduate';
  landAcres: number;
  hasShed: boolean;
  annualIncome: number;
  creditBand: 'new' | 'fair' | 'good';
  existingDebt: number;
  hasJanDhan: boolean;
}

export interface GPSLocation {
  lat: number;
  lng: number;
  accuracy: number;
  district: string;
  state: string;
  village: string;
  classification: 'rural' | 'semiurban' | 'urban';
  lastUpdated: string;
}

export interface CapitalState {
  ownSavings: number;
  softLoans: number;
  targetCapex: number;
  landValue: number;
  maxEmi: number;
}

export interface BusinessIdea {
  id: string;
  sector: 'agro' | 'dairy' | 'green' | 'crafts' | 'services';
  name: Record<string, string>;
  skills: string[];
  minCapital: number;
  fixedCapex: number;
  monthlyRev: number;
  monthlyOpex: number;
  risk: 'low' | 'medium' | 'high';
  labour: number;
  area: string;
  power: string;
  why: Record<string, string>;
  schemes: string[];
}

export interface SchemeEvaluation {
  status: 'eligible' | 'partial' | 'not-eligible';
  eligible: boolean;
  reason: string;
  subsidyPct: number;
  calculatedSubsidy: number;
  maxFinancing: string;
  promoterMarginPct: number;
}

export interface SchemeItem {
  id: string;
  name: string;
  ministry?: string;
  description?: string;
  maxLoan?: number;
  collateral?: string;
  officialPortal?: string;
  applicationPortal?: string;
  documentsRequired?: string[];
  ragSourceId?: string;
  cat: ('manufacturing' | 'service' | 'trade' | 'agri')[];
  loan: string;
  subsidy: string;
  margin: string;
  eligibility: string;
  authority: string;
  sourceTag: string;
  checklist: string[];
}

export type SchemeRule = SchemeItem;

export interface ScheduleRow {
  month: number;
  phase: 'Moratorium' | 'Repayment';
  opening: number;
  principal: number;
  interest: number;
  total: number;
  closing: number;
}

export interface LoanCalcResult {
  capex: number;
  marginPct: number;
  marginMoney: number;
  subsidyPct: number;
  subsidyAmount: number;
  netLoan: number;
  moratorium: number;
  moratoriumMonthlyInterest: number;
  totalMoratoriumInterest: number;
  regularEmi: number;
  totalInterestPaid: number;
  totalRepaymentPaid: number;
  dscr: string;
  schedule: ScheduleRow[];
}

export interface RAGChunk {
  id: string;
  title: string;
  authority: string;
  date: string;
  chunk: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  chunks?: RAGChunk[];
  timestamp: string;
}

export interface MarketIntelligence {
  district: string;
  state: string;
  classification: string;
  demandScore: number;
  competitionRadius: string;
  rawMaterialStatus: string;
  powerSupply: string;
  commercialRent: string;
  freshness: string;
  confidence: string;
}

export interface DPRReport {
  id: string;
  applicationId: string;
  title: string;
  applicant: string;
  location: string;
  date: string;
  fin: LoanCalcResult;
  summary: string;
}

export interface SavedPlan {
  id: string;
  ideaId?: string;
  title: string;
  name?: string;
  capex: number;
  investment?: number;
  subsidy: number;
  emi: number;
  date: string;
  readiness: number;
}
