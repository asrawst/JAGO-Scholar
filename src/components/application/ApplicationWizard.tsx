import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  FolderLock, 
  FileCheck
} from 'lucide-react';

export const ApplicationWizard: React.FC = () => {
  const { 
    isApplyWizardOpen, 
    setIsApplyWizardOpen, 
    applyingSchemeId, 
    schemes, 
    digiLockerDocs, 
    submitApplication, 
    language,
    setActiveTab
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [declarationAgreed, setDeclarationAgreed] = useState<boolean>(true);

  if (!isApplyWizardOpen || !applyingSchemeId) return null;

  const scheme = schemes.find(s => s.id === applyingSchemeId)!;
  const isHi = language === 'hi';

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await submitApplication(applyingSchemeId, '2026-27');
    setIsSubmitting(false);
    setIsApplyWizardOpen(false);
    setActiveTab('applications');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[90%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-mota-navy text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div>
            <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
              {isHi ? 'एकल प्रोफ़ाइल आवेदन' : 'Single-Entry Profile Reuse'}
            </span>
            <h3 className="font-black text-sm text-white mt-0.5 truncate max-w-[280px]">
              {isHi ? scheme.nameHi : scheme.name}
            </h3>
          </div>
          <button 
            onClick={() => setIsApplyWizardOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content: Documents + Declaration */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 min-h-0 overscroll-contain">
          {/* SECTION 1: Auto-Attached Documents */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-mota-navy font-black text-sm">
              <FolderLock className="w-4 h-4 text-mota-saffron" />
              <span>{isHi ? 'डिजिलॉकर से जुड़े डिजिटल दस्तावेज' : 'Auto-Attached Reusable Documents'}</span>
            </div>
            <p className="text-xs text-slate-500">
              {isHi 
                ? 'ये दस्तावेज आपके डिजिलॉकर वॉलेट से स्वतः संलग्न किए गए हैं।' 
                : '4 verified certificates from your DigiLocker wallet are automatically linked to this application.'}
            </p>

            <div className="space-y-2">
              {digiLockerDocs.map(doc => (
                <div key={doc.id} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-mota-navy flex-shrink-0">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-900 truncate">{doc.name}</h5>
                      <span className="text-[10px] text-slate-500 font-mono block">{doc.docNumber}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    Verified ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Applicant Declaration */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-mota-navy font-black text-sm">
              <ShieldCheck className="w-4 h-4 text-mota-saffron" />
              <span>{isHi ? 'आवेदक घोषणा एवं सहमति' : 'Applicant Undertaking & Consent'}</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-[11px] text-slate-700 space-y-1.5 leading-relaxed">
              <p>
                1. I hereby declare that all information furnished from my unified student profile is true and accurate.
              </p>
              <p>
                2. I am not availing duplicate scholarships from another State/Central source for AY 2026-27.
              </p>
              <p>
                3. I grant consent to MoTA & my institution to verify my academic attendance, caste certificate, and Aadhaar e-KYC.
              </p>
            </div>

            <label className="flex items-start space-x-2.5 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declarationAgreed}
                onChange={e => setDeclarationAgreed(e.target.checked)}
                className="mt-0.5 rounded text-mota-navy focus:ring-mota-navy h-4 w-4"
              />
              <span className="text-xs font-bold text-slate-800">
                {isHi 
                  ? 'मैं घोषणा करता/करती हूँ कि ऊपर दी गई सभी जानकारियां सत्य हैं।' 
                  : 'I agree to the MoTA declaration and terms.'}
              </span>
            </label>
          </div>
        </div>

        {/* Footer Submit Button */}
        <div className="p-4 pb-6 sm:pb-4 border-t border-slate-200 bg-white flex items-center justify-between space-x-3 flex-shrink-0 relative z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button
            onClick={handleFinalSubmit}
            disabled={!declarationAgreed || isSubmitting}
            className="w-full bg-mota-saffron hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-float-btn"
          >
            {isSubmitting ? (
              <span>{isHi ? 'जमा हो रहा है...' : 'Submitting via Gateway...'}</span>
            ) : (
              <span>{isHi ? 'अंतिम आवेदन जमा करें' : 'Confirm & Submit Application'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
