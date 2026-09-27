import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check } from 'lucide-react';

interface Props {
  onContinue: (selectedLangId: string) => void;
}

interface LanguageOption {
  id: string;
  name: string;
  native: string;
  isHi?: boolean;
  bgClass: string;
  selectedBgClass: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'en', name: 'English', native: 'English', isHi: false, bgClass: 'bg-orange-100/70 border-orange-200 text-orange-950', selectedBgClass: 'bg-[#FFA726] border-[#FB8C00] text-slate-950 font-black shadow-sm' },
  { id: 'hi', name: 'Hindi', native: 'हिंदी', isHi: true, bgClass: 'bg-[#DCEEFE] border-blue-200 text-blue-950', selectedBgClass: 'bg-[#90CAF9] border-blue-400 text-blue-950 font-black shadow-sm' },
  { id: 'as', name: 'Assamese', native: 'অসমীয়া', isHi: false, bgClass: 'bg-[#FDE8D7] border-orange-100 text-amber-950', selectedBgClass: 'bg-[#FFCC80] border-orange-300 text-amber-950 font-black shadow-sm' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা', isHi: false, bgClass: 'bg-[#D7EFE0] border-emerald-200 text-emerald-950', selectedBgClass: 'bg-[#A5D6A7] border-emerald-400 text-emerald-950 font-black shadow-sm' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી', isHi: false, bgClass: 'bg-[#FDE8D7] border-orange-100 text-amber-950', selectedBgClass: 'bg-[#FFCC80] border-orange-300 text-amber-950 font-black shadow-sm' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', isHi: false, bgClass: 'bg-[#D7EFE0] border-emerald-200 text-emerald-950', selectedBgClass: 'bg-[#A5D6A7] border-emerald-400 text-emerald-950 font-black shadow-sm' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം', isHi: false, bgClass: 'bg-[#FDE8D7] border-orange-100 text-amber-950', selectedBgClass: 'bg-[#FFCC80] border-orange-300 text-amber-950 font-black shadow-sm' },
  { id: 'mr', name: 'Marathi', native: 'मराठी', isHi: false, bgClass: 'bg-[#FDE8D7] border-orange-100 text-amber-950', selectedBgClass: 'bg-[#FFCC80] border-orange-300 text-amber-950 font-black shadow-sm' },
  { id: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', isHi: false, bgClass: 'bg-[#DCEEFE] border-blue-200 text-blue-950', selectedBgClass: 'bg-[#90CAF9] border-blue-400 text-blue-950 font-black shadow-sm' },
  { id: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', isHi: false, bgClass: 'bg-[#FDE8D7] border-orange-100 text-amber-950', selectedBgClass: 'bg-[#FFCC80] border-orange-300 text-amber-950 font-black shadow-sm' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்', isHi: false, bgClass: 'bg-[#FDF0ED] border-red-100 text-rose-950', selectedBgClass: 'bg-[#FFCDD2] border-red-300 text-rose-950 font-black shadow-sm' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు', isHi: false, bgClass: 'bg-[#DCEEFE] border-blue-200 text-blue-950', selectedBgClass: 'bg-[#90CAF9] border-blue-400 text-blue-950 font-black shadow-sm' }
];

export const LanguageSelectionScreen: React.FC<Props> = ({ onContinue }) => {
  const { setLanguage } = useApp();
  const [selectedLang, setSelectedLang] = useState<string>('en');

  const currentLangObj = LANGUAGES.find(l => l.id === selectedLang) || LANGUAGES[0];

  const handleProceed = () => {
    if (currentLangObj.isHi) {
      setLanguage('hi');
    } else {
      setLanguage('en');
    }
    onContinue(selectedLang);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between h-full bg-white text-slate-900 animate-fade-in p-5 overflow-y-auto overscroll-contain">
      {/* Top Logo: JAGO Scholar Sovereign Identity */}
      <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
        <img 
          src="/jago_scholar_logo.png" 
          alt="JAGO Scholar" 
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Subtitle */}
      <div className="flex items-center space-x-2.5 mt-3 mb-3 flex-shrink-0">
        <div className="p-1 text-slate-800">
          <span className="text-xl font-bold">Aअ</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Choose your language
        </h2>
      </div>

      {/* 12 Language Cards Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto pr-0.5">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`relative h-20 rounded-2xl p-3 flex flex-col justify-center items-center transition-all border text-center ${
                isSelected ? lang.selectedBgClass : lang.bgClass
              } active:scale-95 shadow-2xs`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white/90 text-[#E65100] rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <span className="text-sm font-bold block">{lang.native}</span>
              {lang.name !== lang.native && (
                <span className="text-[11px] opacity-75 mt-0.5 block">{lang.name}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Button & MoTA Subtext */}
      <div className="pt-3 pb-1 flex-shrink-0 space-y-2">
        <button
          onClick={handleProceed}
          className="w-full bg-[#0E2954] hover:bg-[#07152B] active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <span>Continue in {currentLangObj.name}</span>
        </button>

        <div className="flex items-center justify-center space-x-1 pt-1 opacity-70">
          <span className="text-[9px] text-slate-500 font-medium">
            Ministry of Tribal Affairs • Government of India
          </span>
        </div>
      </div>
    </div>
  );
};
