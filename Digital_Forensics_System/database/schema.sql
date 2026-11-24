-- ====================================================================
-- DIGITAL FORENSICS AND EVIDENCE CORRELATION SYSTEM
-- SQLite Relational Schema
-- ====================================================================

PRAGMA foreign_keys = ON;

-- 1. CASES TABLE
CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    background TEXT NOT NULL,
    incident_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    lead_investigator TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'Medium',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERSONS OF INTEREST TABLE
CREATE TABLE IF NOT EXISTS persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Person of Interest',
    department TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

-- 3. DEVICES TABLE
CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL,
    operating_system TEXT,
    mac_address TEXT,
    serial_number TEXT,
    assigned_person_id TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    notes TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_person_id) REFERENCES persons(person_id) ON DELETE SET NULL
);

-- 4. ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    username TEXT NOT NULL,
    service_name TEXT NOT NULL,
    privilege_level TEXT NOT NULL DEFAULT 'Standard User',
    assigned_person_id TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    notes TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_person_id) REFERENCES persons(person_id) ON DELETE SET NULL
);

-- 5. EVIDENCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evidence_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    title TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    source TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    sha256_hash TEXT NOT NULL,
    file_size_bytes INTEGER DEFAULT 0,
    custody_officer TEXT NOT NULL,
    storage_location TEXT NOT NULL,
    priority_level TEXT NOT NULL DEFAULT 'Medium',
    priority_score INTEGER DEFAULT 50,
    priority_reason TEXT,
    notes TEXT,
    is_duplicate INTEGER DEFAULT 0,
    duplicate_of TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

-- 6. LOGIN LOGS TABLE
CREATE TABLE IF NOT EXISTS login_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    account_id TEXT,
    person_id TEXT,
    device_id TEXT,
    ip_address TEXT NOT NULL,
    login_time TEXT NOT NULL,
    logout_time TEXT,
    auth_status TEXT NOT NULL DEFAULT 'Success',
    anomaly_flag INTEGER DEFAULT 0,
    anomaly_details TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE SET NULL
);

-- 7. FILE ACCESS LOGS TABLE
CREATE TABLE IF NOT EXISTS file_access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    account_id TEXT,
    device_id TEXT,
    file_path TEXT NOT NULL,
    action TEXT NOT NULL,
    access_time TEXT NOT NULL,
    file_hash TEXT,
    bytes_transferred INTEGER DEFAULT 0,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE SET NULL
);

-- 8. EMAIL RECORDS TABLE
CREATE TABLE IF NOT EXISTS email_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    sent_time TEXT NOT NULL,
    body_snippet TEXT,
    has_attachment INTEGER DEFAULT 0,
    attachment_name TEXT,
    attachment_hash TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

-- 9. INVESTIGATION EVENTS (TIMELINE) TABLE
CREATE TABLE IF NOT EXISTS investigation_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL UNIQUE,
    case_id TEXT NOT NULL,
    event_time TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    related_evidence_id TEXT,
    related_person_id TEXT,
    related_device_id TEXT,
    severity TEXT NOT NULL DEFAULT 'Medium',
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (related_evidence_id) REFERENCES evidence(evidence_id) ON DELETE SET NULL,
    FOREIGN KEY (related_person_id) REFERENCES persons(person_id) ON DELETE SET NULL,
    FOREIGN KEY (related_device_id) REFERENCES devices(device_id) ON DELETE SET NULL
);

-- 10. EVIDENCE RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS evidence_relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    source_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    weight REAL DEFAULT 1.0,
    notes TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE
);

-- 11. USERS / INVESTIGATORS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    badge_number TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Forensic Investigator',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_persons_case ON persons(case_id);
CREATE INDEX IF NOT EXISTS idx_devices_case ON devices(case_id);
CREATE INDEX IF NOT EXISTS idx_accounts_case ON accounts(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON evidence(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_login_case ON login_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_file_case ON file_access_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_email_case ON email_records(case_id);
CREATE INDEX IF NOT EXISTS idx_events_case ON investigation_events(case_id);
CREATE INDEX IF NOT EXISTS idx_events_time ON investigation_events(event_time);
CREATE INDEX IF NOT EXISTS idx_rel_case ON evidence_relationships(case_id);
CREATE INDEX IF NOT EXISTS idx_rel_source ON evidence_relationships(source_id);
CREATE INDEX IF NOT EXISTS idx_rel_target ON evidence_relationships(target_id);
