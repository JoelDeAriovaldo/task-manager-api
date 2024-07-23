const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'task_manager',
    port: 3308
});

db.connect(err => {
    if (err) {
        console.error('Erro se conectando ao banco de dados:', err);
        return;
    }
    console.log('Banco de dados conectado!');
});

const queryDb = (query, values) => {
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = queryDb;
