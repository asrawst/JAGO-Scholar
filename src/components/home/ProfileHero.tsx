import React from 'react';
import { useApp } from '../../context/AppContext';

export const ProfileHero: React.FC = () => {
  const { profile, language, digiLockerDocs } = useApp();
  const isHi = language === 'hi';

  const isFullyVerified = profile.profileCompletionPercentage === 100 || digiLockerDocs.every(d => d.verificationStatus === 'verified');
  const completionPercent = isFullyVerified ? 100 : profile.profileCompletionPercentage;

  return (
    <section 
      aria-label="Student Profile Summary"
      className="bg-gradient-to-br from-[#EBF5FE] via-[#F1F8FF] to-[#DDEFFE] text-[#10213F] px-4 pt-4 pb-3 rounded-3xl shadow-sm relative overflow-hidden border border-[#BFDBFE]/80"
    >
      {/* Tribal Student Illustration — reduced 15% + utmost right, permanently cropped to hide JAGO SCHOLAR text */}
      <div 
        aria-hidden="true" 
        className="absolute right-0 bottom-0 w-[179px] sm:w-[207px] h-[143px] sm:h-[162px] pointer-events-none select-none z-0 overflow-hidden"
      >
        <img 
          src="/tribal_student_hero.png" 
          alt="" 
          className="w-full h-full object-cover object-top scale-[1.24] origin-top translate-x-[8px] select-none pointer-events-none drop-shadow-sm"
          loading="eager"
        />
      </div>

      {/* Row 1: Namaste + Badge (Profile % pill removed) */}
      <div className="flex items-start justify-between relative z-10">
        {/* Left column: greeting, name, course */}
        <div className="max-w-[205px] sm:max-w-[220px]">
          {/* Namaste + Santhal (ST) badge */}
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="text-[13px] font-semibold text-[#5B6B83]">
              {isHi ? 'नमस्ते,' : 'Namaste,'}
            </span>
            <span className="text-[11px] bg-[#FFEDD5] text-[#C2410C] font-bold px-2.5 py-[3px] rounded-full border border-orange-200">
              {profile.social.tribeCommunity || 'Santhal'} ({profile.social.category || 'ST'})
            </span>
          </div>

          {/* Student Name */}
          <h1 className="text-[22px] font-black tracking-tight text-[#0B2A55] mt-1.5 leading-[1.15]">
            {profile.name}
          </h1>

          {/* Course & Year — Com Sci single line, 2nd Year next line */}
          <div className="mt-1.5 space-y-0.5">
            <p className="text-[11px] sm:text-[11.5px] text-[#5B6B83] font-medium leading-[1.35] whitespace-nowrap">
              {profile.academic.courseName}
            </p>
            <p className="text-[12px] text-[#5B6B83] font-medium leading-[1.4]">
              {profile.academic.currentYear}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Unified Reusable Profile status + progress bar — half width, background removed */}
      <div className="mt-5 pt-3 border-t border-[#BFDBFE]/60 relative z-10 bg-transparent w-1/2 max-w-[52%]">
        <div className="flex items-center justify-between text-[12px] mb-2 font-semibold">
          <span className="text-[#10213F]">{isHi ? 'एकल प्रोफ़ाइल स्थिति' : 'Unified Reusable Profile'}</span>
          <span className="text-[#0B9F6E] font-bold">
            {completionPercent === 100 
              ? (isHi ? '100% सत्यापित ✓' : '100% Verified ✓') 
              : (isHi ? `${completionPercent}% सत्यापित` : `${completionPercent}% Verified`)}
          </span>
        </div>
        <div className="w-full h-[7px] bg-[#BFDBFE]/70 rounded-full overflow-hidden">
          <div 
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-full bg-[#1976D2] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
};
