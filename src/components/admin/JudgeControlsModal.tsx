import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X,
  Sliders, 
  RotateCcw, 
  PlayCircle, 
  ShieldCheck, 
  Users, 
  Activity, 
  ScrollText, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Radio,
  ExternalLink
} from 'lucide-react';
import { ApplicationStage, UserRole } from '../../types';

export const JudgeControlsModal: React.FC = () => {
  const { 
    isJudgeControlsModalOpen,
    setIsJudgeControlsModalOpen,
    currentRole, 
    setCurrentRole, 
    fastForwardPipeline, 
    resetAllDemoData,
    setIsSimulatorModalOpen,
    setIsOutreachModalOpen,
    setIsAuditModalOpen,
    setIsOfficerDrawerOpen,
    setIsAuthModalOpen,
    applications,
    profile,
    showToast
  } = useApp();

  if (!isJudgeControlsModalOpen) return null;

  const activeApp = applications.find(a => a.schemeId === 'post_matric');
  const currentStage = activeApp?.currentStage || 'submitted';

  const stages: { stage: ApplicationStage; label: string; short: string; desc: string }[] = [
    { stage: 'submitted', label: '1. Submitted', short: 'Sub', desc: 'Application lodged by student with Aadhaar e-KYC' },
    { stage: 'institution_verified', label: '2. Inst Verified', short: 'Inst', desc: 'BIT Mesra Nodal Officer approved enrollment' },
    { stage: 'department_verified', label: '3. Dept Verified', short: 'Dept', desc: 'State Tribal Welfare Office approved ST quota' },
    { stage: 'sanctioned', label: '4. Sanctioned', short: 'Sanc', desc: 'Central MoTA Sanction Order issued (₹72,000)' },
    { stage: 'dbt_credited', label: '5. DBT Credited', short: 'DBT', desc: 'PFMS direct bank account credit cleared' }
  ];

  const handleStageSelect = (st: typeof stages[0]) => {
    fastForwardPipeline(st.stage);
    showToast({
      type: 'success',
      title: 'Lifecycle Fast-Forwarded',
      message: `Active application set to: ${st.label}`
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    showToast({
      type: 'info',
      title: 'Demo Persona Switched',
      message: `Switched view context to ${role.toUpperCase()}`
    });
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsJudgeControlsModalOpen(false)}
    >
      <div 
        className="bg-slate-950 border-t border-slate-800 rounded-t-3xl max-w-md w-full mx-auto max-h-[90%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0E2954] via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 p-0.5 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src="/jago_scholar_logo.png" 
                alt="JAGO Scholar" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white tracking-tight">Controls & Quick Actions</h3>
                <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  SIH26238
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Judge & Evaluator Interactive Live Testing Hub
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsJudgeControlsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs min-h-0 overscroll-contain">
          
          {/* 1. Fast-Forward Application Lifecycle */}
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center space-x-1.5">
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Fast-Forward Lifecycle Simulator</span>
              </span>
              <span className="text-[9px] font-mono bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                Active: {currentStage.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Advance the active PMS-ST application through the complete 5-stage verification & DBT pipeline:
            </p>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {stages.map((st) => {
                const isActive = currentStage === st.stage;
                return (
                  <button
                    key={st.stage}
                    onClick={() => handleStageSelect(st)}
                    className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center border ${
                      isActive 
                        ? 'bg-[#F57C00] text-slate-950 font-bold border-[#F57C00] shadow-md scale-102' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold block">{st.short}</span>
                    <span className="text-[8px] opacity-80 block truncate max-w-full">
                      {st.stage === 'dbt_credited' ? '₹ Credit' : `Step ${st.label.charAt(0)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Government Modules */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Government Platform Integration Modules
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Nodal Officer Portal */}
              <button
                onClick={() => {
                  setIsJudgeControlsModalOpen(false);
                  setIsOfficerDrawerOpen(true);
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/70 to-slate-900 border border-blue-800/40 text-left hover:border-blue-600 transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-900/50 text-blue-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h4 className="font-bold text-xs text-white">Officer Portal</h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Institute & MoTA review queue, manual checks & approvals
                </p>
              </button>

              {/* API Gateway Simulator */}
              <button
                onClick={() => {
                  setIsJudgeControlsModalOpen(false);
                  setIsSimulatorModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-purple-950/70 to-slate-900 border border-purple-800/40 text-left hover:border-purple-600 transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-900/50 text-purple-400 group-hover:scale-105 transition-transform">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h4 className="font-bold text-xs text-white">API Gateway</h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Simulate DigiLocker, NSP, SFMP, and PFMS live status
                </p>
              </button>

              {/* ST Outreach Matcher */}
              <button
                onClick={() => {
                  setIsJudgeControlsModalOpen(false);
                  setIsOutreachModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-800/40 text-left hover:border-emerald-600 transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-900/50 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h4 className="font-bold text-xs text-white">ST Outreach</h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  UDISE+/AISHE non-applicant matcher & SMS outreach
                </p>
              </button>

              {/* Immutable Audit Log */}
              <button
                onClick={() => {
                  setIsJudgeControlsModalOpen(false);
                  setIsAuditModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 text-left hover:border-slate-500 transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:scale-105 transition-transform">
                    <ScrollText className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h4 className="font-bold text-xs text-white">Audit Trail</h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  SHA-256 hashed immutable civic verification log
                </p>
              </button>
            </div>
          </div>

          {/* 3. Authentication & Login Simulator */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 rounded-2xl p-3 border border-amber-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                Citizen Authentication Gateway
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                UIDAI / DigiLocker
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Test student login and signup via 12-digit Aadhaar e-KYC (OTP 842217) or 1-Click DigiLocker OAuth2:
            </p>
            <button
              onClick={() => {
                setIsJudgeControlsModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#F57C00] hover:bg-[#E65100] text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-md"
            >
              <span>Simulate Aadhaar / DigiLocker Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Demo Persona Switcher */}
          <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Switch Demo Persona
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleRoleChange('student')}
                className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all ${
                  currentRole === 'student' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Student (Rahul)
              </button>
              <button
                onClick={() => handleRoleChange('institution_officer')}
                className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all ${
                  currentRole === 'institution_officer' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Institute Nodal
              </button>
              <button
                onClick={() => handleRoleChange('ministry_admin')}
                className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all ${
                  currentRole === 'ministry_admin' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                MoTA Central
              </button>
            </div>
          </div>

          {/* 4. Reset Demo State */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Restore initial demo data:</span>
            <button
              onClick={() => {
                resetAllDemoData();
                setIsJudgeControlsModalOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40 text-[11px] font-bold active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
