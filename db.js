// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'task_manager',
    port: 3308
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        setTimeout(() => {
            db.connect(); // Try to reconnect after 5 seconds
        }, 5000);
        return;
    }
    console.log('Connected to database');
});

module.exports = db;