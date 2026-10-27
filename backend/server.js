
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Test the backend and database connection
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DATABASE() AS databaseName');

        res.json({
            message: 'Backend connected to MySQL successfully!',
            database: rows[0].databaseName
        });
       } catch (error) {
        console.error('Database connection error:', error.message);

        res.status(500).json({
            message: 'Database connection failed.',
            error: error.message
        });
    }
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

