const mysql = require ("mysql2");

// mysql connection setup
const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Teknoblade1326',
    database: 'employee_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log ('Connection successful');
});

module.exports = connection;