import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { EligibilityEngine } from '../../services/eligibilityEngine';

export const EligibleScholarshipCard: React.FC = () => {
  const { 
    schemes, 
    profile, 
    setActiveTab, 
    language 
  } = useApp();
  const isHi = language === 'hi';

  const evaluations = EligibilityEngine.evaluateAll(schemes, profile);
  const eligibleSchemes = schemes.filter(
    s => evaluations[s.id]?.status === 'eligible' || evaluations[s.id]?.status === 'potentially_eligible'
  );
  const count = eligibleSchemes.length || 2;

  return (
    <article 
      aria-label="Eligible Scholarships Overview"
      className="bg-white border border-[#E5ECF5] rounded-3xl p-4 shadow-sm relative overflow-hidden"
    >
      {/* Decorative leaf accent — top-right corner, subtle */}
      <div 
        aria-hidden="true"
        className="absolute -right-3 -top-3 w-28 h-28 pointer-events-none select-none opacity-40 z-0"
      >
        <img 
          src="/leaf_accent.jpg" 
          alt="" 
          className="w-full h-full object-cover mix-blend-multiply select-none"
        />
      </div>

      <div className="relative z-10 space-y-3">
        {/* Header with Icon + Label */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#1976D2] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-[0.1em] text-[#5B6B83] uppercase block leading-none mb-1">
              {isHi ? 'उपलब्ध छात्रवृत्तियां' : 'SCHOLARSHIPS AVAILABLE'}
            </span>
            <h2 className="font-bold text-[15px] text-[#0B2A55] leading-tight">
              {isHi ? 'आप ' : 'You are eligible for '}
              <span className="text-[#1976D2]">
                {isHi ? `${count} छात्रवृत्तियों के लिए पात्र हैं` : `${count} scholarships`}
              </span>
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-[#5B6B83] leading-relaxed font-medium">
          {isHi 
            ? 'अपनी सत्यापित एकल प्रोफ़ाइल के साथ 1-क्लिक में पोस्ट-मैट्रिक या शीर्ष श्रेणी शिक्षा छात्रवृत्ति के लिए आवेदन करें।' 
            : 'Apply for Post-Matric ST Scholarship or Top Class Education in 1-click using your verified reusable profile.'}
        </p>

        {/* Primary CTA Button */}
        <button
          onClick={() => setActiveTab('scholarships')}
          className="w-full bg-[#1976D2] hover:bg-[#1565C0] active:scale-[0.98] text-white font-bold py-3 px-4 rounded-2xl text-[13px] flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
        >
          <span>{isHi ? 'पात्र छात्रवृत्तियां देखें और आवेदन करें' : 'Explore Eligible Scholarships & Apply'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </article>
  );
};
