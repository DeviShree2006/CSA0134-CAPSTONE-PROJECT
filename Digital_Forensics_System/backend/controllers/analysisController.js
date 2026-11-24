/**
 * ANALYSIS CONTROLLER
 * Invokes the rule-based ForensicAnalysisEngine to correlate case records.
 */

const { get, query } = require('../database');
const { ForensicAnalysisEngine } = require('../services/analysisEngine');

function generateCaseAnalysis(req, res) {
    try {
        const { caseId } = req.params;

        const caseInfo = get('SELECT * FROM cases WHERE case_id = ?', [caseId]);
        if (!caseInfo) {
            return res.status(404).json({ success: false, error: `Case '${caseId}' not found.` });
        }

        const persons = query('SELECT * FROM persons WHERE case_id = ?', [caseId]);
        const devices = query('SELECT * FROM devices WHERE case_id = ?', [caseId]);
        const accounts = query('SELECT * FROM accounts WHERE case_id = ?', [caseId]);
        const evidence = query('SELECT * FROM evidence WHERE case_id = ?', [caseId]);
        const loginLogs = query('SELECT * FROM login_logs WHERE case_id = ?', [caseId]);
        const fileLogs = query('SELECT * FROM file_access_logs WHERE case_id = ?', [caseId]);
        const emails = query('SELECT * FROM email_records WHERE case_id = ?', [caseId]);
        const events = query('SELECT * FROM investigation_events WHERE case_id = ?', [caseId]);
        const relationships = query('SELECT * FROM evidence_relationships WHERE case_id = ?', [caseId]);

        const analysis = ForensicAnalysisEngine.analyzeCase({
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
        });

        res.json({
            success: true,
            data: analysis
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    generateCaseAnalysis
};
