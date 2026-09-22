import React, { useState, useMemo } from 'react';
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Navigation,
  FileCheck,
  Search,
  Filter,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react';
import { GPSLocation, Language } from '../types';
import { getNearbyBankBranches, BankBranch } from '../utils/bankBranches';

interface NearbyBankBranchFinderProps {
  location: GPSLocation;
  lang?: Language;
  onSelectTargetBranch?: (branch: BankBranch) => void;
  selectedBranchId?: string;
}

export const NearbyBankBranchFinder: React.FC<NearbyBankBranchFinderProps> = ({
  location,
  lang = 'en',
  onSelectTargetBranch,
  selectedBranchId: externalSelectedBranchId,
}) => {
  const branches = useMemo(() => getNearbyBankBranches(location), [location]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'RRB' | 'PSB' | 'PMEGP'>('ALL');
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [copiedIfsc, setCopiedIfsc] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    externalSelectedBranchId || branches[0]?.id || 'branch-1'
  );
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Distance filter
      if (branch.distanceKm > maxDistance) return false;

      // Type filter
      if (selectedType === 'RRB' && branch.type !== 'RRB') return false;
      if (selectedType === 'PSB' && branch.type !== 'PSB') return false;
      if (selectedType === 'PMEGP' && !branch.isPmegpNodal) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          branch.name.toLowerCase().includes(q) ||
          branch.bankName.toLowerCase().includes(q) ||
          branch.ifsc.toLowerCase().includes(q) ||
          branch.address.toLowerCase().includes(q) ||
          branch.nodalOfficer.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [branches, searchQuery, selectedType, maxDistance]);

  const handleCopyIfsc = (ifsc: string) => {
    navigator.clipboard.writeText(ifsc);
    setCopiedIfsc(ifsc);
    setTimeout(() => setCopiedIfsc(null), 2500);
  };

  const handleSelectBranch = (branch: BankBranch) => {
    setSelectedBranchId(branch.id);
    if (onSelectTargetBranch) {
      onSelectTargetBranch(branch);
    }
  };

  const targetBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <div className="bg-[#FFFDF8] border-2 border-[#DDD1B8] rounded-2xl p-5 md:p-7 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD1B8] gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E5C4A]/10 text-[#1E5C4A] flex items-center justify-center shrink-0 mt-0.5">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F0EB] text-[#1E5C4A] uppercase tracking-wider mb-1">
              <MapPin className="w-3 h-3 text-[#B5551E]" />
              GPS Proximity: {location.village || location.district}, {location.state}
            </div>
            <h3 className="font-display text-lg md:text-xl font-bold text-[#231F18] m-0">
              Nearby Bank Branch Finder (Lead & PMEGP Nodal Centers)
            </h3>
            <p className="text-xs text-[#5E5648] m-0 mt-0.5">
              Identify and connect with local Lead Banks and Regional Rural Banks authorized to appraise and sanction your Bank Project Report (DPR).
            </p>
          </div>
        </div>

        {targetBranch && (
          <div className="p-2.5 bg-[#F3ECE0] rounded-xl border border-[#DDD1B8] flex items-center gap-2 self-start sm:self-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1E5C4A] animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-[#8C8373] uppercase block font-semibold">Target Submission Branch</span>
              <strong className="text-xs text-[#231F18] block truncate max-w-[200px]">
                {targetBranch.bankName}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#8C8373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bank name, IFSC, town, or officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#DDD1B8] rounded-xl text-[#231F18] placeholder-[#8C8373] focus:outline-none focus:ring-2 focus:ring-[#1E5C4A]"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
          <button
            type="button"
            onClick={() => setSelectedType('ALL')}
            className={`text-[11px] px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              selectedType === 'ALL'
                ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]'
                : 'bg-white text-[#5E5648] border-[#DDD1B8] hover:bg-[#F3ECE0]'
            }`}
          >
            All Banks ({branches.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('RRB')}
            className={`text-[11px] px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              selectedType === 'RRB'
                ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]'
                : 'bg-white text-[#5E5648] border-[#DDD1B8] hover:bg-[#F3ECE0]'
            }`}
          >
            Rural Banks (RRBs)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('PSB')}
            className={`text-[11px] px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              selectedType === 'PSB'
                ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]'
                : 'bg-white text-[#5E5648] border-[#DDD1B8] hover:bg-[#F3ECE0]'
            }`}
          >
            Lead Banks (SBI / UBI)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('PMEGP')}
            className={`text-[11px] px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              selectedType === 'PMEGP'
                ? 'bg-[#B5551E] text-white border-[#B5551E]'
                : 'bg-white text-[#8C3E14] border-[#DDD1B8] hover:bg-[#F3ECE0]'
            }`}
          >
            PMEGP Nodal Only
          </button>
        </div>
      </div>

      {/* Distance Radius Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-[#FAF7F0] p-3 rounded-xl border border-[#DDD1B8] gap-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-[#B5551E]" />
          <span className="text-[#5E5648]">Search Radius:</span>
          <strong className="text-[#231F18]">Within {maxDistance} km of current location</strong>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMaxDistance(5)}
            className={`text-[10px] px-2.5 py-1 rounded font-medium border ${
              maxDistance === 5 ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]' : 'bg-white text-[#5E5648] border-[#DDD1B8]'
            }`}
          >
            5 km
          </button>
          <button
            type="button"
            onClick={() => setMaxDistance(10)}
            className={`text-[10px] px-2.5 py-1 rounded font-medium border ${
              maxDistance === 10 ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]' : 'bg-white text-[#5E5648] border-[#DDD1B8]'
            }`}
          >
            10 km
          </button>
          <button
            type="button"
            onClick={() => setMaxDistance(25)}
            className={`text-[10px] px-2.5 py-1 rounded font-medium border ${
              maxDistance === 25 ? 'bg-[#1E5C4A] text-white border-[#1E5C4A]' : 'bg-white text-[#5E5648] border-[#DDD1B8]'
            }`}
          >
            25 km (All)
          </button>
        </div>
      </div>

      {/* Branch Cards List */}
      <div className="space-y-4">
        {filteredBranches.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF7F0] rounded-xl border border-dashed border-[#DDD1B8] text-xs text-[#5E5648]">
            No branches match your current filter. Try expanding the distance radius or searching for a different keyword.
          </div>
        ) : (
          filteredBranches.map((branch) => {
            const isSelected = branch.id === selectedBranchId;
            return (
              <div
                key={branch.id}
                className={`p-4 md:p-5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-[#FFFDF8] border-[#1E5C4A] shadow-md ring-2 ring-[#1E5C4A]/20'
                    : 'bg-[#FFFDF8] border-[#DDD1B8] hover:border-[#B5551E]/60 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-[#DDD1B8]">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base md:text-lg font-bold text-[#231F18]">
                        {branch.name}
                      </span>
                      {branch.isLeadBank && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF2DC] text-[#785310] border border-[#B88628]/40">
                          Lead Bank Office
                        </span>
                      )}
                      {branch.isPmegpNodal && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F0EB] text-[#1E5C4A] border border-[#1E5C4A]/40">
                          PMEGP Nodal Branch
                        </span>
                      )}
                      {branch.type === 'RRB' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF2EB] text-[#8C3E14] border border-[#B5551E]/40">
                          Regional Rural Bank (Fastest Sanction)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#5E5648] flex items-center gap-1.5 m-0">
                      <MapPin className="w-3.5 h-3.5 text-[#B5551E] shrink-0" />
                      <span>{branch.address}</span>
                    </p>
                  </div>

                  {/* Distance & Selection Badge */}
                  <div className="flex items-center md:flex-col md:items-end gap-2 shrink-0">
                    <span className="text-sm md:text-base font-display font-bold text-[#1E5C4A] bg-[#E5F0EB] px-2.5 py-0.5 rounded-lg border border-[#1E5C4A]/30">
                      {branch.distanceKm} km away
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectBranch(branch)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E5C4A] text-white'
                          : 'bg-white border border-[#DDD1B8] text-[#5E5648] hover:border-[#1E5C4A] hover:text-[#1E5C4A]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected for DPR</span>
                        </>
                      ) : (
                        <span>Select as Target Branch</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Key Underwriting & Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
                  {/* IFSC & Copy */}
                  <div className="p-2.5 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C8373] block">
                      IFSC Code
                    </span>
                    <div className="flex items-center justify-between">
                      <strong className="font-mono text-[#231F18] text-xs">{branch.ifsc}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyIfsc(branch.ifsc)}
                        className="text-[#1E5C4A] hover:text-[#144134] p-1 rounded hover:bg-[#EAE0CE] transition-all"
                        title="Copy IFSC code"
                      >
                        {copiedIfsc === branch.ifsc ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5C4A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DPR Desk Location */}
                  <div className="p-2.5 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C8373] block">
                      DPR Submission Desk
                    </span>
                    <span className="text-[11px] font-semibold text-[#231F18] block leading-tight">
                      {branch.dprDeskLocation}
                    </span>
                  </div>

                  {/* Nodal Officer Contact */}
                  <div className="p-2.5 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C8373] block">
                      Credit Nodal Officer
                    </span>
                    <span className="text-[11px] font-semibold text-[#231F18] block leading-tight truncate">
                      {branch.nodalOfficer}
                    </span>
                  </div>

                  {/* Operating Hours */}
                  <div className="p-2.5 bg-[#FAF7F0] rounded-lg border border-[#DDD1B8] space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8C8373] block">
                      Counter Timings
                    </span>
                    <span className="text-[11px] text-[#5E5648] block leading-tight flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B88628] shrink-0" />
                      <span className="truncate">{branch.operatingHours}</span>
                    </span>
                  </div>
                </div>

                {/* Branch Scheme Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8373] mr-1">
                    Specializations:
                  </span>
                  {branch.specializations.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F3ECE0] text-[#5E5648] border border-[#DDD1B8]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Guidance Card */}
      <div className="p-4 bg-gradient-to-r from-[#FAF7F0] to-[#F3ECE0] rounded-xl border border-[#DDD1B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <strong className="text-[#231F18] font-bold flex items-center gap-1.5 text-xs sm:text-sm">
            <FileCheck className="w-4 h-4 text-[#1E5C4A]" />
            <span>Ready to submit your Bank Project Report (DPR)?</span>
          </strong>
          <p className="text-[#5E5648] text-[11px] m-0">
            Submit 3 hard copies of the generated PDF alongside your Aadhaar, PAN, Land/Lease agreement, and 6 months bank statement to your selected branch credit officer.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowChecklistModal(!showChecklistModal)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white transition-all cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5 shadow-xs"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{showChecklistModal ? 'Close Checklist' : 'View Bank Submission Checklist'}</span>
        </button>
      </div>

      {/* Collapsible Bank Submission Checklist */}
      {showChecklistModal && (
        <div className="p-4 rounded-xl bg-white border-2 border-[#1E5C4A] space-y-3 animate-fadeIn text-xs">
          <h4 className="font-display font-bold text-sm text-[#231F18] m-0 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1E5C4A]" />
            <span>Official Bank Branch Submission Checklist for Rural Entrepreneurs</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5 p-3 rounded-lg bg-[#FAF7F0] border border-[#DDD1B8]">
              <strong className="text-[#144134] block font-bold">1. Mandatory Statutory Documents</strong>
              <ul className="space-y-1 text-[#5E5648] list-disc list-inside">
                <li>3 printed copies of Aarambh AI Detailed Project Report (DPR) with signed loan amortization schedule</li>
                <li>Aadhaar Card and PAN Card of borrower (self-attested)</li>
                <li>2 Passport size photographs</li>
                <li>Caste / Special Category Certificate (for 35% PMEGP subsidy eligibility)</li>
              </ul>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-[#FAF7F0] border border-[#DDD1B8]">
              <strong className="text-[#144134] block font-bold">2. Land & Commercial Premises Documents</strong>
              <ul className="space-y-1 text-[#5E5648] list-disc list-inside">
                <li>Gram Panchayat No-Objection Certificate (NOC) / Trade License</li>
                <li>Registered Lease Agreement (minimum 5 years) or Patta Land title deed</li>
                <li>Quotation for machinery and equipment from registered GST vendors</li>
                <li>Last 6 months savings bank account statement</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DDD1B8] flex items-center justify-between text-[11px] text-[#8C8373]">
            <span>Tip: Request the branch manager to register your proposal on the JanSamarth / KVIC portal immediately to reserve your subsidy quota.</span>
          </div>
        </div>
      )}
    </div>
  );
};
