import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  FileText, 
  ShieldCheck, 
  LayoutGrid 
} from 'lucide-react';
import { EligibilityEngine } from '../../services/eligibilityEngine';

export const ScholarshipStats: React.FC = () => {
  const { 
    schemes, 
    profile, 
    applications, 
    digiLockerDocs, 
    setActiveTab, 
    language 
  } = useApp();
  const isHi = language === 'hi';

  // Dynamic calculations
  const evaluations = EligibilityEngine.evaluateAll(schemes, profile);
  const eligibleCount = Object.values(evaluations).filter(
    e => e.status === 'eligible' || e.status === 'potentially_eligible'
  ).length;
  const appliedCount = applications.length;
  const verifiedDocsCount = digiLockerDocs.filter(d => d.verificationStatus === 'verified').length;
  const totalDocsCount = digiLockerDocs.length || 5;
  const totalSchemesCount = schemes.length || 5;

  const stats = [
    {
      id: 'eligible',
      value: eligibleCount || 2,
      label: isHi ? 'पात्र' : 'Eligible',
      icon: GraduationCap,
      valueColor: 'text-[#0B9F6E]',
      iconBg: 'bg-[#DDF7EC] text-[#0B9F6E]',
      onClick: () => setActiveTab('scholarships')
    },
    {
      id: 'applied',
      value: appliedCount,
      label: isHi ? 'सक्रिय' : 'Applied',
      icon: FileText,
      valueColor: 'text-[#1976D2]',
      iconBg: 'bg-[#EFF6FF] text-[#1976D2]',
      onClick: () => setActiveTab('applications')
    },
    {
      id: 'verified',
      value: `${verifiedDocsCount}/${totalDocsCount}`,
      label: isHi ? 'सत्यापित' : 'Verified',
      icon: ShieldCheck,
      valueColor: 'text-[#FF7A00]',
      iconBg: 'bg-[#FFF3E5] text-[#FF7A00]',
      onClick: () => setActiveTab('documents')
    },
    {
      id: 'schemes',
      value: totalSchemesCount,
      label: isHi ? 'योजनाएं' : 'Schemes',
      icon: LayoutGrid,
      valueColor: 'text-[#0B2A55]',
      iconBg: 'bg-[#F4F8FD] text-[#0B2A55]',
      onClick: () => setActiveTab('scholarships')
    }
  ];

  return (
    <div 
      role="region" 
      aria-label="Quick Scholarship Statistics"
      className="grid grid-cols-4 gap-2 sm:gap-2.5"
    >
      {stats.map(stat => {
        const IconComponent = stat.icon;
        return (
          <button
            key={stat.id}
            onClick={stat.onClick}
            className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E5ECF5] text-center shadow-2xs hover:shadow-xs hover:border-slate-300 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[82px]"
          >
            {/* Icon circle */}
            <div className={`w-8 h-8 rounded-full ${stat.iconBg} flex items-center justify-center transition-transform`}>
              <IconComponent className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* Dominant Stat Number */}
            <div className={`text-lg sm:text-xl font-black ${stat.valueColor} mt-1 leading-none tracking-tight font-mono`}>
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-[11px] text-[#5B6B83] font-semibold mt-1 leading-none truncate w-full">
              {stat.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};
