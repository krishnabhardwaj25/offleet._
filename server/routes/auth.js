const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/google/exchange', async (req, res) => {
    const { code, code_verifier } = req.body;

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            code_verifier,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const { access_token, refresh_token, id_token } = response.data;
        res.json({ access_token, refresh_token, id_token });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Token exchange failed' });
    }
});

module.exports = router;