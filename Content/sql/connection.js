const mysql = require ("mysql");

// mysql connection setup
const connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Teknoblade1326',
    database: 'employee_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log ('Connection successful');
});

module.exports = connection;