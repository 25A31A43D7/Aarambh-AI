import React, { useState } from 'react';
import { ShieldCheck, Search, ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';
import { RAG_SOURCES_DB } from '../../data/knowledge';
import { Language } from '../../types';
import { getTranslation } from '../../i18n';

interface SourcesViewProps {
  lang: Language;
  onOpenSourceModal: (sourceId: string) => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  lang,
  onOpenSourceModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredSources = RAG_SOURCES_DB.filter((src) => {
    if (categoryFilter !== 'all' && src.category !== categoryFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      src.title.toLowerCase().includes(term) ||
      src.authority.toLowerCase().includes(term) ||
      src.circularRef.toLowerCase().includes(term) ||
      src.excerpt.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="pb-3 border-b border-[#DDD1B8] mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#1E5C4A]">
            Regulatory Audit Trail & Grounding Transparency
          </span>
          <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
            {getTranslation('nav_sources', lang)} — Verifiable Statutory Repository
          </h2>
          <p className="text-xs text-[#5E5648] mt-1">
            Every loan formula, subsidy percentage, and moratorium calculation in Aarambh AI is directly backed by official gazette notifications and master circulars.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8373] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search circulars by keyword, ministry, or topic..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-xs md:text-sm focus:border-[#1E5C4A] focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-xs font-semibold text-[#5E5648] focus:border-[#1E5C4A] focus:outline-none"
          >
            <option value="all">All Regulatory Categories</option>
            <option value="subsidy">KVIC & PMEGP Subsidies</option>
            <option value="banking">RBI Master Circulars</option>
            <option value="agriculture">NABARD Farm Economics</option>
            <option value="market">APMC Mandi & State Rates</option>
            <option value="legal">FSSAI & Regulatory Licensing</option>
          </select>
        </div>

        {/* Sources List */}
        <div className="space-y-3">
          {(filteredSources || []).map((source) => (
            <div
              key={source.id}
              className="p-4 bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl hover:border-[#1E5C4A] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-[#E5F0EB] text-[#1E5C4A]">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h3 className="font-display text-sm md:text-base font-bold text-[#231F18] m-0">
                    {source.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3ECE0] text-[#5E5648] uppercase">
                    {source.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenSourceModal(source.id)}
                    className="px-2.5 py-1 rounded-lg border border-[#DDD1B8] bg-white hover:bg-[#F3ECE0] text-xs font-semibold text-[#1D5C8A] flex items-center gap-1"
                  >
                    <span>View Excerpt</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#5E5648] mb-2 flex flex-wrap gap-x-4 gap-y-1">
                <span>Authority: <strong>{source.authority}</strong></span>
                <span>Ref: <strong>{source.circularRef}</strong></span>
                <span>Date: <strong>{source.date}</strong></span>
              </div>

              <div className="p-3 bg-[#FAF7F0] border-l-3 border-[#1E5C4A] rounded-r-lg text-xs text-[#231F18] font-mono leading-relaxed">
                "{source.excerpt}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
