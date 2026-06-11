require('dotenv').config()
const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');
app.use('/auth',authRoutes);

const problemRoutes = require('./routes/problems');
app.use('/problems', problemRoutes);

const submissionRoutes = require('./routes/submissions');
app.use('/submissions',submissionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});