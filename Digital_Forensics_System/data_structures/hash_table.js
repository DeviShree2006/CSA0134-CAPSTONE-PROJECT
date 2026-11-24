/**
 * MODULE 1: EVIDENCE COLLECTION AND IDENTIFICATION
 * Custom Hash Table Implementation with Bucket Chaining
 * 
 * Purpose in Digital Forensics:
 * Rapid evidence lookup by SHA-256 integrity hash or unique identifier.
 * Enables O(1) instantaneous duplicate evidence detection and tamper checking.
 * 
 * Time Complexity:
 * - Insert: Average O(1), Worst O(n)
 * - Lookup: Average O(1), Worst O(n)
 * - Delete: Average O(1), Worst O(n)
 * Space Complexity: O(n)
 */

class HashNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class HashTable {
    constructor(initialCapacity = 32, loadFactorThreshold = 0.75) {
        this.capacity = initialCapacity;
        this.loadFactorThreshold = loadFactorThreshold;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null);
        this.collisionCount = 0;
    }

    /**
     * Polynomial rolling hash function (DJB2 variant)
     * Distributes hash values uniformly across bucket array.
     */
    hash(key) {
        const strKey = String(key);
        let hashValue = 5381;
        for (let i = 0; i < strKey.length; i++) {
            // (hash * 33) + c
            hashValue = ((hashValue << 5) + hashValue) + strKey.charCodeAt(i);
            hashValue = hashValue & hashValue; // Convert to 32bit integer
        }
        return Math.abs(hashValue) % this.capacity;
    }

    /**
     * Inserts or updates a key-value pair.
     * Automatically handles collision chaining and dynamic resizing.
     */
    set(key, value) {
        // Check load factor for dynamic resizing
        if ((this.size + 1) / this.capacity > this.loadFactorThreshold) {
            this.resize(this.capacity * 2);
        }

        const index = this.hash(key);
        let head = this.buckets[index];

        // Search if key already exists in chain
        let current = head;
        while (current !== null) {
            if (current.key === key) {
                current.value = value; // Update existing
                return this;
            }
            current = current.next;
        }

        // Key does not exist; insert new node at head of chain
        const newNode = new HashNode(key, value);
        if (head !== null) {
            this.collisionCount++;
        }
        newNode.next = head;
        this.buckets[index] = newNode;
        this.size++;
        return this;
    }

    /**
     * Retrieves value associated with key.
     * Returns null if key not found.
     */
    get(key) {
        const index = this.hash(key);
        let current = this.buckets[index];
        while (current !== null) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }
        return null;
    }

    /**
     * Checks if key exists.
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Removes key-value pair from hash table.
     */
    delete(key) {
        const index = this.hash(key);
        let current = this.buckets[index];
        let prev = null;

        while (current !== null) {
            if (current.key === key) {
                if (prev === null) {
                    this.buckets[index] = current.next;
                } else {
                    prev.next = current.next;
                }
                this.size--;
                return true;
            }
            prev = current;
            current = current.next;
        }
        return false;
    }

    /**
     * Resizes bucket array and re-hashes all existing elements.
     */
    resize(newCapacity) {
        const oldBuckets = this.buckets;
        this.capacity = newCapacity;
        this.buckets = new Array(newCapacity).fill(null);
        this.size = 0;
        this.collisionCount = 0;

        for (let i = 0; i < oldBuckets.length; i++) {
            let current = oldBuckets[i];
            while (current !== null) {
                this.set(current.key, current.value);
                current = current.next;
            }
        }
    }

    /**
     * Returns all entries as an array of [key, value]
     */
    entries() {
        const results = [];
        for (let i = 0; i < this.capacity; i++) {
            let current = this.buckets[i];
            while (current !== null) {
                results.push([current.key, current.value]);
                current = current.next;
            }
        }
        return results;
    }

    /**
     * Returns all stored values.
     */
    values() {
        return this.entries().map(e => e[1]);
    }

    /**
     * Forensic Duplicate Evidence Detector
     * Evaluates evidence records against existing hash table entries.
     * Identifies SHA-256 hash collisions (duplicates / copies).
     */
    detectDuplicate(sha256Hash) {
        if (!sha256Hash) return null;
        const normalized = sha256Hash.toLowerCase().trim();
        if (this.has(normalized)) {
            return {
                isDuplicate: true,
                existingRecord: this.get(normalized),
                hash: normalized,
                message: "Duplicate forensic artifact detected with identical cryptographic checksum."
            };
        }
        return {
            isDuplicate: false,
            hash: normalized,
            message: "Cryptographic checksum is unique in the current evidence repository."
        };
    }

    /**
     * Returns internal statistics for academic demonstration.
     */
    getMetrics() {
        const chainLengths = [];
        let emptyBuckets = 0;

        for (let i = 0; i < this.capacity; i++) {
            let length = 0;
            let current = this.buckets[i];
            while (current !== null) {
                length++;
                current = current.next;
            }
            if (length === 0) emptyBuckets++;
            else chainLengths.push(length);
        }

        const maxChainLength = chainLengths.length > 0 ? Math.max(...chainLengths) : 0;
        const avgChainLength = chainLengths.length > 0 ? (chainLengths.reduce((a, b) => a + b, 0) / chainLengths.length).toFixed(2) : 0;

        return {
            totalEntries: this.size,
            bucketCapacity: this.capacity,
            currentLoadFactor: (this.size / this.capacity).toFixed(3),
            loadFactorThreshold: this.loadFactorThreshold,
            emptyBuckets: emptyBuckets,
            usedBuckets: this.capacity - emptyBuckets,
            collisionCount: this.collisionCount,
            maxChainLength: maxChainLength,
            avgChainLength: avgChainLength
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HashTable, HashNode };
}
