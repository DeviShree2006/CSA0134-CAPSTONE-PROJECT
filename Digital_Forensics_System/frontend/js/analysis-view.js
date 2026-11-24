/**
 * INVESTIGATION ANALYSIS JAVASCRIPT CONTROLLER
 * Executes the rule-based correlation engine and renders the full forensic analysis report.
 */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const caseParam = urlParams.get('caseId');
    if (caseParam) {
        document.getElementById('analysis-case-select').value = caseParam;
        executeAnalysis();
    }
});

async function executeAnalysis() {
    const caseId = document.getElementById('analysis-case-select').value;
    const btn = document.getElementById('btn-generate-analysis');
    const container = document.getElementById('analysis-results-container');
    const exportBtn = document.getElementById('btn-export-report');
    const graphBtn = document.getElementById('btn-inspect-in-graph');

    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Correlating Database Records & Graph Artifacts...';

    try {
        const res = await API.generateAnalysis(caseId);
        if (!res.success) {
            UI.showToast(res.error || 'Failed to generate investigation analysis', 'error');
            return;
        }

        const data = res.data;

        // Configure Export Links
        exportBtn.href = `/api/reports/${caseId}?format=html`;
        exportBtn.style.display = 'inline-flex';
        graphBtn.href = `graph.html?caseId=${caseId}`;

        // 0. Render Data Structure Engine Metrics
        const dsContainer = document.getElementById('ds-engine-metrics');
        dsContainer.innerHTML = `
            <div>
                <span style="color: var(--text-muted);">Priority Queue:</span><br>
                <strong style="color: var(--primary-light); font-size: 15px;">${data.dsMetrics.priorityQueueSize} Artifacts Enqueued</strong>
            </div>
            <div>
                <span style="color: var(--text-muted);">Graph Adjacency List:</span><br>
                <strong style="color: var(--accent-cyan); font-size: 15px;">${data.dsMetrics.graphMetrics.vertexCount} Vertices, ${data.dsMetrics.graphMetrics.edgeCount} Edges</strong>
            </div>
            <div>
                <span style="color: var(--text-muted);">Timeline Sorting:</span><br>
                <strong style="color: #34d399; font-size: 15px;">${data.dsMetrics.timelineSort.algorithm} (${data.dsMetrics.timelineSort.durationMicros} µs)</strong>
            </div>
            <div>
                <span style="color: var(--text-muted);">Hash Table Cheksums:</span><br>
                <strong style="color: #c084fc; font-size: 15px;">${data.dsMetrics.hashTableMetrics.totalEntries} Keys Indexed</strong>
            </div>
        `;

        // 1. Render Key Observations
        const obsContainer = document.getElementById('observations-list');
        obsContainer.innerHTML = data.keyObservations.map(o => `
            <div class="observation-row">
                <div style="font-size: 20px; line-height: 1;">
                    ${o.severity === 'Critical' ? '🚨' : o.severity === 'High' ? '⚠️' : 'ℹ️'}
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <strong style="font-size: 14.5px; color: #fff;">${o.title}</strong>
                        ${UI.getPriorityBadge(o.severity)}
                    </div>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.5;">
                        ${o.detail}
                    </p>
                    <div style="font-size: 12px; color: var(--text-muted);">
                        <strong>Supporting Evidence:</strong>
                        ${o.evidenceIds.map(id => `<a href="evidence.html?search=${id}" class="evidence-pill-tag">${id}</a>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // 2. Render Hypotheses
        const hypContainer = document.getElementById('hypotheses-list');
        hypContainer.innerHTML = data.hypotheses.map(h => `
            <div class="hypothesis-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <span class="case-id-badge" style="margin-right: 6px;">${h.id}</span>
                        <strong style="font-size: 16px; color: #fff;">${h.title}</strong>
                    </div>
                    <span class="badge ${h.likelihood === 'High' ? 'badge-high' : 'badge-medium'}">Likelihood: ${h.likelihood}</span>
                </div>

                <p style="font-size: 13.5px; color: var(--text-primary); line-height: 1.6; margin-bottom: 12px;">
                    ${h.description}
                </p>

                <div style="background: var(--bg-card); padding: 10px 14px; border-radius: 4px; border: 1px solid var(--border-subtle); margin-bottom: 12px; font-size: 12.5px; color: var(--text-secondary);">
                    <strong style="color: var(--primary-light);">Technical Rationale:</strong> ${h.rationale}
                </div>

                <div style="font-size: 12px; color: var(--text-muted);">
                    <strong>Citing Forensic Evidence Artifacts:</strong><br>
                    ${h.supportingEvidenceIds.map(id => `<a href="evidence.html?search=${id}" class="evidence-pill-tag">🛡️ ${id}</a>`).join('')}
                </div>
            </div>
        `).join('');

        // 3. Render Alternative Explanations
        const altContainer = document.getElementById('alternative-explanations-list');
        altContainer.innerHTML = data.alternativeExplanations.map(a => `
            <div class="alt-explanation-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: #fbbf24; font-size: 14px;">${a.explanation}</strong>
                    <span class="badge badge-medium">Feasibility: ${a.feasibility}</span>
                </div>
                <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">
                    ${a.notes}
                </div>
            </div>
        `).join('');

        // 4. Render Significant Timestamps
        const timeContainer = document.getElementById('significant-timestamps-list');
        timeContainer.innerHTML = data.significantTimestamps.map(t => `
            <div style="display: flex; gap: 14px; padding: 8px 12px; background: var(--bg-surface-elevated); border-radius: 4px; font-size: 12.5px; align-items: center;">
                <span style="font-family: var(--font-mono); color: var(--accent-cyan); font-weight: bold; min-width: 150px;">${t.time}</span>
                <span style="color: var(--text-primary);">${t.event}</span>
            </div>
        `).join('');

        // 5. Render Relationships Table
        const relTbody = document.getElementById('relationships-tbody');
        relTbody.innerHTML = data.evidenceRelationships.map(r => `
            <tr>
                <td><strong style="color: var(--primary-light);">${r.source}</strong></td>
                <td><span class="badge badge-info">${r.relation}</span></td>
                <td><strong style="color: #fff;">${r.target}</strong></td>
                <td>
                    ${r.evidence && r.evidence.length > 0 ? 
                        r.evidence.map(e => `<a href="evidence.html?search=${e}" class="evidence-pill-tag">${e}</a>`).join('') :
                        '<span style="color: var(--text-muted);">Implicit correlation</span>'}
                </td>
            </tr>
        `).join('');

        // 6. Render Important Evidence
        const evTbody = document.getElementById('important-evidence-tbody');
        evTbody.innerHTML = data.importantEvidence.map(e => `
            <tr>
                <td><strong style="font-family: var(--font-mono); color: var(--primary-light);">${e.evidence_id}</strong></td>
                <td>
                    <div style="font-weight: 600;">${e.title}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${e.source}</div>
                </td>
                <td><span class="badge badge-info">${e.evidence_type}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        ${UI.getPriorityBadge(e.priority_level)}
                        <span style="font-family: var(--font-mono); font-size: 12px; font-weight: bold;">${e.priority_score}</span>
                    </div>
                </td>
                <td style="font-size: 12px; color: var(--text-secondary); max-width: 320px;">
                    ${e.priority_reason || 'High priority forensic record'}
                </td>
            </tr>
        `).join('');

        // 7. Render Recommended Steps
        const stepsContainer = document.getElementById('recommended-steps-list');
        stepsContainer.innerHTML = `<ol style="margin-left: 20px;">` + 
            data.recommendedNextSteps.map(s => `<li style="margin-bottom: 6px;">${s}</li>`).join('') +
            `</ol>`;

        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
        UI.showToast('Forensic analysis successfully generated!', 'success');

    } catch (err) {
        console.error('Error generating analysis:', err);
        UI.showToast('Network error during analysis generation', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span style="font-size: 18px;">⚡</span><span style="font-weight: 800;">GENERATE INVESTIGATION ANALYSIS</span>';
    }
}
