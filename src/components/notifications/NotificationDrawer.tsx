import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Banknote, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { NotificationItem, AppTab } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, setActiveTab, language } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'action_required':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'disbursement':
        return <Banknote className="w-5 h-5 text-emerald-500" />;
      case 'recommendation':
        return <Award className="w-5 h-5 text-purple-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleNotifClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.actionUrlTab) {
      setActiveTab(notif.actionUrlTab as AppTab);
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-t-3xl max-w-md w-full mx-auto max-h-[88%] flex flex-col shadow-2xl overflow-hidden animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              {language === 'hi' ? 'सूचनाएं एवं अलर्ट' : 'Notifications & Alerts'}
            </h3>
            <span className="text-xs bg-mota-navy text-white px-2 py-0.5 rounded-full font-bold">
              {notifications.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-0 overscroll-contain">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead 
                    ? 'bg-slate-50/70 border-slate-200 opacity-80' 
                    : 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-100 mt-0.5 flex-shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {language === 'hi' ? notif.titleHi : notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 ml-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {language === 'hi' ? notif.messageHi : notif.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.timestamp}</span>
                      </span>
                      {notif.actionUrlTab && (
                        <span className="text-mota-saffron font-bold flex items-center space-x-0.5 hover:underline">
                          <span>{language === 'hi' ? 'खोलें' : 'View'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Safe Area Padding */}
        <div className="p-3 pb-6 sm:pb-3 border-t border-slate-100 bg-slate-50 text-center flex-shrink-0 relative z-10">
          <p className="text-[10px] text-slate-500">
            {language === 'hi' 
              ? 'सभी अपडेट राष्ट्रीय छात्रवृत्ति पोर्टल एवं डीबीटी से वास्तविक समय में सिंक होते हैं।' 
              : 'All notifications are synced in real-time with NSP, SFMP, and PFMS.'}
          </p>
        </div>
      </div>
    </div>
  );
};
