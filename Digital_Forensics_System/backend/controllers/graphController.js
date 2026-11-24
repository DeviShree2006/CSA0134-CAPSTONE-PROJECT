/**
 * GRAPH CONTROLLER
 * Builds entity-relationship correlation graphs and executes BFS/DFS traversals.
 */

const { query } = require('../database');
const { ForensicsGraph } = require('../../data_structures/graph');
const { GraphTraversals } = require('../../data_structures/bfs_dfs');

function buildGraphForCase(caseId) {
    const graph = new ForensicsGraph();

    // Query all entities for this case
    const persons = query('SELECT * FROM persons WHERE case_id = ?', [caseId]);
    const devices = query('SELECT * FROM devices WHERE case_id = ?', [caseId]);
    const accounts = query('SELECT * FROM accounts WHERE case_id = ?', [caseId]);
    const evidence = query('SELECT * FROM evidence WHERE case_id = ?', [caseId]);
    const events = query('SELECT * FROM investigation_events WHERE case_id = ?', [caseId]);
    const relationships = query('SELECT * FROM evidence_relationships WHERE case_id = ?', [caseId]);

    // Add Person vertices
    for (const p of persons) {
        graph.addVertex(p.person_id, p.name, 'Person', {
            role: p.role,
            status: p.status,
            department: p.department,
            icon: 'user'
        });
    }

    // Add Device vertices
    for (const d of devices) {
        graph.addVertex(d.device_id, d.device_name, 'Device', {
            deviceType: d.device_type,
            os: d.operating_system,
            status: d.status,
            icon: 'laptop'
        });
    }

    // Add Account vertices
    for (const a of accounts) {
        graph.addVertex(a.account_id, a.username, 'Account', {
            service: a.service_name,
            privilege: a.privilege_level,
            status: a.status,
            icon: 'id-card'
        });
    }

    // Add Evidence vertices
    for (const ev of evidence) {
        graph.addVertex(ev.evidence_id, ev.title, 'Evidence', {
            evidenceType: ev.evidence_type,
            priority: ev.priority_level,
            score: ev.priority_score,
            hash: ev.sha256_hash.slice(0, 16) + '...',
            icon: 'file-shield'
        });
    }

    // Add Event vertices
    for (const evt of events) {
        graph.addVertex(evt.event_id, evt.title, 'Event', {
            time: evt.event_time,
            severity: evt.severity,
            icon: 'clock'
        });
    }

    // Add explicit Edges from database
    for (const rel of relationships) {
        graph.addEdge(rel.source_id, rel.target_id, rel.relationship_type, rel.weight || 1.0, {
            notes: rel.notes
        });
    }

    // Also link events to their referenced entities if not already linked
    for (const evt of events) {
        if (evt.related_evidence_id) {
            graph.addEdge(evt.event_id, evt.related_evidence_id, 'REFERENCES_EVIDENCE', 1.0);
        }
        if (evt.related_person_id) {
            graph.addEdge(evt.event_id, evt.related_person_id, 'INVOLVES_PERSON', 1.0);
        }
        if (evt.related_device_id) {
            graph.addEdge(evt.event_id, evt.related_device_id, 'OCCURRED_ON', 1.0);
        }
    }

    return graph;
}

function getCaseGraph(req, res) {
    try {
        const { caseId } = req.params;
        const graph = buildGraphForCase(caseId);
        const elements = graph.toCytoscapeElements();

        res.json({
            success: true,
            caseId,
            metrics: graph.getMetrics(),
            elements
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function runTraversal(req, res) {
    try {
        const { caseId } = req.params;
        const { startId, targetId, algorithm = 'bfs' } = req.body;

        if (!startId) {
            return res.status(400).json({ success: false, error: 'startId is required.' });
        }

        const graph = buildGraphForCase(caseId);

        let result;
        if (algorithm.toLowerCase() === 'dfs') {
            result = GraphTraversals.dfs(graph, startId, targetId);
        } else {
            result = GraphTraversals.bfs(graph, startId, targetId);
        }

        if (result.error) {
            return res.status(400).json({ success: false, error: result.error });
        }

        res.json({
            success: true,
            ...result,
            metrics: graph.getMetrics()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

function getConnectedComponents(req, res) {
    try {
        const { caseId } = req.params;
        const graph = buildGraphForCase(caseId);
        const components = GraphTraversals.findConnectedComponents(graph);

        res.json({
            success: true,
            caseId,
            totalComponents: components.length,
            components
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    getCaseGraph,
    runTraversal,
    getConnectedComponents
};
