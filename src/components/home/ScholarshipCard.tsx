import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScholarshipScheme, SchemeId } from '../../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { EligibilityEngine } from '../../services/eligibilityEngine';

interface Props {
  scheme: ScholarshipScheme;
}

export const ScholarshipCard: React.FC<Props> = ({ scheme }) => {
  const { 
    applications, 
    profile, 
    setSelectedSchemeForDetail, 
    setActiveTab, 
    language 
  } = useApp();
  const isHi = language === 'hi';

  const evaluation = EligibilityEngine.evaluate(scheme, profile);
  const application = applications.find(a => a.schemeId === scheme.id);

  const getStatusBadge = () => {
    if (application) {
      if (application.currentStage === 'sanctioned' || application.currentStage === 'dbt_credited') {
        return {
          label: isHi ? 'स्वीकृत' : 'Sanctioned',
          className: 'bg-[#DDF7EC] text-[#0B9F6E] border-[#A7F3D0]'
        };
      }
      if (application.currentStage === 'deficiency_flagged') {
        return {
          label: isHi ? 'समीक्षाधीन' : 'Under Verification',
          className: 'bg-[#FFF3E5] text-[#FF7A00] border-[#FED7AA]'
        };
      }
      return {
        label: isHi ? 'सक्रिय आवेदन' : 'Applied',
        className: 'bg-[#EFF6FF] text-[#1976D2] border-[#BFDBFE]'
      };
    }

    if (evaluation.status === 'eligible') {
      return {
        label: isHi ? 'पात्र' : 'Eligible',
        className: 'bg-[#DDF7EC] text-[#0B9F6E] border-[#A7F3D0]'
      };
    }

    if (evaluation.status === 'potentially_eligible') {
      return {
        label: isHi ? 'संभावित पात्र' : 'Likely Eligible',
        className: 'bg-[#FFF3E5] text-[#FF7A00] border-[#FED7AA]'
      };
    }

    return {
      label: isHi ? 'अपात्र' : 'Not Eligible',
      className: 'bg-slate-100 text-[#5B6B83] border-slate-200'
    };
  };

  const badge = getStatusBadge();

  const handleCardClick = () => {
    setSelectedSchemeForDetail(scheme);
    setActiveTab('scholarships');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${scheme.name}`}
      className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E5ECF5] shadow-2xs hover:shadow-xs hover:border-slate-300 cursor-pointer active:scale-98 transition-all flex flex-col space-y-2"
    >
      {/* Scheme Title & Eligibility Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-sm sm:text-[15px] text-[#10213F] leading-snug flex-1">
          {isHi ? scheme.nameHi : scheme.name}
        </h4>
        <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md border whitespace-nowrap flex-shrink-0 ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Financial Benefits / Description snippet */}
      <div className="flex items-center justify-between pt-0.5">
        <p className="text-xs text-[#5B6B83] font-medium truncate max-w-[230px] sm:max-w-xs">
          {scheme.financialBenefit.split('|')[0].trim()}
        </p>
        <span className="text-xs font-bold text-[#FF7A00] hover:text-[#E65100] flex items-center space-x-0.5 flex-shrink-0">
          <span>{isHi ? 'विवरण' : 'Details'}</span>
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </span>
      </div>
    </div>
  );
};
