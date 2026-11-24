/**
 * TIMELINE CONTROLLER
 * Manages chronological investigation events, AVL-tree range queries,
 * and academic sorting benchmark algorithms.
 */

const { query } = require('../database');
const { ForensicsSorter } = require('../../data_structures/sorting');
const { AVLTree } = require('../../data_structures/avl_tree');

function getTimeline(req, res) {
    try {
        const { caseId } = req.params;
        const { sort = 'mergesort', category, severity, startDate, endDate } = req.query;

        let sql = 'SELECT * FROM investigation_events WHERE case_id = ?';
        const params = [caseId];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (severity) {
            sql += ' AND severity = ?';
            params.push(severity);
        }

        let rawEvents = query(sql, params);

        // If date range specified, demonstrate AVL Tree range search
        let avlMetrics = null;
        if (startDate || endDate) {
            const avl = new AVLTree();
            for (const ev of rawEvents) {
                avl.insert(ev.event_time, ev);
            }
            const minKey = startDate || '1970-01-01 00:00:00';
            const maxKey = endDate || '2099-12-31 23:59:59';
            const rangeHits = avl.rangeSearch(minKey, maxKey);
            rawEvents = rangeHits.map(h => h.record);
            avlMetrics = avl.getMetrics();
        }

        // Apply chosen manual sorting algorithm
        const sortResult = ForensicsSorter.sortTimelineEvents(rawEvents, sort.toLowerCase());

        res.json({
            success: true,
            caseId,
            count: sortResult.sorted.length,
            sortDetails: {
                algorithm: sortResult.algorithm,
                comparisons: sortResult.comparisons,
                durationMicros: sortResult.durationMicros,
                timeComplexity: sortResult.timeComplexity
            },
            avlMetrics,
            data: sortResult.sorted
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function compareSortingAlgorithms(req, res) {
    try {
        const { caseId } = req.params;
        const events = query('SELECT * FROM investigation_events WHERE case_id = ?', [caseId]);

        const mergeRes = ForensicsSorter.sortTimelineEvents(events, 'mergesort');
        const quickRes = ForensicsSorter.sortTimelineEvents(events, 'quicksort');
        const radixRes = ForensicsSorter.sortTimelineEvents(events, 'radixsort');

        res.json({
            success: true,
            datasetSize: events.length,
            benchmarks: [
                {
                    name: 'Merge Sort',
                    timeComplexity: 'O(n log n)',
                    spaceComplexity: 'O(n)',
                    stability: 'Stable',
                    comparisons: mergeRes.comparisons,
                    durationMicros: mergeRes.durationMicros
                },
                {
                    name: 'Quick Sort (Lomuto)',
                    timeComplexity: 'Avg O(n log n), Worst O(n^2)',
                    spaceComplexity: 'O(log n)',
                    stability: 'Unstable',
                    comparisons: quickRes.comparisons,
                    swaps: quickRes.swaps,
                    durationMicros: quickRes.durationMicros
                },
                {
                    name: 'Radix Sort (LSD)',
                    timeComplexity: 'O(d * (n + k))',
                    spaceComplexity: 'O(n + k)',
                    stability: 'Stable',
                    passes: radixRes.passes,
                    durationMicros: radixRes.durationMicros
                }
            ]
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    getTimeline,
    compareSortingAlgorithms
};
