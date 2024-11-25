const mysql = require('mysql2/promise');

// Create a promise-based connection to the MySQL database
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '', // Update your password if needed
  database: 'file_management',
  waitForConnections: true,
  connectionLimit: 10,  // You can adjust this limit if necessary
  queueLimit: 0
});

module.exports = db;
