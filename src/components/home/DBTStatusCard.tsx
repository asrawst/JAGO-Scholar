import React from 'react';
import { useApp } from '../../context/AppContext';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

export const DBTStatusCard: React.FC = () => {
  const { profile, setActiveTab, language } = useApp();
  const isHi = language === 'hi';

  const bankName = profile.bank.bankName || 'State Bank of India (SBI)';
  const maskedAcc = profile.bank.accountNoMasked || '••••••••8142';
  const isDbtActive = profile.bank.isDbtEnabled && profile.bank.verificationStatus === 'verified';

  return (
    <div 
      role="region"
      aria-label="Aadhaar DBT Seeding Status"
      className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-emerald-300 transition-all"
    >
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        {/* Bank / Landmark Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DCFCE7] text-[#0B9F6E] flex items-center justify-center flex-shrink-0">
          <Landmark className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5 flex-nowrap">
            <span className="font-bold text-[13px] text-[#10213F] whitespace-nowrap">
              {isHi ? 'आधार डीबीटी सीडिंग' : 'Aadhaar DBT Seeding'}
            </span>
            <span className="text-[9.5px] font-bold bg-[#DCFCE7] text-[#0B9F6E] px-1.5 py-0.5 rounded-full border border-[#86EFAC] inline-flex items-center space-x-0.5 whitespace-nowrap flex-shrink-0">
              <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>{isDbtActive ? 'NPCI Active' : 'Verification In Progress'}</span>
            </span>
          </div>

          <p className="text-[10.5px] text-[#5B6B83] mt-0.5 truncate font-medium">
            {bankName} • {maskedAcc} • APBS Verified
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('profile')}
        className="text-xs font-bold text-[#0B9F6E] hover:text-[#065F46] hover:underline flex items-center space-x-0.5 whitespace-nowrap flex-shrink-0 cursor-pointer py-1 pl-2"
        aria-label="View bank and DBT account details"
      >
        <span>{isHi ? 'देखें' : 'View'}</span>
        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
