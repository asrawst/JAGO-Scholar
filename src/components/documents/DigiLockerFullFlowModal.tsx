import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  FileText, 
  X,
  RotateCcw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type FlowStep = 'login_mobile' | 'login_aadhaar' | 'otp' | 'security_pin';

export const DigiLockerFullFlowModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const { 
    loginWithDigiLocker, 
    importDigiLockerDoc, 
    digiLockerDocs, 
    showToast,
    language,
    profile
  } = useApp();

  // Directly start on Login/Create screen without language choosing screen
  const [step, setStep] = useState<FlowStep>('login_mobile');
  const [mobileNum, setMobileNum] = useState<string>('9876543210');
  const [aadhaarNum, setAadhaarNum] = useState<string>('123456789012');
  const [showAadhaar, setShowAadhaar] = useState<boolean>(true);
  
  // OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '2', '2', '1', '7']);
  
  // Security PIN state
  const [pinDigits, setPinDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [enableBiometrics, setEnableBiometrics] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const isHi = language === 'hi';

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    if (val && index < 5) {
      const nextInput = document.getElementById(`digi-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...pinDigits];
    newDigits[index] = val;
    setPinDigits(newDigits);

    if (val && index < 5) {
      const nextInput = document.getElementById(`digi-pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSendOtpFromLogin = () => {
    setStep('otp');
  };

  const handleVerifyOtpToPin = () => {
    setStep('security_pin');
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);

    // Import all mock docs silently and authenticate
    for (const doc of digiLockerDocs) {
      await importDigiLockerDoc(doc.id, true);
    }
    await loginWithDigiLocker();

    setIsLoading(false);

    if (onComplete) {
      onComplete();
    }
    onClose();
    setStep('login_mobile');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white text-slate-900 animate-fade-in overflow-hidden">
      
      {/* ========================================================================= */}
      {/* STEP 1A: LOGIN OR CREATE ACCOUNT (Mobile Number) */}
      {/* ========================================================================= */}
      {step === 'login_mobile' && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white animate-fade-in overflow-y-auto">
          <div className="flex-1 flex flex-col">
            {/* Top Purple Header Banner */}
            <div className="bg-[#5429FF] text-white p-5 pt-4 pb-8 relative shadow-md flex-shrink-0">
              <button
                onClick={onClose}
                className="p-1 -ml-1 text-white hover:text-white/80 transition-all"
                title="Close"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="mt-4 flex flex-col items-center justify-center text-center space-y-1">
                <div className="flex items-center space-x-1.5">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-4-4h2.5V9h3v4H14l-4 4z"/>
                  </svg>
                  <span className="text-2xl font-black text-white tracking-tight">DigiLocker</span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">Document Wallet to Empower Citizens</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Login or Create Account
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your mobile number to proceed
                  </p>
                </div>

                {/* Mobile Input */}
                <div className="flex items-center border border-slate-300 rounded-2xl px-3.5 py-3 focus-within:border-[#5429FF] focus-within:ring-2 focus-within:ring-[#5429FF]/20 bg-white">
                  <span className="text-sm font-bold text-slate-900 pr-2 border-r border-slate-200">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNum}
                    onChange={e => setMobileNum(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full pl-3 text-sm font-bold text-slate-900 focus:outline-none tracking-wide"
                  />
                </div>

                {/* Continue Button -> Moves to OTP */}
                <button
                  onClick={handleSendOtpFromLogin}
                  className="w-full bg-[#5429FF] hover:bg-[#431DE0] text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-md active:scale-98 transition-all"
                >
                  Continue
                </button>

                {/* Terms */}
                <p className="text-[11px] text-center text-slate-500 font-medium">
                  By continuing, I agree to <span className="text-[#5429FF] font-bold cursor-pointer">Terms of Service</span>
                </p>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="px-3 text-xs text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Try using Aadhaar or VID */}
                <button
                  onClick={() => setStep('login_aadhaar')}
                  className="w-full text-center text-xs font-bold text-[#5429FF] hover:underline"
                >
                  Try using Aadhaar or VID Number
                </button>
              </div>

              {/* Bottom Support */}
              <div className="text-center pb-2">
                <span className="text-xs text-slate-500">Facing Trouble - </span>
                <span className="text-xs font-bold text-[#5429FF] cursor-pointer">Need Help?</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1B: LOGIN OR CREATE ACCOUNT (Aadhaar or VID Number) */}
      {/* ========================================================================= */}
      {step === 'login_aadhaar' && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white animate-fade-in overflow-y-auto">
          <div className="flex-1 flex flex-col">
            {/* Top Purple Header Banner */}
            <div className="bg-[#5429FF] text-white p-5 pt-4 pb-8 relative shadow-md flex-shrink-0">
              <button
                onClick={() => setStep('login_mobile')}
                className="p-1 -ml-1 text-white hover:text-white/80 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="mt-4 flex flex-col items-center justify-center text-center space-y-1">
                <div className="flex items-center space-x-1.5">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-4-4h2.5V9h3v4H14l-4 4z"/>
                  </svg>
                  <span className="text-2xl font-black text-white tracking-tight">DigiLocker</span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">Document Wallet to Empower Citizens</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Login or Create Account
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter your Aadhaar or VID number to proceed
                  </p>
                </div>

                {/* Aadhaar Input */}
                <div className="flex items-center border border-slate-300 rounded-2xl px-3.5 py-3 focus-within:border-[#5429FF] focus-within:ring-2 focus-within:ring-[#5429FF]/20 bg-white">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-[7px] text-white font-bold">
                      A
                    </div>
                  </div>
                  <input
                    type={showAadhaar ? 'text' : 'password'}
                    maxLength={12}
                    value={aadhaarNum}
                    onChange={e => setAadhaarNum(e.target.value)}
                    placeholder="Aadhaar or VID Number"
                    className="w-full text-sm font-mono font-bold text-slate-900 focus:outline-none tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="text-slate-400 hover:text-slate-700 pl-2"
                  >
                    {showAadhaar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Continue Button -> Moves to OTP */}
                <button
                  onClick={handleSendOtpFromLogin}
                  className="w-full bg-[#5429FF] hover:bg-[#431DE0] text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-md active:scale-98 transition-all"
                >
                  Continue
                </button>

                {/* Terms */}
                <p className="text-[11px] text-center text-slate-500 font-medium">
                  By continuing, I agree to <span className="text-[#5429FF] font-bold cursor-pointer">Terms of Service</span>
                </p>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="px-3 text-xs text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* Try using Mobile Number */}
                <button
                  onClick={() => setStep('login_mobile')}
                  className="w-full text-center text-xs font-bold text-[#5429FF] hover:underline"
                >
                  Try using Mobile Number
                </button>
              </div>

              {/* Bottom Support */}
              <div className="text-center pb-2">
                <span className="text-xs text-slate-500">Facing Trouble - </span>
                <span className="text-xs font-bold text-[#5429FF] cursor-pointer">Need Help?</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: OTP VERIFICATION SCREEN */}
      {/* ========================================================================= */}
      {step === 'otp' && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white p-5 animate-fade-in overflow-y-auto">
          <div className="flex-1 flex flex-col space-y-5">
            {/* Top Back Button */}
            <div className="pt-2">
              <button
                onClick={() => setStep('login_mobile')}
                className="p-1 -ml-1 text-slate-900 hover:text-slate-600 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Enter OTP
              </h3>
              <p className="text-xs text-slate-500">
                Enter the 6-digit OTP sent to your registered mobile number <span className="font-bold text-slate-800">+91 {mobileNum}</span>
              </p>
            </div>

            {/* Demo OTP Banner */}
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-3.5 py-2 rounded-xl text-center text-xs font-bold font-mono">
              DEMO OTP: 842217
            </div>

            {/* 6 OTP Input Boxes */}
            <div className="flex items-center justify-between space-x-2 pt-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`digi-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-13 text-center text-xl font-bold font-mono border border-slate-300 rounded-xl focus:border-[#5429FF] focus:ring-2 focus:ring-[#5429FF]/20 bg-slate-50/50"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Didn't receive OTP?</span>
              <button 
                onClick={() => {
                  setOtpDigits(['8', '4', '2', '2', '1', '7']);
                }}
                className="font-bold text-[#5429FF] hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>

          {/* Continue Button -> Moves to 6 digit security PIN */}
          <div className="pt-4 pb-2">
            <button
              onClick={handleVerifyOtpToPin}
              className="w-full bg-[#5429FF] hover:bg-[#431DE0] text-white font-bold py-3.5 px-4 rounded-full text-sm shadow-md active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: SECURITY PIN (Ask 6 digit PIN of DigiLocker) */}
      {/* ========================================================================= */}
      {step === 'security_pin' && (
        <div className="flex-1 flex flex-col justify-between h-full bg-white p-5 animate-fade-in overflow-y-auto">
          <div className="flex-1 flex flex-col space-y-5">
            {/* Top Back Button */}
            <div className="pt-2">
              <button
                onClick={() => setStep('otp')}
                className="p-1 -ml-1 text-slate-900 hover:text-slate-600 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Pill Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D32F2F] text-white font-bold flex items-center justify-center text-base shadow-sm">
                AS
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">A***Y* S***H</h4>
                <p className="text-[11px] text-slate-500 font-medium">Rahul Kumar (ST Scholar ID)</p>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Enter 6 digit security PIN
              </h3>
            </div>

            {/* 6 PIN Input Boxes */}
            <div className="flex items-center justify-between space-x-2 pt-2">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`digi-pin-${idx}`}
                  type={showPin ? 'text' : 'password'}
                  maxLength={1}
                  value={digit}
                  onChange={e => handlePinChange(idx, e.target.value)}
                  className="w-11 h-13 text-center text-xl font-bold font-mono border border-slate-300 rounded-xl focus:border-[#5429FF] focus:ring-2 focus:ring-[#5429FF]/20 bg-slate-50/50"
                />
              ))}
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="p-2 text-slate-400 hover:text-slate-700"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot PIN Link */}
            <div>
              <button className="text-xs font-bold text-[#5429FF] hover:underline">
                Forgot PIN?
              </button>
            </div>

            {/* Face ID / Touch ID Checkbox Card */}
            <div 
              onClick={() => setEnableBiometrics(!enableBiometrics)}
              className="bg-[#F6F4FF] p-3.5 rounded-2xl flex items-center space-x-3 cursor-pointer border border-[#E8E1FF]"
            >
              <input 
                type="checkbox" 
                checked={enableBiometrics}
                onChange={() => {}}
                className="w-4 h-4 rounded text-[#5429FF] accent-[#5429FF]"
              />
              <span className="text-xs font-bold text-slate-800">
                Enable device Face ID and Touch ID
              </span>
            </div>
          </div>

          {/* Bottom Continue Button */}
          <div className="pt-4 pb-2">
            <button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="w-full bg-[#5429FF] hover:bg-[#431DE0] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-full text-sm shadow-md active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Authenticating & Importing Docs...</span>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
