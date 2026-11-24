/**
 * API ROUTES CONFIGURATION
 * Defines REST endpoints for cases, evidence, graphs, timelines, analysis, and data structures.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Configure secure multer storage for evidence uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${uniqueSuffix}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max upload size
});

// Import Controllers
const caseController = require('../controllers/caseController');
const evidenceController = require('../controllers/evidenceController');
const graphController = require('../controllers/graphController');
const timelineController = require('../controllers/timelineController');
const analysisController = require('../controllers/analysisController');
const dsController = require('../controllers/dsController');
const reportController = require('../controllers/reportController');

// 1. DASHBOARD & STATS
router.get('/dashboard/stats', reportController.getDashboardStats);

// 2. CASES
router.get('/cases', caseController.getAllCases);
router.get('/cases/:caseId', caseController.getCaseById);
router.put('/cases/:caseId/status', caseController.updateCaseStatus);

// 3. EVIDENCE
router.get('/evidence', evidenceController.getEvidence);
router.get('/evidence/trie-search', evidenceController.searchWithTrie);
router.get('/evidence/:evidenceId', evidenceController.getEvidenceById);
router.post('/evidence', evidenceController.addEvidence);
router.post('/evidence/upload', upload.single('evidence_file'), evidenceController.uploadEvidenceFile);
router.get('/evidence/:evidenceId/verify', evidenceController.verifyIntegrity);

// 4. GRAPH & TRAVERSALS (Cytoscape.js)
router.get('/graph/:caseId', graphController.getCaseGraph);
router.post('/graph/:caseId/traverse', graphController.runTraversal);
router.get('/graph/:caseId/components', graphController.getConnectedComponents);

// 5. TIMELINE (Sorting & AVL Tree)
router.get('/timeline/:caseId', timelineController.getTimeline);
router.get('/timeline/:caseId/benchmarks', timelineController.compareSortingAlgorithms);

// 6. INVESTIGATION ANALYSIS ENGINE
router.get('/analysis/:caseId', analysisController.generateCaseAnalysis);

// 7. DATA STRUCTURES LAB & BENCHMARKS
router.post('/ds/hashtable', dsController.runHashTableDemo);
router.post('/ds/trie', dsController.runTrieDemo);
router.post('/ds/avl', dsController.runAVLDemo);
router.post('/ds/sorting-benchmark', dsController.runSortingBenchmark);
router.get('/ds/complexity-guide', dsController.getDSComplexityGuide);

// 8. REPORTS & SYSTEM
router.get('/reports/:caseId', reportController.generateReport);
router.post('/system/reset-database', reportController.handleResetDatabase);

module.exports = router;
