/**
 * CENTRALIZED FRONTEND API CLIENT
 * Wrapper for all backend REST endpoints.
 */

const API_BASE = '/api';

const API = {
    // Auth
    async login(username, password) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.json();
    },

    // Dashboard
    async getDashboardStats() {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        return res.json();
    },

    // Cases
    async getCases() {
        const res = await fetch(`${API_BASE}/cases`);
        return res.json();
    },

    async getCaseById(caseId) {
        const res = await fetch(`${API_BASE}/cases/${caseId}`);
        return res.json();
    },

    async updateCaseStatus(caseId, status) {
        const res = await fetch(`${API_BASE}/cases/${caseId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return res.json();
    },

    // Evidence
    async getEvidence(params = {}) {
        const qs = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/evidence?${qs}`);
        return res.json();
    },

    async getEvidenceById(evidenceId) {
        const res = await fetch(`${API_BASE}/evidence/${evidenceId}`);
        return res.json();
    },

    async searchTrie(query, limit = 10) {
        const res = await fetch(`${API_BASE}/evidence/trie-search?query=${encodeURIComponent(query)}&limit=${limit}`);
        return res.json();
    },

    async addEvidence(data) {
        const res = await fetch(`${API_BASE}/evidence`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async uploadEvidenceFile(formData) {
        const res = await fetch(`${API_BASE}/evidence/upload`, {
            method: 'POST',
            body: formData
        });
        return res.json();
    },

    async verifyIntegrity(evidenceId) {
        const res = await fetch(`${API_BASE}/evidence/${evidenceId}/verify`);
        return res.json();
    },

    // Graph
    async getCaseGraph(caseId) {
        const res = await fetch(`${API_BASE}/graph/${caseId}`);
        return res.json();
    },

    async runGraphTraversal(caseId, startId, targetId, algorithm = 'bfs') {
        const res = await fetch(`${API_BASE}/graph/${caseId}/traverse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startId, targetId, algorithm })
        });
        return res.json();
    },

    // Timeline
    async getTimeline(caseId, params = {}) {
        const qs = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/timeline/${caseId}?${qs}`);
        return res.json();
    },

    async getSortingBenchmarks(caseId) {
        const res = await fetch(`${API_BASE}/timeline/${caseId}/benchmarks`);
        return res.json();
    },

    // Analysis
    async generateAnalysis(caseId) {
        const res = await fetch(`${API_BASE}/analysis/${caseId}`);
        return res.json();
    },

    // Data Structures Lab
    async runHashTableDemo(body) {
        const res = await fetch(`${API_BASE}/ds/hashtable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    async runTrieDemo(body) {
        const res = await fetch(`${API_BASE}/ds/trie`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    async runAVLDemo(body) {
        const res = await fetch(`${API_BASE}/ds/avl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    async runSortingBenchmark(body) {
        const res = await fetch(`${API_BASE}/ds/sorting-benchmark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    async getDSGuide() {
        const res = await fetch(`${API_BASE}/ds/complexity-guide`);
        return res.json();
    },

    // System
    async resetDatabase() {
        const res = await fetch(`${API_BASE}/system/reset-database`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirm: true })
        });
        return res.json();
    }
};
