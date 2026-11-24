/**
 * MODULE 3: EVIDENCE RELATIONSHIP AND CORRELATION
 * Custom Graph Implementation Using Adjacency Lists
 * 
 * Purpose in Digital Forensics:
 * Models complex forensic entity relationships:
 * - Persons of interest (custodians, suspects, witnesses)
 * - Hardware devices (laptops, mobile phones, USB drives, servers)
 * - User accounts (Active Directory, email, cloud services)
 * - Evidence artifacts (memory dumps, logs, disk images)
 * - Timeline events (unauthorized logins, file modifications, exfiltration transfers)
 * 
 * Allows multi-hop investigative path tracing, clustering, and correlation.
 * 
 * Time Complexity:
 * - Add Vertex: O(1)
 * - Add Edge: O(1)
 * - Remove Edge: O(degree(V))
 * - Query Neighbors: O(1) direct access to adjacency list
 * - Vertex Search: O(1) via Map
 * Space Complexity: O(V + E)
 */

class GraphNode {
    constructor(id, label, type, metadata = {}) {
        this.id = String(id);
        this.label = label || String(id);
        this.type = type || 'Entity'; // 'Person' | 'Device' | 'Account' | 'Evidence' | 'File' | 'Email' | 'Event'
        this.metadata = metadata;
    }
}

class GraphEdge {
    constructor(source, target, relationship = 'RELATED_TO', weight = 1, metadata = {}) {
        this.source = String(source);
        this.target = String(target);
        this.relationship = relationship; // 'OWNS', 'ACCESSED', 'SENT_EMAIL_TO', 'CONTAINS_FILE', 'MODIFIED'
        this.weight = weight;
        this.metadata = metadata;
    }
}

class ForensicsGraph {
    constructor() {
        this.vertices = new Map(); // id -> GraphNode
        this.adjacencyList = new Map(); // id -> Array of GraphEdge
        this.edgeCount = 0;
    }

    /**
     * Adds a vertex to the graph
     */
    addVertex(id, label, type, metadata = {}) {
        const strId = String(id);
        if (!this.vertices.has(strId)) {
            const node = new GraphNode(strId, label, type, metadata);
            this.vertices.set(strId, node);
            this.adjacencyList.set(strId, []);
            return node;
        }
        // If vertex already exists, update metadata
        const existing = this.vertices.get(strId);
        if (label) existing.label = label;
        if (type) existing.type = type;
        Object.assign(existing.metadata, metadata);
        return existing;
    }

    /**
     * Adds an edge (directed or undirected)
     */
    addEdge(sourceId, targetId, relationship = 'RELATED_TO', weight = 1, metadata = {}, directed = false) {
        const src = String(sourceId);
        const tgt = String(targetId);

        // Ensure both vertices exist
        if (!this.vertices.has(src)) {
            this.addVertex(src, src, 'Unknown');
        }
        if (!this.vertices.has(tgt)) {
            this.addVertex(tgt, tgt, 'Unknown');
        }

        // Prevent exact duplicate edges
        const existingEdges = this.adjacencyList.get(src);
        const alreadyLinked = existingEdges.some(e => e.target === tgt && e.relationship === relationship);

        if (!alreadyLinked) {
            const edge = new GraphEdge(src, tgt, relationship, weight, metadata);
            existingEdges.push(edge);
            this.edgeCount++;

            // If undirected, add reverse edge
            if (!directed) {
                const reverseEdge = new GraphEdge(tgt, src, relationship, weight, metadata);
                this.adjacencyList.get(tgt).push(reverseEdge);
            }
        }
    }

    /**
     * Checks if vertex exists
     */
    hasVertex(id) {
        return this.vertices.has(String(id));
    }

    /**
     * Returns vertex details
     */
    getVertex(id) {
        return this.vertices.get(String(id)) || null;
    }

    /**
     * Returns list of outgoing edges from given vertex
     */
    getEdges(id) {
        return this.adjacencyList.get(String(id)) || [];
    }

    /**
     * Returns immediate neighbor vertex IDs
     */
    getNeighbors(id) {
        const edges = this.getEdges(id);
        return edges.map(e => e.target);
    }

    /**
     * Returns degree (number of connected edges) of a vertex
     */
    getDegree(id) {
        return (this.adjacencyList.get(String(id)) || []).length;
    }

    /**
     * Returns all vertices as array
     */
    getAllVertices() {
        return Array.from(this.vertices.values());
    }

    /**
     * Returns all unique edges
     */
    getAllEdges() {
        const uniqueEdges = [];
        const seen = new Set();

        for (const [src, edges] of this.adjacencyList.entries()) {
            for (const edge of edges) {
                const key1 = `${edge.source}->${edge.target}:${edge.relationship}`;
                const key2 = `${edge.target}->${edge.source}:${edge.relationship}`;
                if (!seen.has(key1) && !seen.has(key2)) {
                    seen.add(key1);
                    uniqueEdges.push(edge);
                }
            }
        }
        return uniqueEdges;
    }

    /**
     * Converts graph into Cytoscape.js compatible JSON elements structure
     */
    toCytoscapeElements() {
        const elements = [];

        // Add Nodes
        for (const node of this.vertices.values()) {
            elements.push({
                data: {
                    id: node.id,
                    label: node.label,
                    type: node.type,
                    ...node.metadata
                },
                classes: `node-${node.type.toLowerCase()}`
            });
        }

        // Add Edges
        let edgeIndex = 0;
        const seenEdges = new Set();
        for (const [src, edges] of this.adjacencyList.entries()) {
            for (const edge of edges) {
                const edgeKey = [edge.source, edge.target].sort().join('--') + ':' + edge.relationship;
                if (!seenEdges.has(edgeKey)) {
                    seenEdges.add(edgeKey);
                    elements.push({
                        data: {
                            id: `edge-${edgeIndex++}`,
                            source: edge.source,
                            target: edge.target,
                            label: edge.relationship,
                            weight: edge.weight,
                            ...edge.metadata
                        }
                    });
                }
            }
        }

        return elements;
    }

    getMetrics() {
        const degrees = Array.from(this.vertices.keys()).map(id => this.getDegree(id));
        const maxDegree = degrees.length > 0 ? Math.max(...degrees) : 0;
        const avgDegree = degrees.length > 0 ? (degrees.reduce((a, b) => a + b, 0) / degrees.length).toFixed(2) : 0;

        return {
            vertexCount: this.vertices.size,
            edgeCount: this.edgeCount,
            maxDegree: maxDegree,
            avgDegree: avgDegree
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ForensicsGraph, GraphNode, GraphEdge };
}
