import React, { useState } from 'react';
import { Landmark, ExternalLink, CheckCircle2, XCircle, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import { UserProfile, GPSLocation, BusinessIdea, Language, SchemeRule } from '../../types';
import { SCHEMES_DB, evaluateSchemeEligibility } from '../../data/schemes';
import { fmtINR } from '../../utils/calculator';
import { getTranslation } from '../../i18n';

interface SchemesViewProps {
  user: UserProfile;
  location: GPSLocation;
  activeIdea: BusinessIdea;
  lang: Language;
  onOpenSourceModal: (sourceId: string) => void;
  onNavigate: (view: string) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  user,
  location,
  activeIdea,
  lang,
  onOpenSourceModal,
  onNavigate,
}) => {
  const [selectedScheme, setSelectedScheme] = useState<SchemeRule>(SCHEMES_DB[0]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="pb-3 border-b border-[#DDD1B8] mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A]">
            Official Government Credit & Subsidy Architecture
          </span>
          <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
            {getTranslation('nav_schemes', lang)} — Central & State Directives
          </h2>
          <p className="text-xs text-[#5E5648] mt-1">
            Grounded in Ministry of MSME, MoFPI, and NABARD guidelines. Eligibility evaluated in real-time against your social category, location, and project cost.
          </p>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCHEMES_DB.map((scheme) => {
            const eligibility = evaluateSchemeEligibility(scheme, user, location, activeIdea.fixedCapex);
            const isSelected = selectedScheme.id === scheme.id;

            return (
              <div
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className={`bg-[#FFFDF8] border rounded-xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#1E5C4A] ring-2 ring-[#1E5C4A]/20 bg-[#FAF7F0]'
                    : 'border-[#DDD1B8] hover:border-[#1E5C4A]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-display text-base font-bold text-[#231F18] m-0">
                    {scheme.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                      eligibility.eligible
                        ? 'bg-[#DEEAE3] text-[#144134]'
                        : 'bg-[#FDEBE8] text-[#A23B27]'
                    }`}
                  >
                    {eligibility.eligible ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ELIGIBLE</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>INELIGIBLE</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="text-[11px] text-[#5E5648] mb-3">
                  Nodal Authority: <strong>{scheme.ministry || scheme.authority || 'Ministry of MSME'}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded bg-white border border-[#DDD1B8]/80">
                    <span className="text-[10px] text-[#8C8373] block">Max Project Limit</span>
                    <strong className="text-[#231F18]">{scheme.maxLoan ? fmtINR(scheme.maxLoan) : scheme.loan}</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#DDD1B8]/80">
                    <span className="text-[10px] text-[#8C8373] block">Your Subsidy Rate</span>
                    <strong className="text-[#1E5C4A]">{eligibility.subsidyPct}%</strong>
                  </div>
                </div>

                <p className="text-xs text-[#5E5648] line-clamp-2">
                  {scheme.description || scheme.subsidy || scheme.eligibility}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Scheme Deep Dive */}
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#DDD1B8] gap-2">
          <div>
            <span className="text-[11px] uppercase font-bold text-[#1E5C4A]">
              Scheme Dossier & Operational Guidelines
            </span>
            <h3 className="font-display text-lg font-bold text-[#231F18] m-0">
              {selectedScheme.name}
            </h3>
          </div>
          <a
            href={selectedScheme.officialPortal || 'https://www.jansamarth.in'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#1D5C8A] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#E5F0EB] rounded-lg">
            <span className="text-[11px] text-[#144134] font-semibold block">Max Loan Ceiling</span>
            <strong className="text-base text-[#144134]">{selectedScheme.maxLoan ? fmtINR(selectedScheme.maxLoan) : selectedScheme.loan}</strong>
          </div>
          <div className="p-3 bg-[#FAF2DC] rounded-lg">
            <span className="text-[11px] text-[#785310] font-semibold block">Security / Collateral</span>
            <strong className="text-base text-[#785310]">{selectedScheme.collateral || 'Guaranteed under CGTMSE / NCGTC (Collateral-Free)'}</strong>
          </div>
          <div className="p-3 bg-[#E8F2F9] rounded-lg">
            <span className="text-[11px] text-[#1D5C8A] font-semibold block">Application Platform</span>
            <strong className="text-base text-[#1D5C8A]">{selectedScheme.applicationPortal || 'JanSamarth Portal (jansamarth.in)'}</strong>
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div>
          <h4 className="text-xs font-bold text-[#231F18] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-[#1E5C4A]" />
            Statutory KYC & Dossier Submission Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(selectedScheme.documentsRequired || selectedScheme.checklist || []).map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FAF7F0] border border-[#DDD1B8]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5C4A] shrink-0" />
                <span className="text-[#231F18] font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Step Action */}
        <div className="pt-3 border-t border-[#DDD1B8] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenSourceModal(selectedScheme.ragSourceId || 'rag_pmegp_subsidy')}
            className="text-xs font-semibold text-[#1D5C8A] hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Inspect Verified Regulatory Source Circular</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span>Generate Bank-Ready Proposal with {selectedScheme.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
