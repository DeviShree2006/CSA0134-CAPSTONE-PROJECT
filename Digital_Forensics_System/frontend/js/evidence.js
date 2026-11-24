/**
 * EVIDENCE MANAGEMENT JAVASCRIPT CONTROLLER
 * Powers the evidence vault, Trie-based autocomplete prefix search,
 * manual evidence addition, file uploads, and duplicate detection.
 */

let allEvidenceList = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check if case filter query param exists in URL
    const urlParams = new URLSearchParams(window.location.search);
    const caseParam = urlParams.get('caseId');
    if (caseParam) {
        document.getElementById('filter-case').value = caseParam;
    }

    await loadEvidence();

    // Wire filter events
    document.getElementById('filter-case').addEventListener('change', loadEvidence);
    document.getElementById('filter-type').addEventListener('change', loadEvidence);
    document.getElementById('filter-priority').addEventListener('change', loadEvidence);

    // Wire Trie search
    setupTrieSearch();

    // Wire Form Submissions
    document.getElementById('form-add-evidence').addEventListener('submit', handleAddEvidence);
    document.getElementById('form-upload-evidence').addEventListener('submit', handleUploadEvidence);
});

async function loadEvidence() {
    const caseId = document.getElementById('filter-case').value;
    const type = document.getElementById('filter-type').value;
    const priority = document.getElementById('filter-priority').value;
    const search = document.getElementById('evidence-search-input').value.trim();

    try {
        const res = await API.getEvidence({ caseId, type, priority, search });
        if (!res.success) {
            UI.showToast('Failed to load evidence artifacts', 'error');
            return;
        }

        allEvidenceList = res.data;
        renderEvidenceTable(allEvidenceList);
    } catch (err) {
        console.error('Error fetching evidence:', err);
        UI.showToast('Error connecting to backend API', 'error');
    }
}

function renderEvidenceTable(evidenceItems) {
    const tbody = document.getElementById('evidence-master-tbody');
    const countEl = document.getElementById('evidence-count');
    if (countEl) countEl.textContent = evidenceItems.length;

    if (evidenceItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 36px; color: var(--text-muted);">
                    <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
                    <strong>No evidence artifacts found matching current filters.</strong>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = evidenceItems.map(item => `
        <tr>
            <td>
                <a href="javascript:void(0)" onclick="openEvidenceDetail('${item.evidence_id}')" style="font-family: var(--font-mono); font-weight: bold; color: var(--primary-light); text-decoration: none;">
                    ${item.evidence_id}
                </a>
            </td>
            <td><span class="case-id-badge">${item.case_id}</span></td>
            <td>
                <div style="font-weight: 600; color: var(--text-primary);">${item.title}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${item.storage_location || 'Evidence Vault'}</div>
            </td>
            <td><span class="badge badge-info">${item.evidence_type}</span></td>
            <td><small style="color: var(--text-secondary);">${item.source}</small></td>
            <td class="hash-cell" title="${item.sha256_hash}">
                <code>${item.sha256_hash.slice(0, 16)}...${item.sha256_hash.slice(-8)}</code>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                    ${UI.getPriorityBadge(item.priority_level)}
                    <span style="font-family: var(--font-mono); font-size: 12px; font-weight: bold;">${item.priority_score}</span>
                </div>
            </td>
            <td>
                ${item.is_duplicate ? 
                    `<span class="badge badge-duplicate" title="Cryptographic duplicate of ${item.duplicate_of}">⚠️ Duplicate (${item.duplicate_of})</span>` :
                    `<span class="badge badge-low">✓ Unique</span>`
                }
            </td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openEvidenceDetail('${item.evidence_id}')">Inspect</button>
                    <button class="btn btn-secondary btn-sm" onclick="verifyIntegrity('${item.evidence_id}')">Verify</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function resetFilters() {
    document.getElementById('filter-case').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('evidence-search-input').value = '';
    loadEvidence();
}

function setupTrieSearch() {
    const input = document.getElementById('evidence-search-input');
    const dropdown = document.getElementById('trie-autocomplete-results');

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = input.value.trim();

        if (query.length < 2) {
            dropdown.style.display = 'none';
            loadEvidence();
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const res = await API.searchTrie(query, 8);
                if (res.success && res.results.length > 0) {
                    dropdown.innerHTML = res.results.map(r => `
                        <div class="autocomplete-item" onclick="selectTrieResult('${r.term}')">
                            <div>
                                <span style="font-weight: bold; color: var(--primary-light);">${r.term}</span>
                                <small style="color: var(--text-muted); margin-left: 8px;">(${r.records.length} records)</small>
                            </div>
                            <span class="badge badge-info" style="font-size: 10px;">Freq: ${r.frequency}</span>
                        </div>
                    `).join('');
                    dropdown.style.display = 'block';
                } else {
                    dropdown.style.display = 'none';
                }
                loadEvidence();
            } catch (err) {
                console.error('Trie search failed:', err);
            }
        }, 200);
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function selectTrieResult(term) {
    document.getElementById('evidence-search-input').value = term;
    document.getElementById('trie-autocomplete-results').style.display = 'none';
    loadEvidence();
}

async function handleAddEvidence(e) {
    e.preventDefault();
    const data = {
        case_id: document.getElementById('add-case-id').value,
        title: document.getElementById('add-title').value.trim(),
        evidence_type: document.getElementById('add-type').value,
        source: document.getElementById('add-source').value.trim(),
        sha256_hash: document.getElementById('add-hash').value.trim(),
        custody_officer: Auth.getUser()?.fullName || 'Investigator Sarah Connor',
        notes: document.getElementById('add-notes').value.trim()
    };

    try {
        const res = await API.addEvidence(data);
        if (res.success) {
            UI.showToast(`Evidence ${res.evidenceId} registered! Score: ${res.priorityScore} (${res.priorityLevel})`, 'success');
            if (res.isDuplicate) {
                UI.showToast(`Hash Table Alert: Checksum is identical to ${res.duplicateOf}!`, 'info');
            }
            UI.closeModal('modal-add-evidence');
            document.getElementById('form-add-evidence').reset();
            loadEvidence();
        } else {
            UI.showToast(res.error || 'Failed to add evidence', 'error');
        }
    } catch (err) {
        UI.showToast('Network error adding evidence', 'error');
    }
}

async function handleUploadEvidence(e) {
    e.preventDefault();
    const fileInput = document.getElementById('upload-file-input');
    if (!fileInput.files || fileInput.files.length === 0) {
        UI.showToast('Please select a file to upload', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('evidence_file', fileInput.files[0]);
    formData.append('case_id', document.getElementById('upload-case-id').value);
    formData.append('title', document.getElementById('upload-title').value.trim());
    formData.append('notes', document.getElementById('upload-notes').value.trim());
    formData.append('custody_officer', Auth.getUser()?.fullName || 'Investigator Sarah Connor');

    const submitBtn = document.getElementById('btn-upload-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Computing SHA-256 & Uploading...';

    try {
        const res = await API.uploadEvidenceFile(formData);
        if (res.success) {
            UI.showToast(`File uploaded! Assigned ${res.evidenceId} with SHA-256`, 'success');
            if (res.isDuplicate) {
                UI.showToast(`Duplicate Detected: Matches ${res.duplicateOf}!`, 'info');
            }
            UI.closeModal('modal-upload-evidence');
            document.getElementById('form-upload-evidence').reset();
            loadEvidence();
        } else {
            UI.showToast(res.error || 'Upload failed', 'error');
        }
    } catch (err) {
        UI.showToast('Network error during file upload', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Compute Hash & Secure Upload';
    }
}

async function openEvidenceDetail(evidenceId) {
    const modalBody = document.getElementById('modal-evidence-detail-body');
    modalBody.innerHTML = '<div style="text-align: center; padding: 24px;">Loading evidence dossier...</div>';
    UI.openModal('modal-evidence-details');

    try {
        const res = await API.getEvidenceById(evidenceId);
        if (!res.success) {
            modalBody.innerHTML = `<div style="color: var(--accent-rose);">${res.error}</div>`;
            return;
        }

        const ev = res.data;
        modalBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div>
                    <h3 style="font-size: 18px; color: #fff; margin-bottom: 4px;">${ev.title}</h3>
                    <span class="case-id-badge">${ev.evidence_id}</span>
                    <span class="badge badge-info" style="margin-left: 6px;">${ev.evidence_type}</span>
                </div>
                <div>
                    ${UI.getPriorityBadge(ev.priority_level)}
                    <span style="font-family: var(--font-mono); font-size: 13px; font-weight: bold; margin-left: 4px;">${ev.priority_score}/100</span>
                </div>
            </div>

            <!-- Cryptographic Checksum Box -->
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 4px;">Cryptographic SHA-256 Integrity Checksum</div>
                <div style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-cyan); word-break: break-all;">
                    ${ev.sha256_hash}
                </div>
            </div>

            <!-- Duplicate Status Box -->
            <div style="background: ${ev.is_duplicate ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; border: 1px solid ${ev.is_duplicate ? '#8b5cf6' : '#10b981'}; border-radius: 6px; padding: 12px; margin-bottom: 16px; font-size: 12.5px;">
                <strong>Hash Table Duplicate Detection:</strong>
                ${ev.is_duplicate ? 
                    `<div style="color: #c084fc; margin-top: 4px;">⚠️ Cryptographic duplicate collision detected! This artifact has the identical checksum as <strong>${ev.duplicate_of}</strong>.</div>` :
                    `<div style="color: #34d399; margin-top: 4px;">✓ Cryptographic hash is unique across active repository.</div>`
                }
            </div>

            <!-- Priority Breakdown -->
            <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">Forensic Priority Score Breakdown (Max-Heap Queue):</div>
                <div style="font-size: 12px; color: var(--text-primary); font-family: var(--font-mono);">${ev.priority_reason || 'Score calculated by automated triage rules.'}</div>
            </div>

            <!-- Metadata Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12.5px; color: var(--text-secondary); margin-bottom: 16px;">
                <div><strong>Source Origin:</strong> ${ev.source}</div>
                <div><strong>Acquisition Time:</strong> ${ev.timestamp}</div>
                <div><strong>Custody Officer:</strong> ${ev.custody_officer}</div>
                <div><strong>Storage Location:</strong> ${ev.storage_location}</div>
                <div><strong>File Size:</strong> ${UI.formatBytes(ev.file_size_bytes)}</div>
                <div><strong>Case:</strong> <a href="case-details.html?caseId=${ev.case_id}" style="color: var(--primary-light);">${ev.case_id}</a></div>
            </div>

            <div style="font-size: 12.5px; color: var(--text-muted); background: var(--bg-card); padding: 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">
                <strong>Investigative Notes:</strong> ${ev.notes || 'No supplemental notes.'}
            </div>
        `;
    } catch (err) {
        modalBody.innerHTML = '<div style="color: var(--accent-rose);">Network error loading evidence details.</div>';
    }
}

async function verifyIntegrity(evidenceId) {
    try {
        const res = await API.verifyIntegrity(evidenceId);
        if (res.success) {
            UI.showToast(`SHA-256 for ${evidenceId} verified: ${res.diskVerification}`, 'success');
        } else {
            UI.showToast(res.error || 'Verification failed', 'error');
        }
    } catch (err) {
        UI.showToast('Network error during verification', 'error');
    }
}

function generateRandomSampleHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById('add-hash').value = hash;
}
