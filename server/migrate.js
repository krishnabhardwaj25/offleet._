require('dotenv').config();
const pool = require('./db');
const fs = require('fs');

async function migrate() {
    const sql = fs.readFileSync('./schema.sql', 'utf-8');
    await pool.query(sql);
    console.log('migration done');
    pool.end();
}

migrate().catch(console.error);