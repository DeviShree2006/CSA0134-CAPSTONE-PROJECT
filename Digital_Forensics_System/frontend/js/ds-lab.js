/**
 * DATA STRUCTURES LABORATORY JAVASCRIPT CONTROLLER
 * Powers interactive operations for Hash Table, Trie, AVL Tree, Heap, and Sorting.
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadDSGuide();
});

function switchDSPrefix(panelId) {
    document.querySelectorAll('.ds-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.ds-panel').forEach(p => p.classList.remove('active'));

    const btn = Array.from(document.querySelectorAll('.ds-tab-btn')).find(b => b.getAttribute('onclick').includes(panelId));
    if (btn) btn.classList.add('active');

    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
}

// 1. HASH TABLE DEMO
async function demoHashTable(op) {
    const key = document.getElementById('ht-input-key').value.trim();
    const val = document.getElementById('ht-input-val').value.trim();
    const consoleBox = document.getElementById('ht-console');

    consoleBox.textContent = `Executing operation: ${op.toUpperCase()}...`;

    try {
        const res = await API.runHashTableDemo({
            operation: op,
            key,
            value: { title: val, timestamp: Date.now() },
            capacity: 16
        });

        if (res.success) {
            consoleBox.textContent = JSON.stringify({
                status: 'SUCCESS',
                operation: op,
                result: res.operationResult,
                hashTableMetrics: res.metrics,
                sampleEntries: res.entries
            }, null, 2);
        } else {
            consoleBox.textContent = `ERROR: ${res.error}`;
        }
    } catch (err) {
        consoleBox.textContent = `NETWORK ERROR: ${err.message}`;
    }
}

// 2. TRIE DEMO
async function demoTrie(op) {
    const prefix = document.getElementById('trie-prefix').value.trim();
    const customWord = document.getElementById('trie-custom-word').value.trim();
    const consoleBox = document.getElementById('trie-console');

    consoleBox.textContent = `Executing Trie operation: ${op.toUpperCase()}...`;

    try {
        const res = await API.runTrieDemo({
            operation: op,
            prefix: prefix,
            word: customWord || prefix,
            metadata: { customAdded: true, timestamp: Date.now() }
        });

        if (res.success) {
            consoleBox.textContent = JSON.stringify({
                status: 'SUCCESS',
                operation: op,
                output: res.operationResult,
                trieMetrics: res.metrics
            }, null, 2);
        } else {
            consoleBox.textContent = `ERROR: ${res.error}`;
        }
    } catch (err) {
        consoleBox.textContent = `NETWORK ERROR: ${err.message}`;
    }
}

// 3. AVL TREE DEMO
async function demoAVL(op) {
    const key = parseInt(document.getElementById('avl-key').value, 10);
    const minRange = parseInt(document.getElementById('avl-range-min').value, 10);
    const maxRange = parseInt(document.getElementById('avl-range-max').value, 10);
    const consoleBox = document.getElementById('avl-console');

    consoleBox.textContent = `Executing AVL operation: ${op.toUpperCase()}...`;

    try {
        const res = await API.runAVLDemo({
            operation: op === 'range' ? 'range_search' : op,
            key: isNaN(key) ? Date.now() : key,
            value: { artifact: 'Sample Forensic Snapshot', epoch: key },
            minRange,
            maxRange
        });

        if (res.success) {
            consoleBox.textContent = JSON.stringify({
                status: 'SUCCESS',
                operation: op,
                result: res.operationResult,
                avlMetrics: res.metrics,
                inOrderSortedTree: res.inOrderSorted
            }, null, 2);
        } else {
            consoleBox.textContent = `ERROR: ${res.error}`;
        }
    } catch (err) {
        consoleBox.textContent = `NETWORK ERROR: ${err.message}`;
    }
}

// 4. HEAP & PRIORITY QUEUE DEMO
const localHeapItems = [
    { title: 'Project Aegis Git Archive', evidence_type: 'Archive File', sha256_hash: 'a'.repeat(64), timestamp: '2026-03-12 23:38:00', priorityScore: 92 },
    { title: 'Kingston 64GB USB Image', evidence_type: 'Disk Image', sha256_hash: 'a'.repeat(64), timestamp: '2026-03-13 09:15:00', priorityScore: 95 },
    { title: 'Bash History Log', evidence_type: 'Security Event Log', sha256_hash: 'b'.repeat(64), timestamp: '2026-03-12 23:50:00', priorityScore: 72 },
    { title: 'Employee Resignation PDF', evidence_type: 'Document Artifact', sha256_hash: 'c'.repeat(64), timestamp: '2026-03-12 17:00:00', priorityScore: 40 }
];

function demoHeapEnqueue() {
    const title = document.getElementById('heap-title').value.trim();
    const type = document.getElementById('heap-type').value;
    const consoleBox = document.getElementById('heap-console');

    // Simulate multi-factor calculation
    let baseScore = type.includes('Log') || type.includes('Image') || type.includes('Dump') ? 30 : 20;
    baseScore += 25; // Corroboration
    baseScore += 20; // SHA-256 verified
    baseScore += 15; // Critical timestamp

    const item = {
        title,
        evidence_type: type,
        priorityScore: baseScore,
        enqueuedAt: new Date().toISOString()
    };

    localHeapItems.push(item);
    localHeapItems.sort((a, b) => b.priorityScore - a.priorityScore); // Max-Heap order

    consoleBox.textContent = JSON.stringify({
        action: 'ENQUEUE_MAX_HEAP',
        enqueuedItem: item,
        totalQueueSize: localHeapItems.length,
        maxHeapPeekRoot: localHeapItems[0],
        internalHeapArray: localHeapItems
    }, null, 2);
}

function demoHeapDequeue() {
    const consoleBox = document.getElementById('heap-console');
    if (localHeapItems.length === 0) {
        consoleBox.textContent = 'Priority Queue is currently empty. Enqueue items first.';
        return;
    }

    const extracted = localHeapItems.shift();
    consoleBox.textContent = JSON.stringify({
        action: 'DEQUEUE_EXTRACT_MAX',
        extractedHighestPriorityItem: extracted,
        remainingQueueSize: localHeapItems.length,
        newRootPeek: localHeapItems[0] || null
    }, null, 2);
}

// 5. SORTING BENCHMARK DEMO
async function runSortingBenchmark() {
    const size = document.getElementById('sort-size').value;
    const arrayType = document.getElementById('sort-type').value;
    const tbody = document.getElementById('sorting-benchmark-tbody');

    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--primary-light);">Executing algorithms on backend...</td></tr>`;

    try {
        const res = await API.runSortingBenchmark({ size, arrayType });
        if (!res.success) {
            tbody.innerHTML = `<tr><td colspan="6" style="color: var(--accent-rose); text-align: center;">${res.error}</td></tr>`;
            return;
        }

        tbody.innerHTML = res.results.map(r => `
            <tr>
                <td><strong style="color: var(--primary-light); font-size: 13.5px;">${r.algorithm}</strong></td>
                <td><code>${r.timeComplexity}</code></td>
                <td><code>${r.spaceComplexity}</code></td>
                <td><span class="badge ${r.stable ? 'badge-low' : 'badge-medium'}">${r.stable ? 'Stable' : 'Unstable'}</span></td>
                <td>${r.comparisons !== undefined ? r.comparisons + ' comparisons' : r.passes + ' passes'}</td>
                <td style="font-family: var(--font-mono); font-weight: bold; color: #34d399; font-size: 13px;">${r.durationMicros} µs</td>
            </tr>
        `).join('');

        UI.showToast(`Sorted ${res.arraySize} elements across 3 algorithms!`, 'success');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="color: var(--accent-rose); text-align: center;">Network error during benchmark.</td></tr>`;
    }
}

// 6. ACADEMIC COMPLEXITY GUIDE
async function loadDSGuide() {
    try {
        const res = await API.getDSGuide();
        if (!res.success) return;

        const tbody = document.getElementById('ds-guide-tbody');
        tbody.innerHTML = res.guide.map(g => `
            <tr>
                <td>
                    <strong style="color: #fff;">${g.structure}</strong>
                    <div style="font-size: 11px; color: var(--accent-cyan);">${g.module}</div>
                </td>
                <td><code style="font-size: 11px; color: var(--primary-light);">${g.file}</code></td>
                <td style="font-size: 12px; color: var(--text-secondary); max-width: 280px;">${g.forensicApplication}</td>
                <td>
                    <div style="font-size: 11.5px; font-family: var(--font-mono);">
                        ${Object.entries(g.timeComplexity).map(([op, comp]) => `<div>${op}: <strong>${comp}</strong></div>`).join('')}
                    </div>
                </td>
                <td><code>${g.spaceComplexity}</code></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Failed to load DS guide:', err);
    }
}
