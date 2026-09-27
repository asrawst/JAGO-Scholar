import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Globe, ChevronDown } from 'lucide-react';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

export const TopHeader: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    unreadNotifsCount, 
    setIsJudgeControlsModalOpen
  } = useApp();

  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-100/80 flex flex-col select-none">
        {/* Vacant Safe Area / Notch Spacer to prevent overlap with camera cutout */}
        <div className="w-full h-[max(env(safe-area-inset-top,0px),38px)] flex-shrink-0" />

        {/* Main Header Bar */}
        <div className="px-4 pt-0.5 pb-2.5 flex items-center justify-between">
          {/* Left: Logo + Brand Name */}
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* JAGO Scholar circular logo */}
            <button
              onClick={() => setIsJudgeControlsModalOpen(true)}
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer overflow-hidden shadow-xs"
              title="Open Controls & Quick Actions"
            >
              <img 
                src="/jago_scholar_logo.png" 
                alt="JAGO Scholar" 
                className="w-full h-full object-cover rounded-full"
              />
            </button>

            <div className="min-w-0">
              <h1 className="text-[17px] font-black tracking-tight leading-none flex items-baseline space-x-1">
                <span className="text-[#0B2A55]">{language === 'hi' ? 'जागो' : 'JAGO'}</span>
                <span className="text-[#2196F3] font-bold">{language === 'hi' ? 'स्कॉलर' : 'Scholar'}</span>
              </h1>
              <p className="text-[10px] text-[#5B6B83] font-medium truncate leading-tight mt-0.5">
                {language === 'hi' ? 'जनजातीय कार्य मंत्रालय • भारत सरकार' : 'Ministry of Tribal Affairs • Govt of India'}
              </p>
            </div>
          </div>

          {/* Right: Language + Notifications */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Language switcher pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 text-[12px] bg-slate-50 text-[#0B2A55] px-2.5 py-1 rounded-full transition-all font-semibold hover:bg-slate-100 active:bg-slate-200 border border-slate-200/60"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#5B6B83]" />
              <span>{language === 'en' ? 'हिंदी' : 'ENG'}</span>
              <ChevronDown className="w-3 h-3 text-[#5B6B83] stroke-[2]" />
            </button>

            {/* Notification bell */}
            <button
              onClick={() => setIsNotifsOpen(true)}
              className="relative w-9 h-9 rounded-full hover:bg-slate-50 active:scale-95 text-[#0B2A55] transition-all flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="w-[18px] h-[18px] text-[#0B2A55] stroke-[2]" />
              <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-[#EF4444] text-[9px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadNotifsCount > 0 ? unreadNotifsCount : 2}
              </span>
            </button>
          </div>
        </div>
      </header>

      <NotificationDrawer isOpen={isNotifsOpen} onClose={() => setIsNotifsOpen(false)} />
    </>
  );
};
