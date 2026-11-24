/**
 * CASE DETAILS JAVASCRIPT CONTROLLER
 * Loads detailed case dossier, populates multi-tab view, and handles status updates.
 */

let currentCaseId = 'CASE-2026-001';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentCaseId = urlParams.get('caseId') || 'CASE-2026-001';

    // Set action links
    document.getElementById('btn-jump-analysis').href = `analysis.html?caseId=${currentCaseId}`;
    document.getElementById('btn-jump-graph').href = `graph.html?caseId=${currentCaseId}`;
    document.getElementById('btn-print-report').href = `/api/reports/${currentCaseId}?format=html`;
    document.getElementById('btn-full-timeline').href = `timeline.html?caseId=${currentCaseId}`;

    await loadCaseDossier();

    document.getElementById('btn-save-status').addEventListener('click', updateStatus);
});

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
    if (activeBtn) activeBtn.classList.add('active');

    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.classList.add('active');
}

async function loadCaseDossier() {
    try {
        const res = await API.getCaseById(currentCaseId);
        if (!res.success) {
            UI.showToast('Failed to load case dossier', 'error');
            return;
        }

        const { caseInfo, persons, devices, accounts, evidence, events, loginLogs, fileLogs } = res.data;

        // Populate Header
        document.getElementById('topbar-case-title').textContent = `${caseInfo.case_id}: ${caseInfo.title}`;
        document.getElementById('dossier-id').textContent = caseInfo.case_id;
        document.getElementById('dossier-title').textContent = caseInfo.title;
        document.getElementById('dossier-category').textContent = `Category: ${caseInfo.category}`;
        document.getElementById('dossier-severity').innerHTML = UI.getPriorityBadge(caseInfo.severity);
        document.getElementById('dossier-desc').textContent = caseInfo.description;
        document.getElementById('dossier-date').textContent = caseInfo.incident_date;
        document.getElementById('dossier-investigator').textContent = caseInfo.lead_investigator;
        document.getElementById('dossier-status').innerHTML = UI.getStatusBadge(caseInfo.status);
        document.getElementById('select-status').value = caseInfo.status;

        // Background
        document.getElementById('dossier-full-background').textContent = caseInfo.background;

        // Counts
        document.getElementById('count-persons').textContent = persons.length;
        document.getElementById('count-devices').textContent = devices.length;
        document.getElementById('count-evidence').textContent = evidence.length;
        document.getElementById('count-events').textContent = events.length;

        // Persons of Interest Cards
        const personsList = document.getElementById('persons-list');
        personsList.innerHTML = persons.map(p => `
            <div class="person-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <strong style="font-size: 15px; color: var(--text-primary);">${p.name}</strong>
                        <div style="font-size: 12px; color: var(--accent-cyan); font-family: var(--font-mono);">${p.person_id}</div>
                    </div>
                    <span class="badge ${p.status.includes('Interest') ? 'badge-high' : 'badge-info'}">${p.status}</span>
                </div>
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;"><strong>Role:</strong> ${p.role}</div>
                <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 8px;"><strong>Dept:</strong> ${p.department}</div>
                <div style="font-size: 12px; color: var(--text-muted); background: var(--bg-card); padding: 8px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                    <em>Notes:</em> ${p.notes || 'No investigative notes recorded.'}
                </div>
            </div>
        `).join('');

        // Devices Cards
        const devicesList = document.getElementById('devices-list');
        devicesList.innerHTML = devices.map(d => `
            <div class="device-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <strong style="font-size: 15px; color: var(--text-primary);">${d.device_name}</strong>
                        <div style="font-size: 12px; color: var(--primary-light); font-family: var(--font-mono);">${d.device_id}</div>
                    </div>
                    ${UI.getStatusBadge(d.status)}
                </div>
                <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 3px;"><strong>Type:</strong> ${d.device_type}</div>
                <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 3px;"><strong>OS:</strong> ${d.operating_system || 'N/A'}</div>
                <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 8px;">
                    MAC: ${d.mac_address || 'N/A'} | S/N: ${d.serial_number || 'N/A'}
                </div>
                <div style="font-size: 12px; color: var(--text-muted); background: var(--bg-card); padding: 8px; border-radius: 4px;">
                    ${d.notes || 'Standard hardware profile logged.'}
                </div>
            </div>
        `).join('');

        // Evidence Table
        const evTbody = document.getElementById('evidence-table-tbody');
        evTbody.innerHTML = evidence.map(e => `
            <tr>
                <td><strong style="font-family: var(--font-mono); color: var(--primary-light);">${e.evidence_id}</strong></td>
                <td>
                    <div style="font-weight: 600;">${e.title}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${UI.formatBytes(e.file_size_bytes)}</div>
                </td>
                <td><span class="badge badge-info">${e.evidence_type}</span></td>
                <td><small>${e.source}</small></td>
                <td><small style="color: var(--text-muted);">${e.timestamp}</small></td>
                <td class="hash-cell" title="${e.sha256_hash}">${e.sha256_hash.slice(0, 16)}...${e.sha256_hash.slice(-8)}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        ${UI.getPriorityBadge(e.priority_level)}
                        <span style="font-family: var(--font-mono); font-size: 12px; font-weight: bold;">${e.priority_score}</span>
                    </div>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="checkIntegrityModal('${e.evidence_id}')">Verify</button>
                </td>
            </tr>
        `).join('');

        // Timeline Events Table
        const evtTbody = document.getElementById('events-table-tbody');
        evtTbody.innerHTML = events.map(ev => `
            <tr>
                <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan);">${ev.event_time}</td>
                <td>
                    <div style="font-weight: 600;">${ev.title}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${ev.description}</div>
                </td>
                <td><span class="badge badge-info">${ev.category}</span></td>
                <td>${UI.getPriorityBadge(ev.severity)}</td>
                <td>
                    ${ev.related_evidence_id ? `<span class="badge badge-low">${ev.related_evidence_id}</span>` : '<span style="color: var(--text-muted);">None</span>'}
                </td>
            </tr>
        `).join('');

        // Logs Tables
        const logTbody = document.getElementById('login-logs-tbody');
        logTbody.innerHTML = loginLogs.map(l => `
            <tr>
                <td style="font-size: 11px; font-family: var(--font-mono);">${l.login_time}</td>
                <td><strong>${l.account_id || 'Unknown'}</strong></td>
                <td><code style="font-size: 11px;">${l.ip_address}</code></td>
                <td>${l.auth_status === 'Success' ? '<span class="badge badge-low">Success</span>' : '<span class="badge badge-high">Denied</span>'}</td>
            </tr>
        `).join('');

        const fileTbody = document.getElementById('file-logs-tbody');
        fileTbody.innerHTML = fileLogs.map(f => `
            <tr>
                <td style="font-size: 11px; font-family: var(--font-mono);">${f.access_time}</td>
                <td><span class="badge badge-info">${f.action}</span></td>
                <td style="font-size: 11.5px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${f.file_path}">${f.file_path}</td>
                <td>${UI.formatBytes(f.bytes_transferred)}</td>
            </tr>
        `).join('');

    } catch (err) {
        console.error('Error loading case dossier:', err);
        UI.showToast('Error connecting to backend API', 'error');
    }
}

async function updateStatus() {
    const newStatus = document.getElementById('select-status').value;
    try {
        const res = await API.updateCaseStatus(currentCaseId, newStatus);
        if (res.success) {
            UI.showToast(`Case status updated to '${newStatus}'`, 'success');
            document.getElementById('dossier-status').innerHTML = UI.getStatusBadge(newStatus);
        } else {
            UI.showToast(res.error || 'Failed to update status', 'error');
        }
    } catch (err) {
        UI.showToast('Network error updating status', 'error');
    }
}

async function checkIntegrityModal(evidenceId) {
    const modalBody = document.getElementById('modal-verify-body');
    modalBody.innerHTML = '<div style="text-align: center; padding: 20px;">Computing SHA-256 cryptographic check...</div>';
    UI.openModal('modal-verify-evidence');

    try {
        const res = await API.verifyIntegrity(evidenceId);
        if (res.success) {
            modalBody.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 6px; padding: 14px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #10b981;">
                        <span>✓</span>
                        <span>Cryptographic Baseline Verified</span>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                        The recorded checksum has been validated against the tamper-evident SQLite forensic ledger.
                    </div>
                </div>

                <div style="font-size: 13px; margin-bottom: 12px;">
                    <strong>Evidence Artifact:</strong> <span style="font-family: var(--font-mono); color: var(--primary-light);">${res.evidenceId}</span>
                </div>
                <div style="font-size: 13px; margin-bottom: 12px;">
                    <strong>Algorithm:</strong> ${res.algorithm}
                </div>
                <div style="font-size: 12.5px; margin-bottom: 12px;">
                    <strong>Computed Checksum:</strong>
                    <div style="background: var(--bg-surface-elevated); padding: 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 11.5px; color: var(--accent-cyan); word-break: break-all; margin-top: 4px;">
                        ${res.sha256Hash}
                    </div>
                </div>
                <div style="font-size: 12.5px; color: var(--text-muted);">
                    <strong>Chain of Custody Verification:</strong> ${res.diskVerification}
                </div>
            `;
        } else {
            modalBody.innerHTML = `<div style="color: var(--accent-rose);">${res.error || 'Validation failed.'}</div>`;
        }
    } catch (err) {
        modalBody.innerHTML = '<div style="color: var(--accent-rose);">Network error verifying integrity.</div>';
    }
}
