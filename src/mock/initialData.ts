import { 
  StudentProfile, 
  ScholarshipScheme, 
  ScholarshipApplication, 
  DigiLockerDoc, 
  NotificationItem, 
  AuditLogEntry, 
  OutreachCandidate,
  IntegrationServiceConfig 
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'STU-2026-JH-8832',
  name: 'Rahul Kumar',
  dob: '2004-06-14',
  gender: 'Male',
  mobile: '+91 98765 43210',
  email: 'rahul.k.st@tribaledu.gov.in',
  aadhaarMasked: 'XXXX-XXXX-8921',
  address: {
    street: 'Plot 42, Birsa Munda Nagar',
    villageTown: 'Namkum, Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834010'
  },
  social: {
    category: 'ST',
    tribeCommunity: 'Santhal',
    isPvtg: false,
    stCertificateNo: 'JH-ST-2023-99412',
    issuingAuthority: 'Sub-Divisional Officer (SDO) Sadar, Ranchi',
    issueDate: '2023-04-12',
    verificationStatus: 'verified',
    verificationSource: 'Jharkhand e-District Portal (JharSewa)'
  },
  family: {
    fatherName: 'Mangal Kumar',
    motherName: 'Sunita Devi',
    guardianOccupation: 'Agriculture & Small Cultivation',
    annualIncome: 180000, // 1.8 Lakhs
    incomeCertificateNo: 'JH-INC-2025-41098',
    incomeCertValidity: '2026-03-31',
    incomeVerificationStatus: 'pending', // Pending for DigiLocker sync demo!
    discrepancyNote: 'Certificate pending digital signature validation via DigiLocker.'
  },
  academic: {
    apaarId: '9842-1102-4912',
    udiseCode: '20150400102',
    aisheCode: 'C-42190',
    currentLevel: 'Undergraduate',
    courseName: 'B.Tech in Computer Science & Engineering',
    currentYear: '2nd Year (Semester IV)',
    institutionName: 'Birsa Institute of Tribal Technology, Ranchi',
    institutionType: 'Government',
    enrollmentNo: 'BITT/2024/CSE/084',
    previousScorePercent: 78.4,
    academicVerificationStatus: 'verified'
  },
  bank: {
    accountHolder: 'Rahul Kumar',
    bankName: 'State Bank of India (SBI)',
    accountNoMasked: '••••••••8142',
    ifsc: 'SBIN0001234',
    isDbtEnabled: true,
    verificationStatus: 'verified'
  },
  profileCompletionPercentage: 82
};

export const SCHOLARSHIP_SCHEMES: ScholarshipScheme[] = [
  {
    id: 'post_matric',
    code: 'MOTA-PMS-ST',
    name: 'Post-Matric Scholarship for ST Students',
    nameHi: 'एसटी छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    tagline: 'Comprehensive financial support for Class 11 to Post-Graduate ST scholars',
    taglineHi: 'कक्षा 11 से स्नातकोत्तर एसटी विद्वानों के लिए वित्तीय सहायता',
    description: 'Centrally sponsored scheme providing financial support to ST students studying at post-matriculation or post-secondary stages including ITI, Diploma, Undergraduate, Postgraduate, and Professional degrees.',
    descriptionHi: 'कक्षा 11, डिप्लोमा, स्नातक, स्नातकोत्तर और व्यावसायिक डिग्री प्राप्त करने वाले एसटी छात्रों को शिक्षण शुल्क और भरण-पोषण भत्ता।',
    targetStudents: 'ST students in Class 11, 12, ITI, Degree, B.Tech, MBBS, PG Courses',
    educationLevel: 'Post-Matriculation (11th to PG)',
    maxIncomeThreshold: 250000, // ₹2.5 Lakhs
    financialBenefit: '100% Compulsory Tuition Fee + Up to ₹13,500/yr Maintenance Allowance',
    deadline: '31 Oct 2026',
    portalSource: 'NSP',
    requiredDocs: ['ST Caste Certificate', 'Income Certificate (≤ ₹2.5L)', 'Previous Marksheet', 'Bonafide Student Certificate', 'DBT Linked Bank Passbook'],
    keyHighlights: [
      'Direct DBT credit into Aadhaar-seeded bank account',
      'Covers day scholars and hostellers with differential allowance',
      'Automatic renewal upon academic promotion'
    ]
  },
  {
    id: 'top_class',
    code: 'MOTA-TCES',
    name: 'National Scholarship for Higher Education (Top Class Education)',
    nameHi: 'उच्च शिक्षा के लिए राष्ट्रीय छात्रवृत्ति (टॉप क्लास एजुकेशन)',
    tagline: 'Full funding for ST students admitted to premier institutes (IITs, IIMs, NITs, AIIMS)',
    taglineHi: 'शीर्ष संस्थानों (IIT, IIM, NIT, AIIMS) में प्रवेश पाने वाले एसटी छात्रों के लिए पूर्ण शुल्क',
    description: 'Encourages meritorious ST students to pursue quality education in 250+ notified premier government institutes across India including IITs, IIMs, NITs, NLUs, and premier medical colleges.',
    descriptionHi: 'आईआईटी, आईआईएम, एनआईटी, एम्स जैसे 250+ अधिसूचित संस्थानों में एसटी छात्रों के लिए पूर्ण शिक्षण शुल्क और जीवन यापन खर्च।',
    targetStudents: 'ST students admitted to MoTA-notified top 250+ institutions',
    educationLevel: 'Degree / PG in Premier Institutes',
    maxIncomeThreshold: 800000, // ₹8.0 Lakhs
    financialBenefit: 'Full Tuition Fee + Living Expenses (₹3,000/mo) + Books (₹5,000/yr) + Computer Grant (₹45,000)',
    deadline: '15 Nov 2026',
    portalSource: 'SFMP',
    requiredDocs: ['ST Certificate', 'Income Certificate (≤ ₹8.0L)', 'Admission Letter to Premier Institute', 'Fee Structure Receipt'],
    keyHighlights: [
      'No cap on actual tuition fees for Government institutions',
      'One-time computer/laptop allowance of ₹45,000',
      'Covers 1,000 fresh scholars annually'
    ]
  },
  {
    id: 'nfst',
    code: 'MOTA-NFST',
    name: 'National Fellowship for ST Students (NFST)',
    nameHi: 'एसटी छात्रों के लिए राष्ट्रीय फैलोशिप (एनएफएसटी)',
    tagline: 'Research fellowship for ST candidates pursuing M.Phil and Ph.D. degrees',
    taglineHi: 'एम.फिल और पीएचडी शोधार्थियों के लिए मासिक फैलोशिप और आकस्मिक अनुदान',
    description: 'Provides financial assistance to Scheduled Tribe candidates who have cleared UGC-NET/CSIR-NET and registered for regular and full-time M.Phil/Ph.D. courses in Humanities, Sciences, and Engineering.',
    descriptionHi: 'मानविकी, विज्ञान और इंजीनियरिंग में नियमित एम.फिल/पीएचडी करने वाले एसटी उम्मीदवारों को वित्तीय सहायता।',
    targetStudents: 'ST scholars registered for regular M.Phil / Ph.D.',
    educationLevel: 'Doctoral / Research (M.Phil / Ph.D)',
    maxIncomeThreshold: 999999999, // No income bar
    financialBenefit: 'JRF: ₹37,000/mo | SRF: ₹42,000/mo + HRA + Contingency ₹25,000/yr',
    deadline: '30 Dec 2026',
    portalSource: 'SFMP',
    requiredDocs: ['ST Certificate', 'UGC/CSIR NET Scorecard', 'Ph.D. Registration Certificate', 'Research Supervisor Verification'],
    keyHighlights: [
      '750 fresh fellowships awarded every year',
      'Tenure of 5 years for integrated Ph.D. programs',
      'Special allocation for Women and PVTG researchers'
    ]
  },
  {
    id: 'nos',
    code: 'MOTA-NOS-ST',
    name: 'National Overseas Scholarship for ST Students (NOS)',
    nameHi: 'एसटी छात्रों के लिए राष्ट्रीय विदेशी छात्रवृत्ति (एनओएस)',
    tagline: 'Study abroad scholarship for Masters and Ph.D. in top 500 QS ranked universities',
    taglineHi: 'शीर्ष 500 विश्व विश्वविद्यालयों में मास्टर्स और पीएचडी के लिए पूर्ण विदेशी छात्रवृत्ति',
    description: 'Assists meritorious ST students to pursue higher studies abroad (Master’s Level courses and Ph.D.) in Engineering, Management, Pure & Applied Sciences, Agricultural Sciences, Medicine, and Humanities.',
    descriptionHi: 'विदेशों के शीर्ष विश्वविद्यालयों में मास्टर्स और पीएचडी के लिए ट्यूशन फीस, हवाई किराया और मासिक भत्ता।',
    targetStudents: 'ST graduates with >55% marks with unconditional offer from top 500 world universities',
    educationLevel: 'Overseas Masters / Ph.D',
    maxIncomeThreshold: 800000, // ₹8.0 Lakhs
    financialBenefit: 'Full Tuition Fees + Annual Maintenance USD $15,400 / GBP £9,900 + Return Airfare',
    deadline: '31 Jan 2027',
    portalSource: 'NOS Portal',
    requiredDocs: ['ST Certificate', 'Unconditional Offer Letter', 'Valid Indian Passport', 'Income Tax Return / Income Certificate', 'GRE/IELTS/TOEFL score'],
    keyHighlights: [
      '20 annual overseas slots reserved exclusively for Tribal scholars',
      'Includes emergency medical insurance coverage abroad',
      'Equip clearance handled directly by Ministry of Tribal Affairs'
    ]
  },
  {
    id: 'pre_matric',
    code: 'MOTA-PRE-ST',
    name: 'Pre-Matric Scholarship for ST Students (Class 9 & 10)',
    nameHi: 'एसटी छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति (कक्षा 9 और 10)',
    tagline: 'Supporting tribal students in Classes IX & X to prevent school dropouts',
    taglineHi: 'ड्रॉपआउट रोकने के लिए कक्षा 9 और 10 के आदिवासी छात्रों को प्रोत्साहन राशि',
    description: 'Centrally sponsored scholarship designed to encourage ST children to attend school, minimize transition dropouts between primary and secondary levels, and improve literacy in tribal belts.',
    descriptionHi: 'कक्षा 9 और 10 में पढ़ने वाले एसटी छात्रों को छात्रवृत्ति और पुस्तक अनुदान।',
    targetStudents: 'Regular ST students in Class 9 and 10 in recognized schools',
    educationLevel: 'Secondary (Class 9 & 10)',
    maxIncomeThreshold: 200000, // ₹2.0 Lakhs
    financialBenefit: '₹3,500/yr for Day Scholars | ₹7,000/yr for Hostellers + ₹1,000 book grant',
    deadline: '15 Oct 2026',
    portalSource: 'NSP',
    requiredDocs: ['ST Certificate', 'UDISE Student Record', 'School Principal Bonafide', 'Parent Income Self-Declaration'],
    keyHighlights: [
      'Direct integration with school UDISE+ record',
      'Zero application fee or documentation burden on parents',
      'Special incentives for female students in tribal blocks'
    ]
  }
];

export const INITIAL_APPLICATION: ScholarshipApplication = {
  id: 'APP-MOTA-2026-00491',
  applicationNo: 'JH2026MOTAPMS0991',
  schemeId: 'post_matric',
  schemeName: 'Post-Matric Scholarship for ST Students',
  submittedAt: '2026-08-12 10:24 AM',
  currentStage: 'department_verified', // Currently under Department Verification!
  academicYear: '2026-27',
  course: 'B.Tech - CSE (2nd Year)',
  sanctionAmount: 38500,
  timeline: [
    {
      id: 't-1',
      stage: 'submitted',
      title: 'Application Submitted',
      description: 'Single-entry profile verified and submitted via JAGO Scholar mobile gateway.',
      timestamp: '12 Aug 2026, 10:24 AM',
      actor: 'Rahul Kumar (Student)',
      completed: true,
      isCurrent: false
    },
    {
      id: 't-2',
      stage: 'institution_verified',
      title: 'Institution Nodal Verification',
      description: 'Birsa Institute of Tribal Technology nodal officer verified academic enrollment & attendance.',
      timestamp: '14 Aug 2026, 03:45 PM',
      actor: 'Prof. A. K. Munda (Nodal Officer)',
      completed: true,
      isCurrent: false,
      remarks: 'Enrollment BITT/2024/CSE/084 confirmed. Attendance > 85%.'
    },
    {
      id: 't-3',
      stage: 'department_verified',
      title: 'Department Verification (MoTA/State DWO)',
      description: 'District Welfare Officer (DWO) Ranchi validated ST certificate & income credentials.',
      timestamp: '16 Aug 2026, 02:15 PM',
      actor: 'District Welfare Officer, Ranchi',
      completed: true,
      isCurrent: true,
      remarks: 'Category ST Santhal verified via JharSewa integration.'
    },
    {
      id: 't-4',
      stage: 'sanctioned',
      title: 'Sanction Order Generation',
      description: 'MoTA financial sanction order generation and allocation of scholarship funds.',
      timestamp: 'Expected by 24 Aug 2026',
      actor: 'MoTA Scholarship Division',
      completed: false,
      isCurrent: false
    },
    {
      id: 't-5',
      stage: 'payment_processing',
      title: 'PFMS Payment Processing',
      description: 'Electronic payment instruction dispatched to Public Financial Management System (PFMS).',
      timestamp: 'Pending Sanction',
      actor: 'PFMS Gateway',
      completed: false,
      isCurrent: false
    },
    {
      id: 't-6',
      stage: 'dbt_credited',
      title: 'Direct Benefit Transfer (DBT) Credited',
      description: 'Funds credited directly to student Aadhaar-seeded bank account (SBI ••••8142).',
      timestamp: 'Pending Disbursement',
      actor: 'Aadhaar Payment Bridge (APBS)',
      completed: false,
      isCurrent: false
    }
  ],
  attachedDocuments: [
    { docId: 'DOC-ST-01', name: 'ST Caste Certificate', type: 'caste', verified: true },
    { docId: 'DOC-INC-01', name: 'Annual Income Certificate', type: 'income', verified: true },
    { docId: 'DOC-ACAD-01', name: 'B.Tech Semester-III Marksheet', type: 'academic', verified: true },
    { docId: 'DOC-BANK-01', name: 'SBI Bank Passbook / DBT Mandate', type: 'bank', verified: true }
  ],
  deficiencies: [],
  dbtDetails: {
    pfmsTxnId: 'PFMS-2026-JH-992144',
    disbursedDate: 'Pending',
    amount: 38500,
    bankName: 'State Bank of India',
    maskedAcc: '••••••••8142',
    utrNumber: 'SBIN2026082400918',
    status: 'Pending'
  }
};

export const INITIAL_DIGILOCKER_DOCS: DigiLockerDoc[] = [
  {
    id: 'DOC-ST-01',
    name: 'Scheduled Tribe (ST) Certificate',
    category: 'caste',
    source: 'Jharkhand e-District (JharSewa)',
    docNumber: 'JH-ST-2023-99412',
    issuedDate: '12-Apr-2023',
    verificationStatus: 'verified',
    isImported: true,
    fileSize: '412 KB',
    issuerOrg: 'Office of the Sub-Divisional Officer, Sadar Ranchi',
    previewSnippet: {
      'Candidate Name': 'Rahul Kumar',
      'Father Name': 'Mangal Kumar',
      'Community': 'Santhal (Scheduled Tribe)',
      'State': 'Jharkhand',
      'Digital Signature': 'Digitally Signed by SDO Sadar Ranchi (SHA-256)'
    }
  },
  {
    id: 'DOC-INC-01',
    name: 'Income Certificate (FY 2025-26)',
    category: 'income',
    source: 'Revenue Dept, Govt of Jharkhand',
    docNumber: 'JH-INC-2025-41098',
    issuedDate: '28-May-2025',
    verificationStatus: 'verified',
    isImported: false, // Ready to import in Demo Flow!
    fileSize: '320 KB',
    issuerOrg: 'Circle Officer, Namkum Ranchi',
    previewSnippet: {
      'Applicant': 'Mangal Kumar (Father)',
      'Beneficiary': 'Rahul Kumar (Son)',
      'Total Annual Income': '₹ 1,80,000 (One Lakh Eighty Thousand)',
      'Valid Upto': '31-Mar-2026',
      'Certificate Status': 'Active & Verified'
    }
  },
  {
    id: 'DOC-APAAR-01',
    name: 'APAAR / Academic DigiLocker ID',
    category: 'academic',
    source: 'Ministry of Education (APAAR/ABC)',
    docNumber: '9842-1102-4912',
    issuedDate: '10-Jul-2024',
    verificationStatus: 'verified',
    isImported: true,
    fileSize: '210 KB',
    issuerOrg: 'National Academic Depository (NAD)',
    previewSnippet: {
      'Student Name': 'Rahul Kumar',
      'College': 'Birsa Institute of Tribal Technology',
      'Degree': 'Bachelor of Technology (CSE)',
      'Cumulative GPA': '7.84 / 10.0'
    }
  },
  {
    id: 'DOC-AADHAAR-01',
    name: 'e-Aadhaar Digital Profile',
    category: 'identity',
    source: 'UIDAI',
    docNumber: 'XXXX-XXXX-8921',
    issuedDate: '01-Jan-2020',
    verificationStatus: 'verified',
    isImported: true,
    fileSize: '180 KB',
    issuerOrg: 'Unique Identification Authority of India',
    previewSnippet: {
      'Name': 'Rahul Kumar',
      'DOB': '14/06/2004',
      'Gender': 'Male',
      'Address': 'Birsa Munda Nagar, Namkum, Ranchi - 834010',
      'Aadhaar e-KYC': 'Verified ✓'
    }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'recommendation',
    title: 'Scholarship Applications Open',
    titleHi: 'छात्रवृत्ति आवेदन विंडो खुली है',
    message: 'Post-Matric ST Scholarship 2026-27 is now accepting applications. Apply in 1-click using your verified profile.',
    messageHi: 'पोस्ट-मैट्रिक एसटी छात्रवृत्ति 2026-27 के लिए आवेदन स्वीकार किए जा रहे हैं। अपनी प्रोफ़ाइल से 1-क्लिक में आवेदन करें।',
    timestamp: '14 Aug 2026, 03:45 PM',
    isRead: false,
    actionUrlTab: 'scholarships'
  },
  {
    id: 'notif-2',
    type: 'recommendation',
    title: '2 Scholarships Match Your Profile',
    titleHi: '2 छात्रवृत्तियां आपकी प्रोफ़ाइल से मेल खाती हैं',
    message: 'Based on your ST category and 2nd-year B.Tech standing, check out Post-Matric & Top Class Education.',
    messageHi: 'आपकी एसटी श्रेणी और बी.टेक के आधार पर, पोस्ट-मैट्रिक और टॉप क्लास शिक्षा छात्रवृत्ति देखें।',
    timestamp: '12 Aug 2026, 09:00 AM',
    isRead: true,
    actionUrlTab: 'scholarships'
  },
  {
    id: 'notif-3',
    type: 'action_required',
    title: 'DigiLocker Sync Available',
    titleHi: 'डिजिलॉकर सिंक उपलब्ध है',
    message: 'Connect DigiLocker to auto-verify your Income Certificate and achieve 100% profile completion.',
    messageHi: 'अपने आय प्रमाण पत्र को स्वतः सत्यापित करने के लिए डिजिलॉकर कनेक्ट करें।',
    timestamp: '10 Aug 2026, 11:30 AM',
    isRead: false,
    actionUrlTab: 'documents'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-8801',
    timestamp: '2026-08-16 14:15:22',
    actor: 'DWO-RANCHI-OFFICER-44',
    role: 'District Welfare Officer',
    action: 'Approved Department Verification Stage',
    targetId: 'APP-MOTA-2026-00491',
    oldState: 'institution_verified',
    newState: 'department_verified',
    ipAddress: '10.14.82.112'
  },
  {
    id: 'AUD-8800',
    timestamp: '2026-08-14 15:45:10',
    actor: 'NODAL-BITT-OFFICER-02',
    role: 'Institution Nodal Officer',
    action: 'Verified Academic Enrollment & Attendance',
    targetId: 'APP-MOTA-2026-00491',
    oldState: 'submitted',
    newState: 'institution_verified',
    ipAddress: '192.168.1.55'
  },
  {
    id: 'AUD-8799',
    timestamp: '2026-08-12 10:24:00',
    actor: 'STUDENT-RAHUL-KUMAR',
    role: 'Student Applicant',
    action: 'Submitted Scholarship Application',
    targetId: 'APP-MOTA-2026-00491',
    oldState: 'draft',
    newState: 'submitted',
    ipAddress: '49.36.120.4'
  }
];

export const INITIAL_OUTREACH_CANDIDATES: OutreachCandidate[] = [
  {
    id: 'OUT-JH-101',
    studentName: 'Sunita Soren',
    apaarId: '8821-4401-9921',
    institution: 'Government Girls High School, Khunti',
    district: 'Khunti',
    state: 'Jharkhand',
    level: 'Class 9',
    eligibleScheme: 'Pre-Matric Scholarship for ST',
    status: 'identified',
    unregisteredReason: 'UDISE+ record active; zero scholarship applications found on NSP/JAGO'
  },
  {
    id: 'OUT-JH-102',
    studentName: 'Birsa Munda Jr.',
    apaarId: '9901-3312-8874',
    institution: 'Government Polytechnic, Dumka',
    district: 'Dumka',
    state: 'Jharkhand',
    level: 'Diploma (Mechanical 1st Yr)',
    eligibleScheme: 'Post-Matric Scholarship for ST',
    status: 'sms_sent',
    unregisteredReason: 'Enrolled in AISHE C-9912; DigiLocker caste verified; application not initiated'
  },
  {
    id: 'OUT-JH-103',
    studentName: 'Anjali Marandi',
    apaarId: '7741-2290-6611',
    institution: 'IIT (ISM) Dhanbad',
    district: 'Dhanbad',
    state: 'Jharkhand',
    level: 'B.Tech Mining Engineering',
    eligibleScheme: 'National Scholarship for Higher Education (Top Class)',
    status: 'counseling_assigned',
    unregisteredReason: 'ST candidate in notified Top Class institute; income <= 8.0L; pending awareness'
  },
  {
    id: 'OUT-JH-104',
    studentName: 'Vikram Oraon',
    apaarId: '6610-8812-4433',
    institution: 'Ranchi University Dept of Tribal Studies',
    district: 'Ranchi',
    state: 'Jharkhand',
    level: 'Ph.D. Tribal Linguistics',
    eligibleScheme: 'National Fellowship for ST Students (NFST)',
    status: 'identified',
    unregisteredReason: 'UGC-NET ST qualified candidate; M.Phil registered; missed previous SFMP cutoff'
  }
];

export const INITIAL_INTEGRATION_CONFIG: IntegrationServiceConfig = {
  digiLocker: 'SUCCESS',
  nsp: 'SUCCESS',
  sfmp: 'SUCCESS',
  nos: 'SUCCESS',
  udise: 'SUCCESS',
  apaar: 'SUCCESS',
  pfmsDbt: 'SUCCESS',
  incomeAuthority: 'SUCCESS'
};
