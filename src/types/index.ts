export type UserRole = 'student' | 'institution_officer' | 'ministry_admin';

export type Language = 'en' | 'hi';

export type AppTab = 'home' | 'scholarships' | 'applications' | 'documents' | 'profile';

export type VerificationState = 'verified' | 'pending' | 'needs_attention' | 'failed' | 'manual_review';

export interface StudentProfile {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  aadhaarMasked: string;
  address: {
    street: string;
    villageTown: string;
    district: string;
    state: string;
    pincode: string;
  };
  social: {
    category: 'ST';
    tribeCommunity: string;
    isPvtg: boolean; // Particularly Vulnerable Tribal Group
    stCertificateNo: string;
    issuingAuthority: string;
    issueDate: string;
    verificationStatus: VerificationState;
    verificationSource?: string;
  };
  family: {
    fatherName: string;
    motherName: string;
    guardianOccupation: string;
    annualIncome: number;
    incomeCertificateNo: string;
    incomeCertValidity: string;
    incomeVerificationStatus: VerificationState;
    discrepancyNote?: string;
  };
  academic: {
    apaarId: string;
    udiseCode: string;
    aisheCode: string;
    currentLevel: 'Secondary (9-10)' | 'Higher Secondary (11-12)' | 'Undergraduate' | 'Postgraduate' | 'M.Phil / Ph.D' | 'Overseas Master/Ph.D';
    courseName: string;
    currentYear: string;
    institutionName: string;
    institutionType: 'Government' | 'Govt-Aided' | 'Autonomous / IIT / NIT / AIIMS' | 'Private Recognized';
    enrollmentNo: string;
    previousScorePercent: number;
    academicVerificationStatus: VerificationState;
  };
  bank: {
    accountHolder: string;
    bankName: string;
    accountNoMasked: string;
    ifsc: string;
    isDbtEnabled: boolean;
    verificationStatus: VerificationState;
  };
  profileCompletionPercentage: number;
}

export type SchemeId = 'pre_matric' | 'post_matric' | 'top_class' | 'nfst' | 'nos';

export interface ScholarshipScheme {
  id: SchemeId;
  code: string;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  description: string;
  descriptionHi: string;
  targetStudents: string;
  educationLevel: string;
  maxIncomeThreshold: number; // in INR
  financialBenefit: string;
  deadline: string;
  portalSource: 'NSP' | 'SFMP' | 'NOS Portal';
  requiredDocs: string[];
  keyHighlights: string[];
}

export interface EligibilityEvaluation {
  schemeId: SchemeId;
  status: 'eligible' | 'potentially_eligible' | 'not_eligible' | 'missing_info' | 'manual_review';
  summary: string;
  summaryHi: string;
  criteriaChecks: {
    label: string;
    labelHi: string;
    passed: boolean;
    status: 'pass' | 'fail' | 'pending' | 'warning';
    reason: string;
  }[];
  missingRequirements: string[];
  canApply: boolean;
}

export type ApplicationStage = 
  | 'submitted'
  | 'institution_verified'
  | 'department_verified'
  | 'sanctioned'
  | 'payment_processing'
  | 'dbt_credited'
  | 'deficiency_flagged'
  | 'rejected';

export interface TimelineEvent {
  id: string;
  stage: ApplicationStage;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  completed: boolean;
  isCurrent: boolean;
  remarks?: string;
}

export interface ScholarshipApplication {
  id: string;
  applicationNo: string;
  schemeId: SchemeId;
  schemeName: string;
  submittedAt: string;
  currentStage: ApplicationStage;
  academicYear: string;
  course: string;
  sanctionAmount: number;
  timeline: TimelineEvent[];
  attachedDocuments: {
    docId: string;
    name: string;
    type: string;
    verified: boolean;
  }[];
  deficiencies: Deficiency[];
  dbtDetails?: {
    pfmsTxnId: string;
    disbursedDate: string;
    amount: number;
    bankName: string;
    maskedAcc: string;
    utrNumber: string;
    status: 'Credited' | 'Initiated' | 'Pending';
  };
}

export interface Deficiency {
  id: string;
  applicationId: string;
  field: string;
  issue: string;
  issueHi: string;
  explanation: string;
  recommendedAction: string;
  status: 'open' | 'resolved' | 'under_manual_review';
  createdDate: string;
}

export interface DigiLockerDoc {
  id: string;
  name: string;
  category: 'identity' | 'caste' | 'income' | 'academic' | 'bank';
  source: string;
  docNumber: string;
  issuedDate: string;
  verificationStatus: VerificationState;
  isImported: boolean;
  fileSize: string;
  issuerOrg: string;
  previewSnippet: Record<string, string>;
}

export interface NotificationItem {
  id: string;
  type: 'action_required' | 'verification' | 'disbursement' | 'recommendation' | 'system';
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  isRead: boolean;
  actionUrlTab?: string;
  actionPayload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  textHi?: string;
  timestamp: string;
  quickActions?: {
    label: string;
    labelHi: string;
    actionType: 'navigate_tab' | 'open_scheme' | 'resolve_deficiency' | 'check_eligibility';
    payload?: string;
  }[];
  contextCard?: {
    title: string;
    statusBadge: string;
    details: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetId: string;
  oldState: string;
  newState: string;
  ipAddress: string;
}

export interface OutreachCandidate {
  id: string;
  studentName: string;
  apaarId: string;
  institution: string;
  district: string;
  state: string;
  level: string;
  eligibleScheme: string;
  status: 'identified' | 'sms_sent' | 'counseling_assigned' | 'applied';
  unregisteredReason: string;
}

export type IntegrationStatus = 'SUCCESS' | 'PENDING' | 'MISMATCH' | 'TIMEOUT' | 'UNAVAILABLE';

export interface IntegrationServiceConfig {
  digiLocker: IntegrationStatus;
  nsp: IntegrationStatus;
  sfmp: IntegrationStatus;
  nos: IntegrationStatus;
  udise: IntegrationStatus;
  apaar: IntegrationStatus;
  pfmsDbt: IntegrationStatus;
  incomeAuthority: IntegrationStatus;
}
