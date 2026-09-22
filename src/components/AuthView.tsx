import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  User,
  Check,
  Building2,
  Lock,
} from 'lucide-react';
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
  const [townCity, setTownCity] = useState('Warangal');
  const [district, setDistrict] = useState(location.district || 'Warangal');
  const [state, setState] = useState(location.state || 'Telangana');
  const [category, setCategory] = useState<'special' | 'general'>('special');

  // Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // OTP Modal State
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);

  // Google Sign-In State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleSelectedAccount, setGoogleSelectedAccount] = useState<'primary' | 'custom'>('primary');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);

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
      townCity: townCity || 'Warangal',
      category,
      authProvider: 'phone',
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
        townCity: townCity || 'Warangal',
        category,
        authProvider: 'phone',
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

  // Google Sign-In Execution
  const handleConfirmGoogleSignIn = () => {
    setIsGoogleVerifying(true);
    setTimeout(() => {
      setIsGoogleVerifying(false);
      setShowGoogleModal(false);

      if (googleSelectedAccount === 'primary') {
        onLoginSuccess({
          name: 'Gnapika Chilukuri',
          email: 'gnapikaphanichilukuri@gmail.com',
          phone: phone || '9848012345',
          townCity: townCity || 'Warangal',
          category,
          authProvider: 'google',
        });
      } else {
        const resolvedName = customGoogleName.trim() || 'Google Entrepreneur';
        const resolvedEmail = customGoogleEmail.trim() || 'entrepreneur@gmail.com';
        onLoginSuccess({
          name: resolvedName,
          email: resolvedEmail,
          phone: phone || '9848012345',
          townCity: townCity || 'Warangal',
          category,
          authProvider: 'google',
        });
      }
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-[#FBF7EE] to-[#F3ECE0]">
      <div className="w-full max-w-lg bg-[#FFFDF8] border border-[#DDD1B8] rounded-2xl p-6 md:p-8 shadow-xl">
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

        {/* Google Authentication Button */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            id="google_signin_btn"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-[#DDD1B8] bg-white hover:bg-[#FAF7F0] hover:border-[#4285F4] text-[#231F18] font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer group"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm font-semibold text-[#231F18] group-hover:text-[#4285F4] transition-colors">
              Continue with Google
            </span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#DDD1B8]"></div>
            <span className="flex-shrink mx-3 text-[11px] text-[#8C8373] uppercase tracking-wider font-semibold">
              Or Mobile & Aadhaar OTP
            </span>
            <div className="flex-grow border-t border-[#DDD1B8]"></div>
          </div>
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

          {/* Town/City, District & State 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                Town / City / शहर
              </label>
              <input
                id="lg_town_city"
                type="text"
                value={townCity}
                onChange={(e) => setTownCity(e.target.value)}
                placeholder="e.g. Warangal"
                className="w-full px-3 py-2 rounded-lg border border-[#DDD1B8] bg-white text-sm focus:border-[#B5551E] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E5648] mb-1">
                District / ज़िला
              </label>
              <input
                id="lg_district"
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
                id="lg_state"
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

      {/* Google Authentication Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#DDD1B8] text-[#231F18]">
            {/* Google Header */}
            <div className="p-5 border-b border-[#E8EAED] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-semibold text-sm text-[#202124]">
                  Sign in with Google
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-full text-[#5F6368] hover:bg-[#F1F3F4] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google Body */}
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-base text-[#202124] m-0">Choose an account</h4>
                <p className="text-xs text-[#5F6368] m-0 mt-0.5">
                  to continue to <strong className="text-[#202124]">Aarambh AI</strong> (Town: {townCity || 'Warangal'})
                </p>
              </div>

              {/* Account list */}
              <div className="space-y-2">
                {/* Account 1: Gnapika Chilukuri */}
                <div
                  onClick={() => setGoogleSelectedAccount('primary')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    googleSelectedAccount === 'primary'
                      ? 'border-[#4285F4] bg-[#E8F0FE]'
                      : 'border-[#DADCE0] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E5C4A] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      G
                    </div>
                    <div>
                      <strong className="text-xs text-[#202124] block">Gnapika Chilukuri</strong>
                      <span className="text-[11px] text-[#5F6368]">gnapikaphanichilukuri@gmail.com</span>
                    </div>
                  </div>
                  {googleSelectedAccount === 'primary' && (
                    <div className="w-5 h-5 rounded-full bg-[#4285F4] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Account 2: Custom Google Account */}
                <div
                  onClick={() => setGoogleSelectedAccount('custom')}
                  className={`p-3.5 rounded-xl border transition-all ${
                    googleSelectedAccount === 'custom'
                      ? 'border-[#4285F4] bg-[#E8F0FE]'
                      : 'border-[#DADCE0] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5F6368] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-xs text-[#202124] block">Use another Google account</strong>
                        <span className="text-[11px] text-[#5F6368]">Enter custom name & Gmail</span>
                      </div>
                    </div>
                    {googleSelectedAccount === 'custom' && (
                      <div className="w-5 h-5 rounded-full bg-[#4285F4] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {googleSelectedAccount === 'custom' && (
                    <div className="mt-3 pt-3 border-t border-[#DADCE0] space-y-2">
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DADCE0] bg-white text-xs focus:border-[#4285F4] focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DADCE0] bg-white text-xs focus:border-[#4285F4] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Data & Privacy notice */}
              <div className="p-3 bg-[#F8F9FA] rounded-xl text-[11px] text-[#5F6368] space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[#202124]">
                  <Lock className="w-3.5 h-3.5 text-[#1E5C4A]" />
                  Secure Google Identity Services Client
                </div>
                <p className="m-0">
                  To continue, Google will share your name, email address, language preference, and profile picture with Aarambh AI.
                </p>
              </div>
            </div>

            {/* Google Footer */}
            <div className="p-4 bg-[#F8F9FA] border-t border-[#E8EAED] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5F6368] hover:text-[#202124] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="google_confirm_btn"
                onClick={handleConfirmGoogleSignIn}
                disabled={isGoogleVerifying}
                className="px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGoogleVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Google Account...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
