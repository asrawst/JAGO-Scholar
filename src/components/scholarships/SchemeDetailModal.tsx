import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Calendar, 
  Building,
  GraduationCap,
  Layers
} from 'lucide-react';
import { ScholarshipScheme } from '../../types';
import { EligibilityEngine } from '../../services/eligibilityEngine';

interface Props {
  scheme: ScholarshipScheme;
  onClose: () => void;
}

export const SchemeDetailModal: React.FC<Props> = ({ scheme, onClose }) => {
  const { 
    profile, 
    language, 
    setApplyingSchemeId, 
    setIsApplyWizardOpen,
    applications,
    setActiveTab,
    setIsDigiLockerModalOpen
  } = useApp();

  const isHi = language === 'hi';
  const evalRes = EligibilityEngine.evaluate(scheme, profile);
  const existingApp = applications.find(a => a.schemeId === scheme.id);

  const handleApply = () => {
    onClose();
    setApplyingSchemeId(scheme.id);
    setIsApplyWizardOpen(true);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[88%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Fixed Height */}
        <div className="p-4 bg-gradient-to-r from-mota-navy to-slate-900 text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="font-black text-sm text-white leading-snug truncate">
              {isHi ? scheme.nameHi : scheme.name}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content - Freely Scrollable */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 min-h-0 overscroll-contain">
          {/* 1. Transparent Eligibility Engine Status Card */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center space-x-1.5 min-w-0">
                <span className="truncate">{isHi ? 'पात्रता विश्लेषण (AI Engine)' : 'Explainable Eligibility Check'}</span>
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center text-center justify-center ${
                evalRes.status === 'eligible' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : evalRes.status === 'potentially_eligible'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {evalRes.status === 'eligible' ? (isHi ? '100% पात्र' : '100% Eligible') : evalRes.status === 'potentially_eligible' ? (isHi ? 'संभावित पात्र' : 'Likely Eligible') : (isHi ? 'अपात्र' : 'Not Eligible')}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isHi ? evalRes.summaryHi : evalRes.summary}
            </p>

            {/* Granular Criteria List */}
            <div className="space-y-2 pt-1 border-t border-slate-200/80">
              {evalRes.criteriaChecks.map((check, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs">
                  {check.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                  {check.status === 'pending' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                  {check.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                  {check.status === 'fail' && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}

                  <div className="flex-1">
                    <div className="font-bold text-slate-800">
                      {isHi ? check.labelHi : check.label}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {check.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending actions */}
            {evalRes.missingRequirements.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">{isHi ? 'आवश्यक कार्रवाई:' : 'Action to complete eligibility:'}</span>
                {evalRes.missingRequirements.map((req, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span>• {req}</span>
                    <button 
                      onClick={() => {
                        onClose();
                        setIsDigiLockerModalOpen(true);
                      }}
                      className="text-mota-saffron font-bold underline"
                    >
                      {isHi ? 'अभी करें' : 'Sync Now'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Key Benefits */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900">
              {isHi ? 'योजना के मुख्य लाभ' : 'Financial Grants & Allowances'}
            </h4>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950 font-semibold space-y-1">
              <p className="text-sm font-black text-emerald-800">{scheme.financialBenefit}</p>
              <p className="text-[11px] text-emerald-700 font-normal">
                {isHi ? 'सीधे आधार से जुड़े बैंक खाते में डीबीटी द्वारा भुगतान' : 'Disbursed directly via PFMS Direct Benefit Transfer (DBT) into Aadhaar-seeded account.'}
              </p>
            </div>
          </div>

          {/* 3. Scheme Description */}
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-xs text-slate-900">
              {isHi ? 'योजना का विवरण' : 'Scheme Description'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi ? scheme.descriptionHi : scheme.description}
            </p>
          </div>

          {/* 4. Required Verified Documents */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center justify-between">
              <span>{isHi ? 'आवश्यक दस्तावेज (डिजिलॉकर से स्वतः संलग्न)' : 'Required Documents (Auto-Attached)'}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Reusable ✓</span>
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {scheme.requiredDocs.map((doc, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-mota-navy" />
                  <span className="font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Application Stage Lifecycle */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900">
              {isHi ? 'सत्यापन एवं स्वीकृति प्रक्रिया' : 'Verification & Sanction Pipeline'}
            </h4>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] space-y-2 text-slate-600">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-mota-navy text-white flex items-center justify-center font-bold text-[10px]">1</span>
                <span className="font-semibold text-slate-800">1-Click Single-Entry Profile Application</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-mota-navy text-white flex items-center justify-center font-bold text-[10px]">2</span>
                <span className="font-semibold text-slate-800">College / Institution Nodal Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-mota-navy text-white flex items-center justify-center font-bold text-[10px]">3</span>
                <span className="font-semibold text-slate-800">District Welfare Officer / MoTA State Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-mota-navy text-white flex items-center justify-center font-bold text-[10px]">4</span>
                <span className="font-semibold text-slate-800">Ministry Financial Sanction & PFMS DBT Credit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA - Cleanly Pinned with Safe Area Bottom Padding */}
        <div className="p-4 pb-6 sm:pb-4 border-t border-slate-200 bg-white flex-shrink-0 relative z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          {existingApp ? (
            <button
              onClick={() => {
                onClose();
                setActiveTab('applications');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
            >
              <span>{isHi ? 'आवेदन की लाइव स्थिति ट्रैक करें' : 'Track Active Application'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={!evalRes.canApply}
              className="w-full bg-mota-saffron hover:bg-amber-600 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-float-btn active:scale-98 transition-all"
            >
              <span>{isHi ? 'पुनः प्रयोज्य प्रोफ़ाइल के साथ आवेदन करें' : 'Apply with Verified Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
