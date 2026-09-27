import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Users, 
  Search, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  GraduationCap, 
  TrendingUp
} from 'lucide-react';

export const OutreachDemoModal: React.FC = () => {
  const { 
    isOutreachModalOpen, 
    setIsOutreachModalOpen, 
    outreachCandidates, 
    language,
    showToast 
  } = useApp();

  if (!isOutreachModalOpen) return null;

  const handleSendSms = (candidateName: string) => {
    showToast({
      type: 'success',
      title: 'Automated SMS Nudge Sent',
      message: `Proactive scholarship notification & application link sent to ${candidateName}.`
    });
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[90%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">ST Beneficiary Outreach Engine</h3>
              <p className="text-[10px] text-emerald-300">UDISE+ / APAAR Cross-Matching Module</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOutreachModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats banner */}
        <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-950">Potential ST Beneficiaries Identified:</span>
            <span className="text-emerald-700 font-mono font-black text-sm">1,248 Students</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
            <div className="bg-white p-1.5 rounded-lg border border-emerald-200 text-emerald-800">
              Eligible: 742
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-amber-200 text-amber-800">
              Missing Docs: 318
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-blue-200 text-blue-800">
              Review: 188
            </div>
          </div>
        </div>

        {/* Candidates List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs min-h-0 overscroll-contain">
          {outreachCandidates.map(candidate => (
            <div
              key={candidate.id}
              className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    APAAR: {candidate.apaarId}
                  </span>
                  <h4 className="font-black text-xs text-slate-900 mt-0.5">
                    {candidate.studentName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {candidate.institution} ({candidate.level})
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {candidate.status.toUpperCase()}
                </span>
              </div>

              {/* Matched Scheme & Gap */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Scheme:</span>
                  <span className="font-bold text-mota-navy">{candidate.eligibleScheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reason Identified:</span>
                  <span className="text-slate-700 font-medium">{candidate.unregisteredReason}</span>
                </div>
              </div>

              {/* Proactive Action */}
              <div className="pt-1 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleSendSms(candidate.studentName)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center space-x-1 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Direct 1-Click Apply SMS</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 pb-6 sm:pb-3 border-t border-slate-100 bg-slate-50 text-center flex-shrink-0 relative z-10">
          <p className="text-[10px] text-slate-500">
            Simulated matching between Ministry of Education UDISE+ and NSP registration databases.
          </p>
        </div>
      </div>
    </div>
  );
};
