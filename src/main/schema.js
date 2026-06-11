const db = require('./database');
const {randomUUID} = require('crypto');

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS test_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id INTEGER NOT NULL,
        input TEXT NOT NULL,
        expected_output TEXT NOT NULL,
        is_sample INTEGER DEFAULT 0,
        FOREIGN KEY (problem_id) REFERENCES problems(id)
    );

    CREATE TABLE IF NOT EXISTS submissions (
        local_id TEXT NOT NULL UNIQUE,
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        verdict TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        synced_at TEXT,
          sync_attempts INTEGER DEFAULT 0,
        FOREIGN KEY (problem_id) REFERENCES problems(id)
    );

    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    tokens BLOB
); 

`);
// is later getting used by problemsList.jsx 
function getAllProblems() {
    const result =  db.prepare('SELECT * FROM problems').all();
    console.log('problem',result);
    return result;
}

function getProblemById(id) {
    const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(id);
    if (!problem) {
        throw new Error('Problem not found');
    }
    const testCases = db.prepare('SELECT * FROM test_cases WHERE problem_id = ?').all(id);
    return {...problem, testCases};
} 

function saveSubmission(problem_id, code, verdict) {
    const id = randomUUID();
    const local_id = randomUUID();
    const stmt = db.prepare('INSERT INTO submissions (local_id,problem_id, code, verdict) VALUES (?, ?, ?, ?)');
    const result = stmt.run(local_id,problem_id, code, verdict);
    return result.lastInsertRowid;
}

function getSubmission(){
    return db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
}


module.exports = { db, getAllProblems, getProblemById , saveSubmission,getSubmission};