/**
 * MODULE 2: EVIDENCE SEARCH AND INDEXING
 * Custom Trie (Prefix Tree) Implementation
 * 
 * Purpose in Digital Forensics:
 * High-speed prefix-based indexing and searching for:
 * - Evidence identifiers (e.g., 'EVD-2026-001')
 * - Forensic keywords (e.g., 'exfiltration', 'powershell', 'shadow copy')
 * - Person names, email addresses, and file extensions.
 * 
 * Time Complexity:
 * - Insertion: O(L) where L is string length
 * - Search: O(L)
 * - Prefix matching / Autocomplete: O(P + K) where P is prefix length, K is number of matches
 * Space Complexity: O(ALPHABET_SIZE * L * N)
 */

class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.records = []; // Associated evidence or case metadata records
        this.frequency = 0; // Frequency counter for ranking suggestions
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.totalWords = 0;
        this.totalNodes = 1;
    }

    /**
     * Normalizes input string for case-insensitive indexing
     */
    normalize(str) {
        return String(str || '').toLowerCase().trim();
    }

    /**
     * Inserts a word and attaches forensic record metadata
     */
    insert(word, metadata = null) {
        const cleanWord = this.normalize(word);
        if (!cleanWord) return;

        let current = this.root;
        for (let i = 0; i < cleanWord.length; i++) {
            const char = cleanWord[i];
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
                this.totalNodes++;
            }
            current = current.children.get(char);
        }

        if (!current.isEndOfWord) {
            current.isEndOfWord = true;
            this.totalWords++;
        }
        current.frequency++;

        if (metadata) {
            // Prevent duplicate metadata objects
            const exists = current.records.some(r => r.id === metadata.id);
            if (!exists) {
                current.records.push(metadata);
            }
        }
    }

    /**
     * Exact search for a term.
     * Returns true/false or matches with metadata.
     */
    search(word) {
        const cleanWord = this.normalize(word);
        let current = this.root;

        for (let i = 0; i < cleanWord.length; i++) {
            const char = cleanWord[i];
            if (!current.children.has(char)) {
                return { found: false, records: [] };
            }
            current = current.children.get(char);
        }

        return {
            found: current.isEndOfWord,
            records: current.isEndOfWord ? current.records : [],
            frequency: current.frequency
        };
    }

    /**
     * Checks if any indexed term starts with the given prefix.
     */
    startsWith(prefix) {
        const cleanPrefix = this.normalize(prefix);
        let current = this.root;

        for (let i = 0; i < cleanPrefix.length; i++) {
            const char = cleanPrefix[i];
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        return true;
    }

    /**
     * Autocomplete: Finds all indexed words starting with the prefix
     * along with their associated forensic records, sorted by frequency.
     */
    autocomplete(prefix, maxResults = 10) {
        const cleanPrefix = this.normalize(prefix);
        const results = [];
        let current = this.root;

        if (cleanPrefix.length > 0) {
            for (let i = 0; i < cleanPrefix.length; i++) {
                const char = cleanPrefix[i];
                if (!current.children.has(char)) {
                    return [];
                }
                current = current.children.get(char);
            }
        }

        // DFS to collect all child words
        this._collectWords(current, cleanPrefix, results, maxResults);

        // Sort by frequency descending
        results.sort((a, b) => b.frequency - a.frequency);
        return results.slice(0, maxResults);
    }

    _collectWords(node, currentPrefix, results, limit) {
        if (node.isEndOfWord) {
            results.push({
                term: currentPrefix,
                frequency: node.frequency,
                records: node.records
            });
            if (results.length >= limit * 3) return; // Prevent excessive recursion
        }

        for (const [char, childNode] of node.children.entries()) {
            this._collectWords(childNode, currentPrefix + char, results, limit);
        }
    }

    /**
     * Bulk index evidence records by extracting title, description,
     * tags, source, and ID tokens.
     */
    indexEvidenceList(evidenceList) {
        for (const item of evidenceList) {
            // Index by ID
            if (item.evidence_id) {
                this.insert(item.evidence_id, item);
            }
            // Index by title tokens
            if (item.title) {
                const tokens = item.title.split(/[\s_\-.,/\\:]+/);
                for (const token of tokens) {
                    if (token.length >= 2) this.insert(token, item);
                }
                this.insert(item.title, item);
            }
            // Index by type
            if (item.evidence_type) {
                this.insert(item.evidence_type, item);
            }
            // Index by source / device / person
            if (item.source) {
                this.insert(item.source, item);
            }
        }
    }

    getMetrics() {
        return {
            totalIndexedWords: this.totalWords,
            totalTreeNodes: this.totalNodes,
            rootBranchingFactor: this.root.children.size
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Trie, TrieNode };
}
