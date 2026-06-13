require('dotenv').config();
const pool = require('./db');

async function wipe() {
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM test_cases');
    await pool.query('DELETE FROM problems');
    await pool.query('ALTER SEQUENCE problems_id_seq RESTART WITH 1');
    console.log('wiped');
    pool.end();
}

wipe().catch(console.error);
