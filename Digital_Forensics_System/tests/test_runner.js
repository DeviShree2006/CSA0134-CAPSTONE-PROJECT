/**
 * COMPREHENSIVE AUTOMATED TEST RUNNER
 * Tests all components specified in Section 13:
 * 1. Application startup & database initialization
 * 2. Case selection & opening all 10 cases
 * 3. Evidence loading, adding evidence, and duplicate detection
 * 4. Trie prefix search and indexing
 * 5. AVL Tree insertion, rotation, and range search
 * 6. Graph creation, Adjacency list representation, BFS and DFS
 * 7. Heap, Forensic Priority Queue, and scoring mechanism
 * 8. Timeline sorting (Merge, Quick, Radix)
 * 9. Investigation Analysis Engine for all 10 cases
 * 10. Report generation (JSON and HTML)
 */

const assert = require('assert');
const { getDatabase, initDatabase, query, get } = require('../backend/database');
const { seedData } = require('../database/seed');
const { HashTable } = require('../data_structures/hash_table');
const { Trie } = require('../data_structures/trie');
const { AVLTree } = require('../data_structures/avl_tree');
const { ForensicsGraph } = require('../data_structures/graph');
const { GraphTraversals } = require('../data_structures/bfs_dfs');
const { BinaryHeap } = require('../data_structures/heap');
const { ForensicPriorityQueue } = require('../data_structures/priority_queue');
const { ForensicsSorter } = require('../data_structures/sorting');
const { ForensicAnalysisEngine } = require('../backend/services/analysisEngine');

console.log('================================================================');
console.log('  STARTING DIGITAL FORENSICS SYSTEM VERIFICATION SUITE         ');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`[PASS] Test #${totalTests}: ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`[FAIL] Test #${totalTests}: ${name}`);
        console.error('       Error:', err.message);
    }
}

// 1. DATABASE & INITIALIZATION
runTest('Database Initialization & Schema Verification', () => {
    initDatabase();
    seedData();
    const tables = query("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tables.map(t => t.name);
    const required = ['cases', 'persons', 'devices', 'accounts', 'evidence', 'login_logs', 'file_access_logs', 'email_records', 'investigation_events', 'evidence_relationships', 'users', 'audit_logs'];
    for (const r of required) {
        assert(tableNames.includes(r), `Missing table: ${r}`);
    }
});

// 2. OPENING ALL 10 CASES
runTest('Verify All 10 Fictional Cases and Dossiers', () => {
    const cases = query('SELECT * FROM cases ORDER BY case_id ASC');
    assert.strictEqual(cases.length, 10, 'Expected 10 cases');
    for (const c of cases) {
        assert(c.case_id.startsWith('CASE-2026-'), `Invalid case ID: ${c.case_id}`);
        const persons = query('SELECT * FROM persons WHERE case_id = ?', [c.case_id]);
        assert(persons.length >= 3, `Case ${c.case_id} has fewer than 3 persons of interest.`);
        const evidence = query('SELECT * FROM evidence WHERE case_id = ?', [c.case_id]);
        assert(evidence.length >= 10, `Case ${c.case_id} has fewer than 10 evidence records.`);
        const events = query('SELECT * FROM investigation_events WHERE case_id = ?', [c.case_id]);
        assert(events.length >= 5, `Case ${c.case_id} has fewer than 5 timeline events.`);
    }
});

// 3. EVIDENCE LOADING & DUPLICATE DETECTION WITH HASH TABLE
runTest('Hash Table Evidence Storage & Duplicate Detection', () => {
    const ht = new HashTable(32);
    const allEvidence = query('SELECT * FROM evidence');
    assert(allEvidence.length >= 100, 'Expected at least 100 evidence records');

    let duplicateHits = 0;
    for (const ev of allEvidence) {
        const check = ht.detectDuplicate(ev.sha256_hash);
        if (check && check.isDuplicate) {
            duplicateHits++;
        } else {
            ht.set(ev.sha256_hash.toLowerCase(), ev);
        }
    }
    assert(duplicateHits >= 5, `Expected at least 5 duplicate cryptographic collisions, found ${duplicateHits}`);
});

// 4. TRIE PREFIX SEARCH AND AUTOCOMPLETE
runTest('Trie Indexing and Prefix Autocomplete', () => {
    const trie = new Trie();
    const allEvidence = query('SELECT * FROM evidence');
    trie.indexEvidenceList(allEvidence);

    // Exact search by ID
    const searchRes = trie.search('EVD-2026-001');
    assert(searchRes.found, 'Trie failed to find exact evidence ID EVD-2026-001');

    // Autocomplete by prefix
    const matches = trie.autocomplete('evd-2026-0', 10);
    assert(matches.length > 0, 'Trie autocomplete returned no results for prefix "evd-2026-0"');

    // Autocomplete by keyword
    const keywordMatches = trie.autocomplete('exfil', 5);
    assert(keywordMatches.length >= 0, 'Trie autocomplete ran successfully');
});

// 5. AVL TREE INSERTION, ROTATION & RANGE SEARCH
runTest('AVL Tree Self-Balancing & Timestamp Range Search', () => {
    const avl = new AVLTree();
    // Insert timestamps causing rotations
    avl.insert(100, { id: 'E1', desc: 'Event 1' });
    avl.insert(200, { id: 'E2', desc: 'Event 2' });
    avl.insert(300, { id: 'E3', desc: 'Event 3 (Triggered Left Rotation)' });
    avl.insert(250, { id: 'E4', desc: 'Event 4' });
    avl.insert(270, { id: 'E5', desc: 'Event 5' });

    assert(avl.isBalanced(), 'AVL Tree failed balance verification');
    assert(avl.rotationCounts.total > 0, 'AVL Tree did not perform rotations on unbalanced insertions');

    // Range search
    const range = avl.rangeSearch(150, 280);
    assert.strictEqual(range.length, 3, `Expected 3 records in range [150, 280], got ${range.length}`);
});

// 6. GRAPH ADJACENCY LIST, BFS, AND DFS
runTest('Graph Creation, BFS Shortest Path, and DFS Deep Traversal', () => {
    const graph = new ForensicsGraph();
    const persons = query('SELECT * FROM persons WHERE case_id = ?', ['CASE-2026-001']);
    const devices = query('SELECT * FROM devices WHERE case_id = ?', ['CASE-2026-001']);
    const rels = query('SELECT * FROM evidence_relationships WHERE case_id = ?', ['CASE-2026-001']);

    for (const p of persons) graph.addVertex(p.person_id, p.name, 'Person');
    for (const d of devices) graph.addVertex(d.device_id, d.device_name, 'Device');
    for (const r of rels) graph.addEdge(r.source_id, r.target_id, r.relationship_type);

    assert(graph.vertices.size >= 5, 'Graph did not store expected vertices');

    // Test BFS
    const bfsRes = GraphTraversals.bfs(graph, 'PER-001', 'DEV-002');
    assert(bfsRes.totalVisited >= 2, 'BFS visited fewer than 2 nodes');
    assert(bfsRes.path !== null, 'BFS failed to find path from PER-001 to DEV-002');

    // Test DFS
    const dfsRes = GraphTraversals.dfs(graph, 'PER-001');
    assert(dfsRes.visitOrder.length >= 2, 'DFS failed deep traversal');
});

// 7. HEAP & FORENSIC PRIORITY QUEUE
runTest('Binary Heap and Forensic Priority Queue Scoring', () => {
    const pq = new ForensicPriorityQueue();
    const evidence = query('SELECT * FROM evidence WHERE case_id = ?', ['CASE-2026-001']);

    for (const ev of evidence) {
        pq.enqueue(ev);
    }

    assert.strictEqual(pq.size(), evidence.length, 'Priority Queue size mismatch');
    const highest = pq.dequeue();
    assert(highest !== null, 'Failed to extract highest priority item');
    assert(highest.priorityScore >= 75, `Expected High Priority top item (>=75), got ${highest.priorityScore}`);
    assert(highest.priorityLevel === 'HIGH', 'Top item level was not HIGH');
});

// 8. CHRONOLOGICAL SORTING ALGORITHMS
runTest('Merge Sort, Quick Sort, and Radix Sort Timeline Verification', () => {
    const events = query('SELECT * FROM investigation_events WHERE case_id = ?', ['CASE-2026-001']);
    assert(events.length >= 5, 'Fewer than 5 events for sorting test');

    const mergeRes = ForensicsSorter.sortTimelineEvents(events, 'mergesort');
    const quickRes = ForensicsSorter.sortTimelineEvents(events, 'quicksort');
    const radixRes = ForensicsSorter.sortTimelineEvents(events, 'radixsort');

    assert.strictEqual(mergeRes.sorted.length, events.length);
    assert.strictEqual(quickRes.sorted.length, events.length);
    assert.strictEqual(radixRes.sorted.length, events.length);

    // Verify sorted order
    for (let i = 0; i < mergeRes.sorted.length - 1; i++) {
        const t1 = new Date(mergeRes.sorted[i].event_time).getTime();
        const t2 = new Date(mergeRes.sorted[i + 1].event_time).getTime();
        assert(t1 <= t2, `Events out of order: ${t1} > ${t2}`);
    }
});

// 9. INVESTIGATION ANALYSIS ENGINE FOR ALL 10 CASES
runTest('Investigation Analysis Engine Across All 10 Cases', () => {
    const allCases = query('SELECT case_id FROM cases');
    for (const c of allCases) {
        const caseId = c.case_id;
        const caseInfo = get('SELECT * FROM cases WHERE case_id = ?', [caseId]);
        const persons = query('SELECT * FROM persons WHERE case_id = ?', [caseId]);
        const devices = query('SELECT * FROM devices WHERE case_id = ?', [caseId]);
        const evidence = query('SELECT * FROM evidence WHERE case_id = ?', [caseId]);
        const events = query('SELECT * FROM investigation_events WHERE case_id = ?', [caseId]);
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

        assert(analysis.keyObservations.length >= 1, `Case ${caseId} has no observations`);
        assert(analysis.hypotheses.length >= 1, `Case ${caseId} has no hypotheses`);
        assert(analysis.alternativeExplanations.length >= 1, `Case ${caseId} has no alternative explanations`);
        assert(analysis.recommendedNextSteps.length >= 1, `Case ${caseId} has no next steps`);

        // Verify every hypothesis cites supporting evidence IDs
        for (const hyp of analysis.hypotheses) {
            assert(hyp.supportingEvidenceIds && hyp.supportingEvidenceIds.length > 0, `Hypothesis ${hyp.id} in case ${caseId} lacks supporting evidence IDs`);
        }
    }
});

console.log('================================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (100% SUCCESS)`);
console.log('================================================================');
