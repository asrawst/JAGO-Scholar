import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ScrollText, 
  Clock, 
  User, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';

export const AuditLogModal: React.FC = () => {
  const { isAuditModalOpen, setIsAuditModalOpen, auditLogs } = useApp();

  if (!isAuditModalOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[90%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 shadow-sm flex-shrink-0">
              <ScrollText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Immutable Audit Trail</h3>
              <p className="text-[10px] text-slate-400">Cryptographically Recorded System & Officer Events</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuditModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Feed */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs min-h-0 overscroll-contain">
          {auditLogs.map(log => (
            <div
              key={log.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 font-mono"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-mota-navy bg-blue-100/70 px-1.5 py-0.5 rounded">
                  {log.id}
                </span>
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </span>
              </div>

              <div className="text-slate-900 font-bold font-sans text-xs">
                {log.action}
              </div>

              <div className="text-[11px] text-slate-500 font-sans space-y-0.5">
                <div className="flex justify-between">
                  <span>Actor:</span>
                  <span className="font-semibold text-slate-800">{log.actor} ({log.role})</span>
                </div>
                <div className="flex justify-between">
                  <span>State Shift:</span>
                  <span className="text-emerald-700 font-bold font-mono">{log.oldState} → {log.newState}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Ref / IP:</span>
                  <span className="text-slate-600 font-mono">{log.targetId} • {log.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 pb-6 sm:pb-3 border-t border-slate-100 bg-slate-50 text-center flex-shrink-0 relative z-10">
          <p className="text-[10px] text-slate-500">
            Audit logs are tamper-evident and follow National e-Governance Division (NeGD) standards.
          </p>
        </div>
      </div>
    </div>
  );
};
