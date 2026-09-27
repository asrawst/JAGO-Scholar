import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScholarshipCard } from './ScholarshipCard';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { SchemeId } from '../../types';

export const ScholarshipSection: React.FC = () => {
  const { schemes, setActiveTab, language } = useApp();
  const isHi = language === 'hi';

  // Standard ordered list of 5 central MoTA schemes
  const orderedSchemeIds: SchemeId[] = [
    'post_matric',
    'top_class',
    'pre_matric',
    'nfst',
    'nos'
  ];

  const sortedSchemes = [...schemes].sort((a, b) => {
    const idxA = orderedSchemeIds.indexOf(a.id);
    const idxB = orderedSchemeIds.indexOf(b.id);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <section 
      aria-label="All 5 Central MoTA Schemes"
      className="space-y-3 pt-1"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base sm:text-lg text-[#0B2A55] flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-[#FF7A00] stroke-[2.2]" />
          <span>{isHi ? 'सभी 5 केंद्रीय जनजातीय योजनाएं' : 'All 5 Central MoTA Schemes'}</span>
        </h3>
        <button
          onClick={() => setActiveTab('scholarships')}
          className="text-xs font-bold text-[#1976D2] hover:text-[#1565C0] hover:underline flex items-center space-x-1 cursor-pointer py-1"
        >
          <span>{isHi ? 'सभी देखें' : 'View All'}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* 5 Scheme Cards Feed */}
      <div className="space-y-2.5">
        {sortedSchemes.map(scheme => (
          <ScholarshipCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </section>
  );
};
