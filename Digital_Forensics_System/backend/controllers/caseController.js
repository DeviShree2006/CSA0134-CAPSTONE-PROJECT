/**
 * CASE CONTROLLER
 * Handles case library retrieval, comprehensive case dossiers, and status updates.
 */

const { query, get, run } = require('../database');

function getAllCases(req, res) {
    try {
        const sql = `
            SELECT 
                c.id, c.case_id, c.title, c.category, c.description, 
                c.background, c.incident_date, c.status, c.lead_investigator, c.severity,
                COUNT(DISTINCT e.id) as evidence_count,
                COUNT(DISTINCT p.id) as person_count,
                COUNT(DISTINCT d.id) as device_count,
                COUNT(DISTINCT evt.id) as event_count
            FROM cases c
            LEFT JOIN evidence e ON c.case_id = e.case_id
            LEFT JOIN persons p ON c.case_id = p.case_id
            LEFT JOIN devices d ON c.case_id = d.case_id
            LEFT JOIN investigation_events evt ON c.case_id = evt.case_id
            GROUP BY c.case_id
            ORDER BY c.incident_date DESC
        `;
        const cases = query(sql);
        res.json({ success: true, count: cases.length, data: cases });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function getCaseById(req, res) {
    try {
        const { caseId } = req.params;
        const caseInfo = get('SELECT * FROM cases WHERE case_id = ?', [caseId]);

        if (!caseInfo) {
            return res.status(404).json({ success: false, error: `Case '${caseId}' not found.` });
        }

        const persons = query('SELECT * FROM persons WHERE case_id = ? ORDER BY id ASC', [caseId]);
        const devices = query('SELECT * FROM devices WHERE case_id = ? ORDER BY id ASC', [caseId]);
        const accounts = query('SELECT * FROM accounts WHERE case_id = ? ORDER BY id ASC', [caseId]);
        const evidence = query('SELECT * FROM evidence WHERE case_id = ? ORDER BY priority_score DESC, id ASC', [caseId]);
        const loginLogs = query('SELECT * FROM login_logs WHERE case_id = ? ORDER BY login_time ASC', [caseId]);
        const fileLogs = query('SELECT * FROM file_access_logs WHERE case_id = ? ORDER BY access_time ASC', [caseId]);
        const emails = query('SELECT * FROM email_records WHERE case_id = ? ORDER BY sent_time ASC', [caseId]);
        const events = query('SELECT * FROM investigation_events WHERE case_id = ? ORDER BY event_time ASC', [caseId]);
        const relationships = query('SELECT * FROM evidence_relationships WHERE case_id = ? ORDER BY id ASC', [caseId]);

        res.json({
            success: true,
            data: {
                caseInfo,
                persons,
                devices,
                accounts,
                evidence,
                loginLogs,
                fileLogs,
                emails,
                events,
                relationships
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function updateCaseStatus(req, res) {
    try {
        const { caseId } = req.params;
        const { status } = req.body;

        const allowed = ['Active', 'Under Review', 'Closed - Findings Logged'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
        }

        run('UPDATE cases SET status = ? WHERE case_id = ?', [status, caseId]);
        run('INSERT INTO audit_logs (action, actor, details) VALUES (?, ?, ?)', [
            'UPDATE_CASE_STATUS', 'INVESTIGATOR', `Updated ${caseId} status to '${status}'`
        ]);

        res.json({ success: true, message: `Case status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    getAllCases,
    getCaseById,
    updateCaseStatus
};
