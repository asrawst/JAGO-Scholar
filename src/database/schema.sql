-- ==============================================================================
-- JAGO SCHOLAR - DATABASE SCHEMA (PostgreSQL / Supabase DDL)
-- Ministry of Tribal Affairs (MoTA) - Smart India Hackathon SIH26238
-- "One Profile. One Dashboard. Every Scholarship."
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Authentication & Roles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'institution_officer', 'ministry_admin', 'state_dwo')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Student Profile (Single Source of Truth)
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(128) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(16) NOT NULL,
    aadhaar_hash VARCHAR(64) NOT NULL,
    aadhaar_masked VARCHAR(16) NOT NULL,
    street_address TEXT,
    village_town VARCHAR(64),
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    profile_completion_percentage INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Identity Verification Record
CREATE TABLE identity_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    verification_source VARCHAR(64) NOT NULL DEFAULT 'UIDAI_eKYC',
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    txn_reference VARCHAR(128),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ST / Category Credentials
CREATE TABLE st_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    tribe_community VARCHAR(64) NOT NULL,
    is_pvtg BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(64) NOT NULL,
    issuing_authority VARCHAR(128) NOT NULL,
    issue_date DATE NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    digilocker_uri VARCHAR(255),
    digital_signature_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Family & Income Records
CREATE TABLE income_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    father_name VARCHAR(128) NOT NULL,
    mother_name VARCHAR(128),
    guardian_occupation VARCHAR(128),
    annual_income NUMERIC(12, 2) NOT NULL,
    certificate_number VARCHAR(64) NOT NULL,
    valid_upto DATE NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    discrepancy_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Academic Records (APAAR / AISHE / UDISE+)
CREATE TABLE academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    apaar_id VARCHAR(32) UNIQUE,
    udise_school_code VARCHAR(32),
    aishe_institution_code VARCHAR(32),
    current_education_level VARCHAR(64) NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    current_year VARCHAR(32) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(64) NOT NULL,
    enrollment_number VARCHAR(64) NOT NULL,
    previous_score_percentage NUMERIC(5, 2),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bank & DBT Accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    account_holder_name VARCHAR(128) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    account_number_masked VARCHAR(20) NOT NULL,
    ifsc_code VARCHAR(16) NOT NULL,
    is_dbt_enabled BOOLEAN DEFAULT TRUE,
    npci_mapper_status VARCHAR(32) DEFAULT 'active',
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MoTA Scholarship Schemes
CREATE TABLE scholarships (
    id VARCHAR(32) PRIMARY KEY, -- 'post_matric', 'top_class', 'nfst', 'nos', 'pre_matric'
    scheme_code VARCHAR(32) UNIQUE NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    tagline_en TEXT,
    tagline_hi TEXT,
    description_en TEXT,
    description_hi TEXT,
    max_income_ceiling NUMERIC(12, 2) NOT NULL,
    portal_source VARCHAR(32) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. Scholarship Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(64) UNIQUE NOT NULL,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    scheme_id VARCHAR(32) REFERENCES scholarships(id),
    academic_year VARCHAR(16) NOT NULL,
    current_stage VARCHAR(32) NOT NULL DEFAULT 'submitted' CHECK (current_stage IN (
        'submitted', 'institution_verified', 'department_verified', 'sanctioned', 'payment_processing', 'dbt_credited', 'deficiency_flagged', 'rejected'
    )),
    sanction_amount NUMERIC(10, 2),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Application Status History (Timeline Events)
CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    stage VARCHAR(32) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    actor VARCHAR(128) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Deficiencies (Action Required on Discrepancies)
CREATE TABLE deficiencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    field VARCHAR(64) NOT NULL,
    issue_description TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'under_manual_review')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 12. DigiLocker Document Vault
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(32) NOT NULL,
    source VARCHAR(64) NOT NULL,
    doc_number VARCHAR(64) NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    digilocker_uri VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    message_en TEXT NOT NULL,
    message_hi TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Immutable Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(128) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_id VARCHAR(128) NOT NULL,
    old_state VARCHAR(64),
    new_state VARCHAR(64),
    ip_address VARCHAR(45)
);

-- 15. ST Outreach Candidates (UDISE+ / APAAR Matching)
CREATE TABLE outreach_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apaar_id VARCHAR(32) NOT NULL,
    student_name VARCHAR(128) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    level VARCHAR(64) NOT NULL,
    eligible_scheme VARCHAR(128) NOT NULL,
    status VARCHAR(32) DEFAULT 'identified',
    unregistered_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
