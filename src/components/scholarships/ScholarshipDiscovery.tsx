import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight,
  Info,
  Building,
  Calendar,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { ScholarshipScheme, SchemeId } from '../../types';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { SchemeDetailModal } from './SchemeDetailModal';

export const ScholarshipDiscovery: React.FC = () => {
  const { 
    schemes, 
    profile, 
    applications, 
    language,
    selectedSchemeForDetail,
    setSelectedSchemeForDetail,
    setApplyingSchemeId,
    setIsApplyWizardOpen,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'eligible' | 'undergraduate' | 'higher_edu'>('all');

  const isHi = language === 'hi';

  const evaluations = EligibilityEngine.evaluateAll(schemes, profile);

  const filteredSchemes = schemes.filter(scheme => {
    const evalRes = evaluations[scheme.id];
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'eligible') {
      return evalRes.status === 'eligible' || evalRes.status === 'potentially_eligible';
    }
    if (selectedFilter === 'undergraduate') {
      return scheme.id === 'post_matric' || scheme.id === 'top_class';
    }
    if (selectedFilter === 'higher_edu') {
      return scheme.id === 'top_class' || scheme.id === 'nfst' || scheme.id === 'nos';
    }
    return true;
  });

  const getStatusBadge = (schemeId: SchemeId) => {
    const evalRes = evaluations[schemeId];
    const app = applications.find(a => a.schemeId === schemeId);

    if (app) {
      return {
        label: isHi ? 'आवेदन जमा ✓' : 'Applied ✓',
        color: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    }

    switch (evalRes.status) {
      case 'eligible':
        return {
          label: isHi ? 'पात्र' : 'Eligible',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'potentially_eligible':
        return {
          label: isHi ? 'संभावित पात्र' : 'Likely Eligible',
          color: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'not_eligible':
        return {
          label: isHi ? 'अपात्र' : 'Not Eligible',
          color: 'bg-slate-100 text-slate-600 border-slate-200'
        };
      default:
        return {
          label: isHi ? 'जानकारी आवश्यक' : 'Info Missing',
          color: 'bg-slate-100 text-slate-600 border-slate-200'
        };
    }
  };

  return (
    <div className="p-4 space-y-4 pb-32 sm:pb-36 animate-fade-in">
      {/* Header info */}
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-mota-saffron" />
          <span>{isHi ? 'जनजातीय छात्रवृत्ति योजनाएं (MoTA)' : 'MoTA Scholarship Schemes'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          {isHi 
            ? 'एकल प्रोफ़ाइल के आधार पर सभी 5 केंद्रीय छात्रवृत्ति योजनाओं की पात्रता स्वचालित रूप से जांची गई है।' 
            : 'All 5 central MoTA schemes evaluated against your single verified student profile.'}
        </p>
      </div>

      {/* Search & Filter pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'योजना का नाम या कोड खोजें...' : 'Search scheme name or code...'}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-mota-navy text-slate-800 shadow-xs"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'all' 
                ? 'bg-mota-navy text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isHi ? 'सभी (5)' : 'All (5)'}
          </button>
          <button
            onClick={() => setSelectedFilter('eligible')}
            className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'eligible' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isHi ? 'केवल पात्र (2)' : 'Eligible (2)'}
          </button>
          <button
            onClick={() => setSelectedFilter('undergraduate')}
            className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'undergraduate' 
                ? 'bg-mota-navy text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isHi ? 'स्नातक / डिग्री' : 'UG / Degree'}
          </button>
          <button
            onClick={() => setSelectedFilter('higher_edu')}
            className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'higher_edu' 
                ? 'bg-mota-navy text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isHi ? 'उच्च शिक्षा / विदेश' : 'Higher & Overseas'}
          </button>
        </div>
      </div>

      {/* Scheme Cards Feed */}
      <div className="space-y-3.5">
        {filteredSchemes.map(scheme => {
          const evalRes = evaluations[scheme.id];
          const badge = getStatusBadge(scheme.id);
          const hasApp = applications.some(a => a.schemeId === scheme.id);

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-card-soft hover:border-slate-300 transition-all space-y-3"
            >
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {isHi ? scheme.nameHi : scheme.name}
                  </h3>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 inline-flex items-center text-center justify-center self-start ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Tagline / Benefit */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi ? scheme.taglineHi : scheme.tagline}
              </p>

              {/* Quick specs grid */}
              <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-semibold">
                    {isHi ? 'वित्तीय लाभ' : 'Financial Grant'}
                  </span>
                  <span className="font-bold text-slate-800">
                    {scheme.id === 'post_matric' ? '100% Fee + ₹13,500/yr' : scheme.id === 'top_class' ? 'Full Fee + ₹36,000/yr' : scheme.id === 'nfst' ? '₹37,000 to ₹42,000/mo' : 'Full Overseas Funding'}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-semibold">
                    {isHi ? 'आय सीमा' : 'Income Ceiling'}
                  </span>
                  <span className="font-bold text-slate-800">
                    {scheme.maxIncomeThreshold >= 900000000 ? (isHi ? 'कोई सीमा नहीं' : 'No Ceiling') : `≤ ₹${(scheme.maxIncomeThreshold / 100000).toFixed(1)} Lakhs`}
                  </span>
                </div>
              </div>

              {/* Eligibility engine reason summary */}
              <div className="text-[11px] p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start space-x-2">
                {evalRes.status === 'eligible' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                {evalRes.status === 'potentially_eligible' && <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                {evalRes.status === 'not_eligible' && <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />}

                <div className="flex-1 text-slate-700 leading-snug">
                  <span className="font-semibold">{isHi ? evalRes.summaryHi : evalRes.summary}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-1 flex items-center space-x-2">
                <button
                  onClick={() => setSelectedSchemeForDetail(scheme)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 active:scale-95 transition-all"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{isHi ? 'पात्रता विश्लेषण' : 'Eligibility Breakdown'}</span>
                </button>

                {hasApp ? (
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-1 active:scale-95 transition-all shadow-xs"
                  >
                    <span>{isHi ? 'ट्रैक करें' : 'Track App'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setApplyingSchemeId(scheme.id);
                      setIsApplyWizardOpen(true);
                    }}
                    disabled={!evalRes.canApply}
                    className="bg-mota-saffron hover:bg-amber-600 disabled:opacity-40 disabled:pointer-events-none text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-1 active:scale-95 transition-all shadow-sm"
                  >
                    <span>{isHi ? 'आवेदन करें' : 'Apply Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
