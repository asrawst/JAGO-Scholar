import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, ChevronRight } from 'lucide-react';

export const JagoAssistantCard: React.FC = () => {
  const { setIsJagoOpen, language } = useApp();
  const isHi = language === 'hi';

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => setIsJagoOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsJagoOpen(true);
        }
      }}
      aria-label="Open JAGO AI Assistant for scholarship queries"
      className="bg-gradient-to-r from-[#FFF7ED] via-[#FFEDD5]/60 to-[#FEF3C7]/80 border border-[#FED7AA] rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-orange-300 cursor-pointer active:scale-98 transition-all"
    >
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        {/* Robot/Bot Icon */}
        <div className="relative w-10 h-10 rounded-full bg-[#FF7A00] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
          </span>
          <Bot className="w-5 h-5 text-white stroke-[2.2] animate-pulse" />
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-sm text-[#10213F]">
            {isHi ? 'कोई प्रश्न है? JAGO से पूछें' : 'Have a Question? Ask JAGO'}
          </h3>
          <p className="text-[11px] text-[#5B6B83] mt-0.5 truncate font-medium">
            {isHi 
              ? 'सक्रिय छात्रवृत्ति के आधार पर तुरंत उत्तर प्राप्त करें।' 
              : 'Instant answers grounded in your active scholarships.'}
          </p>
        </div>
      </div>

      {/* Circle Arrow Action Button */}
      <div className="w-8 h-8 rounded-full bg-white text-[#FF7A00] border border-orange-200 flex items-center justify-center shadow-2xs flex-shrink-0">
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </div>
    </div>
  );
};
