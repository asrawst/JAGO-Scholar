import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  AppTab,
  StudentProfile, 
  ScholarshipScheme, 
  ScholarshipApplication, 
  DigiLockerDoc, 
  NotificationItem, 
  ChatMessage, 
  AuditLogEntry, 
  OutreachCandidate,
  IntegrationServiceConfig,
  ApplicationStage,
  SchemeId
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  SCHOLARSHIP_SCHEMES, 
  INITIAL_APPLICATION, 
  INITIAL_DIGILOCKER_DOCS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_OUTREACH_CANDIDATES,
  INITIAL_INTEGRATION_CONFIG 
} from '../mock/initialData';
import { AuditService } from '../services/auditService';
import { IntegrationGateway } from '../services/integrationGateway';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnboarded: boolean;
  setIsOnboarded: (val: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;

  // Core Data
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  schemes: ScholarshipScheme[];
  applications: ScholarshipApplication[];
  digiLockerDocs: DigiLockerDoc[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  auditLogs: AuditLogEntry[];
  outreachCandidates: OutreachCandidate[];
  integrationConfig: IntegrationServiceConfig;
  updateIntegrationConfig: (key: keyof IntegrationServiceConfig, status: any) => void;

  // Actions & Workflows
  importDigiLockerDoc: (docId: string, silent?: boolean) => Promise<boolean>;
  importBatchDigiLockerDocs: (docIds: string[], silent?: boolean) => Promise<boolean>;
  submitApplication: (schemeId: SchemeId, academicYear: string) => Promise<ScholarshipApplication>;
  advanceApplicationStage: (appId: string, nextStage: ApplicationStage, officerName: string, remarks?: string) => void;
  resolveDeficiency: (appId: string, deficiencyId: string, resolutionNote: string) => void;
  requestManualReview: (appId: string, deficiencyId: string, reason: string) => void;
  
  // Modals & Drawers
  isJagoOpen: boolean;
  setIsJagoOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendUserChatMessage: (text: string) => void;
  selectedSchemeForDetail: ScholarshipScheme | null;
  setSelectedSchemeForDetail: (scheme: ScholarshipScheme | null) => void;
  isApplyWizardOpen: boolean;
  setIsApplyWizardOpen: (open: boolean) => void;
  applyingSchemeId: SchemeId | null;
  setApplyingSchemeId: (id: SchemeId | null) => void;
  isDigiLockerModalOpen: boolean;
  setIsDigiLockerModalOpen: (open: boolean) => void;
  isSimulatorModalOpen: boolean;
  setIsSimulatorModalOpen: (open: boolean) => void;
  isOutreachModalOpen: boolean;
  setIsOutreachModalOpen: (open: boolean) => void;
  isAuditModalOpen: boolean;
  setIsAuditModalOpen: (open: boolean) => void;
  isOfficerDrawerOpen: boolean;
  setIsOfficerDrawerOpen: (open: boolean) => void;
  isJudgeControlsModalOpen: boolean;
  setIsJudgeControlsModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithAadhaar: (aadhaar: string) => Promise<void>;
  loginWithDigiLocker: () => Promise<void>;
  signupScholar: (scholarData?: Partial<StudentProfile>) => Promise<void>;
  logout: () => void;

  // Demo Fast-Forward
  fastForwardPipeline: (targetStage: ApplicationStage) => void;
  resetAllDemoData: () => void;

  // Toast
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'JAGO_SCHOLAR_MOBILE_STATE_V4';

const loadPersistedState = () => {
  try {
    // Clear all legacy state keys so latest 7/7 verified certificates load fresh on web
    ['JAGO_SCHOLAR_MOBILE_STATE_V1', 'JAGO_SCHOLAR_MOBILE_STATE_V2', 'JAGO_SCHOLAR_MOBILE_STATE_V3'].forEach(k => {
      if (localStorage.getItem(k)) localStorage.removeItem(k);
    });
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not load persisted state from localStorage', err);
  }
  return null;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedState = loadPersistedState();

  const [currentRole, setCurrentRole] = useState<UserRole>(savedState?.currentRole || 'student');
  const [activeTab, setActiveTab] = useState<AppTab>(savedState?.activeTab || 'home');
  const [language, setLanguage] = useState<Language>(savedState?.language || 'en');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(savedState?.isOnboarded ?? true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(savedState?.isAuthenticated ?? false);

  // Core Data
  const [profile, setProfile] = useState<StudentProfile>(savedState?.profile || INITIAL_STUDENT_PROFILE);
  const [schemes] = useState<ScholarshipScheme[]>(SCHOLARSHIP_SCHEMES);
  const [applications, setApplications] = useState<ScholarshipApplication[]>(savedState?.applications !== undefined ? savedState.applications : []);
  const [digiLockerDocs, setDigiLockerDocs] = useState<DigiLockerDoc[]>(() => {
    if (savedState?.digiLockerDocs && savedState.digiLockerDocs.length >= 7) {
      return savedState.digiLockerDocs;
    }
    return INITIAL_DIGILOCKER_DOCS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(savedState?.notifications || INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (savedState?.auditLogs) {
      AuditService.setLogs(savedState.auditLogs);
      return savedState.auditLogs;
    }
    return INITIAL_AUDIT_LOGS;
  });
  const [outreachCandidates] = useState<OutreachCandidate[]>(INITIAL_OUTREACH_CANDIDATES);
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationServiceConfig>(savedState?.integrationConfig || INITIAL_INTEGRATION_CONFIG);

  // Drawers & Modals
  const [isJagoOpen, setIsJagoOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(savedState?.chatMessages || [
    {
      id: 'welcome-1',
      sender: 'jago',
      text: 'Namaste Rahul! 🙏 I am JAGO, your unified MoTA scholarship assistant. You can ask me anything about your Post-Matric application, DigiLocker verification, or DBT payment status.',
      textHi: 'नमस्ते राहुल! 🙏 मैं जागो (JAGO) हूँ। आप मुझसे पोस्ट-मैट्रिक आवेदन, डिजिलॉकर सत्यापन, या डीबीटी भुगतान के बारे में कुछ भी पूछ सकते हैं।',
      timestamp: 'Just now',
      quickActions: [
        { label: 'Where is my application?', labelHi: 'मेरा आवेदन कहाँ है?', actionType: 'navigate_tab', payload: 'applications' },
        { label: 'Am I eligible for Post-Matric?', labelHi: 'क्या मैं पात्र हूँ?', actionType: 'check_eligibility', payload: 'post_matric' },
        { label: 'Connect DigiLocker', labelHi: 'डिजिलॉकर कनेक्ट करें', actionType: 'navigate_tab', payload: 'documents' }
      ]
    }
  ]);

  const [selectedSchemeForDetail, setSelectedSchemeForDetail] = useState<ScholarshipScheme | null>(null);
  const [isApplyWizardOpen, setIsApplyWizardOpen] = useState<boolean>(false);
  const [applyingSchemeId, setApplyingSchemeId] = useState<SchemeId | null>(null);
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState<boolean>(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState<boolean>(false);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isOfficerDrawerOpen, setIsOfficerDrawerOpen] = useState<boolean>(false);
  const [isJudgeControlsModalOpen, setIsJudgeControlsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Auto-Persist state changes to localStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        currentRole,
        activeTab,
        language,
        isOnboarded,
        isAuthenticated,
        profile,
        applications,
        digiLockerDocs,
        notifications,
        auditLogs,
        integrationConfig,
        chatMessages
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (err) {
      console.warn('Could not save state to localStorage', err);
    }
  }, [
    currentRole,
    activeTab,
    language,
    isOnboarded,
    isAuthenticated,
    profile,
    applications,
    digiLockerDocs,
    notifications,
    auditLogs,
    integrationConfig,
    chatMessages
  ]);

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(curr => curr.filter(t => t.id !== id));
    }, 1000); // 1-second auto dismiss
  };

  const loginWithAadhaar = async (aadhaarNum: string) => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
    setIsAuthModalOpen(false);

    // Audit Log
    AuditService.logAction({
      actor: profile.name,
      role: 'Student (Aadhaar)',
      action: 'UIDAI e-KYC Verification',
      targetId: `Aadhaar-XXXX-XXXX-${aadhaarNum.slice(-4) || '8921'}`,
      oldState: 'Unverified',
      newState: 'Verified'
    });

    showToast({
      type: 'success',
      title: 'Aadhaar e-KYC Verified',
      message: `Welcome ${profile.name}! Unified student profile loaded via UIDAI gateway.`
    });
  };

  const loginWithDigiLocker = async () => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
    setIsAuthModalOpen(false);

    // Automatically sync Income, Caste, Aadhaar certificates and update profile to 100% verified baseline
    setProfile(prev => ({
      ...prev,
      profileCompletionPercentage: 100,
      social: {
        ...prev.social,
        category: 'ST',
        tribeCommunity: prev.social.tribeCommunity || 'Santhal',
        verificationStatus: 'verified',
        stCertificateNo: prev.social.stCertificateNo || 'JH-CST-2024-88491'
      },
      academic: {
        ...prev.academic,
        academicVerificationStatus: 'verified'
      },
      family: {
        ...prev.family,
        annualIncome: prev.family.annualIncome || 180000,
        incomeVerificationStatus: 'verified',
        incomeCertificateNo: 'JH-INC-2025-41098',
        discrepancyNote: undefined
      },
      bank: {
        ...prev.bank,
        isDbtEnabled: true,
        verificationStatus: 'verified'
      }
    }));

    setDigiLockerDocs(prev => prev.map(doc => ({
      ...doc,
      isImported: true,
      verificationStatus: 'verified',
      isLinked: true
    })));

    // Audit Log
    AuditService.logAction({
      actor: profile.name,
      role: 'Student (DigiLocker)',
      action: 'DigiLocker OAuth2 Sync & Depository Ingestion',
      targetId: 'DigiLocker-Vault',
      oldState: 'Unverified / Partial',
      newState: '100% Verified Profile'
    });

    showToast({
      type: 'success',
      title: 'DigiLocker Authentication Successful',
      message: 'DigiLocker depository synced! Profile achieved 100% verified baseline.'
    });
  };

  const signupScholar = async (scholarData?: Partial<StudentProfile>) => {
    if (scholarData) {
      setProfile(prev => ({
        ...prev,
        ...scholarData
      }));
    }
    setIsAuthenticated(true);
    setIsOnboarded(true);
    setIsAuthModalOpen(false);

    // Audit Log
    AuditService.logAction({
      actor: (scholarData?.name || profile.name),
      role: 'Student (Signup)',
      action: 'Citizen Registration / OTR Created',
      targetId: 'Student-Profile',
      oldState: 'Unregistered',
      newState: 'Registered (e-KYC Verified)'
    });

    showToast({
      type: 'success',
      title: 'Account Created Successfully',
      message: `Welcome ${(scholarData?.name || profile.name)}! Your unified MoTA profile is ready.`
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAuthModalOpen(false);
    setActiveTab('home');

    // Audit Log
    AuditService.logAction({
      actor: profile.name,
      role: 'Student',
      action: 'User Logout',
      targetId: 'Session',
      oldState: 'Authenticated',
      newState: 'Logged Out'
    });

    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely signed out. Please login to continue.'
    });
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated };
      // Recalculate completion
      let score = 0;
      if (next.social.verificationStatus === 'verified') score += 20;
      if (next.family.incomeVerificationStatus === 'verified') score += 20;
      if (next.academic.academicVerificationStatus === 'verified') score += 20;
      if (next.bank.verificationStatus === 'verified') score += 20;
      if (next.aadhaarMasked) score += 20;
      next.profileCompletionPercentage = score;
      return next;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const updateIntegrationConfig = (key: keyof IntegrationServiceConfig, status: any) => {
    IntegrationGateway.setStatus(key, status);
    setIntegrationConfig(prev => ({ ...prev, [key]: status }));
    showToast({
      type: 'info',
      title: 'Integration Simulator Updated',
      message: `${key.toUpperCase()} adapter simulated status set to ${status}.`
    });
  };

  // DigiLocker Import Flow
  const importDigiLockerDoc = async (docId: string, silent: boolean = false): Promise<boolean> => {
    const res = await IntegrationGateway.executeMockCall('digiLocker', 'DigiLocker Document Sync', true, 0);
    
    if (!res.success) {
      if (!silent) {
        showToast({
          type: 'error',
          title: 'DigiLocker Sync Error',
          message: res.error || 'Failed to retrieve signed certificate from DigiLocker repository.'
        });
      }
      return false;
    }

    setDigiLockerDocs(prev => prev.map(d => d.id === docId ? { ...d, isImported: true, verificationStatus: 'verified' } : d));
    
    // If it's income doc, update profile income status
    const doc = digiLockerDocs.find(d => d.id === docId);
    if (doc?.category === 'income') {
      updateProfile({
        family: {
          ...profile.family,
          incomeVerificationStatus: 'verified',
          discrepancyNote: undefined
        }
      });
    }

    AuditService.logAction({
      actor: 'Rahul Kumar (Student)',
      role: 'Student Applicant',
      action: `Imported & Verified ${doc?.name || 'Document'} via DigiLocker Gateway`,
      targetId: docId,
      oldState: 'unverified',
      newState: 'verified'
    });
    setAuditLogs(AuditService.getLogs());

    if (!silent) {
      showToast({
        type: 'success',
        title: 'Document Verified via DigiLocker',
        message: `${doc?.name} successfully imported & digitally verified (100% reusable).`
      });
    }

    return true;
  };

  // Batch DigiLocker Import Flow for individual/multiple selected checkboxes
  const importBatchDigiLockerDocs = async (docIds: string[], silent: boolean = false): Promise<boolean> => {
    if (!docIds || docIds.length === 0) return true;

    const res = await IntegrationGateway.executeMockCall('digiLocker', 'DigiLocker Bulk Sync', true, 0);
    if (!res.success) {
      if (!silent) {
        showToast({
          type: 'error',
          title: 'DigiLocker Sync Error',
          message: res.error || 'Failed to retrieve signed certificates from DigiLocker.'
        });
      }
      return false;
    }

    setDigiLockerDocs(prev => prev.map(d => docIds.includes(d.id) ? { ...d, isImported: true, verificationStatus: 'verified' } : d));

    const includesIncome = digiLockerDocs.some(d => docIds.includes(d.id) && d.category === 'income');
    if (includesIncome) {
      updateProfile({
        family: {
          ...profile.family,
          incomeVerificationStatus: 'verified',
          discrepancyNote: undefined
        }
      });
    }

    AuditService.logAction({
      actor: 'Rahul Kumar (Student)',
      role: 'Student Applicant',
      action: `Imported & Verified ${docIds.length} Certificate(s) via DigiLocker Gateway`,
      targetId: docIds.join(','),
      oldState: 'unverified',
      newState: 'verified'
    });
    setAuditLogs(AuditService.getLogs());

    if (!silent) {
      showToast({
        type: 'success',
        title: 'Certificates Added to Wallet',
        message: `${docIds.length} official document(s) digitally fetched and added to your wallet.`
      });
    }

    return true;
  };

  // Submit Application
  const submitApplication = async (schemeId: SchemeId, academicYear: string): Promise<ScholarshipApplication> => {
    const scheme = schemes.find(s => s.id === schemeId)!;
    const newAppId = `APP-MOTA-2026-00${Math.floor(Math.random() * 899 + 100)}`;
    const newAppNo = `JH2026MOTA${scheme.code.replace(/[^A-Z]/g, '')}${Math.floor(Math.random() * 899 + 100)}`;

    const newApp: ScholarshipApplication = {
      id: newAppId,
      applicationNo: newAppNo,
      schemeId,
      schemeName: scheme.name,
      submittedAt: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      currentStage: 'submitted',
      academicYear,
      course: `${profile.academic.courseName} (${profile.academic.currentYear})`,
      sanctionAmount: schemeId === 'post_matric' ? 38500 : schemeId === 'top_class' ? 145000 : schemeId === 'nfst' ? 444000 : 7500,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          stage: 'submitted',
          title: 'Application Submitted',
          description: 'Single-entry profile verified and submitted via JAGO Scholar mobile gateway.',
          timestamp: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          actor: 'Rahul Kumar (Student)',
          completed: true,
          isCurrent: true
        },
        {
          id: `t-${Date.now()}-2`,
          stage: 'institution_verified',
          title: 'Institution Nodal Verification',
          description: 'Pending verification of academic records & attendance by college nodal officer.',
          timestamp: 'Pending',
          actor: `${profile.academic.institutionName} Nodal Officer`,
          completed: false,
          isCurrent: false
        },
        {
          id: `t-${Date.now()}-3`,
          stage: 'department_verified',
          title: 'Department Verification (MoTA/State DWO)',
          description: 'Verification of ST status & revenue certificates by District Welfare Officer.',
          timestamp: 'Pending',
          actor: `District Welfare Officer, ${profile.address.district}`,
          completed: false,
          isCurrent: false
        },
        {
          id: `t-${Date.now()}-4`,
          stage: 'sanctioned',
          title: 'Sanction Order Generation',
          description: 'Ministry of Tribal Affairs sanction order issuance.',
          timestamp: 'Pending',
          actor: 'MoTA Scholarship Division',
          completed: false,
          isCurrent: false
        },
        {
          id: `t-${Date.now()}-5`,
          stage: 'payment_processing',
          title: 'PFMS Payment Processing',
          description: 'Payment advice transmitted to PFMS bank gateway.',
          timestamp: 'Pending',
          actor: 'PFMS Payment Gateway',
          completed: false,
          isCurrent: false
        },
        {
          id: `t-${Date.now()}-6`,
          stage: 'dbt_credited',
          title: 'Direct Benefit Transfer (DBT) Credited',
          description: `Direct credit to ${profile.bank.bankName} account (${profile.bank.accountNoMasked}).`,
          timestamp: 'Pending',
          actor: 'Aadhaar Payment Bridge System (APBS)',
          completed: false,
          isCurrent: false
        }
      ],
      attachedDocuments: [
        { docId: 'DOC-ST-01', name: 'ST Caste Certificate', type: 'caste', verified: true },
        { docId: 'DOC-INC-01', name: 'Annual Income Certificate', type: 'income', verified: true },
        { docId: 'DOC-ACAD-01', name: 'Academic Marksheet / APAAR Record', type: 'academic', verified: true },
        { docId: 'DOC-BANK-01', name: 'DBT Active Bank Mandate', type: 'bank', verified: true }
      ],
      deficiencies: [],
      dbtDetails: {
        pfmsTxnId: `PFMS-2026-JH-${Math.floor(Math.random() * 899999 + 100000)}`,
        disbursedDate: 'Pending',
        amount: schemeId === 'post_matric' ? 38500 : 145000,
        bankName: profile.bank.bankName,
        maskedAcc: profile.bank.accountNoMasked,
        utrNumber: `SBIN202608${Math.floor(Math.random() * 899999 + 100000)}`,
        status: 'Pending'
      }
    };

    setApplications(prev => [newApp, ...prev.filter(a => a.schemeId !== schemeId)]);

    AuditService.logAction({
      actor: 'Rahul Kumar (Student)',
      role: 'Student Applicant',
      action: `Submitted Application for ${scheme.name}`,
      targetId: newAppId,
      oldState: 'none',
      newState: 'submitted'
    });
    setAuditLogs(AuditService.getLogs());

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'system',
      title: 'Application Submitted Successfully',
      titleHi: 'आवेदन सफलतापूर्वक जमा किया गया',
      message: `Your application for ${scheme.name} (No: ${newAppNo}) has been submitted for institution review.`,
      messageHi: `आपका ${scheme.name} आवेदन जमा हो गया है।`,
      timestamp: 'Just now',
      isRead: false,
      actionUrlTab: 'applications'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast({
      type: 'success',
      title: 'Application Submitted!',
      message: `Application No ${newAppNo} created. Reused 4 verified profile documents.`
    });

    return newApp;
  };

  // Advance stage
  const advanceApplicationStage = (appId: string, nextStage: ApplicationStage, officerName: string, remarks?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      const stageOrder: ApplicationStage[] = ['submitted', 'institution_verified', 'department_verified', 'sanctioned', 'payment_processing', 'dbt_credited'];
      const targetIndex = stageOrder.indexOf(nextStage);

      const updatedTimeline = app.timeline.map((event) => {
        const eventIndex = stageOrder.indexOf(event.stage);
        if (eventIndex < targetIndex) {
          return { ...event, completed: true, isCurrent: false };
        } else if (eventIndex === targetIndex) {
          return { 
            ...event, 
            completed: true, 
            isCurrent: true, 
            timestamp: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: officerName,
            remarks: remarks || event.remarks
          };
        } else {
          return { ...event, completed: false, isCurrent: false };
        }
      });

      const updatedDbt = { ...app.dbtDetails };
      if (nextStage === 'dbt_credited' && updatedDbt) {
        updatedDbt.status = 'Credited';
        updatedDbt.disbursedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (nextStage === 'payment_processing' && updatedDbt) {
        updatedDbt.status = 'Initiated';
      }

      return {
        ...app,
        currentStage: nextStage,
        timeline: updatedTimeline,
        dbtDetails: updatedDbt as any
      };
    }));

    AuditService.logAction({
      actor: officerName,
      role: 'Verification Officer / System',
      action: `Moved application status to ${nextStage}`,
      targetId: appId,
      oldState: 'previous',
      newState: nextStage
    });
    setAuditLogs(AuditService.getLogs());

    showToast({
      type: 'info',
      title: 'Application Status Updated',
      message: `Status transitioned to ${nextStage.replace('_', ' ').toUpperCase()}.`
    });
  };

  // Resolve deficiency
  const resolveDeficiency = (appId: string, deficiencyId: string, resolutionNote: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        currentStage: 'institution_verified',
        deficiencies: app.deficiencies.map(d => d.id === deficiencyId ? { ...d, status: 'resolved' as const } : d)
      };
    }));

    AuditService.logAction({
      actor: 'Rahul Kumar (Student)',
      role: 'Student Applicant',
      action: `Resolved Deficiency with Note: ${resolutionNote}`,
      targetId: appId,
      oldState: 'deficiency_flagged',
      newState: 'institution_verified'
    });
    setAuditLogs(AuditService.getLogs());

    showToast({
      type: 'success',
      title: 'Deficiency Resolved',
      message: 'Updated document attached. Application re-queued for department verification.'
    });
  };

  // Request manual review
  const requestManualReview = (appId: string, deficiencyId: string, reason: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        deficiencies: app.deficiencies.map(d => d.id === deficiencyId ? { ...d, status: 'under_manual_review' as const } : d)
      };
    }));

    AuditService.logAction({
      actor: 'Rahul Kumar (Student)',
      role: 'Student Applicant',
      action: `Requested Manual Officer Review: ${reason}`,
      targetId: appId,
      oldState: 'deficiency_flagged',
      newState: 'manual_review_queue'
    });
    setAuditLogs(AuditService.getLogs());

    showToast({
      type: 'info',
      title: 'Manual Review Requested',
      message: 'Your case has been escalated to the Nodal Grievance Committee for human review.'
    });
  };

  // Chat message send
  const sendUserChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Dynamic AI response
    setTimeout(async () => {
      const { JagoAiService } = await import('../services/jagoAiService');
      const botResponse = JagoAiService.processUserMessage(text, profile, applications, schemes, digiLockerDocs, language);
      setChatMessages(prev => [...prev, botResponse]);
    }, 450);
  };

  // Fast forward demo pipeline
  const fastForwardPipeline = (targetStage: ApplicationStage) => {
    const postMatric = applications.find(a => a.schemeId === 'post_matric');
    if (postMatric) {
      advanceApplicationStage(postMatric.id, targetStage, 'SIH Demo Simulator', 'Fast-forward simulation');
    } else {
      // If student hasn't applied yet, create application first and then advance
      const newApp: ScholarshipApplication = {
        ...INITIAL_APPLICATION,
        id: `APP-MOTA-${Date.now().toString().slice(-5)}`,
        currentStage: targetStage,
        timeline: [
          {
            id: `t-${Date.now()}-1`,
            stage: 'submitted',
            title: 'Application Submitted',
            description: 'Single-entry profile verified and submitted via JAGO Scholar mobile gateway.',
            timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: `${profile.name} (Student)`,
            completed: true,
            isCurrent: targetStage === 'submitted'
          }
        ]
      };
      setApplications(prev => [newApp, ...prev]);
    }
  };

  // Reset demo
  const resetAllDemoData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
    setProfile(INITIAL_STUDENT_PROFILE);
    setApplications([]);
    setDigiLockerDocs(INITIAL_DIGILOCKER_DOCS);
    setNotifications(INITIAL_NOTIFICATIONS);
    AuditService.reset();
    setAuditLogs(AuditService.getLogs());
    IntegrationGateway.resetAllToSuccess();
    setIntegrationConfig(INITIAL_INTEGRATION_CONFIG);
    setCurrentRole('student');
    setActiveTab('home');
    setIsAuthenticated(false);

    showToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All application state, documents, and audit logs restored to pristine SIH demo baseline.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        isOnboarded,
        setIsOnboarded,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        updateProfile,
        schemes,
        applications,
        digiLockerDocs,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        auditLogs,
        outreachCandidates,
        integrationConfig,
        updateIntegrationConfig,
        importDigiLockerDoc,
        importBatchDigiLockerDocs,
        submitApplication,
        advanceApplicationStage,
        resolveDeficiency,
        requestManualReview,
        isJagoOpen,
        setIsJagoOpen,
        chatMessages,
        sendUserChatMessage,
        selectedSchemeForDetail,
        setSelectedSchemeForDetail,
        isApplyWizardOpen,
        setIsApplyWizardOpen,
        applyingSchemeId,
        setApplyingSchemeId,
        isDigiLockerModalOpen,
        setIsDigiLockerModalOpen,
        isSimulatorModalOpen,
        setIsSimulatorModalOpen,
        isOutreachModalOpen,
        setIsOutreachModalOpen,
        isAuditModalOpen,
        setIsAuditModalOpen,
        isOfficerDrawerOpen,
        setIsOfficerDrawerOpen,
        isJudgeControlsModalOpen,
        setIsJudgeControlsModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithAadhaar,
        loginWithDigiLocker,
        signupScholar,
        logout,
        fastForwardPipeline,
        resetAllDemoData,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
