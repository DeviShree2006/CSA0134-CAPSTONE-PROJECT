/**
 * GRAPH VIEW JAVASCRIPT CONTROLLER
 * Initializes Cytoscape.js, renders forensic entities & relationships,
 * and animates BFS & DFS traversals step-by-step.
 */

let cy = null;
let currentCaseId = 'CASE-2026-001';
let currentElements = [];

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const caseParam = urlParams.get('caseId');
    if (caseParam) {
        currentCaseId = caseParam;
        document.getElementById('case-selector').value = caseParam;
    }

    document.getElementById('case-selector').addEventListener('change', (e) => {
        currentCaseId = e.target.value;
        loadCaseGraph(currentCaseId);
    });

    await loadCaseGraph(currentCaseId);
});

async function loadCaseGraph(caseId) {
    try {
        const res = await API.getCaseGraph(caseId);
        if (!res.success) {
            UI.showToast('Failed to load case relationship graph', 'error');
            return;
        }

        currentElements = res.elements;
        initCytoscape(currentElements);
        populateNodeSelectors(currentElements);
    } catch (err) {
        console.error('Error loading graph:', err);
        UI.showToast('Error connecting to backend API', 'error');
    }
}

function initCytoscape(elements) {
    if (cy) {
        cy.destroy();
    }

    cy = cytoscape({
        container: document.getElementById('cy-container'),
        elements: elements,
        style: [
            // Core Node Styling
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'color': '#f8fafc',
                    'font-size': '11px',
                    'font-family': 'Inter, sans-serif',
                    'text-valign': 'bottom',
                    'text-margin-y': 6,
                    'text-wrap': 'ellipsis',
                    'text-max-width': 100,
                    'background-color': '#0077FE',
                    'border-width': 2,
                    'border-color': '#ffffff',
                    'width': 36,
                    'height': 36,
                    'transition-property': 'background-color, border-color, border-width, width, height',
                    'transition-duration': '0.3s'
                }
            },
            // Node Types Customization
            {
                selector: '.node-person',
                style: {
                    'background-color': '#38bdf8',
                    'shape': 'ellipse',
                    'border-color': '#0284c7'
                }
            },
            {
                selector: '.node-device',
                style: {
                    'background-color': '#10b981',
                    'shape': 'round-rectangle',
                    'border-color': '#059669'
                }
            },
            {
                selector: '.node-account',
                style: {
                    'background-color': '#f59e0b',
                    'shape': 'diamond',
                    'border-color': '#d97706'
                }
            },
            {
                selector: '.node-evidence',
                style: {
                    'background-color': '#ef4444',
                    'shape': 'hexagon',
                    'border-color': '#dc2626'
                }
            },
            {
                selector: '.node-event',
                style: {
                    'background-color': '#a855f7',
                    'shape': 'pentagon',
                    'border-color': '#7e22ce'
                }
            },
            // Edges Styling
            {
                selector: 'edge',
                style: {
                    'label': 'data(label)',
                    'font-size': '9px',
                    'color': '#94a3b8',
                    'font-family': 'JetBrains Mono, monospace',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -8,
                    'curve-style': 'bezier',
                    'width': 1.8,
                    'line-color': '#334155',
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': '#334155',
                    'arrow-scale': 0.8
                }
            },
            // Traversal Active Highlight
            {
                selector: '.traversal-active',
                style: {
                    'background-color': '#00e5ff',
                    'border-color': '#ffffff',
                    'border-width': 4,
                    'width': 48,
                    'height': 48,
                    'shadow-blur': 15,
                    'shadow-color': '#00e5ff'
                }
            },
            // Traversal Visited Highlight
            {
                selector: '.traversal-visited',
                style: {
                    'background-color': '#10b981',
                    'border-color': '#34d399',
                    'border-width': 3
                }
            },
            // Traversal Path Edge Highlight
            {
                selector: '.traversal-edge-active',
                style: {
                    'line-color': '#00e5ff',
                    'target-arrow-color': '#00e5ff',
                    'width': 3.5
                }
            }
        ],
        layout: {
            name: 'concentric',
            concentric: function(node) {
                return node.data('type') === 'Person' ? 4 :
                       node.data('type') === 'Device' ? 3 :
                       node.data('type') === 'Account' ? 2 : 1;
            },
            levelWidth: function() { return 1; },
            padding: 40
        }
    });

    // Wire Node Click Handler
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        inspectNode(node);
    });
}

function inspectNode(node) {
    const data = node.data();
    const degree = node.degree();
    const connectedEdges = node.connectedEdges();

    const inspector = document.getElementById('node-inspector');
    inspector.innerHTML = `
        <div style="background: var(--bg-surface-elevated); padding: 12px; border-radius: 6px; border: 1px solid var(--border-medium); margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong style="color: #fff; font-size: 14px;">${data.label}</strong>
                <span class="badge badge-info">${data.type}</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-cyan); margin-bottom: 8px;">
                ID: ${data.id}
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                ${Object.entries(data)
                    .filter(([k]) => !['id', 'label', 'type', 'icon'].includes(k))
                    .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('')}
            </div>
        </div>

        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
            <strong>Degree Centrality:</strong> ${degree} direct connections
        </div>

        <div style="font-size: 11.5px; max-height: 140px; overflow-y: auto;">
            <div style="font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">Connected Relationships:</div>
            ${connectedEdges.map(e => `
                <div style="padding: 4px 6px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border-subtle); margin-bottom: 2px;">
                    <span style="color: var(--primary-light);">${e.data('source')}</span>
                    → <span style="font-family: var(--font-mono); color: #fff;">${e.data('label')}</span>
                    → <span style="color: var(--primary-light);">${e.data('target')}</span>
                </div>
            `).join('')}
        </div>
    `;

    // Highlight immediate 1-hop neighborhood
    cy.elements().removeClass('traversal-active traversal-visited traversal-edge-active');
    node.addClass('traversal-active');
    node.neighborhood().nodes().addClass('traversal-visited');
    node.connectedEdges().addClass('traversal-edge-active');
}

function populateNodeSelectors(elements) {
    const startSelect = document.getElementById('traversal-start-node');
    const targetSelect = document.getElementById('traversal-target-node');

    const nodes = elements.filter(el => el.data && !el.data.source);

    startSelect.innerHTML = nodes.map(n => `
        <option value="${n.data.id}">[${n.data.type}] ${n.data.label} (${n.data.id})</option>
    `).join('');

    targetSelect.innerHTML = `
        <option value="">None (Full Component Exploration)</option>
        ${nodes.map(n => `<option value="${n.data.id}">[${n.data.type}] ${n.data.label} (${n.data.id})</option>`).join('')}
    `;
}

function changeLayout(layoutName) {
    if (!cy) return;
    cy.layout({
        name: layoutName,
        animate: true,
        animationDuration: 500,
        padding: 40
    }).run();
}

function fitGraph() {
    if (cy) {
        cy.fit(null, 40);
    }
}

function clearTraversalHighlights() {
    if (!cy) return;
    cy.elements().removeClass('traversal-active traversal-visited traversal-edge-active');
    document.getElementById('traversal-step-log').innerHTML = 'Highlights cleared. Ready for next traversal.';
}

async function runInteractiveTraversal() {
    const startId = document.getElementById('traversal-start-node').value;
    const targetId = document.getElementById('traversal-target-node').value || null;
    const algo = document.getElementById('traversal-algo').value;
    const logBox = document.getElementById('traversal-step-log');

    if (!startId) {
        UI.showToast('Please select a starting entity node', 'error');
        return;
    }

    clearTraversalHighlights();
    logBox.innerHTML = `<div>Executing ${algo.toUpperCase()} from origin <strong>${startId}</strong>...</div>`;

    try {
        const res = await API.runGraphTraversal(currentCaseId, startId, targetId, algo);
        if (!res.success) {
            UI.showToast(res.error || 'Traversal failed', 'error');
            return;
        }

        const { steps, path, foundTarget, visitOrder } = res;

        // Step-by-step animation
        let currentStepIndex = 0;
        const interval = setInterval(() => {
            if (currentStepIndex >= steps.length) {
                clearInterval(interval);
                // Highlight final path if target was reached
                if (path && path.length > 0) {
                    highlightFinalPath(path);
                    logBox.innerHTML += `<div style="color: #34d399; font-weight: bold; margin-top: 8px;">✓ Target reached! Shortest path: ${path.join(' → ')}</div>`;
                } else {
                    logBox.innerHTML += `<div style="color: #38bdf8; font-weight: bold; margin-top: 8px;">✓ Traversal complete. Visited ${visitOrder.length} nodes.</div>`;
                }
                logBox.scrollTop = logBox.scrollHeight;
                return;
            }

            const step = steps[currentStepIndex];
            logBox.innerHTML += `<div style="margin-bottom: 3px;">[Step ${step.step}] ${step.description}</div>`;
            logBox.scrollTop = logBox.scrollHeight;

            // Highlight node
            if (step.nodeId) {
                const node = cy.getElementById(step.nodeId);
                cy.nodes().removeClass('traversal-active');
                node.addClass('traversal-active');
                node.addClass('traversal-visited');
            }

            // Highlight edge if discovering neighbor
            if (step.sourceId && step.nodeId) {
                const edge = cy.edges().filter(e => 
                    (e.data('source') === step.sourceId && e.data('target') === step.nodeId) ||
                    (e.data('source') === step.nodeId && e.data('target') === step.sourceId)
                );
                edge.addClass('traversal-edge-active');
            }

            currentStepIndex++;
        }, 350);

    } catch (err) {
        console.error('Error during graph traversal:', err);
        UI.showToast('Network error running graph traversal', 'error');
    }
}

function highlightFinalPath(path) {
    cy.elements().removeClass('traversal-active traversal-visited traversal-edge-active');

    for (let i = 0; i < path.length; i++) {
        const node = cy.getElementById(path[i]);
        node.addClass('traversal-active');

        if (i < path.length - 1) {
            const edge = cy.edges().filter(e => 
                (e.data('source') === path[i] && e.data('target') === path[i+1]) ||
                (e.data('source') === path[i+1] && e.data('target') === path[i])
            );
            edge.addClass('traversal-edge-active');
        }
    }
}
