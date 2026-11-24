/**
 * REPORT & DASHBOARD STATS CONTROLLER
 * Generates downloadable forensic investigation reports and aggregates dashboard metrics.
 */

const { query, get, resetDatabase: dbReset } = require('../database');
const { ForensicAnalysisEngine } = require('../services/analysisEngine');

function getDashboardStats(req, res) {
    try {
        const totalCases = get('SELECT COUNT(*) as cnt FROM cases').cnt;
        const totalEvidence = get('SELECT COUNT(*) as cnt FROM evidence').cnt;
        const totalPersons = get('SELECT COUNT(*) as cnt FROM persons').cnt;
        const totalDevices = get('SELECT COUNT(*) as cnt FROM devices').cnt;

        // Evidence category breakdown
        const evidenceTypes = query(`
            SELECT evidence_type as category, COUNT(*) as count 
            FROM evidence 
            GROUP BY evidence_type 
            ORDER BY count DESC
        `);

        // Case status breakdown
        const caseStatuses = query(`
            SELECT status, COUNT(*) as count 
            FROM cases 
            GROUP BY status
        `);

        // Case severity breakdown
        const caseSeverities = query(`
            SELECT severity, COUNT(*) as count 
            FROM cases 
            GROUP BY severity
        `);

        // Priority breakdown
        const priorityDistribution = query(`
            SELECT priority_level, COUNT(*) as count 
            FROM evidence 
            GROUP BY priority_level
        `);

        // Recent investigation activity from audit logs and events
        const recentActivity = query(`
            SELECT timestamp as time, action as title, actor, details 
            FROM audit_logs 
            ORDER BY id DESC 
            LIMIT 8
        `);

        // Top critical cases
        const criticalCases = query(`
            SELECT case_id, title, category, status, severity, incident_date 
            FROM cases 
            ORDER BY incident_date DESC 
            LIMIT 5
        `);

        res.json({
            success: true,
            stats: {
                totalCases,
                totalEvidence,
                totalPersons,
                totalDevices
            },
            evidenceTypes,
            caseStatuses,
            caseSeverities,
            priorityDistribution,
            recentActivity,
            criticalCases
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function generateReport(req, res) {
    try {
        const { caseId } = req.params;
        const format = req.query.format || 'json';

        const caseInfo = get('SELECT * FROM cases WHERE case_id = ?', [caseId]);
        if (!caseInfo) {
            return res.status(404).json({ success: false, error: `Case '${caseId}' not found.` });
        }

        const persons = query('SELECT * FROM persons WHERE case_id = ?', [caseId]);
        const devices = query('SELECT * FROM devices WHERE case_id = ?', [caseId]);
        const evidence = query('SELECT * FROM evidence WHERE case_id = ? ORDER BY priority_score DESC', [caseId]);
        const events = query('SELECT * FROM investigation_events WHERE case_id = ? ORDER BY event_time ASC', [caseId]);
        const relationships = query('SELECT * FROM evidence_relationships WHERE case_id = ?', [caseId]);
        const loginLogs = query('SELECT * FROM login_logs WHERE case_id = ?', [caseId]);
        const fileLogs = query('SELECT * FROM file_access_logs WHERE case_id = ?', [caseId]);
        const emails = query('SELECT * FROM email_records WHERE case_id = ?', [caseId]);

        const analysis = ForensicAnalysisEngine.analyzeCase({
            caseInfo,
            persons,
            devices,
            evidence,
            events,
            relationships,
            loginLogs,
            fileLogs,
            emails
        });

        if (format === 'html') {
            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Forensic Investigation Report - ${caseInfo.case_id}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
        .header { border-bottom: 3px solid #0056b3; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #0a192f; margin: 0; font-size: 26px; }
        .badge { background: #0056b3; color: white; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: bold; }
        .disclaimer { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 14px; }
        h2 { color: #003366; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; font-size: 13px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background: #f1f5f9; color: #334155; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 15px; }
        .footer { margin-top: 50px; font-size: 12px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 15px; text-align: center; }
        @media print { .no-print { display: none; } body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #0056b3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Print / Save as PDF
        </button>
    </div>

    <div class="header">
        <span class="badge">OFFICIAL FORENSIC DOSSIER</span>
        <h1 class="title">${caseInfo.title}</h1>
        <p><strong>Case ID:</strong> ${caseInfo.case_id} | <strong>Category:</strong> ${caseInfo.category} | <strong>Date:</strong> ${caseInfo.incident_date}</p>
        <p><strong>Lead Investigator:</strong> ${caseInfo.lead_investigator} | <strong>Status:</strong> ${caseInfo.status} | <strong>Severity:</strong> ${caseInfo.severity}</p>
    </div>

    <div class="disclaimer">
        <strong>LEGAL DISCLAIMER:</strong> This report contains investigative leads and preliminary technical correlation results derived from digital artifacts. All persons referenced are presumed innocent until proven guilty in a court of law. All observations require human examiner corroboration.
    </div>

    <h2>1. Incident Background & Summary</h2>
    <div class="card">
        <p><strong>Description:</strong> ${caseInfo.description}</p>
        <p><strong>Incident Background:</strong> ${caseInfo.background}</p>
    </div>

    <h2>2. Key Forensic Observations</h2>
    ${analysis.keyObservations.map(o => `
        <div class="card">
            <h4 style="margin: 0 0 8px 0; color: #0056b3;">${o.title} [Severity: ${o.severity}]</h4>
            <p style="margin: 0 0 6px 0;">${o.detail}</p>
            <small><strong>Supporting Evidence:</strong> ${o.evidenceIds.join(', ')}</small>
        </div>
    `).join('')}

    <h2>3. Investigation Hypotheses & Leads</h2>
    ${analysis.hypotheses.map(h => `
        <div class="card" style="border-left: 4px solid #0056b3;">
            <h4 style="margin: 0 0 6px 0;">${h.id}: ${h.title} (Likelihood: ${h.likelihood})</h4>
            <p style="margin: 0 0 8px 0;">${h.description}</p>
            <p style="margin: 0 0 6px 0; font-size: 13px;"><em>Rationale:</em> ${h.rationale}</p>
            <small><strong>Citing Evidence IDs:</strong> ${h.supportingEvidenceIds.join(', ')}</small>
        </div>
    `).join('')}

    <h2>4. Alternative Explanations Considered</h2>
    ${analysis.alternativeExplanations.map(a => `
        <div class="card">
            <strong>${a.explanation} (Feasibility: ${a.feasibility})</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">${a.notes}</p>
        </div>
    `).join('')}

    <h2>5. Evidence Artifact Inventory</h2>
    <table>
        <thead>
            <tr>
                <th>Evidence ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Source</th>
                <th>SHA-256 Hash</th>
                <th>Priority</th>
            </tr>
        </thead>
        <tbody>
            ${evidence.map(e => `
                <tr>
                    <td><strong>${e.evidence_id}</strong></td>
                    <td>${e.title}</td>
                    <td>${e.evidence_type}</td>
                    <td>${e.source}</td>
                    <td><code style="font-size: 11px;">${e.sha256_hash.slice(0, 24)}...</code></td>
                    <td>${e.priority_level} (${e.priority_score})</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <h2>6. Chronological Investigation Timeline</h2>
    <table>
        <thead>
            <tr>
                <th>Event Time</th>
                <th>Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Linked Evidence</th>
            </tr>
        </thead>
        <tbody>
            ${events.map(ev => `
                <tr>
                    <td>${ev.event_time}</td>
                    <td><strong>${ev.title}</strong><br><small>${ev.description}</small></td>
                    <td>${ev.category}</td>
                    <td>${ev.severity}</td>
                    <td>${ev.related_evidence_id || 'N/A'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <h2>7. Recommended Next Steps</h2>
    <ol>
        ${analysis.recommendedNextSteps.map(s => `<li>${s}</li>`).join('')}
    </ol>

    <div class="footer">
        Generated by Digital Forensics & Evidence Correlation System | Academic Data Structures Laboratory
    </div>
</body>
</html>
            `;
            res.setHeader('Content-Type', 'text/html');
            return res.send(html);
        }

        res.json({
            success: true,
            caseId,
            generatedAt: new Date().toISOString(),
            dossier: {
                caseInfo,
                persons,
                devices,
                evidenceCount: evidence.length,
                evidence,
                timeline: events,
                relationships,
                analysis
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function handleResetDatabase(req, res) {
    try {
        const { confirm } = req.body;
        if (!confirm) {
            return res.status(400).json({ success: false, error: 'Confirmation required. Pass { confirm: true }.' });
        }

        dbReset();
        res.json({ success: true, message: 'Database successfully re-initialized and seeded with fresh sample dataset.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    getDashboardStats,
    generateReport,
    handleResetDatabase
};
