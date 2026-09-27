import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Building, 
  GraduationCap, 
  Banknote, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown, 
  RotateCcw,
  Lock,
  Fingerprint,
  ArrowRight,
  LogOut
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    language, 
    setIsDigiLockerModalOpen,
    setIsJagoOpen,
    logout,
    showToast 
  } = useApp();

  const [expandedSection, setExpandedSection] = useState<string>('verification_center');

  const isHi = language === 'hi';
  const isIncomePending = profile.family.incomeVerificationStatus !== 'verified';

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? '' : sec);
  };

  return (
    <div className="p-4 space-y-4 pb-32 sm:pb-36 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <User className="w-5 h-5 text-mota-saffron" />
          <span>{isHi ? 'एकल सत्यापित छात्र प्रोफ़ाइल' : 'Unified Verified Student Profile'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          {isHi ? 'एकल डिजिटल पहचान — सभी केंद्रीय छात्रवृत्ति पोर्टलों में मान्य।' : 'Single Source of Truth — Pre-verified for instant scholarship reuse.'}
        </p>
      </div>

      {/* Completion Badge Banner */}
      <div className="bg-gradient-to-r from-mota-navy to-slate-900 text-white rounded-3xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-mota-saffron to-amber-300 flex items-center justify-center font-black text-mota-navy text-lg shadow-md">
              {profile.name[0]}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">{profile.name}</h3>
              <p className="text-xs text-slate-300">{profile.social.tribeCommunity} Tribe • {profile.address.district}, {profile.address.state}</p>
            </div>
          </div>
        </div>

        {/* Breakdown pills */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-5 gap-1 text-[10px] text-center font-semibold">
          <div className="bg-white/10 py-1 rounded-lg text-emerald-300">Identity ✓</div>
          <div className="bg-white/10 py-1 rounded-lg text-emerald-300">ST Caste ✓</div>
          <div className="bg-white/10 py-1 rounded-lg text-emerald-300">Academic ✓</div>
          <div className={`py-1 rounded-lg ${isIncomePending ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-white/10 text-emerald-300'}`}>
            Income {isIncomePending ? '⏳' : '✓'}
          </div>
          <div className="bg-white/10 py-1 rounded-lg text-emerald-300">Bank ✓</div>
        </div>
      </div>

      {/* Central Verification Center */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-soft overflow-hidden">
        <button
          onClick={() => toggleSection('verification_center')}
          className="w-full p-4 flex items-center justify-between bg-slate-50 border-b border-slate-200/80 text-left"
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-mota-saffron" />
            <div>
              <h3 className="font-black text-xs text-slate-900">
                {isHi ? 'केंद्रीय सत्यापन केंद्र' : 'Central Verification Center'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {isIncomePending ? '4 of 5 Credentials Verified' : 'All 5 Credentials Verified ✓'}
              </p>
            </div>
          </div>
          {expandedSection === 'verification_center' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'verification_center' && (
          <div className="p-4 space-y-3 animate-fade-in text-xs">
            {/* Identity */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-800 block truncate">Identity & Aadhaar e-KYC</span>
                  <p className="text-[10px] text-slate-500 truncate">{profile.aadhaarMasked} • UIDAI Verified</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center">Verified ✓</span>
            </div>

            {/* ST Certificate */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-800 block truncate">Scheduled Tribe (ST) Certificate</span>
                  <p className="text-[10px] text-slate-500 truncate">{profile.social.tribeCommunity} • {profile.social.stCertificateNo}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center">Verified ✓</span>
            </div>

            {/* Income Certificate */}
            <div className={`p-3 rounded-2xl border ${isIncomePending ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'} space-y-2`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {isIncomePending ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-800 block truncate">Annual Family Income Certificate</span>
                    <p className="text-[10px] text-slate-500 truncate">₹ {profile.family.annualIncome.toLocaleString('en-IN')} / year • {profile.family.incomeCertificateNo}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center ${isIncomePending ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'}`}>
                  {isIncomePending ? 'Pending Sync' : 'Verified ✓'}
                </span>
              </div>

              {isIncomePending && (
                <div className="pt-1 flex items-center justify-between text-[11px] border-t border-amber-200/80">
                  <span className="text-amber-800">Connect DigiLocker to auto-validate:</span>
                  <button
                    onClick={() => setIsDigiLockerModalOpen(true)}
                    className="bg-[#F57C00] hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center space-x-1 whitespace-nowrap"
                  >
                    <span>Sync Certificate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Academic Record */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-800 block truncate">Academic & APAAR ID Record</span>
                  <p className="text-[10px] text-slate-500 truncate">APAAR: {profile.academic.apaarId} • AISHE: {profile.academic.aisheCode}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center">Verified ✓</span>
            </div>

            {/* Bank & DBT */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-800 block truncate">Bank Account & DBT Seeding</span>
                  <p className="text-[10px] text-slate-500 truncate">{profile.bank.bankName} ({profile.bank.accountNoMasked}) • NPCI Active</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 inline-flex items-center">Verified ✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 1: Personal Information */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-soft overflow-hidden">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full p-4 flex items-center justify-between text-left font-extrabold text-xs text-slate-900"
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-mota-navy" />
            <span>Personal Information</span>
          </div>
          {expandedSection === 'personal' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'personal' && (
          <div className="p-4 pt-0 space-y-2 text-xs border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Full Name</span>
                <span className="font-bold text-slate-800">{profile.name}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Date of Birth</span>
                <span className="font-bold text-slate-800">{profile.dob}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Mobile</span>
                <span className="font-bold text-slate-800">{profile.mobile}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Aadhaar e-KYC</span>
                <span className="font-bold text-emerald-700">{profile.aadhaarMasked} ✓</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px]">
              <span className="text-slate-400 text-[10px] block">Permanent Residential Address</span>
              <span className="font-medium text-slate-800">{profile.address.street}, {profile.address.villageTown}, {profile.address.district}, {profile.address.state} - {profile.address.pincode}</span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Academic Details */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-soft overflow-hidden">
        <button
          onClick={() => toggleSection('academic')}
          className="w-full p-4 flex items-center justify-between text-left font-extrabold text-xs text-slate-900"
        >
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-mota-navy" />
            <span>Academic & Enrollment Details</span>
          </div>
          {expandedSection === 'academic' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'academic' && (
          <div className="p-4 pt-0 space-y-2 text-xs border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Course Enrolled</span>
                <span className="font-bold text-slate-800">{profile.academic.courseName}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Current Stage</span>
                <span className="font-bold text-slate-800">{profile.academic.currentYear}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">APAAR ID</span>
                <span className="font-mono font-bold text-slate-800">{profile.academic.apaarId}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">AISHE Code</span>
                <span className="font-mono font-bold text-slate-800">{profile.academic.aisheCode}</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px]">
              <span className="text-slate-400 text-[10px] block">Institution</span>
              <span className="font-bold text-slate-800">{profile.academic.institutionName} ({profile.academic.institutionType})</span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Bank Details */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-soft overflow-hidden">
        <button
          onClick={() => toggleSection('bank')}
          className="w-full p-4 flex items-center justify-between text-left font-extrabold text-xs text-slate-900"
        >
          <div className="flex items-center space-x-2">
            <Banknote className="w-4 h-4 text-mota-navy" />
            <span>Bank & DBT Mandate</span>
          </div>
          {expandedSection === 'bank' ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'bank' && (
          <div className="p-4 pt-0 space-y-2 text-xs border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Bank Name</span>
                <span className="font-bold text-slate-800">{profile.bank.bankName}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">Account Number</span>
                <span className="font-mono font-bold text-slate-800">{profile.bank.accountNoMasked}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">IFSC Code</span>
                <span className="font-mono font-bold text-slate-800">{profile.bank.ifsc}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block">NPCI Aadhaar Bridge</span>
                <span className="font-bold text-emerald-700">Seeded Active ✓</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Logout / Sign Out Section */}
      <div className="pt-3">
        <button
          onClick={logout}
          className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 active:scale-98 transition-all shadow-xs"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>{language === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
        </button>
      </div>
    </div>
  );
};
