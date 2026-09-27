import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/common/MobileShell';
import { TopHeader } from './components/common/TopHeader';
import { BottomNavigation } from './components/common/BottomNavigation';
import { ToastContainer } from './components/common/ToastContainer';

// Screens
import { HomeDashboard } from './components/home/HomeDashboard';
import { ScholarshipDiscovery } from './components/scholarships/ScholarshipDiscovery';
import { ApplicationTracker } from './components/application/ApplicationTracker';
import { DocumentWallet } from './components/documents/DocumentWallet';
import { StudentProfileView } from './components/profile/StudentProfileView';

// Modals & Drawers
import { JagoChatDrawer } from './components/chat/JagoChatDrawer';
import { ApplicationWizard } from './components/application/ApplicationWizard';
import { SchemeDetailModal } from './components/scholarships/SchemeDetailModal';
import { DigiLockerConsentModal } from './components/documents/DigiLockerConsentModal';
import { OfficerReviewDrawer } from './components/admin/OfficerReviewDrawer';
import { IntegrationSimulatorModal } from './components/admin/IntegrationSimulatorModal';
import { OutreachDemoModal } from './components/admin/OutreachDemoModal';
import { AuditLogModal } from './components/admin/AuditLogModal';
import { JudgeControlsModal } from './components/admin/JudgeControlsModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { MobileAuthModal } from './components/auth/MobileAuthModal';
import { OpeningSplashScreen } from './components/common/OpeningSplashScreen';

import { Bot } from 'lucide-react';

const MainScreenRouter: React.FC = () => {
  const { 
    activeTab, 
    isAuthenticated,
    isJagoOpen, 
    setIsJagoOpen, 
    isApplyWizardOpen, 
    isOfficerDrawerOpen, 
    isSimulatorModalOpen, 
    isOutreachModalOpen, 
    isAuditModalOpen, 
    isJudgeControlsModalOpen, 
    isAuthModalOpen,
    selectedSchemeForDetail, 
    setSelectedSchemeForDetail, 
    isDigiLockerModalOpen, 
    setIsDigiLockerModalOpen 
  } = useApp();

  const [showSplash, setShowSplash] = useState(true);

  // 1. Splash Screen Phase (No home screen rendered)
  if (showSplash) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 relative overflow-hidden bg-white">
        <OpeningSplashScreen 
          autoHideDuration={2000} 
          onDismiss={() => setShowSplash(false)} 
        />
      </div>
    );
  }

  // 2. Unauthenticated Phase: Render ONLY Language / Auth Modal (Zero background sneak peak)
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 relative overflow-hidden bg-white">
        <MobileAuthModal forcedOpen={true} />
        <ToastContainer />
      </div>
    );
  }

  // Check if any modal or drawer is currently active
  const isAnyModalOpen = 
    isJagoOpen || 
    isApplyWizardOpen || 
    isOfficerDrawerOpen || 
    isSimulatorModalOpen || 
    isOutreachModalOpen || 
    isAuditModalOpen || 
    isJudgeControlsModalOpen || 
    isAuthModalOpen ||
    !!selectedSchemeForDetail || 
    isDigiLockerModalOpen;

  // Render current tab
  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'scholarships':
        return <ScholarshipDiscovery />;
      case 'applications':
        return <ApplicationTracker />;
      case 'documents':
        return <DocumentWallet />;
      case 'profile':
        return <StudentProfileView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 relative overflow-hidden">
      {/* 1. Top Header (Ministry branding + language toggle + notifications + clickable emblem) */}
      <div className="flex-shrink-0 z-20">
        <TopHeader />
      </div>

      {/* 2. Main Screen View Area */}
      <main className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
        {renderCurrentTab()}
      </main>

      {/* 3. Floating JAGO AI Assistant Trigger */}
      {!isAnyModalOpen && (
        <button
          onClick={() => setIsJagoOpen(true)}
          className="absolute bottom-20 right-4 z-20 w-12 h-12 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#FB923C] text-white shadow-[0_4px_18px_rgba(249,115,22,0.45)] hover:shadow-2xl active:scale-90 transition-all flex items-center justify-center border-2 border-white/40"
          title="Ask JAGO AI Assistant"
        >
          {/* Blinking Live Indicator Dot */}
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-white"></span>
          </span>
          <Bot className="w-6 h-6 text-white animate-pulse" />
        </button>
      )}

      {/* 4. Bottom 5 Tabs Navigation */}
      <BottomNavigation />

      {/* Global Root-Level Modals & Drawers */}
      {selectedSchemeForDetail && (
        <SchemeDetailModal
          scheme={selectedSchemeForDetail}
          onClose={() => setSelectedSchemeForDetail(null)}
        />
      )}

      <DigiLockerConsentModal
        isOpen={isDigiLockerModalOpen}
        onClose={() => setIsDigiLockerModalOpen(false)}
      />

      <JagoChatDrawer />
      <ApplicationWizard />
      <OfficerReviewDrawer />
      <IntegrationSimulatorModal />
      <OutreachDemoModal />
      <AuditLogModal />
      <JudgeControlsModal />
      {isAuthModalOpen && <MobileAuthModal />}

      {/* Toast alert system */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MobileShell>
        <MainScreenRouter />
      </MobileShell>
    </AppProvider>
  );
}

export default App;
