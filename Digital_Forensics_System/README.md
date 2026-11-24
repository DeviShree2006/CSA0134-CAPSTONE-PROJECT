# Intelligent Digital Forensics and Evidence Correlation System Using Advanced Data Structures

> **Academic College Data Structures Project**  
> Developed as a comprehensive full-stack digital forensics investigation suite.

---

## 1. Project Overview

The **Intelligent Digital Forensics and Evidence Correlation System** is a high-performance web-based forensic investigation platform designed for digital crime investigators, cybersecurity examiners, and law enforcement analysts.

The application allows investigators to:
1. Explore **10 distinct, deeply detailed fictional investigation cases** (e.g., Corporate Data Theft, Unauthorized Database Access, Digital Document Tampering, Rogue Hardware Keylogger).
2. Examine forensic evidence records with verified cryptographic **SHA-256 integrity checksums**.
3. Identify evidence correlations and entity relationships using interactive **Cytoscape.js** network graphs.
4. Animate step-by-step **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** graph traversals.
5. Reconstruct chronological incident timelines sorted with manual **Merge Sort, Quick Sort, and Radix Sort** algorithms, alongside self-balancing **AVL Tree** timestamp range queries.
6. Execute an automated **Rule-Based Forensic Analysis Engine** with a prominent **GENERATE INVESTIGATION ANALYSIS** action, synthesizing evidence-backed observations, hypotheses with cited Evidence IDs, alternative explanations, and recommended next steps.

---

## 2. Technology Stack

- **Frontend**: HTML5, CSS3 (Custom Deep Navy & Electric Blue Cyber Theme), Modern Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js REST API.
- **Permanent Database**: SQLite (`database/evidence.db`) with native zero-compilation `DatabaseSync` engine.
- **Network Graph Visualizer**: Cytoscape.js (bundled locally in `frontend/js/libs/cytoscape.min.js`).
- **Statistical Analytics**: Chart.js (bundled locally in `frontend/js/libs/chart.umd.js`).
- **Data Structures**: **100% manual JavaScript implementations** without any third-party algorithmic packages.

---

## 3. Demonstration Login Credentials

The application includes an authentication interface with demonstration credentials:

| Role | Username | Password | Full Name & Badge |
|---|---|---|---|
| **Lead Digital Forensic Investigator** | `admin` | `admin123` | Special Agent Sarah Connor (`DF-7701`) |
| **Senior Forensic Analyst** | `analyst` | `forensics2026` | Examiner Alex Mercer (`DF-9244`) |

*(One-click **Auto-Fill** buttons are provided directly on the login page for convenience during evaluation).*

---

## 4. How to Run on Windows

### Quick Start (Recommended)

1. Open the project folder `Digital_Forensics_System` in File Explorer.
2. Double-click the provided batch file:
   ```cmd
   run.bat
   ```
3. The script will automatically:
   - Check if Node.js is installed.
   - Install dependencies if `node_modules` does not exist.
   - Seed the SQLite database if not present.
   - Launch the backend server on `http://localhost:3000`.
   - Open your default web browser directly to `http://localhost:3000/index.html`.

### Manual CLI Start

If you prefer running via Windows PowerShell or Command Prompt:

```powershell
# 1. Navigate to the project directory
cd c:\Users\ds200\Documents\Digital_Forensics_System

# 2. Install dependencies (Express, Multer, CORS, Cytoscape, Chart.js)
npm install

# 3. Initialize and seed the SQLite database
npm run seed

# 4. Start the backend application server
npm start
```

Open your browser and navigate to:
```
http://localhost:3000
```

To run the automated verification test suite:
```powershell
npm test
```

---

## 5. Ten Fictional Investigation Cases

Each case contains its own unique narrative, 3 persons of interest, hardware devices, accounts, 10+ evidence artifacts, login logs, file access records, email messages, timeline events, and dedicated analysis logic:

1. **CASE-2026-001: Corporate Data Theft (Project Aegis)**  
   *Mass exfiltration of proprietary source code repositories outside business hours via external Kingston USB media.*
2. **CASE-2026-002: Suspicious Account Access & MFA Bypass**  
   *Domain Administrator account hijacked from a Tor Exit Node through push-bombing MFA fatigue attack and LSASS injection.*
3. **CASE-2026-003: Missing Executive Laptop Investigation**  
   *Chief Commercial Officer ThinkPad laptop stolen from airport VIP lounge; unauthorized Azure AD Key Vault queries detected.*
4. **CASE-2026-004: Financial Record Manipulation in ERP**  
   *Direct SQL update on Oracle ERP vendor payment tables to divert $840,000 to an offshore Cayman entity before audit.*
5. **CASE-2026-005: Insider Confidential Information Leak**  
   *Unannounced M&A merger acquisition slide deck leaked to financial press via high-resolution screen photo and Proton VPN.*
6. **CASE-2026-006: Targeted HR Spear-Phishing Campaign**  
   *Deceptive DocuSign lure harvesting corporate Microsoft 365 credentials using an Adversary-in-the-Middle (AiTM) reverse proxy.*
7. **CASE-2026-007: Unauthorized Customer Database Access (SQLi)**  
   *Automated SQL injection exploitation on legacy portal API dumping 50,000 customer PII records for dark web sale.*
8. **CASE-2026-008: Digital Vendor Contract Tampering**  
   *Post-signature incremental PDF alteration on page 14 inflating milestone fee by $450,000 with forged X.509 timestamps.*
9. **CASE-2026-009: Anti-Forensic File Deletion & Scrubbing**  
   *Multi-pass DoD 5220.22-M zero-fill shredding (SDelete) and Volume Shadow Copy destruction 16 minutes after subpoena service.*
10. **CASE-2026-010: Rogue Hardware Keylogger Connection**  
    *Unauthorized USB Rubber Ducky keystroke injector inserted into trading floor terminal executing encoded PowerShell.*

---

## 6. Manual Data Structures Implementation Reference

All data structures are manually written in the `data_structures/` directory:

### Module 1: Evidence Collection and Identification
- **File**: `data_structures/hash_table.js`
- **Structure**: Custom Hash Table with Bucket Chaining
- **Algorithms**: Polynomial rolling hash (DJB2 variant), dynamic table doubling at load factor $> 0.75$.
- **Time Complexity**: Insertion $O(1)$ avg, Lookup $O(1)$ avg, Deletion $O(1)$ avg.
- **Forensic Application**: Instantaneous SHA-256 duplicate detection and cryptographic tamper checking.

### Module 2: Evidence Search and Indexing
- **File**: `data_structures/trie.js`
- **Structure**: Trie (Prefix Tree)
- **Time Complexity**: Insertion $O(L)$, Search $O(L)$, Autocomplete $O(P + K)$.
- **Forensic Application**: High-speed prefix-based searching and live autocomplete for evidence IDs, keywords, and suspect names.
- **File**: `data_structures/avl_tree.js`
- **Structure**: Self-Balancing Binary Search Tree (AVL Tree)
- **Algorithms**: Height balancing with LL, RR, LR, and RL rotations.
- **Time Complexity**: Search $O(\log n)$, Insertion $O(\log n)$, Range Query $O(\log n + k)$.
- **Forensic Application**: Chronological indexing preventing BST skewness when timestamps arrive sequentially; rapid incident time-window queries.

### Module 3: Evidence Relationship and Correlation
- **File**: `data_structures/graph.js`
- **Structure**: Adjacency List Graph
- **Algorithms**: Weighted directed/undirected edges, vertex metadata, Cytoscape.js element conversion.
- **File**: `data_structures/bfs_dfs.js`
- **Structure**: Breadth-First Search (BFS) & Depth-First Search (DFS)
- **Time Complexity**: $O(V + E)$
- **Forensic Application**: 
  - **BFS**: Identifies the shortest investigative path between a suspect and an exfiltrated file; models level-by-level spreading rings.
  - **DFS**: Traces deep custody chains from source to recipient; detects circular data-routing loops.

### Module 4: Investigation Timeline and Prioritization
- **File**: `data_structures/heap.js`
- **Structure**: Array-based Complete Binary Max-Heap and Min-Heap
- **Time Complexity**: Insert $O(\log n)$, Extract $O(\log n)$, Peek $O(1)$, Heapify $O(n)$.
- **File**: `data_structures/priority_queue.js`
- **Structure**: Forensic Priority Queue
- **Scoring Model**: Composite score (0-100) combining Incident Relevance (+30), Relationship Corroboration (+25), SHA-256 Integrity Verification (+20), Critical Timestamp Proximity (+15), and Severity (+10).
- **Forensic Application**: Ranks high-priority evidence demanding immediate examiner triage.
- **File**: `data_structures/sorting.js`
- **Structure**: Manual Merge Sort, Quick Sort (Lomuto partitioning), and Radix Sort (LSD).
- **Time Complexity**: 
  - Merge Sort: $O(n \log n)$ [Stable]
  - Quick Sort: Avg $O(n \log n)$, Worst $O(n^2)$ [In-Place]
  - Radix Sort: $O(d \cdot (n + k))$ [Non-Comparative Integer/Epoch Sort]
- **Forensic Application**: Precise chronological reconstruction of events across disparate log sources with empirical microsecond benchmarks.

---

## 7. Project Folder Structure

```
Digital_Forensics_System/
├── backend/
│   ├── controllers/
│   │   ├── analysisController.js
│   │   ├── caseController.js
│   │   ├── dsController.js
│   │   ├── evidenceController.js
│   │   ├── graphController.js
│   │   ├── reportController.js
│   │   └── timelineController.js
│   ├── routes/
│   │   └── apiRoutes.js
│   ├── services/
│   │   └── analysisEngine.js
│   ├── database.js
│   └── server.js
├── database/
│   ├── schema.sql
│   ├── seed.js
│   └── evidence.db
├── data_structures/
│   ├── avl_tree.js
│   ├── bfs_dfs.js
│   ├── graph.js
│   ├── hash_table.js
│   ├── heap.js
│   ├── priority_queue.js
│   ├── sorting.js
│   └── trie.js
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── libs/
│   │   │   ├── chart.umd.js
│   │   │   └── cytoscape.min.js
│   │   ├── analysis-view.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── case-details.js
│   │   ├── cases.js
│   │   ├── dashboard.js
│   │   ├── ds-lab.js
│   │   ├── evidence.js
│   │   ├── graph-view.js
│   │   ├── timeline-view.js
│   │   └── ui-utils.js
│   ├── analysis.html
│   ├── case-details.html
│   ├── cases.html
│   ├── dashboard.html
│   ├── ds-demo.html
│   ├── evidence.html
│   ├── graph.html
│   ├── index.html
│   └── timeline.html
├── reports/
├── tests/
│   └── test_runner.js
├── uploads/
├── package.json
├── run.bat
└── README.md
```

---

## 8. Verification & Test Results

Run the verification test suite with:
```powershell
node tests/test_runner.js
```

### Verified Test Cases:
- **Test #1: Database Initialization & Schema Verification**: Validates all 12 tables, indexes, and foreign keys.
- **Test #2: All 10 Fictional Cases and Dossiers**: Confirms 10 cases, 30 persons, 20 devices, 100+ evidence items, and 68 events.
- **Test #3: Hash Table Evidence Storage & Duplicate Detection**: Verifies O(1) duplicate collision detection.
- **Test #4: Trie Indexing and Prefix Autocomplete**: Verifies prefix search on IDs and keywords.
- **Test #5: AVL Tree Self-Balancing & Timestamp Range Search**: Validates rotations and time-range filtering.
- **Test #6: Graph Creation, BFS Shortest Path, and DFS Deep Traversal**: Tests level-order paths and deep traversals.
- **Test #7: Binary Heap and Forensic Priority Queue Scoring**: Verifies Max-Heap order and multi-factor triage score.
- **Test #8: Merge Sort, Quick Sort, and Radix Sort Timeline Verification**: Confirms strict chronological ordering.
- **Test #9: Investigation Analysis Engine Across All 10 Cases**: Validates multi-hypothesis generation with cited Evidence IDs.

---

## 9. Academic Disclaimer

This project is developed for educational and academic purposes as a Computer Science Data Structures college coursework project. All investigation cases, suspect names, companies, and IP addresses are entirely fictional. The application does not provide legal determination of guilt.
