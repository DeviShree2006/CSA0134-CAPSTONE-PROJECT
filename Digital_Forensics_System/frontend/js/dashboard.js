/**
 * DASHBOARD JAVASCRIPT CONTROLLER
 * Loads metrics, initializes Chart.js graphs, and streams recent activity.
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await API.getDashboardStats();
        if (!res.success) {
            UI.showToast('Failed to load dashboard metrics', 'error');
            return;
        }

        const { stats, evidenceTypes, caseStatuses, caseSeverities, recentActivity, criticalCases } = res;

        // Populate top metrics
        document.getElementById('stat-cases').textContent = stats.totalCases;
        document.getElementById('stat-evidence').textContent = stats.totalEvidence;
        document.getElementById('stat-persons').textContent = stats.totalPersons;
        document.getElementById('stat-devices').textContent = stats.totalDevices;

        // Initialize Chart 1: Evidence Types Donut Chart
        const ctxEvidence = document.getElementById('chart-evidence-types').getContext('2d');
        new Chart(ctxEvidence, {
            type: 'doughnut',
            data: {
                labels: evidenceTypes.map(e => e.category),
                datasets: [{
                    data: evidenceTypes.map(e => e.count),
                    backgroundColor: [
                        '#0077FE', '#00e5ff', '#10b981', '#f59e0b',
                        '#f43f5e', '#8b5cf6', '#38bdf8', '#a855f7',
                        '#ec4899', '#64748b'
                    ],
                    borderColor: '#0a192f',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#94a3b8',
                            font: { size: 11, family: 'Inter' },
                            boxWidth: 12
                        }
                    }
                }
            }
        });

        // Initialize Chart 2: Case Severity Bar Chart
        const ctxSeverity = document.getElementById('chart-case-severity').getContext('2d');
        new Chart(ctxSeverity, {
            type: 'bar',
            data: {
                labels: caseSeverities.map(s => s.severity),
                datasets: [{
                    label: 'Case Count',
                    data: caseSeverities.map(s => s.count),
                    backgroundColor: [
                        'rgba(244, 63, 94, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(16, 185, 129, 0.7)'
                    ],
                    borderColor: ['#f43f5e', '#f59e0b', '#10b981'],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8', stepSize: 1 },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        // Populate Critical Cases Table
        const tbody = document.getElementById('critical-cases-tbody');
        tbody.innerHTML = criticalCases.map(c => `
            <tr>
                <td><strong style="font-family: var(--font-mono); color: var(--primary-light);">${c.case_id}</strong></td>
                <td>
                    <div style="font-weight: 600;">${c.title}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${c.incident_date}</div>
                </td>
                <td><span style="font-size: 12px; color: var(--text-secondary);">${c.category}</span></td>
                <td>${UI.getPriorityBadge(c.severity)}</td>
                <td>${UI.getStatusBadge(c.status)}</td>
                <td>
                    <a href="case-details.html?caseId=${c.case_id}" class="btn btn-secondary btn-sm">Inspect →</a>
                </td>
            </tr>
        `).join('');

        // Populate Recent Activity Feed
        const feedContainer = document.getElementById('recent-activity-feed');
        feedContainer.innerHTML = recentActivity.map(act => `
            <div style="padding: 10px 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border-left: 3px solid var(--primary-light);">
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
                    <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${act.actor}</span>
                    <span>${act.time}</span>
                </div>
                <div style="font-size: 12.5px; font-weight: 600; color: var(--text-primary);">${act.title}</div>
                <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 2px;">${act.details}</div>
            </div>
        `).join('');

    } catch (err) {
        console.error('Error initializing dashboard:', err);
        UI.showToast('Error connecting to backend API', 'error');
    }
});
