import React, { useEffect, useState } from 'react';

interface Props {
  onDismiss?: () => void;
  autoHideDuration?: number; // In ms
}

export const OpeningSplashScreen: React.FC<Props> = ({ 
  onDismiss, 
  autoHideDuration = 2200 
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, 400); // Smooth 400ms fade-out transition
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onDismiss]);

  const handleManualDismiss = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      onClick={handleManualDismiss}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#C5E4FD] via-[#E8F3FD] to-[#BEE0FA] text-[#0E2954] select-none cursor-pointer transition-opacity duration-400 ease-out overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fade-in'
      }`}
    >
      {/* High-fidelity full artwork representation */}
      <div className="relative w-full h-full max-w-[480px] mx-auto flex flex-col items-center justify-between">
        <img 
          src="/splash_screen_art.png" 
          alt="JAGO Scholar - Unified Tribal Scholarship Hub | Ministry of Tribal Affairs" 
          className="w-full h-full object-cover sm:object-contain drop-shadow-sm select-none pointer-events-none"
        />

        {/* Dynamic Interactive Loading Indicator Overlay matching the design's 3 dots */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2 pointer-events-none"
          style={{ top: '50.8%' }}
        >
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[#F57C00] shadow-sm animate-bounce opacity-90" 
            style={{ animationDelay: '0ms', animationDuration: '900ms' }} 
          />
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[#7DD3FC] shadow-sm animate-bounce opacity-90" 
            style={{ animationDelay: '200ms', animationDuration: '900ms' }} 
          />
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[#86EFAC] shadow-sm animate-bounce opacity-90" 
            style={{ animationDelay: '400ms', animationDuration: '900ms' }} 
          />
        </div>
      </div>
    </div>
  );
};
