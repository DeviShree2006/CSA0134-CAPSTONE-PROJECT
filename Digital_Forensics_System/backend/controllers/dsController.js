/**
 * DATA STRUCTURES DEMONSTRATION CONTROLLER
 * Powering the interactive Data Structures Laboratory.
 * Provides live operational endpoints, benchmarking, and theoretical complexity docs.
 */

const { HashTable } = require('../../data_structures/hash_table');
const { Trie } = require('../../data_structures/trie');
const { AVLTree } = require('../../data_structures/avl_tree');
const { ForensicsGraph } = require('../../data_structures/graph');
const { GraphTraversals } = require('../../data_structures/bfs_dfs');
const { BinaryHeap } = require('../../data_structures/heap');
const { ForensicPriorityQueue } = require('../../data_structures/priority_queue');
const { ForensicsSorter } = require('../../data_structures/sorting');

function runHashTableDemo(req, res) {
    try {
        const { operation, key, value, capacity = 16 } = req.body;
        const ht = new HashTable(parseInt(capacity, 10));

        // Seed with sample forensic hashes
        const sampleHashes = [
            ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', { id: 'EVD-001', name: 'Zero-byte Hash' }],
            ['8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', { id: 'EVD-002', name: 'Aegis Source Code' }],
            ['a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0', { id: 'EVD-003', name: 'USB Event Checksum' }],
            ['2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae', { id: 'EVD-004', name: 'Git Commit Hash' }]
        ];

        for (const [k, v] of sampleHashes) {
            ht.set(k, v);
        }

        let opResult = null;
        if (operation === 'insert' && key) {
            ht.set(key, value || { custom: true, timestamp: Date.now() });
            opResult = `Inserted key: '${key}' successfully.`;
        } else if (operation === 'get' && key) {
            opResult = ht.get(key) || 'Key not found in hash table.';
        } else if (operation === 'delete' && key) {
            const deleted = ht.delete(key);
            opResult = deleted ? `Deleted key: '${key}'` : `Key '${key}' not found.`;
        } else if (operation === 'detect_duplicate' && key) {
            opResult = ht.detectDuplicate(key);
        }

        res.json({
            success: true,
            operationResult: opResult,
            metrics: ht.getMetrics(),
            entries: ht.entries().slice(0, 15)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function runTrieDemo(req, res) {
    try {
        const { operation, word, prefix, metadata } = req.body;
        const trie = new Trie();

        // Seed with forensic terminology and tokens
        const sampleKeywords = [
            'exfiltration', 'exfiltrated', 'exploit', 'exploitation',
            'privilege', 'privilege-escalation', 'powershell', 'prefetch',
            'malware', 'mimikatz', 'memory-dump', 'mfa-bypass',
            'bitlocker', 'beaconing', 'bash-history', 'blockchain'
        ];

        for (const kw of sampleKeywords) {
            trie.insert(kw, { term: kw, type: 'Forensic Keyword' });
        }

        let opResult = null;
        if (operation === 'insert' && word) {
            trie.insert(word, metadata || { userAdded: true });
            opResult = `Inserted '${word}' into Trie.`;
        } else if (operation === 'search' && word) {
            opResult = trie.search(word);
        } else if (operation === 'autocomplete' && prefix) {
            opResult = trie.autocomplete(prefix, 10);
        } else {
            opResult = trie.autocomplete('ex', 10);
        }

        res.json({
            success: true,
            operationResult: opResult,
            metrics: trie.getMetrics()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function runAVLDemo(req, res) {
    try {
        const { operation, key, value, minRange, maxRange } = req.body;
        const avl = new AVLTree();

        // Insert sequential timestamps to demonstrate self-balancing rotations
        const sampleTimestamps = [
            [1773349080000, { event: 'Terminal Access' }],
            [1773351000000, { event: 'Git Pull Archive' }],
            [1773351255000, { event: 'USB Inserted' }],
            [1773351380000, { event: 'Data Copy Executed' }],
            [1773351780000, { event: 'History Cleared' }],
            [1773352230000, { event: 'Building Exit' }]
        ];

        for (const [k, v] of sampleTimestamps) {
            avl.insert(k, v);
        }

        let opResult = null;
        if (operation === 'insert' && key) {
            avl.insert(key, value || { custom: true });
            opResult = `Inserted key ${key} into AVL Tree with balance maintenance.`;
        } else if (operation === 'search' && key) {
            opResult = avl.search(key);
        } else if (operation === 'range_search' && minRange && maxRange) {
            opResult = avl.rangeSearch(minRange, maxRange);
        } else {
            opResult = avl.inOrder();
        }

        res.json({
            success: true,
            operationResult: opResult,
            metrics: avl.getMetrics(),
            inOrderSorted: avl.inOrder()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function runSortingBenchmark(req, res) {
    try {
        const { size = 1000, arrayType = 'random' } = req.body;
        const n = Math.min(10000, Math.max(10, parseInt(size, 10)));

        const arr = [];
        if (arrayType === 'sorted') {
            for (let i = 0; i < n; i++) arr.push(i);
        } else if (arrayType === 'reversed') {
            for (let i = n; i > 0; i--) arr.push(i);
        } else {
            for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 100000));
        }

        const mergeRes = ForensicsSorter.mergeSort(arr);
        const quickRes = ForensicsSorter.quickSort(arr);
        const radixRes = ForensicsSorter.radixSort(arr);

        res.json({
            success: true,
            arraySize: n,
            arrayType,
            results: [
                {
                    algorithm: 'Merge Sort',
                    timeComplexity: 'O(n log n)',
                    spaceComplexity: 'O(n)',
                    comparisons: mergeRes.comparisons,
                    durationMicros: mergeRes.durationMicros,
                    stable: true
                },
                {
                    algorithm: 'Quick Sort (Lomuto)',
                    timeComplexity: 'Avg O(n log n), Worst O(n^2)',
                    spaceComplexity: 'O(log n)',
                    comparisons: quickRes.comparisons,
                    swaps: quickRes.swaps,
                    durationMicros: quickRes.durationMicros,
                    stable: false
                },
                {
                    algorithm: 'Radix Sort (LSD)',
                    timeComplexity: 'O(d * (n + k))',
                    spaceComplexity: 'O(n + k)',
                    passes: radixRes.passes,
                    durationMicros: radixRes.durationMicros,
                    stable: true
                }
            ]
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function getDSComplexityGuide(req, res) {
    const guide = [
        {
            module: 'Module 1: Evidence Collection & Identification',
            structure: 'Hash Table with Bucket Chaining',
            file: 'data_structures/hash_table.js',
            purpose: 'Instantaneous O(1) evidence lookup and SHA-256 duplicate detection.',
            timeComplexity: { insert: 'Avg O(1), Worst O(n)', search: 'Avg O(1), Worst O(n)', delete: 'Avg O(1), Worst O(n)' },
            spaceComplexity: 'O(n)',
            forensicApplication: 'Ensures cryptographic checksums of new evidence items are matched against known duplicates in constant time.'
        },
        {
            module: 'Module 2: Evidence Search & Indexing',
            structure: 'Trie (Prefix Tree)',
            file: 'data_structures/trie.js',
            purpose: 'High-speed prefix searching and autocomplete for IDs, keywords, and person names.',
            timeComplexity: { insert: 'O(L)', search: 'O(L)', prefix: 'O(P + K)' },
            spaceComplexity: 'O(ALPHABET * L * N)',
            forensicApplication: 'Allows examiners to type partial identifiers like "EVD-2026-00" or keywords like "exfiltrat" with instant response.'
        },
        {
            module: 'Module 2 (Part 2): Chronological Indexing',
            structure: 'AVL Tree (Self-Balancing Binary Search Tree)',
            file: 'data_structures/avl_tree.js',
            purpose: 'Chronological timeline indexing with guaranteed O(log n) worst-case time and range queries.',
            timeComplexity: { insert: 'O(log n)', search: 'O(log n)', rangeQuery: 'O(log n + k)' },
            spaceComplexity: 'O(n)',
            forensicApplication: 'Rotations prevent tree degradation when timestamps arrive sequentially, allowing exact time-window filtering.'
        },
        {
            module: 'Module 3: Evidence Relationship & Correlation',
            structure: 'Graph (Adjacency Lists) with BFS & DFS',
            file: 'data_structures/graph.js, data_structures/bfs_dfs.js',
            purpose: 'Relational entity modeling, shortest investigative path finding, and deep cluster exploration.',
            timeComplexity: { bfs: 'O(V + E)', dfs: 'O(V + E)', addEdge: 'O(1)' },
            spaceComplexity: 'O(V + E)',
            forensicApplication: 'Traces how an exfiltrated file links through devices and user accounts to a person of interest.'
        },
        {
            module: 'Module 4: Timeline & Prioritization',
            structure: 'Binary Heap & Forensic Priority Queue',
            file: 'data_structures/heap.js, data_structures/priority_queue.js',
            purpose: 'Max-Heap based prioritization of evidence by composite forensic relevance, integrity, and corroboration.',
            timeComplexity: { insert: 'O(log n)', extractMax: 'O(log n)', peek: 'O(1)' },
            spaceComplexity: 'O(n)',
            forensicApplication: 'Ranks critical evidence demanding urgent investigator attention based on transparent mathematical criteria.'
        },
        {
            module: 'Module 4 (Part 2): Chronological Sorting',
            structure: 'Merge Sort, Quick Sort, and Radix Sort',
            file: 'data_structures/sorting.js',
            purpose: 'Timeline ordering and algorithmic performance benchmarking.',
            timeComplexity: { mergeSort: 'O(n log n)', quickSort: 'Avg O(n log n), Worst O(n^2)', radixSort: 'O(d * (n + k))' },
            spaceComplexity: 'Merge: O(n), Quick: O(log n), Radix: O(n+k)',
            forensicApplication: 'Reconstructs incident timelines from heterogeneous disparate log files with nanosecond/microsecond resolution.'
        }
    ];

    res.json({ success: true, guide });
}

module.exports = {
    runHashTableDemo,
    runTrieDemo,
    runAVLDemo,
    runSortingBenchmark,
    getDSComplexityGuide
};
