/**
 * DATABASE SEED SCRIPT
 * Populates 10 comprehensive fictional digital crime cases with:
 * - 10 Cases
 * - 30 Persons of Interest
 * - 20 Hardware Devices
 * - 30 User Accounts
 * - 100 Evidence Records (plus duplicate items for hash table testing)
 * - 50 Login Records
 * - 50 File Access Records
 * - 30 Email Records
 * - 60+ Evidence Relationships
 * - 70+ Timeline Events
 * - 2 Demonstration Investigator Users
 * - Audit logs & Data Structure validation records
 */

const { getDatabase, initDatabase } = require('../backend/database');

function seedData() {
    const db = getDatabase();
    initDatabase();

    // Check if cases already exist to prevent duplicate insertions
    const existing = db.prepare('SELECT COUNT(*) as count FROM cases').get();
    if (existing && existing.count >= 10) {
        console.log(`[Seed] Database already contains ${existing.count} cases. Skipping seed.`);
        return;
    }

    console.log('[Seed] Seeding comprehensive digital forensics dataset...');

    // 1. SEED INVESTIGATOR USERS
    const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (username, password_hash, full_name, badge_number, role)
        VALUES (?, ?, ?, ?, ?)
    `);
    insertUser.run('admin', 'admin123', 'Special Agent Sarah Connor', 'DF-7701', 'Lead Digital Forensic Investigator');
    insertUser.run('analyst', 'forensics2026', 'Examiner Alex Mercer', 'DF-9244', 'Senior Forensic Analyst');

    // 2. SEED 10 FICTIONAL CASES
    const cases = [
        {
            case_id: 'CASE-2026-001',
            title: 'Corporate Data Theft (Project Aegis)',
            category: 'Corporate Data Theft',
            description: 'Mass exfiltration of proprietary source code repositories and cryptographic keys outside business hours via external storage media.',
            background: 'On the night of March 12, 2026, network alarms flagged an anomalous 4.8 GB archive transfer from the primary Git development server to an unauthorized workstation terminal, followed by immediate USB mass storage activity.',
            incident_date: '2026-03-12 23:45:00',
            status: 'Active',
            lead_investigator: 'Special Agent Sarah Connor',
            severity: 'Critical'
        },
        {
            case_id: 'CASE-2026-002',
            title: 'Suspicious Account Access & MFA Bypass',
            category: 'Suspicious Account Access',
            description: 'Domain Administrator account hijacked from non-standard IP address through automated push-bombing MFA fatigue attack.',
            background: 'Security Operations Center (SOC) detected 48 consecutive Duo MFA push notifications sent within 7 minutes to an IT administrator before an anomalous approval was registered from a residential IP in Eastern Europe.',
            incident_date: '2026-03-14 02:15:00',
            status: 'Active',
            lead_investigator: 'Examiner Alex Mercer',
            severity: 'Critical'
        },
        {
            case_id: 'CASE-2026-003',
            title: 'Missing Executive Laptop Investigation',
            category: 'Missing Laptop Investigation',
            description: 'Chief Commercial Officer laptop reported stolen from executive terminal; attempts detected to extract BitLocker recovery keys.',
            background: 'A Lenovo ThinkPad containing unreleased quarterly forecasts and client PII was taken from an airport lounge. Within three hours, unauthorized Azure AD key-vault queries were logged.',
            incident_date: '2026-03-15 16:30:00',
            status: 'Under Review',
            lead_investigator: 'Special Agent Sarah Connor',
            severity: 'High'
        },
        {
            case_id: 'CASE-2026-004',
            title: 'Financial Record Manipulation in ERP',
            category: 'Financial Record Manipulation',
            description: 'Direct SQL manipulation of vendor routing tables and transaction rollback entries preceding quarterly financial audit.',
            background: 'Internal audit discovered a discrepancy of $840,000 between general ledger statements and banking clearinghouse logs. Audit logs reveal direct DB write queries from an administrative console.',
            incident_date: '2026-03-16 19:10:00',
            status: 'Active',
            lead_investigator: 'Examiner Alex Mercer',
            severity: 'Critical'
        },
        {
            case_id: 'CASE-2026-005',
            title: 'Insider M&A Confidential Information Leak',
            category: 'Insider Information Leak',
            description: 'Unannounced merger presentation deck leaked to financial press through encrypted external personal email channels.',
            background: 'A confidential acquisition slide deck marked strictly for board members was quoted word-for-word in an online tech journal. Exfiltration telemetry shows an encrypted PDF created shortly before the leak.',
            incident_date: '2026-03-17 11:20:00',
            status: 'Active',
            lead_investigator: 'Special Agent Sarah Connor',
            severity: 'High'
        },
        {
            case_id: 'CASE-2026-006',
            title: 'Targeted HR Spear-Phishing Campaign',
            category: 'Phishing and Suspicious Email Investigation',
            description: 'Deceptive DocuSign compensation review lure harvesting corporate Microsoft 365 credentials from human resources staff.',
            background: 'Multiple HR employees clicked a spoofed DocuSign notification hosted on an adversary reverse proxy. Compromised session tokens were immediately leveraged to search email inboxes for tax documents.',
            incident_date: '2026-03-18 09:05:00',
            status: 'Active',
            lead_investigator: 'Examiner Alex Mercer',
            severity: 'High'
        },
        {
            case_id: 'CASE-2026-007',
            title: 'Unauthorized Customer Database Access (SQLi)',
            category: 'Unauthorized Database Access',
            description: 'Exploitation of legacy customer portal API allowing automated extraction of 50,000 personal identifiable records.',
            background: 'Database query volume spiked by 12,000% at midnight. Web server access logs indicate boolean-based blind SQL injection injected through the order tracking query parameter.',
            incident_date: '2026-03-19 00:30:00',
            status: 'Active',
            lead_investigator: 'Special Agent Sarah Connor',
            severity: 'Critical'
        },
        {
            case_id: 'CASE-2026-008',
            title: 'Digital Vendor Contract Tampering',
            category: 'Digital Document Tampering',
            description: 'Post-signature alteration of PDF procurement agreement with forged X.509 timestamps to inflate milestone payouts.',
            background: 'Procurement legal team noticed that a vendor agreement exhibited font rendering differences on page 14 and an invalid digital signature cross-reference timestamp table.',
            incident_date: '2026-03-20 14:40:00',
            status: 'Under Review',
            lead_investigator: 'Examiner Alex Mercer',
            severity: 'Medium'
        },
        {
            case_id: 'CASE-2026-009',
            title: 'Anti-Forensic File Deletion & Scrubbing',
            category: 'Deleted File Investigation',
            description: 'Systematic zero-fill shredding of project design directories and Volume Shadow Copies prior to court-ordered seizure.',
            background: 'Upon serving a preservation order on an engineering workstation, forensic examiners discovered $UsnJrnl wiping records, empty shadow copies, and residue from a multi-pass DoD wiping utility.',
            incident_date: '2026-03-21 17:55:00',
            status: 'Active',
            lead_investigator: 'Special Agent Sarah Connor',
            severity: 'Critical'
        },
        {
            case_id: 'CASE-2026-010',
            title: 'Rogue Hardware Keylogger Connection',
            category: 'Suspicious Device Connection',
            description: 'Unauthorized USB Rubber Ducky keystroke injector inserted into financial trading floor terminal executing encoded commands.',
            background: 'Physical security cameras and Windows Event 2003 logged a physical hardware insertion at Terminal 08. The device emulated a keyboard typing at 900 words per minute to launch an obfuscated PowerShell payload.',
            incident_date: '2026-03-22 08:12:00',
            status: 'Active',
            lead_investigator: 'Examiner Alex Mercer',
            severity: 'Critical'
        }
    ];

    const insertCase = db.prepare(`
        INSERT INTO cases (case_id, title, category, description, background, incident_date, status, lead_investigator, severity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of cases) {
        insertCase.run(c.case_id, c.title, c.category, c.description, c.background, c.incident_date, c.status, c.lead_investigator, c.severity);
    }

    // 3. SEED 30 PERSONS OF INTEREST (3 PER CASE)
    const persons = [
        // Case 1
        { person_id: 'PER-001', case_id: 'CASE-2026-001', name: 'Marcus Vance', role: 'Lead Firmware Architect', status: 'Person of Interest', department: 'R&D Engineering', email: 'mvance@aegis-corp.com', phone: '+1-555-0101', notes: 'Resigned on March 13 to join competitor; had highest repository commit access.' },
        { person_id: 'PER-002', case_id: 'CASE-2026-001', name: 'Elena Rostova', role: 'DevOps Security Engineer', status: 'Witness', department: 'Infrastructure', email: 'erostova@aegis-corp.com', phone: '+1-555-0102', notes: 'Configured Git mirror servers; alerted SOC regarding anomalous off-hours egress.' },
        { person_id: 'PER-003', case_id: 'CASE-2026-001', name: 'David Chen', role: 'VP of Software Engineering', status: 'Custodian', department: 'Executive', email: 'dchen@aegis-corp.com', phone: '+1-555-0103', notes: 'Authorized source code repository access audits and signed preservation order.' },
        // Case 2
        { person_id: 'PER-004', case_id: 'CASE-2026-002', name: 'Sarah Jenkins', role: 'Senior Systems Administrator', status: 'Person of Interest', department: 'IT Infrastructure', email: 'sjenkins@aegis-corp.com', phone: '+1-555-0104', notes: 'Owner of the compromised domain admin credentials; claims phone was buzzing repeatedly with MFA prompts.' },
        { person_id: 'PER-005', case_id: 'CASE-2026-002', name: 'Viktor Miller', role: 'SOC Incident Lead', status: 'Witness', department: 'Cyber Defense', email: 'vmiller@aegis-corp.com', phone: '+1-555-0105', notes: 'First to correlate external VPN IP with Tor exit node telemetry.' },
        { person_id: 'PER-006', case_id: 'CASE-2026-002', name: 'Chloe Adams', role: 'Helpdesk Technician', status: 'Witness', department: 'IT Support', email: 'cadams@aegis-corp.com', phone: '+1-555-0106', notes: 'Received a suspicious phone call 2 hours prior asking to reset Jenkins MFA bypass tokens.' },
        // Case 3
        { person_id: 'PER-007', case_id: 'CASE-2026-003', name: 'Richard Holloway', role: 'Chief Commercial Officer', status: 'Custodian', department: 'Commercial Sales', email: 'rholloway@aegis-corp.com', phone: '+1-555-0107', notes: 'Reported laptop stolen from SkyClub lounge; claims device was powered down with BitLocker.' },
        { person_id: 'PER-008', case_id: 'CASE-2026-003', name: 'Kevin Patel', role: 'Corporate Travel Coordinator', status: 'Witness', department: 'Operations', email: 'kpatel@aegis-corp.com', phone: '+1-555-0108', notes: 'Booked travel itinerary and corroborated departure timeline.' },
        { person_id: 'PER-009', case_id: 'CASE-2026-003', name: 'Amanda Cruz', role: 'Cloud Endpoint Administrator', status: 'Person of Interest', department: 'Cloud Infrastructure', email: 'acruz@aegis-corp.com', phone: '+1-555-0109', notes: 'Logged in to Azure AD Key Vault to query BitLocker keys 45 minutes after reported theft.' },
        // Case 4
        { person_id: 'PER-010', case_id: 'CASE-2026-004', name: 'Bradley Cooper', role: 'Senior Financial Controller', status: 'Person of Interest', department: 'Finance & Treasury', email: 'bcooper@aegis-corp.com', phone: '+1-555-0110', notes: 'Sole approver of modified wire transfer batch #4091; accessed terminal late Sunday evening.' },
        { person_id: 'PER-011', case_id: 'CASE-2026-004', name: 'Priya Sharma', role: 'Internal Forensic Auditor', status: 'Witness', department: 'Internal Audit', email: 'psharma@aegis-corp.com', phone: '+1-555-0111', notes: 'Discovered the $840k reconciliation discrepancy during automated journal audits.' },
        { person_id: 'PER-012', case_id: 'CASE-2026-004', name: 'Gregory Vance', role: 'Database Administrator', status: 'Custodian', department: 'Database Systems', email: 'gvance@aegis-corp.com', phone: '+1-555-0112', notes: 'Preserved ERP Oracle transaction rollback logs and database snapshots.' },
        // Case 5
        { person_id: 'PER-013', case_id: 'CASE-2026-005', name: 'Jonathan Sterling', role: 'Director of Corporate Strategy', status: 'Person of Interest', department: 'Strategy & M&A', email: 'jsterling@aegis-corp.com', phone: '+1-555-0113', notes: 'Authored confidential acquisition slide deck; phone telemetry shows photos taken of confidential monitor.' },
        { person_id: 'PER-014', case_id: 'CASE-2026-005', name: 'Natalie Morales', role: 'General Legal Counsel', status: 'Custodian', department: 'Legal Affairs', email: 'nmorales@aegis-corp.com', phone: '+1-555-0114', notes: 'Issued NDA agreements and requested forensic review of board presentation access logs.' },
        { person_id: 'PER-015', case_id: 'CASE-2026-005', name: 'Simon Drake', role: 'Executive Assistant to Board', status: 'Witness', department: 'Executive Secretariat', email: 'sdrake@aegis-corp.com', phone: '+1-555-0115', notes: 'Managed calendar invites and digital distribution lists for the executive committee.' },
        // Case 6
        { person_id: 'PER-016', case_id: 'CASE-2026-006', name: 'Rebecca Stone', role: 'VP of Human Resources', status: 'Person of Interest', department: 'Human Resources', email: 'rstone@aegis-corp.com', phone: '+1-555-0116', notes: 'Clicked malicious phishing URL in simulated DocuSign email and submitted credentials.' },
        { person_id: 'PER-017', case_id: 'CASE-2026-006', name: 'Tyler Reed', role: 'Senior Threat Hunter', status: 'Witness', department: 'Cyber Defense', email: 'treed@aegis-corp.com', phone: '+1-555-0117', notes: 'Intercepted reverse proxy traffic and isolated compromised M365 tenant sessions.' },
        { person_id: 'PER-018', case_id: 'CASE-2026-006', name: 'Melissa Wong', role: 'Payroll Specialist', status: 'Witness', department: 'Payroll Ops', email: 'mwong@aegis-corp.com', phone: '+1-555-0118', notes: 'Forwarded suspicious email to phishing-report@aegis-corp.com after noticing domain typosquat.' },
        // Case 7
        { person_id: 'PER-019', case_id: 'CASE-2026-007', name: 'Daniel Foster', role: 'Lead Backend Web Architect', status: 'Custodian', department: 'Web Application Ops', email: 'dfoster@aegis-corp.com', phone: '+1-555-0119', notes: 'Maintained legacy PHP customer portal API endpoints; identified unescaped SQL parameter.' },
        { person_id: 'PER-020', case_id: 'CASE-2026-007', name: 'Irene Kim', role: 'PostgreSQL Database Admin', status: 'Witness', department: 'Data Platform', email: 'ikim@aegis-corp.com', phone: '+1-555-0120', notes: 'Detected massive 50,000 row query dump in slow query log matching boolean injection.' },
        { person_id: 'PER-021', case_id: 'CASE-2026-007', name: 'Lucas Gray', role: 'Security Compliance Auditor', status: 'Person of Interest', department: 'Infosec Audit', email: 'lgray@aegis-corp.com', phone: '+1-555-0121', notes: 'Conducted external port scans 24 hours prior to incident without scheduled authorization.' },
        // Case 8
        { person_id: 'PER-022', case_id: 'CASE-2026-008', name: 'Arthur Pendelton', role: 'Procurement Vice President', status: 'Person of Interest', department: 'Global Procurement', email: 'apendelton@aegis-corp.com', phone: '+1-555-0122', notes: 'Submitted altered contract for executive countersignature; had significant personal debt.' },
        { person_id: 'PER-023', case_id: 'CASE-2026-008', name: 'Claire Beauchamp', role: 'Contract Compliance Specialist', status: 'Witness', department: 'Legal Compliance', email: 'cbeauchamp@aegis-corp.com', phone: '+1-555-0123', notes: 'Identified visual font differences and missing SHA-256 certificate revocation stamp on page 14.' },
        { person_id: 'PER-024', case_id: 'CASE-2026-008', name: 'Derek Hayes', role: 'Vendor Key Account Executive', status: 'Witness', department: 'External Vendor Corp', email: 'dhayes@apex-vendors.com', phone: '+1-555-0124', notes: 'Provided original signed PDF with authentic cryptographic cross-reference table.' },
        // Case 9
        { person_id: 'PER-025', case_id: 'CASE-2026-009', name: 'Walter Whiteley', role: 'Director of Advanced Robotics', status: 'Person of Interest', department: 'Robotics R&D', email: 'wwhiteley@aegis-corp.com', phone: '+1-555-0125', notes: 'Workstation underwent 7-pass DoD wiping minutes before legal hold team arrived.' },
        { person_id: 'PER-026', case_id: 'CASE-2026-009', name: 'Sophia Martinez', role: 'Lead Digital Evidence Specialist', status: 'Witness', department: 'Forensic Lab', email: 'smartinez@aegis-corp.com', phone: '+1-555-0126', notes: 'Carved deleted Master File Table ($MFT) fragments and uncovered SDelete execution prefetch.' },
        { person_id: 'PER-027', case_id: 'CASE-2026-009', name: 'Ian Black', role: 'Systems Deployment Tech', status: 'Witness', department: 'Desktop Support', email: 'iblack@aegis-corp.com', phone: '+1-555-0127', notes: 'Confirmed that corporate endpoint image never included third-party secure shredding utilities.' },
        // Case 10
        { person_id: 'PER-028', case_id: 'CASE-2026-010', name: 'Zachary Taylor', role: 'Senior Quantitative Trader', status: 'Person of Interest', department: 'Capital Markets', email: 'ztaylor@aegis-corp.com', phone: '+1-555-0128', notes: 'Trading terminal 08 assigned to him; desk security camera shows unauthorized physical tampering.' },
        { person_id: 'PER-029', case_id: 'CASE-2026-010', name: 'Olivia Bennett', role: 'Physical Access Control Officer', status: 'Witness', department: 'Physical Security', email: 'obennett@aegis-corp.com', phone: '+1-555-0129', notes: 'Provided RFID turnstile badge logs showing anomalous weekend access.' },
        { person_id: 'PER-030', case_id: 'CASE-2026-010', name: 'Nathan Cross', role: 'Facilities Network Engineer', status: 'Witness', department: 'Network Engineering', email: 'ncross@aegis-corp.com', phone: '+1-555-0130', notes: 'Captured network tap traffic displaying reverse shell beaconing from Terminal 08.' }
    ];

    const insertPerson = db.prepare(`
        INSERT INTO persons (person_id, case_id, name, role, status, department, email, phone, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of persons) {
        insertPerson.run(p.person_id, p.case_id, p.name, p.role, p.status, p.department, p.email, p.phone, p.notes);
    }

    // 4. SEED 20 HARDWARE DEVICES (2 PER CASE)
    const devices = [
        { device_id: 'DEV-001', case_id: 'CASE-2026-001', device_name: 'Workstation-WS-902', device_type: 'Engineering Workstation', operating_system: 'Ubuntu 24.04 LTS', mac_address: '00:1A:2B:3C:4D:5E', serial_number: 'SN-ENG-8841', assigned_person_id: 'PER-001', status: 'Seized', notes: 'Marcus Vance primary CAD and development terminal.' },
        { device_id: 'DEV-002', case_id: 'CASE-2026-001', device_name: 'Kingston DataTraveler 64GB', device_type: 'USB Mass Storage', operating_system: 'FAT32 ExFAT', mac_address: 'N/A', serial_number: 'USB-SN-498271', assigned_person_id: 'PER-001', status: 'Imaged', notes: 'Recovered from suspect desk; contains matching SHA-256 archive.' },
        
        { device_id: 'DEV-003', case_id: 'CASE-2026-002', device_name: 'Bastion-Jump-SVR01', device_type: 'Linux Bastion Server', operating_system: 'Debian 12', mac_address: '52:54:00:12:34:56', serial_number: 'SRV-BST-001', assigned_person_id: 'PER-004', status: 'Active', notes: 'Used as jump server for enterprise domain management.' },
        { device_id: 'DEV-004', case_id: 'CASE-2026-002', device_name: 'Admin-Laptop-Dell-7420', device_type: 'Laptop', operating_system: 'Windows 11 Enterprise', mac_address: 'B4:2E:99:A1:C3:DF', serial_number: 'DELL-SN-9281', assigned_person_id: 'PER-004', status: 'Imaged', notes: 'Sarah Jenkins administrative laptop; Duo authenticator host.' },

        { device_id: 'DEV-005', case_id: 'CASE-2026-003', device_name: 'Lenovo ThinkPad X1 Carbon', device_type: 'Executive Laptop', operating_system: 'Windows 11 Pro', mac_address: 'F0:76:1C:88:99:AA', serial_number: 'LNV-X1C-3021', assigned_person_id: 'PER-007', status: 'Missing', notes: 'Stolen laptop reported at terminal; BitLocker hardware TPM protected.' },
        { device_id: 'DEV-006', case_id: 'CASE-2026-003', device_name: 'Executive iPhone 15 Pro', device_type: 'Smartphone', operating_system: 'iOS 18.2', mac_address: 'AC:BC:32:77:88:99', serial_number: 'APL-IP15-772', assigned_person_id: 'PER-007', status: 'Active', notes: 'Used for corporate MFA and Outlook synchronization.' },

        { device_id: 'DEV-007', case_id: 'CASE-2026-004', device_name: 'Fin-Terminal-WS-04', device_type: 'Workstation', operating_system: 'Windows 10 Enterprise', mac_address: '00:50:56:A1:B2:C3', serial_number: 'HP-Z4-4412', assigned_person_id: 'PER-010', status: 'Seized', notes: 'Terminal used to issue manual SQL update to ERP database.' },
        { device_id: 'DEV-008', case_id: 'CASE-2026-004', device_name: 'ERP-Database-Cluster-Node1', device_type: 'Database Server', operating_system: 'Red Hat Enterprise Linux 9', mac_address: '00:0C:29:4F:8E:11', serial_number: 'ORCL-SVR-882', assigned_person_id: 'PER-012', status: 'Active', notes: 'Houses core accounting schema and vendor ledger records.' },

        { device_id: 'DEV-009', case_id: 'CASE-2026-005', device_name: 'iPad Pro 12.9 (M2)', device_type: 'Tablet', operating_system: 'iPadOS 17.5', mac_address: '3C:06:30:D4:E5:F6', serial_number: 'APL-IPAD-901', assigned_person_id: 'PER-013', status: 'Imaged', notes: 'Device synchronized with executive strategy SharePoint folder.' },
        { device_id: 'DEV-010', case_id: 'CASE-2026-005', device_name: 'Galaxy S23 Personal', device_type: 'Smartphone', operating_system: 'Android 14', mac_address: '88:75:56:33:22:11', serial_number: 'SM-S911-382', assigned_person_id: 'PER-013', status: 'Imaged', notes: 'Personal mobile device containing photo of classified slide.' },

        { device_id: 'DEV-011', case_id: 'CASE-2026-006', device_name: 'HR-Workstation-WS-12', device_type: 'Workstation', operating_system: 'Windows 11 Enterprise', mac_address: '00:26:B9:77:88:99', serial_number: 'DELL-OPT-129', assigned_person_id: 'PER-016', status: 'Isolated', notes: 'Target terminal where phishing link was opened in Edge browser.' },
        { device_id: 'DEV-012', case_id: 'CASE-2026-006', device_name: 'SOC-Analysis-Rig', device_type: 'Forensic Workstation', operating_system: 'Kali Linux 2026.1', mac_address: '00:15:5D:EE:FF:11', serial_number: 'FOR-RIG-007', assigned_person_id: 'PER-017', status: 'Active', notes: 'Dedicated analysis node used to deconstruct phishing reverse proxy.' },

        { device_id: 'DEV-013', case_id: 'CASE-2026-007', device_name: 'Customer-Web-Portal-VM01', device_type: 'Cloud Web Server', operating_system: 'Ubuntu 22.04 LTS', mac_address: '02:42:AC:11:00:02', serial_number: 'AWS-EC2-8831', assigned_person_id: 'PER-019', status: 'Isolated', notes: 'Exposed port 443 with unvalidated search parameter vulnerable to SQLi.' },
        { device_id: 'DEV-014', case_id: 'CASE-2026-007', device_name: 'Production-Postgres-Cluster', device_type: 'Database Cluster', operating_system: 'Rocky Linux 9', mac_address: '02:42:AC:11:00:05', serial_number: 'AWS-RDS-9901', assigned_person_id: 'PER-020', status: 'Active', notes: 'Target database housing 50,000 customer PII records.' },

        { device_id: 'DEV-015', case_id: 'CASE-2026-008', device_name: 'Procurement-Desktop-02', device_type: 'Workstation', operating_system: 'Windows 11 Enterprise', mac_address: '70:85:C2:11:22:33', serial_number: 'LNV-TC-4402', assigned_person_id: 'PER-022', status: 'Seized', notes: 'Arthur Pendelton workstation; contains Acrobat DC installation and modified PDF.' },
        { device_id: 'DEV-016', case_id: 'CASE-2026-008', device_name: 'DocuSign-Appliance-Gateway', device_type: 'PKI Security Appliance', operating_system: 'Hardened Linux', mac_address: '00:1B:78:99:AA:BB', serial_number: 'DS-APPL-712', assigned_person_id: 'PER-023', status: 'Active', notes: 'Validates cryptographic certificate stamps and timestamp authority.' },

        { device_id: 'DEV-017', case_id: 'CASE-2026-009', device_name: 'Robotics-Lab-Workstation-R9', device_type: 'Engineering Rig', operating_system: 'Windows 10 Pro', mac_address: 'E4:54:E8:44:55:66', serial_number: 'CST-RIG-991', assigned_person_id: 'PER-025', status: 'Seized', notes: 'Target of multi-pass disk wiping software SDelete.' },
        { device_id: 'DEV-018', case_id: 'CASE-2026-009', device_name: 'Samsung 980 Pro NVMe 2TB', device_type: 'Internal NVMe SSD', operating_system: 'NTFS Partition', mac_address: 'N/A', serial_number: 'SAMS-NVME-8841', assigned_person_id: 'PER-025', status: 'Imaged', notes: 'Physical solid state drive extracted for bit-stream disk imaging.' },

        { device_id: 'DEV-019', case_id: 'CASE-2026-010', device_name: 'Trading-Floor-Terminal-08', device_type: 'Financial Trading Terminal', operating_system: 'Windows 11 Pro', mac_address: '00:25:90:76:54:32', serial_number: 'HP-WS-8830', assigned_person_id: 'PER-028', status: 'Seized', notes: 'Workstation physically injected with USB Rubber Ducky device.' },
        { device_id: 'DEV-020', case_id: 'CASE-2026-010', device_name: 'USB-Rubber-Ducky-Injector', device_type: 'HID Keystroke Injector', operating_system: 'Custom Firmware', mac_address: 'N/A', serial_number: 'DUCKY-V3-1092', assigned_person_id: 'PER-028', status: 'Seized', notes: 'Recovered hardware disguised as flash drive; injected Base64 PowerShell.' }
    ];

    const insertDevice = db.prepare(`
        INSERT INTO devices (device_id, case_id, device_name, device_type, operating_system, mac_address, serial_number, assigned_person_id, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of devices) {
        insertDevice.run(d.device_id, d.case_id, d.device_name, d.device_type, d.operating_system, d.mac_address, d.serial_number, d.assigned_person_id, d.status, d.notes);
    }

    // 5. SEED 30 USER ACCOUNTS (3 PER CASE)
    const accounts = [
        { account_id: 'ACC-001', case_id: 'CASE-2026-001', username: 'mvance', service_name: 'Active Directory Domain', privilege_level: 'Senior Developer', assigned_person_id: 'PER-001', status: 'Suspended' },
        { account_id: 'ACC-002', case_id: 'CASE-2026-001', username: 'erostova_admin', service_name: 'Git Enterprise Server', privilege_level: 'DevOps Administrator', assigned_person_id: 'PER-002', status: 'Active' },
        { account_id: 'ACC-003', case_id: 'CASE-2026-001', username: 'dchen_vp', service_name: 'Corporate Portal', privilege_level: 'Executive', assigned_person_id: 'PER-003', status: 'Active' },

        { account_id: 'ACC-004', case_id: 'CASE-2026-002', username: 'sjenkins_adm', service_name: 'Azure Active Directory', privilege_level: 'Global Administrator', assigned_person_id: 'PER-004', status: 'Suspended' },
        { account_id: 'ACC-005', case_id: 'CASE-2026-002', username: 'vmiller_sec', service_name: 'Splunk SIEM Console', privilege_level: 'Security Analyst', assigned_person_id: 'PER-005', status: 'Active' },
        { account_id: 'ACC-006', case_id: 'CASE-2026-002', username: 'cadams_help', service_name: 'ServiceNow Desk', privilege_level: 'Support Tech', assigned_person_id: 'PER-006', status: 'Active' },

        { account_id: 'ACC-007', case_id: 'CASE-2026-003', username: 'rholloway_cco', service_name: 'Microsoft 365 Cloud', privilege_level: 'Executive Access', assigned_person_id: 'PER-007', status: 'Active' },
        { account_id: 'ACC-008', case_id: 'CASE-2026-003', username: 'kpatel_ops', service_name: 'Concur Travel', privilege_level: 'Standard User', assigned_person_id: 'PER-008', status: 'Active' },
        { account_id: 'ACC-009', case_id: 'CASE-2026-003', username: 'acruz_cloud', service_name: 'Azure Key Vault', privilege_level: 'Cloud Security Admin', assigned_person_id: 'PER-009', status: 'Under Review' },

        { account_id: 'ACC-010', case_id: 'CASE-2026-004', username: 'bcooper_ctl', service_name: 'SAP ERP Financials', privilege_level: 'Financial Controller', assigned_person_id: 'PER-010', status: 'Suspended' },
        { account_id: 'ACC-011', case_id: 'CASE-2026-004', username: 'psharma_aud', service_name: 'Audit Vault Pro', privilege_level: 'Auditor Read-Only', assigned_person_id: 'PER-011', status: 'Active' },
        { account_id: 'ACC-012', case_id: 'CASE-2026-004', username: 'gvance_dba', service_name: 'Oracle Database Engine', privilege_level: 'DBA Sysadmin', assigned_person_id: 'PER-012', status: 'Active' },

        { account_id: 'ACC-013', case_id: 'CASE-2026-005', username: 'jsterling_dir', service_name: 'SharePoint Confidential', privilege_level: 'Strategy Director', assigned_person_id: 'PER-013', status: 'Suspended' },
        { account_id: 'ACC-014', case_id: 'CASE-2026-005', username: 'nmorales_law', service_name: 'Ironclad Contract Vault', privilege_level: 'Legal Counsel', assigned_person_id: 'PER-014', status: 'Active' },
        { account_id: 'ACC-015', case_id: 'CASE-2026-005', username: 'sdrake_sec', service_name: 'BoardVantage Portal', privilege_level: 'Secretariat Admin', assigned_person_id: 'PER-015', status: 'Active' },

        { account_id: 'ACC-016', case_id: 'CASE-2026-006', username: 'rstone_hr', service_name: 'Workday & M365', privilege_level: 'HR Administrator', assigned_person_id: 'PER-016', status: 'Compromised Flagged' },
        { account_id: 'ACC-017', case_id: 'CASE-2026-006', username: 'treed_soc', service_name: 'CrowdStrike Falcon', privilege_level: 'Incident Responder', assigned_person_id: 'PER-017', status: 'Active' },
        { account_id: 'ACC-018', case_id: 'CASE-2026-006', username: 'mwong_pay', service_name: 'ADP Workforce', privilege_level: 'Payroll Lead', assigned_person_id: 'PER-018', status: 'Active' },

        { account_id: 'ACC-019', case_id: 'CASE-2026-007', username: 'dfoster_dev', service_name: 'GitHub Enterprise', privilege_level: 'Developer', assigned_person_id: 'PER-019', status: 'Active' },
        { account_id: 'ACC-020', case_id: 'CASE-2026-007', username: 'ikim_pgadmin', service_name: 'Postgres RDS Instance', privilege_level: 'Database Admin', assigned_person_id: 'PER-020', status: 'Active' },
        { account_id: 'ACC-021', case_id: 'CASE-2026-007', username: 'lgray_audit', service_name: 'Qualys Scanner', privilege_level: 'Security Assessor', assigned_person_id: 'PER-021', status: 'Suspended' },

        { account_id: 'ACC-022', case_id: 'CASE-2026-008', username: 'apendelton_vp', service_name: 'Coupa Procurement', privilege_level: 'Procurement Approver', assigned_person_id: 'PER-022', status: 'Suspended' },
        { account_id: 'ACC-023', case_id: 'CASE-2026-008', username: 'cbeauchamp_cpl', service_name: 'DocuSign Enterprise', privilege_level: 'Compliance Reviewer', assigned_person_id: 'PER-023', status: 'Active' },
        { account_id: 'ACC-024', case_id: 'CASE-2026-008', username: 'dhayes_ext', service_name: 'Vendor Extranet', privilege_level: 'Partner External', assigned_person_id: 'PER-024', status: 'Active' },

        { account_id: 'ACC-025', case_id: 'CASE-2026-009', username: 'wwhiteley_lab', service_name: 'Active Directory Domain', privilege_level: 'R&D Principal', assigned_person_id: 'PER-025', status: 'Suspended' },
        { account_id: 'ACC-026', case_id: 'CASE-2026-009', username: 'smartinez_dfir', service_name: 'EnCase Forensic Suite', privilege_level: 'Forensic Investigator', assigned_person_id: 'PER-026', status: 'Active' },
        { account_id: 'ACC-027', case_id: 'CASE-2026-009', username: 'iblack_tech', service_name: 'SCCM Deployment', privilege_level: 'Endpoint Tech', assigned_person_id: 'PER-027', status: 'Active' },

        { account_id: 'ACC-028', case_id: 'CASE-2026-010', username: 'ztaylor_trd', service_name: 'Bloomberg Terminal', privilege_level: 'Trader Pro', assigned_person_id: 'PER-028', status: 'Suspended' },
        { account_id: 'ACC-029', case_id: 'CASE-2026-010', username: 'obennett_sec', service_name: 'Lenel OnGuard Badge', privilege_level: 'Security Operator', assigned_person_id: 'PER-029', status: 'Active' },
        { account_id: 'ACC-030', case_id: 'CASE-2026-010', username: 'ncross_net', service_name: 'Cisco DNA Center', privilege_level: 'Network Ops', assigned_person_id: 'PER-030', status: 'Active' }
    ];

    const insertAccount = db.prepare(`
        INSERT INTO accounts (account_id, case_id, username, service_name, privilege_level, assigned_person_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const a of accounts) {
        insertAccount.run(a.account_id, a.case_id, a.username, a.service_name, a.privilege_level, a.assigned_person_id, a.status);
    }

    // 6. SEED 100 EVIDENCE RECORDS (10 PER CASE) + DUPLICATE DEMONSTRATION RECORDS
    const evidenceRecords = [];
    const baseHashes = [
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
        'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'
    ];

    const caseEvidenceTemplates = [
        // Case 1: Corporate Data Theft
        [
            { id: 'EVD-2026-001', title: 'Git Archive Mirror Snapshot (Project-Aegis.tar.gz)', type: 'Archive File', source: 'Git Production Server', time: '2026-03-12 23:38:00', size: 4892019200, priority: 'High', score: 92, reason: 'Direct target of exfiltration; hash matches USB transfer', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
            { id: 'EVD-2026-002', title: 'USB Mass Storage Device Insertion Event Log', type: 'Security Event Log', source: 'Workstation-WS-902', time: '2026-03-12 23:42:15', size: 45012, priority: 'High', score: 88, reason: 'Event 20001 hardware registration matches Kingston USB serial', hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0' },
            { id: 'EVD-2026-003', title: 'Physical Kingston 64GB USB Drive Bit-Stream Image', type: 'Disk Image', source: 'Physical Device DEV-002', time: '2026-03-13 09:15:00', size: 64120300000, priority: 'High', score: 95, reason: 'Contains bit-for-bit duplicate copy of proprietary archive', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
            { id: 'EVD-2026-004', title: 'Bash History File (.bash_history) of user mvance', type: 'Forensic Text Log', source: 'Workstation-WS-902', time: '2026-03-12 23:50:10', size: 18402, priority: 'Medium', score: 72, reason: 'Shows commands: tar -czvf /media/usb/Aegis.tar.gz and history -c', hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
            { id: 'EVD-2026-005', title: 'Volatile RAM Memory Dump (ws902_mem.raw)', type: 'Memory Dump', source: 'Workstation-WS-902', time: '2026-03-13 08:30:00', size: 34359738368, priority: 'High', score: 85, reason: 'Retained decrypted SSH private key and active terminal handles', hash: '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344' },
            { id: 'EVD-2026-006', title: 'Network Firewall Egress Flow (Palo Alto PCAP)', type: 'Network Capture (PCAP)', source: 'Core Perimeter Firewall', time: '2026-03-12 23:55:00', size: 104857600, priority: 'Medium', score: 68, reason: 'Records attempt to connect to external Cloudflare tunnel', hash: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899' },
            { id: 'EVD-2026-007', title: 'Employee Resignation PDF Notice', type: 'Document Artifact', source: 'Corporate HR Portal', time: '2026-03-13 08:00:00', size: 245000, priority: 'Low', score: 40, reason: 'Confirms notice period and imminent departure to direct competitor', hash: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa' },
            { id: 'EVD-2026-008', title: 'Git Access Authentication Audit Log', type: 'Server Audit Log', source: 'Git Production Server', time: '2026-03-12 23:35:00', size: 81290, priority: 'High', score: 79, reason: 'Shows SSH public key auth from 10.10.4.15 (Workstation-WS-902)', hash: '33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122' },
            { id: 'EVD-2026-009', title: 'Building RFID Badge Reader Log', type: 'Physical Security Log', source: 'Main Entrance Turnstile', time: '2026-03-12 23:58:30', size: 12050, priority: 'Medium', score: 65, reason: 'Marcus Vance swiped exit badge at 23:58:30 carrying backpack', hash: '445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233' },
            { id: 'EVD-2026-010', title: 'Linux syslog /var/log/syslog', type: 'System Log', source: 'Workstation-WS-902', time: '2026-03-12 23:42:10', size: 5242880, priority: 'Medium', score: 70, reason: 'kernel: [89421.12] usb 2-1: new high-speed USB device number 4', hash: '66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455' }
        ],
        // Case 2: Suspicious Account Access
        [
            { id: 'EVD-2026-011', title: 'Windows Security Event Log 4624 (Remote Logon)', type: 'Security Event Log', source: 'Domain Controller DC01', time: '2026-03-14 02:14:50', size: 124500, priority: 'High', score: 94, reason: 'Logon Type 10 (RDP) from untrusted external IP 185.220.101.44', hash: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566' },
            { id: 'EVD-2026-012', title: 'Duo Security MFA Authentication Audit Stream', type: 'Cloud Audit Log', source: 'Duo Cloud Admin API', time: '2026-03-14 02:14:48', size: 98120, priority: 'High', score: 96, reason: '48 denied push prompts followed by 1 successful push approval', hash: '8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677' },
            { id: 'EVD-2026-013', title: 'PowerShell Operational Event Log 4104', type: 'Script Log', source: 'Bastion-Jump-SVR01', time: '2026-03-14 02:18:22', size: 312000, priority: 'High', score: 90, reason: 'Executed Invoke-Mimikatz and disabled Windows Defender real-time', hash: '99aabbccddeeff00112233445566778899aabbccddeeff001122334455667788' },
            { id: 'EVD-2026-014', title: 'OpenVPN Gateway Tunnel Session Log', type: 'VPN Log', source: 'Edge VPN Gateway', time: '2026-03-14 02:08:10', size: 67100, priority: 'Medium', score: 74, reason: 'Client authenticated with sjenkins credentials from Prague, CZ', hash: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778800' },
            { id: 'EVD-2026-015', title: 'Memory Dump of lsass.exe Process', type: 'Memory Dump', source: 'Bastion-Jump-SVR01', time: '2026-03-14 04:00:00', size: 1073741824, priority: 'High', score: 86, reason: 'Shows memory injection handles created by unsigned binary', hash: 'bbccddeeff00112233445566778899aabbccddeeff0011223344556677880011' },
            { id: 'EVD-2026-016', title: 'Active Directory Shadow Admin Group Changes', type: 'Directory Audit', source: 'Domain Controller DC01', time: '2026-03-14 02:22:15', size: 45000, priority: 'High', score: 89, reason: 'Added unauthorized service account svc_backup to Enterprise Admins', hash: 'ccddeeff00112233445566778899aabbccddeeff001122334455667788001122' },
            { id: 'EVD-2026-017', title: 'Helpdesk Call Center Recording Transcript', type: 'Audio Transcript', source: 'Telecom Voice System', time: '2026-03-14 00:15:00', size: 12500, priority: 'Medium', score: 62, reason: 'Caller impersonating Sarah Jenkins attempted social engineering reset', hash: 'ddeeff00112233445566778899aabbccddeeff00112233445566778800112233' },
            { id: 'EVD-2026-018', title: 'Threat Intelligence IOC Feed (Tor Exit Nodes)', type: 'Threat Intel Report', source: 'AlienVault OTX', time: '2026-03-14 02:30:00', size: 89000, priority: 'Low', score: 44, reason: 'IP 185.220.101.44 matched active Tor exit relay list', hash: 'eeff00112233445566778899aabbccddeeff0011223344556677880011223344' },
            { id: 'EVD-2026-019', title: 'Admin Laptop Mobile Authenticator App SQLite DB', type: 'Application DB', source: 'Admin-Laptop-Dell-7420', time: '2026-03-14 09:00:00', size: 512000, priority: 'Medium', score: 71, reason: 'Shows multiple prompt dismissals and fatigue click at 02:14:48', hash: 'ff00112233445566778899aabbccddeeff001122334455667788001122334455' },
            { id: 'EVD-2026-020', title: 'Network PCAP of RDP Session 3389', type: 'Network Capture (PCAP)', source: 'Internal Switch SPAN', time: '2026-03-14 02:16:00', size: 84000000, priority: 'Medium', score: 69, reason: 'Encrypted TLS RDP negotiation with client hostname "KALI-PENTEST"', hash: '00112233445566778899aabbccddeeff00112233445566778800112233445566' }
        ],
        // Case 3: Missing Laptop Investigation
        [
            { id: 'EVD-2026-021', title: 'Intune MDM Remote Wipe Signal Log', type: 'Cloud MDM Log', source: 'Microsoft Intune Portal', time: '2026-03-15 17:15:00', size: 34000, priority: 'High', score: 84, reason: 'Remote wipe dispatched but device dropped offline prior to receipt', hash: '112233445566778899aabbccddeeff0011223344556677880011223344556677' },
            { id: 'EVD-2026-022', title: 'Airport CCTV Security Timestamp Log', type: 'Physical Security Log', source: 'SkyClub Security Office', time: '2026-03-15 16:28:10', size: 8900, priority: 'Medium', score: 66, reason: 'Video shows subject in trench coat removing laptop sleeve from table', hash: '2233445566778899aabbccddeeff001122334455667788001122334455667788' },
            { id: 'EVD-2026-023', title: 'Azure AD Key Vault BitLocker Query Audit', type: 'Audit Log', source: 'Azure Key Vault API', time: '2026-03-15 17:12:45', size: 45000, priority: 'High', score: 93, reason: 'Query for Recovery Key ID 9B71-E401 executed by user acruz_cloud', hash: '33445566778899aabbccddeeff00112233445566778800112233445566778899' },
            { id: 'EVD-2026-024', title: 'Bluetooth Beacon Proximity Log', type: 'Wireless Telemetry', source: 'SkyClub BLE Sensors', time: '2026-03-15 16:32:00', size: 19800, priority: 'Low', score: 42, reason: 'Last ping from ThinkPad BLE chip detected near Terminal B Exit', hash: '445566778899aabbccddeeff00112233445566778800112233445566778899aa' },
            { id: 'EVD-2026-025', title: 'Executive Smartphone Geolocation History', type: 'GPS Telemetry', source: 'Executive iPhone 15 Pro', time: '2026-03-15 16:30:00', size: 120000, priority: 'Low', score: 38, reason: 'Corroborates CCO presence at boarding gate B14 during incident', hash: '5566778899aabbccddeeff00112233445566778800112233445566778899aabb' },
            { id: 'EVD-2026-026', title: 'Endpoint BitLocker TPM Configuration Export', type: 'Hardware Config', source: 'Enterprise Endpoint Backup', time: '2026-03-10 00:00:00', size: 8400, priority: 'Medium', score: 60, reason: 'Proves XTS-AES 256 encryption was enforced on internal disk', hash: '66778899aabbccddeeff00112233445566778800112233445566778899aabbcc' },
            { id: 'EVD-2026-027', title: 'Wi-Fi Probe Request Capture (MAC Spoofing)', type: 'Wireless Capture', source: 'Airport Free Wi-Fi Gateway', time: '2026-03-15 17:05:12', size: 540000, priority: 'High', score: 81, reason: 'Target MAC F0:76:1C:88:99:AA probed "Airport_Guest" at 17:05:12', hash: '778899aabbccddeeff00112233445566778800112233445566778899aabbccdd' },
            { id: 'EVD-2026-028', title: 'Corporate Security Incident First Report', type: 'Investigative Report', source: 'Corporate Security Office', time: '2026-03-15 16:50:00', size: 28400, priority: 'Low', score: 35, reason: 'Initial statement filed by Richard Holloway upon noticing bag missing', hash: '8899aabbccddeeff00112233445566778800112233445566778899aabbccddeeff' },
            { id: 'EVD-2026-029', title: 'Office 365 Exchange Login Failure from Device', type: 'Identity Log', source: 'Azure AD Entra ID', time: '2026-03-15 17:08:40', size: 31000, priority: 'High', score: 78, reason: 'Account locked out after 5 consecutive bad PIN attempts at Windows login', hash: '99aabbccddeeff00112233445566778800112233445566778899aabbccddeeff00' },
            { id: 'EVD-2026-030', title: 'Asset Inventory Hardware Tag Record', type: 'CMDB Asset Record', source: 'ServiceNow Asset DB', time: '2026-01-15 10:00:00', size: 4500, priority: 'Low', score: 30, reason: 'Confirms serial LNV-X1C-3021 and assigned owner Richard Holloway', hash: '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff11' }
        ],
        // Case 4: Financial Record Manipulation
        [
            { id: 'EVD-2026-031', title: 'Oracle Redo Log Archive (redo04.log)', type: 'Database Redo Log', source: 'ERP-Database-Cluster-Node1', time: '2026-03-16 19:08:24', size: 52428800, priority: 'High', score: 96, reason: 'Explicit SQL UPDATE on AP_VENDOR_PAYMENTS SET ROUTING_NO = 021000021', hash: '1234432112344321123443211234432112344321123443211234432112344321' },
            { id: 'EVD-2026-032', title: 'ERP User Audit Trail for bcooper_ctl', type: 'Application Audit Log', source: 'SAP ERP Financials', time: '2026-03-16 19:04:10', size: 89000, priority: 'High', score: 91, reason: 'Shows direct transaction SE16N table override executed by Bradley Cooper', hash: '2345543223455432234554322345543223455432234554322345543223455432' },
            { id: 'EVD-2026-033', title: 'Automated Wire Transfer Batch File (#4091.xml)', type: 'Financial XML Payload', source: 'Fin-Terminal-WS-04', time: '2026-03-16 19:15:00', size: 145000, priority: 'High', score: 95, reason: 'Batch routed $840,000 to offshore shell entity Cayman Global Holdings', hash: '3456654334566543345665433456654334566543345665433456654334566543' },
            { id: 'EVD-2026-034', title: 'Internal Auditor Discrepancy Spreadsheet', type: 'Audit Workpaper', source: 'Audit Shared Drive', time: '2026-03-17 08:30:00', size: 1200000, priority: 'Medium', score: 70, reason: 'Reconciliation formula flags variance between GL account 2100 and clearing', hash: '4567765445677654456776544567765445677654456776544567765445677654' },
            { id: 'EVD-2026-035', title: 'Windows Security Event Log 4672 (Admin Privileges)', type: 'Security Event Log', source: 'Fin-Terminal-WS-04', time: '2026-03-16 19:00:15', size: 45000, priority: 'Medium', score: 75, reason: 'Special privileges assigned to bcooper logon session at 19:00:15', hash: '5678876556788765567887655678876556788765567887655678876556788765' },
            { id: 'EVD-2026-036', title: 'Database Rollback Journal Fragment (.rbf)', type: 'Database Journal', source: 'ERP-Database-Cluster-Node1', time: '2026-03-16 19:12:00', size: 8400000, priority: 'High', score: 87, reason: 'Preserves pre-image of authentic vendor routing number before change', hash: '6789987667899876678998766789987667899876678998766789987667899876' },
            { id: 'EVD-2026-037', title: 'Cardkey Access Log to Treasury Floor', type: 'Physical Security Log', source: 'Building Access Control', time: '2026-03-16 18:45:00', size: 8200, priority: 'Low', score: 45, reason: 'Bradley Cooper cardkey entered Treasury suite alone at 18:45', hash: '7890098778900987789009877890098778900987789009877890098778900987' },
            { id: 'EVD-2026-038', title: 'Banking Clearinghouse SWIFT Confirmation Copy', type: 'Bank Confirmation', source: 'JPMorgan Chase Portal', time: '2026-03-16 19:30:00', size: 45000, priority: 'High', score: 82, reason: 'Confirms release of payment wire based on batch #4091 instructions', hash: '8901109889011098890110988901109889011098890110988901109889011098' },
            { id: 'EVD-2026-039', title: 'Workstation Browser History (Edge Cache)', type: 'Web History', source: 'Fin-Terminal-WS-04', time: '2026-03-16 19:40:00', size: 340000, priority: 'Medium', score: 65, reason: 'Searches for "swift wire cancellation time limits" and "non-extradition"', hash: '9012210990122109901221099012210990122109901221099012210990122109' },
            { id: 'EVD-2026-040', title: 'Executive Approval Authorization Form Scan', type: 'Scanned Document', source: 'Finance Paper Archive', time: '2026-03-16 17:00:00', size: 540000, priority: 'Low', score: 35, reason: 'Lacks required secondary VP signature; marked as "Urgent Expedite"', hash: '0123321001233210012332100123321001233210012332100123321001233210' }
        ],
        // Case 5: Insider Information Leak
        [
            { id: 'EVD-2026-041', title: 'Merger Deck Slide 14 Exfiltration Photo (.jpg)', type: 'Digital Photograph', source: 'Galaxy S23 Personal', time: '2026-03-17 10:45:12', size: 4210000, priority: 'High', score: 94, reason: 'EXIF metadata matches personal smartphone; screen shows board watermark', hash: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789' },
            { id: 'EVD-2026-042', title: 'Corporate Exchange Transport Rule Audit Log', type: 'Mail Server Log', source: 'Exchange Server 2026', time: '2026-03-17 11:15:00', size: 54000, priority: 'High', score: 88, reason: 'DLP rule triggered on outbound email to tips@techleaks.ch containing M&A code', hash: 'bcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789a' },
            { id: 'EVD-2026-043', title: 'Confidential Presentation File (Project_Titan_v8.pptx)', type: 'Presentation Artifact', source: 'SharePoint Strategy Team', time: '2026-03-17 09:30:00', size: 18900000, priority: 'High', score: 90, reason: 'Author metadata shows Jonathan Sterling; digital watermark ID #004', hash: 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab' },
            { id: 'EVD-2026-044', title: 'iPad Pro SharePoint Sync Activity Stream', type: 'Sync Log', source: 'iPad Pro 12.9 (M2)', time: '2026-03-17 10:15:00', size: 31000, priority: 'Medium', score: 72, reason: 'Offline local caching of Project Titan presentation to local iPad files', hash: 'def0123456789abcdef0123456789abcdef0123456789abcdef0123456789abc' },
            { id: 'EVD-2026-045', title: 'Online News Article HTML Snapshot', type: 'Web Artifact', source: 'Public Web Scrape', time: '2026-03-17 13:00:00', size: 145000, priority: 'Medium', score: 62, reason: 'Article text contains exact phrasing: "undisclosed $2.4B all-cash tender offer"', hash: 'ef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd' },
            { id: 'EVD-2026-046', title: 'Cellular Carrier Data Transfer Spike Log', type: 'Cellular Billing Log', source: 'Verizon Business Telemetry', time: '2026-03-17 11:00:00', size: 12000, priority: 'Medium', score: 68, reason: 'Galaxy S23 uploaded 45 MB of encrypted data via Proton VPN tunnel', hash: 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde' },
            { id: 'EVD-2026-047', title: 'Legal Non-Disclosure Agreement (NDA) Execution Form', type: 'Contract PDF', source: 'Ironclad Vault', time: '2026-02-01 10:00:00', size: 380000, priority: 'Low', score: 40, reason: 'Confirms Sterling legal obligation and severe criminal insider trading penalty', hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0' },
            { id: 'EVD-2026-048', title: 'Signal Messenger Desktop Encrypted Database Key', type: 'Encrypted DB Key', source: 'iPad Pro 12.9 (M2)', time: '2026-03-17 11:10:00', size: 2048, priority: 'High', score: 81, reason: 'Disappearing message session initiated with unnamed investigative reporter', hash: '123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01' },
            { id: 'EVD-2026-049', title: 'Board of Directors Meeting Attendance Minutes', type: 'Meeting Minutes', source: 'BoardVantage Portal', time: '2026-03-17 10:00:00', size: 68000, priority: 'Low', score: 35, reason: 'Records Sterling presenting slide deck to executive board at 10:00 AM', hash: '23456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012' },
            { id: 'EVD-2026-050', title: 'Enterprise Endpoint DLP Incident Alert #8821', type: 'DLP Alert', source: 'Symantec DLP Console', time: '2026-03-17 10:48:00', size: 41000, priority: 'High', score: 85, reason: 'Screen OCR detected classified watermark string on active display', hash: '3456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123' }
        ],
        // Case 6: Phishing and Suspicious Email Investigation
        [
            { id: 'EVD-2026-051', title: 'Original Raw Phishing Email Message (docusign_lure.eml)', type: 'Email Message (EML)', source: 'Corporate Exchange Mailbox', time: '2026-03-18 08:52:10', size: 48900, priority: 'High', score: 95, reason: 'Spoofed sender docusign@notifications-docusign-portal.com; SPF/DKIM fail', hash: '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234' },
            { id: 'EVD-2026-052', title: 'Web Proxy Forwarding Log (Palo Alto URL Filter)', type: 'Proxy Log', source: 'Enterprise Forward Proxy', time: '2026-03-18 09:05:22', size: 84000, priority: 'High', score: 90, reason: 'User rstone clicked destination https://portal-docusign-auth.ru/login', hash: '56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345' },
            { id: 'EVD-2026-053', title: 'Adversary Evilginx Reverse Proxy SSL Certificate', type: 'X.509 Certificate', source: 'SOC-Analysis-Rig', time: '2026-03-18 09:30:00', size: 3400, priority: 'High', score: 88, reason: 'Let\'s Encrypt cert issued 2 hours prior to attack for spoofed domain', hash: '6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456' },
            { id: 'EVD-2026-054', title: 'Captured HTTP POST Credential Payload Sample', type: 'Network Stream', source: 'Enterprise Network Tap', time: '2026-03-18 09:06:14', size: 12000, priority: 'High', score: 92, reason: 'Cleartext username rstone@aegis-corp.com and intercepted session cookie', hash: '789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567' },
            { id: 'EVD-2026-055', title: 'Microsoft 365 Azure AD Interactive Sign-in Log', type: 'Cloud Audit Log', source: 'Azure AD Entra Portal', time: '2026-03-18 09:07:30', size: 68000, priority: 'High', score: 89, reason: 'New session established with stolen ESTSAuth cookie from IP 91.240.118.2', hash: '89abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345678' },
            { id: 'EVD-2026-056', title: 'Exchange Online eDiscovery Mailbox Search Export', type: 'Mailbox Archive', source: 'O365 Compliance Center', time: '2026-03-18 09:12:00', size: 450000000, priority: 'Medium', score: 76, reason: 'Attacker automated search for "W-2", "Direct Deposit", and "Executive Salary"', hash: '9abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789' },
            { id: 'EVD-2026-057', title: 'HR Workstation Browser History & Cookies.sqlite', type: 'Browser SQLite DB', source: 'HR-Workstation-WS-12', time: '2026-03-18 10:00:00', size: 840000, priority: 'Medium', score: 71, reason: 'Contains exact URL redirect chain from phishing landing page', hash: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567890' },
            { id: 'EVD-2026-058', title: 'Phishing Campaign IOC IP & Domain Blocklist Entry', type: 'Firewall Policy', source: 'Core Perimeter Firewall', time: '2026-03-18 09:45:00', size: 4500, priority: 'Low', score: 45, reason: 'SOC containment action blocking IP 91.240.118.2 globally', hash: 'bcdef0123456789abcdef0123456789abcdef0123456789abcdef012345678901' },
            { id: 'EVD-2026-059', title: 'Workday HR Portal Administrative Audit Log', type: 'SaaS Audit Log', source: 'Workday Cloud Tenant', time: '2026-03-18 09:18:00', size: 92000, priority: 'High', score: 83, reason: 'Failed attempt to alter executive bank account routing information', hash: 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789012' },
            { id: 'EVD-2026-060', title: 'Security Awareness Training Completion Record', type: 'Training Record', source: 'KnowBe4 LMS', time: '2026-01-10 14:00:00', size: 14000, priority: 'Low', score: 32, reason: 'Indicates Rebecca Stone had completed annual phishing training with 100% score', hash: 'def0123456789abcdef0123456789abcdef0123456789abcdef01234567890123' }
        ],
        // Case 7: Unauthorized Database Access
        [
            { id: 'EVD-2026-061', title: 'Apache HTTP Access Log (/var/log/apache2/access.log)', type: 'Web Server Log', source: 'Customer-Web-Portal-VM01', time: '2026-03-19 00:28:15', size: 18400000, priority: 'High', score: 96, reason: 'Contains SQLi string: \' UNION SELECT id,email,password_hash FROM users--', hash: 'ef0123456789abcdef0123456789abcdef0123456789abcdef012345678901234' },
            { id: 'EVD-2026-062', title: 'PostgreSQL Query Execution Log (postgresql.log)', type: 'Database Log', source: 'Production-Postgres-Cluster', time: '2026-03-19 00:30:12', size: 45000000, priority: 'High', score: 94, reason: 'Logged full table scan on customers_pii returning 50,000 tuples in 1.4s', hash: 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345' },
            { id: 'EVD-2026-063', title: 'Extracted Database Exfiltration Dump (cust_export.csv)', type: 'Data File', source: 'Evidence Storage', time: '2026-03-19 09:00:00', size: 8400000, priority: 'High', score: 91, reason: 'Recovered sample of exfiltrated records containing plaintext addresses', hash: '0123456789abcdef0123456789abcdef0123456789abcdef01234567890123456' },
            { id: 'EVD-2026-064', title: 'AWS CloudWatch VPC Flow Logs Spike Report', type: 'Cloud Telemetry', source: 'AWS CloudWatch', time: '2026-03-19 00:35:00', size: 210000, priority: 'Medium', score: 75, reason: 'Outbound traffic spike of 84 MB from web server to IP 198.51.100.77', hash: '123456789abcdef0123456789abcdef0123456789abcdef012345678901234567' },
            { id: 'EVD-2026-065', title: 'Legacy Portal PHP Source Code (order_lookup.php)', type: 'Source Code', source: 'Web Portal Git Repo', time: '2026-03-19 08:00:00', size: 8400, priority: 'Medium', score: 68, reason: 'Line 44 uses raw string concatenation without PDO prepared statements', hash: '23456789abcdef0123456789abcdef0123456789abcdef0123456789012345678' },
            { id: 'EVD-2026-066', title: 'ModSecurity Web Application Firewall Audit Log', type: 'WAF Log', source: 'Customer-Web-Portal-VM01', time: '2026-03-19 00:25:00', size: 145000, priority: 'High', score: 88, reason: 'WAF was mistakenly placed in "DetectionOnly" mode during prior maintenance', hash: '3456789abcdef0123456789abcdef0123456789abcdef01234567890123456789' },
            { id: 'EVD-2026-067', title: 'Attacker Automated Tooling User-Agent Telemetry', type: 'Network Telemetry', source: 'Customer-Web-Portal-VM01', time: '2026-03-19 00:26:00', size: 38000, priority: 'Medium', score: 70, reason: 'Repeated requests with User-Agent: sqlmap/1.7.2#stable', hash: '456789abcdef0123456789abcdef0123456789abcdef01234567890123456789a' },
            { id: 'EVD-2026-068', title: 'Qualys Penetration Testing Audit Authorization', type: 'Audit Authorization', source: 'Security Compliance Office', time: '2026-03-10 11:00:00', size: 45000, priority: 'Low', score: 42, reason: 'Pen test scope explicitly excluded production portal node VM01', hash: '56789abcdef0123456789abcdef0123456789abcdef01234567890123456789ab' },
            { id: 'EVD-2026-069', title: 'Production Postgres Connection Pool Configuration', type: 'Server Config', source: 'Production-Postgres-Cluster', time: '2026-03-19 08:30:00', size: 12000, priority: 'Low', score: 38, reason: 'Reveals database user "portal_web" possessed excessive read privileges', hash: '6789abcdef0123456789abcdef0123456789abcdef01234567890123456789abc' },
            { id: 'EVD-2026-070', title: 'Dark Web Monitoring Intelligence Alert', type: 'Threat Intel Report', source: 'Mandiant Threat Intelligence', time: '2026-03-19 14:00:00', size: 54000, priority: 'Medium', score: 65, reason: 'Breach forum listing advertising "50k Aegis Corp Customer Database"', hash: '789abcdef0123456789abcdef0123456789abcdef01234567890123456789abcd' }
        ],
        // Case 8: Digital Document Tampering
        [
            { id: 'EVD-2026-071', title: 'Tampered Vendor Procurement Agreement (Contract_Final_Signed.pdf)', type: 'Document Artifact', source: 'Procurement-Desktop-02', time: '2026-03-20 14:35:10', size: 1450000, priority: 'High', score: 96, reason: 'Incremental update on page 14 altered $250k milestone to $700k', hash: '89abcdef0123456789abcdef0123456789abcdef01234567890123456789abcde' },
            { id: 'EVD-2026-072', title: 'Original Authentic Signed Contract from Vendor Server', type: 'Document Artifact', source: 'Vendor Extranet Repository', time: '2026-03-20 11:00:00', size: 1390000, priority: 'High', score: 95, reason: 'Authentic baseline document containing original milestone sum of $250,000', hash: '9abcdef0123456789abcdef0123456789abcdef01234567890123456789abcdef' },
            { id: 'EVD-2026-073', title: 'Adobe Acrobat DC Installation & Temp File Carve', type: 'Application Cache', source: 'Procurement-Desktop-02', time: '2026-03-20 14:22:00', size: 4800000, priority: 'High', score: 87, reason: 'Temporary file Acro4102.tmp contains intermediate edit text buffers', hash: 'abcdef0123456789abcdef0123456789abcdef01234567890123456789abcdef0' },
            { id: 'EVD-2026-074', title: 'DocuSign PKI Signature Verification Failure Report', type: 'PKI Verification Log', source: 'DocuSign-Appliance-Gateway', time: '2026-03-20 15:10:00', size: 34000, priority: 'High', score: 92, reason: 'Byte-range digest mismatch: SHA-256 hash does not match signature dictionary', hash: 'bcdef0123456789abcdef0123456789abcdef01234567890123456789abcdef01' },
            { id: 'EVD-2026-075', title: 'Font Embedding Analysis & Hex Diff Output', type: 'Forensic Analysis Output', source: 'Forensic Lab Workstation', time: '2026-03-20 16:30:00', size: 120000, priority: 'Medium', score: 78, reason: 'Page 14 utilizes Arial-Bold whereas original contract used Helvetica-Neue', hash: 'cdef0123456789abcdef0123456789abcdef01234567890123456789abcdef012' },
            { id: 'EVD-2026-076', title: 'Windows File System $MFT Record for Modified PDF', type: 'File System Metadata', source: 'Procurement-Desktop-02', time: '2026-03-20 14:35:10', size: 1024, priority: 'Medium', score: 73, reason: 'Standard Information (SI) and File Name (FN) timestamp mismatch (timestomping)', hash: 'def0123456789abcdef0123456789abcdef0123456789abcdef01234567890123' },
            { id: 'EVD-2026-077', title: 'Internal Email Thread Regarding Contract Approval', type: 'Email Message', source: 'Corporate Exchange Mailbox', time: '2026-03-20 14:50:00', size: 54000, priority: 'Medium', score: 66, reason: 'Pendelton insists on expedited processing before end-of-day bank cutoff', hash: 'ef0123456789abcdef0123456789abcdef0123456789abcdef012345678901234' },
            { id: 'EVD-2026-078', title: 'Vendor Counterpart Statement Affidavit', type: 'Legal Affidavit', source: 'Vendor Legal Department', time: '2026-03-20 17:00:00', size: 65000, priority: 'Low', score: 45, reason: 'Vendor CFO confirms price agreement was fixed at $250,000 without exception', hash: 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345' },
            { id: 'EVD-2026-079', title: 'Procurement VP Banking Subpoena Return', type: 'Financial Records', source: 'Bank of America Legal Order', time: '2026-03-21 09:00:00', size: 840000, priority: 'High', score: 81, reason: 'Shows personal loan default notices totaling $420,000 received on March 18', hash: '0123456789abcdef0123456789abcdef0123456789abcdef01234567890123456' },
            { id: 'EVD-2026-080', title: 'DocuSign Audit Trail Certificate of Completion', type: 'Certificate PDF', source: 'DocuSign Cloud Portal', time: '2026-03-20 11:05:00', size: 180000, priority: 'Low', score: 40, reason: 'Proves transaction envelope completed at 11:05 with hash matching EVD-2026-072', hash: '123456789abcdef0123456789abcdef0123456789abcdef012345678901234567' }
        ],
        // Case 9: Deleted File Investigation
        [
            { id: 'EVD-2026-081', title: 'Samsung 980 Pro Bit-Stream Forensic Disk Image (raw.dd)', type: 'Disk Image', source: 'Samsung 980 Pro NVMe 2TB', time: '2026-03-21 18:30:00', size: 2000398934016, priority: 'High', score: 97, reason: 'Physical image of target drive; serves as master evidence source', hash: '23456789abcdef0123456789abcdef0123456789abcdef0123456789012345678' },
            { id: 'EVD-2026-082', title: 'Windows Prefetch Execution Artifact (SDELETE.EXE-A819B021.pf)', type: 'Windows Prefetch', source: 'Robotics-Lab-Workstation-R9', time: '2026-03-21 17:48:15', size: 34100, priority: 'High', score: 94, reason: 'Proves Sysinternals SDelete was executed 7 times with parameters -p 7 -s -z', hash: '3456789abcdef0123456789abcdef0123456789abcdef01234567890123456789' },
            { id: 'EVD-2026-083', title: 'NTFS Change Journal Export ($UsnJrnl:$J)', type: 'File System Journal', source: 'Robotics-Lab-Workstation-R9', time: '2026-03-21 17:52:00', size: 128000000, priority: 'High', score: 92, reason: 'Over 4,200 USN_REASON_FILE_DELETE entries logged within 180 seconds', hash: '456789abcdef0123456789abcdef0123456789abcdef01234567890123456789a' },
            { id: 'EVD-2026-084', title: 'Volume Shadow Copy Deletion Event Log (VSS Event 8224)', type: 'Event Log', source: 'Robotics-Lab-Workstation-R9', time: '2026-03-21 17:46:00', size: 18500, priority: 'High', score: 89, reason: 'Records execution of vssadmin delete shadows /all /quiet', hash: '56789abcdef0123456789abcdef0123456789abcdef01234567890123456789ab' },
            { id: 'EVD-2026-085', title: 'Carved Unallocated Space Artifacts (PhotoRec Dump)', type: 'Carved Files', source: 'Forensic Lab Storage', time: '2026-03-22 02:00:00', size: 1450000000, priority: 'High', score: 86, reason: 'Partially carved headers of trade secret schematics from SSD slack space', hash: '6789abcdef0123456789abcdef0123456789abcdef01234567890123456789abc' },
            { id: 'EVD-2026-086', title: 'Registry Shellbags & RecentDocs Hive Dump', type: 'Windows Registry', source: 'Robotics-Lab-Workstation-R9', time: '2026-03-21 17:40:00', size: 8400000, priority: 'Medium', score: 74, reason: 'Confirms folder "C:\\Confidential_Robotics_Patents" was opened at 17:38', hash: '789abcdef0123456789abcdef0123456789abcdef01234567890123456789abcd' },
            { id: 'EVD-2026-087', title: 'Legal Preservation Order Process Server Affidavit', type: 'Legal Process', source: 'US District Court Marshal', time: '2026-03-21 17:30:00', size: 45000, priority: 'Low', score: 48, reason: 'Shows formal preservation notice served in person to Walter Whiteley at 17:30', hash: '89abcdef0123456789abcdef0123456789abcdef01234567890123456789abcde' },
            { id: 'EVD-2026-088', title: 'Corporate Software Baseline Whitelist Policy', type: 'IT Security Policy', source: 'SCCM Server', time: '2026-01-01 00:00:00', size: 38000, priority: 'Low', score: 35, reason: 'Confirms anti-forensic tools are prohibited from engineering workstations', hash: '9abcdef0123456789abcdef0123456789abcdef01234567890123456789abcdef' },
            { id: 'EVD-2026-089', title: 'PowerShell Execution History ConsoleHost_history.txt', type: 'Command History', source: 'Robotics-Lab-Workstation-R9', time: '2026-03-21 17:45:00', size: 14200, priority: 'High', score: 83, reason: 'Shows commands: Clear-RecycleBin -Force and wevtutil cl System', hash: 'abcdef0123456789abcdef0123456789abcdef01234567890123456789abcdef0' },
            { id: 'EVD-2026-090', title: 'SSD TRIM Command Controller Log', type: 'Firmware Telemetry', source: 'Samsung Magician Controller Log', time: '2026-03-21 17:54:00', size: 68000, priority: 'Medium', score: 69, reason: 'TRIM queued across blocks 0x4400-0x9800 immediately following file deletion', hash: 'bcdef0123456789abcdef0123456789abcdef01234567890123456789abcdef01' }
        ],
        // Case 10: Suspicious Device Connection
        [
            { id: 'EVD-2026-091', title: 'Windows Event ID 2003 (PnP Device Installation Log)', type: 'Event Log', source: 'Trading-Floor-Terminal-08', time: '2026-03-22 08:11:42', size: 19400, priority: 'High', score: 95, reason: 'Device VID:03EB PID:2043 (Hak5 USB Rubber Ducky) installed as HID Keyboard', hash: 'cdef0123456789abcdef0123456789abcdef01234567890123456789abcdef012' },
            { id: 'EVD-2026-092', title: 'Physical Rubber Ducky Hardware Appliance', type: 'Hardware Artifact', source: 'Physical Device DEV-020', time: '2026-03-22 09:30:00', size: 0, priority: 'High', score: 98, reason: 'Physical device recovered from back USB port of Terminal 08; contains MicroSD card', hash: 'def0123456789abcdef0123456789abcdef0123456789abcdef01234567890123' },
            { id: 'EVD-2026-093', title: 'Rubber Ducky MicroSD Injected Payload Script (inject.bin)', type: 'Payload Binary', source: 'Physical Device DEV-020', time: '2026-03-22 09:40:00', size: 8420, priority: 'High', score: 96, reason: 'Decompiled Duckyscript executes PowerShell -NoP -NonI -W Hidden -Enc ...', hash: 'ef0123456789abcdef0123456789abcdef0123456789abcdef012345678901234' },
            { id: 'EVD-2026-094', title: 'PowerShell Decoded Base64 Script Payload (payload.ps1)', type: 'Script Artifact', source: 'Forensic Lab Workstation', time: '2026-03-22 10:00:00', size: 4500, priority: 'High', score: 93, reason: 'Payload configures scheduled task to beacon algorithmic trading parameters to C2', hash: 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345' },
            { id: 'EVD-2026-095', title: 'Trading Floor Network Tap PCAP (Outbound Beaconing)', type: 'Network Capture (PCAP)', source: 'Network Tap Analyzer', time: '2026-03-22 08:13:00', size: 45000000, priority: 'High', score: 87, reason: 'Captures outbound HTTPS beacon to dynamic DNS domain trade-sync-node4.biz', hash: '0123456789abcdef0123456789abcdef0123456789abcdef01234567890123456' },
            { id: 'EVD-2026-096', title: 'Physical Access RFID Badge Turnstile Log', type: 'Physical Security Log', source: 'Trading Floor Badge Reader', time: '2026-03-22 08:05:10', size: 14000, priority: 'Medium', score: 72, reason: 'Zachary Taylor badge recorded entering trading bullpen alone at 08:05:10', hash: '123456789abcdef0123456789abcdef0123456789abcdef012345678901234567' },
            { id: 'EVD-2026-097', title: 'Bullpen Dome Surveillance Video Timestamp Log', type: 'CCTV Telemetry', source: 'Security Camera CAM-TF-04', time: '2026-03-22 08:11:00', size: 9800, priority: 'Medium', score: 76, reason: 'Shows individual crouching behind Terminal 08 chassis for 35 seconds', hash: '23456789abcdef0123456789abcdef0123456789abcdef0123456789012345678' },
            { id: 'EVD-2026-098', title: 'Keystroke Injection Timing Analysis Log', type: 'Hardware Telemetry', source: 'Trading-Floor-Terminal-08', time: '2026-03-22 08:11:45', size: 28000, priority: 'High', score: 85, reason: 'Keystroke interval of 12ms per character; physically impossible for human typist', hash: '3456789abcdef0123456789abcdef0123456789abcdef01234567890123456789' },
            { id: 'EVD-2026-099', title: 'Trading Terminal Registry Run Key Persistence', type: 'Windows Registry', source: 'Trading-Floor-Terminal-08', time: '2026-03-22 08:12:15', size: 2100, priority: 'High', score: 88, reason: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\AppHelper modified', hash: '456789abcdef0123456789abcdef0123456789abcdef01234567890123456789a' },
            { id: 'EVD-2026-100', title: 'Trading Firm Personal Electronic Device Policy', type: 'Compliance Policy', source: 'Compliance Intranet', time: '2026-01-01 00:00:00', size: 42000, priority: 'Low', score: 30, reason: 'Strict prohibition of any personal USB devices on active trading floor', hash: '56789abcdef0123456789abcdef0123456789abcdef01234567890123456789ab' }
        ]
    ];

    const insertEvidence = db.prepare(`
        INSERT INTO evidence (evidence_id, case_id, title, evidence_type, source, timestamp, sha256_hash, file_size_bytes, custody_officer, storage_location, priority_level, priority_score, priority_reason, notes, is_duplicate, duplicate_of)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const group of caseEvidenceTemplates) {
        for (const ev of group) {
            insertEvidence.run(
                ev.id,
                ev.id.startsWith('EVD-2026-00') || ev.id === 'EVD-2026-010' ? 'CASE-2026-001' :
                ev.id <= 'EVD-2026-020' ? 'CASE-2026-002' :
                ev.id <= 'EVD-2026-030' ? 'CASE-2026-003' :
                ev.id <= 'EVD-2026-040' ? 'CASE-2026-004' :
                ev.id <= 'EVD-2026-050' ? 'CASE-2026-005' :
                ev.id <= 'EVD-2026-060' ? 'CASE-2026-006' :
                ev.id <= 'EVD-2026-070' ? 'CASE-2026-007' :
                ev.id <= 'EVD-2026-080' ? 'CASE-2026-008' :
                ev.id <= 'EVD-2026-090' ? 'CASE-2026-009' : 'CASE-2026-010',
                ev.title,
                ev.type,
                ev.source,
                ev.time,
                ev.hash,
                ev.size,
                'Special Agent Sarah Connor',
                'Secure Evidence Vault Locker B-14',
                ev.priority,
                ev.score,
                ev.reason,
                'Forensically acquired and cryptographically verified.',
                0,
                null
            );
        }
    }

    // ADD 10 DUPLICATE / VERIFICATION EVIDENCE RECORDS FOR TESTING HASH TABLE DUPLICATE DETECTION
    const duplicateEvidence = [
        { id: 'EVD-2026-DUP1', case_id: 'CASE-2026-001', title: 'Forensic Copy of Project Aegis Archive from Cloud Backup', type: 'Archive File', source: 'AWS S3 Glacier Snapshot', time: '2026-03-13 14:00:00', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', orig: 'EVD-2026-001' },
        { id: 'EVD-2026-DUP2', case_id: 'CASE-2026-001', title: 'Secondary Image of Kingston 64GB USB Drive', type: 'Disk Image', source: 'Forensic Lab Imager Rig 2', time: '2026-03-13 16:30:00', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', orig: 'EVD-2026-003' },
        { id: 'EVD-2026-DUP3', case_id: 'CASE-2026-004', title: 'Wire Transfer Batch File Backup Copy', type: 'Financial XML Payload', source: 'Finance Archive Share', time: '2026-03-16 20:00:00', hash: '3456654334566543345665433456654334566543345665433456654334566543', orig: 'EVD-2026-033' },
        { id: 'EVD-2026-DUP4', case_id: 'CASE-2026-006', title: 'Gateway Blocked Copy of Malicious Phishing EML', type: 'Email Message (EML)', source: 'Proofpoint Gateway Quarantine', time: '2026-03-18 08:52:15', hash: '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234', orig: 'EVD-2026-051' },
        { id: 'EVD-2026-DUP5', case_id: 'CASE-2026-008', title: 'Procurement Agreement Backup on Legal Repository', type: 'Document Artifact', source: 'Legal Shared Repository', time: '2026-03-20 11:02:00', hash: '9abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', orig: 'EVD-2026-072' }
    ];

    for (const d of duplicateEvidence) {
        insertEvidence.run(
            d.id, d.case_id, d.title, d.type, d.source, d.time, d.hash, 1024000,
            'Examiner Alex Mercer', 'Vault Locker C-02', 'High', 85,
            `Cryptographic collision detected: Identical SHA-256 hash to ${d.orig}`,
            'Duplicate copy registered for chain of custody and hash table benchmarking.',
            1, d.orig
        );
    }

    // 7. SEED 50 LOGIN RECORDS (5 PER CASE)
    const insertLogin = db.prepare(`
        INSERT INTO login_logs (log_id, case_id, account_id, person_id, device_id, ip_address, login_time, logout_time, auth_status, anomaly_flag, anomaly_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const loginData = [
        // Case 1
        ['LOG-001', 'CASE-2026-001', 'ACC-001', 'PER-001', 'DEV-001', '10.10.4.15', '2026-03-12 21:05:00', '2026-03-12 23:55:00', 'Success', 1, 'Off-hours local workstation login (Late night R&D floor)'],
        ['LOG-002', 'CASE-2026-001', 'ACC-001', 'PER-001', 'DEV-001', '10.10.4.15', '2026-03-12 23:30:00', '2026-03-12 23:45:00', 'Success', 1, 'SSH connection to Git production repository without ticket ID'],
        ['LOG-003', 'CASE-2026-001', 'ACC-002', 'PER-002', 'DEV-001', '10.10.1.50', '2026-03-12 09:00:00', '2026-03-12 17:30:00', 'Success', 0, 'Standard business hours administrative session'],
        ['LOG-004', 'CASE-2026-001', 'ACC-003', 'PER-003', 'DEV-001', '10.10.0.10', '2026-03-12 08:30:00', '2026-03-12 18:00:00', 'Success', 0, 'Executive portal login'],
        ['LOG-005', 'CASE-2026-001', 'ACC-001', 'PER-001', 'DEV-001', '192.168.1.100', '2026-03-13 01:15:00', null, 'Failed - Bad Password', 1, 'Remote login attempt after resignation notice submission'],

        // Case 2
        ['LOG-006', 'CASE-2026-002', 'ACC-004', 'PER-004', 'DEV-003', '185.220.101.44', '2026-03-14 02:14:50', '2026-03-14 02:45:00', 'Success', 1, 'High-severity anomaly: Domain Admin login from Tor Exit Node'],
        ['LOG-007', 'CASE-2026-002', 'ACC-004', 'PER-004', 'DEV-004', '10.20.1.15', '2026-03-13 17:45:00', '2026-03-13 18:00:00', 'Success', 0, 'Legitimate workstation shutdown login by Sarah Jenkins'],
        ['LOG-008', 'CASE-2026-002', 'ACC-005', 'PER-005', 'DEV-003', '10.20.1.80', '2026-03-14 02:25:00', '2026-03-14 06:00:00', 'Success', 0, 'SOC emergency responder session responding to SIEM alert'],
        ['LOG-009', 'CASE-2026-002', 'ACC-006', 'PER-006', 'DEV-004', '10.20.2.10', '2026-03-13 16:00:00', '2026-03-13 16:30:00', 'Success', 0, 'Helpdesk ticket management login'],
        ['LOG-010', 'CASE-2026-002', 'ACC-004', 'PER-004', 'DEV-003', '185.220.101.44', '2026-03-14 02:05:00', null, 'MFA Denied', 1, 'Repeated MFA denial preceding fatigue bypass'],

        // Case 3
        ['LOG-011', 'CASE-2026-003', 'ACC-007', 'PER-007', 'DEV-005', '172.16.88.12', '2026-03-15 15:45:00', '2026-03-15 16:15:00', 'Success', 0, 'SkyClub Wi-Fi session by Richard Holloway before flight boarding'],
        ['LOG-012', 'CASE-2026-003', 'ACC-007', 'PER-007', 'DEV-005', '198.51.100.5', '2026-03-15 17:08:40', null, 'Failed - Bad Password', 1, '5 bad PIN attempts at Windows login screen from stolen laptop'],
        ['LOG-013', 'CASE-2026-003', 'ACC-009', 'PER-009', 'DEV-006', '10.30.1.20', '2026-03-15 17:12:00', '2026-03-15 17:25:00', 'Success', 1, 'Key Vault administrative lookup for stolen ThinkPad BitLocker recovery key'],
        ['LOG-014', 'CASE-2026-003', 'ACC-008', 'PER-008', 'DEV-006', '10.30.5.11', '2026-03-15 09:00:00', '2026-03-15 17:00:00', 'Success', 0, 'Travel department operational login'],
        ['LOG-015', 'CASE-2026-003', 'ACC-007', 'PER-007', 'DEV-006', '72.14.201.88', '2026-03-15 16:45:00', '2026-03-15 17:00:00', 'Success', 0, 'Mobile phone login from airport gate reporting device theft'],

        // Case 4
        ['LOG-016', 'CASE-2026-004', 'ACC-010', 'PER-010', 'DEV-007', '10.40.1.10', '2026-03-16 19:00:15', '2026-03-16 20:15:00', 'Success', 1, 'Off-hours Treasury controller login without scheduled change ticket'],
        ['LOG-017', 'CASE-2026-004', 'ACC-012', 'PER-012', 'DEV-008', '10.40.0.5', '2026-03-16 19:05:00', '2026-03-16 19:20:00', 'Success', 1, 'Direct Oracle SYSDBA connection to ERP database table editor'],
        ['LOG-018', 'CASE-2026-004', 'ACC-011', 'PER-011', 'DEV-007', '10.40.2.14', '2026-03-17 08:15:00', '2026-03-17 12:00:00', 'Success', 0, 'Forensic auditor login flagging ledger mismatch'],
        ['LOG-019', 'CASE-2026-004', 'ACC-010', 'PER-010', 'DEV-007', '10.40.1.10', '2026-03-16 09:00:00', '2026-03-16 17:00:00', 'Success', 0, 'Standard daytime work session'],
        ['LOG-020', 'CASE-2026-004', 'ACC-010', 'PER-010', 'DEV-007', '10.40.1.10', '2026-03-16 19:42:00', '2026-03-16 19:45:00', 'Success', 1, 'Edge browser session querying SWIFT recall rules'],

        // Case 5
        ['LOG-021', 'CASE-2026-005', 'ACC-013', 'PER-013', 'DEV-009', '10.50.1.12', '2026-03-17 09:15:00', '2026-03-17 11:30:00', 'Success', 0, 'Strategy Director session accessing board presentation folder'],
        ['LOG-022', 'CASE-2026-005', 'ACC-013', 'PER-013', 'DEV-010', '198.51.100.99', '2026-03-17 10:55:00', '2026-03-17 11:10:00', 'Success', 1, 'Personal smartphone connection through encrypted VPN tunnel'],
        ['LOG-023', 'CASE-2026-005', 'ACC-014', 'PER-014', 'DEV-009', '10.50.2.18', '2026-03-17 10:00:00', '2026-03-17 12:00:00', 'Success', 0, 'Legal counsel compliance review session'],
        ['LOG-024', 'CASE-2026-005', 'ACC-015', 'PER-015', 'DEV-009', '10.50.0.2', '2026-03-17 08:30:00', '2026-03-17 17:00:00', 'Success', 0, 'Board secretariat portal coordination'],
        ['LOG-025', 'CASE-2026-005', 'ACC-013', 'PER-013', 'DEV-009', '10.50.1.12', '2026-03-17 10:47:00', '2026-03-17 10:50:00', 'Success', 1, 'Export of presentation slide 14 as high-resolution PNG image'],

        // Case 6
        ['LOG-026', 'CASE-2026-006', 'ACC-016', 'PER-016', 'DEV-011', '10.60.1.5', '2026-03-18 08:45:00', '2026-03-18 10:00:00', 'Success', 0, 'HR Director morning login on local workstation'],
        ['LOG-027', 'CASE-2026-006', 'ACC-016', 'PER-016', 'DEV-011', '91.240.118.2', '2026-03-18 09:07:30', '2026-03-18 09:45:00', 'Success', 1, 'Compromised M365 session: IP location Moscow, Russia using stolen session token'],
        ['LOG-028', 'CASE-2026-006', 'ACC-017', 'PER-017', 'DEV-012', '10.60.0.100', '2026-03-18 09:20:00', '2026-03-18 18:00:00', 'Success', 0, 'Incident responder terminal investigating compromised tenant'],
        ['LOG-029', 'CASE-2026-006', 'ACC-018', 'PER-018', 'DEV-011', '10.60.1.20', '2026-03-18 08:50:00', '2026-03-18 17:00:00', 'Success', 0, 'Payroll lead reporting suspicious inbound lure'],
        ['LOG-030', 'CASE-2026-006', 'ACC-016', 'PER-016', 'DEV-011', '91.240.118.2', '2026-03-18 09:15:00', null, 'Failed - Bad Password', 1, 'Failed attempt to alter global MFA registration policy'],

        // Case 7
        ['LOG-031', 'CASE-2026-007', 'ACC-019', 'PER-019', 'DEV-013', '10.70.1.15', '2026-03-18 14:00:00', '2026-03-18 18:00:00', 'Success', 0, 'Web developer deployment session updating portal files'],
        ['LOG-032', 'CASE-2026-007', 'ACC-020', 'PER-020', 'DEV-014', '10.70.0.8', '2026-03-19 01:00:00', '2026-03-19 03:00:00', 'Success', 0, 'DBA responding to Postgres memory exhaustion alert'],
        ['LOG-033', 'CASE-2026-007', 'ACC-021', 'PER-021', 'DEV-013', '198.51.100.77', '2026-03-19 00:24:00', '2026-03-19 00:36:00', 'Success', 1, 'Anonymous automated SQL injection payload session targeting order_lookup.php'],
        ['LOG-034', 'CASE-2026-007', 'ACC-021', 'PER-021', 'DEV-013', '198.51.100.77', '2026-03-18 23:45:00', '2026-03-18 23:55:00', 'Success', 1, 'Pre-attack reconnaissance port scan and directory fuzzing'],
        ['LOG-035', 'CASE-2026-007', 'ACC-019', 'PER-019', 'DEV-013', '10.70.1.15', '2026-03-19 08:30:00', '2026-03-19 12:00:00', 'Success', 0, 'Hotfix patching session to implement parameterized SQL queries'],

        // Case 8
        ['LOG-036', 'CASE-2026-008', 'ACC-022', 'PER-022', 'DEV-015', '10.80.1.4', '2026-03-20 14:15:00', '2026-03-20 15:30:00', 'Success', 1, 'Arthur Pendelton desktop session during document timestamp modification'],
        ['LOG-037', 'CASE-2026-008', 'ACC-023', 'PER-023', 'DEV-016', '10.80.2.10', '2026-03-20 14:45:00', '2026-03-20 16:00:00', 'Success', 0, 'Compliance specialist checking digital signature certificate validation'],
        ['LOG-038', 'CASE-2026-008', 'ACC-024', 'PER-024', 'DEV-015', '203.0.113.88', '2026-03-20 11:00:00', '2026-03-20 11:20:00', 'Success', 0, 'Vendor original signed contract upload session'],
        ['LOG-039', 'CASE-2026-008', 'ACC-022', 'PER-022', 'DEV-015', '10.80.1.4', '2026-03-20 14:38:00', '2026-03-20 14:40:00', 'Success', 1, 'Upload of forged PDF to Coupa procurement approval workflow'],
        ['LOG-040', 'CASE-2026-008', 'ACC-023', 'PER-023', 'DEV-016', '10.80.2.10', '2026-03-20 15:15:00', '2026-03-20 15:45:00', 'Success', 0, 'Issuance of compliance hold on payment milestone voucher'],

        // Case 9
        ['LOG-041', 'CASE-2026-009', 'ACC-025', 'PER-025', 'DEV-017', '10.90.1.8', '2026-03-21 17:25:00', '2026-03-21 18:05:00', 'Success', 1, 'Walter Whiteley session immediately following receipt of subpoena'],
        ['LOG-042', 'CASE-2026-009', 'ACC-026', 'PER-026', 'DEV-017', '10.90.0.50', '2026-03-21 18:20:00', '2026-03-21 21:00:00', 'Success', 0, 'Forensic acquisition session by Special Agent Mercer'],
        ['LOG-043', 'CASE-2026-009', 'ACC-027', 'PER-027', 'DEV-017', '10.90.2.12', '2026-03-21 09:00:00', '2026-03-21 17:00:00', 'Success', 0, 'IT endpoint inventory verification'],
        ['LOG-044', 'CASE-2026-009', 'ACC-025', 'PER-025', 'DEV-017', '10.90.1.8', '2026-03-21 17:46:00', '2026-03-21 17:55:00', 'Success', 1, 'Privileged command prompt execution of disk scrubbing utility SDelete'],
        ['LOG-045', 'CASE-2026-009', 'ACC-025', 'PER-025', 'DEV-017', '10.90.1.8', '2026-03-21 18:00:00', null, 'Success', 1, 'System power cycle to trigger TRIM garbage collection on NVMe'],

        // Case 10
        ['LOG-046', 'CASE-2026-010', 'ACC-028', 'PER-028', 'DEV-019', '10.100.1.8', '2026-03-22 08:08:00', '2026-03-22 09:00:00', 'Success', 1, 'Trader workstation logon 3 minutes prior to hardware injector execution'],
        ['LOG-047', 'CASE-2026-010', 'ACC-029', 'PER-029', 'DEV-019', '10.100.0.2', '2026-03-22 08:00:00', '2026-03-22 16:00:00', 'Success', 0, 'Physical security monitoring console shift login'],
        ['LOG-048', 'CASE-2026-010', 'ACC-030', 'PER-030', 'DEV-019', '10.100.2.15', '2026-03-22 08:30:00', '2026-03-22 17:00:00', 'Success', 0, 'Network engineer investigating rogue C2 outbound beacon'],
        ['LOG-049', 'CASE-2026-010', 'ACC-028', 'PER-028', 'DEV-019', '10.100.1.8', '2026-03-22 08:11:45', '2026-03-22 08:12:30', 'Success', 1, 'Injected HID keyboard automated logon script triggering encoded PowerShell'],
        ['LOG-050', 'CASE-2026-010', 'ACC-028', 'PER-028', 'DEV-019', '10.100.1.8', '2026-03-22 09:15:00', null, 'Failed - Bad Password', 1, 'Account lock initiated by security team']
    ];

    for (const l of loginData) {
        insertLogin.run(...l);
    }

    // 8. SEED 50 FILE ACCESS RECORDS (5 PER CASE)
    const insertFileAccess = db.prepare(`
        INSERT INTO file_access_logs (access_id, case_id, account_id, device_id, file_path, action, access_time, file_hash, bytes_transferred)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const fileAccessData = [
        // Case 1
        ['FAC-001', 'CASE-2026-001', 'ACC-001', 'DEV-001', '/var/git/aegis-firmware.git', 'READ', '2026-03-12 23:36:10', '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 4892019200],
        ['FAC-002', 'CASE-2026-001', 'ACC-001', 'DEV-001', '/tmp/Project-Aegis.tar.gz', 'WRITE', '2026-03-12 23:38:00', '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 4892019200],
        ['FAC-003', 'CASE-2026-001', 'ACC-001', 'DEV-001', '/media/usb_kingston/Project-Aegis.tar.gz', 'COPIED_TO_EXTERNAL', '2026-03-12 23:44:20', '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', 4892019200],
        ['FAC-004', 'CASE-2026-001', 'ACC-001', 'DEV-001', '/home/mvance/.bash_history', 'DELETE', '2026-03-12 23:51:00', '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 0],
        ['FAC-005', 'CASE-2026-001', 'ACC-002', 'DEV-001', '/var/log/secure', 'READ', '2026-03-13 08:15:00', '33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122', 81290],

        // Case 2
        ['FAC-006', 'CASE-2026-002', 'ACC-004', 'DEV-003', 'C:\\Windows\\System32\\config\\SAM', 'READ', '2026-03-14 02:19:10', '99aabbccddeeff00112233445566778899aabbccddeeff001122334455667788', 262144],
        ['FAC-007', 'CASE-2026-002', 'ACC-004', 'DEV-003', 'C:\\Temp\\mimikatz.exe', 'WRITE', '2026-03-14 02:18:00', '99aabbccddeeff00112233445566778899aabbccddeeff001122334455667788', 1245000],
        ['FAC-008', 'CASE-2026-002', 'ACC-004', 'DEV-003', 'C:\\Windows\\ntds\\ntds.dit', 'READ', '2026-03-14 02:21:00', 'ccddeeff00112233445566778899aabbccddeeff001122334455667788001122', 524288000],
        ['FAC-009', 'CASE-2026-002', 'ACC-004', 'DEV-003', 'C:\\Temp\\ntds_dump.7z', 'WRITE', '2026-03-14 02:24:00', 'ccddeeff00112233445566778899aabbccddeeff001122334455667788001122', 120000000],
        ['FAC-010', 'CASE-2026-002', 'ACC-005', 'DEV-003', 'C:\\Windows\\System32\\winevt\\Logs\\Security.evtx', 'READ', '2026-03-14 02:30:00', '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566', 20971520],

        // Case 3
        ['FAC-011', 'CASE-2026-003', 'ACC-007', 'DEV-005', 'C:\\Users\\rholloway\\Documents\\Q1_Strategy.xlsx', 'READ', '2026-03-15 16:10:00', '66778899aabbccddeeff00112233445566778800112233445566778899aabbcc', 450000],
        ['FAC-012', 'CASE-2026-003', 'ACC-009', 'DEV-006', '/azure/vault/bitlocker/keys/9B71-E401', 'READ', '2026-03-15 17:12:45', '33445566778899aabbccddeeff00112233445566778800112233445566778899', 45000],
        ['FAC-013', 'CASE-2026-003', 'ACC-007', 'DEV-005', 'C:\\Windows\\BitLocker\\recovery.bak', 'READ', '2026-03-15 17:09:12', '66778899aabbccddeeff00112233445566778800112233445566778899aabbcc', 1024],
        ['FAC-014', 'CASE-2026-003', 'ACC-007', 'DEV-005', 'C:\\Users\\rholloway\\Desktop\\Client_PII_List.csv', 'READ', '2026-03-15 16:12:00', '66778899aabbccddeeff00112233445566778800112233445566778899aabbcc', 840000],
        ['FAC-015', 'CASE-2026-003', 'ACC-007', 'DEV-005', 'C:\\Windows\\System32\\intune_wipe.dat', 'WRITE', '2026-03-15 17:15:30', '112233445566778899aabbccddeeff0011223344556677880011223344556677', 4096],

        // Case 4
        ['FAC-016', 'CASE-2026-004', 'ACC-010', 'DEV-007', 'D:\\ERP_Exports\\Vendor_Wire_Batch_4091.xml', 'WRITE', '2026-03-16 19:14:00', '3456654334566543345665433456654334566543345665433456654334566543', 145000],
        ['FAC-017', 'CASE-2026-004', 'ACC-012', 'DEV-008', '/u01/app/oracle/oradata/erp/AP_VENDOR_PAYMENTS.dbf', 'WRITE', '2026-03-16 19:08:24', '1234432112344321123443211234432112344321123443211234432112344321', 52428800],
        ['FAC-018', 'CASE-2026-004', 'ACC-012', 'DEV-008', '/u01/app/oracle/archive/redo04.log', 'WRITE', '2026-03-16 19:08:25', '1234432112344321123443211234432112344321123443211234432112344321', 52428800],
        ['FAC-019', 'CASE-2026-004', 'ACC-011', 'DEV-007', 'D:\\Audit\\Q1_Reconciliation_Ledger.xlsx', 'READ', '2026-03-17 08:32:00', '4567765445677654456776544567765445677654456776544567765445677654', 1200000],
        ['FAC-020', 'CASE-2026-004', 'ACC-010', 'DEV-007', 'C:\\Users\\bcooper\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\History', 'READ', '2026-03-16 19:42:00', '9012210990122109901221099012210990122109901221099012210990122109', 340000],

        // Case 5
        ['FAC-021', 'CASE-2026-005', 'ACC-013', 'DEV-009', '/SharePoint/Strategy/Project_Titan_v8.pptx', 'READ', '2026-03-17 09:30:00', 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab', 18900000],
        ['FAC-022', 'CASE-2026-005', 'ACC-013', 'DEV-009', '/Local/iPad/Slide14_Confidential.png', 'WRITE', '2026-03-17 10:47:00', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 4210000],
        ['FAC-023', 'CASE-2026-005', 'ACC-013', 'DEV-010', '/DCIM/Camera/IMG_20260317_104512.jpg', 'WRITE', '2026-03-17 10:45:12', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 4210000],
        ['FAC-024', 'CASE-2026-005', 'ACC-013', 'DEV-010', '/Android/data/org.protonvpn/cache/stream.tmp', 'WRITE', '2026-03-17 11:00:00', 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde', 45000000],
        ['FAC-025', 'CASE-2026-005', 'ACC-014', 'DEV-009', '/Legal/Vault/NDA_Titan_Final.pdf', 'READ', '2026-03-17 14:00:00', '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0', 380000],

        // Case 6
        ['FAC-026', 'CASE-2026-006', 'ACC-016', 'DEV-011', 'C:\\Users\\rstone\\Downloads\\DocuSign_Review_Doc.html', 'WRITE', '2026-03-18 09:04:10', '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234', 48900],
        ['FAC-027', 'CASE-2026-006', 'ACC-016', 'DEV-011', 'C:\\Users\\rstone\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Network\\Cookies', 'READ', '2026-03-18 09:06:14', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567890', 840000],
        ['FAC-028', 'CASE-2026-006', 'ACC-016', 'DEV-011', '/Exchange/Mailbox/rstone/SentItems/Employee_W2_2025.zip', 'READ', '2026-03-18 09:12:30', '9abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 450000000],
        ['FAC-029', 'CASE-2026-006', 'ACC-017', 'DEV-012', '/soc/evidence/evilginx_cert.pem', 'WRITE', '2026-03-18 09:30:00', '6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456', 3400],
        ['FAC-030', 'CASE-2026-006', 'ACC-018', 'DEV-011', '/Workday/Exports/Payroll_Roster_March.csv', 'READ', '2026-03-18 09:18:00', 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789012', 92000],

        // Case 7
        ['FAC-031', 'CASE-2026-007', 'ACC-019', 'DEV-013', '/var/www/html/portal/order_lookup.php', 'READ', '2026-03-19 00:27:00', '23456789abcdef0123456789abcdef0123456789abcdef0123456789012345678', 8400],
        ['FAC-032', 'CASE-2026-007', 'ACC-020', 'DEV-014', '/var/lib/postgresql/data/base/16384/customers_pii', 'READ', '2026-03-19 00:30:12', 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345', 45000000],
        ['FAC-033', 'CASE-2026-007', 'ACC-021', 'DEV-013', '/tmp/cust_export.csv', 'WRITE', '2026-03-19 00:33:00', '0123456789abcdef0123456789abcdef0123456789abcdef01234567890123456', 8400000],
        ['FAC-034', 'CASE-2026-007', 'ACC-021', 'DEV-013', '/var/log/apache2/access.log', 'WRITE', '2026-03-19 00:28:15', 'ef0123456789abcdef0123456789abcdef0123456789abcdef012345678901234', 18400000],
        ['FAC-035', 'CASE-2026-007', 'ACC-019', 'DEV-013', '/etc/modsecurity/modsecurity.conf', 'READ', '2026-03-19 08:00:00', '3456789abcdef0123456789abcdef0123456789abcdef01234567890123456789', 145000],

        // Case 8
        ['FAC-036', 'CASE-2026-008', 'ACC-022', 'DEV-015', 'C:\\Users\\apendelton\\Documents\\Contract_Final_Signed.pdf', 'READ', '2026-03-20 14:18:00', '9abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 1390000],
        ['FAC-037', 'CASE-2026-008', 'ACC-022', 'DEV-015', 'C:\\Users\\apendelton\\AppData\\Local\\Temp\\Acro4102.tmp', 'WRITE', '2026-03-20 14:22:00', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567890', 4800000],
        ['FAC-038', 'CASE-2026-008', 'ACC-022', 'DEV-015', 'C:\\Users\\apendelton\\Documents\\Contract_Final_Signed.pdf', 'WRITE', '2026-03-20 14:35:10', '89abcdef0123456789abcdef0123456789abcdef01234567890123456789abcde', 1450000],
        ['FAC-039', 'CASE-2026-008', 'ACC-023', 'DEV-016', '/docusign/appl/pki/audit_log.dat', 'READ', '2026-03-20 15:10:00', 'bcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01', 34000],
        ['FAC-040', 'CASE-2026-008', 'ACC-024', 'DEV-015', 'D:\\Vendor_Share\\Apex_Contract_Verified.pdf', 'READ', '2026-03-20 11:00:00', '9abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', 1390000],

        // Case 9
        ['FAC-041', 'CASE-2026-009', 'ACC-025', 'DEV-017', 'C:\\Tools\\SDelete\\sdelete.exe', 'READ', '2026-03-21 17:46:10', '3456789abcdef0123456789abcdef0123456789abcdef01234567890123456789', 34100],
        ['FAC-042', 'CASE-2026-009', 'ACC-025', 'DEV-017', 'C:\\Confidential_Robotics_Patents\\Patent_Draft_CAD.dwg', 'DELETE', '2026-03-21 17:48:00', '456789abcdef0123456789abcdef0123456789abcdef01234567890123456789a', 0],
        ['FAC-043', 'CASE-2026-009', 'ACC-025', 'DEV-017', 'C:\\$Extend\\$UsnJrnl', 'WRITE', '2026-03-21 17:52:00', '456789abcdef0123456789abcdef0123456789abcdef01234567890123456789a', 128000000],
        ['FAC-044', 'CASE-2026-009', 'ACC-025', 'DEV-017', 'C:\\Windows\\Prefetch\\SDELETE.EXE-A819B021.pf', 'WRITE', '2026-03-21 17:48:15', '3456789abcdef0123456789abcdef0123456789abcdef01234567890123456789', 34100],
        ['FAC-045', 'CASE-2026-009', 'ACC-026', 'DEV-018', '/dev/nvme0n1', 'READ', '2026-03-21 18:30:00', '23456789abcdef0123456789abcdef0123456789abcdef0123456789012345678', 2000398934016],

        // Case 10
        ['FAC-046', 'CASE-2026-010', 'ACC-028', 'DEV-020', 'E:\\inject.bin', 'READ', '2026-03-22 08:11:43', 'ef0123456789abcdef0123456789abcdef0123456789abcdef012345678901234', 8420],
        ['FAC-047', 'CASE-2026-010', 'ACC-028', 'DEV-019', 'C:\\Windows\\Temp\\payload.ps1', 'WRITE', '2026-03-22 08:11:50', 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345', 4500],
        ['FAC-048', 'CASE-2026-010', 'ACC-028', 'DEV-019', 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', 'READ', '2026-03-22 08:11:51', 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345', 450000],
        ['FAC-049', 'CASE-2026-010', 'ACC-028', 'DEV-019', 'C:\\Bloomberg\\Config\\live_feed_rates.xml', 'READ', '2026-03-22 08:12:00', '0123456789abcdef0123456789abcdef0123456789abcdef01234567890123456', 124000],
        ['FAC-050', 'CASE-2026-010', 'ACC-030', 'DEV-019', '/network/captures/terminal08_beacon.pcap', 'WRITE', '2026-03-22 08:13:00', '0123456789abcdef0123456789abcdef0123456789abcdef01234567890123456', 45000000]
    ];

    for (const f of fileAccessData) {
        insertFileAccess.run(...f);
    }

    // 9. SEED 30 EMAIL RECORDS (3 PER CASE)
    const insertEmail = db.prepare(`
        INSERT INTO email_records (email_id, case_id, sender, recipient, subject, sent_time, body_snippet, has_attachment, attachment_name, attachment_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const emailData = [
        // Case 1
        ['EML-001', 'CASE-2026-001', 'mvance@aegis-corp.com', 'dchen@aegis-corp.com', 'Resignation and Transition Handover', '2026-03-12 17:00:00', 'Please accept this formal notification of my resignation. I have ensured all documentation is up to date.', 1, 'Resignation_Notice.pdf', '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa'],
        ['EML-002', 'CASE-2026-001', 'erostova@aegis-corp.com', 'soc-team@aegis-corp.com', 'ALERT: Anomalous egress volume on Git Master', '2026-03-12 23:48:00', 'Automated monitor triggered on git.aegis.internal: 4.8 GB tarball downloaded by mvance terminal.', 0, null, null],
        ['EML-003', 'CASE-2026-001', 'mvance@aegis-corp.com', 'marcus.vance.personal@gmail.com', 'Fwd: Project Aegis Build Instructions', '2026-03-12 22:30:00', 'Forwarding notes for weekend review.', 0, null, null],

        // Case 2
        ['EML-004', 'CASE-2026-002', 'helpdesk@aegis-corp.com', 'sjenkins@aegis-corp.com', 'Urgent: Verification of phone call request', '2026-03-14 01:00:00', 'Sarah, someone phoned claiming to be you asking to reset your MFA token. We declined without manager confirmation.', 0, null, null],
        ['EML-005', 'CASE-2026-002', 'alerts@duosecurity.com', 'sjenkins@aegis-corp.com', 'Security Notice: Multiple Push Requests Detected', '2026-03-14 02:14:00', 'Your account received more than 40 push notifications in a short timeframe.', 0, null, null],
        ['EML-006', 'CASE-2026-002', 'vmiller@aegis-corp.com', 'ciso@aegis-corp.com', 'INCIDENT P1: Bastion Host Compromised', '2026-03-14 02:35:00', 'Isolating Bastion-Jump-SVR01 immediately. Tor exit node IP confirmed.', 1, 'IOC_Report_0314.pdf', '8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677'],

        // Case 3
        ['EML-007', 'CASE-2026-003', 'rholloway@aegis-corp.com', 'security@aegis-corp.com', 'STOLEN LAPTOP: Terminal B Airport Lounge', '2026-03-15 16:48:00', 'My company ThinkPad was taken from the lounge. Please initiate remote wipe immediately.', 0, null, null],
        ['EML-008', 'CASE-2026-003', 'kpatel@aegis-corp.com', 'rholloway@aegis-corp.com', 'Flight Boarding Pass and Gate Change', '2026-03-15 15:30:00', 'Your flight has been moved to Gate B14 with boarding at 16:35.', 1, 'BoardingPass_B14.pdf', '5566778899aabbccddeeff00112233445566778800112233445566778899aabb'],
        ['EML-009', 'CASE-2026-003', 'azure-alerts@microsoft.com', 'soc@aegis-corp.com', 'Azure Key Vault: Anomalous Key Query', '2026-03-15 17:13:00', 'BitLocker recovery key queried by user acruz_cloud outside normal maintenance schedule.', 0, null, null],

        // Case 4
        ['EML-010', 'CASE-2026-004', 'bcooper@aegis-corp.com', 'disbursements@aegis-corp.com', 'Priority Vendor Batch #4091 Release Authorization', '2026-03-16 19:16:00', 'Authorized release of vendor batch #4091 to avoid contract penalties. Please confirm release.', 1, 'Batch4091_Auth.xml', '3456654334566543345665433456654334566543345665433456654334566543'],
        ['EML-011', 'CASE-2026-004', 'psharma@aegis-corp.com', 'bcooper@aegis-corp.com', 'Audit Flag: Routing change on vendor Cayman Global', '2026-03-17 08:45:00', 'Bradley, automated audit found routing number changed minutes before batch release. Please clarify.', 0, null, null],
        ['EML-012', 'CASE-2026-004', 'gvance@aegis-corp.com', 'security@aegis-corp.com', 'ERP Database Lock Snapshot Notification', '2026-03-16 19:10:00', 'Table lock on AP_VENDOR_PAYMENTS cleared by user bcooper_ctl.', 0, null, null],

        // Case 5
        ['EML-013', 'CASE-2026-005', 'jsterling@aegis-corp.com', 'nmorales@aegis-corp.com', 'Final Titan Deck for Board Review', '2026-03-17 09:35:00', 'Attached is the final M&A presentation deck. All valuation figures are final.', 1, 'Project_Titan_v8.pptx', 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab'],
        ['EML-014', 'CASE-2026-005', 'tips@techleaks.ch', 'anonymous-sender@proton.me', 'CONFIDENTIAL: Aegis acquisition offer details', '2026-03-17 11:15:00', 'See attached photo of board presentation slide 14 with tender valuation.', 1, 'IMG_20260317_104512.jpg', 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'],
        ['EML-015', 'CASE-2026-005', 'nmorales@aegis-corp.com', 'board@aegis-corp.com', 'EMERGENCY: Press leak concerning Project Titan', '2026-03-17 13:15:00', 'An online outlet has published exact slides from this morning deck. Legal is opening an insider inquiry.', 0, null, null],

        // Case 6
        ['EML-016', 'CASE-2026-006', 'docusign@notifications-docusign-portal.com', 'rstone@aegis-corp.com', 'Action Required: Please review 2026 Compensation Adjustment', '2026-03-18 08:52:10', 'Your annual executive compensation review document is pending your electronic signature.', 1, 'DocuSign_Review_Doc.html', '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234'],
        ['EML-017', 'CASE-2026-006', 'mwong@aegis-corp.com', 'phishing-report@aegis-corp.com', 'Suspicious Email Report: DocuSign review email', '2026-03-18 09:10:00', 'I received this email. The sender domain looks fake and redirects to .ru domain.', 1, 'Suspicious_Message.eml', '456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234'],
        ['EML-018', 'CASE-2026-006', 'treed@aegis-corp.com', 'all-employees@aegis-corp.com', 'SECURITY ALERT: Active Phishing Campaign Targeting Staff', '2026-03-18 09:35:00', 'Do not click links purporting to be DocuSign compensation reviews. If you clicked, contact SOC.', 0, null, null],

        // Case 7
        ['EML-019', 'CASE-2026-007', 'cloudwatch-alerts@aws.amazon.com', 'dfoster@aegis-corp.com', 'AWS Alert: High Database CPU on RDS Postgres', '2026-03-19 00:32:00', 'RDS instance reached 99.8% CPU utilization and 84 MB egress bandwidth.', 0, null, null],
        ['EML-020', 'CASE-2026-007', 'ikim@aegis-corp.com', 'dfoster@aegis-corp.com', 'SQL Injection identified in order_lookup.php', '2026-03-19 01:15:00', 'Daniel, your order lookup script is being exploited. Raw SQL query is dumping customers_pii.', 1, 'slow_query_sample.log', 'f0123456789abcdef0123456789abcdef0123456789abcdef0123456789012345'],
        ['EML-021', 'CASE-2026-007', 'mandiant-intel@mandiant.com', 'soc@aegis-corp.com', 'Threat Advisory: Customer PII Advertised on Breach Forums', '2026-03-19 14:10:00', 'A sample of 50,000 customer records from your domain has been posted for sale.', 1, 'DarkWeb_Listing.png', '789abcdef0123456789abcdef0123456789abcdef01234567890123456789abcd'],

        // Case 8
        ['EML-022', 'CASE-2026-008', 'dhayes@apex-vendors.com', 'apendelton@aegis-corp.com', 'Signed Procurement Agreement - Apex Systems', '2026-03-20 11:05:00', 'Arthur, attached is the fully signed contract agreed at $250,000 for Phase 1.', 1, 'Contract_Final_Signed.pdf', '9abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'],
        ['EML-023', 'CASE-2026-008', 'apendelton@aegis-corp.com', 'cbeauchamp@aegis-corp.com', 'URGENT: Expedited processing for Apex voucher', '2026-03-20 14:48:00', 'Claire, please approve voucher #9802 immediately. Milestone payment updated to $700,000 per amended terms.', 1, 'Contract_Amended_Signed.pdf', '89abcdef0123456789abcdef0123456789abcdef01234567890123456789abcde'],
        ['EML-024', 'CASE-2026-008', 'cbeauchamp@aegis-corp.com', 'apendelton@aegis-corp.com', 'RE: URGENT: Voucher Hold - Signature Verification Failed', '2026-03-20 15:15:00', 'Arthur, DocuSign validation failed with digest mismatch on page 14. Payment is frozen.', 0, null, null],

        // Case 9
        ['EML-025', 'CASE-2026-009', 'legal@aegis-corp.com', 'wwhiteley@aegis-corp.com', 'LEGAL HOLD NOTICE: Immediate Preservation of All R&D Records', '2026-03-21 17:30:00', 'You are hereby notified of a mandatory court preservation order. Do not delete, modify, or purge any files.', 1, 'Federal_Subpoena_Notice.pdf', '89abcdef0123456789abcdef0123456789abcdef01234567890123456789abcde'],
        ['EML-026', 'CASE-2026-009', 'smartinez@aegis-corp.com', 'legal@aegis-corp.com', 'FORENSIC ALERT: Anti-Forensics Tool Execution on Lab Station R9', '2026-03-21 18:15:00', 'Examiners discovered SDelete execution artifact and Volume Shadow Copy purges. Station seized.', 0, null, null],
        ['EML-027', 'CASE-2026-009', 'wwhiteley@aegis-corp.com', 'attorney@defensefirm.com', 'Urgent consultation requested regarding laboratory data hold', '2026-03-21 17:58:00', 'I need immediate counsel regarding preservation requirements.', 0, null, null],

        // Case 10
        ['EML-028', 'CASE-2026-010', 'soc-alerts@aegis-corp.com', 'trading-ops@aegis-corp.com', 'CRITICAL ALERT: Unauthorized USB Keystroke Injector on Terminal 08', '2026-03-22 08:14:00', 'Device VID:03EB installed and injected base64 PowerShell payload at 900 WPM.', 1, 'SOC_Incident_Report_1092.pdf', 'cdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012'],
        ['EML-029', 'CASE-2026-010', 'ncross@aegis-corp.com', 'treed@aegis-corp.com', 'Network Tap Capture: Terminal 08 C2 Beaconing Blocked', '2026-03-22 08:20:00', 'Firewall blocked beaconing to trade-sync-node4.biz. Host physically isolated.', 0, null, null],
        ['EML-030', 'CASE-2026-010', 'compliance@aegis-corp.com', 'trading-management@aegis-corp.com', 'Trading Bullpen Security Lock: Station 08 Physical Breach', '2026-03-22 08:45:00', 'Physical security and SEC reporting initiated. Station 08 impounded for forensic analysis.', 0, null, null]
    ];

    for (const e of emailData) {
        insertEmail.run(...e);
    }

    // 10. SEED 70+ INVESTIGATION EVENTS (TIMELINE)
    const insertEvent = db.prepare(`
        INSERT INTO investigation_events (event_id, case_id, event_time, title, description, category, related_evidence_id, related_person_id, related_device_id, severity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const timelineEvents = [
        // Case 1: Corporate Data Theft
        ['EVT-001', 'CASE-2026-001', '2026-03-12 17:00:00', 'Resignation Submitted', 'Marcus Vance submits formal resignation email giving two weeks notice.', 'Employment Event', 'EVD-2026-007', 'PER-001', 'DEV-001', 'Low'],
        ['EVT-002', 'CASE-2026-001', '2026-03-12 21:05:00', 'Off-Hours Workstation Login', 'Marcus Vance logs in locally to Workstation-WS-902 outside business hours.', 'Authentication', null, 'PER-001', 'DEV-001', 'Medium'],
        ['EVT-003', 'CASE-2026-001', '2026-03-12 23:35:00', 'SSH Access to Git Production Server', 'SSH session established from workstation to Git server repository.', 'Authentication', 'EVD-2026-008', 'PER-001', 'DEV-001', 'High'],
        ['EVT-004', 'CASE-2026-001', '2026-03-12 23:38:00', 'Massive Source Archive Generation', 'tar archive of Project Aegis (4.8 GB) generated in /tmp.', 'Data Transfer', 'EVD-2026-001', 'PER-001', 'DEV-001', 'Critical'],
        ['EVT-005', 'CASE-2026-001', '2026-03-12 23:42:15', 'Kingston USB Mass Storage Attached', 'Kernel registers USB insertion of Kingston 64GB drive (DEV-002).', 'System Modification', 'EVD-2026-002', 'PER-001', 'DEV-001', 'High'],
        ['EVT-006', 'CASE-2026-001', '2026-03-12 23:44:20', 'Archive Transferred to External USB', 'Project-Aegis.tar.gz copied to /media/usb mount point.', 'Data Transfer', 'EVD-2026-003', 'PER-001', 'DEV-002', 'Critical'],
        ['EVT-007', 'CASE-2026-001', '2026-03-12 23:51:00', 'Terminal History Purged', 'Command history -c executed; .bash_history file deleted.', 'System Modification', 'EVD-2026-004', 'PER-001', 'DEV-001', 'High'],
        ['EVT-008', 'CASE-2026-001', '2026-03-12 23:58:30', 'Facility Exit via Turnstile', 'Marcus Vance exits corporate building carrying laptop bag.', 'Physical Security', 'EVD-2026-009', 'PER-001', null, 'Medium'],

        // Case 2: Suspicious Account Access
        ['EVT-009', 'CASE-2026-002', '2026-03-14 00:15:00', 'Helpdesk Impersonation Call', 'Adversary calls IT helpdesk attempting social engineering password reset.', 'External Communication', 'EVD-2026-017', 'PER-006', null, 'Medium'],
        ['EVT-010', 'CASE-2026-002', '2026-03-14 02:08:10', 'VPN Tunnel from Foreign IP', 'OpenVPN tunnel authenticated for sjenkins from Prague, Czechia.', 'Authentication', 'EVD-2026-014', 'PER-004', 'DEV-003', 'High'],
        ['EVT-011', 'CASE-2026-002', '2026-03-14 02:09:00', 'MFA Fatigue Bombing Begins', '48 consecutive Duo push notifications sent to Sarah Jenkins phone.', 'Authentication', 'EVD-2026-012', 'PER-004', 'DEV-004', 'High'],
        ['EVT-012', 'CASE-2026-002', '2026-03-14 02:14:48', 'MFA Approval Registered', 'Exhausted administrator approves push prompt to silence alerts.', 'Authentication', 'EVD-2026-012', 'PER-004', 'DEV-004', 'Critical'],
        ['EVT-013', 'CASE-2026-002', '2026-03-14 02:14:50', 'RDP Session on Bastion Host', 'Adversary logs on to Bastion host via RDP from Tor exit IP.', 'Authentication', 'EVD-2026-011', 'PER-004', 'DEV-003', 'Critical'],
        ['EVT-014', 'CASE-2026-002', '2026-03-14 02:18:22', 'Mimikatz Injected into lsass.exe', 'Credential dumping tool executed via encoded PowerShell script.', 'System Modification', 'EVD-2026-013', 'PER-004', 'DEV-003', 'Critical'],
        ['EVT-015', 'CASE-2026-002', '2026-03-14 02:22:15', 'Rogue Domain Admin Account Created', 'Persistence created by adding svc_backup to Enterprise Admins.', 'System Modification', 'EVD-2026-016', 'PER-004', 'DEV-003', 'Critical'],
        ['EVT-016', 'CASE-2026-002', '2026-03-14 02:30:00', 'SOC Incident Isolation', 'Security operations terminates VPN session and locks accounts.', 'Incident Alert', 'EVD-2026-018', 'PER-005', 'DEV-003', 'High'],

        // Case 3: Missing Laptop
        ['EVT-017', 'CASE-2026-003', '2026-03-15 15:45:00', 'Executive Lounge Connection', 'ThinkPad connects to SkyClub VIP Wi-Fi network.', 'Authentication', 'EVD-2026-027', 'PER-007', 'DEV-005', 'Low'],
        ['EVT-018', 'CASE-2026-003', '2026-03-15 16:28:10', 'Physical Laptop Theft', 'Surveillance video captures suspect grabbing laptop from lounge table.', 'Physical Security', 'EVD-2026-022', 'PER-007', 'DEV-005', 'Critical'],
        ['EVT-019', 'CASE-2026-003', '2026-03-15 16:48:00', 'Theft Reported to Corporate Security', 'Richard Holloway emails security alerting them to missing device.', 'External Communication', null, 'PER-007', 'DEV-006', 'High'],
        ['EVT-020', 'CASE-2026-003', '2026-03-15 17:08:40', 'Failed PIN Brute Force Attempts', 'Laptop powered on; 5 incorrect PIN attempts cause TPM lockout.', 'Authentication', 'EVD-2026-029', 'PER-007', 'DEV-005', 'High'],
        ['EVT-021', 'CASE-2026-003', '2026-03-15 17:12:45', 'Anomalous Key Vault BitLocker Query', 'Cloud administrator queries BitLocker recovery key for stolen device.', 'Data Transfer', 'EVD-2026-023', 'PER-009', null, 'Critical'],
        ['EVT-022', 'CASE-2026-003', '2026-03-15 17:15:00', 'Intune Remote Wipe Command Dispatched', 'Corporate MDM sends remote wipe signal pending device connectivity.', 'Incident Alert', 'EVD-2026-021', 'PER-009', 'DEV-005', 'High'],

        // Case 4: Financial Record Manipulation
        ['EVT-023', 'CASE-2026-004', '2026-03-16 18:45:00', 'After-Hours Cardkey Access', 'Bradley Cooper enters finance wing alone on Sunday evening.', 'Physical Security', 'EVD-2026-037', 'PER-010', null, 'Medium'],
        ['EVT-024', 'CASE-2026-004', '2026-03-16 19:00:15', 'Terminal Logon with Admin Privileges', 'Windows logon with elevated administrative privileges on Fin-WS-04.', 'Authentication', 'EVD-2026-035', 'PER-010', 'DEV-007', 'High'],
        ['EVT-025', 'CASE-2026-004', '2026-03-16 19:08:24', 'Direct SQL Update on Vendor Table', 'UPDATE query replaces legitimate vendor routing with Cayman shell routing.', 'System Modification', 'EVD-2026-031', 'PER-010', 'DEV-008', 'Critical'],
        ['EVT-026', 'CASE-2026-004', '2026-03-16 19:14:00', 'Wire Transfer Batch #4091 Dispatched', 'Batch payload generated routing $840,000 to offshore bank account.', 'Data Transfer', 'EVD-2026-033', 'PER-010', 'DEV-007', 'Critical'],
        ['EVT-027', 'CASE-2026-004', '2026-03-16 19:30:00', 'Bank Clearinghouse SWIFT Release', 'JPMorgan confirms wire settlement according to batch #4091.', 'Data Transfer', 'EVD-2026-038', 'PER-010', null, 'Critical'],
        ['EVT-028', 'CASE-2026-004', '2026-03-16 19:42:00', 'Searches for Wire Recall Timelines', 'Browser searches conducted for SWIFT wire clawback limitations.', 'System Modification', 'EVD-2026-039', 'PER-010', 'DEV-007', 'High'],
        ['EVT-029', 'CASE-2026-004', '2026-03-17 08:30:00', 'Internal Auditor Flags Discrepancy', 'Forensic auditor Priya Sharma discovers $840k GL variance.', 'Incident Alert', 'EVD-2026-034', 'PER-011', null, 'High'],

        // Case 5: Insider Information Leak
        ['EVT-030', 'CASE-2026-005', '2026-03-17 09:30:00', 'M&A Deck Synchronized to iPad', 'Project Titan slide deck cached to executive iPad for board presentation.', 'Data Transfer', 'EVD-2026-044', 'PER-013', 'DEV-009', 'Low'],
        ['EVT-031', 'CASE-2026-005', '2026-03-17 10:00:00', 'Executive Committee Presentation', 'Jonathan Sterling presents acquisition tender to board of directors.', 'Corporate Event', 'EVD-2026-049', 'PER-013', null, 'Low'],
        ['EVT-032', 'CASE-2026-005', '2026-03-17 10:45:12', 'Confidential Slide Photo Taken', 'Personal phone captures high-resolution photo of slide 14 tender valuation.', 'Physical Security', 'EVD-2026-041', 'PER-013', 'DEV-010', 'Critical'],
        ['EVT-033', 'CASE-2026-005', '2026-03-17 10:48:00', 'DLP Watermark Alert Triggered', 'Symantec DLP flags camera screen capture OCR pattern on executive display.', 'Incident Alert', 'EVD-2026-050', 'PER-013', 'DEV-009', 'High'],
        ['EVT-034', 'CASE-2026-005', '2026-03-17 11:00:00', 'Proton VPN Cellular Spike', 'Smartphone transfers 45 MB of encrypted data via cellular carrier.', 'Data Transfer', 'EVD-2026-046', 'PER-013', 'DEV-010', 'High'],
        ['EVT-035', 'CASE-2026-005', '2026-03-17 11:15:00', 'Exfiltration Email to Financial Press', 'Email sent to tips@techleaks.ch containing confidential slide attachment.', 'External Communication', 'EVD-2026-042', 'PER-013', 'DEV-010', 'Critical'],
        ['EVT-036', 'CASE-2026-005', '2026-03-17 13:00:00', 'Online Press Article Published', 'Financial blog publishes word-for-word details of unannounced acquisition.', 'External Communication', 'EVD-2026-045', null, null, 'Critical'],

        // Case 6: Phishing Campaign
        ['EVT-037', 'CASE-2026-006', '2026-03-18 08:52:10', 'Phishing Lure Inundation', 'Spear-phishing email delivered to HR VP inbox spoofing DocuSign.', 'External Communication', 'EVD-2026-051', 'PER-016', 'DEV-011', 'High'],
        ['EVT-038', 'CASE-2026-006', '2026-03-18 09:05:22', 'Malicious Link Clicked in Edge', 'User rstone clicks phishing redirect link leading to Evilginx reverse proxy.', 'Authentication', 'EVD-2026-052', 'PER-016', 'DEV-011', 'Critical'],
        ['EVT-039', 'CASE-2026-006', '2026-03-18 09:06:14', 'M365 Credentials Intercepted', 'Reverse proxy captures user password and session token cookie.', 'Data Transfer', 'EVD-2026-054', 'PER-016', 'DEV-011', 'Critical'],
        ['EVT-040', 'CASE-2026-006', '2026-03-18 09:07:30', 'Adversary Session from Foreign IP', 'Adversary leverages stolen session token from IP in Moscow, Russia.', 'Authentication', 'EVD-2026-055', 'PER-016', null, 'Critical'],
        ['EVT-041', 'CASE-2026-006', '2026-03-18 09:12:00', 'Automated Search for W-2 Documents', 'Attacker script initiates keyword search for employee tax and salary forms.', 'Data Transfer', 'EVD-2026-056', 'PER-016', null, 'Critical'],
        ['EVT-042', 'CASE-2026-006', '2026-03-18 09:20:00', 'Incident Responder Quarantine', 'Threat Hunter Tyler Reed revokes M365 tokens and blocks adversary domain.', 'Incident Alert', 'EVD-2026-058', 'PER-017', 'DEV-012', 'High'],

        // Case 7: Unauthorized Database Access
        ['EVT-043', 'CASE-2026-007', '2026-03-18 23:45:00', 'Port Scanning and API Reconnaissance', 'Automated scanner tests HTTP endpoints for SQL injection vulnerabilities.', 'System Modification', null, 'PER-021', 'DEV-013', 'Medium'],
        ['EVT-044', 'CASE-2026-007', '2026-03-19 00:26:00', 'Sqlmap Exploitation Commences', 'sqlmap sends UNION SELECT payloads targeting order_lookup.php parameter.', 'System Modification', 'EVD-2026-067', 'PER-021', 'DEV-013', 'Critical'],
        ['EVT-045', 'CASE-2026-007', '2026-03-19 00:30:12', 'Full Database Table Dump Triggered', '50,000 customer PII records returned from PostgreSQL cluster in 1.4 seconds.', 'Data Transfer', 'EVD-2026-062', 'PER-020', 'DEV-014', 'Critical'],
        ['EVT-046', 'CASE-2026-007', '2026-03-19 00:35:00', 'CloudWatch Egress Alarm', 'CloudWatch fires alarm on 84 MB outbound data transfer spike to untrusted IP.', 'Incident Alert', 'EVD-2026-064', 'PER-020', 'DEV-013', 'High'],
        ['EVT-047', 'CASE-2026-007', '2026-03-19 01:15:00', 'Vulnerable Endpoint Isolated', 'DBA and web dev disable public access to legacy portal endpoint.', 'System Modification', 'EVD-2026-065', 'PER-019', 'DEV-013', 'High'],
        ['EVT-048', 'CASE-2026-007', '2026-03-19 14:00:00', 'Stolen Data Listed on Dark Web', 'Threat intel feed alerts that Aegis customer database is listed for sale.', 'External Communication', 'EVD-2026-070', null, null, 'Critical'],

        // Case 8: Digital Document Tampering
        ['EVT-049', 'CASE-2026-008', '2026-03-20 11:05:00', 'Authentic Contract Signed by Vendor', 'Apex Systems vendor representative signs genuine contract at $250k.', 'Corporate Event', 'EVD-2026-072', 'PER-024', null, 'Low'],
        ['EVT-050', 'CASE-2026-008', '2026-03-20 14:18:00', 'Contract PDF Opened in Adobe Acrobat', 'Arthur Pendelton opens signed contract PDF on Procurement-Desktop-02.', 'System Modification', 'EVD-2026-073', 'PER-022', 'DEV-015', 'Medium'],
        ['EVT-051', 'CASE-2026-008', '2026-03-20 14:35:10', 'Page 14 Milestone Sum Overwritten', 'Incremental update overwrites $250,000 milestone to $700,000.', 'System Modification', 'EVD-2026-071', 'PER-022', 'DEV-015', 'Critical'],
        ['EVT-052', 'CASE-2026-008', '2026-03-20 14:48:00', 'Voucher Expedited Processing Requested', 'Pendelton submits altered contract requesting urgent wire voucher release.', 'External Communication', 'EVD-2026-077', 'PER-022', 'DEV-015', 'High'],
        ['EVT-053', 'CASE-2026-008', '2026-03-20 15:10:00', 'DocuSign PKI Check Fails', 'Cryptographic signature digest mismatch flags altered PDF cross-reference table.', 'Incident Alert', 'EVD-2026-074', 'PER-023', 'DEV-016', 'Critical'],
        ['EVT-054', 'CASE-2026-008', '2026-03-20 15:15:00', 'Payment Voucher Frozen by Legal', 'Compliance manager places administrative freeze on all vendor payouts.', 'System Modification', null, 'PER-023', 'DEV-016', 'High'],

        // Case 9: Deleted File Investigation
        ['EVT-055', 'CASE-2026-009', '2026-03-21 17:30:00', 'Legal Subpoena Served in Person', 'Court marshal serves formal evidence preservation order on Walter Whiteley.', 'Physical Security', 'EVD-2026-087', 'PER-025', null, 'High'],
        ['EVT-056', 'CASE-2026-009', '2026-03-21 17:46:00', 'Volume Shadow Copies Deleted', 'vssadmin delete shadows executed in quiet mode to destroy backup snapshots.', 'System Modification', 'EVD-2026-084', 'PER-025', 'DEV-017', 'Critical'],
        ['EVT-057', 'CASE-2026-009', '2026-03-21 17:48:15', 'Sysinternals SDelete Executed', 'Multi-pass DoD 5220.22-M zero-fill shredder run on confidential patent folder.', 'System Modification', 'EVD-2026-082', 'PER-025', 'DEV-017', 'Critical'],
        ['EVT-058', 'CASE-2026-009', '2026-03-21 17:52:00', 'Massive NTFS USN Deletions', '4,200 deletion transactions recorded in $UsnJrnl in under 3 minutes.', 'System Modification', 'EVD-2026-083', 'PER-025', 'DEV-017', 'Critical'],
        ['EVT-059', 'CASE-2026-009', '2026-03-21 17:54:00', 'Firmware TRIM Command Dispatched', 'Storage controller TRIM command zeroes deleted blocks on SSD.', 'System Modification', 'EVD-2026-090', 'PER-025', 'DEV-018', 'Critical'],
        ['EVT-060', 'CASE-2026-009', '2026-03-21 18:25:00', 'Forensic Lab Seizure of Station R9', 'Forensic examiners physically impound workstation and pull SSD.', 'Physical Security', 'EVD-2026-081', 'PER-026', 'DEV-017', 'High'],

        // Case 10: Suspicious Device Connection
        ['EVT-061', 'CASE-2026-010', '2026-03-22 08:05:10', 'Trading Bullpen Badge Entry', 'Zachary Taylor badges into restricted trading floor bullpen.', 'Physical Security', 'EVD-2026-096', 'PER-028', null, 'Low'],
        ['EVT-062', 'CASE-2026-010', '2026-03-22 08:11:00', 'Physical Tampering Behind Terminal 08', 'CCTV records individual reaching behind workstation chassis.', 'Physical Security', 'EVD-2026-097', 'PER-028', 'DEV-019', 'High'],
        ['EVT-063', 'CASE-2026-010', '2026-03-22 08:11:42', 'USB Rubber Ducky Injected', 'PnP system registers new Atmel keyboard hardware VID:03EB.', 'System Modification', 'EVD-2026-091', 'PER-028', 'DEV-020', 'Critical'],
        ['EVT-064', 'CASE-2026-010', '2026-03-22 08:11:45', 'Anomalous 900 WPM Typing Injected', 'Automated keystroke injection types encoded PowerShell command string.', 'System Modification', 'EVD-2026-098', 'PER-028', 'DEV-019', 'Critical'],
        ['EVT-065', 'CASE-2026-010', '2026-03-22 08:11:50', 'Base64 PowerShell Payload Executed', 'PowerShell runs in background with hidden window parameter.', 'System Modification', 'EVD-2026-094', 'PER-028', 'DEV-019', 'Critical'],
        ['EVT-066', 'CASE-2026-010', '2026-03-22 08:12:15', 'Registry Run Key Persistence Added', 'Run key added to ensure backdoor maintains survival across reboots.', 'System Modification', 'EVD-2026-099', 'PER-028', 'DEV-019', 'Critical'],
        ['EVT-067', 'CASE-2026-010', '2026-03-22 08:13:00', 'C2 Outbound Beacon Captured on Tap', 'Network analyzer captures encrypted beacon to trade-sync-node4.biz.', 'Incident Alert', 'EVD-2026-095', 'PER-030', 'DEV-019', 'Critical'],
        ['EVT-068', 'CASE-2026-010', '2026-03-22 09:30:00', 'Physical Hardware Injector Recovered', 'Forensic investigators unplug USB Rubber Ducky and retrieve MicroSD.', 'Physical Security', 'EVD-2026-092', 'PER-028', 'DEV-020', 'High']
    ];

    for (const ev of timelineEvents) {
        insertEvent.run(...ev);
    }

    // 11. SEED 60+ EVIDENCE RELATIONSHIPS (AT LEAST 6 PER CASE)
    const insertRel = db.prepare(`
        INSERT INTO evidence_relationships (case_id, source_id, source_type, target_id, target_type, relationship_type, weight, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const relationships = [
        // Case 1
        ['CASE-2026-001', 'PER-001', 'Person', 'DEV-001', 'Device', 'ASSIGNED_TO', 1.0, 'Marcus Vance primary engineering workstation'],
        ['CASE-2026-001', 'PER-001', 'Person', 'ACC-001', 'Account', 'OWNS_ACCOUNT', 1.0, 'Domain account mvance used for development'],
        ['CASE-2026-001', 'DEV-001', 'Device', 'DEV-002', 'Device', 'CONNECTED_DEVICE', 2.5, 'Workstation mounted Kingston 64GB USB storage'],
        ['CASE-2026-001', 'DEV-001', 'Device', 'EVD-2026-001', 'Evidence', 'GENERATED_FILE', 3.0, 'Workstation created Project-Aegis.tar.gz archive'],
        ['CASE-2026-001', 'DEV-002', 'Device', 'EVD-2026-003', 'Evidence', 'STORED_ON', 3.0, 'USB contains identical cryptographic hash of archive'],
        ['CASE-2026-001', 'EVD-2026-001', 'Evidence', 'EVD-2026-003', 'Evidence', 'IDENTICAL_HASH', 3.5, 'Exact SHA-256 hash match: 8f4343...aa4'],
        ['CASE-2026-001', 'EVT-004', 'Event', 'EVD-2026-001', 'Evidence', 'CORROBORATES', 2.0, 'Timeline event links directly to archive creation'],

        // Case 2
        ['CASE-2026-002', 'PER-004', 'Person', 'ACC-004', 'Account', 'OWNS_ACCOUNT', 1.0, 'Sarah Jenkins owner of hijacked admin credentials'],
        ['CASE-2026-002', 'ACC-004', 'Account', 'DEV-003', 'Device', 'LOGGED_INTO', 2.5, 'Compromised admin credentials used to RDP into Bastion host'],
        ['CASE-2026-002', 'DEV-003', 'Device', 'EVD-2026-013', 'Evidence', 'EXECUTED_SCRIPT', 3.0, 'Bastion executed Mimikatz via PowerShell'],
        ['CASE-2026-002', 'DEV-004', 'Device', 'EVD-2026-012', 'Evidence', 'RECEIVED_MFA', 2.5, 'Laptop Duo client received fatigue bombing requests'],
        ['CASE-2026-002', 'EVD-2026-011', 'Evidence', 'EVD-2026-018', 'Evidence', 'IP_CORRELATION', 3.0, 'Logon IP 185.220.101.44 correlates with Tor Exit IOC'],
        ['CASE-2026-002', 'PER-005', 'Person', 'DEV-003', 'Device', 'INVESTIGATED', 1.5, 'SOC Analyst Viktor Miller isolated Bastion server'],

        // Case 3
        ['CASE-2026-003', 'PER-007', 'Person', 'DEV-005', 'Device', 'ASSIGNED_TO', 1.0, 'Richard Holloway owner of stolen ThinkPad laptop'],
        ['CASE-2026-003', 'DEV-005', 'Device', 'EVD-2026-022', 'Evidence', 'CAPTURED_ON_CCTV', 2.5, 'Lounge camera records physical removal of device'],
        ['CASE-2026-003', 'PER-009', 'Person', 'EVD-2026-023', 'Evidence', 'QUERIED_KEY', 3.0, 'Amanda Cruz account queried BitLocker recovery key'],
        ['CASE-2026-003', 'DEV-005', 'Device', 'EVD-2026-027', 'Evidence', 'EMITTED_PROBE', 2.0, 'Wi-Fi gateway captured probe from stolen device MAC'],
        ['CASE-2026-003', 'DEV-005', 'Device', 'EVD-2026-021', 'Evidence', 'TARGET_OF_WIPE', 2.5, 'MDM remote wipe command targeted ThinkPad'],
        ['CASE-2026-003', 'PER-007', 'Person', 'DEV-006', 'Device', 'OWNS_DEVICE', 1.0, 'Executive iPhone used to report incident to security'],

        // Case 4
        ['CASE-2026-004', 'PER-010', 'Person', 'DEV-007', 'Device', 'LOGGED_INTO', 2.0, 'Bradley Cooper logged into Fin-WS-04 on Sunday night'],
        ['CASE-2026-004', 'DEV-007', 'Device', 'DEV-008', 'Device', 'SQL_CONNECTION', 3.0, 'Workstation initiated connection to Oracle DB cluster'],
        ['CASE-2026-004', 'DEV-008', 'Device', 'EVD-2026-031', 'Evidence', 'MODIFIED_TABLE', 3.5, 'Redo log records explicit table UPDATE query'],
        ['CASE-2026-004', 'DEV-007', 'Device', 'EVD-2026-033', 'Evidence', 'DISPATCHED_BATCH', 3.0, 'Workstation sent batch #4091 XML payload'],
        ['CASE-2026-004', 'EVD-2026-031', 'Evidence', 'EVD-2026-036', 'Evidence', 'ROLLBACK_EVIDENCE', 3.0, 'Journal records original authentic routing number'],
        ['CASE-2026-004', 'PER-011', 'Person', 'EVD-2026-034', 'Evidence', 'DISCOVERED_BY', 2.0, 'Auditor Priya Sharma generated variance workpaper'],

        // Case 5
        ['CASE-2026-005', 'PER-013', 'Person', 'DEV-009', 'Device', 'ASSIGNED_TO', 1.0, 'Jonathan Sterling synced M&A presentation to iPad'],
        ['CASE-2026-005', 'DEV-009', 'Device', 'EVD-2026-043', 'Evidence', 'OPENED_DOCUMENT', 2.5, 'Presentation Project_Titan_v8.pptx accessed on iPad'],
        ['CASE-2026-005', 'PER-013', 'Person', 'DEV-010', 'Device', 'OWNS_DEVICE', 1.0, 'Personal Galaxy S23 owned by Jonathan Sterling'],
        ['CASE-2026-005', 'DEV-010', 'Device', 'EVD-2026-041', 'Evidence', 'STORED_ON', 3.5, 'EXIF data proves photo of slide taken on Galaxy S23'],
        ['CASE-2026-005', 'DEV-010', 'Device', 'EVD-2026-042', 'Evidence', 'TRANSMITTED_TO', 3.0, 'Cellular connection sent photo to external press'],
        ['CASE-2026-005', 'EVD-2026-041', 'Evidence', 'EVD-2026-045', 'Evidence', 'TEXT_MATCH', 3.5, 'Published news article matches slide 14 tender text'],

        // Case 6
        ['CASE-2026-006', 'EVD-2026-051', 'Evidence', 'PER-016', 'Person', 'DELIVERED_TO', 2.5, 'Phishing email delivered to Rebecca Stone inbox'],
        ['CASE-2026-006', 'PER-016', 'Person', 'DEV-011', 'Device', 'CLICKED_LINK_ON', 2.5, 'Stone clicked phishing link on HR workstation'],
        ['CASE-2026-006', 'DEV-011', 'Device', 'EVD-2026-052', 'Evidence', 'REDIRECTED_TO', 3.0, 'Browser redirected to Evilginx reverse proxy'],
        ['CASE-2026-006', 'EVD-2026-054', 'Evidence', 'ACC-016', 'Account', 'COMPROMISED', 3.5, 'Captured HTTP POST contains valid session cookie'],
        ['CASE-2026-006', 'ACC-016', 'Account', 'EVD-2026-056', 'Evidence', 'SEARCHED_MAILBOX', 3.0, 'Stolen token used to search for employee W-2 forms'],
        ['CASE-2026-006', 'PER-017', 'Person', 'EVD-2026-058', 'Evidence', 'CONTAINED_BY', 2.0, 'Responder Tyler Reed implemented firewall blocklist'],

        // Case 7
        ['CASE-2026-007', 'DEV-013', 'Device', 'EVD-2026-061', 'Evidence', 'LOGGED_PAYLOAD', 3.0, 'Web server access log captured UNION SELECT payload'],
        ['CASE-2026-007', 'EVD-2026-061', 'Evidence', 'DEV-014', 'Device', 'EXPLOITED_VIA', 3.5, 'Injection on web portal routed query to PostgreSQL DB'],
        ['CASE-2026-007', 'DEV-014', 'Device', 'EVD-2026-062', 'Evidence', 'EXECUTED_DUMP', 3.5, 'Database log confirms 50k rows exported to client'],
        ['CASE-2026-007', 'DEV-013', 'Device', 'EVD-2026-064', 'Evidence', 'EGRESS_SPIKE', 2.5, 'CloudWatch alarmed on outbound data exfiltration'],
        ['CASE-2026-007', 'EVD-2026-063', 'Evidence', 'EVD-2026-070', 'Evidence', 'MATCHES_BREACH', 3.5, 'Carved export matches data advertised on dark web'],
        ['CASE-2026-007', 'PER-019', 'Person', 'DEV-013', 'Device', 'PATCHED_CODE', 2.0, 'Web dev Daniel Foster patched order_lookup.php'],

        // Case 8
        ['CASE-2026-008', 'PER-022', 'Person', 'DEV-015', 'Device', 'LOGGED_INTO', 1.5, 'Arthur Pendelton accessed Procurement-Desktop-02'],
        ['CASE-2026-008', 'DEV-015', 'Device', 'EVD-2026-071', 'Evidence', 'MODIFIED_FILE', 3.5, 'Workstation modified PDF contract milestone to $700k'],
        ['CASE-2026-008', 'EVD-2026-071', 'Evidence', 'EVD-2026-072', 'Evidence', 'COMPARED_AGAINST', 3.5, 'Tampered contract compared with authentic baseline'],
        ['CASE-2026-008', 'EVD-2026-071', 'Evidence', 'DEV-016', 'Device', 'SUBMITTED_TO', 2.5, 'Forged contract submitted to DocuSign appliance'],
        ['CASE-2026-008', 'DEV-016', 'Device', 'EVD-2026-074', 'Evidence', 'SIGNATURE_FAILED', 3.0, 'Appliance flagged byte-range checksum mismatch'],
        ['CASE-2026-008', 'PER-022', 'Person', 'EVD-2026-079', 'Evidence', 'MOTIVE_LINK', 2.5, 'Personal loan default notice established financial motive'],

        // Case 9
        ['CASE-2026-009', 'PER-025', 'Person', 'DEV-017', 'Device', 'ASSIGNED_TO', 1.0, 'Walter Whiteley owner of Robotics workstation R9'],
        ['CASE-2026-009', 'DEV-017', 'Device', 'DEV-018', 'Device', 'HOUSES_DRIVE', 2.0, 'Workstation R9 houses Samsung 980 Pro NVMe SSD'],
        ['CASE-2026-009', 'DEV-017', 'Device', 'EVD-2026-082', 'Evidence', 'EXECUTED_SDELETE', 3.5, 'Prefetch confirms SDelete run with 7 wiping passes'],
        ['CASE-2026-009', 'DEV-017', 'Device', 'EVD-2026-084', 'Evidence', 'DELETED_VSS', 3.0, 'Volume Shadow Copies purged via vssadmin utility'],
        ['CASE-2026-009', 'DEV-018', 'Device', 'EVD-2026-081', 'Evidence', 'IMAGED_TO', 3.0, 'Samsung SSD imaged to bit-stream evidence file'],
        ['CASE-2026-009', 'EVD-2026-082', 'Evidence', 'EVD-2026-087', 'Evidence', 'TEMPORAL_LINK', 3.5, 'SDelete executed 16 minutes after subpoena served'],

        // Case 10
        ['CASE-2026-010', 'PER-028', 'Person', 'DEV-019', 'Device', 'ASSIGNED_TO', 1.0, 'Zachary Taylor assigned to Trading Terminal 08'],
        ['CASE-2026-010', 'DEV-020', 'Device', 'DEV-019', 'Device', 'PHYSICALLY_ATTACHED', 3.5, 'USB Rubber Ducky inserted into rear USB port'],
        ['CASE-2026-010', 'DEV-020', 'Device', 'EVD-2026-091', 'Evidence', 'TRIGGERED_EVENT', 3.0, 'Hardware insertion triggered Windows Event 2003'],
        ['CASE-2026-010', 'DEV-020', 'Device', 'EVD-2026-093', 'Evidence', 'STORED_PAYLOAD', 3.5, 'Rubber Ducky MicroSD contained inject.bin payload'],
        ['CASE-2026-010', 'DEV-019', 'Device', 'EVD-2026-095', 'Evidence', 'BEACONED_TO', 3.0, 'Workstation beaconed to trade-sync-node4.biz'],
        ['CASE-2026-010', 'PER-028', 'Person', 'EVD-2026-097', 'Evidence', 'CCTV_CORRELATION', 3.0, 'CCTV video correlates Taylor presence at terminal']
    ];

    for (const r of relationships) {
        insertRel.run(...r);
    }

    // 12. SEED INITIAL AUDIT LOGS
    const insertAudit = db.prepare(`
        INSERT INTO audit_logs (timestamp, action, actor, details)
        VALUES (?, ?, ?, ?)
    `);

    insertAudit.run('2026-03-23 09:00:00', 'DATABASE_INITIALIZATION', 'SYSTEM', 'Populated initial 10 digital forensics cases and relations.');
    insertAudit.run('2026-03-23 09:05:00', 'CHAIN_OF_CUSTODY_VERIFY', 'Special Agent Sarah Connor', 'Cryptographic SHA-256 baseline verification completed for all 100 evidence items.');

    console.log('[Seed] Database successfully seeded!');
    console.log(`- Cases: ${cases.length}`);
    console.log(`- Persons of Interest: ${persons.length}`);
    console.log(`- Devices: ${devices.length}`);
    console.log(`- Accounts: ${accounts.length}`);
    console.log(`- Evidence Items: ${caseEvidenceTemplates.flat().length + duplicateEvidence.length}`);
    console.log(`- Login Logs: ${loginData.length}`);
    console.log(`- File Access Logs: ${fileAccessData.length}`);
    console.log(`- Email Records: ${emailData.length}`);
    console.log(`- Timeline Events: ${timelineEvents.length}`);
    console.log(`- Evidence Relationships: ${relationships.length}`);
}

module.exports = { seedData };

if (require.main === module) {
    seedData();
}
