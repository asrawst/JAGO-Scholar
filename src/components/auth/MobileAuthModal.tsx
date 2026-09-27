import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X,
  Smartphone, 
  Lock, 
  ArrowRight, 
  ShieldCheck,
  FileKey,
  FolderLock,
  CheckCircle2,
  ExternalLink,
  User,
  GraduationCap,
  Building,
  Banknote,
  RotateCcw,
  Globe
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { DigiLockerFullFlowModal } from '../documents/DigiLockerFullFlowModal';
import { LanguageSelectionScreen } from '../common/LanguageSelectionScreen';

interface Props {
  forcedOpen?: boolean;
}

export const MobileAuthModal: React.FC<Props> = ({ forcedOpen = false }) => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    isAuthenticated,
    language, 
    showToast,
    loginWithAadhaar,
    loginWithDigiLocker,
    signupScholar,
    profile
  } = useApp();

  const isModalActive = isAuthModalOpen || forcedOpen || !isAuthenticated;

  // Flow Step: Language Selection -> Login/Signup Form
  const [authStep, setAuthStep] = useState<'language' | 'form'>('language');

  // Primary Tab: Login vs Signup
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>('login');
  
  // Login Sub-mode
  const [loginMethod, setLoginMethod] = useState<'aadhaar' | 'digilocker' | 'otr'>('aadhaar');

  // DigiLocker Flow modal state
  const [showDigiLockerFlow, setShowDigiLockerFlow] = useState(false);

  // Login Inputs
  const [aadhaarNum, setAadhaarNum] = useState('123456789012');
  const [mobileNum, setMobileNum] = useState('9876543210');
  const [otrNum, setOtrNum] = useState('JH2026MOTAPMS0991');
  const [otpVal, setOtpVal] = useState('842217');
  
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isSignupOtpStep, setIsSignupOtpStep] = useState(false);
  const [signupOtpVal, setSignupOtpVal] = useState('842217');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);

  // Signup Form Inputs (Pre-populated with Rahul Kumar's profile details wrt research specification)
  const [signupForm, setSignupForm] = useState({
    firstName: 'Rahul',
    lastName: 'Kumar',
    name: 'Rahul Kumar',
    dob: '2004-06-14',
    gender: 'Male',
    aadhaar: '123456789012',
    mobile: '9876543210',
    category: 'ST',
    tribe: 'Santhal',
    state: 'Jharkhand',
    district: 'Ranchi',
    course: 'B.Tech - Computer Science & Engineering',
    college: 'Birsa Institute of Tribal Technology, Ranchi',
    annualIncome: '180000',
    bankName: 'State Bank of India (SBI)',
    accountNo: '389201948142'
  });

  if (!isModalActive) return null;

  const isHi = language === 'hi';

  const handleSendOtp = () => {
    setIsOtpStep(true);
    if (loginMethod === 'aadhaar') {
      setOtpVal('842217'); // Research spec Page 15
      showToast({
        type: 'info',
        title: 'UIDAI Aadhaar OTP Dispatched',
        message: 'Demo OTP: 842217 (UIDAI e-KYC Gateway)'
      });
    } else {
      handleDirectOtrLogin();
    }
  };

  const handleDirectOtrLogin = async () => {
    await loginWithAadhaar('123456789012');
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    await loginWithAadhaar(aadhaarNum);
    setIsSubmitting(false);
  };

  const handleDigiLockerOAuth = async () => {
    setDigiLockerLoading(true);
    await loginWithDigiLocker();
    setDigiLockerLoading(false);
  };

  const handleInitiateSignup = () => {
    setIsSignupOtpStep(true);
    setSignupOtpVal('842217');
  };

  const handleSignupSubmit = async () => {
    setIsSubmitting(true);
    
    // Create new profile object
    const fullName = `${signupForm.firstName || ''} ${signupForm.lastName || ''}`.trim() || 'Rahul Kumar';
    const newProfile: Partial<StudentProfile> = {
      name: fullName,
      dob: signupForm.dob,
      gender: signupForm.gender as any,
      mobile: `+91 ${signupForm.mobile}`,
      aadhaarMasked: `XXXX-XXXX-${signupForm.aadhaar.slice(-4) || '8921'}`,
      social: {
        ...profile.social,
        category: 'ST',
        tribeCommunity: signupForm.tribe,
        verificationStatus: 'verified'
      },
      academic: {
        ...profile.academic,
        courseName: signupForm.course,
        institutionName: signupForm.college,
        academicVerificationStatus: 'verified'
      },
      family: {
        ...profile.family,
        annualIncome: Number(signupForm.annualIncome) || 180000,
        incomeVerificationStatus: 'verified'
      },
      bank: {
        ...profile.bank,
        bankName: signupForm.bankName,
        accountNoMasked: `••••••••${signupForm.accountNo.slice(-4) || '8142'}`,
        isDbtEnabled: true,
        verificationStatus: 'verified'
      },
      profileCompletionPercentage: 100
    };

    await signupScholar(newProfile);
    setIsSubmitting(false);
    setIsSignupOtpStep(false);
    setIsAuthModalOpen(false);
  };

  // 1. If currently in Language Choosing Step during login/signup:
  if (authStep === 'language') {
    return (
      <LanguageSelectionScreen 
        onContinue={() => setAuthStep('form')} 
      />
    );
  }

  // 2. Centered Login / Registration / OTP Form:
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between bg-white text-slate-900 animate-fade-in overflow-y-auto overscroll-contain">
      {/* Close Button if already authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full transition-all z-20 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Main Form & OTP Section */}
      <div className="flex-1 px-5 pb-3 pt-6 flex flex-col justify-between">
        {/* Main Login / Registration / OTP Content Block - Top Aligned */}
        <div className="w-full max-w-md mx-auto space-y-4 text-center mt-1 mb-auto">
          {/* Slightly Enlarged Logo */}
          <div className="flex items-center justify-center pt-2 pb-1">
            <img 
              src="/jago_scholar_logo.png" 
              alt="JAGO Scholar" 
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>
        {isOtpStep || isSignupOtpStep ? (
          /* ===================== PURE DEDICATED OTP VERIFICATION SCREEN ===================== */
          <div className="space-y-4 animate-fade-in py-2">
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 bg-amber-50 text-[#F57C00] rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xs mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl text-slate-900">
                {isHi ? 'आधार प्रमाणीकरण ओटीपी' : 'Aadhaar OTP Verification'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isHi 
                  ? 'पंजीकृत मोबाइल नंबर पर 6-अंकों का e-KYC ओटीपी भेजा गया है' 
                  : `Enter the 6-digit Aadhaar e-KYC OTP sent to +91 ${isSignupOtpStep ? signupForm.mobile : (loginMethod === 'aadhaar' ? '9876543210' : mobileNum)}`}
              </p>
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2.5 rounded-xl text-center text-xs font-mono font-bold mt-3">
                DEMO OTP: 842217
              </div>
              <input
                type="text"
                maxLength={6}
                value={isSignupOtpStep ? signupOtpVal : otpVal}
                onChange={e => isSignupOtpStep ? setSignupOtpVal(e.target.value) : setOtpVal(e.target.value)}
                className="w-full text-center tracking-widest text-xl font-mono font-bold py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#0E2954] focus:outline-none mt-3"
              />
            </div>

            <button
              onClick={isSignupOtpStep ? handleSignupSubmit : handleVerifyOtp}
              disabled={isSubmitting || (isSignupOtpStep ? signupOtpVal.length !== 6 : otpVal.length !== 6)}
              className="w-full bg-[#F57C00] hover:bg-[#D96B00] disabled:opacity-40 text-slate-950 font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-float-btn active:scale-98 transition-all"
            >
              <span>
                {isSubmitting 
                  ? (isHi ? 'सत्यापित हो रहा है...' : 'Verifying e-KYC...') 
                  : (isHi ? 'सत्यापित करें एवं डैशबोर्ड खोलें' : 'Verify & Open JAGO Scholar')}
              </span>
            </button>

            <button
              onClick={() => {
                setIsOtpStep(false);
                setIsSignupOtpStep(false);
              }}
              className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 pt-1"
            >
              ← {isHi ? 'वापस जाएं' : (isSignupOtpStep ? 'Back to registration details' : 'Back to login options')}
            </button>
          </div>
        ) : (
          /* ===================== STANDARD LOGIN / REGISTRATION SCREENS ===================== */
          <>
            {/* Header Branding */}
            <div className="space-y-1 flex-shrink-0">
              <h3 className="font-black text-lg text-slate-900 pt-0.5">
                {activeMode === 'login' 
                  ? (isHi ? 'सरकारी प्रमाणीकरण (Login)' : 'Authentication')
                  : (isHi ? 'नया छात्र पंजीकरण (Registration)' : 'Scholar One-Time Registration')}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isHi ? 'एकल डिजिटल पहचान — 5 छात्रवृत्ति योजनाओं हेतु मान्य' : 'Unified ST Student ID for All 5 MoTA Scholarships'}
              </p>
            </div>

            {/* Mode Switcher Pills: Login vs Signup */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold flex-shrink-0">
              <button
                onClick={() => {
                  setActiveMode('login');
                  setIsOtpStep(false);
                  setIsSignupOtpStep(false);
                }}
                className={`py-2.5 rounded-xl transition-all ${
                  activeMode === 'login' 
                    ? 'bg-[#0E2954] text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'मौजूदा छात्र लॉगिन' : 'Login'}
              </button>
              <button
                onClick={() => {
                  setActiveMode('signup');
                  setIsOtpStep(false);
                  setIsSignupOtpStep(false);
                }}
                className={`py-2.5 rounded-xl transition-all ${
                  activeMode === 'signup' 
                    ? 'bg-[#0E2954] text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'नया पंजीकरण (Signup)' : 'New Registration'}
              </button>
            </div>

            {/* Form Body */}
            <div className="space-y-3.5 text-left">
              
              {/* ===================== MODE 1: LOGIN ===================== */}
              {activeMode === 'login' && (
                <div className="space-y-3">
                  {/* Method tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-xl text-[11px] font-bold">
                    <button
                      onClick={() => {
                        setLoginMethod('aadhaar');
                      }}
                      className={`py-1.5 rounded-lg transition-all ${
                        loginMethod === 'aadhaar' ? 'bg-[#F57C00] text-slate-950 font-bold' : 'text-slate-600'
                      }`}
                    >
                      Aadhaar
                    </button>
                    <button
                      onClick={() => {
                        setShowDigiLockerFlow(true);
                      }}
                      className="py-1.5 rounded-lg transition-all text-slate-600 hover:text-slate-900 active:bg-slate-200"
                    >
                      DigiLocker
                    </button>
                    <button
                      onClick={() => setLoginMethod('otr')}
                      className={`py-1.5 rounded-lg transition-all ${
                        loginMethod === 'otr' ? 'bg-[#F57C00] text-slate-950 font-bold' : 'text-slate-600'
                      }`}
                    >
                      NSP OTR
                    </button>
                  </div>

                  {/* Aadhaar & OTR Sign In */}
                  <div className="space-y-3 animate-fade-in">
                    {loginMethod === 'aadhaar' ? (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          {isHi ? '12 अंकों का आधार नंबर' : '12-Digit Aadhaar Number'}
                        </label>
                        <div className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#0E2954]">
                          <input
                            type="text"
                            maxLength={12}
                            value={aadhaarNum}
                            onChange={e => setAadhaarNum(e.target.value)}
                            placeholder="12-digit Aadhaar"
                            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          {isHi ? 'NSP OTR नंबर' : 'NSP OTR Number'}
                        </label>
                        <div className="flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#0E2954]">
                          <FileKey className="w-4 h-4 text-slate-400 mr-2" />
                          <input
                            type="text"
                            value={otrNum}
                            onChange={e => setOtrNum(e.target.value)}
                            placeholder="14-digit OTR ID"
                            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none font-mono uppercase"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Demo Profile: Rahul Kumar (ST Santhal, B.Tech)</span>
                    </div>

                    <button
                      onClick={handleSendOtp}
                      className="w-full bg-[#0E2954] hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
                    >
                      <span>{loginMethod === 'otr' ? 'Verify OTR & Sign In' : (isHi ? 'ओटीपी प्राप्त करें' : 'Send Verification OTP')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===================== MODE 2: SIGNUP / NEW REGISTRATION ===================== */}
              {activeMode === 'signup' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Fill Scholar Registration Info
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      Rahul Kumar (Demo)
                    </span>
                  </div>

                  {/* 1. Identity */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                      <User className="w-3.5 h-3.5 text-[#F57C00]" />
                      <span>Personal Details</span>
                    </div>
                    {/* Separate First Name and Last Name Columns */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">First Name</label>
                        <input
                          type="text"
                          value={signupForm.firstName}
                          onChange={e => setSignupForm({ ...signupForm, firstName: e.target.value, name: `${e.target.value} ${signupForm.lastName}`.trim() })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Last Name</label>
                        <input
                          type="text"
                          value={signupForm.lastName}
                          onChange={e => setSignupForm({ ...signupForm, lastName: e.target.value, name: `${signupForm.firstName} ${e.target.value}`.trim() })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Date of Birth</label>
                        <input
                          type="date"
                          value={signupForm.dob}
                          onChange={e => setSignupForm({ ...signupForm, dob: e.target.value })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">12-Digit Aadhaar (e-KYC)</label>
                        <input
                          type="text"
                          maxLength={12}
                          value={signupForm.aadhaar}
                          onChange={e => setSignupForm({ ...signupForm, aadhaar: e.target.value })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Social Category */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F57C00]" />
                      <span>Tribal Category & Community</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Category</label>
                        <input
                          type="text"
                          disabled
                          value="ST (Scheduled Tribe)"
                          className="w-full p-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Tribe / Sub-caste</label>
                        <input
                          type="text"
                          value={signupForm.tribe}
                          onChange={e => setSignupForm({ ...signupForm, tribe: e.target.value })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Institution Details */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                      <GraduationCap className="w-3.5 h-3.5 text-[#F57C00]" />
                      <span>Institution & Course (APAAR / AISHE)</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-medium">Course</label>
                      <input
                        type="text"
                        value={signupForm.course}
                        onChange={e => setSignupForm({ ...signupForm, course: e.target.value })}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-medium">Institution Name</label>
                      <input
                        type="text"
                        value={signupForm.college}
                        onChange={e => setSignupForm({ ...signupForm, college: e.target.value })}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* 4. Bank & Income */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                      <Banknote className="w-3.5 h-3.5 text-[#F57C00]" />
                      <span>Family Income & Bank DBT</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Annual Income (₹)</label>
                        <input
                          type="number"
                          value={signupForm.annualIncome}
                          onChange={e => setSignupForm({ ...signupForm, annualIncome: e.target.value })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Bank Name</label>
                        <input
                          type="text"
                          value={signupForm.bankName}
                          onChange={e => setSignupForm({ ...signupForm, bankName: e.target.value })}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={handleInitiateSignup}
                    className="w-full bg-[#F57C00] hover:bg-[#E65100] text-slate-950 font-extrabold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-float-btn active:scale-98 transition-all"
                  >
                    <span>{isHi ? 'रजिस्टर करें' : 'Register'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

        {/* Lower Bottom: Ministry of Tribal Affairs Official SVG */}
        <div className="pt-3 pb-1 flex flex-col items-center justify-center space-y-1 flex-shrink-0">
          <img 
            src="/Ministry_of_Tribal_Affairs.svg" 
            alt="Ministry of Tribal Affairs" 
            className="h-7 w-auto object-contain opacity-90"
          />
          <span className="text-[9px] text-slate-400 font-medium">
            Ministry of Tribal Affairs • Govt of India
          </span>
        </div>
      </div>

      {/* 5-Step Authentic DigiLocker Flow Modal */}
      <DigiLockerFullFlowModal
        isOpen={showDigiLockerFlow}
        onClose={() => setShowDigiLockerFlow(false)}
        onComplete={() => {
          setShowDigiLockerFlow(false);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
};
