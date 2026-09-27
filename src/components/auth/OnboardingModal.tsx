import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  ArrowRight, 
  UserCheck, 
  FolderLock, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onComplete }) => {
  const { language, setLanguage } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const isHi = language === 'hi';

  const slides = [
    {
      id: 1,
      tag: 'Ministry of Tribal Affairs',
      tagHi: 'जनजातीय कार्य मंत्रालय',
      title: 'Welcome to JAGO Scholar',
      titleHi: 'जागो विद्वान (JAGO Scholar) में आपका स्वागत है',
      desc: 'Find, apply and track all 5 Ministry of Tribal Affairs (MoTA) scholarships from one unified place.',
      descHi: 'एक ही एकीकृत स्थान से सभी 5 केंद्रीय जनजातीय छात्रवृत्तियों को खोजें, आवेदन करें और ट्रैक करें।',
      icon: GraduationCap,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 2,
      tag: 'Core Principle',
      tagHi: 'मूल सिद्धांत',
      title: 'One Profile. Reuse Everywhere.',
      titleHi: 'एक प्रोफ़ाइल। हर जगह पुनः उपयोग।',
      desc: 'Enter your category, academic and bank details once. Pre-verified profile automatically populates every application.',
      descHi: 'अपनी जानकारी केवल एक बार भरें। सत्यापित प्रोफ़ाइल स्वचालित रूप से हर छात्रवृत्ति में पुनः उपयोग होगी।',
      icon: UserCheck,
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 3,
      tag: 'DigiLocker Depository',
      tagHi: 'डिजिलॉकर एकीकरण',
      title: 'Verified Digital Documents',
      titleHi: 'सत्यापित डिजिटल प्रमाण पत्र',
      desc: 'Securely link caste and income certificates directly from DigiLocker with zero paperwork or physical visits.',
      descHi: 'बिना किसी कागजी कार्रवाई के डिजिलॉकर से सीधे जाति एवं आय प्रमाण पत्र लिंक एवं सत्यापित करें।',
      icon: FolderLock,
      color: 'from-emerald-500 to-teal-700'
    },
    {
      id: 4,
      tag: 'End-to-End Tracking',
      tagHi: 'पारदर्शी ट्रैकिंग',
      title: 'Track Everything to Direct DBT',
      titleHi: 'सीधे बैंक खाते में डीबीटी तक ट्रैक करें',
      desc: 'Know exactly where your application stands from College verification to Sanction order and Aadhaar DBT bank credit.',
      descHi: 'कॉलेज सत्यापन से लेकर स्वीकृति आदेश और सीधे बैंक खाते में भुगतान तक वास्तविक समय में ट्रैक करें।',
      icon: Activity,
      color: 'from-purple-600 to-indigo-800'
    }
  ];

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-6 text-center animate-slide-up relative overflow-hidden">
        {/* Language switch */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full"
          >
            {language === 'en' ? 'हिंदी में देखें' : 'English'}
          </button>
        </div>

        {/* Slide Graphic Icon */}
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${slide.color} flex items-center justify-center text-white mx-auto shadow-lg`}>
          <Icon className="w-10 h-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-mota-saffron bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-mono">
            {isHi ? slide.tagHi : slide.tag}
          </span>
          <h3 className="font-black text-lg text-slate-900 leading-snug">
            {isHi ? slide.titleHi : slide.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            {isHi ? slide.descHi : slide.desc}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center space-x-1.5 pt-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-6 bg-mota-saffron' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full bg-mota-navy hover:bg-slate-900 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md active:scale-98 transition-all"
        >
          <span>{currentSlide === slides.length - 1 ? (isHi ? 'शुरू करें (Get Started)' : 'Get Started') : (isHi ? 'आगे बढ़ें' : 'Next')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Lower Bottom: Ministry of Tribal Affairs Official SVG */}
        <div className="pt-2 border-t border-slate-100 flex flex-col items-center justify-center space-y-1">
          <img 
            src="/Ministry_of_Tribal_Affairs.svg" 
            alt="Ministry of Tribal Affairs" 
            className="h-7 w-auto object-contain opacity-90"
          />
          <span className="text-[9px] text-slate-400 font-medium">
            Ministry of Tribal Affairs • Govt of India
          </span>
        </div>
      </div>
    </div>
  );
};
