import React from 'react';
import { ProfileHero } from './ProfileHero';
import { ScholarshipStats } from './ScholarshipStats';
import { EligibleScholarshipCard } from './EligibleScholarshipCard';
import { DBTStatusCard } from './DBTStatusCard';
import { JagoAssistantCard } from './JagoAssistantCard';
import { ScholarshipSection } from './ScholarshipSection';
import { useApp } from '../../context/AppContext';

export const HomeDashboard: React.FC = () => {
  const { language } = useApp();
  const isHi = language === 'hi';

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-28 animate-fade-in font-sans bg-[#F4F8FD] min-h-full">
      {/* 1. Welcome & Profile Hero Card */}
      <ProfileHero />

      {/* 2. Quick Statistics (4 Equal Cards) */}
      <ScholarshipStats />

      {/* 3. Eligible Scholarships Highlight Card */}
      <EligibleScholarshipCard />

      {/* 4. Aadhaar DBT Seeding Status Card */}
      <DBTStatusCard />

      {/* 5. JAGO AI Assistant Card */}
      <JagoAssistantCard />

      {/* 6. All 5 Central MoTA Schemes Section */}
      <ScholarshipSection />

      {/* Core Principle Footer Note */}
      <footer className="p-3.5 bg-white/70 rounded-2xl border border-[#E5ECF5] text-center shadow-2xs">
        <p className="text-[10px] sm:text-[11px] text-[#5B6B83] font-medium leading-relaxed">
          {isHi 
            ? 'जागो स्कॉलर: एक बार विवरण भरें → एक बार सत्यापन कराएं → सभी 5 केंद्रीय छात्रवृत्तियों में पुनः उपयोग करें।' 
            : 'Core Principle: Enter Once → Verify Once → Seamlessly Reuse Across All 5 MoTA Schemes.'}
        </p>
      </footer>
    </div>
  );
};
