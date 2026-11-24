/**
 * MODULE 3 (PART 2): GRAPH TRAVERSALS (BFS & DFS)
 * Custom Breadth-First Search and Depth-First Search Implementation
 * 
 * Purpose in Digital Forensics:
 * 
 * 1. Breadth-First Search (BFS):
 * - Identifies shortest investigative path between two entities
 *   (e.g., How is Suspect X linked to Exfiltrated File Y?).
 * - Explores investigation 'rings' of influence (immediate 1-hop contacts vs 2-hop).
 * - Level-by-level spreading of malicious lateral movement.
 * 
 * 2. Depth-First Search (DFS):
 * - Traces deep chains of custody from origin source to destination.
 * - Detects circular relationships or loops (e.g., money/data laundering circuits).
 * - Identifies isolated investigation clusters / connected components.
 * 
 * Time Complexity:
 * - BFS: O(V + E)
 * - DFS: O(V + E)
 * Space Complexity: O(V)
 */

class GraphTraversals {
    /**
     * Breadth-First Search (BFS)
     * Performs level-order traversal using an internal FIFO queue.
     * Records visited sequence and step-by-step trace for UI animation.
     */
    static bfs(graph, startId, targetId = null) {
        const start = String(startId);
        const target = targetId ? String(targetId) : null;

        if (!graph.hasVertex(start)) {
            return { error: `Start vertex '${start}' not found in graph.` };
        }

        const visited = new Set();
        const queue = [start];
        const visitOrder = [];
        const distances = { [start]: 0 };
        const predecessors = { [start]: null };
        const steps = []; // Interactive step trace for frontend animation

        visited.add(start);

        steps.push({
            step: 0,
            action: 'ENQUEUE_START',
            nodeId: start,
            queue: [...queue],
            visited: Array.from(visited),
            description: `Started BFS at origin node: ${graph.getVertex(start)?.label || start}`
        });

        let foundTarget = false;

        while (queue.length > 0) {
            const current = queue.shift();
            visitOrder.push(current);

            steps.push({
                step: steps.length,
                action: 'DEQUEUE_VISIT',
                nodeId: current,
                queue: [...queue],
                visited: Array.from(visited),
                description: `Visiting node: ${graph.getVertex(current)?.label || current} (Distance: ${distances[current]} hops)`
            });

            if (target && current === target) {
                foundTarget = true;
                break;
            }

            const edges = graph.getEdges(current);
            for (const edge of edges) {
                const neighbor = edge.target;
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    distances[neighbor] = distances[current] + 1;
                    predecessors[neighbor] = { from: current, relationship: edge.relationship };
                    queue.push(neighbor);

                    steps.push({
                        step: steps.length,
                        action: 'DISCOVER_NEIGHBOR',
                        nodeId: neighbor,
                        sourceId: current,
                        relationship: edge.relationship,
                        queue: [...queue],
                        visited: Array.from(visited),
                        description: `Discovered neighbor ${graph.getVertex(neighbor)?.label || neighbor} via relationship '${edge.relationship}'`
                    });
                }
            }
        }

        // Reconstruct shortest path if target specified
        let path = null;
        if (target) {
            if (foundTarget) {
                path = [];
                let curr = target;
                while (curr !== null) {
                    path.unshift(curr);
                    const pred = predecessors[curr];
                    curr = pred ? pred.from : null;
                }
            }
        }

        return {
            algorithm: 'BFS',
            startId: start,
            targetId: target,
            foundTarget,
            visitOrder,
            distances,
            path,
            totalVisited: visited.size,
            steps
        };
    }

    /**
     * Depth-First Search (DFS)
     * Performs deep recursive traversal using a LIFO stack.
     * Records visited sequence and step-by-step trace for UI animation.
     */
    static dfs(graph, startId, targetId = null) {
        const start = String(startId);
        const target = targetId ? String(targetId) : null;

        if (!graph.hasVertex(start)) {
            return { error: `Start vertex '${start}' not found in graph.` };
        }

        const visited = new Set();
        const visitOrder = [];
        const predecessors = { [start]: null };
        const steps = [];
        let foundTarget = false;

        steps.push({
            step: 0,
            action: 'START_DFS',
            nodeId: start,
            visited: [],
            description: `Started DFS at origin node: ${graph.getVertex(start)?.label || start}`
        });

        function dfsVisit(current) {
            visited.add(current);
            visitOrder.push(current);

            steps.push({
                step: steps.length,
                action: 'EXPLORE_NODE',
                nodeId: current,
                visited: Array.from(visited),
                description: `Deeply exploring node: ${graph.getVertex(current)?.label || current}`
            });

            if (target && current === target) {
                foundTarget = true;
                return true;
            }

            const edges = graph.getEdges(current);
            for (const edge of edges) {
                const neighbor = edge.target;
                if (!visited.has(neighbor)) {
                    predecessors[neighbor] = { from: current, relationship: edge.relationship };
                    const shouldStop = dfsVisit(neighbor);
                    if (shouldStop) return true;
                }
            }

            steps.push({
                step: steps.length,
                action: 'BACKTRACK',
                nodeId: current,
                visited: Array.from(visited),
                description: `Backtracking from node: ${graph.getVertex(current)?.label || current}`
            });

            return false;
        }

        dfsVisit(start);

        // Reconstruct path if target specified
        let path = null;
        if (target && foundTarget) {
            path = [];
            let curr = target;
            while (curr !== null) {
                path.unshift(curr);
                const pred = predecessors[curr];
                curr = pred ? pred.from : null;
            }
        }

        return {
            algorithm: 'DFS',
            startId: start,
            targetId: target,
            foundTarget,
            visitOrder,
            path,
            totalVisited: visited.size,
            steps
        };
    }

    /**
     * Connected Components Discovery
     * Partitions evidence graph into independent sub-clusters.
     */
    static findConnectedComponents(graph) {
        const visited = new Set();
        const components = [];

        for (const vertex of graph.getAllVertices()) {
            if (!visited.has(vertex.id)) {
                const component = [];
                const queue = [vertex.id];
                visited.add(vertex.id);

                while (queue.length > 0) {
                    const current = queue.shift();
                    component.push(current);

                    for (const neighbor of graph.getNeighbors(current)) {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            queue.push(neighbor);
                        }
                    }
                }
                components.push(component);
            }
        }

        return components;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GraphTraversals };
}
