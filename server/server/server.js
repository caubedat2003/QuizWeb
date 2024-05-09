const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ origin: "http://localhost:3000" }));

require('dotenv').config();
app.use(express.json());
const dbConfig = require('./config/dbConfig');

const userRoute = require('./routes/userRoute');
const examsRoute = require('./routes/examsRoute');
const reportsRoute = require('./routes/reportsRoute');
app.use('/api/users', userRoute);
app.use('/api/exams', examsRoute);
app.use('/api/reports', reportsRoute);

const port = process.env.PORT || 3001;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // If you need to allow credentials (cookies, authentication)
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        // Respond to preflight requests
        res.sendStatus(200);
    } else {
        // Pass control to the next middleware
        next();
    }
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});