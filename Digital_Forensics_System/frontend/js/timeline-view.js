/**
 * TIMELINE VIEW JAVASCRIPT CONTROLLER
 * Fetches chronological events, applies manual sorting algorithms,
 * and renders academic algorithm benchmark comparisons.
 */

let currentCaseId = 'CASE-2026-001';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const caseParam = urlParams.get('caseId');
    if (caseParam) {
        currentCaseId = caseParam;
        document.getElementById('timeline-case-select').value = caseParam;
    }

    document.getElementById('timeline-case-select').addEventListener('change', (e) => {
        currentCaseId = e.target.value;
        loadTimeline();
    });

    await loadTimeline();
});

async function loadTimeline() {
    const sort = document.getElementById('select-sort-algo').value;
    const category = document.getElementById('select-event-cat').value;
    const severity = document.getElementById('select-event-sev').value;

    try {
        const res = await API.getTimeline(currentCaseId, { sort, category, severity });
        if (!res.success) {
            UI.showToast('Failed to load timeline events', 'error');
            return;
        }

        // Update metrics pill
        document.getElementById('metric-algo').textContent = res.sortDetails.algorithm;
        document.getElementById('metric-comps').textContent = res.sortDetails.comparisons;
        document.getElementById('metric-time').textContent = `${res.sortDetails.durationMicros} µs`;

        renderTimeline(res.data);
    } catch (err) {
        console.error('Error fetching timeline:', err);
        UI.showToast('Error connecting to backend API', 'error');
    }
}

function renderTimeline(events) {
    const container = document.getElementById('timeline-events-container');

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 36px;">
                No events found matching the specified filters.
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(ev => `
        <div class="timeline-node">
            <div class="timeline-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <span style="font-family: var(--font-mono); font-size: 13px; font-weight: bold; color: var(--accent-cyan);">
                            ${ev.event_time}
                        </span>
                        <h4 style="font-size: 15px; color: #fff; margin-top: 4px; margin-bottom: 4px;">
                            ${ev.title}
                        </h4>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <span class="badge badge-info">${ev.category}</span>
                        ${UI.getPriorityBadge(ev.severity)}
                    </div>
                </div>

                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
                    ${ev.description}
                </p>

                <div style="display: flex; gap: 16px; font-size: 12px; color: var(--text-muted); padding-top: 8px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap;">
                    ${ev.related_evidence_id ? 
                        `<div>🛡️ <strong>Evidence:</strong> <a href="evidence.html?search=${ev.related_evidence_id}" style="color: var(--primary-light); text-decoration: none;">${ev.related_evidence_id}</a></div>` : ''
                    }
                    ${ev.related_person_id ? 
                        `<div>👤 <strong>Person:</strong> <span style="color: var(--text-primary);">${ev.related_person_id}</span></div>` : ''
                    }
                    ${ev.related_device_id ? 
                        `<div>💻 <strong>Device:</strong> <span style="color: var(--text-primary);">${ev.related_device_id}</span></div>` : ''
                    }
                    <div>🔑 <strong>Event ID:</strong> <code style="color: var(--text-muted);">${ev.event_id}</code></div>
                </div>
            </div>
        </div>
    `).join('');
}

async function openBenchmarkModal() {
    const modalBody = document.getElementById('modal-benchmark-body');
    modalBody.innerHTML = '<div style="text-align: center; padding: 24px;">Benchmarking Merge Sort, Quick Sort, and Radix Sort...</div>';
    UI.openModal('modal-benchmark');

    try {
        const res = await API.getSortingBenchmarks(currentCaseId);
        if (!res.success) {
            modalBody.innerHTML = `<div style="color: var(--accent-rose);">${res.error}</div>`;
            return;
        }

        modalBody.innerHTML = `
            <div style="margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
                Empirical execution performance sorting <strong>${res.datasetSize}</strong> timeline events on the Node.js backend.
            </div>

            <div class="table-responsive">
                <table class="forensic-table">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Time Complexity</th>
                            <th>Space</th>
                            <th>Stability</th>
                            <th>Comparisons / Passes</th>
                            <th>Duration (µs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${res.benchmarks.map(b => `
                            <tr>
                                <td><strong style="color: var(--primary-light);">${b.name}</strong></td>
                                <td><code>${b.timeComplexity}</code></td>
                                <td><code>${b.spaceComplexity}</code></td>
                                <td><span class="badge ${b.stability === 'Stable' ? 'badge-low' : 'badge-medium'}">${b.stability}</span></td>
                                <td>${b.comparisons !== undefined ? b.comparisons + ' comparisons' : b.passes + ' radix passes'}</td>
                                <td style="font-family: var(--font-mono); font-weight: bold; color: #34d399;">${b.durationMicros} µs</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 18px; background: var(--bg-surface-elevated); padding: 14px; border-radius: 6px; font-size: 12px; color: var(--text-muted); line-height: 1.6;">
                <strong>Academic Takeaways:</strong><br>
                • <strong>Merge Sort</strong> offers guaranteed O(n log n) stability, vital in digital forensics so events with identical timestamps maintain relative file creation order.<br>
                • <strong>Quick Sort</strong> operates in-place with lower constant memory overhead (O(log n) stack).<br>
                • <strong>Radix Sort</strong> bypasses element-to-element comparisons entirely, sorting epoch integer timestamps in linear time proportional to bit depth.
            </div>
        `;
    } catch (err) {
        modalBody.innerHTML = '<div style="color: var(--accent-rose);">Network error running sorting benchmarks.</div>';
    }
}
