import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Banknote, 
  Download, 
  FileText, 
  User, 
  Bot,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { ApplicationStage, Deficiency } from '../../types';

export const ApplicationTracker: React.FC = () => {
  const { 
    applications, 
    profile, 
    language, 
    setActiveTab, 
    setIsJagoOpen,
    resolveDeficiency,
    requestManualReview,
    showToast 
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [isResolvingModalOpen, setIsResolvingModalOpen] = useState(false);
  const [activeDeficiency, setActiveDeficiency] = useState<Deficiency | null>(null);

  const isHi = language === 'hi';
  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  if (!activeApp) {
    return (
      <div className="p-6 text-center py-20 space-y-3 pb-24">
        <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-extrabold text-slate-700 text-sm">
          {isHi ? 'कोई सक्रिय आवेदन नहीं मिला' : 'No Active Applications Found'}
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {isHi ? 'योजनाएं टैब पर जाएं और पात्र छात्रवृत्ति के लिए 1-क्लिक में आवेदन करें।' : 'Explore schemes and apply with your verified reusable profile.'}
        </p>
        <button
          onClick={() => setActiveTab('scholarships')}
          className="bg-mota-saffron text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm"
        >
          {isHi ? 'योजनाएं खोजें' : 'Browse Schemes'}
        </button>
      </div>
    );
  }

  const getStageColor = (stage: ApplicationStage) => {
    switch (stage) {
      case 'dbt_credited':
        return 'bg-emerald-600 text-white';
      case 'sanctioned':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'department_verified':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'institution_verified':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'deficiency_flagged':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDownloadAck = () => {
    showToast({
      type: 'success',
      title: 'Application Receipt Downloaded',
      message: `Signed acknowledgment receipt saved for App #${activeApp.applicationNo}.`
    });
  };

  return (
    <div className="p-4 space-y-4 pb-32 sm:pb-36 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-mota-saffron" />
            <span>{isHi ? 'आवेदन ट्रैकिंग एवं भुगतान' : 'Application Tracking & DBT'}</span>
          </h2>
        </div>

        <button
          onClick={handleDownloadAck}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center space-x-1 text-[11px] font-bold"
          title="Download Receipt"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Receipt</span>
        </button>
      </div>

      {/* Multiple Applications selector pills if more than 1 */}
      {applications.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {applications.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedAppId === app.id
                  ? 'bg-mota-navy text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {app.schemeName.split(' ')[0]} ({app.applicationNo.slice(-4)})
            </button>
          ))}
        </div>
      )}

      {/* Main Application Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-card-soft space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[10px] font-bold text-slate-400">
              APP NO: {activeApp.applicationNo}
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5 leading-snug">
              {activeApp.schemeName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
              Academic Year {activeApp.academicYear} • {activeApp.course}
            </p>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 inline-flex items-center text-center justify-center self-start ${getStageColor(activeApp.currentStage)}`}>
            {activeApp.currentStage.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Sanction amount preview */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[10px] font-semibold block">
              {isHi ? 'स्वीकृत छात्रवृत्ति राशि' : 'Sanction Amount (Estimated)'}
            </span>
            <span className="font-black text-emerald-700 text-sm">
              ₹ {activeApp.sanctionAmount.toLocaleString('en-IN')} / year
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] font-semibold block">
              {isHi ? 'डीबीटी बैंक खाता' : 'Seeded DBT Account'}
            </span>
            <span className="font-bold text-slate-800">
              {profile.bank.bankName} ({profile.bank.accountNoMasked})
            </span>
          </div>
        </div>
      </div>

      {/* Deficiency Alert Banner if open */}
      {activeApp.deficiencies && activeApp.deficiencies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-4 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-red-100 text-red-600 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-xs text-red-950">
                {isHi ? 'कार्रवाई आवश्यक: विसंगति पाई गई' : 'Action Required: Verification Mismatch'}
              </h4>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {activeApp.deficiencies[0].explanation}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => resolveDeficiency(activeApp.id, activeApp.deficiencies[0].id, 'Re-uploaded verified certificate via DigiLocker')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1"
            >
              <span>{isHi ? 'दस्तावेज पुनः अपलोड करें' : 'Upload Correct Document'}</span>
            </button>
            <button
              onClick={() => requestManualReview(activeApp.id, activeApp.deficiencies[0].id, 'Name matches Aadhaar transliteration.')}
              className="bg-white hover:bg-red-50 text-red-800 border border-red-300 font-bold py-2 px-3 rounded-xl text-xs"
            >
              <span>{isHi ? 'अधिकारी समीक्षा' : 'Manual Review'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Vertical Verification & Lifecycle Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-card-soft space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-mota-navy" />
          <span>{isHi ? 'आवेदन की स्थिति' : 'Application Status'}</span>
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activeApp.timeline.map((event, idx) => {
            return (
              <div key={event.id} className="relative space-y-1">
                {/* Node icon */}
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  event.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : event.isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-50 animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {event.completed ? '✓' : idx + 1}
                </div>

                <div className="flex items-start justify-between">
                  <h4 className={`text-xs font-black ${event.completed || event.isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                    {event.title}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400">
                    {event.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                {event.remarks && (
                  <div className="mt-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-mono">
                    <span className="font-bold text-slate-800">Officer Note:</span> {event.remarks}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DBT Details Card */}
      {activeApp.dbtDetails && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 shadow-card-soft space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Banknote className="w-5 h-5 text-emerald-700" />
              <h4 className="font-black text-xs text-emerald-950">
                {isHi ? 'डीबीटी प्रत्यक्ष लाभ अंतरण स्थिति' : 'Direct Benefit Transfer (DBT) Status'}
              </h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeApp.dbtDetails.status === 'Credited'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-100 text-amber-900'
            }`}>
              {activeApp.dbtDetails.status === 'Credited' ? 'Credited ✓' : 'In Pipeline'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/80">
              <span className="text-[10px] text-emerald-800/70 font-semibold block">PFMS Transaction ID</span>
              <span className="font-mono font-bold text-emerald-950 text-[11px]">{activeApp.dbtDetails.pfmsTxnId}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/80">
              <span className="text-[10px] text-emerald-800/70 font-semibold block">Bank & Account</span>
              <span className="font-bold text-emerald-950 text-[11px]">{activeApp.dbtDetails.bankName} ({activeApp.dbtDetails.maskedAcc})</span>
            </div>
          </div>

          {activeApp.dbtDetails.status === 'Credited' && (
            <div className="p-2 bg-emerald-600 text-white rounded-xl text-center text-xs font-bold">
              ₹ {activeApp.sanctionAmount.toLocaleString('en-IN')} Credited to Account on {activeApp.dbtDetails.disbursedDate}
            </div>
          )}
        </div>
      )}

      {/* JAGO Inquiry CTA */}
      <div 
        onClick={() => setIsJagoOpen(true)}
        className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all"
      >
        <div className="flex items-center space-x-2 text-xs">
          <Bot className="w-4 h-4 text-amber-400" />
          <span>{isHi ? 'जागो एआई से आवेदन की स्थिति पूछें' : 'Ask JAGO why your application is pending'}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
