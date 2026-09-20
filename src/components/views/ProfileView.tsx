import React, { useState } from 'react';
import { UserCheck, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { UserProfile, CapitalState, Language } from '../../types';
import { calculateBankReadiness } from '../../utils/calculator';
import { getTranslation } from '../../i18n';

interface ProfileViewProps {
  user: UserProfile;
  capital: CapitalState;
  lang: Language;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  capital,
  lang,
  onUpdateUser,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentScore = calculateBankReadiness(formData, capital);

  const handleChange = <K extends keyof UserProfile>(key: K, val: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-[#FFFDF8] border border-[#DDD1B8] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD1B8] gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-[#231F18] m-0">
              {getTranslation('nav_profile', lang)} & Demographic Parameters
            </h2>
            <p className="text-xs text-[#5E5648] mt-1">
              Your demographics, education, and credit history automatically drive subsidy tiers and bank underwriting clearances.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#E5F0EB] px-3.5 py-2 rounded-lg border border-[#1E5C4A]/30 self-start sm:self-auto">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#144134] block">Bank Readiness</span>
              <span className="text-lg font-bold text-[#144134]">{currentScore}%</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-5">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Full Name / पूरा नाम
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Mobile Number (Aadhaar-Linked)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2: Gender & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Gender (Crucial for Women Subsidy Quotas & Stand-Up India)
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female' | 'transgender')}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              >
                <option value="female">Female (Qualifies for 35% PMEGP & Stand-Up India)</option>
                <option value="male">Male</option>
                <option value="transgender">Transgender (Special Category)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Age in Years (Must be 18+ for PMEGP)
              </label>
              <input
                type="number"
                min="18"
                max="75"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Category & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Social Category (Determines 35% vs 25% Subsidy)
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as 'special' | 'general')}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              >
                <option value="special">
                  SC / ST / OBC / Women / Minority (35% Rural Subsidy, 5% Margin)
                </option>
                <option value="general">General Category (25% Rural Subsidy, 10% Margin)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Highest Education (8th Pass Needed for Mfg &gt; ₹10L)
              </label>
              <select
                value={formData.education}
                onChange={(e) =>
                  handleChange(
                    'education',
                    e.target.value as 'below8' | '8th' | '10th' | '12th' | 'graduate'
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              >
                <option value="below8">Below 8th Standard</option>
                <option value="8th">8th Standard Pass (PMEGP Eligible &gt; ₹10L)</option>
                <option value="10th">10th / Matriculation Pass</option>
                <option value="12th">12th / ITI / Diploma</option>
                <option value="graduate">Graduate & Above</option>
              </select>
            </div>
          </div>

          {/* Row 4: Land & Shed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Land Available (Acres)
              </label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={formData.landAcres}
                onChange={(e) => handleChange('landAcres', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Existing Shed / Premise Available
              </label>
              <select
                value={formData.hasShed ? 'true' : 'false'}
                onChange={(e) => handleChange('hasShed', e.target.value === 'true')}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              >
                <option value="true">Yes, own premise/shed ready</option>
                <option value="false">No, will lease or construct</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                PM Jan Dhan / Bank Account
              </label>
              <select
                value={formData.hasJanDhan ? 'true' : 'false'}
                onChange={(e) => handleChange('hasJanDhan', e.target.value === 'true')}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              >
                <option value="true">Yes, active Jan Dhan account</option>
                <option value="false">No savings account</option>
              </select>
            </div>
          </div>

          {/* Row 5: Credit Band & Existing Debt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Credit / CIBIL History Band
              </label>
              <select
                value={formData.creditBand}
                onChange={(e) =>
                  handleChange('creditBand', e.target.value as 'new' | 'fair' | 'good')
                }
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              >
                <option value="good">Prime / Good Record (750+ CIBIL or Clean Shishu repayment)</option>
                <option value="fair">Fair (650–749 CIBIL)</option>
                <option value="new">New to Credit (No Prior Formal Bank Loans)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Existing Monthly Debt / EMIs (₹)
              </label>
              <input
                type="number"
                step="500"
                min="0"
                value={formData.existingDebt}
                onChange={(e) => handleChange('existingDebt', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDD1B8] flex items-center justify-between">
            <button
              type="submit"
              id="save_profile_btn"
              className="px-5 py-2.5 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white font-semibold text-sm transition-all shadow-xs"
            >
              Save Profile & Recalculate Subsidies
            </button>
            {savedSuccess && (
              <span className="text-xs font-bold text-[#1E5C4A] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Underwriting Readiness Factors */}
      <div className="bg-[#FAF7F0] border border-[#DDD1B8] rounded-xl p-5">
        <h4 className="font-display text-base font-bold text-[#231F18] mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B88628]" />
          Bank Underwriting Factor Audit
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-[#DDD1B8]">
            <strong className="text-[#231F18] block mb-0.5">Jan Dhan & KYC</strong>
            <p className="text-[#5E5648]">
              {formData.hasJanDhan ? '✓ Active account verified for DBT subsidy receipt.' : '⚠ Please open a Jan Dhan account to receive direct subsidy.'}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#DDD1B8]">
            <strong className="text-[#231F18] block mb-0.5">Educational Clearance</strong>
            <p className="text-[#5E5648]">
              {formData.education !== 'below8' ? '✓ Qualified for large scale manufacturing (>₹10L).' : '⚠ Capped at ₹10L manufacturing under PMEGP.'}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#DDD1B8]">
            <strong className="text-[#231F18] block mb-0.5">Promoter Equity Leverage</strong>
            <p className="text-[#5E5648]">
              {formData.category === 'special' ? '✓ Special category: Only 5% minimum own equity required.' : 'General category: 10% minimum own equity required.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
