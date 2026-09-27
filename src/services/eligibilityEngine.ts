import { StudentProfile, ScholarshipScheme, EligibilityEvaluation, SchemeId } from '../types';

export class EligibilityEngine {
  /**
   * Evaluates eligibility for a given scholarship scheme against a student's profile.
   * Returns a fully explainable, criteria-by-criteria evaluation.
   */
  static evaluate(scheme: ScholarshipScheme, profile: StudentProfile): EligibilityEvaluation {
    const criteriaChecks: EligibilityEvaluation['criteriaChecks'] = [];
    const missingRequirements: string[] = [];

    // 1. ST Category Check (Common for all MoTA schemes)
    const isSt = profile.social.category === 'ST';
    const isStVerified = profile.social.verificationStatus === 'verified';
    
    if (isSt && isStVerified) {
      criteriaChecks.push({
        label: 'Scheduled Tribe (ST) Category & Verification',
        labelHi: 'अनुसूचित जनजाति (एसटी) श्रेणी एवं सत्यापन',
        passed: true,
        status: 'pass',
        reason: `ST category confirmed (${profile.social.tribeCommunity} tribe) via ${profile.social.verificationSource || 'e-District'}.`
      });
    } else if (isSt && !isStVerified) {
      criteriaChecks.push({
        label: 'Scheduled Tribe (ST) Category Verification',
        labelHi: 'एसटी श्रेणी सत्यापन',
        passed: false,
        status: 'warning',
        reason: 'ST category selected but certificate verification is pending.'
      });
      missingRequirements.push('Verify ST Certificate via DigiLocker');
    } else {
      criteriaChecks.push({
        label: 'Scheduled Tribe (ST) Category Requirement',
        labelHi: 'एसटी श्रेणी आवश्यकता',
        passed: false,
        status: 'fail',
        reason: 'Candidate must belong to Scheduled Tribe (ST) category.'
      });
    }

    // 2. Income Ceiling Check
    const studentIncome = profile.family.annualIncome;
    const maxIncome = scheme.maxIncomeThreshold;
    const isIncomeVerified = profile.family.incomeVerificationStatus === 'verified';

    if (maxIncome >= 900000000) {
      // No income limit for research fellowship (NFST)
      criteriaChecks.push({
        label: 'Family Income Ceiling',
        labelHi: 'पारिवारिक आय सीमा',
        passed: true,
        status: 'pass',
        reason: 'No family income limit applicable for this research fellowship.'
      });
    } else if (studentIncome <= maxIncome) {
      if (isIncomeVerified) {
        criteriaChecks.push({
          label: `Family Income within Limit (≤ ₹${(maxIncome / 100000).toFixed(1)} Lakhs)`,
          labelHi: `पारिवारिक आय सीमा के भीतर (≤ ₹${(maxIncome / 100000).toFixed(1)} लाख)`,
          passed: true,
          status: 'pass',
          reason: `Annual income ₹${studentIncome.toLocaleString('en-IN')} verified against government revenue records.`
        });
      } else {
        criteriaChecks.push({
          label: `Family Income within Limit (≤ ₹${(maxIncome / 100000).toFixed(1)} Lakhs)`,
          labelHi: `पारिवारिक आय सीमा के भीतर (≤ ₹${(maxIncome / 100000).toFixed(1)} लाख)`,
          passed: true,
          status: 'pending',
          reason: `Declared income ₹${studentIncome.toLocaleString('en-IN')} is within ₹${(maxIncome / 100000).toFixed(1)}L limit, but digital verification is pending.`
        });
        missingRequirements.push('Sync Income Certificate via DigiLocker');
      }
    } else {
      criteriaChecks.push({
        label: `Family Income Ceiling (≤ ₹${(maxIncome / 100000).toFixed(1)} Lakhs)`,
        labelHi: `पारिवारिक आय सीमा (≤ ₹${(maxIncome / 100000).toFixed(1)} लाख)`,
        passed: false,
        status: 'fail',
        reason: `Annual family income ₹${studentIncome.toLocaleString('en-IN')} exceeds the scheme ceiling of ₹${(maxIncome / 100000).toFixed(1)} Lakhs.`
      });
    }

    // 3. Scheme Specific Academic Level & Institute Checks
    switch (scheme.id) {
      case 'post_matric':
        if (profile.academic.currentLevel === 'Undergraduate' || 
            profile.academic.currentLevel === 'Postgraduate' || 
            profile.academic.currentLevel === 'Higher Secondary (11-12)') {
          criteriaChecks.push({
            label: 'Post-Matriculation Academic Standing',
            labelHi: 'पोस्ट-मैट्रिक शैक्षणिक स्तर',
            passed: true,
            status: 'pass',
            reason: `Currently enrolled in ${profile.academic.courseName} (${profile.academic.currentYear}) at ${profile.academic.institutionName}.`
          });
        } else {
          criteriaChecks.push({
            label: 'Post-Matriculation Standing',
            labelHi: 'पोस्ट-मैट्रिक स्तर',
            passed: false,
            status: 'fail',
            reason: `Scheme requires post-matric enrollment (Class 11, 12, Degree, PG). Current level is ${profile.academic.currentLevel}.`
          });
        }
        break;

      case 'top_class':
        // Top class requires premier institute or degree level
        if (profile.academic.currentLevel === 'Undergraduate' || profile.academic.currentLevel === 'Postgraduate') {
          criteriaChecks.push({
            label: 'Recognized Higher Education Enrollment',
            labelHi: 'मान्यता प्राप्त उच्च शिक्षा संस्थान',
            passed: true,
            status: 'pass',
            reason: `Enrolled in full-time professional degree (${profile.academic.courseName}).`
          });
          criteriaChecks.push({
            label: 'MoTA Notified Premier Institute Admission',
            labelHi: 'अधिसूचित प्रमुख संस्थान प्रवेश',
            passed: true,
            status: 'pass',
            reason: `${profile.academic.institutionName} is recognized under MoTA state institution list.`
          });
        } else {
          criteriaChecks.push({
            label: 'Degree Level Enrollment',
            labelHi: 'डिग्री स्तर का नामांकन',
            passed: false,
            status: 'fail',
            reason: 'Requires full-time admission into notified premier institutes (IIT/IIM/NIT/AIIMS/Govt Tech).'
          });
        }
        break;

      case 'pre_matric':
        if (profile.academic.currentLevel === 'Secondary (9-10)') {
          criteriaChecks.push({
            label: 'Class 9 or 10 Enrollment',
            labelHi: 'कक्षा 9 या 10 में नामांकन',
            passed: true,
            status: 'pass',
            reason: 'Enrolled in secondary school level.'
          });
        } else {
          criteriaChecks.push({
            label: 'Class 9 or 10 Secondary Enrollment',
            labelHi: 'कक्षा 9 या 10 में नामांकन',
            passed: false,
            status: 'fail',
            reason: `Applicable only to Class 9 & 10 students. You are currently in ${profile.academic.currentLevel}.`
          });
        }
        break;

      case 'nfst':
        if (profile.academic.currentLevel === 'M.Phil / Ph.D') {
          criteriaChecks.push({
            label: 'M.Phil / Ph.D Doctoral Registration',
            labelHi: 'एम.फिल / पीएचडी डॉक्टरेट पंजीकरण',
            passed: true,
            status: 'pass',
            reason: 'Enrolled in full-time doctoral research.'
          });
        } else {
          criteriaChecks.push({
            label: 'M.Phil / Ph.D Doctoral Registration',
            labelHi: 'एम.फिल / पीएचडी डॉक्टरेट पंजीकरण',
            passed: false,
            status: 'fail',
            reason: `Requires full-time M.Phil/Ph.D registration and NET qualification. Current level: ${profile.academic.currentLevel}.`
          });
        }
        break;

      case 'nos':
        if (profile.academic.currentLevel === 'Overseas Master/Ph.D') {
          criteriaChecks.push({
            label: 'Overseas University Admission',
            labelHi: 'विदेशी विश्वविद्यालय में प्रवेश',
            passed: true,
            status: 'pass',
            reason: 'Unconditional admission in top 500 QS ranked university.'
          });
        } else {
          criteriaChecks.push({
            label: 'Foreign University Admission Letter',
            labelHi: 'विदेशी विश्वविद्यालय प्रवेश पत्र',
            passed: false,
            status: 'fail',
            reason: 'Requires unconditional admission offer for Masters/Ph.D in top 500 world universities.'
          });
        }
        break;
    }

    // 4. Aadhaar-Bank DBT Check
    if (profile.bank.isDbtEnabled && profile.bank.verificationStatus === 'verified') {
      criteriaChecks.push({
        label: 'Aadhaar Seeded Bank Account (DBT Active)',
        labelHi: 'आधार से जुड़ा बैंक खाता (डीबीटी सक्रिय)',
        passed: true,
        status: 'pass',
        reason: `${profile.bank.bankName} account (${profile.bank.accountNoMasked}) is DBT enabled via NPCI APBS.`
      });
    } else {
      criteriaChecks.push({
        label: 'Aadhaar Seeded Bank Account (DBT)',
        labelHi: 'आधार से जुड़ा बैंक खाता',
        passed: false,
        status: 'warning',
        reason: 'Bank account requires Aadhaar seeding with NPCI mapper.'
      });
      missingRequirements.push('Enable DBT on Bank Account');
    }

    // Determine Final Status
    const hasFail = criteriaChecks.some(c => c.status === 'fail');
    const hasPendingOrWarning = criteriaChecks.some(c => c.status === 'pending' || c.status === 'warning');

    let status: EligibilityEvaluation['status'] = 'eligible';
    let summary = 'You meet all mandatory eligibility criteria for this scholarship.';
    let summaryHi = 'आप इस छात्रवृत्ति के लिए सभी अनिवार्य पात्रता मानदंड पूरे करते हैं।';
    let canApply = true;

    if (hasFail) {
      status = 'not_eligible';
      summary = 'Your current profile does not satisfy one or more mandatory scheme conditions.';
      summaryHi = 'आपकी वर्तमान प्रोफ़ाइल एक या अधिक अनिवार्य शर्तों को पूरा नहीं करती है।';
      canApply = false;
    } else if (hasPendingOrWarning) {
      status = 'potentially_eligible';
      summary = 'You are likely eligible, but 1 or more verifications/documents are pending.';
      summaryHi = 'आप संभावित रूप से पात्र हैं, लेकिन 1 या अधिक सत्यापन लंबित हैं।';
      canApply = true; // Still allow initiation of application
    }

    return {
      schemeId: scheme.id,
      status,
      summary,
      summaryHi,
      criteriaChecks,
      missingRequirements,
      canApply
    };
  }

  /**
   * Evaluates all schemes for a student
   */
  static evaluateAll(schemes: ScholarshipScheme[], profile: StudentProfile): Record<SchemeId, EligibilityEvaluation> {
    const results = {} as Record<SchemeId, EligibilityEvaluation>;
    for (const scheme of schemes) {
      results[scheme.id] = this.evaluate(scheme, profile);
    }
    return results;
  }
}
