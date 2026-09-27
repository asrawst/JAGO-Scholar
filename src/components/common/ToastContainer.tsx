import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-12 left-0 right-0 max-w-md mx-auto z-50 px-4 pointer-events-none space-y-2">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
          error: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
        };

        const bgStyles = {
          success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          error: 'bg-red-50 border-red-200 text-red-950',
          warning: 'bg-amber-50 border-amber-200 text-amber-950',
          info: 'bg-blue-50 border-blue-200 text-blue-950'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start space-x-3 animate-slide-up backdrop-blur-md ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-xs">
              <h4 className="font-bold">{toast.title}</h4>
              <p className="mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
