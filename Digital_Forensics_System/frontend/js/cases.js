/**
 * CASES JAVASCRIPT CONTROLLER
 * Fetches and renders all 10 investigation cases with search & filtering.
 */

let allCases = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadCases();

    document.getElementById('case-search').addEventListener('input', filterCases);
    document.getElementById('category-filter').addEventListener('change', filterCases);
});

async function loadCases() {
    try {
        const res = await API.getCases();
        if (!res.success) {
            UI.showToast('Failed to load investigation cases', 'error');
            return;
        }

        allCases = res.data;
        renderCases(allCases);
    } catch (err) {
        console.error('Error fetching cases:', err);
        UI.showToast('Error connecting to backend API', 'error');
    }
}

function filterCases() {
    const searchTerm = document.getElementById('case-search').value.toLowerCase().trim();
    const category = document.getElementById('category-filter').value;

    const filtered = allCases.filter(c => {
        const matchesCategory = !category || c.category === category;
        const matchesSearch = !searchTerm ||
            c.title.toLowerCase().includes(searchTerm) ||
            c.case_id.toLowerCase().includes(searchTerm) ||
            c.description.toLowerCase().includes(searchTerm) ||
            c.category.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    renderCases(filtered);
}

function renderCases(cases) {
    const container = document.getElementById('cases-grid');
    const countEl = document.getElementById('cases-count');
    if (countEl) countEl.textContent = cases.length;

    if (cases.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-md);">
                <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
                <h3 style="color: var(--text-primary); margin-bottom: 6px;">No Matching Investigation Cases Found</h3>
                <p style="color: var(--text-muted); font-size: 13px;">Try clearing your search query or selecting a different category filter.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cases.map(c => `
        <div class="case-card">
            <div>
                <div class="case-header-row">
                    <span class="case-id-badge">${c.case_id}</span>
                    <div style="display: flex; gap: 6px;">
                        ${UI.getPriorityBadge(c.severity)}
                        ${UI.getStatusBadge(c.status)}
                    </div>
                </div>

                <h3 class="case-title">${c.title}</h3>
                <div class="case-category">📁 ${c.category}</div>
                <p class="case-desc">${c.description}</p>
            </div>

            <div>
                <div class="case-meta-row">
                    <span>🛡️ <strong>${c.evidence_count || 10}</strong> Evidence Artifacts</span>
                    <span>👥 <strong>${c.person_count || 3}</strong> Persons</span>
                    <span>⏱️ <strong>${c.event_count || 6}</strong> Events</span>
                </div>

                <div style="display: flex; gap: 8px;">
                    <a href="case-details.html?caseId=${c.case_id}" class="btn btn-primary btn-sm" style="flex: 1; justify-content: center;">
                        Inspect Dossier →
                    </a>
                    <a href="analysis.html?caseId=${c.case_id}" class="btn btn-secondary btn-sm" title="Run Analysis">
                        🔍 Analysis
                    </a>
                    <a href="graph.html?caseId=${c.case_id}" class="btn btn-secondary btn-sm" title="View Graph">
                        🕸️ Graph
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}
