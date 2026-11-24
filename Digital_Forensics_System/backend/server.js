/**
 * MAIN BACKEND APPLICATION SERVER
 * Express.js server providing REST APIs, static file hosting, and database initialization.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./database');
const { seedData } = require('../database/seed');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure necessary directories exist
const uploadDir = path.join(__dirname, '../uploads');
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request logging in development
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        if (!req.url.startsWith('/css') && !req.url.startsWith('/js')) {
            const duration = Date.now() - start;
            console.log(`[HTTP] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
        }
    });
    next();
});

// Authentication endpoint for demonstration investigators
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Demonstration credentials
    const validUsers = [
        { username: 'admin', password: 'admin123', name: 'Special Agent Sarah Connor', role: 'Lead Digital Forensic Investigator', badge: 'DF-7701' },
        { username: 'analyst', password: 'forensics2026', name: 'Examiner Alex Mercer', role: 'Senior Forensic Analyst', badge: 'DF-9244' }
    ];

    const matched = validUsers.find(u => u.username === username && u.password === password);
    if (matched) {
        return res.json({
            success: true,
            user: {
                username: matched.username,
                fullName: matched.name,
                role: matched.role,
                badge: matched.badge,
                token: 'demo-jwt-session-' + Date.now()
            }
        });
    }

    res.status(401).json({
        success: false,
        error: 'Invalid demonstration credentials. Try admin / admin123 or analyst / forensics2026.'
    });
});

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        system: 'Digital Forensics & Evidence Correlation System',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

// Serve frontend static assets
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback route for SPA or root
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Initialize database and start server
function startServer() {
    try {
        console.log('[System] Initializing SQLite database and schema...');
        initDatabase();
        seedData();

        const server = app.listen(PORT, () => {
            console.log('================================================================');
            console.log('  INTELLIGENT DIGITAL FORENSICS & EVIDENCE CORRELATION SYSTEM   ');
            console.log('  Using Advanced Data Structures (Academic Lab Edition)         ');
            console.log('================================================================');
            console.log(`  Backend Server running at: http://localhost:${PORT}`);
            console.log(`  Frontend Dashboard:        http://localhost:${PORT}/dashboard.html`);
            console.log(`  Demo Login:                http://localhost:${PORT}/index.html`);
            console.log('  Credentials:               admin / admin123');
            console.log('                             analyst / forensics2026');
            console.log('================================================================');
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                const altPort = Number(PORT) + 1;
                console.warn(`[Warning] Port ${PORT} is in use. Trying alternative port ${altPort}...`);
                app.listen(altPort, () => {
                    console.log(`[Success] Server running at http://localhost:${altPort}`);
                });
            } else {
                console.error('[Error] Server failed to start:', err);
            }
        });

    } catch (err) {
        console.error('[Fatal] Database startup failed:', err);
    }
}

startServer();

module.exports = app;
