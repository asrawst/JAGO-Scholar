import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ArrowRight,
  Building,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ApplicationStage } from '../../types';

export const OfficerReviewDrawer: React.FC = () => {
  const { 
    isOfficerDrawerOpen, 
    setIsOfficerDrawerOpen, 
    applications, 
    advanceApplicationStage, 
    language,
    showToast 
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState('');
  const [reviewActionNote, setReviewActionNote] = useState('');

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0] || null;

  if (!isOfficerDrawerOpen) return null;

  const isHi = language === 'hi';

  const handleApproveStage = (targetStage: ApplicationStage, officerTitle: string) => {
    if (!selectedApp) return;
    advanceApplicationStage(selectedApp.id, targetStage, officerTitle, reviewActionNote || 'Verified against state e-district & institute registry.');
    setReviewActionNote('');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[92%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Officer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Nodal Verification Portal</h3>
              <p className="text-[10px] text-slate-300">MoTA & Institution Verification Queue</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOfficerDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Queue Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs min-h-0 overscroll-contain">
          {/* Active Application Info */}
          {selectedApp && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    APP ID: {selectedApp.applicationNo}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5 truncate">
                    {selectedApp.schemeName}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap flex-shrink-0 inline-flex items-center">
                  {selectedApp.currentStage.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Side-by-side Evidence Card */}
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <span className="font-bold text-slate-700 text-[11px] block">
                  Verified Data & DigiLocker Evidence:
                </span>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-bold text-slate-900">Rahul Kumar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Caste / Category:</span>
                    <span className="font-bold text-emerald-700">ST Santhal (JharSewa Verified ✓)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Enrolled Course:</span>
                    <span className="font-bold text-slate-900">B.Tech CSE (2nd Year)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verified Annual Income:</span>
                    <span className="font-bold text-slate-900">₹ 1,80,000 (≤ ₹2.5L Limit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aadhaar DBT Seeding:</span>
                    <span className="font-bold text-emerald-700">SBI ••••8142 (NPCI Active ✓)</span>
                  </div>
                </div>
              </div>

              {/* Officer Note input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">
                  Officer Remarks / Verification Stamp:
                </label>
                <input
                  type="text"
                  value={reviewActionNote}
                  onChange={e => setReviewActionNote(e.target.value)}
                  placeholder="e.g. Attendance & enrollment verified via college ledger."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                  Officer Action Workflow:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApproveStage('institution_verified', 'Prof. A. K. Munda (College Nodal)')}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <span>1. Inst Verify</span>
                  </button>

                  <button
                    onClick={() => handleApproveStage('department_verified', 'DWO Ranchi (MoTA Officer)')}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <span>2. Dept Verify</span>
                  </button>

                  <button
                    onClick={() => handleApproveStage('sanctioned', 'MoTA Sanction Division')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <span>3. Issue Sanction</span>
                  </button>

                  <button
                    onClick={() => handleApproveStage('dbt_credited', 'PFMS APBS Gateway')}
                    className="bg-mota-saffron hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <span>4. Credit DBT</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedApp && (
            <div className="p-8 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No Active Application in Queue</h4>
              <p className="text-xs text-slate-500">Apply for a scholarship from the student portal to review and verify.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 pb-6 sm:pb-3 border-t border-slate-100 bg-slate-50 text-center flex-shrink-0 relative z-10">
          <p className="text-[10px] text-slate-500">
            All approvals generate SHA-256 cryptographically linked audit trail records.
          </p>
        </div>
      </div>
    </div>
  );
};
