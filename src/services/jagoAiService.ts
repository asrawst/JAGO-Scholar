import { StudentProfile, ScholarshipApplication, ScholarshipScheme, DigiLockerDoc, ChatMessage, Language } from '../types';
import { EligibilityEngine } from './eligibilityEngine';

export class JagoAiService {
  /**
   * Generates a context-grounded response from JAGO (Just Assistance & Guidance Online).
   * Reads Rahul's live profile, applications, documents, and verification state.
   */
  static processUserMessage(
    userText: string,
    profile: StudentProfile,
    applications: ScholarshipApplication[],
    schemes: ScholarshipScheme[],
    docs: DigiLockerDoc[],
    lang: Language = 'en'
  ): ChatMessage {
    const q = userText.toLowerCase().trim();
    const isHi = lang === 'hi';
    const postMatricApp = applications.find(a => a.schemeId === 'post_matric');

    // 1. Where is my scholarship / Status check
    if (q.includes('where') || q.includes('status') || q.includes('track') || q.includes('approved') || q.includes('कहाँ') || q.includes('स्थिति') || q.includes('स्वीकृत')) {
      if (postMatricApp) {
        let stageText = '';
        let stageTextHi = '';
        let detailText = '';
        let detailTextHi = '';

        if (postMatricApp.currentStage === 'department_verified') {
          stageText = 'Department Verification';
          stageTextHi = 'विभाग सत्यापन';
          detailText = `Your Post-Matric Scholarship application (#${postMatricApp.applicationNo}) was institution-verified on 14 Aug and is currently under review with the District Welfare Officer (DWO) Ranchi. Next step: State Sanction Order generation.`;
          detailTextHi = `आपका पोस्ट-मैट्रिक छात्रवृत्ति आवेदन (#${postMatricApp.applicationNo}) 14 अगस्त को संस्थान द्वारा सत्यापित किया गया था और वर्तमान में जिला कल्याण अधिकारी (DWO) रांची द्वारा समीक्षाधीन है। अगला चरण: राज्य स्वीकृति आदेश।`;
        } else if (postMatricApp.currentStage === 'institution_verified') {
          stageText = 'Institution Verified';
          stageTextHi = 'संस्थान सत्यापित';
          detailText = `Your college (${profile.academic.institutionName}) has successfully verified your enrollment and attendance. It is queued for District Welfare Office scrutiny.`;
          detailTextHi = `आपके कॉलेज (${profile.academic.institutionName}) ने आपके नामांकन का सत्यापन कर दिया है। यह जिला कल्याण कार्यालय जांच हेतु कतार में है।`;
        } else if (postMatricApp.currentStage === 'sanctioned') {
          stageText = 'Sanctioned';
          stageTextHi = 'स्वीकृत';
          detailText = `Good news! Your scholarship of ₹${postMatricApp.sanctionAmount.toLocaleString('en-IN')} has been officially sanctioned by Ministry of Tribal Affairs. The payment mandate is dispatched to PFMS.`;
          detailTextHi = `शुभ समाचार! आपकी ₹${postMatricApp.sanctionAmount.toLocaleString('en-IN')} की छात्रवृत्ति जनजातीय कार्य मंत्रालय द्वारा स्वीकृत कर दी गई है। पीएफएमएस को भुगतान निर्देश भेज दिया गया है।`;
        } else if (postMatricApp.currentStage === 'dbt_credited') {
          stageText = 'Payment Credited via DBT';
          stageTextHi = 'डीबीटी भुगतान जमा';
          detailText = `Success! ₹${postMatricApp.sanctionAmount.toLocaleString('en-IN')} has been directly credited into your ${profile.bank.bankName} account (${profile.bank.accountNoMasked}) via Aadhaar Payment Bridge. UTR Ref: ${postMatricApp.dbtDetails?.utrNumber || 'SBIN2026082400918'}.`;
          detailTextHi = `सफलता! आधार पेमेंट ब्रिज के माध्यम से आपके ${profile.bank.bankName} खाते (${profile.bank.accountNoMasked}) में ₹${postMatricApp.sanctionAmount.toLocaleString('en-IN')} जमा कर दिए गए हैं।`;
        } else if (postMatricApp.currentStage === 'deficiency_flagged') {
          stageText = 'Action Required (Deficiency)';
          stageTextHi = 'कार्रवाई आवश्यक';
          detailText = `An issue was flagged on your application. Please review the deficiency notice in the tracker and re-upload the requested document or request manual review.`;
          detailTextHi = `आपके आवेदन पर एक विसंगति पाई गई है। कृपया ट्रैकर में सूचना देखें और दस्तावेज पुनः अपलोड करें या मैनुअल समीक्षा का अनुरोध करें।`;
        } else {
          stageText = 'Submitted';
          stageTextHi = 'जमा किया गया';
          detailText = `Your application was submitted on ${postMatricApp.submittedAt} and is awaiting college nodal officer verification.`;
          detailTextHi = `आपका आवेदन ${postMatricApp.submittedAt} को जमा किया गया था और कॉलेज नोडल अधिकारी सत्यापन की प्रतीक्षा में है।`;
        }

        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: isHi ? detailTextHi : detailText,
          textHi: detailTextHi,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          contextCard: {
            title: isHi ? 'पोस्ट-मैट्रिक छात्रवृत्ति स्थिति' : 'Post-Matric ST Scholarship',
            statusBadge: isHi ? stageTextHi : stageText,
            details: `App ID: ${postMatricApp.applicationNo}`
          },
          quickActions: [
            { label: 'View Full Timeline', labelHi: 'पूरी समयरेखा देखें', actionType: 'navigate_tab', payload: 'applications' },
            { label: 'When will I get funds?', labelHi: 'पैसे कब मिलेंगे?', actionType: 'navigate_tab', payload: 'applications' }
          ]
        };
      }
    }

    // 2. When will I get money / Expected disbursement date (PDF Page 9 & 11)
    if (q.includes('when') || q.includes('get money') || q.includes('disburs') || q.includes('fund') || q.includes('पैसे') || q.includes('कब') || q.includes('भुगतान')) {
      const isSanctioned = postMatricApp?.currentStage === 'sanctioned' || postMatricApp?.currentStage === 'dbt_credited';
      
      const textEn = isSanctioned
        ? `Your sanction of ₹${postMatricApp?.sanctionAmount.toLocaleString('en-IN')} has been approved by MoTA. PFMS electronic payment gateway release is scheduled. Expected disbursement to your SBI Account (${profile.bank.accountNoMasked}) by 30th of this month.`
        : `Your application is currently at **Stage 3 (Department Verification)**. After State DWO approval and MoTA Sanction Order generation, PFMS Direct Benefit Transfer (DBT) is estimated by **30 Sept 2026** directly to your Aadhaar-seeded SBI account.`;

      const textHi = isSanctioned
        ? `आपकी ₹${postMatricApp?.sanctionAmount.toLocaleString('en-IN')} की छात्रवृत्ति MoTA द्वारा स्वीकृत है। इस माह की 30 तारीख तक आपके एसबीआई खाते (${profile.bank.accountNoMasked}) में राशि जमा होने की संभावना है।`
        : `आपका आवेदन वर्तमान में **चरण 3 (विभाग सत्यापन)** पर है। स्वीकृति आदेश के बाद, पीएफएमएस डीबीटी के माध्यम से **30 सितंबर 2026** तक आपके आधार-लिंक्ड बैंक खाते में सीधे राशि जमा होने का अनुमान है।`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: isHi ? textHi : textEn,
        textHi: textHi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'Track Payment in PFMS Ledger', labelHi: 'पीएफएमएस लेजर देखें', actionType: 'navigate_tab', payload: 'applications' },
          { label: 'Check Bank Seeding', labelHi: 'बैंक सीडिंग जांचें', actionType: 'navigate_tab', payload: 'profile' }
        ]
      };
    }

    // 3. Which documents are pending / Documents required (PDF Page 8)
    if (q.includes('pending') || q.includes('require') || q.includes('which document') || q.includes('submit') || q.includes('जरूरी') || q.includes('लंबित') || q.includes('दस्तावेज')) {
      const isIncomePending = profile.family.incomeVerificationStatus !== 'verified';
      
      const textEn = isIncomePending
        ? `Here is your document checklist:\n• **ST Caste Certificate**: Verified ✓ (${profile.social.stCertificateNo})\n• **Academic Marksheet & APAAR**: Verified ✓ (${profile.academic.apaarId})\n• **Bank DBT Mandate**: Verified ✓ (${profile.bank.bankName})\n• **Family Income Certificate**: ⏳ **Pending DigiLocker Sync**\n\nTap "Connect DigiLocker" to instantly fetch and verify your Income Certificate in 1-click!`
        : `All your 5 core documents are **100% verified and stored in your digital wallet**:\n• ST Caste Certificate ✓\n• Income Certificate ✓\n• APAAR Academic Record ✓\n• Bank DBT Mandate ✓\n• Aadhaar e-KYC ✓\n\nYour profile is 100% reusable across all 5 MoTA schemes without uploading again.`;

      const textHi = isIncomePending
        ? `आपकी दस्तावेज सूची:\n• **एसटी जाति प्रमाण पत्र**: सत्यापित ✓\n• **शैक्षणिक रिकॉर्ड (APAAR)**: सत्यापित ✓\n• **बैंक डीबीटी सीडिंग**: सत्यापित ✓\n• **आय प्रमाण पत्र**: ⏳ **डिजिलॉकर सिंक लंबित**\n\nआय प्रमाण पत्र को तुरंत सत्यापित करने के लिए "डिजिलॉकर कनेक्ट करें" पर टैप करें।`
        : `आपके सभी 5 मुख्य दस्तावेज **100% सत्यापित और सुरक्षित हैं**। आपको किसी भी छात्रवृत्ति के लिए पुनः दस्तावेज अपलोड करने की आवश्यकता नहीं है।`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: isHi ? textHi : textEn,
        textHi: textHi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: isIncomePending ? 'Connect DigiLocker' : 'Open Document Wallet', labelHi: isIncomePending ? 'डिजिलॉकर कनेक्ट करें' : 'वॉलेट खोलें', actionType: 'navigate_tab', payload: 'documents' }
        ]
      };
    }

    // 4. Single-Scheme Restriction Policy & Multiple applications (PDF Page 3 & 4)
    if (q.includes('multiple') || q.includes('rule') || q.includes('restriction') || q.includes('both') || q.includes('दो') || q.includes('नियम')) {
      const textEn = `**Single-Scheme Rule under MoTA / NSP Guidelines:**\nUnder Central Government rules, a student can receive only **one active government welfare scholarship at a time** to prevent duplicate benefit allocation. However, with JAGO Scholar:\n• You can check eligibility across all 5 schemes seamlessly.\n• If you become eligible for a higher grant (e.g. Top Class or NFST), our unified system allows seamless transition without resubmitting documents.`;
      const textHi = `**एकल योजना नियम (MoTA दिशा-निर्देश):**\nकेंद्र सरकार के नियमानुसार, एक छात्र एक समय में केवल **एक सक्रिय छात्रवृत्ति योजना** का लाभ ले सकता है। जागो स्कॉलर में आपकी एकल प्रोफ़ाइल से आप सभी 5 योजनाओं की पात्रता देख सकते हैं और उच्च अनुदान वाली योजना में सरलता से आवेदन कर सकते हैं।`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: isHi ? textHi : textEn,
        textHi: textHi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'Browse 5 MoTA Schemes', labelHi: '5 योजनाएं देखें', actionType: 'navigate_tab', payload: 'scholarships' }
        ]
      };
    }

    // 5. Document Reuse & DigiLocker architecture (PDF Page 7)
    if (q.includes('reuse') || q.includes('digilocker') || q.includes('certificate') || q.includes('पुनः उपयोग')) {
      const textEn = `**Single-Entry Document Reuse Architecture:**\nWhen you link a certificate via DigiLocker, JAGO Scholar validates its SHA-256 digital signature from the state issuer (JharSewa). The verified metadata is cached in your encrypted vault. When applying for Pre-Matric, Post-Matric, Top Class, NFST, or NOS, the system auto-fills the verified credentials without asking you to upload PDFs again!`;
      const textHi = `**एकल दस्तावेज पुनः उपयोग प्रणाली:**\nजब आप डिजिलॉकर से प्रमाण पत्र लिंक करते हैं, तो जागो स्कॉलर राज्य जारीकर्ता से डिजिटल हस्ताक्षर की पुष्टि करता है। एक बार सत्यापित होने के बाद, आप सभी 5 छात्रवृत्तियों में इसका पुनः उपयोग कर सकते हैं।`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: isHi ? textHi : textEn,
        textHi: textHi,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: 'View DigiLocker Wallet', labelHi: 'डिजिलॉकर वॉलेट देखें', actionType: 'navigate_tab', payload: 'documents' }
        ]
      };
    }

    // 6. Am I eligible / Eligibility queries
    if (q.includes('eligible') || q.includes('eligibility') || q.includes('apply') || q.includes('पात्र') || q.includes('आवेदन')) {
      const isIncomePending = profile.family.incomeVerificationStatus !== 'verified';

      if (isIncomePending) {
        const replyEn = `Based on your profile, you are **Potentially Eligible** for **Post-Matric Scholarship (PMS-ST)** and **Top Class Education Scheme**.\n• ST Category (${profile.social.tribeCommunity}): Verified ✓\n• B.Tech 2nd Year (${profile.academic.institutionName}): Verified ✓\n• Income Certificate: **Pending DigiLocker Sync**\n\nOnce you connect DigiLocker, your profile reaches 100% verification!`;
        const replyHi = `आपकी प्रोफ़ाइल के आधार पर, आप **पोस्ट-मैट्रिक (PMS-ST)** और **टॉप क्लास छात्रवृत्ति** के लिए **संभावित रूप से पात्र** हैं। डिजिलॉकर से आय प्रमाण पत्र सिंक करते ही आप 100% पात्र हो जाएंगे।`;

        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: isHi ? replyHi : replyEn,
          textHi: replyHi,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: [
            { label: 'Connect DigiLocker', labelHi: 'डिजिलॉकर कनेक्ट करें', actionType: 'navigate_tab', payload: 'documents' },
            { label: 'Check 5 MoTA Schemes', labelHi: '5 योजनाएं देखें', actionType: 'navigate_tab', payload: 'scholarships' }
          ]
        };
      } else {
        const replyEn = `Great news Rahul! You are **100% Eligible** for the **Post-Matric Scholarship (PMS-ST)** and **Top Class Education Scheme**. Your ST Category, Income (₹1.80L ≤ ₹2.5L), and B.Tech CSE details are fully verified.`;
        const replyHi = `बधाई राहुल! आप **पोस्ट-मैट्रिक छात्रवृत्ति** और **टॉप क्लास शिक्षा** के लिए **100% पात्र** हैं। आपकी एसटी श्रेणी, आय और बी.टेक विवरण पूर्णतः सत्यापित हैं।`;

        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: isHi ? replyHi : replyEn,
          textHi: replyHi,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: [
            { label: 'Explore Scholarships', labelHi: 'छात्रवृत्तियां देखें', actionType: 'navigate_tab', payload: 'scholarships' },
            { label: 'View Profile', labelHi: 'प्रोफ़ाइल देखें', actionType: 'navigate_tab', payload: 'profile' }
          ]
        };
      }
    }

    // 7. Default intelligent fallback with MoTA guidance
    const fallbackEn = `Namaste Rahul! I am JAGO, your dedicated Tribal Scholarship Assistant. I can help you check eligibility across all 5 MoTA schemes, track your live application stage, sync DigiLocker certificates, or answer queries about DBT disbursement. How may I assist you today?`;
    const fallbackHi = `नमस्ते राहुल! मैं जागो (JAGO) हूँ, आपका समर्पित जनजातीय छात्रवृत्ति सहायक। मैं सभी 5 MoTA योजनाओं में पात्रता जांचने, आपके आवेदन को ट्रैक करने, और डीबीटी भुगतान में मदद कर सकता हूँ।`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'jago',
      text: isHi ? fallbackHi : fallbackEn,
      textHi: fallbackHi,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: 'Where is my application?', labelHi: 'मेरा आवेदन कहाँ है?', actionType: 'navigate_tab', payload: 'applications' },
        { label: 'When will I get money?', labelHi: 'पैसे कब मिलेंगे?', actionType: 'navigate_tab', payload: 'applications' },
        { label: 'Which documents are pending?', labelHi: 'कौन से दस्तावेज बाकी हैं?', actionType: 'navigate_tab', payload: 'documents' },
        { label: 'Am I eligible for Post-Matric?', labelHi: 'क्या मैं पात्र हूँ?', actionType: 'check_eligibility', payload: 'post_matric' }
      ]
    };
  }
}
