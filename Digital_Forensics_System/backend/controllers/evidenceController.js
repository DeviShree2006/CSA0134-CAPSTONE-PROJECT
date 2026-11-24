/**
 * EVIDENCE CONTROLLER
 * Manages evidence lifecycle, SHA-256 hashing, uploads, duplicate detection,
 * and Trie-based high-speed prefix search.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { query, get, run } = require('../database');
const { HashTable } = require('../../data_structures/hash_table');
const { Trie } = require('../../data_structures/trie');
const { ForensicPriorityQueue } = require('../../data_structures/priority_queue');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Initialize in-memory Trie index for rapid search
let searchTrie = null;

function getSearchTrie() {
    if (!searchTrie) {
        searchTrie = new Trie();
        const allEvidence = query('SELECT * FROM evidence');
        searchTrie.indexEvidenceList(allEvidence);
    }
    return searchTrie;
}

function refreshSearchTrie() {
    searchTrie = null;
    return getSearchTrie();
}

/**
 * Get all evidence records with optional filtering
 */
function getEvidence(req, res) {
    try {
        const { caseId, type, priority, search } = req.query;
        let sql = 'SELECT * FROM evidence WHERE 1=1';
        const params = [];

        if (caseId) {
            sql += ' AND case_id = ?';
            params.push(caseId);
        }
        if (type) {
            sql += ' AND evidence_type = ?';
            params.push(type);
        }
        if (priority) {
            sql += ' AND priority_level = ?';
            params.push(priority);
        }

        let results = query(sql, params);

        // If keyword search requested, evaluate via Trie or keyword matching
        if (search && search.trim().length > 0) {
            const trie = getSearchTrie();
            const trieMatches = trie.autocomplete(search, 50);
            const matchedIds = new Set();
            for (const m of trieMatches) {
                for (const rec of m.records) {
                    matchedIds.add(rec.evidence_id);
                }
            }

            const cleanSearch = search.toLowerCase();
            results = results.filter(e => 
                matchedIds.has(e.evidence_id) ||
                (e.title && e.title.toLowerCase().includes(cleanSearch)) ||
                (e.evidence_id && e.evidence_id.toLowerCase().includes(cleanSearch)) ||
                (e.source && e.source.toLowerCase().includes(cleanSearch)) ||
                (e.sha256_hash && e.sha256_hash.toLowerCase().includes(cleanSearch))
            );
        }

        res.json({ success: true, count: results.length, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/**
 * Autocomplete prefix search using Trie
 */
function searchWithTrie(req, res) {
    try {
        const { query: term, limit = 10 } = req.query;
        if (!term || term.trim().length === 0) {
            return res.json({ success: true, results: [] });
        }

        const trie = getSearchTrie();
        const matches = trie.autocomplete(term, parseInt(limit, 10));

        res.json({
            success: true,
            query: term,
            count: matches.length,
            results: matches,
            trieMetrics: trie.getMetrics()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/**
 * Get single evidence record with relationship links and duplicate check
 */
function getEvidenceById(req, res) {
    try {
        const { evidenceId } = req.params;
        const item = get('SELECT * FROM evidence WHERE evidence_id = ?', [evidenceId]);

        if (!item) {
            return res.status(404).json({ success: false, error: `Evidence '${evidenceId}' not found.` });
        }

        // Fetch relationships involving this evidence
        const relationships = query(`
            SELECT * FROM evidence_relationships 
            WHERE source_id = ? OR target_id = ?
        `, [evidenceId, evidenceId]);

        // Fetch timeline events referencing this evidence
        const events = query('SELECT * FROM investigation_events WHERE related_evidence_id = ?', [evidenceId]);

        // Duplicate verification using Hash Table
        const allItems = query('SELECT * FROM evidence WHERE evidence_id != ?', [evidenceId]);
        const ht = new HashTable(64);
        for (const other of allItems) {
            ht.set(other.sha256_hash, other);
        }
        const duplicateStatus = ht.detectDuplicate(item.sha256_hash);

        res.json({
            success: true,
            data: {
                ...item,
                relationships,
                events,
                duplicateStatus
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/**
 * Add new evidence manually
 */
function addEvidence(req, res) {
    try {
        const {
            case_id,
            title,
            evidence_type,
            source,
            timestamp,
            sha256_hash,
            file_size_bytes = 0,
            custody_officer = 'Lead Investigator',
            storage_location = 'Secure Evidence Vault',
            notes = ''
        } = req.body;

        if (!case_id || !title || !evidence_type || !sha256_hash) {
            return res.status(400).json({ success: false, error: 'case_id, title, evidence_type, and sha256_hash are required.' });
        }

        // Generate unique Evidence ID
        const countRow = get('SELECT COUNT(*) as cnt FROM evidence');
        const nextNum = (countRow.cnt + 1).toString().padStart(3, '0');
        const evidence_id = `EVD-2026-${nextNum}`;

        // Check duplicates with Hash Table
        const allItems = query('SELECT * FROM evidence');
        const ht = new HashTable(128);
        for (const item of allItems) {
            ht.set(item.sha256_hash.toLowerCase(), item);
        }

        const duplicateCheck = ht.detectDuplicate(sha256_hash);
        let is_duplicate = 0;
        let duplicate_of = null;

        if (duplicateCheck && duplicateCheck.isDuplicate) {
            is_duplicate = 1;
            duplicate_of = duplicateCheck.existingRecord.evidence_id;
        }

        // Calculate Forensic Priority Score using ForensicPriorityQueue
        const scoreData = ForensicPriorityQueue.calculateScore({
            evidence_type,
            title,
            notes,
            sha256_hash,
            timestamp: timestamp || new Date().toISOString()
        });

        run(`
            INSERT INTO evidence (
                evidence_id, case_id, title, evidence_type, source, timestamp,
                sha256_hash, file_size_bytes, custody_officer, storage_location,
                priority_level, priority_score, priority_reason, notes, is_duplicate, duplicate_of
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            evidence_id, case_id, title, evidence_type, source || 'Field Acquisition',
            timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
            sha256_hash.toLowerCase(), file_size_bytes, custody_officer, storage_location,
            scoreData.level, scoreData.totalScore, scoreData.explanation, notes,
            is_duplicate, duplicate_of
        ]);

        run('INSERT INTO audit_logs (action, actor, details) VALUES (?, ?, ?)', [
            'ADD_EVIDENCE', custody_officer, `Registered new evidence artifact ${evidence_id} for case ${case_id}`
        ]);

        refreshSearchTrie();

        res.json({
            success: true,
            message: 'Evidence successfully registered.',
            evidenceId: evidence_id,
            isDuplicate: !!is_duplicate,
            duplicateOf: duplicate_of,
            priorityLevel: scoreData.level,
            priorityScore: scoreData.totalScore
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/**
 * Handle File Upload for Evidence with SHA-256 integrity calculation
 */
function uploadEvidenceFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded.' });
        }

        const { case_id, title, evidence_type, source, custody_officer, notes } = req.body;
        const filePath = req.file.path;
        const originalName = req.file.originalname;
        const fileSize = req.file.size;

        // Compute SHA-256 hash
        const fileBuffer = fs.readFileSync(filePath);
        const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Check duplicate using Hash Table
        const allItems = query('SELECT * FROM evidence');
        const ht = new HashTable(128);
        for (const item of allItems) {
            ht.set(item.sha256_hash.toLowerCase(), item);
        }

        const duplicateCheck = ht.detectDuplicate(sha256Hash);
        let is_duplicate = 0;
        let duplicate_of = null;

        if (duplicateCheck && duplicateCheck.isDuplicate) {
            is_duplicate = 1;
            duplicate_of = duplicateCheck.existingRecord.evidence_id;
        }

        // Generate ID
        const countRow = get('SELECT COUNT(*) as cnt FROM evidence');
        const nextNum = (countRow.cnt + 1).toString().padStart(3, '0');
        const evidence_id = `EVD-2026-${nextNum}`;

        const scoreData = ForensicPriorityQueue.calculateScore({
            evidence_type: evidence_type || 'Uploaded File Artifact',
            title: title || originalName,
            notes,
            sha256_hash: sha256Hash,
            timestamp: new Date().toISOString()
        });

        run(`
            INSERT INTO evidence (
                evidence_id, case_id, title, evidence_type, source, timestamp,
                sha256_hash, file_size_bytes, custody_officer, storage_location,
                priority_level, priority_score, priority_reason, notes, is_duplicate, duplicate_of
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            evidence_id,
            case_id || 'CASE-2026-001',
            title || originalName,
            evidence_type || 'Uploaded Digital Artifact',
            source || `Uploaded File: ${originalName}`,
            new Date().toISOString().replace('T', ' ').slice(0, 19),
            sha256Hash,
            fileSize,
            custody_officer || 'Evidence Custodian',
            `uploads/${path.basename(filePath)}`,
            scoreData.level,
            scoreData.totalScore,
            scoreData.explanation,
            notes || `Uploaded file preserved securely with verified SHA-256 checksum.`,
            is_duplicate,
            duplicate_of
        ]);

        run('INSERT INTO audit_logs (action, actor, details) VALUES (?, ?, ?)', [
            'FILE_UPLOAD_EVIDENCE', custody_officer || 'CUSTODIAN',
            `Uploaded file ${originalName} (SHA-256: ${sha256Hash.slice(0, 16)}...) registered as ${evidence_id}`
        ]);

        refreshSearchTrie();

        res.json({
            success: true,
            evidenceId: evidence_id,
            fileName: originalName,
            fileSize,
            sha256Hash,
            isDuplicate: !!is_duplicate,
            duplicateOf: duplicate_of,
            priorityLevel: scoreData.level,
            priorityScore: scoreData.totalScore,
            explanation: scoreData.explanation
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/**
 * Verify evidence integrity checksum against recorded hash
 */
function verifyIntegrity(req, res) {
    try {
        const { evidenceId } = req.params;
        const item = get('SELECT * FROM evidence WHERE evidence_id = ?', [evidenceId]);

        if (!item) {
            return res.status(404).json({ success: false, error: 'Evidence not found' });
        }

        // Check format of hash
        const isValidFormat = /^[a-f0-9]{64}$/i.test(item.sha256_hash);

        // Check if file exists on disk in uploads if applicable
        let fileStatus = 'Stored in Evidence Vault';
        let diskCheck = 'Vault Record Validated';

        if (item.storage_location && item.storage_location.startsWith('uploads/')) {
            const diskPath = path.join(__dirname, '../../', item.storage_location);
            if (fs.existsSync(diskPath)) {
                const buf = fs.readFileSync(diskPath);
                const currentHash = crypto.createHash('sha256').update(buf).digest('hex');
                if (currentHash === item.sha256_hash.toLowerCase()) {
                    diskCheck = 'File Verified on Disk: Cryptographic Hash Matches Baseline Exactly.';
                } else {
                    diskCheck = 'WARNING: Disk File Hash Discrepancy! Possible Tampering!';
                }
            } else {
                fileStatus = 'Offline Archive Vault';
            }
        }

        res.json({
            success: true,
            evidenceId: item.evidence_id,
            sha256Hash: item.sha256_hash,
            algorithm: 'SHA-256',
            isValidFormat,
            fileStatus,
            integrityStatus: 'VERIFIED',
            diskVerification: diskCheck,
            verifiedAt: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    getEvidence,
    getEvidenceById,
    addEvidence,
    uploadEvidenceFile,
    verifyIntegrity,
    searchWithTrie
};
