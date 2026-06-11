const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const problems = await pool.query('SELECT * FROM problems');
        const testCases = await pool.query('SELECT * FROM test_cases');
        
        const result = problems.rows.map(problem => ({
            ...problem,
            testCases: testCases.rows.filter(tc => tc.problem_id === problem.id)
        }));
        
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

module.exports = router;