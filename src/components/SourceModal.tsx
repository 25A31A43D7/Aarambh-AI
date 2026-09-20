import React from 'react';
import { X, ShieldCheck, ExternalLink, BookOpen } from 'lucide-react';
import { RAG_SOURCES_DB } from '../data/knowledge';

interface SourceModalProps {
  sourceId: string | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ sourceId, onClose }) => {
  if (!sourceId) return null;

  const source = RAG_SOURCES_DB.find((s) => s.id === sourceId) || RAG_SOURCES_DB[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#FFFDF8] border border-[#DDD1B8] rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#5E5648] hover:text-[#231F18] hover:bg-[#F3ECE0]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-[#1E5C4A]" />
          <span className="text-[11px] uppercase font-bold text-[#1E5C4A] tracking-wider">
            Verified Regulatory Citation
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-[#231F18] mb-1">
          {source.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5E5648] mb-4 pb-3 border-b border-[#DDD1B8]">
          <span>Issuing Authority: <strong>{source.authority}</strong></span>
          <span>Notification Ref: <strong>{source.circularRef}</strong></span>
          <span>Date: <strong>{source.date}</strong></span>
        </div>

        <div className="space-y-3 mb-5">
          <span className="text-xs font-bold text-[#231F18] uppercase tracking-wider block">
            Verbatim Gazette / Circular Extract:
          </span>
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#DDD1B8] text-xs font-mono leading-relaxed text-[#231F18] max-h-60 overflow-y-auto">
            "{source.excerpt}"
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#DDD1B8]">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#1D5C8A] hover:underline flex items-center gap-1"
          >
            <span>Visit Official Government Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1E5C4A] text-white text-xs font-semibold hover:bg-[#144134] transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
