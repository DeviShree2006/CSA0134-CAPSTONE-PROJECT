/**
 * DATABASE ABSTRACTION LAYER (SQLite)
 * Uses Node.js native DatabaseSync (node:sqlite)
 * Zero external C++ native build dependencies, ultra-fast and reliable.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, '../database/evidence.db');
const SCHEMA_PATH = path.join(__dirname, '../database/schema.sql');

let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        // Ensure database directory exists
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        dbInstance = new DatabaseSync(DB_PATH);
        dbInstance.exec('PRAGMA journal_mode = WAL;');
        dbInstance.exec('PRAGMA foreign_keys = ON;');
    }
    return dbInstance;
}

/**
 * Execute multiple SQL statements (e.g. schema creation)
 */
function exec(sql) {
    const db = getDatabase();
    return db.exec(sql);
}

/**
 * Run a parameterized query returning all matching rows as plain objects
 */
function query(sql, params = []) {
    const db = getDatabase();
    const stmt = db.prepare(sql);
    const rows = Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
    // Convert null-prototype objects to clean JS objects
    return rows.map(r => ({ ...r }));
}

/**
 * Run a parameterized query returning a single row or null
 */
function get(sql, params = []) {
    const db = getDatabase();
    const stmt = db.prepare(sql);
    const row = Array.isArray(params) ? stmt.get(...params) : stmt.get(params);
    return row ? { ...row } : null;
}

/**
 * Run an INSERT/UPDATE/DELETE statement
 * Returns { changes, lastInsertRowid }
 */
function run(sql, params = []) {
    const db = getDatabase();
    const stmt = db.prepare(sql);
    const result = Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
    return {
        changes: result.changes,
        lastInsertRowid: result.lastInsertRowid
    };
}

/**
 * Initializes database schema if not already initialized
 */
function initDatabase() {
    const db = getDatabase();
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schemaSql);
    return true;
}

/**
 * Resets database completely (Drops all tables and re-seeds)
 */
function resetDatabase() {
    const db = getDatabase();
    const tables = [
        'audit_logs', 'users', 'evidence_relationships', 'investigation_events',
        'email_records', 'file_access_logs', 'login_logs', 'evidence',
        'accounts', 'devices', 'persons', 'cases'
    ];

    for (const table of tables) {
        db.exec(`DROP TABLE IF EXISTS ${table};`);
    }

    initDatabase();
    const { seedData } = require('../database/seed');
    seedData();
    return true;
}

module.exports = {
    getDatabase,
    exec,
    query,
    get,
    run,
    initDatabase,
    resetDatabase,
    DB_PATH
};
