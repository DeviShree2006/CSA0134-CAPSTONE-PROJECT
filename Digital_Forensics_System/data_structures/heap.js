/**
 * MODULE 4: INVESTIGATION TIMELINE AND PRIORITIZATION
 * Custom Binary Heap Implementation (Supports Min-Heap and Max-Heap)
 * 
 * Purpose in Digital Forensics:
 * 1. Max-Heap: Rapid retrieval of highest-priority forensic evidence artifacts
 *    that demand urgent examiner triage.
 * 2. Min-Heap: Chronological ordering of forensic timeline events, enabling
 *    efficient extraction of earliest-to-latest incident steps.
 * 
 * Array-based Complete Binary Tree:
 * - Parent index: Math.floor((i - 1) / 2)
 * - Left child: 2 * i + 1
 * - Right child: 2 * i + 2
 * 
 * Time Complexity:
 * - Insert: O(log n)
 * - Extract (Root): O(log n)
 * - Peek (Root): O(1)
 * - Heapify (Build from array): O(n)
 * Space Complexity: O(n)
 */

class BinaryHeap {
    /**
     * @param {string} type 'max' or 'min'
     * @param {function} scoreExtractor function returning numeric priority
     */
    constructor(type = 'max', scoreExtractor = null) {
        this.type = type.toLowerCase();
        this.scoreExtractor = scoreExtractor || (item => (typeof item === 'number' ? item : item.priority || 0));
        this.heap = [];
        this.swapCount = 0;
        this.comparisonCount = 0;
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    /**
     * Comparison logic depending on heap type (min vs max)
     */
    _compare(a, b) {
        this.comparisonCount++;
        const scoreA = this.scoreExtractor(a);
        const scoreB = this.scoreExtractor(b);
        return this.type === 'max' ? scoreA > scoreB : scoreA < scoreB;
    }

    _swap(i, j) {
        this.swapCount++;
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    /**
     * Inserts an element into the heap and restores heap invariant via bubbleUp.
     */
    insert(element) {
        this.heap.push(element);
        this._bubbleUp(this.heap.length - 1);
    }

    _bubbleUp(index) {
        let current = index;
        while (current > 0) {
            const parentIndex = Math.floor((current - 1) / 2);
            if (this._compare(this.heap[current], this.heap[parentIndex])) {
                this._swap(current, parentIndex);
                current = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Extracts and returns root element (maximum in Max-Heap, minimum in Min-Heap)
     */
    extract() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._bubbleDown(0);
        return root;
    }

    _bubbleDown(index) {
        let current = index;
        const length = this.heap.length;

        while (true) {
            let targetChild = current;
            const leftChild = 2 * current + 1;
            const rightChild = 2 * current + 2;

            if (leftChild < length && this._compare(this.heap[leftChild], this.heap[targetChild])) {
                targetChild = leftChild;
            }

            if (rightChild < length && this._compare(this.heap[rightChild], this.heap[targetChild])) {
                targetChild = rightChild;
            }

            if (targetChild !== current) {
                this._swap(current, targetChild);
                current = targetChild;
            } else {
                break;
            }
        }
    }

    /**
     * Builds heap in O(n) from an existing array
     */
    buildHeap(array) {
        this.heap = [...array];
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this._bubbleDown(i);
        }
    }

    /**
     * Returns all elements sorted by extracting repeatedly
     */
    extractAllSorted() {
        const sorted = [];
        const copy = new BinaryHeap(this.type, this.scoreExtractor);
        copy.buildHeap(this.heap);

        while (!copy.isEmpty()) {
            sorted.push(copy.extract());
        }
        return sorted;
    }

    getMetrics() {
        return {
            type: this.type,
            size: this.size(),
            comparisons: this.comparisonCount,
            swaps: this.swapCount,
            rootPriority: this.peek() ? this.scoreExtractor(this.peek()) : null
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BinaryHeap };
}
