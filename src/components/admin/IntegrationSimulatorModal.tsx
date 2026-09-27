import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  RotateCcw,
  Layers,
  HelpCircle
} from 'lucide-react';
import { IntegrationServiceConfig, IntegrationStatus } from '../../types';

export const IntegrationSimulatorModal: React.FC = () => {
  const { 
    isSimulatorModalOpen, 
    setIsSimulatorModalOpen, 
    integrationConfig, 
    updateIntegrationConfig,
    showToast 
  } = useApp();

  if (!isSimulatorModalOpen) return null;

  const services: { key: keyof IntegrationServiceConfig; label: string; system: string }[] = [
    { key: 'digiLocker', label: 'DigiLocker Document Sync', system: 'National Digital Locker' },
    { key: 'nsp', label: 'National Scholarship Portal (NSP)', system: 'Central Backend Gateway' },
    { key: 'sfmp', label: 'SFMP Top Class / NFST Portal', system: 'Ministry Scheme Engine' },
    { key: 'nos', label: 'National Overseas Scholarship (NOS)', system: 'Overseas Portal' },
    { key: 'udise', label: 'UDISE+ School Registry', system: 'Min of Education' },
    { key: 'apaar', label: 'APAAR / ABC Academic Depository', system: 'NAD Academic System' },
    { key: 'pfmsDbt', label: 'PFMS / APBS Payment Gateway', system: 'Public Financial Mgmt' },
    { key: 'incomeAuthority', label: 'State Revenue & e-District API', system: 'JharSewa Revenue' }
  ];

  const statuses: IntegrationStatus[] = ['SUCCESS', 'PENDING', 'MISMATCH', 'TIMEOUT', 'UNAVAILABLE'];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[90%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Integration Simulator</h3>
              <p className="text-[10px] text-purple-200">Simulate Real-World Government API Responses</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSimulatorModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="p-3 bg-purple-50 border-b border-purple-100 text-xs text-purple-950 space-y-1 flex-shrink-0">
          <p className="font-bold flex items-center space-x-1">
            <span>Judge Evaluation Tool:</span>
          </p>
          <p className="text-[11px] text-purple-800 leading-snug">
            Toggle simulated government adapters below to test how JAGO Scholar gracefully handles API timeouts, data mismatches, and exception manual review queues.
          </p>
        </div>

        {/* Config controls */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs min-h-0 overscroll-contain">
          {services.map(srv => {
            const currentStatus = integrationConfig[srv.key];

            return (
              <div key={srv.key} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{srv.label}</h5>
                    <span className="text-[10px] text-slate-400 font-medium">{srv.system}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    currentStatus === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                    currentStatus === 'MISMATCH' ? 'bg-red-100 text-red-800' :
                    currentStatus === 'TIMEOUT' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {currentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 pt-1">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => updateIntegrationConfig(srv.key, st)}
                      className={`py-1 px-1 rounded text-center text-[10px] font-bold transition-all ${
                        currentStatus === st
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <div className="p-3 pb-6 sm:pb-3 border-t border-slate-100 bg-slate-50 text-center flex-shrink-0 relative z-10">
          <p className="text-[10px] text-slate-500 italic">
            "Government system integrations shown in this prototype are simulated unless explicitly connected to an authorized API."
          </p>
        </div>
      </div>
    </div>
  );
};
