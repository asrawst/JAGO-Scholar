import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const MobileShell: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-0 text-slate-800 font-sans selection:bg-[#F57C00] selection:text-white overflow-x-hidden">
      {/* Main Mobile App Container (Seamless fullscreen on native mobile/emulator and responsive shell on desktop) */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[844px] sm:max-h-[95vh] sm:rounded-[28px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.8)] sm:border sm:border-slate-800 bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Inner App Container */}
        <div className="flex-1 flex flex-col relative bg-slate-100/60 min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

