require('dotenv').config();
const pool = require('./db');

async function seed() {
    const problems = [
        { title: 'Square Number', difficulty: 'Easy', description: 'Given a number return the square of that number' },
        { title: 'Two Sum', difficulty: 'Easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.' },
        { title: 'Binary Search', difficulty: 'Easy', description: 'Given a sorted array, find the index of a target element.' },
        { title: 'Merge Sort', difficulty: 'Medium', description: 'Sort an array using the merge sort algorithm.' }
    ];

    for (const p of problems) {
        const result = await pool.query(
            'INSERT INTO problems (title, difficulty, description) VALUES ($1, $2, $3) RETURNING id',
            [p.title, p.difficulty, p.description]
        );
        console.log('inserted problem:', result.rows[0].id);
    }

    // test cases for problem 1
    const testCases = [
        { problem_id: 1, input: '6\n', expected_output: '36\n', is_sample: 1 },
        { problem_id: 1, input: '3\n', expected_output: '9\n', is_sample: 0 },
        { problem_id: 1, input: '10\n', expected_output: '100\n', is_sample: 0 },
    ];

    for (const tc of testCases) {
        await pool.query(
            'INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES ($1, $2, $3, $4)',
            [tc.problem_id, tc.input, tc.expected_output, tc.is_sample]
        );
    }

    console.log('seeded successfully');
    pool.end();
}

seed().catch(console.error);