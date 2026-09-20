import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, UserProfile, GPSLocation } from '../types';
import { LANGUAGES, getTranslation } from '../i18n';

interface AuthViewProps {
  lang: Language;
  onSelectLang: (lang: Language) => void;
  location: GPSLocation;
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  lang,
  onSelectLang,
  location,
  onLoginSuccess,
}) => {
  const [name, setName] = useState('Ramesh Kumar');
  const [phone, setPhone] = useState('9848012345');
  const [category, setCategory] = useState<'special' | 'general'>('special');
  const [district, setDistrict] = useState(location.district);
  const [state, setState] = useState(location.state);

  // Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // OTP Modal State
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtp && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtp, countdown]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(generated);
    setOtpInputs(['', '', '', '']);
    setCountdown(30);
    setShowOtp(true);
  };

  const handleQuickDemoLogin = () => {
    setErrorMsg(null);
    onLoginSuccess({
      name: name || 'Ramesh Kumar',
      phone: phone || '9848012345',
      category,
    });
  };

  const handleOtpInput = (index: number, val: string) => {
    const nextInputs = [...otpInputs];
    nextInputs[index] = val.slice(-1);
    setOtpInputs(nextInputs);

    // Auto-focus next input
    if (val && index < 3) {
      const nextEl = document.getElementById(`otp_box_${index + 1}`);
      nextEl?.focus();
    }
  };

  const handleVerify = () => {
    setErrorMsg(null);
    const entered = otpInputs.join('');
    if (entered === otpCode || entered === '1234' || entered.length === 4) {
      setShowOtp(false);
      onLoginSuccess({
        name,
        phone,
        category,
      });
    } else {
      setErrorMsg('Invalid OTP code. Please enter the 4-digit code shown or click Auto-Fill.');
    }
  };

  const handleAutofill = () => {
    if (otpCode) {
      setOtpInputs(otpCode.split(''));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-[#FBF7EE] to-[#F3ECE0]">
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#DDD1B8] rounded-2xl p-6 md:p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B5551E]/10 text-2xl mb-2">
            🌱
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#8C3E14] mb-1">
            {getTranslation('app_name', lang)}
          </h1>
          <p className="text-xs text-[#5E5648] font-medium">
            {getTranslation('tagline', lang)}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Full Name / पूरा नाम
            </label>
            <input
              id="lg_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrepreneur Name"
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Mobile Number / मोबाइल नंबर (10 Digits)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#DDD1B8] bg-[#F3ECE0] text-sm font-semibold text-[#231F18]">
                🇮🇳 +91
              </span>
              <input
                id="lg_phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98XXXXXXXX"
                maxLength={10}
                className="w-full px-3 py-2 rounded-r-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                District / ज़िला
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                State / राज्य
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Social Category (For Subsidy Tier Matching)
            </label>
            <select
              id="lg_cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'special' | 'general')}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            >
              <option value="special">
                SC / ST / OBC / Women / Minority (35% Rural Subsidy)
              </option>
              <option value="general">General Category (25% Rural Subsidy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E5648] mb-1">
              Portal Language / पोर्टल भाषा
            </label>
            <select
              id="lg_lang"
              value={lang}
              onChange={(e) => onSelectLang(e.target.value as Language)}
              className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
            >
              {(Object.keys(LANGUAGES) as Language[]).map((l) => (
                <option key={l} value={l}>
                  {LANGUAGES[l].native} ({LANGUAGES[l].name})
                </option>
              ))}
            </select>
          </div>

          {errorMsg && !showOtp && (
            <div className="p-3 rounded-lg bg-[#FAF2DC] border border-[#B88628] text-xs font-medium text-[#785310]">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            id="lg_submit_btn"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#B5551E] hover:bg-[#8C3E14] text-white font-semibold text-sm transition-all shadow-sm mt-2 cursor-pointer"
          >
            <span>Request 4-Digit OTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#DDD1B8]"></div>
            <span className="flex-shrink mx-3 text-[11px] text-[#8C8373] uppercase tracking-wider font-semibold">Or</span>
            <div className="flex-grow border-t border-[#DDD1B8]"></div>
          </div>

          <button
            type="button"
            id="lg_quick_demo_btn"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-lg border-2 border-[#1E5C4A] bg-[#E5F0EB]/60 hover:bg-[#E5F0EB] text-[#144134] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1E5C4A]" />
            <span>Instant Demo Access (Skip OTP)</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#DDD1B8] flex items-center justify-center gap-1.5 text-[11px] text-[#5E5648]">
          <ShieldCheck className="w-4 h-4 text-[#1E5C4A]" />
          <span>Grounded in RBI Priority Sector Lending & KVIC 2026 Directives</span>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#FFFDF8] border border-[#DDD1B8] rounded-2xl p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-[#231F18] text-center mb-1">
              {getTranslation('otp_title', lang)}
            </h3>
            <p className="text-xs text-[#5E5648] text-center mb-4">
              Verification SMS dispatched to <strong>+91 {phone}</strong>
            </p>

            {errorMsg && (
              <div className="p-2.5 mb-3 rounded-lg bg-[#FAF2DC] border border-[#B88628] text-xs font-medium text-[#785310]">
                {errorMsg}
              </div>
            )}

            {/* Simulated SMS Dispatch Notification */}
            <div className="p-3 mb-4 rounded-lg bg-[#FAF2DC] border border-dashed border-[#B88628] text-xs text-[#785310]">
              <div className="font-bold mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B88628]" />
                Simulated SMS Gateway:
              </div>
              "Govt of India / Aarambh: <strong>{otpCode}</strong> is your one-time verification code."
            </div>

            {/* 4 Digit Boxes */}
            <div className="flex justify-center gap-3 mb-4">
              {otpInputs.map((digit, i) => (
                <input
                  key={i}
                  id={`otp_box_${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  className="w-12 h-14 text-center font-bold text-2xl rounded-lg border-2 border-[#DDD1B8] focus:border-[#B5551E] focus:outline-none bg-white"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-[#5E5648] mb-4">
              <span>
                Resend in: <strong>{countdown}s</strong>
              </span>
              <button
                type="button"
                onClick={handleAutofill}
                className="text-[#B5551E] font-bold hover:underline"
              >
                Auto-Fill ({otpCode})
              </button>
            </div>

            <button
              type="button"
              id="otp_verify_btn"
              onClick={handleVerify}
              className="w-full py-3 rounded-lg bg-[#1E5C4A] hover:bg-[#144134] text-white font-semibold text-sm transition-all shadow-sm"
            >
              {getTranslation('otp_verify_btn', lang)}
            </button>
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="w-full mt-2 py-2 text-xs font-semibold text-[#5E5648] hover:text-[#231F18]"
            >
              Cancel & Change Number
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
