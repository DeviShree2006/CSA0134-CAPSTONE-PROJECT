/**
 * MODULE 2 (PART 2): EVIDENCE SEARCH AND INDEXING
 * Custom AVL Tree (Self-Balancing Binary Search Tree) Implementation
 * 
 * Purpose in Digital Forensics:
 * 1. Chronological indexing of evidence artifacts by precise Unix timestamps.
 * 2. Rapid range queries (e.g., "Find all forensic events between 22:00:00 and 23:30:00").
 * 3. Guaranteed O(log n) performance for worst-case forensic queries, avoiding
 *    degradation to O(n) linked lists that unbalanced BSTs suffer from when
 *    timestamps are inserted sequentially.
 * 
 * Rotations Implemented:
 * - Left-Left (LL) -> Right Rotation
 * - Right-Right (RR) -> Left Rotation
 * - Left-Right (LR) -> Left Rotation on child, then Right Rotation on parent
 * - Right-Left (RL) -> Right Rotation on child, then Left Rotation on parent
 * 
 * Time Complexity:
 * - Search: O(log n)
 * - Insertion: O(log n)
 * - Deletion: O(log n)
 * - Range Query [T1, T2]: O(log n + k) where k is number of items in range
 * Space Complexity: O(n)
 */

class AVLNode {
    constructor(key, value) {
        this.key = key; // Timestamp (number or ISO string comparable)
        this.value = value; // Evidence record or array of records sharing timestamp
        this.records = Array.isArray(value) ? value : [value];
        this.height = 1;
        this.left = null;
        this.right = null;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.size = 0;
        this.rotationCounts = {
            leftRotations: 0,
            rightRotations: 0,
            total: 0
        };
    }

    /**
     * Helper to get height of a node (0 for null)
     */
    getHeight(node) {
        return node ? node.height : 0;
    }

    /**
     * Balance Factor = height(left) - height(right)
     */
    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    /**
     * Updates height of a node based on children
     */
    updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        }
    }

    /**
     * Right Rotation (for Left-Heavy imbalance)
     *        y                               x
     *       / \     Right Rotation          / \
     *      x   T3   -------------->        T1   y
     *     / \                                  / \
     *    T1  T2                               T2  T3
     */
    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        this.rotationCounts.rightRotations++;
        this.rotationCounts.total++;

        return x; // New root of subtree
    }

    /**
     * Left Rotation (for Right-Heavy imbalance)
     *      x                                   y
     *     / \          Left Rotation          / \
     *    T1   y       -------------->        x   T3
     *        / \                            / \
     *       T2  T3                         T1  T2
     */
    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        this.rotationCounts.leftRotations++;
        this.rotationCounts.total++;

        return y; // New root of subtree
    }

    /**
     * Standard timestamp normalization (converts ISO or date string to epoch ms)
     */
    normalizeKey(key) {
        if (typeof key === 'number') return key;
        const parsed = new Date(key).getTime();
        return isNaN(parsed) ? String(key) : parsed;
    }

    /**
     * Public Insert method
     */
    insert(key, value) {
        const normKey = this.normalizeKey(key);
        this.root = this._insertNode(this.root, normKey, value);
        this.size++;
    }

    _insertNode(node, key, value) {
        // 1. Standard BST insertion
        if (!node) {
            return new AVLNode(key, value);
        }

        if (key < node.key) {
            node.left = this._insertNode(node.left, key, value);
        } else if (key > node.key) {
            node.right = this._insertNode(node.right, key, value);
        } else {
            // Duplicate timestamp: attach record to existing node's list
            node.records.push(value);
            return node;
        }

        // 2. Update height of current node
        this.updateHeight(node);

        // 3. Get balance factor to check if unbalanced
        const balance = this.getBalanceFactor(node);

        // Case 1: Left-Left (LL) Imbalance -> Right Rotate
        if (balance > 1 && key < node.left.key) {
            return this.rightRotate(node);
        }

        // Case 2: Right-Right (RR) Imbalance -> Left Rotate
        if (balance < -1 && key > node.right.key) {
            return this.leftRotate(node);
        }

        // Case 3: Left-Right (LR) Imbalance -> Left Rotate on left child, then Right Rotate
        if (balance > 1 && key > node.left.key) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Case 4: Right-Left (RL) Imbalance -> Right Rotate on right child, then Left Rotate
        if (balance < -1 && key < node.right.key) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    /**
     * Searches for exact timestamp key
     */
    search(key) {
        const normKey = this.normalizeKey(key);
        let current = this.root;
        let comparisons = 0;

        while (current) {
            comparisons++;
            if (normKey === current.key) {
                return { found: true, records: current.records, comparisons };
            } else if (normKey < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return { found: false, records: [], comparisons };
    }

    /**
     * In-order traversal (returns sorted array by timestamp)
     */
    inOrder() {
        const result = [];
        this._inOrderHelper(this.root, result);
        return result;
    }

    _inOrderHelper(node, result) {
        if (!node) return;
        this._inOrderHelper(node.left, result);
        for (const rec of node.records) {
            result.push({ key: node.key, record: rec });
        }
        this._inOrderHelper(node.right, result);
    }

    /**
     * Forensic Range Query:
     * Returns all evidence records within [minKey, maxKey] time window.
     */
    rangeSearch(minKey, maxKey) {
        const min = this.normalizeKey(minKey);
        const max = this.normalizeKey(maxKey);
        const results = [];
        this._rangeSearchHelper(this.root, min, max, results);
        return results;
    }

    _rangeSearchHelper(node, min, max, results) {
        if (!node) return;

        // If current key is greater than min, left subtree might have candidates
        if (node.key > min) {
            this._rangeSearchHelper(node.left, min, max, results);
        }

        // If current key falls within [min, max], include its records
        if (node.key >= min && node.key <= max) {
            for (const rec of node.records) {
                results.push({ key: node.key, record: rec });
            }
        }

        // If current key is less than max, right subtree might have candidates
        if (node.key < max) {
            this._rangeSearchHelper(node.right, min, max, results);
        }
    }

    /**
     * Tree metadata and verification
     */
    isBalanced(node = this.root) {
        if (!node) return true;
        const balance = Math.abs(this.getBalanceFactor(node));
        if (balance > 1) return false;
        return this.isBalanced(node.left) && this.isBalanced(node.right);
    }

    getMetrics() {
        return {
            totalNodes: this.size,
            treeHeight: this.getHeight(this.root),
            isBalanced: this.isBalanced(),
            balanceFactorRoot: this.getBalanceFactor(this.root),
            rotations: this.rotationCounts
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AVLTree, AVLNode };
}
