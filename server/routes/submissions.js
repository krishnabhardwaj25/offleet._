const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/',async (req,res)=>{
    const {local_id,problem_id,code,verdict,created_at} = req.body;
    try{
        await pool.query(
            `INSERT INTO submissions (local_id,problem_id,code,verdict,created_at)
             VALUES ($1,$2,$3,$4,$5)
             ON CONFLICT (local_id) DO NOTHING`,
             [local_id,problem_id,code,verdict,created_at]
        );
        res.json({success:true});
    }
    catch(err){
          console.error(err);
          res.status(500).json('failed to save submission');
    }
})

module.exports = router;