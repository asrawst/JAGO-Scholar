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
      <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
        {/* Bank / Landmark Icon */}
        <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#0B9F6E] flex items-center justify-center flex-shrink-0">
          <Landmark className="w-5 h-5 stroke-[2]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-0.5">
            <span className="font-bold text-sm text-[#10213F]">
              {isHi ? 'आधार डीबीटी सीडिंग' : 'Aadhaar DBT Seeding'}
            </span>
            <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#0B9F6E] px-2 py-0.5 rounded-full border border-[#86EFAC] flex items-center space-x-1">
              <ShieldCheck className="w-2.5 h-2.5 inline stroke-[2.5]" />
              <span>{isDbtActive ? 'NPCI Active' : 'Verification In Progress'}</span>
            </span>
          </div>

          <p className="text-[11px] text-[#5B6B83] mt-0.5 truncate font-medium">
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
