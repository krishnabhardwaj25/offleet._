require('dotenv').config();
const pool = require('./db');

async function seed() {
    const problems = require('./problems.json');

    for (const p of problems) {
        const result = await pool.query(
            'INSERT INTO problems (title, difficulty, description) VALUES ($1, $2, $3) RETURNING id',
            [p.title, p.difficulty, JSON.stringify(p.description)]
        );
        console.log('inserted problem:', result.rows[0].id);
    }

    // test cases for problem 1
    const testCases = require('./testcases.json');
    for (const tc of testCases) {
        await pool.query(
            'INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES ($1, $2, $3, $4)',
            [tc.problem_id, tc.input, tc.output, tc.is_sample]
        );
    }

    console.log('seeded successfully');
    pool.end();
}

seed().catch(console.error);