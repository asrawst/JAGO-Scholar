import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const MobileShell: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#070D18] flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4 text-slate-800 font-sans selection:bg-[#F57C00] selection:text-white overflow-x-hidden">
      {/* Main Mobile App Container: Default size set to iPhone 16 Pro (402px x 874px, 48px corner radius) on Web */}
      <div className="w-full sm:w-[402px] sm:max-w-[402px] h-[100dvh] sm:h-[874px] sm:max-h-[95vh] sm:rounded-[48px] sm:shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] sm:border-[6px] sm:border-slate-800 bg-white flex flex-col relative overflow-hidden transition-all">
        {/* Inner App Container */}
        <div className="flex-1 flex flex-col relative bg-slate-50 min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

