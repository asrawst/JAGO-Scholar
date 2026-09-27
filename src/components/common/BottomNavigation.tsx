import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppTab } from '../../types';
import { 
  Home, 
  GraduationCap, 
  ClipboardList, 
  FolderLock, 
  User 
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, language, applications, profile } = useApp();

  const activeApp = applications.find(a => a.schemeId === 'post_matric');
  const isActionNeeded = activeApp?.currentStage === 'deficiency_flagged';
  const isProfileIncomplete = profile.profileCompletionPercentage < 100;

  const tabs: { id: AppTab; label: string; labelHi: string; icon: React.FC<{ className?: string }>; badge?: boolean; badgeColor?: string }[] = [
    { id: 'home', label: 'Home', labelHi: 'होम', icon: Home },
    { id: 'scholarships', label: 'Schemes', labelHi: 'योजनाएं', icon: GraduationCap },
    { id: 'applications', label: 'Applications', labelHi: 'आवेदन', icon: ClipboardList, badge: isActionNeeded, badgeColor: 'bg-red-500' },
    { id: 'documents', label: 'DigiLocker', labelHi: 'दस्तावेज', icon: FolderLock, badge: isProfileIncomplete, badgeColor: 'bg-amber-500' },
    { id: 'profile', label: 'Profile', labelHi: 'प्रोफ़ाइल', icon: User }
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 w-full z-20 bg-white border-t border-slate-200/80 px-1 pt-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] flex items-center justify-around flex-shrink-0">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[52px] rounded-lg transition-all active:scale-95 ${
              isActive ? '' : 'text-[#5B6B83]'
            }`}
          >
            <div className="relative p-0.5">
              <Icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#1976D2] stroke-[2.4]' : 'text-[#5B6B83] stroke-[1.8]'}`} />
              {tab.badge && (
                <>
                  <span className={`absolute top-0 right-0 w-2 h-2 rounded-full ${tab.badgeColor || 'bg-[#1976D2]'} animate-ping`} />
                  <span className={`absolute top-0 right-0 w-2 h-2 rounded-full ${tab.badgeColor || 'bg-[#1976D2]'}`} />
                </>
              )}
            </div>

            <span className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'text-[#1976D2] font-bold' : 'text-[#5B6B83] font-medium'}`}>
              {language === 'hi' ? tab.labelHi : tab.label}
            </span>

            {/* Active indicator underline */}
            {isActive && (
              <span className="absolute -bottom-0.5 w-8 h-[2px] bg-[#1976D2] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
